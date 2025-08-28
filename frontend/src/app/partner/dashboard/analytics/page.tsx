'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Calendar,
  Download,
  FileBarChart,
  LineChart,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AdvancedChart,
  ComparisonChart,
  EnhancedMetricCard,
  RealTimeMetrics,
  TrendAnalysis,
} from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';
import usePartnerAnalytics from '../../../../hooks/usePartnerAnalytics';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    change: number;
  };
  traffic: {
    views: number;
    clicks: number;
    conversionRate: number;
    trend: 'up' | 'down';
    change: number;
  };
  products: {
    total: number;
    active: number;
    topPerforming: Array<{
      name: string;
      revenue: number;
      views: number;
      conversionRate: number;
    }>;
  };
  customers: {
    total: number;
    newThisMonth: number;
    retentionRate: number;
    lifetimeValue: number;
  };
}

interface ChartData {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down';
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Import usePartnerAnalytics Hook for real data
  const partnerId = user?.id || 'default-partner-id';
  const {
    analytics,
    revenueData,
    loading: analyticsLoading,
    error: analyticsError,
    refreshData,
  } = usePartnerAnalytics(partnerId);

  // Generate chart data from real analytics data
  const revenueChartData: ChartData[] =
    analytics?.performance.recentActivity.map((activity, index) => ({
      name: new Date(activity.date).toLocaleDateString('de-DE', {
        month: 'short',
      }),
      value: activity.revenue,
      trend:
        index > 0 &&
        activity.revenue >
          (analytics.performance.recentActivity[index - 1]?.revenue || 0)
          ? 'up'
          : ('down' as const),
    })) || [
      { name: 'Jan', value: 32000, trend: 'up' as const },
      { name: 'Feb', value: 28000, trend: 'down' as const },
      { name: 'Mär', value: 35000, trend: 'up' as const },
      { name: 'Apr', value: 31000, trend: 'down' as const },
      { name: 'Mai', value: 42000, trend: 'up' as const },
      { name: 'Jun', value: 45678, trend: 'up' as const },
    ];

  const revenueComparisonData = analytics?.performance.recentActivity.map(
    (activity, index) => {
      const previous =
        index > 0 ? analytics.performance.recentActivity[index - 1] : null;
      return {
        name: new Date(activity.date).toLocaleDateString('de-DE', {
          month: 'short',
        }),
        current: activity.revenue,
        previous: previous ? previous.revenue * 0.9 : activity.revenue * 0.85, // Mock previous data
      };
    }
  ) || [
    { name: 'Jan', current: 32000, previous: 28000 },
    { name: 'Feb', current: 28000, previous: 25000 },
    { name: 'Mär', current: 35000, previous: 30000 },
    { name: 'Apr', current: 31000, previous: 27000 },
    { name: 'Mai', current: 42000, previous: 36000 },
    { name: 'Jun', current: 45678, previous: 40000 },
  ];

  const trafficChartData: ChartData[] =
    analytics?.performance.recentActivity.map((activity) => ({
      name: new Date(activity.date).toLocaleDateString('de-DE', {
        weekday: 'short',
      }),
      value: activity.views,
    })) || [
      { name: 'Mon', value: 18000 },
      { name: 'Die', value: 22000 },
      { name: 'Mit', value: 19500 },
      { name: 'Don', value: 25000 },
      { name: 'Fre', value: 28000 },
      { name: 'Sam', value: 21000 },
      { name: 'Son', value: 16500 },
    ];

  const trafficTrendData = analytics?.performance.recentActivity.map(
    (activity) => ({
      date: new Date(activity.date).toLocaleDateString('de-DE'),
      revenue: activity.revenue,
      clicks: activity.clicks,
      views: activity.views,
    })
  ) || [
    { date: '2024-01-15', revenue: 32000, clicks: 18000, views: 45000 },
    { date: '2024-01-16', revenue: 28000, clicks: 22000, views: 48000 },
    { date: '2024-01-17', revenue: 35000, clicks: 19500, views: 51000 },
    { date: '2024-01-18', revenue: 31000, clicks: 25000, views: 46000 },
    { date: '2024-01-19', revenue: 42000, clicks: 28000, views: 55000 },
    { date: '2024-01-20', revenue: 45678, clicks: 21000, views: 49000 },
    { date: '2024-01-21', revenue: 38000, clicks: 16500, views: 44000 },
  ];

  const productCategoryData: ChartData[] = revenueData?.revenueByCategory.map(
    (category) => ({
      name: category.category,
      value: category.productCount,
    })
  ) || [
    { name: 'Motoröle', value: 35 },
    { name: 'Bremsflüssigkeiten', value: 25 },
    { name: 'Kühlmittel', value: 20 },
    { name: 'Additives', value: 15 },
    { name: 'Sonstige', value: 5 },
  ];

  // Transform real analytics data to match component interface
  const transformedData: AnalyticsData | null = analytics
    ? {
        revenue: {
          current: analytics.overview.monthlyRevenue,
          previous: analytics.overview.monthlyRevenue * 0.85, // Mock previous
          trend: 'up' as const,
          change: 19.5,
        },
        traffic: {
          views: analytics.overview.totalViews,
          clicks: analytics.overview.totalClicks,
          conversionRate: analytics.overview.averageConversionRate,
          trend: 'up' as const,
          change: 12.3,
        },
        products: {
          total: analytics.overview.totalProducts,
          active: analytics.overview.activeProducts,
          topPerforming: analytics.performance.topPerformingProducts.map(
            (p) => ({
              name: p.name,
              revenue: p.revenue,
              views: p.views,
              conversionRate: p.conversionRate,
            })
          ),
        },
        customers: {
          total: 1523, // Would need customer data from API
          newThisMonth: 234,
          retentionRate: 87.3,
          lifetimeValue: 2340,
        },
      }
    : null;

  useEffect(() => {
    if (!user) {
      router.push('/partner/login');
      return;
    }
  }, [user, router]);

  const handleRefreshData = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  if (analyticsLoading || loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Auswertungen werden geladen...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Erweiterte Auswertungen
            </h1>
            <p className="text-gray-600 mt-1">
              Umfassende Analyse Ihrer Geschäftsleistung
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
                <SelectItem value="1y">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              {refreshing ? 'Aktualisiere...' : 'Aktualisieren'}
            </Button>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Bericht exportieren
            </Button>
          </div>
        </div>

        {/* Error State */}
        {analyticsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">
                <svg
                  className="h-5 w-5"
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
                <h3 className="text-sm font-medium text-red-800">
                  Analytics Fehler
                </h3>
                <p className="text-sm text-red-700 mt-1">{analyticsError}</p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        {transformedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedMetricCard
              title="Gesamtumsatz"
              value={formatCurrency(transformedData.revenue.current)}
              change={{
                value: transformedData.revenue.change,
                period: 'vs. Vormonat',
                type:
                  transformedData.revenue.trend === 'up'
                    ? 'increase'
                    : 'decrease',
              }}
              trend={revenueChartData}
              color="green"
              icon="Euro"
            />

            <EnhancedMetricCard
              title="Produktaufrufe"
              value={formatNumber(transformedData.traffic.views)}
              change={{
                value: transformedData.traffic.change,
                period: 'vs. Vormonat',
                type:
                  transformedData.traffic.trend === 'up'
                    ? 'increase'
                    : 'decrease',
              }}
              trend={trafficChartData}
              color="blue"
              icon="Eye"
            />

            <EnhancedMetricCard
              title="Konversionsrate"
              value={formatPercentage(transformedData.traffic.conversionRate)}
              change={{
                value: 2.1,
                period: 'vs. Vormonat',
                type: 'increase',
              }}
              color="purple"
              icon="Target"
            />

            <EnhancedMetricCard
              title="Aktive Produkte"
              value={formatNumber(transformedData.products.active)}
              change={{
                value: 5.8,
                period: 'vs. Vormonat',
                type: 'increase',
              }}
              color="yellow"
              icon="Package"
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="revenue">Umsatz</TabsTrigger>
            <TabsTrigger value="products">Produkte</TabsTrigger>
            <TabsTrigger value="customers">Kunden</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Umsatzentwicklung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={revenueChartData}
                    title="Monatlicher Umsatztrend"
                    type="area"
                    height={300}
                    colorScheme="success"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Produktkategorien
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={productCategoryData}
                    title="Umsatzverteilung nach Kategorien"
                    type="pie"
                    height={300}
                    colorScheme="primary"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ComparisonChart
                data={revenueComparisonData}
                title="Leistungsvergleich (Aktueller vs. Vorheriger Zeitraum)"
                height={300}
              />

              <TrendAnalysis
                data={trafficTrendData}
                title="7-Tage Traffic-Trends"
                height={300}
              />
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {transformedData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Aktueller Umsatz
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(transformedData.revenue.current)}
                      </div>
                      <div className="flex items-center mt-2">
                        {transformedData.revenue.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm ${
                            transformedData.revenue.trend === 'up'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transformedData.revenue.change.toFixed(1)}% vs.
                          Vormonat
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Durchschnittlicher Bestellwert
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€ 167,89</div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +3,2% vs. Vormonat
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Provision verdient
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(transformedData.revenue.current * 0.05)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        5% Provisionssatz
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detaillierte Umsatzanalyse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdvancedChart
                      data={revenueChartData}
                      title="Monatlicher Umsatzverlauf"
                      type="line"
                      height={400}
                      colorScheme="success"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      Umsatz-Vergleich (Aktuell vs. Vorperiode)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueComparisonData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="flex space-x-6">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Aktuell
                              </div>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(item.current)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Vorperiode
                              </div>
                              <div className="font-semibold">
                                {formatCurrency(item.previous)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Änderung
                              </div>
                              <div
                                className={`font-semibold ${
                                  item.current > item.previous
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {(
                                  ((item.current - item.previous) /
                                    item.previous) *
                                  100
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {transformedData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Gesamte Produkte
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(transformedData.products.total)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {formatNumber(transformedData.products.active)} aktiv
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Best-Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-semibold">
                        {transformedData.products.topPerforming[0]?.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatCurrency(
                          transformedData.products.topPerforming[0]?.revenue ||
                            0
                        )}{' '}
                        Umsatz
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Ø Konversionsrate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7,8%</div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +1,2% vs. Vormonat
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Produkt-Kategorien Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdvancedChart
                      data={productCategoryData}
                      title="Verteilung nach Kategorien"
                      type="pie"
                      height={300}
                      colorScheme="primary"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top-Performance Produkte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Produkt</th>
                            <th className="text-right py-2">Views</th>
                            <th className="text-right py-2">CTR</th>
                            <th className="text-right py-2">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transformedData.products.topPerforming.map(
                            (product, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 font-medium">
                                  {product.name}
                                </td>
                                <td className="text-right py-3">
                                  {formatNumber(product.views)}
                                </td>
                                <td className="text-right py-3">
                                  {formatPercentage(product.conversionRate)}
                                </td>
                                <td className="text-right py-3 font-medium text-green-600">
                                  {formatCurrency(product.revenue)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            {transformedData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Gesamte Kunden
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(transformedData.customers.total)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Neue Kunden (Monat)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(transformedData.customers.newThisMonth)}
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +12% vs. Vormonat
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Kundenbindungsrate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatPercentage(
                          transformedData.customers.retentionRate
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Wiederkehrende Kunden
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Ø Kundenwert
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          transformedData.customers.lifetimeValue
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Customer Lifetime Value
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Kundenakquisition & -bindung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RealTimeMetrics
                      data={{
                        activeUsers: transformedData.customers.newThisMonth,
                        recentClicks: Math.floor(
                          transformedData.customers.total * 0.65
                        ),
                        currentRevenue: 12.7,
                        conversionRate: 167.89,
                      }}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            {transformedData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Gesamte Aufrufe
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(transformedData.traffic.views)}
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +{transformedData.traffic.change.toFixed(1)}% vs.
                          Vormonat
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Klicks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(transformedData.traffic.clicks)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Produktdetail-Aufrufe
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Click-Through-Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(
                          (transformedData.traffic.clicks /
                            transformedData.traffic.views) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Von Aufrufen zu Klicks
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Wöchentlicher Traffic-Verlauf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdvancedChart
                      data={trafficChartData}
                      title="Tägliche Aufrufe (Letzte 7 Tage)"
                      type="bar"
                      height={300}
                      colorScheme="primary"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Trend-Analyse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficTrendData.slice(0, 5).map((trend, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="font-medium">{trend.date}</div>
                          <div className="flex space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Views</div>
                              <div className="font-semibold">
                                {formatNumber(trend.views)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Clicks
                              </div>
                              <div className="font-semibold">
                                {formatNumber(trend.clicks)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Revenue
                              </div>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(trend.revenue)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/partner/dashboard/analytics/reports')
              }
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Benutzerdefinierten Bericht erstellen
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/partner/dashboard/analytics/exports')
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Daten exportieren
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/partner/dashboard/products/analytics')
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Produkt-Performance analysieren
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
