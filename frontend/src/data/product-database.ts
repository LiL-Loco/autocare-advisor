// Product Database für AutoCare Advisor
// Enthält vordefinierte Produkte für verschiedene Autopflege-Probleme

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'lack' | 'innenraum' | 'felgen' | 'glas';
  problemType: string;
  description: string;
  price: number;
  imageUrl?: string;
  amazonUrl: string;
  atuUrl?: string;
  autodocUrl?: string;
  effectiveness: number; // 1-10 Score
  difficulty: 'anfänger' | 'fortgeschritten' | 'profi';
  applicationTime: string;
  ingredients?: string[];
  instructions: string[];
  warnings?: string[];
  tags: string[];
}

export const productDatabase: Product[] = [
  // LACKPFLEGE PRODUKTE
  {
    id: 'meguiars-ultimate-polish',
    name: "Meguiar's Ultimate Polish",
    brand: "Meguiar's",
    category: 'lack',
    problemType: 'schleier-hologramme',
    description:
      'Hochwertige Politur zur Entfernung von Hologrammen und Schleiern auf dunklem Lack',
    price: 18.99,
    amazonUrl: 'https://amazon.de/dp/B004HCOE72',
    atuUrl: 'https://atu.de/meguiars-ultimate-polish',
    effectiveness: 9,
    difficulty: 'anfänger',
    applicationTime: '30-45 Minuten',
    ingredients: ['Diminishing Abrasives', 'Premium Wax', 'UV Protection'],
    instructions: [
      'Fahrzeug gründlich waschen und trocknen',
      'Produkt auf Mikrofasertuch auftragen',
      'In kreisenden Bewegungen dünn auftragen',
      'Mit sauberem Tuch nachpolieren',
      'Bei direkter Sonneneinstrahlung vermeiden',
    ],
    warnings: [
      'Nicht auf heißen Oberflächen anwenden',
      'Von Kindern fernhalten',
    ],
    tags: ['hologramme', 'schleier', 'schwarzer-lack', 'anfänger-freundlich'],
  },
  {
    id: 'chemical-guys-vss',
    name: 'Chemical Guys V.S.S. (Very Superior Shine)',
    brand: 'Chemical Guys',
    category: 'lack',
    problemType: 'glanz-verloren',
    description: 'Premium Spray-Wax für sofortigen Glanz und Schutz',
    price: 24.99,
    amazonUrl: 'https://amazon.de/dp/B00B28NQ2K',
    effectiveness: 8,
    difficulty: 'anfänger',
    applicationTime: '15-20 Minuten',
    instructions: [
      'Auf sauberen, trockenen Lack sprühen',
      'Mit Mikrofasertuch gleichmäßig verteilen',
      'Kurz antrocknen lassen',
      'Mit sauberem Tuch nachpolieren',
    ],
    tags: ['glanz', 'schnell', 'spray-wax', 'uv-schutz'],
  },
  {
    id: 'sonax-polish-wax-color',
    name: 'SONAX Polish & Wax Color Schwarz',
    brand: 'SONAX',
    category: 'lack',
    problemType: 'kratzer-swirls',
    description:
      'Spezielle Politur für schwarze Fahrzeuge zur Kratzerentfernung',
    price: 12.99,
    amazonUrl: 'https://amazon.de/dp/B000VBHQ2C',
    atuUrl: 'https://atu.de/sonax-polish-wax-schwarz',
    effectiveness: 8,
    difficulty: 'fortgeschritten',
    applicationTime: '45-60 Minuten',
    instructions: [
      'Fahrzeug im Schatten bearbeiten',
      'Kleine Mengen auf Auftragstuch geben',
      'Kreisförmig einarbeiten',
      'Antrocknen lassen bis weißlicher Schleier entsteht',
      'Mit weichem Tuch auspolieren',
    ],
    warnings: ['Nicht in der Sonne anwenden'],
    tags: ['kratzer', 'swirls', 'schwarzer-lack', 'politur'],
  },
  {
    id: 'turtle-wax-ice-spray',
    name: 'Turtle Wax ICE Spray Wax',
    brand: 'Turtle Wax',
    category: 'lack',
    problemType: 'wasserflecken',
    description: 'Schnelle Lösung für Wasserflecken und Oberflächenschutz',
    price: 8.99,
    amazonUrl: 'https://amazon.de/dp/B002L5SSMU',
    effectiveness: 7,
    difficulty: 'anfänger',
    applicationTime: '10-15 Minuten',
    instructions: [
      'Auf feuchte oder trockene Oberfläche sprühen',
      'Mit Mikrofasertuch verteilen',
      'Sofort trocken wischen',
    ],
    tags: ['wasserflecken', 'schnell', 'spray', 'glanz'],
  },

  // INNENRAUM PRODUKTE
  {
    id: 'chemical-guys-leather-cleaner',
    name: 'Chemical Guys Leather Cleaner',
    brand: 'Chemical Guys',
    category: 'innenraum',
    problemType: 'leder-verschmutzt',
    description: 'Schonende Lederreinigung für alle Lederarten',
    price: 19.99,
    amazonUrl: 'https://amazon.de/dp/B00B28QZDE',
    effectiveness: 9,
    difficulty: 'anfänger',
    applicationTime: '20-30 Minuten',
    instructions: [
      'Leder vorher absaugen',
      'Produkt auf Mikrofasertuch sprühen',
      'Leder sanft abreiben',
      'Mit feuchtem Tuch nachwischen',
      'Vollständig trocknen lassen',
    ],
    tags: ['leder', 'reinigung', 'innenraum', 'schonend'],
  },
  {
    id: 'armor-all-protectant',
    name: 'Armor All Original Protectant',
    brand: 'Armor All',
    category: 'innenraum',
    problemType: 'kunststoff-matt',
    description: 'Schutz und Glanz für Kunststoff-Oberflächen',
    price: 7.49,
    amazonUrl: 'https://amazon.de/dp/B000CPHQ8C',
    atuUrl: 'https://atu.de/armor-all-protectant',
    effectiveness: 7,
    difficulty: 'anfänger',
    applicationTime: '15-20 Minuten',
    instructions: [
      'Oberfläche von Staub befreien',
      'Produkt auf Tuch sprühen',
      'Gleichmäßig auftragen',
      'Mit trockenem Tuch nachpolieren',
    ],
    warnings: ['Nicht auf Lenkrad oder Pedale verwenden'],
    tags: ['kunststoff', 'armaturenbrett', 'uv-schutz', 'glanz'],
  },

  // FELGEN PRODUKTE
  {
    id: 'sonax-xtreme-felgenreiniger',
    name: 'SONAX XTREME Felgenreiniger',
    brand: 'SONAX',
    category: 'felgen',
    problemType: 'bremsstaub',
    description: 'Säurefreier Felgenreiniger für alle Felgentypen',
    price: 14.99,
    amazonUrl: 'https://amazon.de/dp/B00AXLOM2Y',
    atuUrl: 'https://atu.de/sonax-xtreme-felgenreiniger',
    autodocUrl: 'https://autodoc.de/sonax-felgenreiniger',
    effectiveness: 9,
    difficulty: 'anfänger',
    applicationTime: '15-25 Minuten',
    instructions: [
      'Felgen mit Wasser vorspülen',
      'Produkt gleichmäßig aufsprühen',
      '3-5 Minuten einwirken lassen',
      'Mit Felgenbürste bearbeiten',
      'Gründlich mit Wasser abspülen',
    ],
    warnings: ['Nicht auf heiße Felgen sprühen', 'Handschuhe empfohlen'],
    tags: ['bremsstaub', 'felgenreiniger', 'säurefrei', 'alle-felgen'],
  },
  {
    id: 'chemical-guys-diablo-gel',
    name: 'Chemical Guys Diablo Wheel Gel',
    brand: 'Chemical Guys',
    category: 'felgen',
    problemType: 'hartnäckiger-schmutz',
    description: 'Hochkonzentrierter Gelreiniger für stark verschmutzte Felgen',
    price: 22.99,
    amazonUrl: 'https://amazon.de/dp/B01M8NY0VM',
    effectiveness: 10,
    difficulty: 'fortgeschritten',
    applicationTime: '20-30 Minuten',
    instructions: [
      'Felgen gut anfeuchten',
      'Gel dick auftragen',
      '5-10 Minuten einwirken lassen',
      'Mit verschiedenen Bürsten bearbeiten',
      'Gründlich abspülen',
    ],
    warnings: ['Schutzausrüstung tragen', 'Nicht eintrocknen lassen'],
    tags: ['gel-reiniger', 'stark-verschmutzt', 'konzentriert', 'profi'],
  },

  // GLAS PRODUKTE
  {
    id: 'invisible-glass-premium',
    name: 'Invisible Glass Premium Glass Cleaner',
    brand: 'Stoner',
    category: 'glas',
    problemType: 'wasserflecken-glas',
    description: 'Streifenfreier Glasreiniger für perfekte Sicht',
    price: 11.99,
    amazonUrl: 'https://amazon.de/dp/B000BQZN8W',
    effectiveness: 9,
    difficulty: 'anfänger',
    applicationTime: '10-15 Minuten',
    instructions: [
      'Glas von grobem Schmutz befreien',
      'Produkt auf Glasreinigungstuch sprühen',
      'In geraden Bewegungen reinigen',
      'Mit sauberem Tuch trocken wischen',
    ],
    tags: ['glasreiniger', 'streifenfrei', 'wasserflecken', 'sicht'],
  },
  {
    id: 'rain-x-original',
    name: 'Rain-X Original Glass Treatment',
    brand: 'Rain-X',
    category: 'glas',
    problemType: 'schlechte-sicht-regen',
    description: 'Glasversiegelung für bessere Sicht bei Regen',
    price: 9.99,
    amazonUrl: 'https://amazon.de/dp/B000BQZN8W',
    atuUrl: 'https://atu.de/rain-x-original',
    effectiveness: 8,
    difficulty: 'anfänger',
    applicationTime: '20-30 Minuten',
    instructions: [
      'Glas gründlich reinigen',
      'Produkt mit Tuch auftragen',
      'Gleichmäßig einreiben',
      '10 Minuten trocknen lassen',
      'Mit feuchtem Tuch entfernen',
    ],
    tags: ['versiegelung', 'regen', 'wasser-abweisend', 'sicht'],
  },
];

// Hilfsfunktionen für Produktsuche
export const getProductsByCategory = (
  category: Product['category']
): Product[] => {
  return productDatabase.filter((product) => product.category === category);
};

export const getProductsByProblem = (problemType: string): Product[] => {
  return productDatabase.filter(
    (product) =>
      product.problemType === problemType || product.tags.includes(problemType)
  );
};

export const getProductsByDifficulty = (
  difficulty: Product['difficulty']
): Product[] => {
  return productDatabase.filter((product) => product.difficulty === difficulty);
};

export const searchProducts = (query: string): Product[] => {
  const searchLower = query.toLowerCase();
  return productDatabase.filter(
    (product) =>
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.tags.some((tag) => tag.includes(searchLower))
  );
};

// Produkt-Empfehlungs-Engine
export const getRecommendedProducts = (
  problemType: string,
  experience: 'anfänger' | 'fortgeschritten' | 'profi',
  budget: 'niedrig' | 'mittel' | 'hoch',
  timeAvailable: 'wenig' | 'mittel' | 'viel'
): Product[] => {
  let products = getProductsByProblem(problemType);

  // Filter nach Erfahrung
  if (experience === 'anfänger') {
    products = products.filter(
      (p) => p.difficulty === 'anfänger' || p.difficulty === 'fortgeschritten'
    );
  } else if (experience === 'fortgeschritten') {
    products = products.filter(
      (p) => p.difficulty !== 'profi' || p.effectiveness >= 8
    );
  }

  // Filter nach Budget
  if (budget === 'niedrig') {
    products = products.filter((p) => p.price <= 15);
  } else if (budget === 'mittel') {
    products = products.filter((p) => p.price <= 25);
  }

  // Filter nach Zeit
  if (timeAvailable === 'wenig') {
    products = products.filter(
      (p) =>
        p.applicationTime.includes('10-15') ||
        p.applicationTime.includes('15-20')
    );
  }

  // Sortiere nach Effektivität
  return products.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 3);
};
