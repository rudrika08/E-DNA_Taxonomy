import React from 'react';
import { X, Clock, MapPin, User, Thermometer, Droplet, FileText } from 'lucide-react';

export const SampleDetailsModal = ({ sample, onClose }) => {
  if (!sample) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColors = {
    uploaded: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Sample Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Sample ID</h3>
                <p className="text-base font-medium text-gray-900">{sample.sample_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[sample.status]}`}>
                  {sample.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-gray-500">{formatDate(sample.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Last Updated</p>
                    <p className="text-gray-500">{formatDate(sample.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            {sample.metadata?.location && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Latitude</p>
                    <p className="mt-1">{sample.metadata.location.latitude}°</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Longitude</p>
                    <p className="mt-1">{sample.metadata.location.longitude}°</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Depth</p>
                    <p className="mt-1">{sample.metadata.location.depth}m</p>
                  </div>
                </div>
              </div>
            )}

            {/* Environmental Data */}
            {sample.metadata?.environmental_data && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Environmental Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Temperature</p>
                      <p className="mt-1">{sample.metadata.environmental_data.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salinity</p>
                      <p className="mt-1">{sample.metadata.environmental_data.salinity} PSU</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Project Info */}
            {sample.metadata?.project_id && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Project Information</h3>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Project ID</p>
                    <p className="mt-1">{sample.metadata.project_id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {sample.metadata?.notes && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{sample.metadata.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};