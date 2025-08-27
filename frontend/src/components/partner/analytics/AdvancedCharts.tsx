'use client';

import {
  Area,
  AreaChart,
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

// Color palettes for charts
const colors = {
  primary: ['#3B82F6', '#1D4ED8', '#1E3A8A'],
  success: ['#10B981', '#047857', '#064E3B'],
  warning: ['#F59E0B', '#D97706', '#92400E'],
  error: ['#EF4444', '#DC2626', '#991B1B'],
  purple: ['#8B5CF6', '#7C3AED', '#5B21B6'],
  gradient: ['#3B82F6', '#8B5CF6', '#EC4899'],
};

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface AdvancedChartProps {
  data: ChartData[];
  title: string;
  type: 'area' | 'pie' | 'bar' | 'line';
  height?: number;
  showGrid?: boolean;
  animate?: boolean;
  colorScheme?: keyof typeof colors;
}

export function AdvancedChart({
  data,
  title,
  type,
  height = 300,
  showGrid = true,
  animate = true,
  colorScheme = 'primary',
}: AdvancedChartProps) {
  const chartColors = colors[colorScheme];

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[0]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis
              dataKey="name"
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
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColors[0]}
              fill="url(#colorGradient)"
              strokeWidth={2}
              dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={(props: any) => {
                const { name, percent } = props;
                return percent !== undefined
                  ? `${name} ${(percent * 100).toFixed(0)}%`
                  : name;
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis
              dataKey="name"
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
              }}
            />
            <Bar dataKey="value" fill={chartColors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis
              dataKey="name"
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
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColors[0]}
              strokeWidth={2}
              dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: string;
  trend?: ChartData[];
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function EnhancedMetricCard({
  title,
  value,
  change,
  icon,
  trend,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const changeColors = {
    increase: 'text-emerald-600 bg-emerald-50',
    decrease: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-4`}>
        <div className="flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          {change && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                changeColors[change.type]
              }`}
            >
              {change.type === 'increase'
                ? '+'
                : change.type === 'decrease'
                ? '-'
                : ''}
              {Math.abs(change.value)}%
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

        {change && <p className="text-sm text-gray-500">{change.period}</p>}

        {trend && trend.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={trend}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={
                    colors[
                      color === 'blue'
                        ? 'primary'
                        : color === 'green'
                        ? 'success'
                        : 'warning'
                    ][0]
                  }
                  fill={
                    colors[
                      color === 'blue'
                        ? 'primary'
                        : color === 'green'
                        ? 'success'
                        : 'warning'
                    ][0]
                  }
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

interface ComparisonChartProps {
  data: Array<{
    name: string;
    current: number;
    previous: number;
  }>;
  title: string;
  height?: number;
}

export function ComparisonChart({
  data,
  title,
  height = 300,
}: ComparisonChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
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
            }}
          />
          <Bar
            dataKey="previous"
            fill="#E5E7EB"
            name="Previous Period"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="current"
            fill="#3B82F6"
            name="Current Period"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrendAnalysisProps {
  data: Array<{
    date: string;
    revenue: number;
    clicks: number;
    views: number;
  }>;
  title: string;
  height?: number;
}

export function TrendAnalysis({
  data,
  title,
  height = 400,
}: TrendAnalysisProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            name="Revenue (€)"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="clicks"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Clicks"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="views"
            stroke="#8B5CF6"
            strokeWidth={2}
            name="Views"
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RealTimeMetricsProps {
  data: {
    activeUsers: number;
    recentClicks: number;
    currentRevenue: number;
    conversionRate: number;
  };
}

export function RealTimeMetrics({ data }: RealTimeMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Active Users
            </span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.activeUsers}</p>
          <p className="text-xs text-gray-500">Currently online</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Recent Clicks
            </span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
              Last 5min
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.recentClicks}
          </p>
          <p className="text-xs text-gray-500">Product interactions</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Live Revenue
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
              Today
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            €{data.currentRevenue}
          </p>
          <p className="text-xs text-gray-500">Generated today</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Conversion Rate
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                data.conversionRate > 5
                  ? 'bg-emerald-100 text-emerald-600'
                  : data.conversionRate > 2
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {data.conversionRate > 5
                ? 'Good'
                : data.conversionRate > 2
                ? 'Average'
                : 'Low'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.conversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Click-to-purchase rate</p>
        </div>
      </div>
    </div>
  );
}
