/**
 * Analytics Cards Components - AutoCare Advisor Partner Dashboard
 *
 * Wiederverwendbare Card-Komponenten für Analytics Dashboard
 */

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon && (
              <div
                className={`w-8 h-8 rounded-full ${colorClasses[color]} flex items-center justify-center text-white`}
              >
                {icon}
              </div>
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <span className={trend.isPositive ? '↗' : '↘'}>
                      {Math.abs(trend.value)}%
                    </span>
                  </div>
                )}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600 mt-1">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RevenueCardProps {
  title: string;
  amount: number;
  currency?: string;
  subtitle?: string;
  trend?: {
    value: number;
    period: string;
  };
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  amount,
  currency = '€',
  subtitle,
  trend,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {currency}
                {amount.toLocaleString()}
              </p>
              {trend && (
                <p className="ml-2 text-sm font-medium text-green-600">
                  +{trend.value}% {trend.period}
                </p>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductPerformanceCardProps {
  products: Array<{
    productId: string;
    name: string;
    views: number;
    clicks: number;
    conversionRate: number;
    revenue: number;
  }>;
}

export const ProductPerformanceCard: React.FC<ProductPerformanceCardProps> = ({
  products,
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Top Performing Products
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {products.slice(0, 5).map((product, index) => (
              <li key={product.productId}>
                <div className="relative pb-8">
                  {index !== products.slice(0, 5).length - 1 && (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <div className="flex space-x-4">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {product.views} Views
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {product.clicks} Clicks
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {product.conversionRate}% CR
                            </span>
                          </div>
                          <div className="mt-2 font-semibold text-gray-900">
                            €{Math.round(product.revenue)} Revenue
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface InsightsCardProps {
  title: string;
  data: Array<{ name: string; value: number; label?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'indigo';
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  title,
  data,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}
                >
                  {item.value} {item.label || ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface RecommendationTiersCardProps {
  tiers: {
    perfect: number;
    excellent: number;
    good: number;
    acceptable: number;
  };
  totalRecommendations: number;
  avgScore: number;
}

export const RecommendationTiersCard: React.FC<
  RecommendationTiersCardProps
> = ({ tiers, totalRecommendations, avgScore }) => {
  const tierData = [
    { name: 'Perfect', value: tiers.perfect, color: 'bg-green-500' },
    { name: 'Excellent', value: tiers.excellent, color: 'bg-blue-500' },
    { name: 'Good', value: tiers.good, color: 'bg-yellow-500' },
    { name: 'Acceptable', value: tiers.acceptable, color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recommendation Performance
        </h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Total Recommendations
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {totalRecommendations.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Average Score
            </span>
            <span className="text-lg font-semibold text-green-600">
              {avgScore}/100
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {tierData.map((tier) => {
            const percentage =
              totalRecommendations > 0
                ? Math.round((tier.value / totalRecommendations) * 100)
                : 0;

            return (
              <div key={tier.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {tier.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {tier.value} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tier.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
