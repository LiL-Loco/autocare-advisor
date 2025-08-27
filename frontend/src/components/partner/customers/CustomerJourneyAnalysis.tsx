'use client';

import React, { useState, useEffect } from 'react';

// Types for Customer Journey Analysis
interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalSpent: number;
  orderCount: number;
  lastPurchase: string;
  segment: 'high-value' | 'regular' | 'at-risk' | 'new';
  lifetimeValue: number;
  averageOrderValue: number;
}

interface JourneyStep {
  id: string;
  name: string;
  type: 'touchpoint' | 'conversion' | 'drop-off';
  customers: number;
  conversionRate?: number;
  avgTimeSpent?: number;
  exitRate?: number;
}

interface CustomerInsight {
  metric: string;
  value: number | string;
  change: number;
  period: string;
  trend: 'up' | 'down' | 'stable';
}

const CustomerJourneyAnalysis: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data initialization
  useEffect(() => {
    const mockCustomers: Customer[] = Array.from({ length: 500 }, (_, i) => ({
      id: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
      totalSpent: Math.floor(Math.random() * 5000) + 100,
      orderCount: Math.floor(Math.random() * 50) + 1,
      lastPurchase: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      segment: ['high-value', 'regular', 'at-risk', 'new'][Math.floor(Math.random() * 4)] as Customer['segment'],
      lifetimeValue: Math.floor(Math.random() * 10000) + 500,
      averageOrderValue: Math.floor(Math.random() * 200) + 50,
    }));

    const mockJourneySteps: JourneyStep[] = [
      { id: '1', name: 'Landing Page', type: 'touchpoint', customers: 10000, avgTimeSpent: 45, exitRate: 65 },
      { id: '2', name: 'Product Browse', type: 'touchpoint', customers: 3500, avgTimeSpent: 120, exitRate: 45 },
      { id: '3', name: 'Product Detail View', type: 'touchpoint', customers: 1925, avgTimeSpent: 180, exitRate: 35 },
      { id: '4', name: 'Add to Cart', type: 'conversion', customers: 1250, conversionRate: 65, exitRate: 25 },
      { id: '5', name: 'Checkout Start', type: 'touchpoint', customers: 938, avgTimeSpent: 90, exitRate: 40 },
      { id: '6', name: 'Payment', type: 'conversion', customers: 563, conversionRate: 60, exitRate: 15 },
      { id: '7', name: 'Order Complete', type: 'conversion', customers: 479, conversionRate: 85, exitRate: 5 },
    ];

    const mockInsights: CustomerInsight[] = [
      { metric: 'Customer Lifetime Value', value: '€847', change: 12.5, period: 'vs last month', trend: 'up' },
      { metric: 'Average Order Value', value: '€128', change: -3.2, period: 'vs last month', trend: 'down' },
      { metric: 'Customer Retention Rate', value: '68%', change: 5.8, period: 'vs last month', trend: 'up' },
      { metric: 'Churn Risk Customers', value: 127, change: -15.3, period: 'vs last month', trend: 'up' },
      { metric: 'New Customer Acquisition', value: 89, change: 23.7, period: 'vs last month', trend: 'up' },
      { metric: 'Customer Satisfaction Score', value: 4.6, change: 0.3, period: 'vs last month', trend: 'up' },
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setJourneySteps(mockJourneySteps);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'high-value': return 'bg-green-100 text-green-800 border-green-200';
      case 'regular': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'new': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <span className="text-green-600">↗</span>;
      case 'down': return <span className="text-red-600">↘</span>;
      default: return <span className="text-gray-600">→</span>;
    }
  };

  const filteredCustomers = selectedSegment === 'all' 
    ? customers 
    : customers.filter(customer => customer.segment === selectedSegment);

  const segmentStats = customers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Journey Analysis</h1>
          <p className="text-gray-600 mt-1">
            Understand your customers' path to purchase and identify optimization opportunities
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{insight.metric}</h3>
              {getTrendIcon(insight.trend)}
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
              <div className={`text-sm mt-1 ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insight.change > 0 ? '+' : ''}{insight.change}% {insight.period}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Journey Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Journey Funnel</h2>
        <div className="space-y-4">
          {journeySteps.map((step, index) => {
            const prevStep = journeySteps[index - 1];
            const dropOffRate = prevStep ? ((prevStep.customers - step.customers) / prevStep.customers * 100) : 0;
            
            return (
              <div key={step.id} className="relative">
                <div className="flex items-center">
                  {/* Step Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    step.type === 'conversion' ? 'bg-green-500' : 
                    step.type === 'drop-off' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Step Details */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                      <div className="text-2xl font-bold text-gray-900">
                        {step.customers.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${(step.customers / journeySteps[0].customers) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Step Metrics */}
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      {step.conversionRate && (
                        <span>Conversion: {step.conversionRate}%</span>
                      )}
                      {step.avgTimeSpent && (
                        <span>Avg. Time: {step.avgTimeSpent}s</span>
                      )}
                      {step.exitRate && (
                        <span>Exit Rate: {step.exitRate}%</span>
                      )}
                      {prevStep && (
                        <span className="text-red-600">
                          Drop-off: {dropOffRate.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < journeySteps.length - 1 && (
                  <div className="ml-5 w-0.5 h-6 bg-gray-300 my-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h2>
          <div className="space-y-4">
            {Object.entries(segmentStats).map(([segment, count]) => (
              <div key={segment} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getSegmentColor(segment)}`}>
                    {segment}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900 mr-2">
                    {count}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({((count / customers.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Behavior Patterns */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Behavior Patterns</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">Peak Shopping Hours</h3>
                <p className="text-sm text-blue-700">2 PM - 4 PM weekdays</p>
              </div>
              <div className="text-2xl">🕐</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">Most Popular Categories</h3>
                <p className="text-sm text-green-700">Engine Oil, Brake Pads</p>
              </div>
              <div className="text-2xl">📦</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <h3 className="font-medium text-purple-900">Average Session Duration</h3>
                <p className="text-sm text-purple-700">8 minutes 32 seconds</p>
              </div>
              <div className="text-2xl">⏱️</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-medium text-yellow-900">Mobile vs Desktop</h3>
                <p className="text-sm text-yellow-700">65% Mobile, 35% Desktop</p>
              </div>
              <div className="text-2xl">📱</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Customer List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Segments</option>
              <option value="high-value">High Value</option>
              <option value="regular">Regular</option>
              <option value="at-risk">At Risk</option>
              <option value="new">New</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Purchase
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.slice(0, 10).map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    €{customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customer.orderCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    €{customer.averageOrderValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(customer.lastPurchase).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length > 10 && (
          <div className="px-6 py-3 bg-gray-50 text-center">
            <span className="text-sm text-gray-500">
              Showing 10 of {filteredCustomers.length} customers
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerJourneyAnalysis;