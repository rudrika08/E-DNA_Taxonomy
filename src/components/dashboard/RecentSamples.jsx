
import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Clock, MapPin, User, Upload } from 'lucide-react';

export const RecentSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/v1/samples/get_all');
        const data = await response.json();
        if (data.samples) {
          setSamples(data.samples);
        } else {
          setSamples([]);
        }
      } catch (err) {
        setError('Failed to fetch samples');
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  const statusColors = {
    uploaded: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Samples</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Loading samples...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <Upload className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p>{error}</p>
        </div>
      ) : samples.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No samples uploaded yet</p>
        </div>
      ) : (
        samples.map((sample) => (
          <div key={sample.sample_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-medium text-gray-900 truncate">
                  {sample.filename}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sample.status]}`}>
                  {sample.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(sample.created_at)}</span>
                </div>
                {sample.metadata && (
                  <>
                    {sample.metadata.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {sample.metadata.location.latitude?.toFixed(2)}°, 
                          {sample.metadata.location.longitude?.toFixed(2)}°
                        </span>
                      </div>
                    )}
                    {sample.metadata.project_id && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{sample.metadata.project_id}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4">
              View Details
            </button>
          </div>
        ))
      )}
    </Card>
  );
};