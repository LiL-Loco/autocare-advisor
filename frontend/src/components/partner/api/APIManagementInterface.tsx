'use client';

import React, { useEffect, useState } from 'react';

// Types for API Management
interface APIKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  usage: {
    total: number;
    thisMonth: number;
    limit: number;
  };
  environment: 'production' | 'staging' | 'development';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  lastTriggered: string;
  successRate: number;
  retryCount: number;
}

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  rateLimit: string;
  authentication: boolean;
}

interface Integration {
  id: string;
  name: string;
  type: 'ecommerce' | 'analytics' | 'crm' | 'marketing';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  icon: string;
  description: string;
}

const APIManagementInterface: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [endpoints] = useState<APIEndpoint[]>([
    {
      path: '/api/v1/products',
      method: 'GET',
      description: 'Retrieve all products for the partner',
      rateLimit: '1000/hour',
      authentication: true,
    },
    {
      path: '/api/v1/products',
      method: 'POST',
      description: 'Create a new product',
      rateLimit: '100/hour',
      authentication: true,
    },
    {
      path: '/api/v1/analytics/performance',
      method: 'GET',
      description: 'Get performance analytics data',
      rateLimit: '500/hour',
      authentication: true,
    },
    {
      path: '/api/v1/orders',
      method: 'GET',
      description: 'Retrieve order information',
      rateLimit: '2000/hour',
      authentication: true,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'keys' | 'webhooks' | 'endpoints' | 'integrations'
  >('keys');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  useEffect(() => {
    // Mock data initialization
    const mockApiKeys: APIKey[] = [
      {
        id: 'key-1',
        name: 'Production API Key',
        key: 'ak_live_7f8d9e2a1b3c4d5e6f7g8h9i0j1k2l3m',
        status: 'active',
        permissions: ['read:products', 'write:products', 'read:analytics'],
        createdAt: '2024-01-15T10:30:00Z',
        lastUsed: '2024-08-26T14:22:00Z',
        usage: { total: 45230, thisMonth: 8520, limit: 10000 },
        environment: 'production',
      },
      {
        id: 'key-2',
        name: 'Development API Key',
        key: 'ak_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
        status: 'active',
        permissions: ['read:products', 'read:analytics'],
        createdAt: '2024-02-10T09:15:00Z',
        lastUsed: '2024-08-25T16:45:00Z',
        usage: { total: 12450, thisMonth: 2340, limit: 5000 },
        environment: 'development',
      },
    ];

    const mockWebhooks: Webhook[] = [
      {
        id: 'wh-1',
        name: 'Order Notification Webhook',
        url: 'https://partner.example.com/webhooks/orders',
        events: ['order.created', 'order.updated', 'order.cancelled'],
        status: 'active',
        secret: 'whsec_7f8d9e2a1b3c4d5e6f7g8h9i0j1k2l3m',
        lastTriggered: '2024-08-26T12:30:00Z',
        successRate: 98.5,
        retryCount: 3,
      },
      {
        id: 'wh-2',
        name: 'Product Update Webhook',
        url: 'https://partner.example.com/webhooks/products',
        events: ['product.created', 'product.updated', 'product.deleted'],
        status: 'active',
        secret: 'whsec_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
        lastTriggered: '2024-08-25T18:15:00Z',
        successRate: 95.2,
        retryCount: 5,
      },
    ];

    const mockIntegrations: Integration[] = [
      {
        id: 'int-1',
        name: 'Shopify',
        type: 'ecommerce',
        status: 'connected',
        lastSync: '2024-08-26T14:00:00Z',
        icon: '🛒',
        description: 'Sync products and orders with your Shopify store',
      },
      {
        id: 'int-2',
        name: 'Google Analytics',
        type: 'analytics',
        status: 'connected',
        lastSync: '2024-08-26T13:30:00Z',
        icon: '📊',
        description: 'Track performance metrics and user behavior',
      },
      {
        id: 'int-3',
        name: 'Mailchimp',
        type: 'marketing',
        status: 'disconnected',
        lastSync: '2024-08-20T10:15:00Z',
        icon: '📧',
        description: 'Automated email marketing and customer communication',
      },
    ];

    setTimeout(() => {
      setApiKeys(mockApiKeys);
      setWebhooks(mockWebhooks);
      setIntegrations(mockIntegrations);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-100 text-red-800';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('de-DE');

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
          <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your API keys, webhooks, and integrations
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View Documentation
          </button>
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create API Key
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'keys', label: 'API Keys', count: apiKeys.length },
            { key: 'webhooks', label: 'Webhooks', count: webhooks.length },
            { key: 'endpoints', label: 'Endpoints', count: endpoints.length },
            {
              key: 'integrations',
              label: 'Integrations',
              count: integrations.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {key.name}
                    </h3>
                    <span
                      className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        key.status
                      )}`}
                    >
                      {key.status}
                    </span>
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEnvironmentColor(
                        key.environment
                      )}`}
                    >
                      {key.environment}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="flex items-center">
                        <code className="flex-1 bg-gray-50 px-3 py-2 rounded border text-sm font-mono">
                          {key.key.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-1 font-medium">
                          {formatDate(key.createdAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Used:</span>
                        <span className="ml-1 font-medium">
                          {formatDate(key.lastUsed)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Usage This Month:</span>
                        <span className="ml-1 font-medium">
                          {key.usage.thisMonth.toLocaleString()} /{' '}
                          {key.usage.limit.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {key.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Usage Progress</span>
                        <span>
                          {(
                            (key.usage.thisMonth / key.usage.limit) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (key.usage.thisMonth / key.usage.limit) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Regenerate
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowWebhookModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Webhook
            </button>
          </div>

          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {webhook.name}
                    </h3>
                    <span
                      className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        webhook.status
                      )}`}
                    >
                      {webhook.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endpoint URL
                      </label>
                      <code className="block bg-gray-50 px-3 py-2 rounded border text-sm font-mono">
                        {webhook.url}
                      </code>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Events
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Triggered:</span>
                        <span className="block font-medium">
                          {formatDate(webhook.lastTriggered)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <span className="block font-medium text-green-600">
                          {webhook.successRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Retries:</span>
                        <span className="block font-medium">
                          {webhook.retryCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Secret:</span>
                        <span className="block font-mono text-xs">
                          {webhook.secret.substring(0, 15)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Test
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Available API Endpoints
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          endpoint.method === 'GET'
                            ? 'bg-green-100 text-green-800'
                            : endpoint.method === 'POST'
                            ? 'bg-blue-100 text-blue-800'
                            : endpoint.method === 'PUT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="ml-3 text-lg font-mono">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="mt-2 text-gray-600">{endpoint.description}</p>
                    <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                      <span>Rate Limit: {endpoint.rateLimit}</span>
                      <span className="flex items-center">
                        {endpoint.authentication ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-1 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Authentication Required
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                              />
                            </svg>
                            Public Endpoint
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <button className="ml-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Try It
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{integration.icon}</span>
                  <h3 className="text-lg font-medium text-gray-900">
                    {integration.name}
                  </h3>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    integration.status
                  )}`}
                >
                  {integration.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {integration.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">
                    {integration.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Sync:</span>
                  <span className="font-medium">
                    {formatDate(integration.lastSync)}
                  </span>
                </div>
              </div>

              <button
                className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors ${
                  integration.status === 'connected'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create API Key
              </h3>
              <button onClick={() => setShowKeyModal(false)}>
                <svg
                  className="w-6 h-6 text-gray-400"
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
                  Key Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {[
                    'read:products',
                    'write:products',
                    'read:analytics',
                    'read:orders',
                  ].map((perm) => (
                    <label key={perm} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Key
                </button>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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

export default APIManagementInterface;
