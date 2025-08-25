'use client';

import {
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  FunnelIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  StarIcon,
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
  recommendations: Product[];
  personalizedMessage: string;
  totalProducts: number;
  categories: string[];
  estimatedTotalCost: number;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] =
    useState<RecommendationData | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    // Load recommendations from localStorage or API
    const loadRecommendations = async () => {
      try {
        const stored = localStorage.getItem('autocare_recommendations');
        if (stored) {
          const data = JSON.parse(stored);
          setRecommendations(data);
          setFilteredProducts(data.recommendations || []);
        } else {
          // Fallback: Show demo data if no recommendations found
          const demoData: RecommendationData = {
            personalizedMessage:
              'Basierend auf Ihren Angaben haben wir diese Produkte für Sie ausgewählt:',
            totalProducts: 8,
            estimatedTotalCost: 245,
            categories: [
              'Lackreinigung',
              'Innenraumreinigung',
              'Felgenpflege',
              'Schutzprodukte',
            ],
            recommendations: [
              {
                id: '1',
                name: 'Premium Auto Shampoo',
                brand: 'Meguiars',
                category: 'Lackreinigung',
                price: 24.99,
                originalPrice: 29.99,
                rating: 4.8,
                reviewCount: 1247,
                image:
                  'https://via.placeholder.com/300x200/2563eb/ffffff?text=Premium+Auto+Shampoo',
                description:
                  'Hochwertiges Auto-Shampoo für schonende Reinigung aller Lackoberflächen.',
                features: [
                  'pH-neutral',
                  'Schonend zu allen Lacken',
                  'Entfernt hartnäckigen Schmutz',
                  'Mit Glanzformel',
                ],
                partnerShopName: 'AutoPflege24',
                partnerShopUrl: '#',
                availabilityStatus: 'in_stock',
                reasonForRecommendation:
                  'Perfekt für Ihr Metallic-Lack Fahrzeug und wöchentliche Pflege',
                matchScore: 96,
              },
              {
                id: '2',
                name: 'Mikrofaser Waschtücher Set',
                brand: 'Chemical Guys',
                category: 'Lackreinigung',
                price: 19.99,
                rating: 4.7,
                reviewCount: 892,
                image:
                  'https://via.placeholder.com/300x200/059669/ffffff?text=Mikrofaser+Set',
                description:
                  'Premium Mikrofaser-Tücher für kratzfreie Autowäsche.',
                features: [
                  'Kratzfrei',
                  '6-teiliges Set',
                  'Verschiedene Größen',
                  'Waschbar',
                ],
                partnerShopName: 'CarCare Pro',
                partnerShopUrl: '#',
                availabilityStatus: 'in_stock',
                reasonForRecommendation:
                  'Ideal für Ihre Erfahrungsstufe und schonende Lackpflege',
                matchScore: 94,
              },
              {
                id: '3',
                name: 'Felgenreiniger Gel',
                brand: 'Sonax',
                category: 'Felgenpflege',
                price: 12.99,
                rating: 4.6,
                reviewCount: 634,
                image:
                  'https://via.placeholder.com/300x200/dc2626/ffffff?text=Felgenreiniger',
                description: 'Kraftvoller Felgenreiniger für alle Felgentypen.',
                features: [
                  'Säurefrei',
                  'Für alle Felgen',
                  'Entfernt Bremsstaub',
                  'Einfache Anwendung',
                ],
                partnerShopName: 'Autopflege Meister',
                partnerShopUrl: '#',
                availabilityStatus: 'in_stock',
                reasonForRecommendation:
                  'Da Sie Felgen pflegen möchten und häufig fahren',
                matchScore: 91,
              },
              {
                id: '4',
                name: 'Innenraumreiniger',
                brand: 'Gyeon',
                category: 'Innenraumreinigung',
                price: 16.99,
                rating: 4.5,
                reviewCount: 445,
                image:
                  'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Innenraumreiniger',
                description:
                  'Universeller Innenraumreiniger für alle Oberflächen.',
                features: [
                  'Für alle Materialien',
                  'Antistatisch',
                  'Angenehmer Duft',
                  'Materialschonend',
                ],
                partnerShopName: 'DetailKing',
                partnerShopUrl: '#',
                availabilityStatus: 'low_stock',
                reasonForRecommendation:
                  'Perfekt für Ihre gewünschte Innenraumpflege',
                matchScore: 89,
              },
            ],
          };
          setRecommendations(demoData);
          setFilteredProducts(demoData.recommendations);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (!recommendations) return;

    let filtered = [...recommendations.recommendations];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevance':
      default:
        filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    setFilteredProducts(filtered);
  }, [recommendations, selectedCategory, sortBy, priceRange]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= Math.floor(rating) ? (
              <StarSolid className="w-4 h-4 text-yellow-400" />
            ) : star - 1 < rating ? (
              <>
                <StarIcon className="w-4 h-4 text-gray-300 absolute" />
                <StarSolid
                  className="w-4 h-4 text-yellow-400"
                  style={{
                    clipPath: `inset(0 ${
                      100 - (rating - Math.floor(rating)) * 100
                    }% 0 0)`,
                  }}
                />
              </>
            ) : (
              <StarIcon className="w-4 h-4 text-gray-300" />
            )}
          </div>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Verfügbar
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <InformationCircleIcon className="w-3 h-3 mr-1" />
            Nur noch wenige
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Ausverkauft
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Ihre Empfehlungen werden erstellt...
          </p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Keine Empfehlungen gefunden.</p>
          <button
            onClick={() => router.push('/questionnaire')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Fragebogen erneut ausfüllen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              🎯 Ihre Empfehlungen
            </h1>
            <button
              onClick={() => router.push('/questionnaire')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Fragebogen wiederholen
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Personalized Message */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-blue-700 font-medium">
                {recommendations.personalizedMessage}
              </p>
              <div className="mt-2 text-sm text-blue-600">
                <p>
                  <strong>{recommendations.totalProducts} Produkte</strong>{' '}
                  wurden für Sie ausgewählt • Geschätzte Gesamtkosten:{' '}
                  <strong>€{recommendations.estimatedTotalCost}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filter & Sortierung
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Alle Kategorien</option>
                  {recommendations.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sortieren nach
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevanz</option>
                  <option value="price_low">Preis aufsteigend</option>
                  <option value="price_high">Preis absteigend</option>
                  <option value="rating">Bewertung</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preisbereich
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>€0</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} von {recommendations.totalProducts}{' '}
                Produkten
              </p>
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Nach {sortBy} sortiert
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 left-4">
                      {getAvailabilityBadge(product.availabilityStatus)}
                    </div>
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                      {product.matchScore}% Match
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">
                        {product.brand}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        €{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          €{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Recommendation Reason */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-700">
                        <strong>Warum empfohlen:</strong>{' '}
                        {product.reasonForRecommendation}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <a
                        href={product.partnerShopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Bei {product.partnerShopName} kaufen
                        <ExternalLinkIcon className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Keine Produkte gefunden, die Ihren Filterkriterien
                  entsprechen.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Gefallen Ihnen unsere Empfehlungen?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Teilen Sie Ihre Erfahrungen mit uns und helfen Sie anderen
            Autobesitzern bei der richtigen Produktwahl.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Erfahrung teilen
            </button>
            <button
              onClick={() => router.push('/questionnaire')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Neue Empfehlung erstellen
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
