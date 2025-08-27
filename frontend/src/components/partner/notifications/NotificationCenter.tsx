'use client';

import React, { useEffect, useState } from 'react';

// Types for Notification Center
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category:
    | 'order'
    | 'product'
    | 'system'
    | 'billing'
    | 'marketing'
    | 'analytics';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions?: {
    label: string;
    action: string;
    style: 'primary' | 'secondary' | 'danger';
  }[];
  metadata?: {
    orderId?: string;
    productId?: string;
    amount?: number;
    userId?: string;
  };
}

interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  webhook: boolean;
  categories: {
    [key: string]: {
      enabled: boolean;
      channels: ('inApp' | 'email' | 'sms' | 'webhook')[];
      frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    };
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables: string[];
  enabled: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: { [key: string]: number };
  byCategory: { [key: string]: number };
  deliveryRate: number;
  engagementRate: number;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    inApp: true,
    email: true,
    sms: false,
    webhook: false,
    categories: {},
  });
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byCategory: {},
    deliveryRate: 0,
    engagementRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'preferences' | 'templates' | 'analytics'
  >('notifications');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  useEffect(() => {
    // Mock data initialization
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'success',
        title: 'New Order Received',
        message:
          'You have received a new order for 3x Premium Car Wax (€89.99)',
        timestamp: '2024-08-26T14:30:00Z',
        read: false,
        category: 'order',
        priority: 'high',
        actions: [
          { label: 'View Order', action: '/orders/12345', style: 'primary' },
          {
            label: 'Process',
            action: '/orders/12345/process',
            style: 'secondary',
          },
        ],
        metadata: { orderId: '12345', amount: 89.99 },
      },
      {
        id: 'notif-2',
        type: 'warning',
        title: 'Low Stock Alert',
        message:
          'Product "Tire Shine Spray" is running low in stock (5 units remaining)',
        timestamp: '2024-08-26T13:15:00Z',
        read: false,
        category: 'product',
        priority: 'medium',
        actions: [
          {
            label: 'Restock',
            action: '/products/restock/678',
            style: 'primary',
          },
        ],
        metadata: { productId: '678' },
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'Monthly Analytics Ready',
        message:
          'Your August performance report is now available with detailed insights',
        timestamp: '2024-08-26T09:00:00Z',
        read: true,
        category: 'analytics',
        priority: 'low',
        actions: [
          {
            label: 'View Report',
            action: '/analytics/monthly',
            style: 'primary',
          },
        ],
      },
      {
        id: 'notif-4',
        type: 'error',
        title: 'Payment Failed',
        message:
          'Subscription payment failed. Please update your payment method',
        timestamp: '2024-08-25T16:45:00Z',
        read: false,
        category: 'billing',
        priority: 'critical',
        actions: [
          {
            label: 'Update Payment',
            action: '/billing/payment-method',
            style: 'danger',
          },
          { label: 'Contact Support', action: '/support', style: 'secondary' },
        ],
      },
      {
        id: 'notif-5',
        type: 'system',
        title: 'System Maintenance Scheduled',
        message:
          'Scheduled maintenance will occur on Aug 28, 2024 from 2:00-4:00 AM UTC',
        timestamp: '2024-08-25T12:00:00Z',
        read: true,
        category: 'system',
        priority: 'medium',
      },
    ];

    const mockPreferences: NotificationPreferences = {
      inApp: true,
      email: true,
      sms: false,
      webhook: true,
      categories: {
        order: {
          enabled: true,
          channels: ['inApp', 'email'],
          frequency: 'immediate',
        },
        product: { enabled: true, channels: ['inApp'], frequency: 'hourly' },
        billing: {
          enabled: true,
          channels: ['inApp', 'email', 'sms'],
          frequency: 'immediate',
        },
        system: {
          enabled: true,
          channels: ['inApp', 'email'],
          frequency: 'immediate',
        },
        marketing: { enabled: false, channels: ['email'], frequency: 'weekly' },
        analytics: { enabled: true, channels: ['inApp'], frequency: 'daily' },
      },
    };

    const mockTemplates: NotificationTemplate[] = [
      {
        id: 'tmpl-1',
        name: 'Order Confirmation',
        type: 'order',
        subject: 'Order Confirmation - {{orderNumber}}',
        content:
          'Thank you for your order! Order {{orderNumber}} has been confirmed for {{amount}}.',
        variables: ['orderNumber', 'amount', 'customerName'],
        enabled: true,
      },
      {
        id: 'tmpl-2',
        name: 'Low Stock Alert',
        type: 'product',
        subject: 'Low Stock Alert - {{productName}}',
        content:
          'Product {{productName}} is running low with only {{quantity}} units remaining.',
        variables: ['productName', 'quantity', 'reorderLevel'],
        enabled: true,
      },
    ];

    const mockStats: NotificationStats = {
      total: 156,
      unread: 23,
      byType: {
        success: 45,
        warning: 32,
        error: 12,
        info: 54,
        system: 13,
      },
      byCategory: {
        order: 78,
        product: 34,
        billing: 15,
        system: 13,
        marketing: 10,
        analytics: 6,
      },
      deliveryRate: 98.5,
      engagementRate: 76.3,
    };

    setTimeout(() => {
      setNotifications(mockNotifications);
      setPreferences(mockPreferences);
      setTemplates(mockTemplates);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
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
          </div>
        );
      case 'info':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('de-DE');

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filterCategory !== 'all' && notification.category !== filterCategory)
      return false;
    if (filterPriority !== 'all' && notification.priority !== filterPriority)
      return false;
    if (showUnreadOnly && notification.read) return false;
    return true;
  });

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
            Notification Center
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your notifications and communication preferences
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {stats.unread} unread
          </span>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              key: 'notifications',
              label: 'Notifications',
              count: notifications.length,
            },
            {
              key: 'preferences',
              label: 'Preferences',
              count: Object.keys(preferences.categories).length,
            },
            { key: 'templates', label: 'Templates', count: templates.length },
            { key: 'analytics', label: 'Analytics' },
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
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4 space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="order">Orders</option>
                <option value="product">Products</option>
                <option value="billing">Billing</option>
                <option value="system">System</option>
                <option value="marketing">Marketing</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Priority:
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unread-only"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label
                htmlFor="unread-only"
                className="text-sm font-medium text-gray-700"
              >
                Unread only
              </label>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-6 transition-all ${
                  !notification.read
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority}
                          </span>
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            {notification.category}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.timestamp)}
                          </span>

                          {notification.actions && (
                            <div className="flex items-center space-x-2">
                              {notification.actions.map((action, index) => (
                                <button
                                  key={index}
                                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                    action.style === 'primary'
                                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                      : action.style === 'danger'
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Mark as read"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete notification"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {showUnreadOnly
                    ? 'No unread notifications found'
                    : 'All caught up! No notifications to display.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-8">
          {/* Global Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Global Notification Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { key: 'inApp', label: 'In-App Notifications', icon: '📱' },
                { key: 'email', label: 'Email Notifications', icon: '📧' },
                { key: 'sms', label: 'SMS Notifications', icon: '📲' },
                { key: 'webhook', label: 'Webhook Notifications', icon: '🔗' },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{setting.icon}</span>
                    <span className="font-medium text-gray-900">
                      {setting.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={
                      preferences[
                        setting.key as keyof Omit<
                          NotificationPreferences,
                          'categories'
                        >
                      ]
                    }
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        [setting.key]: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Category Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Category Settings
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {Object.entries(preferences.categories).map(
                ([category, settings]) => (
                  <div key={category} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-medium text-gray-900 capitalize">
                        {category} Notifications
                      </h3>
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [category]: {
                                ...settings,
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {settings.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-100">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Channels
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(
                              ['inApp', 'email', 'sms', 'webhook'] as const
                            ).map((channel) => (
                              <label
                                key={channel}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={settings.channels.includes(channel)}
                                  onChange={(e) => {
                                    const updatedChannels = e.target.checked
                                      ? [...settings.channels, channel]
                                      : settings.channels.filter(
                                          (c) => c !== channel
                                        );

                                    setPreferences((prev) => ({
                                      ...prev,
                                      categories: {
                                        ...prev.categories,
                                        [category]: {
                                          ...settings,
                                          channels: updatedChannels,
                                        },
                                      },
                                    }));
                                  }}
                                  className="rounded border-gray-300 mr-2"
                                />
                                <span className="text-sm capitalize">
                                  {channel === 'inApp' ? 'In-App' : channel}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <select
                            value={settings.frequency}
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                categories: {
                                  ...prev.categories,
                                  [category]: {
                                    ...settings,
                                    frequency: e.target.value as any,
                                  },
                                },
                              }))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="immediate">Immediate</option>
                            <option value="hourly">Hourly Digest</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Template
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        template.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {template.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize">{template.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <span className="ml-2">{template.subject}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Content:</span>
                    <p className="mt-1 text-gray-600 text-xs bg-gray-50 p-2 rounded">
                      {template.content}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Variables:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable) => (
                        <code
                          key={variable}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {`{{${variable}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Notifications
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.unread}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Delivery Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.deliveryRate}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Engagement Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.engagementRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Notifications by Type
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {type}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (count /
                                Math.max(...Object.values(stats.byType))) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Notifications by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {category}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (count /
                                Math.max(...Object.values(stats.byCategory))) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
