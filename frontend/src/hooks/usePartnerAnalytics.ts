/**
 * Partner Analytics Hook - AutoCare Advisor
 *
 * Custom React Hook für Partner Analytics API Integration
 */

import { useCallback, useEffect, useState } from 'react';

interface PartnerOverview {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalClicks: number;
  averageConversionRate: number;
  monthlyRevenue: number;
}

interface ProductPerformance {
  productId: string;
  name: string;
  views: number;
  clicks: number;
  conversionRate: number;
  revenue: number;
}

interface RecentActivity {
  date: string;
  views: number;
  clicks: number;
  revenue: number;
}

interface PartnerAnalytics {
  overview: PartnerOverview;
  performance: {
    topPerformingProducts: ProductPerformance[];
    recentActivity: RecentActivity[];
  };
  recommendations: {
    totalRecommendations: number;
    recommendationsByTier: {
      perfect: number;
      excellent: number;
      good: number;
      acceptable: number;
    };
    avgScore: number;
  };
  insights: {
    mostSearchedProblems: Array<{ problem: string; count: number }>;
    topVehicleBrands: Array<{ brand: string; count: number }>;
    seasonalTrends: Array<{ season: string; popularity: number }>;
  };
}

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueByProduct: Array<{
    productId: string;
    name: string;
    revenue: number;
    commission: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    productCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    clicks: number;
    conversionRate: number;
  }>;
}

const usePartnerAnalytics = (partnerId: string) => {
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5001/api/partners/analytics/overview/${partnerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // In production, add Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching partner analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  const fetchRevenueData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/partners/analytics/revenue/${partnerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }

      const data = await response.json();

      if (data.success) {
        setRevenueData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch revenue data');
      }
    } catch (err) {
      console.error('Error fetching revenue data:', err);
    }
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      fetchAnalytics();
      fetchRevenueData();
    }
  }, [partnerId, fetchAnalytics, fetchRevenueData]);

  const refreshData = useCallback(() => {
    fetchAnalytics();
    fetchRevenueData();
  }, [fetchAnalytics, fetchRevenueData]);

  return {
    analytics,
    revenueData,
    loading,
    error,
    refreshData,
  };
};

export default usePartnerAnalytics;
