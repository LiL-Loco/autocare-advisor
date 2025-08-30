'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  MousePointer,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductAnalytics {
  product: {
    id: string;
    name: string;
  };
  metrics: {
    totalViews: number;
    totalClicks: number;
    conversionRate: number;
    avgViewsPerDay: number;
    avgClicksPerDay: number;
    rating: number;
    reviewCount: number;
  };
  period: string;
  performance: {
    isPopular: boolean;
    isConvertingWell: boolean;
    needsImprovement: boolean;
  };
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  isActive: boolean;
  inStock: boolean;
  tier: string;
  viewCount: number;
  clickCount: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export default function ProductAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('30d');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product details and analytics in parallel
      const [productResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/partner/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`/api/partner/products/${params.id}/analytics?period=${period}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      const productData = await productResponse.json();
      const analyticsData = await analyticsResponse.json();

      if (productData.success) {
        setProduct(productData.data.product);
      } else {
        throw new Error(productData.error || 'Product not found');
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.data.analytics);
      } else {
        throw new Error(analyticsData.error || 'Analytics not available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Fehler',
        description: 'Daten konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id, period]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const getPerformanceColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value >= thresholds.good)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value >= thresholds.warning)
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
    <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analytics werden geladen...</p>
            </div>
          </div>
        </div>
  );
  }

  if (error || !product || !analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Daten nicht verfügbar
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => router.push('/partner/products')}
              variant="outline"
            >
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </PartnerPageLayout>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Produkt Analytics
            </h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="1y">1 Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push(`/partner/products/${product._id}/edit`)}
            variant="outline"
          >
            Bearbeiten
          </Button>
        </div>
      </div>

      {/* Product Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={product.images[0] || '/images/placeholder-product.jpg'}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/images/placeholder-product.jpg';
              }}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                  <p className="text-gray-600 mb-2">
                    {product.brand} • {product.category}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">
                      €{product.price.toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        product.tier === 'enterprise'
                          ? 'default'
                          : product.tier === 'professional'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {product.tier}
                    </Badge>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                    {!product.inStock && (
                      <Badge variant="destructive">Nicht verfügbar</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviewCount > 0 && (
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Erstellt am{' '}
                    {new Date(product.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamtaufrufe
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analytics.metrics.totalViews)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getPerformanceIcon(analytics.metrics.totalViews, {
                good: 100,
                warning: 50,
              })}
              <span className="text-xs text-gray-600">
                ⌀ {formatNumber(analytics.metrics.avgViewsPerDay)}/Tag
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamtklicks
            </CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analytics.metrics.totalClicks)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getPerformanceIcon(analytics.metrics.totalClicks, {
                good: 10,
                warning: 5,
              })}
              <span className="text-xs text-gray-600">
                ⌀ {formatNumber(analytics.metrics.avgClicksPerDay)}/Tag
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPerformanceColor(
                analytics.metrics.conversionRate,
                { good: 5, warning: 2 }
              )}`}
            >
              {analytics.metrics.conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getPerformanceIcon(analytics.metrics.conversionRate, {
                good: 5,
                warning: 2,
              })}
              <span className="text-xs text-gray-600">
                {analytics.performance.isConvertingWell
                  ? 'Sehr gut'
                  : analytics.performance.needsImprovement
                  ? 'Verbesserung nötig'
                  : 'OK'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bewertung
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.metrics.rating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getPerformanceIcon(analytics.metrics.rating, {
                good: 4.0,
                warning: 3.5,
              })}
              <span className="text-xs text-gray-600">
                {analytics.metrics.reviewCount} Bewertungen
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  analytics.performance.isPopular
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}
              >
                <TrendingUp
                  className={`h-5 w-5 ${
                    analytics.performance.isPopular
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                />
                <div>
                  <p className="font-medium">Beliebtheit</p>
                  <p className="text-sm text-gray-600">
                    {analytics.performance.isPopular
                      ? 'Dieses Produkt ist sehr beliebt (>100 Views)'
                      : 'Mehr Marketing könnte die Sichtbarkeit erhöhen'}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  analytics.performance.isConvertingWell
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}
              >
                <MousePointer
                  className={`h-5 w-5 ${
                    analytics.performance.isConvertingWell
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                />
                <div>
                  <p className="font-medium">Conversion</p>
                  <p className="text-sm text-gray-600">
                    {analytics.performance.isConvertingWell
                      ? 'Sehr gute Conversion Rate (>2%)'
                      : 'Produktbeschreibung oder Bilder optimieren'}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  analytics.performance.needsImprovement
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50'
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 ${
                    analytics.performance.needsImprovement
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`}
                />
                <div>
                  <p className="font-medium">Verbesserungspotential</p>
                  <p className="text-sm text-gray-600">
                    {analytics.performance.needsImprovement
                      ? 'Niedrige CR trotz Views - Optimierung empfohlen'
                      : 'Performance ist zufriedenstellend'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Optimierungsempfehlungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {analytics.metrics.conversionRate < 2 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Conversion Rate verbessern
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Produktbeschreibung detaillierter gestalten</li>
                    <li>• Mehr hochwertige Produktbilder hinzufügen</li>
                    <li>• Kundenbewertungen sammeln</li>
                  </ul>
                </div>
              )}

              {analytics.metrics.totalViews < 50 && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-1">
                    Sichtbarkeit erhöhen
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Mehr relevante Tags hinzufügen</li>
                    <li>• In mehreren Kategorien listen</li>
                    <li>• SEO-optimierte Beschreibung</li>
                  </ul>
                </div>
              )}

              {analytics.metrics.rating < 4.0 && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-1">
                    Bewertungen verbessern
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Kundenfeedback aktiv einholen</li>
                    <li>• Produktqualität überprüfen</li>
                    <li>• Kundenservice optimieren</li>
                  </ul>
                </div>
              )}

              {analytics.performance.isConvertingWell &&
                analytics.performance.isPopular && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-1">
                      Exzellente Performance! 🎉
                    </h4>
                    <p className="text-sm text-green-800">
                      Dieses Produkt performt sehr gut. Nutzen Sie es als
                      Vorbild für andere Produkte.
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PartnerPageLayout>
  );
}
