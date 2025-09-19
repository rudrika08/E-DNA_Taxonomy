import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter
} from 'recharts';
import { GitCompare as Compare, Plus, X } from 'lucide-react';

export const ComparativeAnalysis = ({ onAnalyze, loading, error }) => {
  const [selectedSamples, setSelectedSamples] = useState(['']);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleSampleChange = (index, value) => {
    const newSamples = [...selectedSamples];
    newSamples[index] = value;
    setSelectedSamples(newSamples);
  };

  const addSampleField = () => {
    setSelectedSamples([...selectedSamples, '']);
  };

  const removeSampleField = (index) => {
    if (selectedSamples.length > 1) {
      setSelectedSamples(selectedSamples.filter((_, i) => i !== index));
    }
  };

  const handleAnalyze = async () => {
    const validSamples = selectedSamples.filter(id => id.trim());
    if (validSamples.length < 2) {
      return;
    }

    try {
      const results = await onAnalyze(validSamples);
      setAnalysisResults(results);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const renderComparisonCharts = () => {
    if (!analysisResults || !analysisResults.results) return null;

    // Prepare comparison data
    const biodiversityComparison = analysisResults.results.map((result, index) => ({
      sample: `Sample ${index + 1}`,
      species_richness: result.biodiversity_metrics?.species_richness || 0,
      shannon_diversity: result.biodiversity_metrics?.shannon_diversity || 0,
      novel_taxa: result.biodiversity_metrics?.novel_taxa_candidates || 0,
    }));

    const trophicComparison = analysisResults.results.map((result, index) => ({
      sample: `Sample ${index + 1}`,
      primary_producers: (result.ecological_insights?.trophic_levels?.primary_producers || 0) * 100,
      primary_consumers: (result.ecological_insights?.trophic_levels?.primary_consumers || 0) * 100,
      secondary_consumers: (result.ecological_insights?.trophic_levels?.secondary_consumers || 0) * 100,
      decomposers: (result.ecological_insights?.trophic_levels?.decomposers || 0) * 100,
    }));

    return (
      <div className="space-y-6">
        {/* Biodiversity Comparison */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Biodiversity Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={biodiversityComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sample" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="species_richness" fill="#1e40af" name="Species Richness" />
              <Bar dataKey="shannon_diversity" fill="#0d9488" name="Shannon Diversity" />
              <Bar dataKey="novel_taxa" fill="#f97316" name="Novel Taxa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Trophic Level Comparison */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trophic Level Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trophicComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sample" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '']} />
              <Line type="monotone" dataKey="primary_producers" stroke="#10b981" name="Primary Producers" strokeWidth={3} />
              <Line type="monotone" dataKey="primary_consumers" stroke="#3b82f6" name="Primary Consumers" strokeWidth={3} />
              <Line type="monotone" dataKey="secondary_consumers" stroke="#8b5cf6" name="Secondary Consumers" strokeWidth={3} />
              <Line type="monotone" dataKey="decomposers" stroke="#f59e0b" name="Decomposers" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary Statistics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Highest Diversity</h4>
              <p className="text-2xl font-bold text-blue-600">
                Sample {biodiversityComparison.findIndex(s => s.shannon_diversity === Math.max(...biodiversityComparison.map(x => x.shannon_diversity))) + 1}
              </p>
              <p className="text-sm text-blue-700">
                Shannon: {Math.max(...biodiversityComparison.map(x => x.shannon_diversity)).toFixed(2)}
              </p>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-teal-800 mb-2">Most Species</h4>
              <p className="text-2xl font-bold text-teal-600">
                Sample {biodiversityComparison.findIndex(s => s.species_richness === Math.max(...biodiversityComparison.map(x => x.species_richness))) + 1}
              </p>
              <p className="text-sm text-teal-700">
                Count: {Math.max(...biodiversityComparison.map(x => x.species_richness))}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-orange-800 mb-2">Most Novel Taxa</h4>
              <p className="text-2xl font-bold text-orange-600">
                Sample {biodiversityComparison.findIndex(s => s.novel_taxa === Math.max(...biodiversityComparison.map(x => x.novel_taxa))) + 1}
              </p>
              <p className="text-sm text-orange-700">
                Count: {Math.max(...biodiversityComparison.map(x => x.novel_taxa))}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Form */}
      <Card>
        <div className="text-center mb-6">
          <Compare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparative Analysis</h2>
          <p className="text-gray-600">
            Compare biodiversity metrics across multiple samples
          </p>
        </div>

        <ErrorMessage error={error} className="mb-6" />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Sample IDs to Compare
          </label>
          
          {selectedSamples.map((sampleId, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={sampleId}
                onChange={(e) => handleSampleChange(index, e.target.value)}
                placeholder={`Sample ID ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedSamples.length > 1 && (
                <button
                  onClick={() => removeSampleField(index)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex space-x-3">
            <Button
              onClick={addSampleField}
              variant="outline"
              icon={Plus}
              disabled={selectedSamples.length >= 10}
            >
              Add Sample
            </Button>

            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={selectedSamples.filter(id => id.trim()).length < 2}
              className="flex-1"
            >
              Run Comparative Analysis
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Running comparative analysis...</p>
        </Card>
      )}

      {/* Results */}
      {analysisResults && renderComparisonCharts()}
    </div>
  );
};