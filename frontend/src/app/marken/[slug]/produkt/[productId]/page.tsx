'use client';

import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getBrand,
  getBrandProducts,
  getProductOffers,
  Product,
  ProductOffer,
} from '@/data/brands';
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<ProductOffer | null>(null);

  useEffect(() => {
    if (params?.slug && params?.productId) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      const productId = Array.isArray(params.productId)
        ? params.productId[0]
        : params.productId;

      // Brand-Daten laden
      const brandData = getBrand(slug);
      const productsData = getBrandProducts(slug);

      if (!brandData || !productsData) {
        notFound();
        return;
      }

      // Produkt in allen Kategorien suchen
      let foundProduct: Product | null = null;
      for (const categoryProducts of Object.values(productsData)) {
        const productInCategory = categoryProducts.find(
          (p) => p.id === productId
        );
        if (productInCategory) {
          foundProduct = productInCategory;
          break;
        }
      }

      if (!foundProduct) {
        notFound();
        return;
      }

      setBrand(brandData);
      setProduct(foundProduct);

      // Händler-Angebote generieren
      const productOffers = getProductOffers(foundProduct, brandData.name);
      setOffers(productOffers);
      setSelectedOffer(productOffers[0]); // Günstigstes Angebot als Standard
    }
  }, [params?.slug, params?.productId]);

  // Loading state
  if (!brand || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#f8de00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Produkt wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button
              onClick={() => router.push('/marken')}
              className="hover:text-slate-700"
            >
              Marken
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/marken/${brand.slug}`)}
              className="hover:text-slate-700"
            >
              {brand.name}
            </button>
            <span>/</span>
            <span className="text-slate-700">{product.name}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/marken/${brand.slug}`)}
            className="text-slate-600 hover:text-neutral-950"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Zurück zu {brand.name}
          </Button>
        </div>
      </section>

      {/* Produkt-Details */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Produkt-Bild */}
            <div className="space-y-4">
              <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="w-24 h-24 text-slate-300" />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-slate-50 rounded border-2 border-transparent hover:border-[#f8de00] cursor-pointer flex items-center justify-center"
                  >
                    <BuildingStorefrontIcon className="w-8 h-8 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Produkt-Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    {brand.name}
                  </Badge>
                  <Badge
                    variant={
                      product.availability === 'Auf Lager'
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      product.availability === 'Auf Lager'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }
                  >
                    {product.availability}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-neutral-950 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(product.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-600">
                    {product.reviews} Fahrzeugbesitzer Bewertungen
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stefan's Critical Decision Support */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">🚗</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-3">
                        Warum funktioniert das bei Ihrem Fahrzeug?
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-blue-800 text-sm">
                        <div>
                          <strong>Lackkompatibilität:</strong>
                          <br />
                          pH-neutral (6.5-7.5), Clear Coat sicher
                        </div>
                        <div>
                          <strong>Anwendungstemperatur:</strong>
                          <br />
                          15-25°C optimal, Schatten bevorzugt
                        </div>
                        <div>
                          <strong>Getestet an:</strong>
                          <br />
                          BMW, Mercedes, Audi, VW, Porsche Lacken
                        </div>
                        <div>
                          <strong>Profi-Tipp:</strong>
                          <br />
                          350 GSM Mikrofaser für beste Ergebnisse
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Produktdetails - kompakt und sofort sichtbar */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-neutral-950">
                      Technische Daten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Marke:</span>
                      <span className="font-medium">{brand.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Inhalt:</span>
                      <span className="font-medium">{product.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Bewertung:</span>
                      <span className="font-medium">{product.rating}/5 ⭐</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Verfügbarkeit:</span>
                      <span className="font-medium text-green-600">
                        {product.availability}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-neutral-950">
                      Anwendung
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <h4 className="font-medium text-neutral-950 text-sm">
                        Eigenschaften:
                      </h4>
                      <ul className="space-y-1">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <li
                            key={index}
                            className="text-xs text-slate-600 flex items-center"
                          >
                            <div className="w-1.5 h-1.5 bg-[#f8de00] rounded-full mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-neutral-950 mb-3">
                  Eigenschaften:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-slate-300 text-slate-700"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Call-to-Action für Partner-Shops */}
              <div className="bg-gradient-to-r from-[#f8de00] to-[#e6c700] rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-neutral-950 mb-2">
                  Jetzt Preise vergleichen
                </h3>
                <p className="text-neutral-800 mb-4">
                  Finden Sie das beste Angebot von unseren vertrauenswürdigen
                  Partner-Shops
                </p>
                <Button
                  size="lg"
                  onClick={() => {
                    const preisvergleichElement =
                      document.getElementById('preisvergleich');
                    if (preisvergleichElement) {
                      preisvergleichElement.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold px-8"
                >
                  Zu den Angeboten
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preisvergleich - Stefan-optimiert */}
      <section id="preisvergleich" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-950">
              Preisvergleich - {offers.length} Angebote
            </h2>

            {/* Stefan's Price Context */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm">
                <strong className="text-green-800">
                  💡 Profi-Service Vergleich:
                </strong>
                <br />
                <span className="text-green-700">
                  Detailing-Shop: €80-120 | DIY mit diesem Produkt: ~€25
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer, index) => (
              <Card
                key={offer.retailerId}
                className={`border transition-all cursor-pointer ${
                  selectedOffer?.retailerId === offer.retailerId
                    ? 'border-[#f8de00] ring-2 ring-[#f8de00] ring-opacity-20 bg-yellow-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedOffer(offer)}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Händler Info - Links */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BuildingStorefrontIcon className="w-6 h-6 text-slate-400" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-neutral-950">
                            {offer.retailerName}
                          </h3>
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              💰 Bester Preis
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                          <div className="flex items-center">
                            <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{offer.rating}</span>
                            <span className="text-slate-500 ml-1">
                              ({offer.reviewCount.toLocaleString()})
                            </span>
                          </div>
                          <div className="flex items-center">
                            <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-1" />
                            <span>{offer.trustScore}% Vertrauen</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preis & Verfügbarkeit - Mitte */}
                    <div className="text-center md:text-center">
                      <div className="mb-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {offer.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">
                              €{offer.originalPrice}
                            </span>
                          )}
                          <span className="text-2xl md:text-3xl font-bold text-neutral-950">
                            €{offer.price}
                          </span>
                        </div>
                        <div className="text-sm">
                          {offer.shippingCost === 'Kostenlos' ? (
                            <span className="text-green-600 font-medium">
                              Versandkostenfrei
                            </span>
                          ) : (
                            <span className="text-slate-600">
                              + €{offer.shippingCost} Versand
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm">
                        {offer.inStock ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                        )}
                        <span
                          className={`font-medium ${
                            offer.inStock ? 'text-green-700' : 'text-orange-700'
                          }`}
                        >
                          {offer.availability}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {offer.shippingTime}
                      </div>
                    </div>

                    {/* Aktion - Rechts */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          Gesamt: €
                          {(
                            parseFloat(offer.price.toString()) +
                            (offer.shippingCost === 'Kostenlos'
                              ? 0
                              : parseFloat(offer.shippingCost || '0'))
                          ).toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Spare €
                          {(
                            80 -
                            (parseFloat(offer.price.toString()) +
                              (offer.shippingCost === 'Kostenlos'
                                ? 0
                                : parseFloat(offer.shippingCost || '0')))
                          ).toFixed(0)}{' '}
                          vs. Profi
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(offer.url, '_blank');
                        }}
                        className="bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 font-semibold px-6 py-2 w-full md:w-auto"
                        disabled={!offer.inStock}
                      >
                        {offer.inStock ? 'Jetzt kaufen' : 'Nicht verfügbar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stefan's Budget Context */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">€</span>
                </div>
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-1">
                    Budget-Tipp für Auto-Enthusiasten
                  </h4>
                  <p>
                    Ein komplettes Detailing-Set kostet €50-80 und reicht für
                    3-4 Anwendungen. Das entspricht dem Preis einer einzigen
                    Profi-Behandlung!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">💡</span>
                </div>
                <div className="text-sm text-green-800">
                  <h4 className="font-medium mb-1">Langzeit-Kostenvorteil</h4>
                  <p>
                    Regelmäßige DIY-Pflege alle 2-3 Monate hält Ihr Fahrzeug in
                    Show-Car-Zustand und spart jährlich €400-600 gegenüber
                    Profi-Services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Bewertungen - Stefan's Social Proof */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-neutral-950 mb-8">
            Auto-Community Erfahrungen
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Community Stats */}
            <div className="lg:col-span-1">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-neutral-950 mb-4">
                    Community Bewertung
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">BMW Besitzer</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.8/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mercedes Besitzer</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.9/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audi Besitzer</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.7/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">VW/Porsche Besitzer</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.6/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f8de00]">
                        96%
                      </div>
                      <div className="text-sm text-slate-600">
                        würden es anderen Autobesitzern empfehlen
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stefan's Peer Reviews */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">
                        MW
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Michael W.</h4>
                        <Badge variant="outline" className="text-xs">
                          BMW E90 335i
                        </Badge>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className="w-4 h-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mb-3">
                        "Nach 3 Jahren der Suche nach dem richtigen Produkt für
                        meinen Tiefschwarz Metallic Lack endlich gefunden! Kein
                        Swirl-Mark mehr und der Glanz ist beeindruckend.
                        <strong>
                          Verwendet mit 2-Bucket-Methode und 350 GSM
                          Mikrofaser-Tuch.
                        </strong>
                        "
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Verifizierter BMW-Besitzer</span>
                        <span>•</span>
                        <span>3 Monate her</span>
                        <span>•</span>
                        <span className="text-green-600">Hilfreich (23)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">
                        AM
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Andreas M.</h4>
                        <Badge variant="outline" className="text-xs">
                          Mercedes C63 AMG
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-orange-50 text-orange-600"
                        >
                          Top Reviewer
                        </Badge>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className="w-4 h-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mb-3">
                        "Als Ingenieur habe ich viel recherchiert. Dieses
                        Produkt erfüllt alle technischen Anforderungen:{' '}
                        <strong>
                          pH 7.2, kein Silikon, UV-Schutz inklusive
                        </strong>
                        . Perfekt für Obsidianschwarz Metallic. AMG-Performance
                        bleibt geschützt!"
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>r/AutoDetailing Community</span>
                        <span>•</span>
                        <span>1 Monat her</span>
                        <span>•</span>
                        <span className="text-green-600">Hilfreich (41)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">
                        LK
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Lisa K.</h4>
                        <Badge variant="outline" className="text-xs">
                          Audi RS6 Avant
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-600"
                        >
                          Detailing Profi
                        </Badge>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className="w-4 h-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mb-3">
                        "Als Detailing-Shop Betreiberin kenne ich alle Produkte.{' '}
                        <strong>Hält 3 Monate bei wöchentlicher Wäsche</strong>.
                        Nardo Grau Lack strahlt wie am ersten Tag. Auch an
                        Brembo-Bremsen getestet - top Ergebnisse!"
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Verifizierter Experte</span>
                        <span>•</span>
                        <span>2 Wochen her</span>
                        <span>•</span>
                        <span className="text-green-600">Hilfreich (67)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stefan's Community CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Teil der Auto-Detailing Community werden
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Tauschen Sie sich mit über 25.000 Auto-Enthusiasten aus.
                  Stellen Sie Fragen, teilen Sie Ihre Ergebnisse und lernen Sie
                  von den Besten - egal ob BMW, Mercedes, Audi oder andere
                  Marken.
                </p>
                <div className="flex gap-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    r/AutoDetailing beitreten
                  </Button>
                  <Button variant="outline" size="sm">
                    Motor-Talk Forum
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ähnliche Produkte */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-neutral-950 mb-8 text-center">
            Weitere Produkte von {brand.name}
          </h2>
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => router.push(`/marken/${brand.slug}`)}
              className="border-slate-300 hover:bg-slate-50"
            >
              Alle {brand.name} Produkte ansehen
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
