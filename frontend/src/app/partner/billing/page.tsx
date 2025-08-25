'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useBilling } from '../../../contexts/BillingContext';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function BillingPage() {
  const {
    subscriptionTiers,
    currentSubscription,
    usage,
    isLoading,
    error,
    loadSubscriptionTiers,
    loadCurrentSubscription,
    loadUsage,
    clearError,
  } = useBilling();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'plans' | 'usage' | 'payment'
  >('overview');

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadSubscriptionTiers(),
        loadCurrentSubscription(),
        loadUsage(),
      ]);
    };
    loadData();
  }, [loadSubscriptionTiers, loadCurrentSubscription, loadUsage]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Billing Data
            </h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="mt-4 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              💳 Billing & Subscription
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your subscription and billing settings
            </p>
          </div>

          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'plans', name: 'Plans', icon: '📋' },
                { id: 'usage', name: 'Usage', icon: '📈' },
                { id: 'payment', name: 'Payment', icon: '💳' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Subscription Overview
                  </h2>
                  {currentSubscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">
                          Current Plan
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          {currentSubscription.tier}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Status: {currentSubscription.status}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">
                          Monthly Usage
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          {currentSubscription.usage.impressions.toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Widget impressions
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">
                          Next Billing
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          {currentSubscription.nextInvoice
                            ? `€${currentSubscription.nextInvoice.amount}`
                            : 'N/A'}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {currentSubscription.nextInvoice
                            ? new Date(
                                currentSubscription.nextInvoice.date
                              ).toLocaleDateString()
                            : 'No invoice'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Active Subscription
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start with a free trial or choose a plan.
                      </p>
                      <button
                        onClick={() => setActiveTab('plans')}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700"
                      >
                        View Plans
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Available Plans
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`border rounded-lg p-6 ${
                          currentSubscription?.tier === tier.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <h3 className="text-lg font-bold text-gray-900">
                          {tier.name}
                        </h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">
                            €{tier.price}
                          </span>
                          <span className="text-gray-600">
                            /{tier.interval}
                          </span>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {tier.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <svg
                                className="h-4 w-4 text-emerald-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          {currentSubscription?.tier === tier.id ? (
                            <span className="text-emerald-600 font-medium">
                              Current Plan
                            </span>
                          ) : (
                            <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
                              {currentSubscription
                                ? 'Switch Plan'
                                : 'Get Started'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Usage Details
                  </h2>
                  {usage ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">
                        This Month ({usage.month})
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Overage charges: €{usage.overageCharges.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">No usage data available</p>
                  )}
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Payment Methods
                  </h2>
                  <p className="text-gray-600">
                    Payment method management coming soon...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Elements>
  );
}
