import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Search 
} from 'lucide-react';

export const StatusMonitor = ({ onCheckStatus, loading }) => {
  const [sampleId, setSampleId] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    if (autoRefresh && statusData && statusData.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const newStatus = await onCheckStatus(sampleId);
          setStatusData(newStatus);
          if (newStatus.status !== 'processing') {
            setAutoRefresh(false);
          }
        } catch (error) {
          console.error('Auto refresh failed:', error);
        }
      }, 5000);
      
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    };
  }, [autoRefresh, statusData, sampleId, onCheckStatus]);

  const handleCheckStatus = async () => {
    if (!sampleId.trim()) return;
    
    try {
      const status = await onCheckStatus(sampleId.trim());
      setStatusData(status);
      if (status.status === 'processing') {
        setAutoRefresh(true);
      }
    } catch (error) {
      setStatusData(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'processing':
        return <Clock className="w-8 h-8 text-yellow-500" />;
      case 'uploaded':
        return <Activity className="w-8 h-8 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Activity className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample Status Monitor</h2>
          <p className="text-gray-600">
            Track the processing status of your eDNA samples
          </p>
        </div>
      </Card>

      {/* Search Form */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample ID
            </label>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckStatus()}
                  placeholder="Enter sample ID (e.g., 1a1b2bcb-79cc-49c7-bcb5-c90cbff3e1dc)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handleCheckStatus}
                loading={loading}
                disabled={!sampleId.trim()}
                icon={RefreshCw}
              >
                Check Status
              </Button>
            </div>
          </div>

          {statusData && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  disabled={statusData.status !== 'processing'}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                  Auto-refresh every 5 seconds
                </label>
              </div>
              {autoRefresh && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <LoadingSpinner size="sm" />
                  <span>Auto-refreshing...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Status Display */}
      {statusData && (
        <Card>
          <div className="text-center mb-6">
            {getStatusIcon(statusData.status)}
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Sample Status: {statusData.status.charAt(0).toUpperCase() + statusData.status.slice(1)}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(statusData.status)}`}>
              {statusData.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Sample Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sample ID:</span>
                  <span className="font-mono text-gray-900 break-all">{statusData.sample_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-gray-900">{statusData.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {new Date(statusData.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900">
                    {new Date(statusData.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status-specific information */}
          {statusData.status === 'processing' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Processing in progress</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your sample is currently being analyzed. This typically takes 5-15 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {statusData.status === 'completed' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <h4 className="font-medium text-green-800">Analysis complete</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your sample analysis is ready. You can view the results in the Analysis section.
                  </p>
                </div>
              </div>
            </div>
          )}

          {statusData.status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <h4 className="font-medium text-red-800">Processing error</h4>
                  <p className="text-sm text-red-700 mt-1">
                    There was an error processing your sample. Please try uploading again or contact support.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};