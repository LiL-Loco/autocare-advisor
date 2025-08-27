/**
 * Product Database Seeder - AutoCare Advisor
 *
 * Seeds the MongoDB product catalog with realistic car care products
 * for testing and development of the recommendation engine.
 *
 * NO AI/ML - Pure rule-based product data for matching
 */

import { mongoConnection } from '../database/mongodb';
import Product from '../models/Product';
import logger from '../utils/logger';

// Sample product data optimized for recommendation engine
const SAMPLE_PRODUCTS = [
  // Lackreinigung Category
  {
    name: 'Chemical Guys Black Light Shampoo',
    description:
      'Premium Autoshampoo speziell entwickelt für schwarze und dunkle Fahrzeuge. Entfernt Schmutz schonend und verstärkt den Glanz dunkler Lackierungen.',
    brand: 'Chemical Guys',
    category: 'Lackreinigung',
    subcategory: 'Autoshampoo',
    price: 24.99,
    originalPrice: 29.99,
    images: [
      '/images/products/chemical-guys-black-light.jpg',
      '/images/products/chemical-guys-black-light-2.jpg',
    ],
    features: [
      'Speziell für schwarze Fahrzeuge',
      'pH-neutrales Formula',
      'Schonend zu allen Lacken',
      'Verstärkt Glanz',
      'Einfache Anwendung',
    ],
    partnerShopName: 'Autopflege Profi',
    partnerShopUrl: 'https://example.com/shop/chemical-guys',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['BMW', 'Mercedes', 'Audi', 'VW', 'ALL'],
      paintTypes: ['Metallic', 'Uni', 'Perleffekt'],
      paintColors: ['Schwarz', 'Dunkelblau', 'Anthrazit', 'ALL'],
      vehicleAge: { min: 0, max: 20 },
    },
    solves: {
      problems: ['Verschmutzung', 'Wasserflecken', 'Kalkflecken'],
      applications: ['Handwäsche', '2-Eimer-Methode'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten'],
      frequency: ['Wöchentlich', 'Monatlich'],
      timeRequired: 20,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '500ml',
      concentration: '1:200',
      packaging: 'Bottle',
      ingredients: ['Natürliche Tenside'],
      compatibleSurfaces: ['Lack', 'Plastik'],
    },
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    availabilityStatus: 'in_stock',
    tags: ['premium', 'schwarze-fahrzeuge', 'glanz'],
    isPromotional: true,
    promotionalPrice: 19.99,
    promotionStartDate: new Date('2025-08-01'),
    promotionEndDate: new Date('2025-09-30'),
  },

  // Felgenpflege Category
  {
    name: 'Sonax Xtreme Felgenreiniger',
    description:
      'Hochleistungsfelgenreiniger für alle Felgentypen. Entfernt hartnäckigen Bremsstaub und Verschmutzung säurefrei und schonend.',
    brand: 'Sonax',
    category: 'Felgenpflege',
    subcategory: 'Felgenreiniger',
    price: 12.95,
    images: ['/images/products/sonax-xtreme-felgen.jpg'],
    features: [
      'Säurefrei',
      'Für alle Felgentypen',
      'Entfernt Bremsstaub',
      'pH-neutral',
      'Einfacher Sprühauftrag',
    ],
    partnerShopName: 'Auto-Detailing König',
    partnerShopUrl: 'https://example.com/shop/sonax',
    tier: 'basic',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine', 'Transporter'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 30 },
    },
    solves: {
      problems: ['Bremsstaub', 'Verschmutzung', 'Oxidation'],
      applications: ['Sprühanwendung'],
      careAreas: ['Felgen'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten', 'Profi'],
      frequency: ['Wöchentlich', 'Monatlich'],
      timeRequired: 10,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '750ml',
      concentration: 'Ready-to-use',
      packaging: 'Spray',
      ingredients: ['Alkalische Reiniger'],
      compatibleSurfaces: ['Aluminium', 'Chrom', 'Stahl', 'Kunststoff'],
    },
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    availabilityStatus: 'in_stock',
    tags: ['säurefrei', 'bremsstaub', 'universal'],
  },

  // Innenraumreinigung Category
  {
    name: 'Gyeon Q²M Leather Cleaner',
    description:
      'Professioneller Lederreiniger für alle Lederarten. Reinigt schonend und pflegt gleichzeitig, ohne das Leder auszutrocknen.',
    brand: 'Gyeon',
    category: 'Innenraumreinigung',
    subcategory: 'Lederreiniger',
    price: 16.9,
    images: ['/images/products/gyeon-leather-cleaner.jpg'],
    features: [
      'Für alle Lederarten',
      'Reinigt und pflegt',
      'Trocknet nicht aus',
      'pH-optimiert',
      'Professionelle Formel',
    ],
    partnerShopName: 'Premium Car Care',
    partnerShopUrl: 'https://example.com/shop/gyeon',
    tier: 'professional',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['BMW', 'Mercedes', 'Audi', 'Porsche', 'ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 15 },
    },
    solves: {
      problems: ['Verschmutzung', 'Verwitterung'],
      applications: ['Handpolitur', 'Mikrofasertuch'],
      careAreas: ['Innenraum'],
    },
    usage: {
      experienceLevel: ['Fortgeschritten', 'Profi'],
      frequency: ['Monatlich', 'Saisonal'],
      timeRequired: 15,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '400ml',
      concentration: 'Ready-to-use',
      packaging: 'Bottle',
      ingredients: ['Ledergerechte Tenside', 'Pflegestoffe'],
      compatibleSurfaces: ['Echtleder', 'Kunstleder'],
    },
    rating: 4.8,
    reviewCount: 67,
    inStock: true,
    availabilityStatus: 'low_stock',
    tags: ['leder', 'premium', 'schonend'],
  },

  // Schutzprodukte Category
  {
    name: 'Koch Chemie 1K Nano Wachs',
    description:
      'Hochwertiges Nano-Versiegelungswachs mit Langzeitschutz. Bietet exzellenten Schutz gegen UV-Strahlung und Umwelteinflüsse.',
    brand: 'Koch Chemie',
    category: 'Schutzprodukte',
    subcategory: 'Wachs',
    price: 39.9,
    images: ['/images/products/koch-chemie-nano-wachs.jpg'],
    features: [
      'Nano-Technologie',
      'Langzeitschutz',
      'UV-Schutz',
      'Wasserabweisend',
      'Hochglanz-Finish',
    ],
    partnerShopName: 'Profi Detailing',
    partnerShopUrl: 'https://example.com/shop/koch-chemie',
    tier: 'enterprise',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine'],
      vehicleBrands: ['ALL'],
      paintTypes: ['Metallic', 'Uni', 'Perleffekt'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 10 },
    },
    solves: {
      problems: ['UV-Strahlung', 'Verwitterung', 'Wasserflecken'],
      applications: ['Handpolitur', 'Maschinenpolitur'],
      careAreas: ['Außenlack'],
    },
    usage: {
      experienceLevel: ['Fortgeschritten', 'Profi'],
      frequency: ['Saisonal'],
      timeRequired: 45,
      seasonality: ['Frühling', 'Herbst'],
    },
    specifications: {
      volume: '250ml',
      concentration: 'Ready-to-use',
      packaging: 'Bottle',
      ingredients: ['SiO2-Nanopartikel', 'Carnauba-Wachs'],
      compatibleSurfaces: ['Lack', 'Klarlack'],
    },
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    availabilityStatus: 'in_stock',
    tags: ['nano', 'langzeitschutz', 'premium'],
  },

  // Werkzeuge & Zubehör Category
  {
    name: 'Meguiars Supreme Shine Mikrofasertuch',
    description:
      'Hochwertiges Mikrofasertuch für streifenfreie Politur und schonende Lackpflege. Besonders weiche Fasern verhindern Kratzer.',
    brand: 'Meguiars',
    category: 'Werkzeuge & Zubehör',
    subcategory: 'Mikrofasertücher',
    price: 8.95,
    images: ['/images/products/meguiars-mikrofaser.jpg'],
    features: [
      'Streifenfrei',
      'Kratzfrei',
      'Hochsaugfähig',
      'Waschbar',
      'Langlebig',
    ],
    partnerShopName: 'Autopflege Zentrum',
    partnerShopUrl: 'https://example.com/shop/meguiars',
    tier: 'basic',
    suitableFor: {
      vehicleTypes: ['ALL'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 50 },
    },
    solves: {
      problems: ['Kratzer', 'Hologramme'],
      applications: ['Handpolitur', 'Mikrofasertuch'],
      careAreas: ['Außenlack', 'Innenraum', 'Glas'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten', 'Profi'],
      frequency: ['Täglich', 'Wöchentlich'],
      timeRequired: 1,
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '40x40cm',
      packaging: 'Einzeln verpackt',
      ingredients: ['Mikrofaser (80% Polyester, 20% Polyamid)'],
      compatibleSurfaces: ['Alle Oberflächen'],
    },
    rating: 4.6,
    reviewCount: 345,
    inStock: true,
    availabilityStatus: 'in_stock',
    tags: ['zubehör', 'mikrofaser', 'universal'],
  },

  // Spezialprodukte Category
  {
    name: 'P21S Insektenentferner',
    description:
      'Speziell entwickelter Insektenentferner für schonende und effektive Entfernung von Insektenrückständen ohne Lackschäden.',
    brand: 'P21S',
    category: 'Spezialprodukte',
    subcategory: 'Spezialreiniger',
    price: 14.5,
    images: ['/images/products/p21s-insekten.jpg'],
    features: [
      'Schonend zum Lack',
      'Schnelle Wirkung',
      'Einfache Anwendung',
      'Biologisch abbaubar',
      'Sprühflasche',
    ],
    partnerShopName: 'Classic Car Care',
    partnerShopUrl: 'https://example.com/shop/p21s',
    tier: 'basic',
    suitableFor: {
      vehicleTypes: ['PKW', 'SUV', 'Limousine', 'Motorrad'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
      vehicleAge: { min: 0, max: 30 },
    },
    solves: {
      problems: ['Insektenreste', 'Teerflecken', 'Verschmutzung'],
      applications: ['Sprühanwendung'],
      careAreas: ['Außenlack', 'Glas'],
    },
    usage: {
      experienceLevel: ['Anfänger', 'Fortgeschritten'],
      frequency: ['Wöchentlich', 'Monatlich'],
      timeRequired: 5,
      seasonality: ['Frühling', 'Sommer'],
    },
    specifications: {
      volume: '500ml',
      concentration: 'Ready-to-use',
      packaging: 'Spray',
      ingredients: ['Biologische Lösemittel'],
      compatibleSurfaces: ['Lack', 'Glas', 'Chrom', 'Plastik'],
    },
    rating: 4.4,
    reviewCount: 128,
    inStock: true,
    availabilityStatus: 'in_stock',
    tags: ['insekten', 'sommer', 'biologisch'],
  },
];

class ProductSeeder {
  private defaultPartnerId: string;
  private defaultCreatorId: string;

  constructor() {
    // Generate default PostgreSQL UUIDs for seeding
    this.defaultPartnerId = '64a12345-6789-4012-9345-678901234569';
    this.defaultCreatorId = '64a12345-6789-4012-9345-678901234570';
  }

  /**
   * Seed products into MongoDB
   */
  async seedProducts(): Promise<void> {
    try {
      logger.info('Starting product seeding...');

      // Check if products already exist
      const existingCount = await Product.countDocuments();
      if (existingCount > 0) {
        logger.info(`Found ${existingCount} existing products. Skipping seed.`);
        return;
      }

      // Prepare product data with required system fields
      const productsToInsert = SAMPLE_PRODUCTS.map((product) => ({
        ...product,
        partnerId: this.defaultPartnerId,
        createdBy: this.defaultCreatorId,
        lastModifiedBy: this.defaultCreatorId,
        slug: this.generateSlug(product.name),
        viewCount: Math.floor(Math.random() * 500) + 50,
        clickCount: Math.floor(Math.random() * 50) + 5,
        conversionRate: Math.floor(Math.random() * 15) + 5,
        minimumOrderQuantity: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Insert products
      const result = await Product.insertMany(productsToInsert, {
        ordered: false, // Continue on error
      });

      logger.info(`Successfully seeded ${result.length} products`);

      // Log category distribution
      await this.logCategoryStats();
    } catch (error: any) {
      logger.error('Product seeding failed:', error);
      throw error;
    }
  }

  /**
   * Clear all products (for development/testing)
   */
  async clearProducts(): Promise<void> {
    try {
      logger.info('Clearing all products...');

      const result = await Product.deleteMany({});
      logger.info(`Cleared ${result.deletedCount} products`);
    } catch (error: any) {
      logger.error('Failed to clear products:', error);
      throw error;
    }
  }

  /**
   * Reseed products (clear + seed)
   */
  async reseedProducts(): Promise<void> {
    try {
      await this.clearProducts();
      await this.seedProducts();
      logger.info('Product reseeding completed successfully');
    } catch (error: any) {
      logger.error('Product reseeding failed:', error);
      throw error;
    }
  }

  /**
   * Generate URL-friendly slug
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Log category statistics
   */
  private async logCategoryStats(): Promise<void> {
    try {
      const categoryStats = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      logger.info('Category distribution:', categoryStats);
    } catch (error: any) {
      logger.error('Failed to get category stats:', error);
    }
  }

  /**
   * Validate seeded data
   */
  async validateSeededData(): Promise<boolean> {
    try {
      const totalProducts = await Product.countDocuments({ isActive: true });
      const categoriesCount = (await Product.distinct('category')).length;
      const brandsCount = (await Product.distinct('brand')).length;

      logger.info('Seeded data validation:', {
        totalProducts,
        categoriesCount,
        brandsCount,
        expectedProducts: SAMPLE_PRODUCTS.length,
      });

      return totalProducts === SAMPLE_PRODUCTS.length;
    } catch (error: any) {
      logger.error('Data validation failed:', error);
      return false;
    }
  }
}

/**
 * Main seeding function
 */
export async function seedProductDatabase(): Promise<void> {
  let isConnected = false;

  try {
    // Connect to MongoDB
    await mongoConnection.connect();
    isConnected = true;

    const seeder = new ProductSeeder();

    // Seed products
    await seeder.seedProducts();

    // Validate seeded data
    const isValid = await seeder.validateSeededData();
    if (!isValid) {
      logger.warn('Seeded data validation failed');
    }

    logger.info('Product database seeding completed successfully');
  } catch (error: any) {
    logger.error('Product database seeding failed:', error);
    throw error;
  } finally {
    if (isConnected) {
      await mongoConnection.disconnect();
    }
  }
}

/**
 * CLI script execution
 */
if (require.main === module) {
  seedProductDatabase()
    .then(() => {
      console.log('✅ Product seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Product seeding failed:', error);
      process.exit(1);
    });
}

export default ProductSeeder;
