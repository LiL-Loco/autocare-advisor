'use client';

import Footer from '@/components/Footer';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentSessionId } from '@/services/trackingService';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  HeartIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  features: string[];
  partnerShopName: string;
  partnerShopUrl: string;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  reasonForRecommendation: string;
  matchScore: number;
}

interface RecommendationData {
  personalizedMessage: string;
  totalProducts: number;
  categories: string[];
  estimatedTotalCost: number;
  recommendations: Product[];
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] =
    useState<RecommendationData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tracking state
  const [sessionId] = useState(() => getCurrentSessionId());
  const [showTrackingDebug, setShowTrackingDebug] = useState(false);
  const [trackingStats, setTrackingStats] = useState({
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  useEffect(() => {
    // Lade Empfehlungen aus verschiedenen Quellen
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);

        // 1. Versuche neue questionnaire-basierte Recommendations zu laden
        const storedRecommendations = localStorage.getItem(
          'GLANZtastic_recommendations'
        );
        if (storedRecommendations) {
          const recommendationData = JSON.parse(storedRecommendations);

          // Check if this is the new format from questionnaire-recommendations API
          if (
            recommendationData.recommendations &&
            Array.isArray(recommendationData.recommendations)
          ) {
            console.log('Loading recommendations from new API:', {
              total: recommendationData.totalProducts,
              sessionId: recommendationData.sessionId,
              source: recommendationData.meta?.source,
            });

            setRecommendations(recommendationData);

            // Wähle das erste Produkt als Standard aus
            if (recommendationData.recommendations.length > 0) {
              setSelectedProduct(recommendationData.recommendations[0]);
            }
            return;
          }
        }

        // 2. Fallback zu Demo-Daten wenn keine echten Empfehlungen vorhanden
        console.log('Using demo recommendation data');
        const demoData: RecommendationData = {
          personalizedMessage:
            'Basierend auf deinen Angaben haben wir die perfekten Pflegeprodukte für dein Fahrzeug ausgewählt.',
          totalProducts: 4,
          categories: ['Felgenreiniger', 'Wachs', 'Shampoo', 'Mikrofiber'],
          estimatedTotalCost: 94.29,
          recommendations: [
            {
              id: '1',
              name: 'Premium Felgenreiniger Pro',
              brand: 'CleanMax',
              category: 'Felgenreiniger',
              price: 24.99,
              originalPrice: 29.99,
              rating: 4.8,
              reviewCount: 342,
              image: '/api/placeholder/300/300',
              description:
                'Säurefreier Premium-Felgenreiniger für alle Felgentypen. Löst selbst hartnäckigste Verschmutzungen schonend und effektiv. Perfekt geeignet für Alufelgen, Stahlfelgen und auch empfindliche Oberflächen.',
              features: [
                'Säurefrei und felgenschonend',
                'Für alle Felgentypen geeignet',
                'Biologisch abbaubar',
                'Einfache Anwendung',
                'Löst Bremsstaub effektiv',
                'Made in Germany',
              ],
              partnerShopName: 'AutoPflege24',
              partnerShopUrl: 'https://example.com',
              availabilityStatus: 'in_stock',
              reasonForRecommendation:
                'Perfekt für Ihre Alufelgen - schonend aber effektiv',
              matchScore: 95,
            },
            {
              id: '2',
              name: 'Carnauba Hybrid Wachs',
              brand: 'ShineGuard',
              category: 'Wachs',
              price: 39.9,
              rating: 4.9,
              reviewCount: 189,
              image: '/api/placeholder/300/300',
              description:
                'Hochwertiges Hybridwachs aus natürlichem Carnauba und synthetischen Polymeren für langanhaltenden Schutz. Erzeugt einen tiefen, warmen Glanz und schützt vor UV-Strahlung.',
              features: [
                'Natürliches Carnauba Wachs',
                'Langanhaltender Schutz',
                'Tiefe Glanzentwicklung',
                '6 Monate Haltbarkeit',
                'UV-Schutz',
                'Wasserabweisend',
              ],
              partnerShopName: 'Glanz & Schutz',
              partnerShopUrl: 'https://example.com',
              availabilityStatus: 'in_stock',
              reasonForRecommendation:
                'Ideal für schwarze Lacke - erzeugt tiefen Glanz',
              matchScore: 92,
            },
            {
              id: '3',
              name: 'pH-neutrales Auto-Shampoo',
              brand: 'GentleWash',
              category: 'Shampoo',
              price: 16.5,
              rating: 4.6,
              reviewCount: 567,
              image: '/api/placeholder/300/300',
              description:
                'Sanftes, pH-neutrales Autoshampoo das den Lack schont und gleichzeitig gründlich reinigt. Hochkonzentriert für ergiebige Anwendung.',
              features: [
                'pH-neutral und lackschonend',
                'Hochkonzentriert',
                'Schaumarm',
                'Für alle Lacktypen',
                'Entfernt Schmutz sanft',
                'Umweltfreundlich',
              ],
              partnerShopName: 'Wasch & Wax',
              partnerShopUrl: 'https://example.com',
              availabilityStatus: 'in_stock',
              reasonForRecommendation: 'Schonend für Ihre Lackbeschichtung',
              matchScore: 88,
            },
            {
              id: '4',
              name: 'Profi Mikrofasertuch Set',
              brand: 'FiberPro',
              category: 'Mikrofiber',
              price: 12.9,
              rating: 4.7,
              reviewCount: 423,
              image: '/api/placeholder/300/300',
              description:
                '3er Set hochwertige Mikrofasertücher für streifenfreie Reinigung und schonende Trocknung. Perfekt abgestimmt auf verschiedene Anwendungsbereiche.',
              features: [
                '3 Tücher im Set',
                '400 GSM Qualität',
                'Streifenfreie Reinigung',
                'Waschbar bei 60°C',
                'Langlebig',
                'Verschiedene Farben',
              ],
              partnerShopName: 'Tool Expert',
              partnerShopUrl: 'https://example.com',
              availabilityStatus: 'low_stock',
              reasonForRecommendation:
                'Perfekt abgestimmt auf Ihre Reinigungsroutine',
              matchScore: 85,
            },
          ],
        };

        setRecommendations(demoData);

        // Wähle das erste Produkt als Standard aus
        if (demoData.recommendations.length > 0) {
          setSelectedProduct(demoData.recommendations[0]);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          if (i < Math.floor(rating)) {
            return (
              <StarSolid
                key={i}
                className="w-4 h-4 text-[#f8de00] fill-current"
              />
            );
          } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
            return (
              <StarSolid
                key={i}
                className="w-4 h-4 text-[#f8de00] fill-current opacity-50"
              />
            );
          } else {
            return <StarIcon key={i} className="w-4 h-4 text-slate-300" />;
          }
        })}
        <span className="ml-2 text-sm text-slate-600">({rating})</span>
      </div>
    );
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return (
          <Badge className="bg-green-100 text-green-800">
            Sofort verfügbar
          </Badge>
        );
      case 'low_stock':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Nur noch wenige
          </Badge>
        );
      case 'out_of_stock':
        return (
          <Badge className="bg-red-100 text-red-800">Nicht verfügbar</Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f8de00]"></div>
          <p className="mt-4 text-slate-600">Lade Ihre Empfehlungen...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || !selectedProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Keine Empfehlungen verfügbar.</p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4 bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950"
          >
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-6 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-slate-300 hover:text-white mr-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Zurück
            </Button>
            <Badge className="bg-[#f8de00] text-neutral-950">
              <InformationCircleIcon className="w-4 h-4 mr-2" />
              Ihre Empfehlungen
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Ihre persönlichen Produktempfehlungen
          </h1>
          <p className="text-slate-300">
            {recommendations.personalizedMessage}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Produktdetails - Links (2/3 der Breite) */}
            <div className="lg:col-span-2">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Produktbild */}
                    <div className="space-y-4">
                      <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                        <div className="text-6xl">
                          {selectedProduct.category === 'Felgenreiniger'
                            ? '🧽'
                            : selectedProduct.category === 'Wachs'
                            ? '✨'
                            : selectedProduct.category === 'Shampoo'
                            ? '🧼'
                            : '🧽'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <HeartIcon className="w-4 h-4 mr-2" />
                          Merken
                        </Button>
                        <Button variant="outline" size="sm">
                          Teilen
                        </Button>
                      </div>
                    </div>

                    {/* Produktinfo */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">
                          {selectedProduct.brand}
                        </p>
                        <h2 className="text-2xl font-bold text-neutral-950 mb-2">
                          {selectedProduct.name}
                        </h2>
                        <Badge className="mb-2">
                          {selectedProduct.category}
                        </Badge>
                        <div className="flex items-center gap-4 mb-4">
                          {renderStars(selectedProduct.rating)}
                          <span className="text-sm text-slate-500">
                            {selectedProduct.reviewCount} Bewertungen
                          </span>
                        </div>
                      </div>

                      {/* Preis */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-neutral-950">
                          €{selectedProduct.price.toFixed(2)}
                        </span>
                        {selectedProduct.originalPrice && (
                          <span className="text-lg text-slate-500 line-through">
                            €{selectedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Verfügbarkeit */}
                      <div className="flex items-center gap-3">
                        {getAvailabilityBadge(
                          selectedProduct.availabilityStatus
                        )}
                        <div className="flex items-center text-sm text-green-600">
                          <TruckIcon className="w-4 h-4 mr-1" />
                          Kostenloser Versand ab 50€
                        </div>
                      </div>

                      {/* Kaufbuttons */}
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950"
                          size="lg"
                        >
                          <ShoppingCartIcon className="w-5 h-5 mr-2" />
                          Jetzt bei {selectedProduct.partnerShopName} kaufen
                        </Button>
                        <Button variant="outline" className="w-full" size="lg">
                          <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                          Zum Shop
                        </Button>
                      </div>

                      {/* Match-Grund */}
                      <Card className="bg-sky-50 border-sky-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-sky-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-neutral-950 mb-1">
                                Warum wir das empfehlen
                              </p>
                              <p className="text-sm text-slate-600">
                                {selectedProduct.reasonForRecommendation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Beschreibung und Features */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-950 mb-3">
                        Produktbeschreibung
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-950 mb-3">
                        Eigenschaften
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {selectedProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-slate-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Produktliste - Rechts (1/3 der Breite) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Alle Empfehlungen</span>
                      <Badge variant="secondary">
                        {recommendations.recommendations.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Gesamtwert:{' '}
                      <span className="font-semibold">
                        €{recommendations.estimatedTotalCost.toFixed(2)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {recommendations.recommendations.map((product, index) => (
                        <div key={product.id}>
                          <button
                            onClick={() => handleProductSelect(product)}
                            className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                              selectedProduct.id === product.id
                                ? 'bg-sky-50 border-r-2 border-sky-400'
                                : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">
                                  {product.category === 'Felgenreiniger'
                                    ? '🧽'
                                    : product.category === 'Wachs'
                                    ? '✨'
                                    : product.category === 'Shampoo'
                                    ? '🧼'
                                    : '🧽'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-neutral-950 truncate">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-slate-500 mb-1">
                                  {product.brand}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) =>
                                      i < Math.floor(product.rating) ? (
                                        <StarSolid
                                          key={i}
                                          className="w-3 h-3 text-[#f8de00]"
                                        />
                                      ) : (
                                        <StarIcon
                                          key={i}
                                          className="w-3 h-3 text-slate-300"
                                        />
                                      )
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    ({product.reviewCount})
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-neutral-950">
                                    €{product.price.toFixed(2)}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-800"
                                  >
                                    {product.matchScore}% Match
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </button>
                          {index <
                            recommendations.recommendations.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Alle kaufen Button */}
                <Button
                  className="w-full mt-4 bg-neutral-950 hover:bg-neutral-900 text-white"
                  size="lg"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Alle Produkte kaufen (€
                  {recommendations.estimatedTotalCost.toFixed(2)})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
