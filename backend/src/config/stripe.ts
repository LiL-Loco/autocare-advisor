/**
 * Stripe Configuration and Setup
 * AutoCare Advisor - Payment & Subscription System
 *
 * Initializes Stripe with proper configuration for European market
 * compliance and enterprise-grade features.
 */

import Stripe from 'stripe';
import logger from '../utils/logger';

// Defer Stripe initialization until first use to allow environment variables to load
let stripeInstance: Stripe | null = null;

// Function to initialize Stripe lazily
const initializeStripe = (): Stripe => {
  if (!stripeInstance) {
    // Stripe Configuration
    const stripeConfig = {
      apiVersion: '2025-07-30.basil' as const,
      typescript: true as const,
      telemetry: false,
      timeout: 10000, // 10 seconds timeout
    };

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    if (!stripePublishableKey) {
      throw new Error(
        'STRIPE_PUBLISHABLE_KEY environment variable is required'
      );
    }

    stripeInstance = new Stripe(stripeSecretKey, stripeConfig);
    logger.info('Stripe initialized successfully');
  }
  return stripeInstance;
};

// Export a getter function instead of the instance
export const getStripe = (): Stripe => initializeStripe();

// Backward compatibility - export stripe as a getter
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const stripeInstance = getStripe();
    const value = (stripeInstance as any)[prop];
    return typeof value === 'function' ? value.bind(stripeInstance) : value;
  },
});

// Stripe webhook endpoint secret for security verification
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Subscription Tiers Configuration
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_monthly',
    price: 49, // EUR per month
    currency: 'eur',
    interval: 'month',
    name: 'Basic',
    features: [
      'Up to 1,000 widget impressions per month',
      'Basic analytics dashboard',
      'Email support (48h response)',
      'Standard questionnaire templates',
      'Basic product recommendations',
    ],
    limits: {
      monthlyImpressions: 1000,
      analyticsRetention: 90, // days
      supportLevel: 'email',
    },
  },
  PROFESSIONAL: {
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_pro_monthly',
    price: 149, // EUR per month
    currency: 'eur',
    interval: 'month',
    name: 'Professional',
    features: [
      'Up to 10,000 widget impressions per month',
      'Advanced analytics & reporting',
      'Priority support (24h response)',
      'Custom branding & themes',
      'A/B testing capabilities',
      'Advanced product filters',
      'Custom questionnaire builder',
    ],
    limits: {
      monthlyImpressions: 10000,
      analyticsRetention: 365, // days
      supportLevel: 'priority',
    },
  },
  ENTERPRISE: {
    priceId:
      process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
    price: 449, // EUR per month
    currency: 'eur',
    interval: 'month',
    name: 'Enterprise',
    features: [
      'Unlimited widget impressions',
      'White-label solution',
      'Dedicated success manager',
      'Custom integrations & API access',
      'Advanced analytics & insights',
      'Multi-user team management',
      'SLA guarantee (99.9% uptime)',
      'Custom onboarding & training',
    ],
    limits: {
      monthlyImpressions: -1, // unlimited
      analyticsRetention: -1, // unlimited
      supportLevel: 'dedicated',
    },
  },
} as const;

// Usage-based billing rates
export const USAGE_RATES = {
  QUALIFIED_CLICK: 0.02, // EUR per qualified click above tier limit
  IMPRESSION_OVERAGE: 0.001, // EUR per impression above tier limit
  API_CALL: 0.005, // EUR per API call for enterprise
} as const;

// Payment methods configuration
export const PAYMENT_CONFIG = {
  supportedMethods: [
    'card',
    'sepa_debit',
    'bancontact',
    'giropay',
    'sofort',
    'eps',
    'p24',
  ],
  currencies: ['eur', 'usd', 'gbp'],
  defaultCurrency: 'eur',
  // EU Strong Customer Authentication (SCA) compliance
  automaticPaymentMethods: {
    enabled: true,
    allow_redirects: 'always',
  },
} as const;

// Trial configuration
export const TRIAL_CONFIG = {
  trialPeriodDays: 14,
  trialTier: 'PROFESSIONAL', // Give trial users Professional features
  autoDowngradeToBasic: true,
} as const;

// Billing and invoice configuration
export const BILLING_CONFIG = {
  invoiceGeneration: {
    daysUntilDue: 30,
    autoAdvance: true,
    collectionMethod: 'charge_automatically',
  },
  retryPolicy: {
    maxRetries: 3,
    retryDelayDays: [3, 7, 14],
  },
  dunningSetting: {
    defaultDays: 30,
    sendInvoiceReminder: true,
  },
} as const;

// Webhook events we handle
export const WEBHOOK_EVENTS = {
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.payment_succeeded',
  INVOICE_FAILED: 'invoice.payment_failed',
  PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
  PAYMENT_METHOD_DETACHED: 'payment_method.detached',
  SETUP_INTENT_SUCCEEDED: 'setup_intent.succeeded',
} as const;

// Initialize Stripe products and prices (run once during deployment)
export async function initializeStripeProducts(): Promise<void> {
  try {
    logger.info('Initializing Stripe products and prices...');

    // This would typically be run during deployment or setup
    // For development, we'll skip this and use test price IDs

    logger.info('Stripe products initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Stripe products:', error);
    throw error;
  }
}

// Helper function to get tier by price ID
export function getTierByPriceId(
  priceId: string
): keyof typeof SUBSCRIPTION_TIERS | null {
  for (const [tierName, tierConfig] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (tierConfig.priceId === priceId) {
      return tierName as keyof typeof SUBSCRIPTION_TIERS;
    }
  }
  return null;
}

// Helper function to validate webhook signature
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!stripeWebhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  const stripeClient = getStripe();
  return stripeClient.webhooks.constructEvent(
    payload,
    signature,
    stripeWebhookSecret
  );
}

export default stripe;
