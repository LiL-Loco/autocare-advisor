'use client';

import UsageAnalyticsDemo from '@/components/partner/UsageAnalyticsDemo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  Activity,
  BarChart3,
  CheckCircle,
  Download,
  Edit,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  isActive: boolean;
  inStock: boolean;
  tier: 'basic' | 'professional' | 'enterprise';
  viewCount: number;
  clickCount: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
  partnerShopName: string;
  partnerShopUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export default function PartnerProductsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 20,
  });

  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category !== 'all')
        queryParams.set('category', filters.category);
      if (filters.status !== 'all') queryParams.set('status', filters.status);
      queryParams.set('page', filters.page.toString());
      queryParams.set('limit', filters.limit.toString());

      const response = await fetch(
        `/api/partner/products/mock?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`, // Temporarily disabled for mock data
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Fehler',
        description: 'Produkte konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'activate' | 'deactivate') => {
    if (selectedProducts.length === 0) {
      toast({
        title: 'Keine Auswahl',
        description: 'Bitte wählen Sie mindestens ein Produkt aus',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/partner/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`, // Temporarily disabled for mock data
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          action,
        }),
      });

      // For mock data, simulate successful response
      const data = {
        success: true,
        data: { modifiedCount: selectedProducts.length },
      };

      if (data.success) {
        toast({
          title: 'Erfolg',
          description: `${data.data.modifiedCount} Produkt(e) wurden ${
            action === 'activate' ? 'aktiviert' : 'deaktiviert'
          }`,
        });
        setSelectedProducts([]);
        fetchProducts(); // Refresh data
      } else {
        throw new Error('Bulk action failed');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Aktion konnte nicht ausgeführt werden',
        variant: 'destructive',
      });
    }
  };

  // Toggle Product Selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Select All Products
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Produkte werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Fehler beim Laden</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} variant="outline">
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Produktverwaltung
          </h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Ihre Produktdaten und überwachen Sie die Performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={showAnalytics ? 'default' : 'outline'}
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/partner/products/import')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV Import
          </Button>
          <Button
            onClick={() => router.push('/partner/products/new')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Neues Produkt
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Produktname, Marke oder Beschreibung..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="Lackreinigung">Lackreinigung</SelectItem>
                <SelectItem value="Polituren & Wachse">
                  Polituren & Wachse
                </SelectItem>
                <SelectItem value="Felgenpflege">Felgenpflege</SelectItem>
                <SelectItem value="Innenraumreinigung">
                  Innenraumreinigung
                </SelectItem>
                <SelectItem value="Schutzprodukte">Schutzprodukte</SelectItem>
                <SelectItem value="Werkzeuge & Zubehör">
                  Werkzeuge & Zubehör
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>

            {/* Bulk Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                disabled={selectedProducts.length === 0}
              >
                Aktivieren ({selectedProducts.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
                disabled={selectedProducts.length === 0}
              >
                Deaktivieren
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamtprodukte
            </CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination?.totalCount || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {
                products.filter(
                  (p) =>
                    new Date(p.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length
              }{' '}
              in den letzten 30 Tagen
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aktive Produkte
            </CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.isActive).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {Math.round(
                (products.filter((p) => p.isActive).length /
                  Math.max(products.length, 1)) *
                  100
              )}
              % aller Produkte
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gesamtaufrufe
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products
                .reduce((sum, p) => sum + p.viewCount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Ø{' '}
              {Math.round(
                products.reduce((sum, p) => sum + p.viewCount, 0) /
                  Math.max(products.length, 1)
              )}{' '}
              pro Produkt
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ø Conversion Rate
            </CardTitle>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0
                ? `${(
                    products.reduce(
                      (sum, p) =>
                        sum +
                        (typeof p.conversionRate === 'number'
                          ? p.conversionRate
                          : parseFloat(p.conversionRate || '0')),
                      0
                    ) / products.length
                  ).toFixed(1)}%`
                : '0.0%'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {products.filter((p) => p.conversionRate > 5).length} Produkte
              &gt;5%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics Dashboard */}
      {showAnalytics && (
        <div className="mb-8">
          <UsageAnalyticsDemo className="animate-in slide-in-from-top-4 duration-300" />
        </div>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium mb-2">Noch keine Produkte</h3>
              <p className="text-gray-600 mb-4">
                Fügen Sie Ihr erstes Produkt hinzu, um loszulegen.
              </p>
              <Button
                onClick={() => router.push('/partner/products/new')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Erstes Produkt hinzufügen
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProducts.length === products.length &&
                        products.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Preis</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Bewertung</TableHead>
                  <TableHead className="w-32">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() =>
                          toggleProductSelection(product._id)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              product.images[0] ||
                              '/images/placeholder-product.jpg'
                            }
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                '/images/placeholder-product.jpg';
                            }}
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-70 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                OOS
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {product.brand}
                          </div>
                          {product.subcategory && (
                            <div className="text-xs text-gray-400 truncate">
                              {product.subcategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-medium">
                      <div>
                        €{product.price.toFixed(2)}
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              €{product.originalPrice.toFixed(2)}
                            </div>
                          )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          product.tier === 'enterprise'
                            ? 'default'
                            : product.tier === 'professional'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={`text-xs ${
                          product.tier === 'enterprise'
                            ? 'bg-purple-100 text-purple-800'
                            : product.tier === 'professional'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.tier}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            product.isActive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                        {!product.inStock && (
                          <Badge variant="destructive" className="text-xs ml-1">
                            Nicht verfügbar
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {product.viewCount.toLocaleString()}
                          </span>
                          <span className="text-gray-500">Views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {product.clickCount}
                          </span>
                          <span className="text-gray-500">Clicks</span>
                        </div>
                        <div className="text-xs">
                          <span
                            className={`font-medium ${
                              product.conversionRate > 5
                                ? 'text-green-600'
                                : product.conversionRate > 2
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {typeof product.conversionRate === 'number'
                              ? product.conversionRate.toFixed(1)
                              : parseFloat(
                                  product.conversionRate || '0'
                                ).toFixed(1)}
                            % CR
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-sm">
                            {typeof product.rating === 'number'
                              ? product.rating.toFixed(1)
                              : parseFloat(product.rating || '0').toFixed(1)}
                          </span>
                        </div>
                        {product.reviewCount > 0 && (
                          <span className="text-xs text-gray-500">
                            ({product.reviewCount})
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/partner/products/${product._id}/edit`)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/partner/products/${product._id}/analytics`
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Zeige {(pagination.currentPage - 1) * pagination.limit + 1} bis{' '}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalCount
            )}{' '}
            von {pagination.totalCount} Produkten
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleFilterChange('page', pagination.currentPage - 1)
              }
              disabled={!pagination.hasPrev}
            >
              Zurück
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pageNum === pagination.currentPage
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handleFilterChange('page', pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleFilterChange('page', pagination.currentPage + 1)
              }
              disabled={!pagination.hasNext}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
