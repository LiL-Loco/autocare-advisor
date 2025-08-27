'use client';

import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Euro,
  Eye,
  Maximize2,
  Minimize2,
  MousePointer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRef, useState } from 'react';
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
import { MobileCard, TouchButton } from './MobileOptimized';

interface MobileAnalyticsProps {
  data: {
    metrics: {
      totalRevenue: number;
      totalViews: number;
      totalClicks: number;
      conversionRate: number;
      growth: {
        revenue: number;
        views: number;
        clicks: number;
        conversion: number;
      };
    };
    chartData: {
      revenue: Array<{ date: string; value: number }>;
      engagement: Array<{ date: string; views: number; clicks: number }>;
      products: Array<{ name: string; value: number; color: string }>;
    };
  };
}

export default function MobileAnalytics({ data }: MobileAnalyticsProps) {
  const [activeChart, setActiveChart] = useState<
    'revenue' | 'engagement' | 'products'
  >('revenue');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const charts = ['revenue', 'engagement', 'products'] as const;
    const currentIndex = charts.indexOf(activeChart);

    if (isLeftSwipe && currentIndex < charts.length - 1) {
      setActiveChart(charts[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      setActiveChart(charts[currentIndex - 1]);
    }
  };

  const formatNumber = (num: number, prefix = '') => {
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K`;
    return `${prefix}${num}`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Mobile Metrics Cards - Horizontal Scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4 min-w-max px-4">
          <MetricCard
            icon={<Euro className="h-5 w-5 text-emerald-600" />}
            title="Revenue"
            value={formatNumber(data.metrics.totalRevenue, '€')}
            growth={data.metrics.growth.revenue}
            color="emerald"
          />
          <MetricCard
            icon={<Eye className="h-5 w-5 text-blue-600" />}
            title="Views"
            value={formatNumber(data.metrics.totalViews)}
            growth={data.metrics.growth.views}
            color="blue"
          />
          <MetricCard
            icon={<MousePointer className="h-5 w-5 text-purple-600" />}
            title="Clicks"
            value={formatNumber(data.metrics.totalClicks)}
            growth={data.metrics.growth.clicks}
            color="purple"
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
            title="Conversion"
            value={`${data.metrics.conversionRate.toFixed(1)}%`}
            growth={data.metrics.growth.conversion}
            color="yellow"
          />
        </div>
      </div>

      {/* Chart Section */}
      <MobileCard className="relative" padding="sm">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            <Badge variant="secondary" className="text-xs">
              Swipe to navigate
            </Badge>
          </div>
          <TouchButton
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon={
              isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )
            }
          >
            {isFullscreen ? 'Exit' : 'Expand'}
          </TouchButton>
        </div>

        {/* Chart Navigation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <TouchButton
            variant="outline"
            size="sm"
            onClick={() => {
              const charts = ['revenue', 'engagement', 'products'] as const;
              const currentIndex = charts.indexOf(activeChart);
              if (currentIndex > 0) setActiveChart(charts[currentIndex - 1]);
            }}
            disabled={activeChart === 'revenue'}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </TouchButton>

          <div className="flex space-x-1">
            {['revenue', 'engagement', 'products'].map((chart, index) => (
              <button
                key={chart}
                onClick={() => setActiveChart(chart as any)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeChart === chart ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <TouchButton
            variant="outline"
            size="sm"
            onClick={() => {
              const charts = ['revenue', 'engagement', 'products'] as const;
              const currentIndex = charts.indexOf(activeChart);
              if (currentIndex < charts.length - 1)
                setActiveChart(charts[currentIndex + 1]);
            }}
            disabled={activeChart === 'products'}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </TouchButton>
        </div>

        {/* Chart Container with Touch Support */}
        <div
          className={`transition-all duration-300 ${
            isFullscreen ? 'h-96' : 'h-64'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'revenue' ? (
              <AreaChart data={data.chartData.revenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : activeChart === 'engagement' ? (
              <LineChart data={data.chartData.engagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Views"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Clicks"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={data.chartData.products}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent?: number;
                  }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                >
                  {data.chartData.products.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Labels */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-900">
            {activeChart === 'revenue' && 'Revenue Trend (30 Days)'}
            {activeChart === 'engagement' && 'Engagement Metrics (30 Days)'}
            {activeChart === 'products' && 'Product Performance Distribution'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {activeChart === 'revenue' &&
              'Daily revenue performance over the last month'}
            {activeChart === 'engagement' &&
              'Views and clicks comparison over time'}
            {activeChart === 'products' && 'Top performing product categories'}
          </p>
        </div>
      </MobileCard>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  growth: number;
  color: 'emerald' | 'blue' | 'purple' | 'yellow';
}

function MetricCard({ icon, title, value, growth, color }: MetricCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <div className="w-3 h-3" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 bg-green-50';
    if (growth < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm min-w-[160px] hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-3`}>
        <div className="flex items-center justify-between">
          <span className="text-2xl opacity-80">{icon}</span>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(
              growth
            )}`}
          >
            <div className="flex items-center space-x-1">
              {getGrowthIcon(growth)}
              <span>
                {growth > 0 ? '+' : ''}
                {growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">vs last month</p>
      </div>
    </div>
  );
}
