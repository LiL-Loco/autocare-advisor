'use client';

import React, { useEffect, useState } from 'react';

// Types for Marketing Campaign Management
interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'display' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  targetAudience: string[];
  channels: string[];
}

interface CampaignTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  estimatedBudget: number;
  expectedROAS: number;
  duration: number;
}

interface MarketingInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'optimization' | 'opportunity' | 'alert';
  actionRequired: boolean;
}

const MarketingCampaignTools: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [insights, setInsights] = useState<MarketingInsight[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'campaigns' | 'builder' | 'insights'
  >('overview');
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp-1',
        name: 'Summer Engine Oil Promotion',
        type: 'email',
        status: 'active',
        budget: 5000,
        spent: 3200,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        performance: {
          impressions: 125000,
          clicks: 3750,
          conversions: 187,
          revenue: 23400,
          ctr: 3.0,
          cpc: 0.85,
          roas: 7.3,
        },
        targetAudience: ['DIY Mechanics', 'Car Enthusiasts'],
        channels: ['Email', 'Social Media'],
      },
      {
        id: 'camp-2',
        name: 'Brake Pads Safety Campaign',
        type: 'ppc',
        status: 'active',
        budget: 8000,
        spent: 4500,
        startDate: '2024-07-15',
        endDate: '2024-09-15',
        performance: {
          impressions: 89000,
          clicks: 2134,
          conversions: 98,
          revenue: 15600,
          ctr: 2.4,
          cpc: 2.11,
          roas: 3.5,
        },
        targetAudience: ['Professional Mechanics', 'Fleet Managers'],
        channels: ['Google Ads', 'Facebook Ads'],
      },
      {
        id: 'camp-3',
        name: 'Air Filter Awareness',
        type: 'content',
        status: 'completed',
        budget: 3000,
        spent: 2800,
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        performance: {
          impressions: 45000,
          clicks: 1800,
          conversions: 72,
          revenue: 8640,
          ctr: 4.0,
          cpc: 1.56,
          roas: 3.1,
        },
        targetAudience: ['Car Owners', 'Service Centers'],
        channels: ['Blog', 'Social Media', 'YouTube'],
      },
    ];

    const mockTemplates: CampaignTemplate[] = [
      {
        id: 'temp-1',
        name: 'Product Launch Campaign',
        type: 'Multi-Channel',
        description:
          'Comprehensive campaign for new product launches with email, social, and PPC components',
        estimatedBudget: 10000,
        expectedROAS: 4.2,
        duration: 60,
      },
      {
        id: 'temp-2',
        name: 'Seasonal Promotion',
        type: 'Email + Social',
        description:
          'Targeted seasonal campaigns for automotive maintenance reminders',
        estimatedBudget: 5000,
        expectedROAS: 5.8,
        duration: 30,
      },
      {
        id: 'temp-3',
        name: 'Retargeting Campaign',
        type: 'Display + PPC',
        description: "Re-engage visitors who browsed but didn't purchase",
        estimatedBudget: 3000,
        expectedROAS: 6.5,
        duration: 45,
      },
    ];

    const mockInsights: MarketingInsight[] = [
      {
        title: 'High-performing email subject lines',
        description:
          'Subject lines with urgency words show 23% higher open rates',
        impact: 'high',
        category: 'optimization',
        actionRequired: false,
      },
      {
        title: 'Underutilized audience segment',
        description:
          'Professional mechanics segment shows high engagement but low campaign allocation',
        impact: 'medium',
        category: 'opportunity',
        actionRequired: true,
      },
      {
        title: 'Budget overspend alert',
        description:
          'Summer promotion campaign is 15% over budget with 2 weeks remaining',
        impact: 'high',
        category: 'alert',
        actionRequired: true,
      },
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setTemplates(mockTemplates);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

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
          <h1 className="text-2xl font-bold text-gray-900">
            Marketing Campaign Tools
          </h1>
          <p className="text-gray-600 mt-1">
            Create, manage, and optimize your marketing campaigns
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Campaign
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Import Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'campaigns', label: 'Campaigns' },
            { key: 'builder', label: 'Campaign Builder' },
            { key: 'insights', label: 'Insights' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Campaign Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(16000)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-green-600">↗ 12.5%</span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(47640)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-green-600">↗ 18.3%</span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Impressions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">259k</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-green-600">↗ 8.7%</span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg ROAS</p>
                  <p className="text-2xl font-bold text-gray-900">4.8x</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-green-600">↗ 15.2%</span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Campaigns
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {campaigns
                .filter((c) => c.status === 'active')
                .map((campaign) => (
                  <div key={campaign.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {campaign.name}
                          </h3>
                          <span
                            className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 lg:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Budget:</span>
                            <span className="ml-1 font-medium">
                              {formatCurrency(campaign.budget)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Spent:</span>
                            <span className="ml-1 font-medium">
                              {formatCurrency(campaign.spent)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">CTR:</span>
                            <span className="ml-1 font-medium">
                              {formatPercentage(campaign.performance.ctr)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">CPC:</span>
                            <span className="ml-1 font-medium">
                              €{campaign.performance.cpc.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">ROAS:</span>
                            <span className="ml-1 font-medium">
                              {campaign.performance.roas.toFixed(1)}x
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Revenue:</span>
                            <span className="ml-1 font-medium">
                              {formatCurrency(campaign.performance.revenue)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (campaign.spent / campaign.budget) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget / Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(campaign.budget)}
                        </div>
                        <div className="text-gray-500">
                          {formatCurrency(campaign.spent)} spent
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div>
                          CTR: {formatPercentage(campaign.performance.ctr)}
                        </div>
                        <div>ROAS: {campaign.performance.roas.toFixed(1)}x</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Clone
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Pause
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Builder Tab */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Campaign Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Est. Budget:</span>
                      <span className="font-medium">
                        {formatCurrency(template.estimatedBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected ROAS:</span>
                      <span className="font-medium">
                        {template.expectedROAS}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">
                        {template.duration} days
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {insight.title}
                    </h3>
                    <span
                      className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(
                        insight.impact
                      )}`}
                    >
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{insight.description}</p>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="capitalize">{insight.category}</span>
                    {insight.actionRequired && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
                {insight.actionRequired && (
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Take Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Campaign
              </h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="email">Email Campaign</option>
                  <option value="social">Social Media</option>
                  <option value="ppc">PPC Ads</option>
                  <option value="display">Display Ads</option>
                  <option value="content">Content Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (€)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Campaign
                </button>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingCampaignTools;
