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
import {
  BarChart3,
  Download,
  Eye,
  MousePointer,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PartnerLayout from '../../../../../components/partner/layout/PartnerLayout';

interface ProductAnalytics {
  id: string;
  name: string;
  category: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const mockAnalytics: ProductAnalytics[] = [
  {
    id: '1',
    name: 'Motoröl Premium 5W-30',
    category: 'Motoröl',
    views: 2400,
    clicks: 180,
    conversions: 89,
    revenue: 2221.11,
    ctr: 7.5,
    conversionRate: 49.4,
    trend: 'up',
    trendPercentage: 12.3,
  },
  {
    id: '2',
    name: 'Bremsflüssigkeit DOT 4',
    category: 'Bremsflüssigkeit',
    views: 1800,
    clicks: 160,
    conversions: 67,
    revenue: 837.5,
    ctr: 8.9,
    conversionRate: 41.9,
    trend: 'up',
    trendPercentage: 8.7,
  },
  {
    id: '3',
    name: 'Kühlmittel Konzentrat',
    category: 'Kühlmittel',
    views: 1500,
    clicks: 120,
    conversions: 23,
    revenue: 436.77,
    ctr: 8.0,
    conversionRate: 19.2,
    trend: 'down',
    trendPercentage: -5.2,
  },
  {
    id: '4',
    name: 'Scheibenwischerblätter Set',
    category: 'Wischer',
    views: 3200,
    clicks: 245,
    conversions: 145,
    revenue: 4348.55,
    ctr: 7.7,
    conversionRate: 59.2,
    trend: 'up',
    trendPercentage: 18.9,
  },
  {
    id: '5',
    name: 'Luftfilter Universal',
    category: 'Filter',
    views: 890,
    clicks: 45,
    conversions: 12,
    revenue: 191.88,
    ctr: 5.1,
    conversionRate: 26.7,
    trend: 'stable',
    trendPercentage: 0.8,
  },
];

export default function ProductAnalyticsPage() {
  const router = useRouter();
  const [analytics] = useState<ProductAnalytics[]>(mockAnalytics);
  const [sortBy, setSortBy] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getTrendIcon = (trend: ProductAnalytics['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getTrendColor = (trend: ProductAnalytics['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const sortedAnalytics = [...analytics].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'clicks':
        return b.clicks - a.clicks;
      case 'conversions':
        return b.conversions - a.conversions;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'ctr':
        return b.ctr - a.ctr;
      case 'conversionRate':
        return b.conversionRate - a.conversionRate;
      default:
        return 0;
    }
  });

  const filteredAnalytics = sortedAnalytics.filter(
    (product) => categoryFilter === 'all' || product.category === categoryFilter
  );

  const categories = Array.from(new Set(analytics.map((p) => p.category)));

  // Gesamtstatistiken
  const totalViews = analytics.reduce((sum, p) => sum + p.views, 0);
  const totalClicks = analytics.reduce((sum, p) => sum + p.clicks, 0);
  const totalConversions = analytics.reduce((sum, p) => sum + p.conversions, 0);
  const totalRevenue = analytics.reduce((sum, p) => sum + p.revenue, 0);
  const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const avgConversionRate =
    totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Shopify-Style Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Produkt-Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Detaillierte Leistungsanalyse Ihrer {analytics.length} Produkte
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Bericht exportieren
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/partner/dashboard/products')}
            >
              <Package className="w-4 h-4 mr-2" />
              Zu Produkten
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="border-0 shadow-none bg-background">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Zeitraum:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
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
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Kategorie:
                </span>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kategorien</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Sortieren nach:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Umsatz</SelectItem>
                    <SelectItem value="views">Aufrufe</SelectItem>
                    <SelectItem value="clicks">Klicks</SelectItem>
                    <SelectItem value="conversions">Konversionen</SelectItem>
                    <SelectItem value="ctr">CTR</SelectItem>
                    <SelectItem value="conversionRate">
                      Conversion Rate
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gesamtstatistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aufrufe</p>
                  <p className="text-xl font-semibold">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Klicks</p>
                  <p className="text-xl font-semibold">
                    {totalClicks.toLocaleString()}
                  </p>
                </div>
                <MousePointer className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Konversionen</p>
                  <p className="text-xl font-semibold">{totalConversions}</p>
                </div>
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Umsatz</p>
                  <p className="text-xl font-semibold">
                    €{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ø CTR</p>
                  <p className="text-xl font-semibold">{avgCTR.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ø Conv. Rate</p>
                  <p className="text-xl font-semibold">
                    {avgConversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produkt-Analytics Tabelle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Produktleistung im Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-muted-foreground">
                      Produkt
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      Aufrufe
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      Klicks
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      CTR
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      Konversionen
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      Conv. Rate
                    </th>
                    <th className="text-right p-3 font-medium text-muted-foreground">
                      Umsatz
                    </th>
                    <th className="text-center p-3 font-medium text-muted-foreground">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalytics.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {product.views.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {product.clicks.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={
                            product.ctr > 7
                              ? 'default'
                              : product.ctr > 5
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {product.ctr.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {product.conversions}
                      </td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={
                            product.conversionRate > 40
                              ? 'default'
                              : product.conversionRate > 25
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {product.conversionRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        €{product.revenue.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(product.trend)}
                          <span
                            className={`text-sm ${getTrendColor(
                              product.trend
                            )}`}
                          >
                            {product.trend !== 'stable' && (
                              <>
                                {product.trendPercentage > 0 ? '+' : ''}
                                {product.trendPercentage.toFixed(1)}%
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAnalytics.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Keine Daten für diese Filter
                </h3>
                <p className="text-muted-foreground mb-4">
                  Versuchen Sie andere Filter oder Zeiträume.
                </p>
                <Button
                  onClick={() => {
                    setCategoryFilter('all');
                    setTimeRange('30d');
                  }}
                >
                  Filter zurücksetzen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics
                .filter((p) => p.trend === 'up')
                .slice(0, 3)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-green-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-green-700">
                          +{product.trendPercentage.toFixed(1)}% Wachstum
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      €{product.revenue.toLocaleString()}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Verbesserungspotenzial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics
                .filter((p) => p.ctr < 6 || p.conversionRate < 25)
                .slice(0, 3)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold text-sm">
                        !
                      </div>
                      <div>
                        <p className="font-medium text-yellow-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-yellow-700">
                          {product.ctr < 6
                            ? `CTR: ${product.ctr.toFixed(1)}%`
                            : `Conv: ${product.conversionRate.toFixed(1)}%`}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-700 border-yellow-200"
                    >
                      Optimieren
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
