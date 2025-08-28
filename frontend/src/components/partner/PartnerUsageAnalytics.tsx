'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageStats, useTracking } from '@/services/trackingService';
import {
  Activity,
  AlertTriangle,
  DollarSign,
  Eye,
  MousePointer,
  Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Color palette for charts
const COLORS = {
  primary: '#0088FE',
  secondary: '#00C49F',
  tertiary: '#FFBB28',
  quaternary: '#FF8042',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

interface PartnerUsageAnalyticsProps {
  partnerId?: string;
  className?: string;
}

export default function PartnerUsageAnalytics({
  partnerId,
  className = '',
}: PartnerUsageAnalyticsProps) {
  const [usageData, setUsageData] = useState<UsageStats[]>([]);
  const [currentPeriodData, setCurrentPeriodData] = useState<UsageStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const { getUsageStats } = useTracking();

  // Calculate current period (YYYY-MM format)
  const currentPeriod = new Date().toISOString().substring(0, 7);

  useEffect(() => {
    loadUsageData();
  }, [partnerId, selectedPeriod]);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const stats = await getUsageStats(selectedPeriod || undefined);
      setUsageData(stats);

      // Find current period data
      const currentData = stats.find((s) => s.period === currentPeriod);
      setCurrentPeriodData(currentData || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load usage data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = usageData.map((stat) => ({
    period: stat.period,
    impressions: stat.impressions,
    clicks: stat.clicks,
    conversions: stat.conversions,
    revenue: stat.revenueGenerated,
    ctr: stat.clickThroughRate,
    cr: stat.conversionRate,
  }));

  // Calculate totals
  const totals = usageData.reduce(
    (acc, stat) => ({
      impressions: acc.impressions + stat.impressions,
      clicks: acc.clicks + stat.clicks,
      conversions: acc.conversions + stat.conversions,
      revenue: acc.revenue + stat.revenueGenerated,
    }),
    { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  // Tier information
  const tierInfo = currentPeriodData
    ? {
        tier: currentPeriodData.tier,
        costPerClick: currentPeriodData.costPerClick,
        remainingClicks: currentPeriodData.remainingClicks,
        percentageUsed:
          currentPeriodData.remainingClicks > 0
            ? (currentPeriodData.clicks /
                (currentPeriodData.clicks +
                  currentPeriodData.remainingClicks)) *
              100
            : 100,
      }
    : null;

  // Pie chart data for metric distribution
  const pieData = currentPeriodData
    ? [
        {
          name: 'Impressions',
          value: currentPeriodData.impressions,
          color: COLORS.primary,
        },
        {
          name: 'Clicks',
          value: currentPeriodData.clicks,
          color: COLORS.secondary,
        },
        {
          name: 'Conversions',
          value: currentPeriodData.conversions,
          color: COLORS.success,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load usage analytics: {error}
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsageData}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Tier Information */}
      {tierInfo && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold">
                  Usage Analytics
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Current Period: {currentPeriod} • Plan:{' '}
                  {tierInfo.tier.charAt(0).toUpperCase() +
                    tierInfo.tier.slice(1)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    tierInfo.percentageUsed > 80 ? 'destructive' : 'default'
                  }
                >
                  {tierInfo.remainingClicks} clicks remaining
                </Badge>
                <Badge variant="outline">
                  €{tierInfo.costPerClick.toFixed(2)} per click
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Impressions
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.impressions.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              {currentPeriodData?.impressions.toLocaleString() || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Clicks
            </CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.clicks.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              {currentPeriodData?.clicks.toLocaleString() || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Conversions
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.conversions.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              {currentPeriodData?.conversions.toLocaleString() || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{totals.revenue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">
              €{currentPeriodData?.revenueGenerated.toFixed(2) || '0.00'} this
              month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {currentPeriodData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Click-Through Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {currentPeriodData.clickThroughRate.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      currentPeriodData.clickThroughRate,
                      100
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {currentPeriodData.conversionRate.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      currentPeriodData.conversionRate * 10,
                      100
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Cost Per Click
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                €{currentPeriodData.costPerClick.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {currentPeriodData.tier.charAt(0).toUpperCase() +
                  currentPeriodData.tier.slice(1)}{' '}
                plan rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly performance over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue'
                        ? `€${value.toFixed(2)}`
                        : value.toLocaleString(),
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    name="clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    name="conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metric Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Current Month Distribution
            </CardTitle>
            <p className="text-sm text-gray-600">
              Activity breakdown for {currentPeriod}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue & Cost Analysis</CardTitle>
          <p className="text-sm text-gray-600">
            Monthly revenue generation and click costs
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `€${value.toFixed(2)}`,
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.tertiary}
                  fill={COLORS.tertiary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Usage Warning */}
      {tierInfo && tierInfo.percentageUsed > 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Usage Warning:</strong> You have used{' '}
            {tierInfo.percentageUsed.toFixed(0)}% of your monthly click limit.
            Consider upgrading your plan to avoid service interruption.
            <Button variant="outline" size="sm" className="ml-2">
              Upgrade Plan
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {usageData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Usage Data
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Start getting product recommendations to see your usage analytics
              here. Click tracking will begin automatically when users interact
              with your products.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
