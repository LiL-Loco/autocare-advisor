// Utility functions for automotive-themed UI components

export const carBrands = [
  { name: 'BMW', color: '#1f4788', emoji: '🔵' },
  { name: 'Audi', color: '#bb0a30', emoji: '🔴' },
  { name: 'Mercedes', color: '#00d2be', emoji: '⭐' },
  { name: 'VW', color: '#041e5c', emoji: '🔷' },
  { name: 'Porsche', color: '#d5a921', emoji: '🟡' },
  { name: 'Opel', color: '#ffcd00', emoji: '⚡' },
  { name: 'Ford', color: '#003478', emoji: '🔷' },
  { name: 'Toyota', color: '#eb0a1e', emoji: '🔴' },
];

export const problemCategories = [
  {
    id: 'lackpflege',
    name: 'Lackpflege',
    emoji: '✨',
    color: 'blue',
    problems: [
      'schleier-hologramme',
      'kratzer-swirls',
      'glanz-verloren',
      'wasserflecken',
    ],
  },
  {
    id: 'innenraum',
    name: 'Innenraum',
    emoji: '🪑',
    color: 'green',
    problems: [
      'leder-verschmutzt',
      'kunststoff-matt',
      'geruch',
      'flecken-stoff',
    ],
  },
  {
    id: 'felgen',
    name: 'Felgen & Reifen',
    emoji: '⚙️',
    color: 'purple',
    problems: [
      'bremsstaub',
      'hartnäckiger-schmutz',
      'felgen-stumpf',
      'reifen-glanz',
    ],
  },
  {
    id: 'glas',
    name: 'Glas & Scheiben',
    emoji: '🪟',
    color: 'cyan',
    problems: [
      'wasserflecken-glas',
      'schlechte-sicht-regen',
      'insekten',
      'kratzer-scheibe',
    ],
  },
];

export const difficultyLevels = [
  {
    level: 'anfänger',
    name: 'Anfänger',
    emoji: '🟢',
    description: 'Einfach anzuwenden, auch ohne Erfahrung',
  },
  {
    level: 'fortgeschritten',
    name: 'Fortgeschritten',
    emoji: '🟡',
    description: 'Etwas Erfahrung erforderlich',
  },
  {
    level: 'profi',
    name: 'Profi',
    emoji: '🔴',
    description: 'Für erfahrene Anwender',
  },
];

export const timeCategories = [
  { id: 'wenig', name: 'Wenig Zeit', emoji: '⚡', duration: '10-20 Min' },
  { id: 'mittel', name: 'Normal', emoji: '🕐', duration: '30-45 Min' },
  { id: 'viel', name: 'Gründlich', emoji: '⏰', duration: '60+ Min' },
];

export const budgetCategories = [
  { id: 'niedrig', name: 'Budget', emoji: '💰', range: 'bis 15€' },
  { id: 'mittel', name: 'Standard', emoji: '💳', range: '15-30€' },
  { id: 'hoch', name: 'Premium', emoji: '💎', range: '30€+' },
];

// Animation utilities
export const getStaggerDelay = (index: number): string => {
  return `${index * 0.1}s`;
};

export const getRandomCarEmoji = (): string => {
  const carEmojis = ['🚗', '🚙', '🚕', '🚐', '🏎️', '🚓', '🚔', '🚘'];
  return carEmojis[Math.floor(Math.random() * carEmojis.length)];
};

// Color utilities for different car paint types
export const paintTypes = [
  { id: 'schwarz', name: 'Schwarz', hex: '#1a1a1a', emoji: '⚫' },
  { id: 'weiss', name: 'Weiß', hex: '#f8f9fa', emoji: '⚪' },
  { id: 'grau', name: 'Grau', hex: '#6c757d', emoji: '🔘' },
  { id: 'rot', name: 'Rot', hex: '#dc3545', emoji: '🔴' },
  { id: 'blau', name: 'Blau', hex: '#0d6efd', emoji: '🔵' },
  { id: 'silber', name: 'Silber', hex: '#adb5bd', emoji: '⚪' },
  { id: 'metallic', name: 'Metallic', hex: '#e9ecef', emoji: '✨' },
];

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

// Get color class based on problem severity
export const getSeverityColor = (
  severity: 'low' | 'medium' | 'high'
): string => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Generate automotive-themed gradient classes
export const getGradientClass = (
  type: 'primary' | 'secondary' | 'accent'
): string => {
  switch (type) {
    case 'primary':
      return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800';
    case 'secondary':
      return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
    case 'accent':
      return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500';
    default:
      return 'bg-gradient-to-br from-blue-600 to-blue-800';
  }
};
