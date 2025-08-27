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
import { getAllBrands, getTotalProductsForBrand } from '@/data/brands';
import {
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MarkenPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  // Brand-Daten laden
  const allBrands = getAllBrands().map((brand) => ({
    ...brand,
    productCount: getTotalProductsForBrand(brand.slug),
    topProducts: getTopProductsForBrand(brand.slug),
  }));

  // Top-Produkte für Marken definieren
  function getTopProductsForBrand(slug: string): string[] {
    const topProducts: { [key: string]: string[] } = {
      meguiars: [
        'Ultimate Compound',
        'Gold Class Carnauba Plus',
        'All Wheel Cleaner',
      ],
      'chemical-guys': [
        'Mr. Pink Shampoo',
        'Butter Wet Wax',
        'V07 Spray Sealant',
      ],
      sonax: ['Xtreme Polish & Wax', 'Wheel Cleaner Plus', 'Gloss Shampoo'],
      'turtle-wax': ['Super Hard Shell Wax', 'Zip Wax Car Wash', 'Color Magic'],
    };
    return topProducts[slug] || ['Produkt 1', 'Produkt 2', 'Produkt 3'];
  }

  // Kategorien speziell für Stefan's Bedürfnisse als BMW-Enthusiast
  const allCategories = [
    'Alle',
    'Paint Correction', // Stefan's Hauptinteresse
    'Schutz & Versiegelung', // Langzeitschutz für seinen BMW
    'Felgenreinigung', // Wichtig für sein Wochenend-Detailing
    'Professionelle Anwendung', // Er will Profi-Ergebnisse
    'Deutsche Premiummarken', // Vertrauen in deutsche Qualität
  ];

  // Marken filtern - Stefan-spezifisch
  const filteredBrands = allBrands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Stefan-spezifische Kategorie-Zuordnung
    const matchesCategory =
      selectedCategory === 'Alle' ||
      (selectedCategory === 'Paint Correction' &&
        ['meguiars', 'chemical-guys', 'sonax'].includes(brand.slug)) ||
      (selectedCategory === 'Schutz & Versiegelung' &&
        ['sonax', 'turtle-wax', 'meguiars'].includes(brand.slug)) ||
      (selectedCategory === 'Felgenreinigung' &&
        ['sonax', 'meguiars', 'chemical-guys'].includes(brand.slug)) ||
      (selectedCategory === 'Professionelle Anwendung' &&
        ['meguiars', 'chemical-guys', 'sonax'].includes(brand.slug)) ||
      (selectedCategory === 'Deutsche Premiummarken' &&
        brand.slug === 'sonax') ||
      brand.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <Badge
              variant="secondary"
              className="mb-4 bg-[#f8de00] text-neutral-950 border-[#f8de00] hover:bg-[#f8de00] hover:text-neutral-950 inline-flex"
            >
              <TagIcon className="w-4 h-4 mr-2" />
              Für Premiumfahrzeuge
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Die richtigen Produkte für Ihr Fahrzeug finden
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Schluss mit stundenlanger Recherche und widersprüchlichen
              Empfehlungen. Hier finden Sie bewährte Marken, die von
              Enthusiasten und Profis für BMW, Mercedes, Audi, VW und weitere
              Marken empfohlen werden.
            </p>

            {/* Stefan's Pain Points addressed */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#f8de00] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-neutral-950 text-sm font-bold">✓</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-2">
                    Warum diese Marken?
                  </h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>
                      • <strong>Erprobt an deutschen Premiumlacken:</strong>{' '}
                      BMW, Mercedes, Audi, VW, Porsche getestet
                    </li>
                    <li>
                      • <strong>Technische Transparenz:</strong> pH-Werte,
                      Inhaltsstoffe und Anwendung erklärt
                    </li>
                    <li>
                      • <strong>Community-bewährt:</strong> Von
                      Detailing-Experten und r/AutoDetailing empfohlen
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiken */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-12">
            <div>
              <div className="text-2xl font-bold text-[#f8de00]">
                {allBrands.length}
              </div>
              <div className="text-sm text-slate-400">Bewährte Marken</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8de00]">
                {allBrands.reduce(
                  (sum: number, brand) => sum + brand.productCount,
                  0
                )}
                +
              </div>
              <div className="text-sm text-slate-400">Getestete Produkte</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8de00]">
                {allCategories.length - 1}
              </div>
              <div className="text-sm text-slate-400">Kategorien</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8de00]">97%</div>
              <div className="text-sm text-slate-400">Zufriedenheit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Suche */}
      <section className="py-8 px-4 bg-slate-50 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Suchfeld */}
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Marken durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200"
              />
            </div>

            {/* Kategorie-Filter */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950'
                      : 'border-slate-300 hover:bg-slate-100'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marken-Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => router.push(`/marken/${brand.slug}`)}
              >
                <CardHeader className="text-center">
                  {/* Brand Logo Placeholder */}
                  <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <BuildingStorefrontIcon className="w-12 h-12 text-slate-400" />
                  </div>

                  <CardTitle className="text-xl font-bold text-neutral-950 group-hover:text-[#f8de00] transition-colors">
                    {brand.name}
                  </CardTitle>

                  <div className="flex items-center justify-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                      {brand.rating}
                    </div>
                    <div>{brand.productCount} Produkte</div>
                  </div>

                  <CardDescription className="text-slate-600">
                    {brand.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Kategorien */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Kategorien:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {brand.categories.slice(0, 4).map((category, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-700"
                          >
                            {category}
                          </Badge>
                        ))}
                        {brand.categories.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-700"
                          >
                            +{brand.categories.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Gegründet</p>
                        <p className="font-medium text-slate-700">
                          {brand.founded}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Spezialität</p>
                        <p className="font-medium text-slate-700">
                          {brand.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Top Produkte */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Top Produkte:
                      </p>
                      <ul className="space-y-1">
                        {brand.topProducts.slice(0, 3).map((product, index) => (
                          <li
                            key={index}
                            className="text-xs text-slate-600 flex items-center"
                          >
                            <div className="w-1 h-1 bg-[#f8de00] rounded-full mr-2"></div>
                            {product}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Button
                      className="w-full bg-slate-100 hover:bg-[#f8de00] text-slate-700 hover:text-neutral-950 border-0 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/marken/${brand.slug}`);
                      }}
                    >
                      Produkte ansehen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Keine Ergebnisse */}
          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Keine Marken gefunden
              </h3>
              <p className="text-slate-500 mb-4">
                Versuchen Sie andere Suchbegriffe oder Filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Alle');
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Finden Sie nicht die richtige Marke?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Nutzen Sie unseren Produktberater für personalisierte Empfehlungen
            basierend auf Ihrem Auto und Ihren spezifischen Bedürfnissen.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/wizard')}
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
