import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { 
  ChevronRight, 
  ChevronDown, 
  TreePine, 
  Search,
  Filter
} from 'lucide-react';

export const TaxonomyTree = ({ taxonomyData, loading, error, onRefresh }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (taxonomyData?.taxonomy) {
      setFilteredData(taxonomyData.taxonomy);
    }
  }, [taxonomyData]);

  useEffect(() => {
    if (!taxonomyData?.taxonomy) return;

    if (searchTerm.trim() === '') {
      setFilteredData(taxonomyData.taxonomy);
    } else {
      const filtered = taxonomyData.taxonomy.filter(node =>
        node.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.rank?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, taxonomyData]);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const buildTreeStructure = (nodes) => {
    const nodeMap = new Map();
    const roots = [];

    // Create node map
    nodes.forEach(node => {
      nodeMap.set(node.node_id, { ...node, children: [] });
    });

    // Build tree structure
    nodes.forEach(node => {
      if (node.parent_id && nodeMap.has(node.parent_id)) {
        nodeMap.get(node.parent_id).children.push(nodeMap.get(node.node_id));
      } else {
        roots.push(nodeMap.get(node.node_id));
      }
    });

    return roots;
  };

  const renderTreeNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.node_id);
    
    const rankColors = {
      kingdom: 'bg-purple-100 text-purple-800',
      phylum: 'bg-blue-100 text-blue-800',
      class: 'bg-green-100 text-green-800',
      order: 'bg-yellow-100 text-yellow-800',
      family: 'bg-orange-100 text-orange-800',
      genus: 'bg-red-100 text-red-800',
      species: 'bg-gray-100 text-gray-800',
    };

    return (
      <div key={node.node_id} className="select-none">
        <div
          className={`
            flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer
            ${depth > 0 ? 'border-l-2 border-gray-200' : ''}
          `}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => hasChildren && toggleNode(node.node_id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 mr-2" />
            )
          ) : (
            <div className="w-4 h-4 mr-2" />
          )}
          
          <TreePine className="w-4 h-4 text-gray-400 mr-2" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 truncate">
                {node.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${rankColors[node.rank] || 'bg-gray-100 text-gray-800'}`}>
                {node.rank}
              </span>
            </div>
            {node.attributes && (
              <div className="text-xs text-gray-500 mt-1">
                {Object.entries(node.attributes).slice(0, 3).map(([key, value]) => (
                  <span key={key} className="mr-3">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Loading taxonomy tree...</p>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center">
          <TreePine className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Taxonomy Tree</h2>
          <p className="text-gray-600">
            Explore the taxonomic classification hierarchy
          </p>
        </div>
      </Card>

      <ErrorMessage error={error} onRetry={onRefresh} className="mb-6" />

      {/* Search and Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search taxonomy..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Collapse All
            </button>
            <button
              onClick={() => {
                const allNodes = new Set();
                const addNodes = (nodes) => {
                  nodes.forEach(node => {
                    allNodes.add(node.node_id);
                    if (node.children) addNodes(node.children);
                  });
                };
                if (filteredData) {
                  addNodes(buildTreeStructure(filteredData));
                  setExpandedNodes(allNodes);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Expand All
            </button>
          </div>
        </div>
      </Card>

      {/* Tree Display */}
      <Card padding="sm">
        {filteredData && filteredData.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {buildTreeStructure(filteredData).map(root => renderTreeNode(root))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TreePine className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No taxonomy data available</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-3 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md transition-colors"
              >
                Load Taxonomy Data
              </button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};