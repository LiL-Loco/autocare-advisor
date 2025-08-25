/**
 * Partner Analytics Service - AutoCare Advisor
 *
 * Bietet umfassende Analytics für B2B Partner Dashboard
 * Inkl. Product Performance, Revenue Tracking, Empfehlungs-Statistiken
 */

import mongoose from 'mongoose';
import Product from '../models/Product';
import logger from '../utils/logger';

interface PartnerAnalytics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    totalViews: number;
    totalClicks: number;
    averageConversionRate: number;
    monthlyRevenue: number;
  };
  performance: {
    topPerformingProducts: Array<{
      productId: string;
      name: string;
      views: number;
      clicks: number;
      conversionRate: number;
      revenue: number;
    }>;
    recentActivity: Array<{
      date: string;
      views: number;
      clicks: number;
      revenue: number;
    }>;
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
    trendsLast30Days: Array<{
      date: string;
      recommendations: number;
      avgScore: number;
    }>;
  };
  insights: {
    mostSearchedProblems: Array<{ problem: string; count: number }>;
    topVehicleBrands: Array<{ brand: string; count: number }>;
    seasonalTrends: Array<{ season: string; popularity: number }>;
  };
}

interface ProductPerformanceMetrics {
  productId: string;
  name: string;
  brand: string;
  category: string;
  metrics: {
    views: number;
    clicks: number;
    conversionRate: number;
    avgScore: number;
    recommendationCount: number;
    revenue: number;
  };
  trends: {
    viewsGrowth: number; // % change last 30 days
    clicksGrowth: number;
    revenueGrowth: number;
  };
  recommendations: {
    last30Days: number;
    tierDistribution: {
      perfect: number;
      excellent: number;
      good: number;
      acceptable: number;
    };
  };
}

interface RevenueAnalytics {
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

export class PartnerAnalyticsService {
  /**
   * Comprehensive partner analytics dashboard data
   */
  async getPartnerAnalytics(partnerId: string): Promise<PartnerAnalytics> {
    try {
      logger.info('Fetching partner analytics', { partnerId });

      const partnerObjectId = new mongoose.Types.ObjectId(partnerId);

      // Get all partner products
      const products = await Product.find({
        partnerId: partnerObjectId,
        isActive: true,
      }).lean();

      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.inStock).length;

      // Calculate overview metrics
      const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
      const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
      const averageConversionRate =
        totalViews > 0
          ? Math.round((totalClicks / totalViews) * 100 * 100) / 100
          : 0;

      // Estimated revenue (simplified calculation)
      const estimatedRevenue = products.reduce((sum, p) => {
        return sum + p.clickCount * p.price * (p.conversionRate / 100);
      }, 0);

      // Top performing products
      const topPerformingProducts = products
        .sort((a, b) => b.clickCount - a.clickCount)
        .slice(0, 5)
        .map((p) => ({
          productId: p._id.toString(),
          name: p.name,
          views: p.viewCount,
          clicks: p.clickCount,
          conversionRate: p.conversionRate,
          revenue: p.clickCount * p.price * (p.conversionRate / 100),
        }));

      // Generate mock recent activity (last 7 days)
      const recentActivity = this.generateMockRecentActivity();

      // Mock recommendation stats (would integrate with actual recommendation tracking)
      const recommendationStats = this.generateMockRecommendationStats();

      // Generate insights
      const insights = this.generateMockInsights();

      const analytics: PartnerAnalytics = {
        overview: {
          totalProducts,
          activeProducts,
          totalViews,
          totalClicks,
          averageConversionRate,
          monthlyRevenue: Math.round(estimatedRevenue),
        },
        performance: {
          topPerformingProducts,
          recentActivity,
        },
        recommendations: recommendationStats,
        insights,
      };

      logger.info('Partner analytics fetched successfully', {
        partnerId,
        totalProducts,
        totalViews,
        totalClicks,
      });

      return analytics;
    } catch (error: any) {
      logger.error('Failed to fetch partner analytics', {
        error: error.message,
        partnerId,
      });
      throw new Error(`Failed to get partner analytics: ${error.message}`);
    }
  }

  /**
   * Detailed product performance metrics
   */
  async getProductPerformanceMetrics(
    partnerId: string
  ): Promise<ProductPerformanceMetrics[]> {
    try {
      const partnerObjectId = new mongoose.Types.ObjectId(partnerId);

      const products = await Product.find({
        partnerId: partnerObjectId,
        isActive: true,
      }).lean();

      const metrics: ProductPerformanceMetrics[] = products.map((product) => ({
        productId: product._id.toString(),
        name: product.name,
        brand: product.brand,
        category: product.category,
        metrics: {
          views: product.viewCount,
          clicks: product.clickCount,
          conversionRate: product.conversionRate,
          avgScore: 0, // Would be calculated from actual recommendation data
          recommendationCount: 0, // Would be from recommendation tracking
          revenue:
            product.clickCount * product.price * (product.conversionRate / 100),
        },
        trends: {
          viewsGrowth: Math.random() * 20 - 10, // Mock data
          clicksGrowth: Math.random() * 30 - 15,
          revenueGrowth: Math.random() * 25 - 12.5,
        },
        recommendations: {
          last30Days: Math.floor(Math.random() * 100),
          tierDistribution: {
            perfect: Math.floor(Math.random() * 20),
            excellent: Math.floor(Math.random() * 30),
            good: Math.floor(Math.random() * 40),
            acceptable: Math.floor(Math.random() * 50),
          },
        },
      }));

      return metrics.sort((a, b) => b.metrics.clicks - a.metrics.clicks);
    } catch (error: any) {
      logger.error('Failed to fetch product performance metrics', {
        error: error.message,
        partnerId,
      });
      throw new Error(`Failed to get product metrics: ${error.message}`);
    }
  }

  /**
   * Revenue analytics and commission tracking
   */
  async getRevenueAnalytics(partnerId: string): Promise<RevenueAnalytics> {
    try {
      const partnerObjectId = new mongoose.Types.ObjectId(partnerId);

      const products = await Product.find({
        partnerId: partnerObjectId,
        isActive: true,
      }).lean();

      const totalRevenue = products.reduce((sum, p) => {
        return sum + p.clickCount * p.price * (p.conversionRate / 100);
      }, 0);

      const revenueByProduct = products
        .map((p) => {
          const revenue = p.clickCount * p.price * (p.conversionRate / 100);
          return {
            productId: p._id.toString(),
            name: p.name,
            revenue: Math.round(revenue),
            commission: Math.round(revenue * 0.05), // 5% commission
          };
        })
        .sort((a, b) => b.revenue - a.revenue);

      const categoryMap = new Map<string, { revenue: number; count: number }>();
      products.forEach((p) => {
        const revenue = p.clickCount * p.price * (p.conversionRate / 100);
        const existing = categoryMap.get(p.category) || {
          revenue: 0,
          count: 0,
        };
        categoryMap.set(p.category, {
          revenue: existing.revenue + revenue,
          count: existing.count + 1,
        });
      });

      const revenueByCategory = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          revenue: Math.round(data.revenue),
          productCount: data.count,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      // Generate mock monthly trends (last 6 months)
      const monthlyTrends = this.generateMockMonthlyTrends();

      return {
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(totalRevenue / 12), // Simplified monthly estimate
        revenueByProduct,
        revenueByCategory,
        monthlyTrends,
      };
    } catch (error: any) {
      logger.error('Failed to fetch revenue analytics', {
        error: error.message,
        partnerId,
      });
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }

  /**
   * Partner tier recommendations based on performance
   */
  async getTierRecommendations(partnerId: string): Promise<{
    currentTier: string;
    recommendedTier: string;
    benefits: string[];
    requirements: string[];
  }> {
    try {
      const analytics = await this.getPartnerAnalytics(partnerId);

      let recommendedTier = 'basic';
      let benefits: string[] = [];
      let requirements: string[] = [];

      if (analytics.overview.monthlyRevenue > 5000) {
        recommendedTier = 'enterprise';
        benefits = [
          'Niedrigste Provisionsrate (2%)',
          'Priorität-Support',
          'Erweiterte Analytics',
          'Custom Integration API',
          'Premium Produktplatzierung',
        ];
        requirements = [
          'Mindestens €5000 monatlicher Umsatz',
          '10+ aktive Produkte',
          'Conversion Rate > 5%',
        ];
      } else if (analytics.overview.monthlyRevenue > 1000) {
        recommendedTier = 'professional';
        benefits = [
          'Reduzierte Provisionsrate (3%)',
          'Erweiterte Dashboard-Features',
          'Bulk-Produktupload',
          'A/B Testing Tools',
        ];
        requirements = [
          'Mindestens €1000 monatlicher Umsatz',
          '5+ aktive Produkte',
          'Conversion Rate > 3%',
        ];
      } else {
        benefits = ['Basis-Dashboard', 'Standard-Support', '5% Provisionsrate'];
        requirements = [
          'Mindestens 1 aktives Produkt',
          'Vollständiges Unternehmensprofil',
        ];
      }

      return {
        currentTier: 'basic', // Would be stored in partner profile
        recommendedTier,
        benefits,
        requirements,
      };
    } catch (error: any) {
      logger.error('Failed to get tier recommendations', {
        error: error.message,
        partnerId,
      });
      throw new Error(`Failed to get tier recommendations: ${error.message}`);
    }
  }

  // Helper methods for mock data generation
  private generateMockRecentActivity() {
    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      activity.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200 + 50),
        clicks: Math.floor(Math.random() * 50 + 10),
        revenue: Math.floor(Math.random() * 500 + 100),
      });
    }
    return activity;
  }

  private generateMockRecommendationStats() {
    return {
      totalRecommendations: Math.floor(Math.random() * 1000 + 500),
      recommendationsByTier: {
        perfect: Math.floor(Math.random() * 50 + 10),
        excellent: Math.floor(Math.random() * 100 + 50),
        good: Math.floor(Math.random() * 150 + 100),
        acceptable: Math.floor(Math.random() * 200 + 150),
      },
      avgScore: Math.round((Math.random() * 20 + 70) * 10) / 10,
      trendsLast30Days: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          recommendations: Math.floor(Math.random() * 50 + 10),
          avgScore: Math.round((Math.random() * 20 + 70) * 10) / 10,
        };
      }),
    };
  }

  private generateMockInsights() {
    return {
      mostSearchedProblems: [
        { problem: 'Wasserflecken', count: 245 },
        { problem: 'Kratzer', count: 198 },
        { problem: 'Verwitterung', count: 167 },
        { problem: 'Verschmutzung', count: 134 },
        { problem: 'Oxidation', count: 89 },
      ],
      topVehicleBrands: [
        { brand: 'BMW', count: 156 },
        { brand: 'Mercedes', count: 134 },
        { brand: 'Audi', count: 112 },
        { brand: 'VW', count: 98 },
        { brand: 'Ford', count: 76 },
      ],
      seasonalTrends: [
        { season: 'Sommer', popularity: 85 },
        { season: 'Frühling', popularity: 72 },
        { season: 'Herbst', popularity: 64 },
        { season: 'Winter', popularity: 43 },
      ],
    };
  }

  private generateMockMonthlyTrends() {
    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    for (const month of months) {
      trends.push({
        month,
        revenue: Math.floor(Math.random() * 2000 + 800),
        clicks: Math.floor(Math.random() * 500 + 200),
        conversionRate: Math.round((Math.random() * 5 + 3) * 100) / 100,
      });
    }

    return trends;
  }
}

export default new PartnerAnalyticsService();
