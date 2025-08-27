// Marken-Daten für verschiedene Autopflege-Marken
export interface ProductOffer {
  retailerId: string;
  retailerName: string;
  retailerLogo?: string;
  price: string;
  originalPrice?: string;
  availability: string;
  shippingCost: string;
  shippingTime: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  url: string;
  trustScore: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // Bester Preis (wird automatisch berechnet)
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  size: string;
  availability: string;
  offers?: ProductOffer[]; // Optional - wird zur Laufzeit generiert
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  founded: string;
  headquarters: string;
  specialty: string;
  categories: string[];
  rating: number;
  website: string;
  history: string[];
}

export interface BrandProducts {
  [category: string]: Product[];
}

// Brand Definitionen
export const brands: { [slug: string]: Brand } = {
  meguiars: {
    id: 'meguiars',
    name: "Meguiar's",
    slug: 'meguiars',
    description:
      'Premium Autopflege seit 1901. Profi-Qualität für perfekte Ergebnisse.',
    fullDescription: `Meguiar's ist eine der ältesten und renommiertesten Marken in der Autopflege-Industrie. Seit über 120 Jahren entwickelt das kalifornische Unternehmen innovative Produkte, die sowohl von Profis als auch von Enthusiasten weltweit geschätzt werden.

Die Marke ist bekannt für ihre wissenschaftliche Herangehensweise an die Lackpflege und ihre kontinuierliche Innovation. Von der ersten Möbelpolitur bis hin zu modernen Nanotechnologie-Produkten hat Meguiar's die Autopflege-Industrie maßgeblich geprägt.`,
    founded: '1901',
    headquarters: 'Irvine, Kalifornien, USA',
    specialty: 'Premium Lackpflege',
    categories: ['Lackpflege', 'Politur', 'Wachs', 'Innenraum', 'Felgen'],
    rating: 4.8,
    website: 'https://www.meguiars.com',
    history: [
      '1901 - Frank Meguiar Jr. gründet das Unternehmen',
      '1973 - Einführung der ersten Autopflege-Produkte',
      '1999 - Marktführer in Premium-Lackpflege',
      '2008 - Übernahme durch 3M Company',
      '2021 - Über 120 Jahre Innovation und Qualität',
    ],
  },
  'chemical-guys': {
    id: 'chemical-guys',
    name: 'Chemical Guys',
    slug: 'chemical-guys',
    description: 'Innovative Autopflege-Lösungen für Enthusiasten und Profis.',
    fullDescription: `Chemical Guys ist eine amerikanische Marke, die sich auf innovative Autopflege-Produkte und -Techniken spezialisiert hat. Das Unternehmen ist bekannt für seine breite Produktpalette und seine lebendige, enthusiastische Community.

Mit Fokus auf Qualität, Innovation und Kundenservice hat sich Chemical Guys zu einer der bekanntesten Marken in der Detailing-Szene entwickelt. Ihre Produkte werden von Autopflege-Enthusiasten und Profis gleichermaßen geschätzt.`,
    founded: '1968',
    headquarters: 'Torrance, Kalifornien, USA',
    specialty: 'Detailing Produkte',
    categories: ['Shampoo', 'Wachs', 'Politur', 'Detailing', 'Zubehör'],
    rating: 4.7,
    website: 'https://www.chemicalguys.com',
    history: [
      '1968 - Gründung als kleines Familienunternehmen',
      '1995 - Fokussierung auf Autopflege-Produkte',
      '2005 - Einführung innovativer Detailing-Techniken',
      '2010 - Aufbau einer starken Online-Community',
      '2020 - Einer der führenden Detailing-Marken weltweit',
    ],
  },
  sonax: {
    id: 'sonax',
    name: 'SONAX',
    slug: 'sonax',
    description: 'Deutsche Premium-Marke für professionelle Autopflege.',
    fullDescription: `SONAX ist ein deutsches Unternehmen mit über 70 Jahren Erfahrung in der Entwicklung und Herstellung von Autopflege-Produkten. Die Marke steht für German Engineering und höchste Qualitätsstandards.

Mit einem starken Fokus auf Forschung und Entwicklung bietet SONAX innovative Lösungen für alle Bereiche der Fahrzeugpflege. Von traditionellen Pflegeprodukten bis hin zu modernster Nanotechnologie - SONAX verbindet Tradition mit Innovation.`,
    founded: '1950',
    headquarters: 'Neuburg an der Donau, Deutschland',
    specialty: 'German Engineering',
    categories: ['Lackpflege', 'Felgen', 'Glas', 'Innenraum', 'Nano'],
    rating: 4.9,
    website: 'https://www.sonax.de',
    history: [
      '1950 - Gründung der SONAX GmbH',
      '1970 - Erste innovative Lackpflege-Produkte',
      '1990 - Expansion in internationale Märkte',
      '2005 - Einführung von Nanotechnologie-Produkten',
      '2020 - Marktführer in Deutschland und Europa',
    ],
  },
  'turtle-wax': {
    id: 'turtle-wax',
    name: 'Turtle Wax',
    slug: 'turtle-wax',
    description: 'Bewährte Qualität und Innovation in der Autopflege.',
    fullDescription: `Turtle Wax ist eine der ältesten und bekanntesten Autopflege-Marken der Welt. Seit über 75 Jahren steht das Unternehmen für zuverlässige Qualität und kontinuierliche Innovation in der Fahrzeugpflege.

Die Marke hat viele Meilensteine in der Autopflege-Industrie gesetzt und ist bekannt für ihre benutzerfreundlichen Produkte, die sowohl von Anfängern als auch von Profis geschätzt werden.`,
    founded: '1944',
    headquarters: 'Chicago, Illinois, USA',
    specialty: 'Wachs & Schutz',
    categories: ['Wachs', 'Shampoo', 'Politur', 'Schutz', 'Pflege'],
    rating: 4.6,
    website: 'https://www.turtlewax.com',
    history: [
      '1944 - Gründung durch Ben Hirsch',
      '1950 - Erstes flüssiges Autowachs',
      '1973 - Einführung von Spray-Wachsen',
      '1990 - Expansion in globale Märkte',
      '2010 - Modernisierung der Produktpalette',
    ],
  },
};

// Produkt-Daten für verschiedene Marken
export const brandProducts: { [slug: string]: BrandProducts } = {
  meguiars: {
    Lackpflege: [
      {
        id: 'ultimate-compound',
        name: 'Ultimate Compound',
        description:
          'Professionelle Politur entfernt Kratzer und Oxidation für perfekte Lackoberfläche.',
        price: '24,99',
        rating: 4.9,
        reviews: 847,
        image: '/images/products/meguiars-ultimate-compound.jpg',
        features: ['Entfernt Kratzer', 'Anti-Oxidation', 'Profi-Qualität'],
        size: '450ml',
        availability: 'Auf Lager',
      },
      {
        id: 'quik-detailer',
        name: 'Quik Detailer Mist & Wipe',
        description:
          'Schnelle Lackauffrischung zwischen Wäschen für dauerhaften Glanz.',
        price: '16,99',
        rating: 4.7,
        reviews: 523,
        image: '/images/products/meguiars-quik-detailer.jpg',
        features: ['Schnell-Finish', 'Staubentfernung', 'Glanzauffrischung'],
        size: '473ml',
        availability: 'Auf Lager',
      },
    ],
    Politur: [
      {
        id: 'mirror-glaze-polish',
        name: 'Mirror Glaze Professional Polish',
        description:
          'Premium-Politur für tieferen Glanz und professionelle Oberflächenveredelung.',
        price: '32,99',
        rating: 4.8,
        reviews: 392,
        image: '/images/products/meguiars-mirror-glaze.jpg',
        features: ['Spiegelglanz', 'Profi-Formel', 'Langzeit-Schutz'],
        size: '473ml',
        availability: 'Auf Lager',
      },
    ],
    Wachs: [
      {
        id: 'gold-class-carnauba',
        name: 'Gold Class Carnauba Plus',
        description:
          'Premium Carnauba-Wachs für unvergleichlichen Tiefenglanz und Schutz.',
        price: '28,99',
        rating: 4.9,
        reviews: 1247,
        image: '/images/products/meguiars-gold-class.jpg',
        features: ['Premium Carnauba', 'Tiefenglanz', 'UV-Schutz'],
        size: '311g',
        availability: 'Auf Lager',
      },
      {
        id: 'ultimate-liquid-wax',
        name: 'Ultimate Liquid Wax',
        description:
          'Synthetisches Wachs mit Carnauba für einfache Anwendung und Langzeitschutz.',
        price: '22,99',
        rating: 4.6,
        reviews: 689,
        image: '/images/products/meguiars-ultimate-wax.jpg',
        features: ['Einfache Anwendung', 'Langzeitschutz', 'Hybrid-Formel'],
        size: '473ml',
        availability: 'Wenige verfügbar',
      },
    ],
    Innenraum: [
      {
        id: 'interior-cleaner',
        name: 'All Purpose Interior Cleaner',
        description:
          'Universalreiniger für alle Innenraumoberflächen - sanft und effektiv.',
        price: '18,99',
        rating: 4.7,
        reviews: 634,
        image: '/images/products/meguiars-interior-cleaner.jpg',
        features: [
          'Universell einsetzbar',
          'Materialschonend',
          'Geruchsneutral',
        ],
        size: '473ml',
        availability: 'Auf Lager',
      },
    ],
    Felgen: [
      {
        id: 'wheel-brightener',
        name: 'All Wheel Cleaner',
        description:
          'Säurefreier Felgenreiniger für alle Felgentypen - sicher und effektiv.',
        price: '19,99',
        rating: 4.8,
        reviews: 456,
        image: '/images/products/meguiars-wheel-cleaner.jpg',
        features: ['Säurefrei', 'Alle Felgentypen', 'Bremsstaub-Löser'],
        size: '710ml',
        availability: 'Auf Lager',
      },
    ],
  },
  'chemical-guys': {
    Shampoo: [
      {
        id: 'mr-pink-shampoo',
        name: 'Mr. Pink Super Suds Shampoo',
        description:
          'Konzentriertes Autowaschmittel mit reichhaltigem Schaum und brillantem Glanz.',
        price: '19,99',
        rating: 4.8,
        reviews: 1523,
        image: '/images/products/chemical-guys-mr-pink.jpg',
        features: ['Konzentriert', 'Reichhaltiger Schaum', 'pH-neutral'],
        size: '473ml',
        availability: 'Auf Lager',
      },
    ],
    Wachs: [
      {
        id: 'butter-wet-wax',
        name: 'Butter Wet Wax',
        description:
          'Flüssigwachs mit Carnauba für einfache Anwendung und tiefen Glanz.',
        price: '24,99',
        rating: 4.7,
        reviews: 892,
        image: '/images/products/chemical-guys-butter-wax.jpg',
        features: ['Carnauba-Formel', 'Einfache Anwendung', 'Wasser-Abweisung'],
        size: '473ml',
        availability: 'Auf Lager',
      },
    ],
  },
  sonax: {
    Lackpflege: [
      {
        id: 'xtreme-polish-wax',
        name: 'Xtreme Polish & Wax',
        description:
          'All-in-One Politur und Wachs für perfekte Lackpflege in einem Schritt.',
        price: '26,99',
        rating: 4.9,
        reviews: 743,
        image: '/images/products/sonax-xtreme-polish.jpg',
        features: ['2-in-1 Formel', 'Nanotech', 'Langzeitschutz'],
        size: '500ml',
        availability: 'Auf Lager',
      },
    ],
    Felgen: [
      {
        id: 'wheel-cleaner-plus',
        name: 'Wheel Cleaner Plus',
        description:
          'Kraftvoller Felgenreiniger für hartnäckige Verschmutzungen und Bremsstaub.',
        price: '21,99',
        rating: 4.8,
        reviews: 567,
        image: '/images/products/sonax-wheel-cleaner.jpg',
        features: ['Säurefrei', 'Farbwechsel-Indikator', 'Alle Felgentypen'],
        size: '750ml',
        availability: 'Auf Lager',
      },
    ],
  },
  'turtle-wax': {
    Wachs: [
      {
        id: 'super-hard-shell-wax',
        name: 'Super Hard Shell Wax',
        description:
          'Klassisches Paste-Wachs für langanhaltenden Schutz und Glanz.',
        price: '17,99',
        rating: 4.6,
        reviews: 1089,
        image: '/images/products/turtle-wax-super-hard.jpg',
        features: ['Traditionelle Formel', 'Langanhaltend', 'Wetter-Schutz'],
        size: '397g',
        availability: 'Auf Lager',
      },
    ],
    Shampoo: [
      {
        id: 'zip-wax-shampoo',
        name: 'Zip Wax Car Wash',
        description:
          'Autowaschmittel mit Wachs-Zusatz für glänzende Reinigung.',
        price: '12,99',
        rating: 4.5,
        reviews: 734,
        image: '/images/products/turtle-wax-zip-wax.jpg',
        features: ['Mit Wachs-Zusatz', 'Glanz-Verstärker', 'Günstig'],
        size: '1L',
        availability: 'Auf Lager',
      },
    ],
  },
};

// Hilfsfunktionen
export function getBrand(slug: string): Brand | null {
  return brands[slug] || null;
}

export function getBrandProducts(slug: string): BrandProducts | null {
  return brandProducts[slug] || null;
}

export function getAllBrands(): Brand[] {
  return Object.values(brands);
}

export function getTotalProductsForBrand(slug: string): number {
  const products = brandProducts[slug];
  if (!products) return 0;
  return Object.values(products).flat().length;
}

// Händler-Angebote für ein Produkt generieren
export function getProductOffers(
  product: Product,
  brandName: string
): ProductOffer[] {
  return generateMockOffers(product.price, `${brandName} ${product.name}`);
}

// Mock-Händler-Angebote generieren
function generateMockOffers(
  basePrice: string,
  productName: string
): ProductOffer[] {
  const price = parseFloat(basePrice.replace(',', '.'));

  const retailers = [
    {
      id: 'amazon',
      name: 'Amazon',
      trustScore: 95,
      rating: 4.6,
      reviewCount: 15420,
    },
    {
      id: 'atu',
      name: 'A.T.U',
      trustScore: 88,
      rating: 4.3,
      reviewCount: 2350,
    },
    {
      id: 'autodoc',
      name: 'AUTODOC',
      trustScore: 92,
      rating: 4.5,
      reviewCount: 8900,
    },
    {
      id: 'conrad',
      name: 'Conrad',
      trustScore: 90,
      rating: 4.4,
      reviewCount: 1200,
    },
    {
      id: 'polo',
      name: 'POLO Motorrad',
      trustScore: 87,
      rating: 4.2,
      reviewCount: 890,
    },
  ];

  return retailers
    .map((retailer, index) => {
      // Preise variieren um ±15%
      const variation = (Math.random() - 0.5) * 0.3;
      const offerPrice = price * (1 + variation);
      const hasDiscount = Math.random() > 0.6;
      const originalPrice = hasDiscount ? offerPrice * 1.1 : undefined;

      return {
        retailerId: retailer.id,
        retailerName: retailer.name,
        price: offerPrice.toFixed(2).replace('.', ','),
        originalPrice: originalPrice?.toFixed(2).replace('.', ','),
        availability: Math.random() > 0.2 ? 'Auf Lager' : 'Wenige verfügbar',
        shippingCost: index < 2 ? 'Kostenlos' : '4,99',
        shippingTime: `${Math.floor(Math.random() * 3) + 1}-${
          Math.floor(Math.random() * 2) + 2
        } Werktage`,
        inStock: Math.random() > 0.1,
        rating: retailer.rating,
        reviewCount: retailer.reviewCount,
        url: `https://${retailer.id}.de/search?k=${encodeURIComponent(
          productName
        )}`,
        trustScore: retailer.trustScore,
      };
    })
    .sort(
      (a, b) =>
        parseFloat(a.price.replace(',', '.')) -
        parseFloat(b.price.replace(',', '.'))
    );
}
