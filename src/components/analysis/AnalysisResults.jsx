import React from 'react';
import { Card } from '../common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line 
} from 'recharts';

export const AnalysisResults = ({ results }) => {
  if (!results) return null;

  const biodiversityData = [
    { name: 'Species Richness', value: results.biodiversity_metrics?.species_richness || 0 },
    { name: 'Shannon Diversity', value: results.biodiversity_metrics?.shannon_diversity || 0 },
    { name: 'Simpson Diversity', value: results.biodiversity_metrics?.simpson_diversity || 0 },
    { name: 'Novel Taxa', value: results.biodiversity_metrics?.novel_taxa_candidates || 0 },
  ];

  const communityData = results.community_structure?.dominant_groups?.map(group => ({
    name: group.taxon,
    percentage: group.percentage,
  })) || [];

  const trophicData = results.ecological_insights?.trophic_levels ? [
    { name: 'Primary Producers', value: results.ecological_insights.trophic_levels.primary_producers * 100 },
    { name: 'Primary Consumers', value: results.ecological_insights.trophic_levels.primary_consumers * 100 },
    { name: 'Secondary Consumers', value: results.ecological_insights.trophic_levels.secondary_consumers * 100 },
    { name: 'Decomposers', value: results.ecological_insights.trophic_levels.decomposers * 100 },
  ] : [];

  const COLORS = ['#1e40af', '#0d9488', '#f97316', '#7c3aed', '#dc2626'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
          <p className="text-gray-600">
            Sample ID: {results.sample_id}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Processed: {new Date(results.created_at).toLocaleString()}
          </p>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Species Richness</h3>
          <p className="text-3xl font-bold text-blue-600">
            {results.biodiversity_metrics?.species_richness || 0}
          </p>
        </Card>
        
        <Card className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Shannon Diversity</h3>
          <p className="text-3xl font-bold text-teal-600">
            {results.biodiversity_metrics?.shannon_diversity?.toFixed(2) || '0.00'}
          </p>
        </Card>
        
        <Card className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Novel Taxa</h3>
          <p className="text-3xl font-bold text-orange-500">
            {results.biodiversity_metrics?.novel_taxa_candidates || 0}
          </p>
        </Card>
        
        <Card className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Quality Score</h3>
          <p className="text-3xl font-bold text-purple-600">
            {results.sample_analysis?.quality_metrics?.average_quality_score?.toFixed(1) || '0.0'}
          </p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biodiversity Metrics Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Biodiversity Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={biodiversityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Community Structure */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dominant Taxa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={communityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                labelLine={false}
              >
                {communityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trophic Levels */}
      {trophicData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trophic Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trophicData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']} />
              <Bar dataKey="value" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Taxonomic Classifications */}
      {results.taxonomic_classification && results.taxonomic_classification.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Taxonomic Classifications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sequence ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abundance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Novelty Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.taxonomic_classification.slice(0, 10).map((classification, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {classification.sequence_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{classification.predicted_taxonomy?.genus || 'Unknown'}</div>
                        <div className="text-gray-500">{classification.predicted_taxonomy?.family || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (classification.predicted_taxonomy?.confidence_score || 0) > 0.8 
                          ? 'bg-green-100 text-green-800' 
                          : (classification.predicted_taxonomy?.confidence_score || 0) > 0.6
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {((classification.predicted_taxonomy?.confidence_score || 0) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classification.abundance?.read_count?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (classification.novelty_score || 0) > 0.7 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {((classification.novelty_score || 0) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};