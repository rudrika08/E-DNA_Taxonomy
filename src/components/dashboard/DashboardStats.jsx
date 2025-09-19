import React from 'react';
import { Card } from '../common/Card';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  BarChart3 
} from 'lucide-react';

export const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Samples',
      value: stats?.totalSamples || 0,
      icon: Upload,
      color: 'blue',
      change: stats?.samplesChange || '+12%',
    },
    {
      title: 'Completed Analysis',
      value: stats?.completedAnalysis || 0,
      icon: CheckCircle,
      color: 'green',
      change: stats?.completedChange || '+8%',
    },
    {
      title: 'Processing',
      value: stats?.processing || 0,
      icon: Clock,
      color: 'orange',
      change: stats?.processingChange || '-2%',
    },
    {
      title: 'Species Identified',
      value: stats?.speciesIdentified || 0,
      icon: BarChart3,
      color: 'purple',
      change: stats?.speciesChange || '+24%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-500 text-blue-50',
          green: 'bg-green-500 text-green-50',
          orange: 'bg-orange-500 text-orange-50',
          purple: 'bg-purple-500 text-purple-50',
        };

        return (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};