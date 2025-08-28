'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ImpressionObserver,
  trackingService,
  useTracking,
} from '@/services/trackingService';
import { Clock, ExternalLink, Eye, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ProductRecommendationWithTrackingProps {
  product: {
    _id: string;
    name: string;
    description: string;
    brand: string;
    price: {
      amount: number;
      currency: string;
    };
    images: string[];
    partnerUrl: string;
    partnerId: string;
    category: string;
    matchScore?: number;
    tier?: 'basic' | 'professional' | 'enterprise';
    rating?: {
      average: number;
      count: number;
    };
    applicationTime?: {
      preparation: number;
      application: number;
    };
    features?: string[];
  };
  rank?: number; // Position in recommendation list
  sessionId?: string;
  showTracking?: boolean; // Debug mode
  className?: string;
}

export default function ProductRecommendationWithTracking({
  product,
  rank,
  sessionId,
  showTracking = false,
  className = '',
}: ProductRecommendationWithTrackingProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const impressionObserverRef = useRef<ImpressionObserver | null>(null);
  const hasTrackedImpression = useRef(false);
  const impressionStartTime = useRef<number | null>(null);

  const { trackClick } = useTracking();

  // Initialize impression tracking
  useEffect(() => {
    if (!cardRef.current) return;

    // Create impression observer
    impressionObserverRef.current = new ImpressionObserver(trackingService);

    // Start tracking impression
    impressionObserverRef.current.observe(cardRef.current, {
      productId: product._id,
      metadata: {
        productName: product.name,
        brand: product.brand,
        category: product.category,
        rank: rank,
        sessionId: sessionId,
        tier: product.tier,
        matchScore: product.matchScore,
      },
    });

    impressionStartTime.current = Date.now();

    return () => {
      if (impressionObserverRef.current) {
        impressionObserverRef.current.destroy();
        impressionObserverRef.current = null;
      }
    };
  }, [product._id, rank, sessionId]);

  // Track when card becomes visible
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression.current) {
            hasTrackedImpression.current = true;

            if (showTracking) {
              console.log('Product impression tracked:', {
                productId: product._id,
                productName: product.name,
                rank: rank,
                matchScore: product.matchScore,
              });
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '20px',
      }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [product._id, rank, showTracking]);

  // Handle product click with tracking
  const handleProductClick = async () => {
    const viewDuration = impressionStartTime.current
      ? Math.round((Date.now() - impressionStartTime.current) / 1000)
      : undefined;

    try {
      // Track the click
      const result = await trackClick({
        productId: product._id,
        partnerUrl: product.partnerUrl,
        recommendationRank: rank,
        matchScore: product.matchScore,
        metadata: {
          productName: product.name,
          brand: product.brand,
          category: product.category,
          tier: product.tier,
          viewDuration: viewDuration,
          sessionId: sessionId,
        },
      });

      if (showTracking) {
        console.log('Click tracking result:', result);
      }

      // Open partner URL
      window.open(product.partnerUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Click tracking failed:', error);

      // Still open the link even if tracking fails
      window.open(product.partnerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate match score color
  const getMatchScoreColor = (score: number = 0) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Get tier badge color
  const getTierColor = (tier: string = 'basic') => {
    switch (tier.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'professional':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card
      ref={cardRef}
      className={`group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 ${className}`}
    >
      <CardContent className="p-6">
        {/* Header with Brand and Match Score */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getTierColor(product.tier)}>
              {product.brand}
            </Badge>
            {rank && (
              <Badge variant="secondary" className="text-xs">
                #{rank}
              </Badge>
            )}
          </div>
          {product.matchScore && (
            <Badge
              variant="outline"
              className={getMatchScoreColor(product.matchScore)}
            >
              <Star className="w-3 h-3 mr-1" />
              {product.matchScore.toFixed(0)}% Match
            </Badge>
          )}
        </div>

        {/* Product Image */}
        {product.images && product.images.length > 0 && (
          <div className="mb-4 relative overflow-hidden rounded-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-product.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>
        )}

        {/* Product Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-3">
            {product.description}
          </p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{product.features.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Rating and Application Time */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.rating.average.toFixed(1)}</span>
                  <span className="text-gray-400">
                    ({product.rating.count})
                  </span>
                </div>
              )}
              {product.applicationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {product.applicationTime.preparation +
                      product.applicationTime.application}
                    min
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-lg font-bold text-gray-900">
              {product.price.currency} {product.price.amount.toFixed(2)}
            </div>
            <Button
              onClick={handleProductClick}
              className="group/btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View Details
              <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Debug Tracking Info */}
        {showTracking && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600 border">
            <div className="font-mono">
              <div>Product ID: {product._id}</div>
              <div>Partner ID: {product.partnerId}</div>
              <div>Rank: {rank}</div>
              <div>Match Score: {product.matchScore}%</div>
              <div>Session: {sessionId}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Higher-order component for tracking-enabled product lists
interface ProductListWithTrackingProps {
  products: any[];
  sessionId?: string;
  showTracking?: boolean;
  className?: string;
}

export function ProductListWithTracking({
  products,
  sessionId,
  showTracking = false,
  className = '',
}: ProductListWithTrackingProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {products.map((product, index) => (
        <ProductRecommendationWithTracking
          key={product._id}
          product={product}
          rank={index + 1}
          sessionId={sessionId}
          showTracking={showTracking}
        />
      ))}
    </div>
  );
}

// Analytics preview component
interface TrackingAnalyticsPreviewProps {
  visible: boolean;
  stats: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}

export function TrackingAnalyticsPreview({
  visible,
  stats,
}: TrackingAnalyticsPreviewProps) {
  if (!visible) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-64 shadow-lg border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-sm">Session Tracking</h4>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Impressions:</span>
            <span className="font-mono">{stats.impressions}</span>
          </div>
          <div className="flex justify-between">
            <span>Clicks:</span>
            <span className="font-mono">{stats.clicks}</span>
          </div>
          <div className="flex justify-between">
            <span>CTR:</span>
            <span className="font-mono">{stats.ctr.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
