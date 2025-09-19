const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/v1/health`,
  SAMPLES: {
    UPLOAD: `${API_BASE_URL}/api/v1/samples/upload`,
    STATUS: (sampleId) => `${API_BASE_URL}/api/v1/samples/${sampleId}/status`,
    RESULTS: (sampleId) => `${API_BASE_URL}/api/v1/samples/${sampleId}/results`,
  },
  ANALYSIS: {
    COMPARATIVE: `${API_BASE_URL}/api/v1/analysis/comparative`,
  },
  TAXONOMY: {
    TREE: `${API_BASE_URL}/api/v1/taxonomy/tree`,
  },
};

export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};