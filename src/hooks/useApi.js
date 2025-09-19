import { useState, useCallback } from 'react';
import { apiRequest } from '../config/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(url, options);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const uploadSample = useCallback(async (formData) => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.SAMPLES.UPLOAD, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }, [request]);

  const getSampleStatus = useCallback(async (sampleId) => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.SAMPLES.STATUS(sampleId));
  }, [request]);

  const getSampleResults = useCallback(async (sampleId) => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.SAMPLES.RESULTS(sampleId));
  }, [request]);

  const getComparativeAnalysis = useCallback(async (sampleIds) => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.ANALYSIS.COMPARATIVE, {
      method: 'POST',
      body: JSON.stringify({ sample_ids: sampleIds }),
    });
  }, [request]);

  const getTaxonomyTree = useCallback(async () => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.TAXONOMY.TREE);
  }, [request]);

  const checkHealth = useCallback(async () => {
    const { API_ENDPOINTS } = await import('../config/api');
    return request(API_ENDPOINTS.HEALTH);
  }, [request]);

  return {
    loading,
    error,
    uploadSample,
    getSampleStatus,
    getSampleResults,
    getComparativeAnalysis,
    getTaxonomyTree,
    checkHealth,
  };
};