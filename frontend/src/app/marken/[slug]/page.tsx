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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBrand, getBrandProducts, Product } from '@/data/brands';
import {
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BrandPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (params?.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

      // Brand-Daten laden
      const brandData = getBrand(slug);
      const productsData = getBrandProducts(slug);

      // 404 wenn Marke nicht gefunden
      if (!brandData || !productsData) {
        notFound();
        return;
      }

      setBrand(brandData);
      setProducts(productsData);
      setActiveCategory(brandData.categories[0]);
    }
  }, [params?.slug]);

  // Loading state
  if (!brand || !products) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#f8de00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Marke wird geladen...</p>
        </div>
      </div>
    );
  }

  // Produkte filtern
  const filteredProducts = searchQuery
    ? (Object.entries(products)
        .map(([category, categoryProducts]) => [
          category,
          (categoryProducts as Product[]).filter(
            (product: Product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
        ])
        .filter(
          ([_, categoryProducts]) => (categoryProducts as Product[]).length > 0
        ) as [string, Product[]][])
    : (Object.entries(products) as [string, Product[]][]);

  const currentProducts = searchQuery
    ? filteredProducts.flatMap(([_, categoryProducts]) => categoryProducts)
    : products[activeCategory] || [];

  const totalProducts = Object.values(products).flat().length;

  return (
    <div className="min-h-screen bg-background">
      {/* Brand Header */}
      <section className="py-12 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/marken')}
              className="text-slate-300 hover:text-white hover:bg-slate-800 mr-4"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Zurück zu Marken
            </Button>
            <Badge
              variant="secondary"
              className="bg-[#f8de00] text-neutral-950 border-[#f8de00] hover:bg-[#f8de00] hover:text-neutral-950"
            >
              <TagIcon className="w-4 h-4 mr-2" />
              Premium Marke
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Brand Logo */}
            <div className="w-32 h-32 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <BuildingStorefrontIcon className="w-16 h-16 text-slate-400" />
            </div>

            {/* Brand Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{brand.name}</h1>
              <div className="flex items-center gap-4 text-slate-300 mb-4">
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                  <span>{brand.rating} Bewertung</span>
                </div>
                <span>•</span>
                <span>{totalProducts} Fahrzeug-getestete Produkte</span>
                <span>•</span>
                <span>Community-empfohlen seit {brand.founded}</span>
              </div>

              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                {brand.description}
              </p>

              {/* Stefan's Verification Box */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#f8de00] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-950 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-3">
                      Warum {brand.name} für Auto-Enthusiasten?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-slate-300 text-sm">
                      <div>
                        <strong className="text-[#f8de00]">
                          Lackkompatibilität:
                        </strong>
                        <br />
                        Getestet an deutschen Premiumlacken: BMW, Mercedes,
                        Audi, VW
                      </div>
                      <div>
                        <strong className="text-[#f8de00]">
                          Profi-Ergebnisse:
                        </strong>
                        <br />
                        Schritt-für-Schritt Anleitungen vermeiden teure Fehler
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stefan's Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-lg font-bold text-[#f8de00]">
                    {brand.categories.length}
                  </div>
                  <div className="text-sm text-slate-400">
                    Anwendungsbereiche
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#f8de00]">
                    {totalProducts}
                  </div>
                  <div className="text-sm text-slate-400">
                    Getestete Produkte
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#f8de00]">97%</div>
                  <div className="text-sm text-slate-400">
                    Fahrzeugbesitzer zufrieden
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#f8de00]">24/7</div>
                  <div className="text-sm text-slate-400">
                    Support verfügbar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suche - Stefan-optimiert */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Fahrzeug-Produkte suchen (z.B. 'Paint Correction')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200"
              />
            </div>

            {/* Stefan's Quick Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('Polish')}
                className="text-xs"
              >
                🔧 Paint Correction
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('Wax')}
                className="text-xs"
              >
                🛡️ Schutz
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('Wheel')}
                className="text-xs"
              >
                ⚙️ Felgen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Produkte nach Kategorien */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {searchQuery ? (
            // Suchergebnisse anzeigen
            <div>
              <h2 className="text-2xl font-bold mb-8 text-neutral-950">
                Suchergebnisse für "{searchQuery}" (
                {filteredProducts.flatMap(([_, products]) => products).length}{' '}
                gefunden)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.flatMap(([category, products]) =>
                  products.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      category={category}
                      brandSlug={brand.slug}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            // Kategorie-Tabs
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList
                className="grid w-full grid-cols-5 mb-8"
                style={{
                  gridTemplateColumns: `repeat(${brand.categories.length}, minmax(0, 1fr))`,
                }}
              >
                {brand.categories.map((category: string) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {brand.categories.map((category: string) => (
                <TabsContent key={category} value={category} className="mt-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-950 mb-2">
                      {category}
                    </h2>
                    <p className="text-slate-600">
                      {products[category]?.length || 0} Produkte in dieser
                      Kategorie
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products[category]?.map((product: Product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        category={category}
                        brandSlug={brand.slug}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {/* Keine Produkte gefunden */}
          {searchQuery && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Keine Produkte gefunden
              </h3>
              <p className="text-slate-500 mb-4">
                Versuchen Sie andere Suchbegriffe.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Suche zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Die Geschichte von {brand.name}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {brand.fullDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Timeline */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">Meilensteine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brand.history.map((milestone: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#f8de00] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-slate-600">{milestone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">Unternehmen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-slate-700">Hauptsitz</p>
                    <p className="text-slate-600">{brand.headquarters}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Spezialität</p>
                    <p className="text-slate-600">{brand.specialty}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Website</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#f8de00] hover:text-[#e6c700]"
                      onClick={() => window.open(brand.website, '_blank')}
                    >
                      {brand.website}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Brauchen Sie Beratung?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Lassen Sie sich von unserem Produktberater die passenden{' '}
            {brand.name}
            Produkte für Ihr Auto empfehlen.
          </p>
          <Button
            size="lg"
            onClick={() => router.push(`/wizard?brand=${brand.slug}`)}
            className="bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 font-semibold px-8 py-4"
          >
            Produktberater starten
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Produkt-Karte Komponente
function ProductCard({
  product,
  category,
  brandSlug,
}: {
  product: Product;
  category: string;
  brandSlug: string;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/marken/${brandSlug}/produkt/${product.id}`);
  };

  return (
    <Card
      className="border-slate-200 hover:shadow-lg transition-all group cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        {/* Product Image Placeholder */}
        <div className="w-full h-48 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
          <BuildingStorefrontIcon className="w-12 h-12 text-slate-300" />
        </div>

        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="secondary"
            className="text-xs bg-slate-100 text-slate-700"
          >
            {category}
          </Badge>
          <Badge
            variant={
              product.availability === 'Auf Lager' ? 'default' : 'secondary'
            }
            className={
              product.availability === 'Auf Lager'
                ? 'bg-green-100 text-green-800 text-xs'
                : 'bg-orange-100 text-orange-800 text-xs'
            }
          >
            {product.availability}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold text-neutral-950 group-hover:text-[#f8de00] transition-colors line-clamp-2">
          {product.name}
        </CardTitle>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-sm text-slate-600">
            {product.reviews} Bewertungen
          </span>
        </div>

        <CardDescription className="text-slate-600 text-sm line-clamp-3">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {product.features
              .slice(0, 3)
              .map((feature: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-slate-300 text-slate-600"
                >
                  {feature}
                </Badge>
              ))}
          </div>

          {/* Size */}
          <p className="text-sm text-slate-500">Inhalt: {product.size}</p>

          {/* Price */}
          <div className="pt-2">
            <div className="text-lg font-bold text-neutral-950">
              €{product.price}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
