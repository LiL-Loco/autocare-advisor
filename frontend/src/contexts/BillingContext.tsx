'use client';

/**
 * Billing Context - Payment & Subscription Management
 * AutoCare Advisor - Frontend Payment System
 *
 * React context for managing subscriptions, payments, and billing operations
 * with Stripe integration and comprehensive error handling.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Initialize Stripe only if we have a valid publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidStripeKey =
  stripePublishableKey &&
  !stripePublishableKey.includes('your-stripe') &&
  stripePublishableKey.length > 20;

const stripePromise = hasValidStripeKey
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null);

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// TypeScript interfaces
export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    monthlyImpressions: string | number;
    analyticsRetention: string;
    supportLevel: string;
  };
}

export interface SubscriptionData {
  tier: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    impressions: number;
    qualifiedClicks: number;
    apiCalls: number;
    remainingImpressions: number;
  };
  nextInvoice?: {
    amount: number;
    date: string;
    items: Array<{
      description: string;
      amount: number;
      quantity?: number;
    }>;
  };
}

export interface UsageData {
  month: string;
  overageCharges: number;
  currency: string;
}

interface BillingContextType {
  // Stripe
  stripe: Stripe | null;

  // Subscription data
  subscriptionTiers: SubscriptionTier[];
  currentSubscription: SubscriptionData | null;
  usage: UsageData | null;

  // Loading states
  isLoading: boolean;
  isCreatingSubscription: boolean;
  isUpdatingSubscription: boolean;

  // Error handling
  error: string | null;

  // Methods
  loadSubscriptionTiers: () => Promise<void>;
  loadCurrentSubscription: () => Promise<void>;
  loadUsage: (month?: string) => Promise<void>;
  startFreeTrial: () => Promise<boolean>;
  createSubscription: (
    tier: string,
    paymentMethodId: string
  ) => Promise<boolean>;
  updateSubscription: (newTier: string) => Promise<boolean>;
  cancelSubscription: (immediately?: boolean) => Promise<boolean>;
  trackUsage: (
    impressions?: number,
    qualifiedClicks?: number,
    apiCalls?: number
  ) => Promise<void>;
  clearError: () => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

interface BillingProviderProps {
  children: React.ReactNode;
}

export function BillingProvider({ children }: BillingProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<
    SubscriptionTier[]
  >([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Stripe on component mount
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
        if (!stripeInstance && isDevelopment) {
          console.warn(
            'Stripe not initialized - using development mode without payment processing'
          );
        }
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        if (!isDevelopment) {
          setError('Failed to initialize payment system');
        }
      }
    };

    initializeStripe();
  }, []);

  // Load subscription tiers from API
  const loadSubscriptionTiers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/billing/subscription-tiers`
      );

      if (!response.ok) {
        throw new Error('Failed to load subscription tiers');
      }

      const result = await response.json();

      if (result.success) {
        setSubscriptionTiers(result.data);
      } else {
        throw new Error(result.error || 'Failed to load subscription tiers');
      }
    } catch (error) {
      console.error('Error loading subscription tiers:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load current subscription data
  const loadCurrentSubscription = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/billing/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        // No subscription found - this is normal for new users
        setCurrentSubscription(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load subscription data');
      }

      const result = await response.json();

      if (result.success) {
        setCurrentSubscription(result.data);
      } else {
        throw new Error(result.error || 'Failed to load subscription data');
      }
    } catch (error) {
      console.error('Error loading current subscription:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load usage data
  const loadUsage = async (month?: string): Promise<void> => {
    try {
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = month
        ? `${API_BASE_URL}/api/billing/usage/${month}`
        : `${API_BASE_URL}/api/billing/usage`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load usage data');
      }

      const result = await response.json();

      if (result.success) {
        setUsage(result.data);
      } else {
        throw new Error(result.error || 'Failed to load usage data');
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Start free trial
  const startFreeTrial = async (): Promise<boolean> => {
    try {
      setIsCreatingSubscription(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/billing/start-trial`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start free trial');
      }

      const result = await response.json();

      if (result.success) {
        // Reload subscription data
        await loadCurrentSubscription();
        return true;
      } else {
        throw new Error(result.error || 'Failed to start free trial');
      }
    } catch (error) {
      console.error('Error starting free trial:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  // Create paid subscription
  const createSubscription = async (
    tier: string,
    paymentMethodId: string
  ): Promise<boolean> => {
    try {
      setIsCreatingSubscription(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/billing/create-subscription`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier,
            paymentMethodId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const result = await response.json();

      if (result.success) {
        // Handle payment confirmation if needed
        if (result.data.clientSecret) {
          // Payment requires confirmation (3D Secure, etc.)
          if (!stripe) {
            throw new Error('Stripe not initialized');
          }

          const { error: confirmError } = await stripe.confirmCardPayment(
            result.data.clientSecret
          );

          if (confirmError) {
            throw new Error(
              confirmError.message || 'Payment confirmation failed'
            );
          }
        }

        // Reload subscription data
        await loadCurrentSubscription();
        return true;
      } else {
        throw new Error(result.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  // Update subscription (upgrade/downgrade)
  const updateSubscription = async (newTier: string): Promise<boolean> => {
    try {
      setIsUpdatingSubscription(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/billing/update-subscription`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier: newTier,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      const result = await response.json();

      if (result.success) {
        // Reload subscription data
        await loadCurrentSubscription();
        return true;
      } else {
        throw new Error(result.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (immediately = false): Promise<boolean> => {
    try {
      setIsUpdatingSubscription(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/billing/cancel-subscription?immediately=${immediately}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();

      if (result.success) {
        // Reload subscription data
        await loadCurrentSubscription();
        return true;
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  // Track usage
  const trackUsage = async (
    impressions = 0,
    qualifiedClicks = 0,
    apiCalls = 0
  ): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await fetch(`${API_BASE_URL}/api/billing/track-usage`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          impressions,
          qualifiedClicks,
          apiCalls,
        }),
      });

      // Optionally reload usage data
      await loadUsage();
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Don't set error for usage tracking as it's often background
    }
  };

  // Clear error
  const clearError = (): void => {
    setError(null);
  };

  const contextValue: BillingContextType = {
    stripe,
    subscriptionTiers,
    currentSubscription,
    usage,
    isLoading,
    isCreatingSubscription,
    isUpdatingSubscription,
    error,
    loadSubscriptionTiers,
    loadCurrentSubscription,
    loadUsage,
    startFreeTrial,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    trackUsage,
    clearError,
  };

  return (
    <BillingContext.Provider value={contextValue}>
      {children}
    </BillingContext.Provider>
  );
}

// Custom hook to use billing context
export function useBilling(): BillingContextType {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}

export default BillingContext;
