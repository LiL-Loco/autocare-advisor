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
import { useAuth } from '../../../context/AuthContext';
import usePartnerAnalytics from '../../../hooks/usePartnerAnalytics';

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

  useEffect(() => {
    console.log('Dashboard useEffect - user:', user, 'loading:', loading);

    // Don't do anything while still loading
    if (loading) {
      console.log('Still loading, waiting...');
      return;
    }

    if (!user) {
      console.log('No user, redirecting to partner login');
      router.push('/partner/login');
      return;
    }

    if (user.role !== 'partner' && user.userType !== 'partner') {
      console.log(
        'User not partner, redirecting to partner login. Role:',
        user.role,
        'UserType:',
        user.userType
      );
      router.push('/partner/login');
      return;
    }

    if (user.role === 'partner' || user.userType === 'partner') {
      console.log('Partner user found, loading dashboard');
      setDashboardLoading(false);
    }
  }, [user, loading, router]);

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Partner Dashboard
              </h1>
              <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                Professional Tier
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/partner/billing')}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Billing
              </button>
              <button
                onClick={refreshData}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <span className="text-sm text-gray-500">
                Welcome back, {user?.firstName}!
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  router.push('/');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Loading State */}
          {analyticsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics data...</p>
            </div>
          )}

          {/* Error State */}
          {analyticsError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    Failed to load analytics data: {analyticsError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {analytics && !analyticsLoading && (
            <>
              {/* Overview Stats */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    title="Total Products"
                    value={analytics.overview.totalProducts}
                    subtitle={`${analytics.overview.activeProducts} active`}
                    icon={<span>📦</span>}
                    color="blue"
                  />
                  <StatsCard
                    title="Total Views"
                    value={analytics.overview.totalViews}
                    subtitle="All time"
                    icon={<span>👁</span>}
                    color="green"
                  />
                  <StatsCard
                    title="Total Clicks"
                    value={analytics.overview.totalClicks}
                    subtitle={`${analytics.overview.averageConversionRate}% conversion`}
                    icon={<span>👆</span>}
                    color="purple"
                  />
                  <RevenueCard
                    title="Monthly Revenue"
                    amount={analytics.overview.monthlyRevenue}
                    subtitle="Estimated"
                    trend={{ value: 12.5, period: 'vs last month' }}
                  />
                </div>
              </div>

              {/* Performance Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ProductPerformanceCard
                  products={analytics.performance.topPerformingProducts}
                />
                <RecommendationTiersCard
                  tiers={analytics.recommendations.recommendationsByTier}
                  totalRecommendations={
                    analytics.recommendations.totalRecommendations
                  }
                  avgScore={analytics.recommendations.avgScore}
                />
              </div>

              {/* Revenue Details */}
              {revenueData && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue Analytics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RevenueCard
                      title="Total Revenue"
                      amount={revenueData.totalRevenue}
                      subtitle="All time"
                    />
                    <RevenueCard
                      title="Monthly Revenue"
                      amount={revenueData.monthlyRevenue}
                      subtitle="Average"
                    />
                    <StatsCard
                      title="Top Category"
                      value={
                        revenueData.revenueByCategory[0]?.category || 'N/A'
                      }
                      subtitle={formatCurrency(
                        revenueData.revenueByCategory[0]?.revenue || 0
                      )}
                      icon={<span>🏆</span>}
                      color="yellow"
                    />
                    <StatsCard
                      title="Commission Earned"
                      value={formatCurrency(
                        revenueData.revenueByProduct.reduce(
                          (sum, p) => sum + p.commission,
                          0
                        )
                      )}
                      subtitle="5% rate"
                      icon={<span>💰</span>}
                      color="green"
                    />
                  </div>
                </div>
              )}

              {/* Insights Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Market Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              {/* Recent Activity */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity (Last 7 Days)
                </h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clicks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.performance.recentActivity.map(
                        (day, index) => {
                          const conversionRate =
                            day.views > 0 ? (day.clicks / day.views) * 100 : 0;
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(day.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.views}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.clicks}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(day.revenue)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {conversionRate.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-8">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium">
                  View Detailed Reports
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium">
                  Export Analytics
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium">
                  Upgrade Tier
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
