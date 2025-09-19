import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { Upload, CheckCircle } from 'lucide-react';

export const SampleUploadForm = ({ onUpload, loading, error }) => {
  const [formData, setFormData] = useState({
    file: null,
    collectionDate: '',
    latitude: '',
    longitude: '',
    depth: '',
    temperature: '',
    salinity: '',
    collectionMethod: '',
    projectId: '',
    notes: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (file) => {
    setFormData({ ...formData, file });
    setUploadSuccess(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      return;
    }

    const metadata = {
      collection_date: formData.collectionDate,
      location: {
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        depth: parseFloat(formData.depth) || 0,
      },
      environmental_data: {
        temperature: parseFloat(formData.temperature) || null,
        salinity: parseFloat(formData.salinity) || null,
      },
      collection_method: formData.collectionMethod,
      project_id: formData.projectId,
      notes: formData.notes,
    };

    const uploadData = new FormData();
    uploadData.append('file', formData.file);
    uploadData.append('metadata', JSON.stringify(metadata));

    try {
      await onUpload(uploadData);
      setUploadSuccess(true);
      setFormData({
        file: null,
        collectionDate: '',
        latitude: '',
        longitude: '',
        depth: '',
        temperature: '',
        salinity: '',
        collectionMethod: '',
        projectId: '',
        notes: '',
      });
    } catch (err) {
      setUploadSuccess(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload eDNA Sample</h2>
        <p className="text-gray-600">
          Upload your environmental DNA sample for biodiversity analysis
        </p>
      </div>

      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">Sample uploaded successfully!</span>
          </div>
        </div>
      )}

      <ErrorMessage error={error} className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample File
          </label>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : formData.file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".fasta,.fastq,.fa,.fq,.txt,.csv"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {formData.file ? (
              <div className="text-green-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{formData.file.name}</p>
                <p className="text-sm text-gray-500">
                  {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Drop your file here, or click to browse</p>
                <p className="text-sm">Supports FASTA, FASTQ, CSV files</p>
              </div>
            )}
          </div>
        </div>

        {/* Sample Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Date
            </label>
            <input
              type="datetime-local"
              value={formData.collectionDate}
              onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project ID
            </label>
            <input
              type="text"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              placeholder="e.g., DEEP-2024-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Location Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="e.g., 45.123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="e.g., -75.456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depth (m)
            </label>
            <input
              type="number"
              value={formData.depth}
              onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
              placeholder="e.g., 1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Environmental Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              placeholder="e.g., 4.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salinity (PSU)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
              placeholder="e.g., 35.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Collection Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collection Method
          </label>
          <select
            value={formData.collectionMethod}
            onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select collection method</option>
            <option value="water_sample">Water Sample</option>
            <option value="sediment_core">Sediment Core</option>
            <option value="plankton_net">Plankton Net</option>
            <option value="filtration">Filtration</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about the sample..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!formData.file}
          className="w-full"
        >
          Upload Sample
        </Button>
      </form>
    </Card>
  );
};