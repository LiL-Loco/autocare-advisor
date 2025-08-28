/**
 * Usage Tracking Service - AutoCare Advisor
 *
 * Handles all click, impression, and conversion tracking for the Pay-per-Click revenue model
 * Integrates with the existing billing system for real-time revenue updates
 */

import { Pool } from 'pg';
import billingPool from '../database/postgres';
import logger from '../utils/logger';

// Tracking Event Interfaces
export interface BaseTrackingEvent {
  partnerId: string;
  productId: string;
  sessionId: string;
  timestamp?: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  metadata?: any;
}

export interface ClickEvent extends BaseTrackingEvent {
  partnerUrl: string;
  recommendationRank?: number;
  matchScore?: number;
}

export interface ImpressionEvent extends BaseTrackingEvent {
  viewDuration?: number; // in seconds
  viewportPosition?: string; // 'above-fold', 'below-fold'
  batchSize?: number;
}

export interface ConversionEvent extends BaseTrackingEvent {
  conversionType: 'purchase' | 'lead' | 'signup';
  conversionValue?: number;
  orderId?: string;
}

// Usage Statistics Interface
export interface UsageStats {
  partnerId: string;
  period: string; // 'YYYY-MM' format
  impressions: number;
  clicks: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
  revenueGenerated: number;
  costPerClick: number;
  remainingClicks: number; // based on tier limits
  tier: string;
}

// Tier-based pricing configuration
export const TIER_PRICING = {
  basic: {
    costPerClick: 0.5,
    monthlyClickLimit: 1000,
  },
  professional: {
    costPerClick: 0.35,
    monthlyClickLimit: 5000,
  },
  enterprise: {
    costPerClick: 0.25,
    monthlyClickLimit: 15000,
  },
} as const;

export class TrackingService {
  private pool: Pool;
  private duplicateDetectionWindow = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() {
    this.pool = billingPool;
  }

  /**
   * Initialize tracking tables if they don't exist
   */
  async initializeTables(): Promise<void> {
    const createTrackingEventsTable = `
      CREATE TABLE IF NOT EXISTS tracking_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id UUID NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion')),
        session_id VARCHAR(100) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ip_address INET,
        user_agent TEXT,
        referrer TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const createUsageStatsTable = `
      CREATE TABLE IF NOT EXISTS monthly_usage_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id UUID NOT NULL,
        month VARCHAR(7) NOT NULL,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        revenue_generated DECIMAL(10,2) DEFAULT 0,
        tier_at_time VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(partner_id, month)
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_tracking_events_partner_timestamp 
        ON tracking_events(partner_id, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_tracking_events_session 
        ON tracking_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_tracking_events_product 
        ON tracking_events(product_id);
      CREATE INDEX IF NOT EXISTS idx_usage_stats_partner_month 
        ON monthly_usage_stats(partner_id, month);
    `;

    try {
      await this.pool.query(createTrackingEventsTable);
      await this.pool.query(createUsageStatsTable);
      await this.pool.query(createIndexes);

      logger.info('Tracking tables initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize tracking tables:', error);
      throw error;
    }
  }

  /**
   * Track a product click event
   */
  async trackClick(
    event: ClickEvent
  ): Promise<{ tracked: boolean; reason?: string }> {
    try {
      // Check for duplicate clicks (same partner, product, session within 5 minutes)
      const isDuplicate = await this.checkDuplicateClick(
        event.partnerId,
        event.productId,
        event.sessionId,
        event.ipAddress
      );

      if (isDuplicate) {
        logger.warn('Duplicate click detected, not tracking', {
          partnerId: event.partnerId,
          productId: event.productId,
          sessionId: event.sessionId,
        });
        return { tracked: false, reason: 'duplicate_click' };
      }

      // Get partner's current tier for pricing
      const partnerTier = await this.getPartnerTier(event.partnerId);
      const costPerClick =
        TIER_PRICING[partnerTier as keyof typeof TIER_PRICING]?.costPerClick ||
        TIER_PRICING.basic.costPerClick;

      // Insert tracking event
      const insertEventQuery = `
        INSERT INTO tracking_events (
          partner_id, product_id, event_type, session_id, 
          timestamp, ip_address, user_agent, referrer, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `;

      const eventResult = await this.pool.query(insertEventQuery, [
        event.partnerId,
        event.productId,
        'click',
        event.sessionId,
        event.timestamp || new Date(),
        event.ipAddress,
        event.userAgent,
        event.referrer,
        JSON.stringify({
          partnerUrl: event.partnerUrl,
          recommendationRank: event.recommendationRank,
          matchScore: event.matchScore,
          costPerClick,
        }),
      ]);

      // Update monthly usage stats
      await this.updateMonthlyStats(
        event.partnerId,
        'clicks',
        1,
        costPerClick,
        partnerTier
      );

      // Update real-time billing
      await this.updateBilling(event.partnerId, costPerClick);

      logger.info('Click tracked successfully', {
        eventId: eventResult.rows[0].id,
        partnerId: event.partnerId,
        productId: event.productId,
        costPerClick,
        tier: partnerTier,
      });

      return { tracked: true };
    } catch (error) {
      logger.error('Error tracking click:', error);
      throw error;
    }
  }

  /**
   * Track product impression events (can be batched)
   */
  async trackImpressions(
    events: ImpressionEvent[]
  ): Promise<{ tracked: number; skipped: number }> {
    let tracked = 0;
    let skipped = 0;

    try {
      for (const event of events) {
        // Insert impression event
        const insertEventQuery = `
          INSERT INTO tracking_events (
            partner_id, product_id, event_type, session_id,
            timestamp, ip_address, user_agent, referrer, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        try {
          await this.pool.query(insertEventQuery, [
            event.partnerId,
            event.productId,
            'impression',
            event.sessionId,
            event.timestamp || new Date(),
            event.ipAddress,
            event.userAgent,
            event.referrer,
            JSON.stringify({
              viewDuration: event.viewDuration,
              viewportPosition: event.viewportPosition,
              batchSize: event.batchSize,
            }),
          ]);

          // Update monthly stats for impressions (no cost)
          const partnerTier = await this.getPartnerTier(event.partnerId);
          await this.updateMonthlyStats(
            event.partnerId,
            'impressions',
            1,
            0,
            partnerTier
          );

          tracked++;
        } catch (error) {
          logger.warn('Failed to track impression:', {
            partnerId: event.partnerId,
            productId: event.productId,
            error: error instanceof Error ? error.message : error,
          });
          skipped++;
        }
      }

      logger.info('Impressions batch processed', {
        totalEvents: events.length,
        tracked,
        skipped,
      });

      return { tracked, skipped };
    } catch (error) {
      logger.error('Error tracking impressions:', error);
      throw error;
    }
  }

  /**
   * Track conversion events
   */
  async trackConversion(event: ConversionEvent): Promise<void> {
    try {
      const insertEventQuery = `
        INSERT INTO tracking_events (
          partner_id, product_id, event_type, session_id,
          timestamp, ip_address, user_agent, referrer, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      await this.pool.query(insertEventQuery, [
        event.partnerId,
        event.productId,
        'conversion',
        event.sessionId,
        event.timestamp || new Date(),
        event.ipAddress,
        event.userAgent,
        event.referrer,
        JSON.stringify({
          conversionType: event.conversionType,
          conversionValue: event.conversionValue,
          orderId: event.orderId,
        }),
      ]);

      // Update monthly stats for conversions
      const partnerTier = await this.getPartnerTier(event.partnerId);
      await this.updateMonthlyStats(
        event.partnerId,
        'conversions',
        1,
        0,
        partnerTier
      );

      logger.info('Conversion tracked successfully', {
        partnerId: event.partnerId,
        productId: event.productId,
        conversionType: event.conversionType,
        conversionValue: event.conversionValue,
      });
    } catch (error) {
      logger.error('Error tracking conversion:', error);
      throw error;
    }
  }

  /**
   * Get usage statistics for a partner
   */
  async getUsageStats(
    partnerId: string,
    period?: string
  ): Promise<UsageStats[]> {
    try {
      const currentMonth = period || new Date().toISOString().substring(0, 7); // YYYY-MM

      const query = `
        SELECT 
          partner_id,
          month,
          impressions,
          clicks,
          conversions,
          revenue_generated,
          tier_at_time,
          CASE 
            WHEN impressions > 0 THEN ROUND((clicks::DECIMAL / impressions) * 100, 2)
            ELSE 0
          END as click_through_rate,
          CASE 
            WHEN clicks > 0 THEN ROUND((conversions::DECIMAL / clicks) * 100, 2)
            ELSE 0
          END as conversion_rate
        FROM monthly_usage_stats 
        WHERE partner_id = $1 
        ${period ? 'AND month = $2' : ''}
        ORDER BY month DESC
        LIMIT 12
      `;

      const params = period ? [partnerId, period] : [partnerId];
      const result = await this.pool.query(query, params);

      return result.rows.map((row) => {
        const tierConfig =
          TIER_PRICING[row.tier_at_time as keyof typeof TIER_PRICING] ||
          TIER_PRICING.basic;

        return {
          partnerId: row.partner_id,
          period: row.month,
          impressions: parseInt(row.impressions),
          clicks: parseInt(row.clicks),
          conversions: parseInt(row.conversions),
          clickThroughRate: parseFloat(row.click_through_rate),
          conversionRate: parseFloat(row.conversion_rate),
          revenueGenerated: parseFloat(row.revenue_generated),
          costPerClick: tierConfig.costPerClick,
          remainingClicks: Math.max(
            0,
            tierConfig.monthlyClickLimit - parseInt(row.clicks)
          ),
          tier: row.tier_at_time,
        };
      });
    } catch (error) {
      logger.error('Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Check if a click is a duplicate within the detection window
   */
  private async checkDuplicateClick(
    partnerId: string,
    productId: string,
    sessionId: string,
    ipAddress?: string
  ): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - this.duplicateDetectionWindow);

    const query = `
      SELECT COUNT(*) as count
      FROM tracking_events 
      WHERE partner_id = $1 
        AND product_id = $2 
        AND event_type = 'click'
        AND (session_id = $3 ${ipAddress ? 'OR ip_address = $4' : ''})
        AND timestamp > $${ipAddress ? '5' : '4'}
    `;

    const params = ipAddress
      ? [partnerId, productId, sessionId, ipAddress, cutoffTime]
      : [partnerId, productId, sessionId, cutoffTime];

    const result = await this.pool.query(query, params);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Update monthly usage statistics
   */
  private async updateMonthlyStats(
    partnerId: string,
    statType: 'impressions' | 'clicks' | 'conversions',
    increment: number,
    revenue: number,
    tier: string
  ): Promise<void> {
    const currentMonth = new Date().toISOString().substring(0, 7);

    const upsertQuery = `
      INSERT INTO monthly_usage_stats (partner_id, month, ${statType}, revenue_generated, tier_at_time)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (partner_id, month) 
      DO UPDATE SET 
        ${statType} = monthly_usage_stats.${statType} + $3,
        revenue_generated = monthly_usage_stats.revenue_generated + $4,
        updated_at = NOW()
    `;

    await this.pool.query(upsertQuery, [
      partnerId,
      currentMonth,
      increment,
      revenue,
      tier,
    ]);
  }

  /**
   * Update billing for click charges
   */
  private async updateBilling(
    partnerId: string,
    amount: number
  ): Promise<void> {
    try {
      // Add charge to partner's account
      const insertChargeQuery = `
        INSERT INTO billing_transactions (
          user_id, amount, currency, type, description, status, created_at
        ) VALUES ($1, $2, 'EUR', 'charge', 'Product click charge', 'completed', NOW())
      `;

      await this.pool.query(insertChargeQuery, [partnerId, amount]);

      logger.info('Billing updated for click charge', {
        partnerId,
        amount,
      });
    } catch (error) {
      logger.error('Error updating billing:', error);
      // Don't throw - tracking should continue even if billing update fails
    }
  }

  /**
   * Get partner's current tier from user table
   */
  private async getPartnerTier(partnerId: string): Promise<string> {
    try {
      const query = `
        SELECT subscription_tier 
        FROM users 
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [partnerId]);
      return result.rows[0]?.subscription_tier || 'basic';
    } catch (error) {
      logger.warn('Could not get partner tier, defaulting to basic:', error);
      return 'basic';
    }
  }
}

// Export singleton instance
export const trackingService = new TrackingService();
