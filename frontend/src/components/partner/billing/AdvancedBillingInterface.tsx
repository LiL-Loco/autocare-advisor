'use client';

import React, { useEffect, useState } from 'react';

// Types for Advanced Billing
interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'starter' | 'professional' | 'enterprise' | 'custom';
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    products: number | 'unlimited';
    apiCalls: number | 'unlimited';
    storage: string;
    users: number | 'unlimited';
  };
  popular?: boolean;
  current?: boolean;
}

interface CurrentSubscription {
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

interface UsageMetrics {
  period: string;
  products: {
    used: number;
    limit: number | 'unlimited';
    percentage: number;
  };
  apiCalls: {
    used: number;
    limit: number | 'unlimited';
    percentage: number;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
    unit: 'GB';
  };
  users: {
    used: number;
    limit: number | 'unlimited';
    percentage: number;
  };
}

interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  paymentMethod: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string; // for PayPal
}

const AdvancedBillingInterface: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'plans' | 'usage' | 'billing' | 'payment'
  >('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  useEffect(() => {
    // Mock data initialization
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'starter',
        name: 'Starter',
        tier: 'starter',
        price: { monthly: 29, yearly: 290 },
        features: [
          'Up to 100 products',
          '10,000 API calls/month',
          '5 GB storage',
          'Email support',
          'Basic analytics',
          'CSV import/export',
        ],
        limits: {
          products: 100,
          apiCalls: 10000,
          storage: '5 GB',
          users: 1,
        },
      },
      {
        id: 'professional',
        name: 'Professional',
        tier: 'professional',
        price: { monthly: 79, yearly: 790 },
        features: [
          'Up to 1,000 products',
          '100,000 API calls/month',
          '50 GB storage',
          'Priority support',
          'Advanced analytics',
          'Custom branding',
          'Webhook notifications',
          'Multi-user access (up to 5 users)',
        ],
        limits: {
          products: 1000,
          apiCalls: 100000,
          storage: '50 GB',
          users: 5,
        },
        popular: true,
        current: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        price: { monthly: 199, yearly: 1990 },
        features: [
          'Unlimited products',
          'Unlimited API calls',
          '500 GB storage',
          '24/7 phone support',
          'Enterprise analytics',
          'White-label solution',
          'Advanced integrations',
          'Unlimited users',
          'SLA guarantee',
          'Dedicated account manager',
        ],
        limits: {
          products: 'unlimited',
          apiCalls: 'unlimited',
          storage: '500 GB',
          users: 'unlimited',
        },
      },
    ];

    const mockCurrentSubscription: CurrentSubscription = {
      planId: 'professional',
      plan: mockPlans.find((p) => p.id === 'professional')!,
      status: 'active',
      billingCycle: 'monthly',
      nextBillingDate: '2024-09-26T00:00:00Z',
      currentPeriodStart: '2024-08-26T00:00:00Z',
      currentPeriodEnd: '2024-09-26T00:00:00Z',
      cancelAtPeriodEnd: false,
    };

    const mockUsageMetrics: UsageMetrics = {
      period: 'August 2024',
      products: { used: 347, limit: 1000, percentage: 34.7 },
      apiCalls: { used: 78420, limit: 100000, percentage: 78.4 },
      storage: { used: 12.4, limit: 50, percentage: 24.8, unit: 'GB' },
      users: { used: 3, limit: 5, percentage: 60 },
    };

    const mockBillingHistory: BillingHistory[] = [
      {
        id: 'inv_001',
        date: '2024-08-26T00:00:00Z',
        description: 'Professional Plan - Monthly',
        amount: 79,
        currency: 'EUR',
        status: 'paid',
        invoiceUrl: '/invoices/inv_001.pdf',
        paymentMethod: 'Card ending in 4242',
      },
      {
        id: 'inv_002',
        date: '2024-07-26T00:00:00Z',
        description: 'Professional Plan - Monthly',
        amount: 79,
        currency: 'EUR',
        status: 'paid',
        invoiceUrl: '/invoices/inv_002.pdf',
        paymentMethod: 'Card ending in 4242',
      },
      {
        id: 'inv_003',
        date: '2024-06-26T00:00:00Z',
        description: 'Professional Plan - Monthly',
        amount: 79,
        currency: 'EUR',
        status: 'paid',
        invoiceUrl: '/invoices/inv_003.pdf',
        paymentMethod: 'Card ending in 4242',
      },
    ];

    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: 'pm_001',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: 'pm_002',
        type: 'paypal',
        email: 'user@example.com',
        isDefault: false,
      },
    ];

    setTimeout(() => {
      setSubscriptionPlans(mockPlans);
      setCurrentSubscription(mockCurrentSubscription);
      setUsageMetrics(mockUsageMetrics);
      setBillingHistory(mockBillingHistory);
      setPaymentMethods(mockPaymentMethods);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'failed':
      case 'past_due':
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('de-DE');
  const formatCurrency = (amount: number, currency: string = 'EUR') =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(
      amount
    );

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleDowngrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlySavings = monthly * 12 - yearly;
    const percentage = Math.round((yearlySavings / (monthly * 12)) * 100);
    return { amount: yearlySavings, percentage };
  };

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
            Billing & Subscription
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your subscription, usage, and billing information
          </p>
        </div>
        {currentSubscription && (
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                currentSubscription.status
              )}`}
            >
              {currentSubscription.status.charAt(0).toUpperCase() +
                currentSubscription.status.slice(1)}
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'plans', label: 'Plans & Pricing', icon: '💳' },
            { key: 'usage', label: 'Usage & Limits', icon: '📈' },
            { key: 'billing', label: 'Billing History', icon: '📄' },
            { key: 'payment', label: 'Payment Methods', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && currentSubscription && (
        <div className="space-y-6">
          {/* Current Subscription Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Subscription
              </h2>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  currentSubscription.status
                )}`}
              >
                {currentSubscription.status.charAt(0).toUpperCase() +
                  currentSubscription.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {currentSubscription.plan.name} Plan
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {formatCurrency(
                    currentSubscription.plan.price[
                      currentSubscription.billingCycle
                    ]
                  )}
                  <span className="text-lg font-normal text-gray-500">
                    /
                    {currentSubscription.billingCycle === 'monthly'
                      ? 'month'
                      : 'year'}
                  </span>
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium capitalize">
                      {currentSubscription.billingCycle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing:</span>
                    <span className="font-medium">
                      {formatDate(currentSubscription.nextBillingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Period:</span>
                    <span className="font-medium">
                      {formatDate(currentSubscription.currentPeriodStart)} -{' '}
                      {formatDate(currentSubscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Plan Features
                </h4>
                <div className="space-y-2">
                  {currentSubscription.plan.features
                    .slice(0, 6)
                    .map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
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
                        {feature}
                      </div>
                    ))}
                  {currentSubscription.plan.features.length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{currentSubscription.plan.features.length - 6} more
                      features
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  handleUpgrade(
                    subscriptionPlans.find((p) => p.tier === 'enterprise')!
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === 'monthly' ? 'yearly' : 'monthly'
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Switch to {billingCycle === 'monthly' ? 'Yearly' : 'Monthly'}{' '}
                Billing
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {currentSubscription.cancelAtPeriodEnd
                  ? 'Reactivate'
                  : 'Cancel Subscription'}
              </button>
            </div>
          </div>

          {/* Usage Overview */}
          {usageMetrics && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Usage Overview - {usageMetrics.period}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(usageMetrics)
                  .filter(([key]) => key !== 'period')
                  .map(([key, usage]) => (
                    <div key={key} className="text-center">
                      <h3 className="text-sm font-medium text-gray-700 capitalize mb-2">
                        {key}
                      </h3>
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <svg
                          className="w-24 h-24 transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${
                              usage.percentage * 2.51
                            }, 251.2`}
                            className={`${
                              usage.percentage > 80
                                ? 'text-red-500'
                                : usage.percentage > 60
                                ? 'text-yellow-500'
                                : 'text-blue-500'
                            }`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {Math.round(usage.percentage)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {usage.used.toLocaleString()} /{' '}
                        {usage.limit === 'unlimited'
                          ? '∞'
                          : typeof usage.limit === 'number'
                          ? usage.limit.toLocaleString()
                          : usage.limit}
                        {key === 'storage' && ` ${usage.unit}`}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Yearly
                  <span className="ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                    Save up to 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => {
              const savings = calculateSavings(
                plan.price.monthly,
                plan.price.yearly
              );
              const isCurrentPlan = currentSubscription?.plan.id === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-lg border-2 p-8 relative ${
                    plan.popular
                      ? 'border-blue-500 shadow-lg'
                      : isCurrentPlan
                      ? 'border-green-500'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(plan.price[billingCycle])}
                      </span>
                      <span className="text-lg text-gray-500">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                      {billingCycle === 'yearly' && savings.amount > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save {formatCurrency(savings.amount)} (
                          {savings.percentage}%)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
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
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span className="font-medium">
                        {plan.limits.products === 'unlimited'
                          ? 'Unlimited'
                          : plan.limits.products.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span className="font-medium">
                        {plan.limits.apiCalls === 'unlimited'
                          ? 'Unlimited'
                          : `${(
                              plan.limits.apiCalls as number
                            ).toLocaleString()}/month`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-medium">{plan.limits.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span className="font-medium">
                        {plan.limits.users === 'unlimited'
                          ? 'Unlimited'
                          : plan.limits.users}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    {isCurrentPlan ? (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan)}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                          plan.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {currentSubscription &&
                        plan.price[billingCycle] >
                          currentSubscription.plan.price[billingCycle]
                          ? 'Upgrade to ' + plan.name
                          : currentSubscription &&
                            plan.price[billingCycle] <
                              currentSubscription.plan.price[billingCycle]
                          ? 'Downgrade to ' + plan.name
                          : 'Select ' + plan.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && usageMetrics && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Usage Details - {usageMetrics.period}
            </h2>

            <div className="space-y-8">
              {Object.entries(usageMetrics)
                .filter(([key]) => key !== 'period')
                .map(([key, usage]) => (
                  <div
                    key={key}
                    className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-medium text-gray-900 capitalize">
                        {key}
                      </h3>
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded-full ${
                          usage.percentage > 90
                            ? 'bg-red-100 text-red-800'
                            : usage.percentage > 75
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {usage.percentage > 90
                          ? 'Critical'
                          : usage.percentage > 75
                          ? 'Warning'
                          : 'Good'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Used: {usage.used.toLocaleString()}
                          {key === 'storage' && ` ${usage.unit}`}
                        </span>
                        <span>
                          Limit:{' '}
                          {usage.limit === 'unlimited'
                            ? 'Unlimited'
                            : typeof usage.limit === 'number'
                            ? usage.limit.toLocaleString()
                            : usage.limit}
                          {key === 'storage' &&
                            usage.limit !== 'unlimited' &&
                            ` ${usage.unit}`}
                        </span>
                      </div>

                      {usage.limit !== 'unlimited' && (
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              usage.percentage > 90
                                ? 'bg-red-500'
                                : usage.percentage > 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(usage.percentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>{usage.percentage.toFixed(1)}% used</span>
                        <span>
                          {usage.limit === 'unlimited'
                            ? '∞'
                            : typeof usage.limit === 'number'
                            ? usage.limit.toLocaleString()
                            : usage.limit}
                        </span>
                      </div>
                    </div>

                    {usage.percentage > 80 && usage.limit !== 'unlimited' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              Approaching {key} limit
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Consider upgrading your plan to avoid service
                              interruption.
                            </p>
                            <button
                              onClick={() => setActiveTab('plans')}
                              className="mt-2 text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
                            >
                              View upgrade options
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Billing History Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Billing History
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Download All Invoices
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {invoice.invoiceUrl ? (
                          <a
                            href={invoice.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Methods
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {method.type === 'card' ? (
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center mr-4">
                          <span className="text-white text-xs font-bold uppercase">
                            {method.brand}
                          </span>
                        </div>
                      ) : method.type === 'paypal' ? (
                        <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center mr-4">
                          <span className="text-white text-xs font-bold">
                            PP
                          </span>
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center mr-4">
                          <span className="text-white text-xs font-bold">
                            BANK
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {method.type === 'card'
                              ? `**** **** **** ${method.last4}`
                              : method.type === 'paypal'
                              ? method.email
                              : 'Bank Account'}
                          </span>
                          {method.isDefault && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        {method.type === 'card' &&
                          method.expiryMonth &&
                          method.expiryYear && (
                            <p className="text-sm text-gray-500">
                              Expires{' '}
                              {method.expiryMonth.toString().padStart(2, '0')}/
                              {method.expiryYear}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                          Set as Default
                        </button>
                      )}
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {currentSubscription &&
                selectedPlan.price[billingCycle] >
                  currentSubscription.plan.price[billingCycle]
                  ? 'Upgrade Plan'
                  : 'Change Plan'}
              </h3>
              <button onClick={() => setShowUpgradeModal(false)}>
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">
                  {selectedPlan.name} Plan
                </h4>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(selectedPlan.price[billingCycle])}
                  <span className="text-sm font-normal text-gray-500">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>

                {currentSubscription && (
                  <div className="mt-3 text-sm">
                    <p className="text-gray-600">
                      Current:{' '}
                      {formatCurrency(
                        currentSubscription.plan.price[billingCycle]
                      )}
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </p>
                    <p className="font-medium">
                      {selectedPlan.price[billingCycle] >
                      currentSubscription.plan.price[billingCycle]
                        ? 'Additional'
                        : 'Savings'}
                      :{' '}
                      {formatCurrency(
                        Math.abs(
                          selectedPlan.price[billingCycle] -
                            currentSubscription.plan.price[billingCycle]
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Your plan will be{' '}
                {currentSubscription &&
                selectedPlan.price[billingCycle] >
                  currentSubscription.plan.price[billingCycle]
                  ? 'upgraded'
                  : 'changed'}{' '}
                immediately.
                {currentSubscription &&
                  selectedPlan.price[billingCycle] >
                    currentSubscription.plan.price[billingCycle] &&
                  ' You will be charged a prorated amount for the remainder of this billing period.'}
              </p>

              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    // Handle plan change
                    setShowUpgradeModal(false);
                  }}
                >
                  Confirm Change
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && currentSubscription && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Cancel Subscription
              </h3>
              <button onClick={() => setShowCancelModal(false)}>
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      You're about to cancel your subscription
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Your subscription will remain active until{' '}
                      {formatDate(currentSubscription.currentPeriodEnd)}, then
                      you'll lose access to premium features.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Instead of canceling, would you like to downgrade to a lower
                plan? You can always upgrade again later.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    const starterPlan = subscriptionPlans.find(
                      (p) => p.tier === 'starter'
                    );
                    if (starterPlan) {
                      setSelectedPlan(starterPlan);
                      setShowCancelModal(false);
                      setShowUpgradeModal(true);
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Downgrade to Starter Plan
                </button>
                <button
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    // Handle cancellation
                    setShowCancelModal(false);
                  }}
                >
                  Cancel Subscription
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedBillingInterface;
