'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Info,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  ingredients?: string[];
  instructions?: string;
  tags: string[];
  slug: string;
  inStock: boolean;
  stockCount?: number;
  partnerId: string;
  partnerShopName: string;
  partnerShopUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  pros?: string[];
  cons?: string[];
  compatibility?: {
    vehicleTypes: string[];
    materials: string[];
    excludedMaterials?: string[];
  };
  certifications?: string[];
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  image: string;
  partnerShopName: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data.product);
        fetchRelatedProducts(data.data.product.category, data.data.product._id);
      } else {
        toast({
          title: 'Produkt nicht gefunden',
          description:
            'Das gesuchte Produkt existiert nicht oder wurde entfernt.',
          variant: 'destructive',
        });
        router.push('/produkte');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast({
        title: 'Fehler',
        description: 'Das Produkt konnte nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(
        `/api/products/search?category=${encodeURIComponent(
          category
        )}&limit=4&exclude=${excludeId}`
      );
      const data = await response.json();

      if (data.success && data.data.products) {
        const related: RelatedProduct[] = data.data.products.map((p: any) => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          rating: p.rating,
          image: p.images[0] || '',
          partnerShopName: p.partnerShopName,
        }));
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (!product) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link kopiert',
          description: 'Der Produktlink wurde in die Zwischenablage kopiert.',
        });
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited
        ? 'Aus Favoriten entfernt'
        : 'Zu Favoriten hinzugefügt',
      description: isFavorited
        ? 'Das Produkt wurde aus Ihren Favoriten entfernt.'
        : 'Das Produkt wurde zu Ihren Favoriten hinzugefügt.',
    });
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push('/produkte')}
              className="hover:text-blue-600"
            >
              Produkte
            </button>
            <ChevronRight className="h-4 w-4" />
            <button
              onClick={() =>
                router.push(
                  `/produkte?category=${encodeURIComponent(product.category)}`
                )
              }
              className="hover:text-blue-600"
            >
              {product.category}
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />

                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageChange('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageChange('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex
                                ? 'bg-blue-600'
                                : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice &&
                    getDiscountPercentage(
                      product.price,
                      product.originalPrice
                    ) > 0 && (
                      <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                        -
                        {getDiscountPercentage(
                          product.price,
                          product.originalPrice
                        )}
                        % RABATT
                      </Badge>
                    )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge
                        variant="destructive"
                        className="text-lg px-4 py-2"
                      >
                        Nicht verfügbar
                      </Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="h-24 w-24" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? 'border-blue-600'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="mb-2">
                  {product.brand}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={isFavorited ? 'text-red-500' : 'text-gray-400'}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    disabled={isSharing}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({product.reviewCount} Bewertungen)
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
              </div>
            </div>

            {/* Stock Info */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Verfügbar</span>
                  {product.stockCount && (
                    <span className="text-gray-500 ml-2">
                      ({product.stockCount} Stück)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="h-5 w-5 mr-2" />
                  <span>Nicht verfügbar</span>
                </div>
              )}
            </div>

            {/* Partner Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Erhältlich bei</p>
                    <p className="font-semibold text-lg">
                      {product.partnerShopName}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      window.open(product.partnerShopUrl, '_blank')
                    }
                    disabled={!product.inStock}
                    className="min-w-32"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Jetzt kaufen' : 'Ausverkauft'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            )}

            {/* Key Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Hauptmerkmale</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700"
                    >
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility Warning */}
            {product.compatibility?.excludedMaterials &&
              product.compatibility.excludedMaterials.length > 0 && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Nicht geeignet für:</strong>{' '}
                    {product.compatibility.excludedMaterials.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Beschreibung</TabsTrigger>
              <TabsTrigger value="specifications">Technische Daten</TabsTrigger>
              <TabsTrigger value="usage">Anwendung</TabsTrigger>
              <TabsTrigger value="compatibility">Kompatibilität</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {product.detailedDescription || product.description}
                    </p>

                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-3">
                          Inhaltsstoffe
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {product.ingredients.map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="justify-center"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pros and Cons */}
                    {(product.pros?.length || product.cons?.length) && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.pros && product.pros.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-green-600">
                              Vorteile
                            </h4>
                            <ul className="space-y-2">
                              {product.pros.map((pro, index) => (
                                <li key={index} className="flex items-start">
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {product.cons && product.cons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-orange-600">
                              Zu beachten
                            </h4>
                            <ul className="space-y-2">
                              {product.cons.map((con, index) => (
                                <li key={index} className="flex items-start">
                                  <Info className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="font-medium text-gray-700">
                              {key}
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Keine technischen Daten verfügbar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.instructions ? (
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {product.instructions}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Keine Anwendungshinweise verfügbar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compatibility" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.compatibility ? (
                    <div className="space-y-6">
                      {product.compatibility.vehicleTypes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3">
                            Geeignet für Fahrzeugtypen
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.compatibility.vehicleTypes.map(
                              (type, index) => (
                                <Badge key={index} variant="secondary">
                                  {type}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {product.compatibility.materials.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3">
                            Geeignet für Materialien
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.compatibility.materials.map(
                              (material, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-green-500 text-green-700"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {material}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {product.compatibility.excludedMaterials &&
                        product.compatibility.excludedMaterials.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3">
                              Nicht geeignet für
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {product.compatibility.excludedMaterials.map(
                                (material, index) => (
                                  <Badge
                                    key={index}
                                    variant="destructive"
                                    className="bg-red-100 text-red-700 border-red-500"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    {material}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Keine Kompatibilitätsinformationen verfügbar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ähnliche Produkte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(`/produkte/${relatedProduct.slug}`)
                  }
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    {relatedProduct.image ? (
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(relatedProduct.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        ({relatedProduct.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedProduct.partnerShopName}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
