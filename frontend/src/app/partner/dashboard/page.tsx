'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  InsightsCard,
  ProductPerformanceCard,
  RecommendationTiersCard,
  RevenueCard,
  StatsCard,
} from '../../../components/partner/AnalyticsCards';
import {
  AdvancedChart,
  EnhancedMetricCard,
  ComparisonChart,
  TrendAnalysis,
  RealTimeMetrics
} from '../../../components/partner/analytics/AdvancedCharts';
import MobileAnalytics from '../../../components/partner/mobile/MobileAnalytics';
import PartnerLayout from '../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../context/AuthContext';
import usePartnerAnalytics from '../../../hooks/usePartnerAnalytics';

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

function QuickActionCard({ title, description, icon, color, onClick }: QuickActionProps) {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg w-full text-left ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs opacity-80">{description}</p>
    </button>
  );
}

interface PerformanceMetricProps {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

function PerformanceMetric({ label, value, change, changeType, icon }: PerformanceMetricProps) {
  const changeColors = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

export default function PartnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Mock partner ID - in production this would come from user context
  const partnerId = '64a123456789012345678902';

  const {
    analytics,
    revenueData,
    loading: analyticsLoading,
    error: analyticsError,
    refreshData,
  } = usePartnerAnalytics(partnerId);

  // Sample data for enhanced analytics
  const revenueChartData = [
    { name: 'Jan', value: 4500 },
    { name: 'Feb', value: 5200 },
    { name: 'Mar', value: 4800 },
    { name: 'Apr', value: 6100 },
    { name: 'May', value: 5900 },
    { name: 'Jun', value: 7200 },
  ];

  const productPerformanceData = [
    { name: 'Motoröl', value: 35 },
    { name: 'Bremsenreiniger', value: 28 },
    { name: 'Kühlmittel', value: 22 },
    { name: 'Luftfilter', value: 15 },
  ];

  const comparisonData = [
    { name: 'Clicks', current: 1250, previous: 980 },
    { name: 'Views', current: 5670, previous: 4200 },
    { name: 'Sales', current: 89, previous: 67 },
    { name: 'Revenue', current: 2340, previous: 1890 },
  ];

  const trendData = [
    { date: '1.6', revenue: 2100, clicks: 340, views: 1200 },
    { date: '2.6', revenue: 2300, clicks: 380, views: 1350 },
    { date: '3.6', revenue: 2150, clicks: 360, views: 1280 },
    { date: '4.6', revenue: 2600, clicks: 420, views: 1480 },
    { date: '5.6', revenue: 2800, clicks: 450, views: 1620 },
    { date: '6.6', revenue: 3100, clicks: 510, views: 1750 },
    { date: '7.6', revenue: 2950, clicks: 480, views: 1680 },
  ];

  const miniTrendData = [
    { name: '1', value: 20 },
    { name: '2', value: 45 },
    { name: '3', value: 35 },
    { name: '4', value: 60 },
    { name: '5', value: 55 },
  ];

  const realTimeData = {
    activeUsers: 47,
    recentClicks: 23,
    currentRevenue: 1250,
    conversionRate: 3.8,
  };

  // Mobile analytics data
  const mobileAnalyticsData = {
    metrics: {
      totalRevenue: analytics?.overview.monthlyRevenue || 2340,
      totalViews: analytics?.overview.totalViews || 15670,
      totalClicks: analytics?.overview.totalClicks || 1250,
      conversionRate: analytics?.overview.averageConversionRate || 3.8,
      growth: {
        revenue: 12.5,
        views: 8.2,
        clicks: -2.1,
        conversion: 0.3,
      },
    },
    chartData: {
      revenue: revenueChartData.map((item, index) => ({
        date: item.name,
        value: item.value,
      })),
      engagement: trendData.map(item => ({
        date: item.date,
        views: item.views,
        clicks: item.clicks,
      })),
      products: productPerformanceData.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index % 4],
      })),
    },
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/partner/login');
      return;
    }
    if (user.role !== 'partner' && user.userType !== 'partner') {
      router.push('/partner/login');
      return;
    }
    setDashboardLoading(false);
  }, [user, loading, router]);

  if (loading || dashboardLoading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  const quickActions = [
    {
      title: 'Upload Products',
      description: 'Add new products via CSV',
      icon: '📤',
      color: 'blue',
      onClick: () => router.push('/partner/dashboard/products/upload')
    },
    {
      title: 'View Analytics',
      description: 'Detailed performance data',
      icon: '📊',
      color: 'green',
      onClick: () => router.push('/partner/dashboard/analytics')
    },
    {
      title: 'Export Reports',
      description: 'Download business reports',
      icon: '📋',
      color: 'purple',
      onClick: () => router.push('/partner/dashboard/analytics/exports')
    },
    {
      title: 'Upgrade Plan',
      description: 'Unlock more features',
      icon: '⚡',
      color: 'yellow',
      onClick: () => router.push('/partner/billing')
    }
  ];

  return (
    <PartnerLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-blue-100 mb-4">
                Here's what's happening with your products today
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  System Status: All Good
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  2 New Notifications
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Last sync: 5 min ago
                </div>
              </div>
            </div>
            <button
              onClick={refreshData}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Error State */}
        {analyticsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 mb-1">Analytics Error</h3>
                <p className="text-sm text-red-600">{analyticsError}</p>
                <button 
                  onClick={refreshData}
                  className="mt-3 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Loading State */}
        {analyticsLoading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        )}

        {/* Dashboard Content */}
        {analytics && !analyticsLoading && (
          <>
            {/* Mobile Analytics - Only visible on mobile */}
            <div className="lg:hidden">
              <MobileAnalytics data={mobileAnalyticsData} />
            </div>

            {/* Desktop Analytics - Hidden on mobile */}
            <div className="hidden lg:block">
              {/* Key Performance Metrics */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Performance Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <PerformanceMetric
                    label="Total Products"
                    value={analytics.overview.totalProducts.toString()}
                    change="+12% vs last month"
                    changeType="positive"
                    icon="📦"
                  />
                  <PerformanceMetric
                    label="Total Views"
                    value={analytics.overview.totalViews.toLocaleString()}
                    change="+8.2% vs last month"
                    changeType="positive"
                    icon="👁️"
                  />
                  <PerformanceMetric
                    label="Total Clicks"
                    value={analytics.overview.totalClicks.toLocaleString()}
                    change="-2.1% vs last month"
                    changeType="negative"
                    icon="👆"
                  />
                  <PerformanceMetric
                    label="Conversion Rate"
                    value={`${analytics.overview.averageConversionRate.toFixed(1)}%`}
                    change="No change"
                    changeType="neutral"
                    icon="🎯"
                  />
                </div>
              </div>

            {/* Revenue Overview */}
            {revenueData && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RevenueCard
                      title="Monthly Revenue"
                      amount={analytics.overview.monthlyRevenue}
                      subtitle="Current month performance"
                      trend={{ value: 12.5, period: 'vs last month' }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">Commission Earned</h3>
                      <p className="text-2xl font-bold text-emerald-600">
                        €{revenueData.revenueByProduct.reduce((sum, p) => sum + p.commission, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">5% commission rate</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">Top Category</h3>
                      <p className="text-lg font-bold text-blue-600">
                        {revenueData.revenueByCategory[0]?.category || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        €{(revenueData.revenueByCategory[0]?.revenue || 0).toLocaleString()} revenue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductPerformanceCard
                products={analytics.performance.topPerformingProducts}
              />
              <RecommendationTiersCard
                tiers={analytics.recommendations.recommendationsByTier}
                totalRecommendations={analytics.recommendations.totalRecommendations}
                avgScore={analytics.recommendations.avgScore}
              />
            </div>

            {/* Market Insights */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <InsightsCard
                  title="Most Searched Problems"
                  data={analytics.insights.mostSearchedProblems.map((p) => ({
                    name: p.problem,
                    value: p.count,
                    label: 'searches',
                  }))}
                  color="blue"
                />
                <InsightsCard
                  title="Top Vehicle Brands"
                  data={analytics.insights.topVehicleBrands.map((b) => ({
                    name: b.brand,
                    value: b.count,
                    label: 'requests',
                  }))}
                  color="green"
                />
                <InsightsCard
                  title="Seasonal Trends"
                  data={analytics.insights.seasonalTrends.map((s) => ({
                    name: s.season,
                    value: s.popularity,
                    label: '%',
                  }))}
                  color="purple"
                />
              </div>
            </div>

            {/* Recent Activity Table */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  View all activity →
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clicks
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.performance.recentActivity.map((day, index) => {
                        const conversionRate = day.views > 0 ? (day.clicks / day.views) * 100 : 0;
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {day.views.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {day.clicks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              €{day.revenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                conversionRate > 5 ? 'bg-emerald-100 text-emerald-800' :
                                conversionRate > 2 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {conversionRate.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Enhanced Analytics Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Enhanced Analytics</h2>
              
              {/* Real-time Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Real-time Metrics</h3>
                <RealTimeMetrics data={realTimeData} />
              </div>

              {/* Enhanced Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <EnhancedMetricCard
                  title="Monthly Revenue"
                  value={`€${analytics.overview.monthlyRevenue.toLocaleString()}`}
                  change={{ value: 12.5, period: 'vs last month', type: 'increase' }}
                  icon="💰"
                  trend={miniTrendData}
                  color="green"
                />
                <EnhancedMetricCard
                  title="Product Views"
                  value={analytics.overview.totalViews.toLocaleString()}
                  change={{ value: 8.2, period: 'vs last month', type: 'increase' }}
                  icon="👁️"
                  trend={miniTrendData}
                  color="blue"
                />
                <EnhancedMetricCard
                  title="Click Rate"
                  value={`${analytics.overview.averageConversionRate.toFixed(1)}%`}
                  change={{ value: 2.1, period: 'vs last month', type: 'decrease' }}
                  icon="👆"
                  trend={miniTrendData}
                  color="purple"
                />
                <EnhancedMetricCard
                  title="Active Products"
                  value={analytics.overview.totalProducts.toString()}
                  change={{ value: 5.5, period: 'vs last month', type: 'increase' }}
                  icon="📦"
                  trend={miniTrendData}
                  color="yellow"
                />
              </div>

              {/* Advanced Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AdvancedChart
                  data={revenueChartData}
                  title="Monthly Revenue Trend"
                  type="area"
                  height={350}
                  colorScheme="success"
                />
                <AdvancedChart
                  data={productPerformanceData}
                  title="Top Product Categories"
                  type="pie"
                  height={350}
                  colorScheme="primary"
                />
              </div>

              {/* Comparison and Trend Analysis */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ComparisonChart
                  data={comparisonData}
                  title="Performance Comparison (This Month vs Last Month)"
                  height={300}
                />
                <TrendAnalysis
                  data={trendData}
                  title="7-Day Performance Trends"
                  height={300}
                />
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </PartnerLayout>
  );
}
