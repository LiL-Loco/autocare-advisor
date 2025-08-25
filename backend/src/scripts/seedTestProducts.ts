/**
 * Test Product Seeding - AutoCare Advisor
 *
 * Seeds the database with realistic test products for recommendation engine testing
 */

import mongoose from 'mongoose';
import Product from '../models/Product';
import logger from '../utils/logger';

// Create dummy IDs for testing (replace with actual admin and partner IDs)
const ADMIN_USER_ID = new mongoose.Types.ObjectId('64a123456789012345678901');
const PARTNER_ID = new mongoose.Types.ObjectId('64a123456789012345678902');

const testProducts = [
  {
    name: 'Premium Carnauba Wachs - Chemical Guys',
    description:
      'Hochwertiges Carnauba-Wachs für tiefglänzende Lackversiegelung. Bietet optimalen Schutz für 3-6 Monate und ist ideal für Fahrzeugliebhaber, die Wert auf perfekte Optik legen.',
    brand: 'Chemical Guys',
    category: 'Polituren & Wachse',
    subcategory: 'Carnauba Wachs',
    price: 89.99,
    originalPrice: 109.99,
    images: [
      'https://images.autocare.de/products/chemical-guys-carnauba-wax.jpg',
      'https://images.autocare.de/products/carnauba-wax-application.jpg',
    ],
    features: [
      '100% natürliches Carnauba',
      'UV-Schutz für 6 Monate',
      'Tiefglanz-Finish',
      'Wasserabweisend',
      'Einfache Anwendung',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Premium Shop',
    partnerShopUrl: 'https://shop.autocare.de/premium',
    tier: 'enterprise',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['ALL'],
      paintTypes: ['Metallic', 'Uni', 'Perleffekt'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 25 },
    },
    solves: {
      problems: ['Verwitterung', 'Wasserflecken'],
      applications: ['Handpolitur', 'Mikrofasertuch'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Fortgeschritten', 'Profi'],
      frequency: ['Monatlich', 'Saisonal'],
      timeRequired: 45,
      seasonality: ['Frühling', 'Sommer', 'Herbst'],
    },
    specifications: {
      volume: '473ml',
      concentration: 'Ready-to-use',
      packaging: 'Dose',
      ingredients: ['Carnauba Wax', 'Natürliche Öle'],
      compatibleSurfaces: ['Lack', 'Klarlack'],
    },
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'premium-carnauba-wachs-chemical-guys',
    tags: ['wachs', 'carnauba', 'premium', 'glanz', 'schutz'],
    metaTitle: 'Premium Carnauba Wachs - Perfekter Glanz & Schutz',
    metaDescription:
      'Hochwertiges Carnauba-Wachs für maximalen Glanz und langanhaltenden Schutz. Ideal für anspruchsvolle Autopflege.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 1247,
    clickCount: 89,
    conversionRate: 7.1,
    isPromotional: true,
    promotionalPrice: 79.99,
  },

  {
    name: 'Anfänger Auto-Shampoo - Sonax',
    description:
      'Mildes pH-neutrales Auto-Shampoo, perfekt für Einsteiger. Schonend zu allen Lackarten und einfach in der Anwendung.',
    brand: 'Sonax',
    category: 'Lackreinigung',
    subcategory: 'Auto-Shampoo',
    price: 12.99,
    originalPrice: 15.99,
    images: ['https://images.autocare.de/products/sonax-shampoo.jpg'],
    features: [
      'pH-neutral',
      'Schaumarm',
      'Lackschonend',
      'Einfache Anwendung',
      'Streifenfrei',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Basic Shop',
    partnerShopUrl: 'https://shop.autocare.de/basic',
    tier: 'basic',
    suitableFor: {
      vehicleTypes: ['ALL'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 50 },
    },
    solves: {
      problems: ['Verschmutzung', 'Wasserflecken'],
      applications: ['Handwäsche', '2-Eimer-Methode'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Anfänger'],
      frequency: ['Wöchentlich'],
      timeRequired: 20,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '1L',
      concentration: '1:100',
      packaging: 'Flasche',
      ingredients: ['Tenside', 'Pflegeadditive'],
      compatibleSurfaces: ['Lack', 'Plastik', 'Gummi'],
    },
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'anfaenger-auto-shampoo-sonax',
    tags: ['shampoo', 'anfänger', 'basic', 'reinigung'],
    metaTitle: 'Auto-Shampoo für Anfänger - Sonax Basic',
    metaDescription:
      'Mildes pH-neutrales Auto-Shampoo, perfekt für Einsteiger in die Fahrzeugpflege.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 567,
    clickCount: 45,
    conversionRate: 7.9,
    isPromotional: false,
  },

  {
    name: 'Profi Felgenreiniger - Gyeon',
    description:
      'Säurefreier Felgenreiniger für alle Felgentypen. Löst auch hartnäckigste Bremsstaub-Rückstände und ist pH-neutral.',
    brand: 'Gyeon',
    category: 'Felgenpflege',
    subcategory: 'Felgenreiniger',
    price: 24.99,
    originalPrice: 29.99,
    images: ['https://images.autocare.de/products/gyeon-wheel-cleaner.jpg'],
    features: [
      'Säurefrei',
      'pH-neutral',
      'Farbindikator',
      'Sicher für alle Felgen',
      'Starke Reinigungsleistung',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Professional',
    partnerShopUrl: 'https://shop.autocare.de/pro',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine', 'Transporter'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 50 },
    },
    solves: {
      problems: ['Verschmutzung', 'Rostflecken'],
      applications: ['Sprühanwendung', 'Drucksprüher'],
      careAreas: ['Felgen'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten', 'Profi'],
      frequency: ['Wöchentlich', 'Monatlich'],
      timeRequired: 15,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '500ml',
      concentration: 'Ready-to-use',
      packaging: 'Sprühflasche',
      ingredients: ['Alkalische Tenside', 'Farbindikatoren'],
      compatibleSurfaces: ['Aluminium', 'Stahl', 'Chrom'],
    },
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'profi-felgenreiniger-gyeon',
    tags: ['felgenreiniger', 'professional', 'säurefrei'],
    metaTitle: 'Profi Felgenreiniger - Gyeon Säurefrei',
    metaDescription:
      'Säurefreier Felgenreiniger für alle Felgentypen. Sicher und effektiv.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 892,
    clickCount: 67,
    conversionRate: 7.5,
    isPromotional: false,
  },

  {
    name: 'Winter-Schutzwachs - Koch Chemie',
    description:
      'Spezielles Winterwachs mit Anti-Frost Formel. Schützt vor Streusalz und bietet optimalen Lackschutz in der kalten Jahreszeit.',
    brand: 'Koch Chemie',
    category: 'Schutzprodukte',
    subcategory: 'Winterschutz',
    price: 34.99,
    images: ['https://images.autocare.de/products/koch-chemie-winter-wax.jpg'],
    features: [
      'Anti-Frost Formel',
      'Salzresistent',
      'Langanhaltend',
      'Einfache Anwendung',
      'Winteroptimiert',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Seasonal',
    partnerShopUrl: 'https://shop.autocare.de/seasonal',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 40 },
    },
    solves: {
      problems: ['Verschmutzung', 'Verwitterung'],
      applications: ['Handpolitur', 'Sprühanwendung'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten'],
      frequency: ['Saisonal'],
      timeRequired: 30,
      seasonality: ['Winter'],
    },
    specifications: {
      volume: '750ml',
      concentration: 'Ready-to-use',
      packaging: 'Flasche',
      ingredients: ['Synthetische Wachse', 'Korrosionsschutz'],
      compatibleSurfaces: ['Lack', 'Klarlack', 'Plastik'],
    },
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'winter-schutzwachs-koch-chemie',
    tags: ['winterschutz', 'wachs', 'seasonal', 'frost'],
    metaTitle: 'Winter-Schutzwachs - Koch Chemie Anti-Frost',
    metaDescription:
      'Spezielles Winterwachs mit Anti-Frost Formel für optimalen Lackschutz.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 445,
    clickCount: 34,
    conversionRate: 7.6,
    isPromotional: false,
  },

  {
    name: 'Kratzer-Entferner Professional - Meguiars',
    description:
      'Professioneller Kratzer-Entferner für leichte bis mittlere Kratzer. Enthält Mikro-Schleifpartikel für perfekte Ergebnisse.',
    brand: 'Meguiars',
    category: 'Spezialprodukte',
    subcategory: 'Kratzer-Behandlung',
    price: 19.99,
    images: [
      'https://images.autocare.de/products/meguiars-scratch-remover.jpg',
    ],
    features: [
      'Mikro-Schleifpartikel',
      'Für leichte Kratzer',
      'Einfache Anwendung',
      'Professionelle Ergebnisse',
      'Lackschonend',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Specialists',
    partnerShopUrl: 'https://shop.autocare.de/specialists',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['ALL'],
      paintTypes: ['Metallic', 'Uni'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 30 },
    },
    solves: {
      problems: ['Kratzer', 'Hologramme'],
      applications: ['Handpolitur', 'Maschinenpolitur'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Fortgeschritten', 'Profi'],
      frequency: ['Monatlich', 'Saisonal'],
      timeRequired: 60,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '207ml',
      concentration: 'Ready-to-use',
      packaging: 'Tube',
      ingredients: ['Mikro-Schleifpartikel', 'Politurwachse'],
      compatibleSurfaces: ['Lack', 'Klarlack'],
    },
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'kratzer-entferner-professional-meguiars',
    tags: ['kratzer', 'politur', 'professional', 'reparatur'],
    metaTitle: 'Kratzer-Entferner Professional - Meguiars',
    metaDescription:
      'Professioneller Kratzer-Entferner für leichte bis mittlere Kratzer.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 623,
    clickCount: 41,
    conversionRate: 6.6,
    isPromotional: false,
  },

  {
    name: 'Premium Innenraumreiniger - Nextzett',
    description:
      'Hochwertiger Innenraumreiniger für alle Oberflächen. Entfernt Flecken, reinigt schonend und hinterlässt angenehmen Duft.',
    brand: 'Nextzett',
    category: 'Innenraumreinigung',
    subcategory: 'Universalreiniger',
    price: 16.99,
    images: [
      'https://images.autocare.de/products/nextzett-interior-cleaner.jpg',
    ],
    features: [
      'Für alle Oberflächen',
      'Fleckenentfernung',
      'Angenehmer Duft',
      'Antistatisch',
      'Materialschonend',
    ],
    partnerId: PARTNER_ID,
    partnerShopName: 'AutoCare Interior',
    partnerShopUrl: 'https://shop.autocare.de/interior',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['ALL'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 50 },
    },
    solves: {
      problems: ['Verschmutzung'],
      applications: ['Sprühanwendung', 'Mikrofasertuch'],
      careAreas: ['Innenraum'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten'],
      frequency: ['Wöchentlich', 'Monatlich'],
      timeRequired: 25,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '500ml',
      concentration: 'Ready-to-use',
      packaging: 'Sprühflasche',
      ingredients: ['Tenside', 'Duftstoffe', 'Antistatika'],
      compatibleSurfaces: ['Plastik', 'Leder', 'Stoff', 'Kunstleder'],
    },
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
    availabilityStatus: 'in_stock',
    minimumOrderQuantity: 1,
    slug: 'premium-innenraumreiniger-nextzett',
    tags: ['innenraum', 'reiniger', 'universal', 'premium'],
    metaTitle: 'Premium Innenraumreiniger - Nextzett Universal',
    metaDescription:
      'Hochwertiger Innenraumreiniger für alle Oberflächen im Fahrzeug.',
    isActive: true,
    createdBy: ADMIN_USER_ID,
    lastModifiedBy: ADMIN_USER_ID,
    viewCount: 387,
    clickCount: 29,
    conversionRate: 7.5,
    isPromotional: false,
  },
];

export async function seedTestProducts(): Promise<void> {
  try {
    logger.info('🌱 Starting test product seeding...');

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      logger.info(
        `✅ Found ${existingProducts} existing products, skipping seed`
      );
      return;
    }

    // Insert test products
    const results = await Product.insertMany(testProducts);

    logger.info(`✅ Successfully seeded ${results.length} test products`);
    logger.info('📊 Test products include:');
    results.forEach((product, index) => {
      logger.info(
        `   ${index + 1}. ${product.name} (${product.brand}) - €${
          product.price
        }`
      );
    });
  } catch (error: any) {
    logger.error('❌ Error seeding test products:', error);
    throw error;
  }
}

export default seedTestProducts;
