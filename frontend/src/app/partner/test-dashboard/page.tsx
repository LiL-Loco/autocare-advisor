'use client';

import {
  InsightsCard,
  ProductPerformanceCard,
  RecommendationTiersCard,
  RevenueCard,
  StatsCard,
} from '../../../components/partner/AnalyticsCards';

// Mock data for testing
const mockAnalytics = {
  overview: {
    totalProducts: 6,
    activeProducts: 6,
    totalViews: 4161,
    totalClicks: 305,
    monthlyRevenue: 922,
    averageConversionRate: 7.3,
  },
  performance: {
    topPerformingProducts: [
      {
        productId: '1',
        name: 'Premium Engine Oil',
        views: 1250,
        clicks: 89,
        conversionRate: 7.1,
        revenue: 445.5,
      },
      {
        productId: '2',
        name: 'All-Season Tires',
        views: 980,
        clicks: 67,
        conversionRate: 6.8,
        revenue: 335.0,
      },
      {
        productId: '3',
        name: 'Brake Pads Pro',
        views: 756,
        clicks: 51,
        conversionRate: 6.7,
        revenue: 255.0,
      },
    ],
    recentActivity: [
      { date: '2025-08-25', views: 89, clicks: 8, revenue: 45.5 },
      { date: '2025-08-24', views: 95, clicks: 12, revenue: 67.2 },
      { date: '2025-08-23', views: 78, clicks: 6, revenue: 34.1 },
    ],
  },
  recommendations: {
    totalRecommendations: 1247,
    avgScore: 8.2,
    recommendationsByTier: {
      perfect: 456,
      excellent: 623,
      good: 168,
      acceptable: 0,
    },
  },
  insights: {
    mostSearchedProblems: [
      { problem: 'Engine Noise', count: 234 },
      { problem: 'Brake Issues', count: 189 },
      { problem: 'Tire Wear', count: 156 },
    ],
    topVehicleBrands: [
      { brand: 'Volkswagen', count: 345 },
      { brand: 'BMW', count: 278 },
      { brand: 'Mercedes', count: 234 },
    ],
    seasonalTrends: [
      { season: 'Winter', popularity: 85 },
      { season: 'Summer', popularity: 92 },
      { season: 'Spring', popularity: 78 },
    ],
  },
};

const mockRevenueData = {
  totalRevenue: 2847.5,
  monthlyRevenue: 922.0,
  revenueByCategory: [
    { category: 'Engine Care', revenue: 1245.5 },
    { category: 'Tires', revenue: 856.2 },
    { category: 'Brakes', revenue: 745.8 },
  ],
  revenueByProduct: [
    { product: 'Premium Engine Oil', revenue: 445.5, commission: 22.28 },
    { product: 'All-Season Tires', revenue: 335.0, commission: 16.75 },
    { product: 'Brake Pads Pro', revenue: 255.0, commission: 12.75 },
  ],
};

export default function TestDashboard() {
  const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Test Partner Dashboard
              </h1>
              <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                Professional Tier
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Overview Stats */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Products"
                value={mockAnalytics.overview.totalProducts}
                subtitle={`${mockAnalytics.overview.activeProducts} active`}
                icon={<span>📦</span>}
                color="blue"
              />
              <StatsCard
                title="Total Views"
                value={mockAnalytics.overview.totalViews}
                subtitle="All time"
                icon={<span>👁</span>}
                color="green"
              />
              <StatsCard
                title="Total Clicks"
                value={mockAnalytics.overview.totalClicks}
                subtitle={`${mockAnalytics.overview.averageConversionRate}% conversion`}
                icon={<span>👆</span>}
                color="purple"
              />
              <RevenueCard
                title="Monthly Revenue"
                amount={mockAnalytics.overview.monthlyRevenue}
                subtitle="Estimated"
                trend={{ value: 12.5, period: 'vs last month' }}
              />
            </div>
          </div>

          {/* Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProductPerformanceCard
              products={mockAnalytics.performance.topPerformingProducts}
            />
            <RecommendationTiersCard
              tiers={mockAnalytics.recommendations.recommendationsByTier}
              totalRecommendations={
                mockAnalytics.recommendations.totalRecommendations
              }
              avgScore={mockAnalytics.recommendations.avgScore}
            />
          </div>

          {/* Revenue Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <RevenueCard
                title="Total Revenue"
                amount={mockRevenueData.totalRevenue}
                subtitle="All time"
              />
              <RevenueCard
                title="Monthly Revenue"
                amount={mockRevenueData.monthlyRevenue}
                subtitle="Average"
              />
              <StatsCard
                title="Top Category"
                value={mockRevenueData.revenueByCategory[0]?.category || 'N/A'}
                subtitle={formatCurrency(
                  mockRevenueData.revenueByCategory[0]?.revenue || 0
                )}
                icon={<span>🏆</span>}
                color="yellow"
              />
              <StatsCard
                title="Commission Earned"
                value={formatCurrency(
                  mockRevenueData.revenueByProduct.reduce(
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

          {/* Insights Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Market Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InsightsCard
                title="Most Searched Problems"
                data={mockAnalytics.insights.mostSearchedProblems.map((p) => ({
                  name: p.problem,
                  value: p.count,
                  label: 'searches',
                }))}
                color="blue"
              />
              <InsightsCard
                title="Top Vehicle Brands"
                data={mockAnalytics.insights.topVehicleBrands.map((b) => ({
                  name: b.brand,
                  value: b.count,
                  label: 'requests',
                }))}
                color="green"
              />
              <InsightsCard
                title="Seasonal Trends"
                data={mockAnalytics.insights.seasonalTrends.map((s) => ({
                  name: s.season,
                  value: s.popularity,
                  label: '%',
                }))}
                color="purple"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
