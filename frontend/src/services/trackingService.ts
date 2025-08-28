/**
 * Tracking Service - Frontend
 *
 * Client-side service for tracking product clicks, impressions, and conversions
 * Integrates with the Pay-per-Click revenue system
 */

import { v4 as uuidv4 } from 'uuid';

// Session management
let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = uuidv4();
    // Store in sessionStorage to persist across page reloads
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('autocare_session_id', sessionId);
    }
  }
  return sessionId;
};

// Initialize session from storage if available
if (typeof window !== 'undefined' && window.sessionStorage) {
  const storedSessionId = sessionStorage.getItem('autocare_session_id');
  if (storedSessionId) {
    sessionId = storedSessionId;
  }
}

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Interfaces
export interface ClickTrackingData {
  productId: string;
  partnerUrl: string;
  recommendationRank?: number;
  matchScore?: number;
  metadata?: any;
}

export interface ImpressionTrackingData {
  productId: string;
  viewDuration?: number;
  viewportPosition?: 'above-fold' | 'below-fold' | 'unknown';
  metadata?: any;
}

export interface ConversionTrackingData {
  productId: string;
  conversionType: 'purchase' | 'lead' | 'signup';
  conversionValue?: number;
  orderId?: string;
  metadata?: any;
}

export interface UsageStats {
  partnerId: string;
  period: string;
  impressions: number;
  clicks: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
  revenueGenerated: number;
  costPerClick: number;
  remainingClicks: number;
  tier: string;
}

/**
 * Tracking Service Class
 */
export class TrackingService {
  private authToken: string | null = null;
  private trackingQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  constructor(token?: string) {
    if (token) {
      this.authToken = token;
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Track a product click
   */
  async trackClick(
    data: ClickTrackingData
  ): Promise<{ success: boolean; tracked: boolean; reason?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/click`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...data,
          sessionId: getSessionId(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Click tracking failed:', result);
        return { success: false, tracked: false, reason: result.message };
      }

      return result;
    } catch (error) {
      console.error('Click tracking error:', error);
      return { success: false, tracked: false, reason: 'network_error' };
    }
  }

  /**
   * Track multiple product impressions
   */
  async trackImpressions(
    impressions: ImpressionTrackingData[]
  ): Promise<{ success: boolean; tracked: number; skipped: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/impressions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          impressions: impressions.map((impression) => ({
            ...impression,
            sessionId: impression.metadata?.sessionId || getSessionId(),
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Impression tracking failed:', result);
        return { success: false, tracked: 0, skipped: impressions.length };
      }

      return result;
    } catch (error) {
      console.error('Impression tracking error:', error);
      return { success: false, tracked: 0, skipped: impressions.length };
    }
  }

  /**
   * Track a conversion event
   */
  async trackConversion(
    data: ConversionTrackingData
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/conversion`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...data,
          sessionId: getSessionId(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Conversion tracking failed:', result);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Conversion tracking error:', error);
      return { success: false };
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(period?: string): Promise<UsageStats[]> {
    try {
      const url = new URL(`${API_BASE_URL}/tracking/stats`);
      if (period) {
        url.searchParams.set('period', period);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to get usage stats:', result);
        return [];
      }

      return result.data || [];
    } catch (error) {
      console.error('Usage stats error:', error);
      return [];
    }
  }

  /**
   * Queue a tracking operation for retry
   */
  private queueTracking(trackingFn: () => Promise<void>): void {
    this.trackingQueue.push(trackingFn);
    this.processQueue();
  }

  /**
   * Process queued tracking operations
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.trackingQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.trackingQueue.length > 0) {
      const trackingFn = this.trackingQueue.shift();
      if (trackingFn) {
        try {
          await trackingFn();
        } catch (error) {
          console.error('Queued tracking operation failed:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }
}

// Intersection Observer for impression tracking
export class ImpressionObserver {
  private observer: IntersectionObserver | null = null;
  private trackingService: TrackingService;
  private observedElements = new Map<Element, ImpressionTrackingData>();
  private impressionQueue: ImpressionTrackingData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(trackingService: TrackingService) {
    this.trackingService = trackingService;
    this.initializeObserver();
    this.startFlushInterval();
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const data = this.observedElements.get(entry.target);
            if (data) {
              const viewportPosition =
                entry.boundingClientRect.top < window.innerHeight * 0.5
                  ? 'above-fold'
                  : 'below-fold';

              this.impressionQueue.push({
                ...data,
                viewportPosition,
                metadata: {
                  ...data.metadata,
                  intersectionRatio: entry.intersectionRatio,
                  viewportHeight: window.innerHeight,
                  elementHeight: entry.boundingClientRect.height,
                },
              });

              // Stop observing this element
              this.observer?.unobserve(entry.target);
              this.observedElements.delete(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.5, // Element must be 50% visible
        rootMargin: '0px',
      }
    );
  }

  /**
   * Start observing an element for impressions
   */
  observe(element: Element, data: ImpressionTrackingData): void {
    if (!this.observer) {
      return;
    }

    this.observedElements.set(element, data);
    this.observer.observe(element);
  }

  /**
   * Stop observing an element
   */
  unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.observedElements.delete(element);
    }
  }

  /**
   * Start interval to flush impression queue
   */
  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushImpressions();
    }, 5000); // Flush every 5 seconds
  }

  /**
   * Flush queued impressions to tracking service
   */
  private async flushImpressions(): Promise<void> {
    if (this.impressionQueue.length === 0) {
      return;
    }

    const impressions = [...this.impressionQueue];
    this.impressionQueue = [];

    await this.trackingService.trackImpressions(impressions);
  }

  /**
   * Cleanup observer
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    // Flush any remaining impressions
    this.flushImpressions();
  }
}

// Singleton instances
export const trackingService = new TrackingService();

// Hook for easy usage tracking in React components
export const useTracking = () => {
  return {
    trackClick: (data: ClickTrackingData) => trackingService.trackClick(data),
    trackImpressions: (data: ImpressionTrackingData[]) =>
      trackingService.trackImpressions(data),
    trackConversion: (data: ConversionTrackingData) =>
      trackingService.trackConversion(data),
    getUsageStats: (period?: string) => trackingService.getUsageStats(period),
    setAuthToken: (token: string) => trackingService.setAuthToken(token),
  };
};

// Utility functions
export const getCurrentSessionId = (): string => getSessionId();

export const trackPageView = (pageName: string, additionalData?: any): void => {
  if (typeof window !== 'undefined') {
    // Track page view in analytics or other systems
    console.log('Page view:', pageName, additionalData);
  }
};

export default trackingService;
