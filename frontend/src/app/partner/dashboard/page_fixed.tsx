'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Eye,
  MousePointer,
  Package2,
  Plus,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PartnerLayout from '../../../components/partner/layout/PartnerLayout';
import MobileAnalytics from '../../../components/partner/mobile/MobileAnalytics';
import { useAuth } from '../../../context/AuthContext';
import usePartnerAnalytics from '../../../hooks/usePartnerAnalytics';

interface PerformanceMetricProps {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function PerformanceMetric({
  label,
  value,
  change,
  changeType,
  icon,
}: PerformanceMetricProps) {
  const getChangeStyles = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-800 bg-green-100';
      case 'negative':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-muted-foreground">{icon}</div>
          <Badge variant="secondary" className={getChangeStyles(changeType)}>
            {change}
          </Badge>
        </div>
        <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function PartnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const {
    analytics: apiAnalytics,
    revenueData: apiRevenueData,
    loading: analyticsLoading,
    error: analyticsError,
    refreshData,
  } = usePartnerAnalytics(user?.id || '');

  // Mock data für Dashboard fallback
  const mockAnalytics = {
    overview: {
      totalProducts: 25,
      activeProducts: 20,
      totalViews: 15420,
      totalClicks: 1240,
      averageConversionRate: 8.0,
      monthlyRevenue: 2450,
    },
    performance: {
      topPerformingProducts: [
        {
          productId: '1',
          name: 'Motoröl Premium',
          views: 2400,
          clicks: 180,
          conversionRate: 7.5,
          revenue: 450,
        },
        {
          productId: '2',
          name: 'Bremsflüssigkeit DOT 4',
          views: 1800,
          clicks: 160,
          conversionRate: 8.9,
          revenue: 380,
        },
        {
          productId: '3',
          name: 'Kühlmittel Konzentrat',
          views: 1500,
          clicks: 120,
          conversionRate: 8.0,
          revenue: 320,
        },
      ],
      recentActivity: [
        { date: '2024-08-29', views: 420, clicks: 35, revenue: 85 },
        { date: '2024-08-28', views: 380, clicks: 28, revenue: 72 },
        { date: '2024-08-27', views: 450, clicks: 38, revenue: 95 },
        { date: '2024-08-26', views: 320, clicks: 25, revenue: 68 },
        { date: '2024-08-25', views: 510, clicks: 42, revenue: 105 },
      ],
    },
    recommendations: {
      totalRecommendations: 1840,
      recommendationsByTier: {
        perfect: 350,
        excellent: 620,
        good: 580,
        acceptable: 290,
      },
      avgScore: 7.2,
    },
    insights: {
      mostSearchedProblems: [
        { problem: 'Motorölwechsel', count: 420 },
        { problem: 'Bremsen quietschen', count: 380 },
        { problem: 'Motor überhitzt', count: 320 },
      ],
      topVehicleBrands: [
        { brand: 'BMW', count: 280 },
        { brand: 'Mercedes', count: 250 },
        { brand: 'VW', count: 420 },
      ],
      seasonalTrends: [
        { season: 'Sommer', popularity: 75 },
        { season: 'Winter', popularity: 85 },
        { season: 'Frühling', popularity: 65 },
        { season: 'Herbst', popularity: 70 },
      ],
    },
  };

  const mockRevenueData = {
    totalRevenue: 2450,
    monthlyRevenue: 2450,
    revenueByProduct: [
      {
        productId: '1',
        name: 'Motoröl Premium',
        revenue: 450,
        commission: 22.5,
      },
      {
        productId: '2',
        name: 'Bremsflüssigkeit DOT 4',
        revenue: 380,
        commission: 19,
      },
      {
        productId: '3',
        name: 'Kühlmittel Konzentrat',
        revenue: 320,
        commission: 16,
      },
    ],
    revenueByCategory: [],
    monthlyTrends: [],
  };

  // Verwende Mock-Daten wenn API-Fehler oder keine Daten
  const analytics = apiAnalytics || mockAnalytics;
  const revenueData = apiRevenueData || mockRevenueData;

  // Mock data for mobile analytics
  const mobileAnalyticsData = {
    metrics: {
      totalRevenue: analytics?.overview.monthlyRevenue || 0,
      totalViews: analytics?.overview.totalViews || 0,
      totalClicks: analytics?.overview.totalClicks || 0,
      conversionRate: analytics?.overview.averageConversionRate || 0,
      growth: {
        revenue: 12.5,
        views: 8.2,
        clicks: -2.1,
        conversion: 0,
      },
    },
    chartData: {
      revenue: [
        { date: 'Jan', value: 2400 },
        { date: 'Feb', value: 1398 },
        { date: 'Mar', value: 9800 },
        { date: 'Apr', value: 3908 },
        { date: 'Mai', value: 4800 },
        { date: 'Jun', value: 3800 },
      ],
      engagement: [
        {
          date: '2024-01',
          views: analytics?.overview.totalViews || 0,
          clicks: analytics?.overview.totalClicks || 0,
        },
        {
          date: '2024-02',
          views: (analytics?.overview.totalViews || 0) * 0.8,
          clicks: (analytics?.overview.totalClicks || 0) * 0.9,
        },
        {
          date: '2024-03',
          views: (analytics?.overview.totalViews || 0) * 1.2,
          clicks: (analytics?.overview.totalClicks || 0) * 1.1,
        },
      ],
      products: [
        {
          name: 'Aktive Produkte',
          value: analytics?.overview.totalProducts || 0,
          color: '#71717a',
        },
        { name: 'Inaktive Produkte', value: 5, color: '#a1a1aa' },
      ],
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Dashboard wird geladen...
            </p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6 max-w-7xl">
        {/* Shopify-Style Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Dashboard Übersicht
            </h1>
            <p className="text-muted-foreground mt-1">
              Willkommen zurück, {user?.firstName}. Hier ist Ihre aktuelle
              Leistung.
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/partner/dashboard/products/upload')}
          >
            <Plus className="w-4 h-4" />
            Produkt hinzufügen
          </Button>
        </div>

        {/* Shopify-Style Status Banner */}
        {analyticsError ? (
          <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-900 dark:text-red-400 mb-1">
                    Analytics API nicht verfügbar
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Zeige Demo-Daten an. API-Fehler: {analyticsError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Erneut versuchen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-green-800 dark:text-green-300">
                  {apiAnalytics ? 'Live-Daten geladen' : 'Demo-Daten aktiv'} •
                  Letzte Aktualisierung: vor 5 Minuten
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {analyticsLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Daten werden geladen...</p>
            </CardContent>
          </Card>
        )}

        {/* Shopify-Style Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PerformanceMetric
            label="Gesamte Produkte"
            value={analytics.overview.totalProducts.toString()}
            change="+12% vs letzten Monat"
            changeType="positive"
            icon={<Package2 className="w-5 h-5" />}
          />
          <PerformanceMetric
            label="Gesamte Aufrufe"
            value={analytics.overview.totalViews.toLocaleString()}
            change="+8,2% vs letzten Monat"
            changeType="positive"
            icon={<Eye className="w-5 h-5" />}
          />
          <PerformanceMetric
            label="Gesamte Klicks"
            value={analytics.overview.totalClicks.toLocaleString()}
            change="-2,1% vs letzten Monat"
            changeType="negative"
            icon={<MousePointer className="w-5 h-5" />}
          />
          <PerformanceMetric
            label="Conversion Rate"
            value={`${analytics.overview.averageConversionRate.toFixed(1)}%`}
            change="Keine Änderung"
            changeType="neutral"
            icon={<TrendingUpIcon className="w-5 h-5" />}
          />
        </div>

        {/* Shopify-Style Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Umsatzübersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Monatlicher Umsatz
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    +12.5%
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">
                  €{analytics.overview.monthlyRevenue.toLocaleString()}
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Verdiente Provision
                  </span>
                </div>
                <div className="text-xl font-semibold">
                  €
                  {revenueData
                    ? revenueData.revenueByProduct
                        .reduce((sum, p) => sum + p.commission, 0)
                        .toLocaleString()
                    : '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  5% Provisionssatz
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  Kürzliche Aktivität
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/partner/dashboard/analytics')}
                >
                  Alle anzeigen →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Datum
                      </th>
                      <th className="text-right p-3 font-medium text-muted-foreground">
                        Aufrufe
                      </th>
                      <th className="text-right p-3 font-medium text-muted-foreground">
                        Klicks
                      </th>
                      <th className="text-right p-3 font-medium text-muted-foreground">
                        Umsatz
                      </th>
                      <th className="text-right p-3 font-medium text-muted-foreground">
                        Conv. Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.performance.recentActivity.map((day, index) => {
                      const conversionRate =
                        day.views > 0 ? (day.clicks / day.views) * 100 : 0;
                      return (
                        <tr
                          key={`activity-${day.date}-${index}`}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3 font-medium">
                            {new Date(day.date).toLocaleDateString('de-DE')}
                          </td>
                          <td className="p-3 text-right">
                            {day.views.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            {day.clicks.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-medium">
                            €{day.revenue.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <Badge
                              variant={
                                conversionRate > 5
                                  ? 'default'
                                  : conversionRate > 2
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs"
                            >
                              {conversionRate.toFixed(1)}%
                            </Badge>
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

        {/* Mobile Analytics - Only visible on mobile */}
        <div className="lg:hidden">
          <MobileAnalytics data={mobileAnalyticsData} />
        </div>
      </div>
    </PartnerLayout>
  );
}
