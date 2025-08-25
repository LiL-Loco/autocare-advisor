/**
 * Billing Service - Core Payment & Subscription Logic
 * AutoCare Advisor - Payment & Subscription System
 *
 * Handles all billing operations including subscription management,
 * payment processing, usage tracking, and invoice generation.
 */

import { Pool } from 'pg';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import {
  stripe,
  SUBSCRIPTION_TIERS,
  TRIAL_CONFIG,
  USAGE_RATES,
} from '../config/stripe';
import logger from '../utils/logger';

// TypeScript interfaces for our billing system
export interface BillingCustomer {
  id: string;
  userId: string;
  stripeCustomerId: string;
  email: string;
  name: string;
  subscriptionId?: string;
  subscriptionStatus?: Stripe.Subscription.Status;
  currentTier?: keyof typeof SUBSCRIPTION_TIERS;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM format
  impressions: number;
  qualifiedClicks: number;
  apiCalls: number;
  overageCharges: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionData {
  tier: keyof typeof SUBSCRIPTION_TIERS;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  usage: {
    impressions: number;
    qualifiedClicks: number;
    apiCalls: number;
    remainingImpressions: number;
  };
  nextInvoice?: {
    amount: number;
    date: Date;
    items: Array<{
      description: string;
      amount: number;
      quantity?: number;
    }>;
  };
}

export class BillingService {
  private db: Pool;

  constructor(database: Pool) {
    this.db = database;
  }

  /**
   * Create a new Stripe customer and billing record
   */
  async createCustomer(
    userId: string,
    email: string,
    name: string
  ): Promise<BillingCustomer> {
    try {
      logger.info(`Creating Stripe customer for user: ${userId}`);

      // Create customer in Stripe
      const stripeCustomer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
          platform: 'autocare-advisor',
        },
      });

      // Create billing record in our database
      const billingCustomer: BillingCustomer = {
        id: uuidv4(),
        userId,
        stripeCustomerId: stripeCustomer.id,
        email,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.db.query(
        `
        INSERT INTO billing_customers (
          id, user_id, stripe_customer_id, email, name, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          billingCustomer.id,
          billingCustomer.userId,
          billingCustomer.stripeCustomerId,
          billingCustomer.email,
          billingCustomer.name,
          billingCustomer.createdAt,
          billingCustomer.updatedAt,
        ]
      );

      logger.info(`Stripe customer created successfully: ${stripeCustomer.id}`);
      return billingCustomer;
    } catch (error) {
      logger.error('Failed to create Stripe customer:', error);
      throw new Error('Failed to create billing customer');
    }
  }

  /**
   * Start a free trial subscription
   */
  async startFreeTrial(userId: string): Promise<Stripe.Subscription> {
    try {
      const customer = await this.getBillingCustomer(userId);
      if (!customer) {
        throw new Error('Billing customer not found');
      }

      const trialTierConfig = SUBSCRIPTION_TIERS[TRIAL_CONFIG.trialTier];

      const subscription = await stripe.subscriptions.create({
        customer: customer.stripeCustomerId,
        items: [
          {
            price: trialTierConfig.priceId,
          },
        ],
        trial_period_days: TRIAL_CONFIG.trialPeriodDays,
        metadata: {
          userId,
          tier: TRIAL_CONFIG.trialTier,
          isTrial: 'true',
        },
      });

      // Update our database
      await this.updateBillingCustomer(userId, {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentTier: TRIAL_CONFIG.trialTier,
        trialEndsAt: new Date(subscription.trial_end! * 1000),
      });

      logger.info(`Free trial started for user ${userId}: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to start free trial:', error);
      throw error;
    }
  }

  /**
   * Create a paid subscription
   */
  async createSubscription(
    userId: string,
    tier: keyof typeof SUBSCRIPTION_TIERS,
    paymentMethodId: string
  ): Promise<Stripe.Subscription> {
    try {
      const customer = await this.getBillingCustomer(userId);
      if (!customer) {
        throw new Error('Billing customer not found');
      }

      const tierConfig = SUBSCRIPTION_TIERS[tier];

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.stripeCustomerId,
      });

      // Set as default payment method
      await stripe.customers.update(customer.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.stripeCustomerId,
        items: [
          {
            price: tierConfig.priceId,
          },
        ],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          tier,
        },
      });

      // Update our database
      await this.updateBillingCustomer(userId, {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentTier: tier,
      });

      logger.info(
        `Subscription created for user ${userId}: ${subscription.id}`
      );
      return subscription;
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Update an existing subscription (upgrade/downgrade)
   */
  async updateSubscription(
    userId: string,
    newTier: keyof typeof SUBSCRIPTION_TIERS
  ): Promise<Stripe.Subscription> {
    try {
      const customer = await this.getBillingCustomer(userId);
      if (!customer || !customer.subscriptionId) {
        throw new Error('Active subscription not found');
      }

      const newTierConfig = SUBSCRIPTION_TIERS[newTier];

      // Get current subscription
      const subscription = await stripe.subscriptions.retrieve(
        customer.subscriptionId
      );

      // Update subscription with new price
      const updatedSubscription = await stripe.subscriptions.update(
        customer.subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: newTierConfig.priceId,
            },
          ],
          proration_behavior: 'create_prorations',
          metadata: {
            ...subscription.metadata,
            tier: newTier,
            previousTier: customer.currentTier || 'unknown',
          },
        }
      );

      // Update our database
      await this.updateBillingCustomer(userId, {
        currentTier: newTier,
        subscriptionStatus: updatedSubscription.status,
      });

      logger.info(
        `Subscription updated for user ${userId}: ${customer.currentTier} -> ${newTier}`
      );
      return updatedSubscription;
    } catch (error) {
      logger.error('Failed to update subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(
    userId: string,
    immediately = false
  ): Promise<Stripe.Subscription> {
    try {
      const customer = await this.getBillingCustomer(userId);
      if (!customer || !customer.subscriptionId) {
        throw new Error('Active subscription not found');
      }

      let canceledSubscription: Stripe.Subscription;

      if (immediately) {
        // Cancel immediately
        canceledSubscription = await stripe.subscriptions.cancel(
          customer.subscriptionId
        );
      } else {
        // Cancel at period end
        canceledSubscription = await stripe.subscriptions.update(
          customer.subscriptionId,
          {
            cancel_at_period_end: true,
          }
        );
      }

      // Update our database
      await this.updateBillingCustomer(userId, {
        subscriptionStatus: canceledSubscription.status,
      });

      logger.info(
        `Subscription canceled for user ${userId}: ${customer.subscriptionId}`
      );
      return canceledSubscription;
    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  /**
   * Track usage for a user (impressions, clicks, API calls)
   */
  async trackUsage(
    userId: string,
    impressions: number = 0,
    qualifiedClicks: number = 0,
    apiCalls: number = 0
  ): Promise<void> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      // Upsert usage record
      await this.db.query(
        `
        INSERT INTO usage_records (
          id, user_id, month, impressions, qualified_clicks, api_calls, created_at, updated_at
        ) VALUES (
          COALESCE((SELECT id FROM usage_records WHERE user_id = $1 AND month = $2), $3),
          $1, $2, $4, $5, $6, NOW(), NOW()
        ) ON CONFLICT (user_id, month) DO UPDATE SET
          impressions = usage_records.impressions + $4,
          qualified_clicks = usage_records.qualified_clicks + $5,
          api_calls = usage_records.api_calls + $6,
          updated_at = NOW()
      `,
        [userId, currentMonth, uuidv4(), impressions, qualifiedClicks, apiCalls]
      );
    } catch (error) {
      logger.error('Failed to track usage:', error);
      throw error;
    }
  }

  /**
   * Calculate overage charges for a user
   */
  async calculateOverageCharges(
    userId: string,
    month?: string
  ): Promise<number> {
    try {
      const targetMonth = month || new Date().toISOString().slice(0, 7);

      const customer = await this.getBillingCustomer(userId);
      if (!customer?.currentTier) {
        return 0;
      }

      const usage = await this.getUsage(userId, targetMonth);
      const tierLimits = SUBSCRIPTION_TIERS[customer.currentTier].limits;

      let overageCharges = 0;

      // Calculate impression overages
      if (
        tierLimits.monthlyImpressions > 0 &&
        usage.impressions > tierLimits.monthlyImpressions
      ) {
        const overageImpressions =
          usage.impressions - tierLimits.monthlyImpressions;
        overageCharges += overageImpressions * USAGE_RATES.IMPRESSION_OVERAGE;
      }

      // Calculate qualified click charges (if applicable for the tier)
      if (customer.currentTier === 'BASIC') {
        overageCharges += usage.qualifiedClicks * USAGE_RATES.QUALIFIED_CLICK;
      }

      // Calculate API call charges (for enterprise)
      if (customer.currentTier === 'ENTERPRISE') {
        overageCharges += usage.apiCalls * USAGE_RATES.API_CALL;
      }

      return Math.round(overageCharges * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      logger.error('Failed to calculate overage charges:', error);
      throw error;
    }
  }

  /**
   * Get subscription data for a user
   */
  async getSubscriptionData(userId: string): Promise<SubscriptionData | null> {
    try {
      const customer = await this.getBillingCustomer(userId);
      if (!customer || !customer.subscriptionId) {
        return null;
      }

      const subscription = await stripe.subscriptions.retrieve(
        customer.subscriptionId,
        {
          expand: ['upcoming_invoice'],
        }
      );

      const currentMonth = new Date().toISOString().slice(0, 7);
      const usage = await this.getUsage(userId, currentMonth);
      const tierLimits = SUBSCRIPTION_TIERS[customer.currentTier!].limits;

      const subscriptionData: SubscriptionData = {
        tier: customer.currentTier!,
        status: subscription.status,
        currentPeriodStart: new Date(
          (subscription as any).current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000
        ),
        trialEnd: (subscription as any).trial_end
          ? new Date((subscription as any).trial_end * 1000)
          : undefined,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        usage: {
          impressions: usage.impressions,
          qualifiedClicks: usage.qualifiedClicks,
          apiCalls: usage.apiCalls,
          remainingImpressions:
            tierLimits.monthlyImpressions > 0
              ? Math.max(0, tierLimits.monthlyImpressions - usage.impressions)
              : -1,
        },
      };

      // Add next invoice information if available
      if ((subscription as any).upcoming_invoice) {
        const upcomingInvoice = (subscription as any)
          .upcoming_invoice as Stripe.Invoice;
        subscriptionData.nextInvoice = {
          amount: (upcomingInvoice as any).amount_total / 100, // Convert from cents
          date: new Date((upcomingInvoice as any).period_end * 1000),
          items: upcomingInvoice.lines.data.map((item) => ({
            description: item.description || '',
            amount: item.amount / 100,
            quantity: item.quantity || undefined,
          })),
        };
      }

      return subscriptionData;
    } catch (error) {
      logger.error('Failed to get subscription data:', error);
      throw error;
    }
  }

  // Helper methods
  private async getBillingCustomer(
    userId: string
  ): Promise<BillingCustomer | null> {
    try {
      const result = await this.db.query(
        `
        SELECT * FROM billing_customers WHERE user_id = $1
      `,
        [userId]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get billing customer:', error);
      return null;
    }
  }

  private async updateBillingCustomer(
    userId: string,
    updates: Partial<BillingCustomer>
  ): Promise<void> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${this.camelToSnake(key)} = $${index + 2}`)
        .join(', ');

      const values = [userId, ...Object.values(updates), new Date()];

      await this.db.query(
        `
        UPDATE billing_customers 
        SET ${setClause}, updated_at = $${values.length}
        WHERE user_id = $1
      `,
        values
      );
    } catch (error) {
      logger.error('Failed to update billing customer:', error);
      throw error;
    }
  }

  private async getUsage(userId: string, month: string): Promise<UsageRecord> {
    try {
      const result = await this.db.query(
        `
        SELECT * FROM usage_records WHERE user_id = $1 AND month = $2
      `,
        [userId, month]
      );

      return (
        result.rows[0] || {
          id: '',
          userId,
          month,
          impressions: 0,
          qualifiedClicks: 0,
          apiCalls: 0,
          overageCharges: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    } catch (error) {
      logger.error('Failed to get usage:', error);
      throw error;
    }
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

export default BillingService;
