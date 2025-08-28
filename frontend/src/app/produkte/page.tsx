'use client';

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
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import {
  ArrowUpDown,
  Grid,
  List,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  tags: string[];
  slug: string;
  inStock: boolean;
  partnerId: string;
  partnerShopName: string;
  partnerShopUrl: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  productCount: number;
}

interface SearchFilters {
  category?: string;
  brand?: string[];
  priceRange?: [number, number];
  rating?: number;
  features?: string[];
  inStock?: boolean;
}

interface SearchResult {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets: {
    brands: Array<{ name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    priceRanges: Array<{
      range: string;
      min: number;
      max: number;
      count: number;
    }>;
    features: Array<{ feature: string; count: number }>;
  };
  processingTime: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSuggestions]);

  // Initialize from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const initialFilters: SearchFilters = {};

    if (params.get('category'))
      initialFilters.category = params.get('category')!;
    if (params.get('brand'))
      initialFilters.brand = params.get('brand')!.split(',');
    if (params.get('priceMin') && params.get('priceMax')) {
      initialFilters.priceRange = [
        parseInt(params.get('priceMin')!),
        parseInt(params.get('priceMax')!),
      ];
      setPriceRange(initialFilters.priceRange);
    }
    if (params.get('rating'))
      initialFilters.rating = parseInt(params.get('rating')!);
    if (params.get('inStock'))
      initialFilters.inStock = params.get('inStock') === 'true';

    setFilters(initialFilters);
    setSortBy(params.get('sortBy') || 'relevance');
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Perform search when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0 || searchTerm) {
      performSearch();
    }
  }, [filters, searchTerm, sortBy]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `/api/products/suggestions?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.success && data.data.suggestions) {
        setSuggestions(data.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounce suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSuggestions]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        '/api/categories?onlyMain=true&includeProductCount=true'
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.set('q', searchTerm);
      if (filters.category) params.set('category', filters.category);
      if (filters.brand?.length) params.set('brand', filters.brand.join(','));
      if (filters.priceRange) {
        params.set('priceMin', filters.priceRange[0].toString());
        params.set('priceMax', filters.priceRange[1].toString());
      }
      if (filters.rating) params.set('ratingMin', filters.rating.toString());
      if (filters.features?.length)
        params.set('features', filters.features.join(','));
      if (filters.inStock !== undefined)
        params.set('inStock', filters.inStock.toString());
      params.set('sortBy', sortBy);
      params.set('limit', '20');

      const response = await fetch(`/api/products/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters, sortBy]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    updateURL(newFilters);
  };

  const updateURL = (newFilters: Partial<SearchFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else if (key === 'priceRange' && Array.isArray(value)) {
        const range = value as unknown as [number, number];
        params.set('priceMin', range[0].toString());
        params.set('priceMax', range[1].toString());
      } else {
        params.set(key, value.toString());
      }
    });

    if (searchTerm) params.set('q', searchTerm);
    if (sortBy !== 'relevance') params.set('sortBy', sortBy);

    router.push(`/produkte?${params}`);
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 1000]);
    router.push('/produkte');
  };

  const handleCategoryClick = (categorySlug: string) => {
    const category = categories.find((c) => c.slug === categorySlug);
    if (category) {
      updateFilters({ category: category.name });
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/produkte/${product.slug}`);
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Produkte entdecken
              </h1>
              <p className="text-gray-600 mt-1">
                Finden Sie die perfekten Pflegeprodukte für Ihr Fahrzeug
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nach Produkten suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearch();
                      setShowSuggestions(false);
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />

                {/* Auto-suggest dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    <div className="max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm"
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setShowSuggestions(false);
                            // Trigger search after a brief delay
                            setTimeout(() => performSearch(), 100);
                          }}
                        >
                          <Search className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="flex-1">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading indicator for suggestions */}
                {isLoadingSuggestions && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories */}
      {!searchTerm && !Object.keys(filters).length && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold mb-6">
            Kategorien durchstöbern
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: category.color || '#4f46e5' }}
                  >
                    {category.icon ? (
                      <i className={category.icon}></i>
                    ) : (
                      category.name.charAt(0)
                    )}
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.productCount} Produkte
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {(searchResults || isLoading) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              {searchResults && (
                <p className="text-gray-600">
                  {searchResults.pagination.totalProducts} Produkte gefunden
                  {searchTerm && <span> für "{searchTerm}"</span>}
                  {searchResults.processingTime && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({searchResults.processingTime}ms)
                    </span>
                  )}
                </p>
              )}

              {/* Active Filters */}
              {Object.keys(filters).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.category && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {filters.category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => updateFilters({ category: undefined })}
                      />
                    </Badge>
                  )}
                  {filters.brand?.map((brand) => (
                    <Badge
                      key={brand}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {brand}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          updateFilters({
                            brand: filters.brand?.filter((b) => b !== brand),
                          })
                        }
                      />
                    </Badge>
                  ))}
                  {filters.priceRange && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      €{filters.priceRange[0]} - €{filters.priceRange[1]}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          updateFilters({ priceRange: undefined });
                          setPriceRange([0, 1000]);
                        }}
                      />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Alle Filter löschen
                  </Button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevanz</SelectItem>
                  <SelectItem value="price">Preis ↑</SelectItem>
                  <SelectItem value="rating">Bewertung</SelectItem>
                  <SelectItem value="newest">Neueste</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                    <SheetDescription>
                      Verfeinern Sie Ihre Produktsuche
                    </SheetDescription>
                  </SheetHeader>
                  {/* Mobile filter content would go here */}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Filter</span>
                    {Object.keys(filters).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 h-auto p-1"
                      >
                        Zurücksetzen
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Preisbereich</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      onValueCommit={(value) =>
                        updateFilters({ priceRange: value as [number, number] })
                      }
                      max={1000}
                      step={25}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>€{priceRange[0]}</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Brands Filter */}
                  {searchResults?.facets?.brands &&
                    searchResults.facets.brands.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Marken</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {searchResults.facets.brands.map((brand) => (
                            <div
                              key={brand.name}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={
                                  filters.brand?.includes(brand.name) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentBrands = filters.brand || [];
                                  const newBrands = checked
                                    ? [...currentBrands, brand.name]
                                    : currentBrands.filter(
                                        (b) => b !== brand.name
                                      );
                                  updateFilters({ brand: newBrands });
                                }}
                              />
                              <label className="text-sm flex-1 cursor-pointer">
                                {brand.name} ({brand.count})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <Separator />

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Mindestbewertung</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={filters.rating === rating}
                            onCheckedChange={(checked) => {
                              updateFilters({
                                rating: checked ? rating : undefined,
                              });
                            }}
                          />
                          <label className="text-sm flex items-center cursor-pointer">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2">& mehr</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Stock Filter */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.inStock === true}
                        onCheckedChange={(checked) => {
                          updateFilters({
                            inStock: checked ? true : undefined,
                          });
                        }}
                      />
                      <label className="text-sm cursor-pointer">
                        Nur verfügbare Produkte
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Grid/List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults && searchResults.products.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                >
                  {searchResults.products.map((product) => (
                    <Card
                      key={product._id}
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      <div
                        className={
                          viewMode === 'list' ? 'w-48 flex-shrink-0' : ''
                        }
                      >
                        <div
                          className={`${
                            viewMode === 'list' ? 'h-32' : 'aspect-square'
                          } bg-gray-100 rounded-t-lg relative overflow-hidden`}
                        >
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart className="h-12 w-12" />
                            </div>
                          )}

                          {/* Discount Badge */}
                          {product.originalPrice &&
                            getDiscountPercentage(
                              product.price,
                              product.originalPrice
                            ) > 0 && (
                              <Badge className="absolute top-2 left-2 bg-red-500">
                                -
                                {getDiscountPercentage(
                                  product.price,
                                  product.originalPrice
                                )}
                                %
                              </Badge>
                            )}

                          {/* Out of Stock */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Badge variant="destructive">Ausverkauft</Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <CardContent
                        className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg leading-tight mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {product.brand}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {viewMode === 'list' && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                              bei {product.partnerShopName}
                            </p>
                          </div>

                          {product.inStock && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(product.partnerShopUrl, '_blank');
                              }}
                            >
                              Kaufen
                            </Button>
                          )}
                        </div>

                        {/* Features Tags */}
                        {product.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {product.features
                              .slice(0, 3)
                              .map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            {product.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 3} weitere
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Keine Produkte gefunden
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Versuchen Sie andere Suchbegriffe oder entfernen Sie einige
                    Filter.
                  </p>
                  <Button onClick={clearFilters}>
                    Alle Filter zurücksetzen
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {searchResults && searchResults.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={!searchResults.pagination.hasPrev}
                      onClick={() => {
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set(
                          'page',
                          (searchResults.pagination.page - 1).toString()
                        );
                        router.push(`/produkte?${params}`);
                      }}
                    >
                      Vorherige
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        {
                          length: Math.min(
                            searchResults.pagination.totalPages,
                            5
                          ),
                        },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                searchResults.pagination.page === page
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => {
                                const params = new URLSearchParams(
                                  searchParams.toString()
                                );
                                params.set('page', page.toString());
                                router.push(`/produkte?${params}`);
                              }}
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      disabled={!searchResults.pagination.hasNext}
                      onClick={() => {
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set(
                          'page',
                          (searchResults.pagination.page + 1).toString()
                        );
                        router.push(`/produkte?${params}`);
                      }}
                    >
                      Nächste
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
