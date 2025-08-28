'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
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

// Demo data for testing
const DEMO_USAGE_DATA = [
  {
    period: '2025-08',
    impressions: 2450,
    clicks: 187,
    conversions: 23,
    revenue: 65.45,
    ctr: 7.6,
    cr: 12.3,
  },
  {
    period: '2025-07',
    impressions: 3200,
    clicks: 245,
    conversions: 31,
    revenue: 85.75,
    ctr: 7.7,
    cr: 12.7,
  },
  {
    period: '2025-06',
    impressions: 2890,
    clicks: 201,
    conversions: 19,
    revenue: 70.35,
    ctr: 7.0,
    cr: 9.5,
  },
  {
    period: '2025-05',
    impressions: 1980,
    clicks: 156,
    conversions: 15,
    revenue: 54.6,
    ctr: 7.9,
    cr: 9.6,
  },
];

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  secondary: '#8B5CF6',
};

interface UsageAnalyticsDemoProps {
  className?: string;
}

export default function UsageAnalyticsDemo({
  className = '',
}: UsageAnalyticsDemoProps) {
  const [currentData] = useState(DEMO_USAGE_DATA[0]); // Current month
  const [isLive, setIsLive] = useState(false);

  // Simulate live updates
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // This would be replaced with real API calls
        console.log('Fetching live usage data...');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  // Calculate tier info
  const tierInfo = {
    tier: 'professional',
    costPerClick: 0.35,
    monthlyLimit: 5000,
    remainingClicks: 5000 - currentData.clicks,
    percentageUsed: (currentData.clicks / 5000) * 100,
  };

  // Pie chart data
  const pieData = [
    {
      name: 'Impressions',
      value: currentData.impressions,
      color: COLORS.primary,
    },
    { name: 'Clicks', value: currentData.clicks, color: COLORS.success },
    {
      name: 'Conversions',
      value: currentData.conversions,
      color: COLORS.secondary,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Usage Analytics Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600">
                Real-time Pay-per-Click tracking and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isLive ? 'default' : 'outline'}
                onClick={() => setIsLive(!isLive)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Zap className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
                {isLive ? 'Live' : 'Demo'}
              </Button>
              <Badge variant="outline" className="bg-white">
                Professional Plan
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Impressions
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.impressions.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clicks
            </CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.clicks.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversions
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.conversions}</div>
            <p className="text-xs text-green-600">+21% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{currentData.revenue.toFixed(2)}
            </div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Click-Through Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {currentData.ctr.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(currentData.ctr * 10, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Industry avg: 6.2%</p>
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
              {currentData.cr.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(currentData.cr * 8, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Industry avg: 8.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Plan Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {tierInfo.percentageUsed.toFixed(0)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  tierInfo.percentageUsed > 80 ? 'bg-red-500' : 'bg-purple-600'
                }`}
                style={{ width: `${tierInfo.percentageUsed}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {tierInfo.remainingClicks} clicks remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Trends
            </CardTitle>
            <p className="text-sm text-gray-600">Last 4 months performance</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMO_USAGE_DATA.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metric Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <p className="text-sm text-gray-600">Current month breakdown</p>
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
          <CardTitle>Revenue Analysis</CardTitle>
          <p className="text-sm text-gray-600">
            Monthly revenue from pay-per-click
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_USAGE_DATA.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `€${value.toFixed(2)}`,
                    'Revenue',
                  ]}
                />
                <Bar dataKey="revenue" fill={COLORS.warning} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tier Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Plan & Billing Information</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Professional Plan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">
                Cost per Click
              </p>
              <p className="text-2xl font-bold">€{tierInfo.costPerClick}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Monthly Limit</p>
              <p className="text-2xl font-bold">
                {tierInfo.monthlyLimit.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Clicks Used</p>
              <p className="text-2xl font-bold">{currentData.clicks}</p>
            </div>
          </div>

          {tierInfo.percentageUsed > 75 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You've used {tierInfo.percentageUsed.toFixed(0)}% of your
                monthly click limit. Consider upgrading to Enterprise plan for
                higher limits.
                <Button variant="outline" size="sm" className="ml-2">
                  Upgrade Plan
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Alert>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This dashboard shows sample data. In
          production, this would display real-time usage analytics from the
          Pay-per-Click tracking system. Click "Live" to enable real-time
          updates when authentication is implemented.
        </AlertDescription>
      </Alert>
    </div>
  );
}
