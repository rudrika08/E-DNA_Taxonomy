import React, { useState, useEffect } from 'react';
import { Navigation } from './components/layout/Navigation';
import { DashboardStats } from './components/dashboard/DashboardStats';
import { RecentSamples } from './components/dashboard/RecentSamples';
import { SampleUploadForm } from './components/upload/SampleUploadForm';
import { AnalysisResults } from './components/analysis/AnalysisResults';
import { ComparativeAnalysis } from './components/analysis/ComparativeAnalysis';
import { TaxonomyTree } from './components/taxonomy/TaxonomyTree';
import { StatusMonitor } from './components/status/StatusMonitor';
import { Card } from './components/common/Card';
import { Button } from './components/common/Button';
import { ErrorMessage } from './components/common/ErrorMessage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { useApi } from './hooks/useApi';
import { 
  Beaker, 
  Database, 
  TrendingUp, 
  Waves,
  Search,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [healthStatus, setHealthStatus] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSamples: 156,
      completedAnalysis: 142,
      processing: 8,
      speciesIdentified: 2847,
    },
    recentSamples: []
  });
  
  const [analysisData, setAnalysisData] = useState({
    selectedSampleId: '',
    results: null,
  });

  const [taxonomyData, setTaxonomyData] = useState(null);

  const {
    loading,
    error,
    uploadSample,
    getSampleStatus,
    getSampleResults,
    getComparativeAnalysis,
    getTaxonomyTree,
    checkHealth,
  } = useApi();

  // Check API health on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const health = await checkHealth();
        setHealthStatus(health);
      } catch (err) {
        console.error('Health check failed:', err);
      }
    };

    initializeApp();
  }, [checkHealth]);

  // Load taxonomy data when taxonomy page is visited
  useEffect(() => {
    if (currentPage === 'taxonomy' && !taxonomyData) {
      loadTaxonomyData();
    }
  }, [currentPage]);

  const loadTaxonomyData = async () => {
    try {
      const data = await getTaxonomyTree();
      setTaxonomyData(data);
    } catch (err) {
      console.error('Failed to load taxonomy data:', err);
    }
  };

  const handleSampleUpload = async (formData) => {
    const result = await uploadSample(formData);
    // Refresh dashboard data after successful upload
    setDashboardData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalSamples: prev.stats.totalSamples + 1,
      }
    }));
    return result;
  };

  const handleGetSampleResults = async () => {
    if (!analysisData.selectedSampleId.trim()) return;

    try {
      const results = await getSampleResults(analysisData.selectedSampleId.trim());
      setAnalysisData(prev => ({ ...prev, results }));
    } catch (err) {
      console.error('Failed to get sample results:', err);
      setAnalysisData(prev => ({ ...prev, results: null }));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Deep-Sea eDNA Dashboard</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Monitor and analyze environmental DNA samples from deep-sea environments. 
                Discover biodiversity patterns and novel species in our oceans.
              </p>
            </div>

            <DashboardStats stats={dashboardData.stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentSamples samples={dashboardData.recentSamples} />
              
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setCurrentPage('upload')}
                    variant="outline"
                    className="h-20 flex-col"
                    icon={Beaker}
                  >
                    Upload Sample
                  </Button>
                  <Button
                    onClick={() => setCurrentPage('analysis')}
                    variant="outline"
                    className="h-20 flex-col"
                    icon={BarChart3}
                  >
                    View Analysis
                  </Button>
                  <Button
                    onClick={() => setCurrentPage('status')}
                    variant="outline"
                    className="h-20 flex-col"
                    icon={Search}
                  >
                    Check Status
                  </Button>
                  <Button
                    onClick={() => setCurrentPage('taxonomy')}
                    variant="outline"
                    className="h-20 flex-col"
                    icon={Database}
                  >
                    Browse Taxonomy
                  </Button>
                </div>
              </Card>
            </div>

            {/* Ocean-themed stats section */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ocean Biodiversity Insights</h3>
                  <p className="text-blue-100">
                    Exploring the hidden diversity of our deep-sea ecosystems
                  </p>
                </div>
                <Waves className="w-16 h-16 text-blue-200" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2,847</div>
                  <div className="text-blue-100">Species Catalogued</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">15.2%</div>
                  <div className="text-blue-100">Novel Taxa Discovery Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4,200m</div>
                  <div className="text-blue-100">Max Sample Depth</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <SampleUploadForm
            onUpload={handleSampleUpload}
            loading={loading}
            error={error}
          />
        );

      case 'analysis':
        return (
          <div className="space-y-8">
            {/* Sample Results Section */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Analysis Results</h2>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={analysisData.selectedSampleId}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, selectedSampleId: e.target.value }))}
                    placeholder="Enter sample ID to view results"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleGetSampleResults}
                  loading={loading}
                  disabled={!analysisData.selectedSampleId.trim()}
                >
                  Get Results
                </Button>
              </div>
              
              <ErrorMessage error={error} />
              
              {analysisData.results && (
                <AnalysisResults results={analysisData.results} />
              )}
            </Card>

            {/* Comparative Analysis Section */}
            <ComparativeAnalysis
              onAnalyze={getComparativeAnalysis}
              loading={loading}
              error={error}
            />
          </div>
        );

      case 'taxonomy':
        return (
          <TaxonomyTree
            taxonomyData={taxonomyData}
            loading={loading}
            error={error}
            onRefresh={loadTaxonomyData}
          />
        );

      case 'status':
        return (
          <StatusMonitor
            onCheckStatus={getSampleStatus}
            loading={loading}
          />
        );

      default:
        return (
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">The requested page could not be found.</p>
            <Button
              onClick={() => setCurrentPage('dashboard')}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Health Status Bar */}
      {healthStatus && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-2">
          <div className="flex items-center justify-center text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>System Status: Healthy - Connected to backend API</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Deep-Sea eDNA Biodiversity Assessment System. All rights reserved.</p>
            <p className="mt-2">Advancing our understanding of ocean biodiversity through environmental DNA analysis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;