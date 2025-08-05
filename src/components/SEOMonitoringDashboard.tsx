// SEO Monitoring Dashboard Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Search, Globe, Zap, BarChart3 } from 'lucide-react';
import SEOMonitoringAgents from '../utils/seoMonitoringAgents';
import type { RankingData, SchemaValidationResult, PerformanceMetrics } from '../utils/seoMonitoringAgents';

interface MonitoringDashboardProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface DashboardData {
  summary: {
    totalKeywords: number;
    averagePosition: number;
    schemaErrors: number;
    averageMobileScore: number;
  };
  rankings: {
    topPerforming: RankingData[];
    needsImprovement: RankingData[];
    trending: Array<{
      keyword: string;
      currentPosition: number;
      previousPosition: number;
      trend: 'up' | 'down';
    }>;
  };
  schema: {
    validPages: number;
    totalErrors: number;
    mostCommonIssues: string[];
  };
  performance: {
    passedCoreWebVitals: number;
    averageScores: {
      mobile: number;
      desktop: number;
    };
    slowestPages: PerformanceMetrics[];
  };
}

export const SEOMonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutes
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rankings' | 'schema' | 'performance'>('overview');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate loading monitoring data
      const keywords = [
        'colorectal cancer screening singapore',
        'blood test colorectal cancer',
        'colon cancer test india',
        'bowel cancer screening australia'
      ];

      const urls = [
        'https://colonaive.com/seo/singapore-colorectal-screening',
        'https://colonaive.com/seo/australia-bowel-cancer-screening',
        'https://colonaive.com/seo/india-colorectal-screening',
        'https://colonaive.com/seo/philippines-colorectal-screening',
        'https://colonaive.com/seo/japan-colorectal-screening'
      ];

      // Execute monitoring agents
      const [rankings, schemas, performance] = await Promise.all([
        SEOMonitoringAgents.executeRankMonitoring(keywords),
        SEOMonitoringAgents.executeSchemaValidation(urls),
        SEOMonitoringAgents.executePerformanceMonitoring(urls)
      ]);

      // Generate dashboard data
      const data = SEOMonitoringAgents.generateMonitoringDashboard(rankings, schemas, performance);
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatPosition = (position: number) => {
    if (position <= 3) return { text: `#${position}`, color: 'text-green-600 bg-green-50' };
    if (position <= 10) return { text: `#${position}`, color: 'text-blue-600 bg-blue-50' };
    if (position <= 20) return { text: `#${position}`, color: 'text-yellow-600 bg-yellow-50' };
    return { text: `#${position}`, color: 'text-red-600 bg-red-50' };
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <Container>
        <div className="py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container>
        <div className="py-16 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Monitoring Data</h2>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Monitoring Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Last updated: {lastUpdated?.toLocaleString()}
              </p>
            </div>
            <Button onClick={loadDashboardData} className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Keywords Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.totalKeywords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Position</p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{dashboardData.summary.averagePosition.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Schema Errors</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.schemaErrors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mobile Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.averageMobileScore.toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'rankings', label: 'Rankings' },
              { key: 'schema', label: 'Schema' },
              { key: 'performance', label: 'Performance' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performing Keywords */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Top Performing Keywords
                </h3>
                <div className="space-y-3">
                  {dashboardData.rankings.topPerforming.slice(0, 5).map((ranking, index) => {
                    const positionFormat = formatPosition(ranking.position);
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{ranking.keyword}</p>
                          <p className="text-sm text-gray-500">{ranking.region}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${positionFormat.color}`}>
                          {positionFormat.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Schema Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Globe className="h-5 w-5 text-purple-500 mr-2" />
                  Schema Validation Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Pages</span>
                    <span className="font-semibold text-green-600">{dashboardData.schema.validPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Errors</span>
                    <span className="font-semibold text-red-600">{dashboardData.schema.totalErrors}</span>
                  </div>
                  {dashboardData.schema.mostCommonIssues.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Common Issues:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {dashboardData.schema.mostCommonIssues.slice(0, 3).map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Keyword Rankings Trends</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keyword
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Region
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.rankings.trending.map((trend, index) => {
                        const positionFormat = formatPosition(trend.currentPosition);
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {trend.keyword}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Region
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${positionFormat.color}`}>
                                {positionFormat.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {getTrendIcon(trend.trend)}
                                <span className="ml-1">
                                  {trend.previousPosition - trend.currentPosition} positions
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Core Web Vitals Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardData.performance.passedCoreWebVitals}
                    </div>
                    <p className="text-sm text-gray-600">Pages Passing CWV</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardData.performance.averageScores.mobile.toFixed(0)}
                    </div>
                    <p className="text-sm text-gray-600">Avg Mobile Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {dashboardData.performance.averageScores.desktop.toFixed(0)}
                    </div>
                    <p className="text-sm text-gray-600">Avg Desktop Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
};

export default SEOMonitoringDashboard;