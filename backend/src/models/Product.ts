/**
 * MongoDB Product Model - AutoCare Advisor
 *
 * This model represents the product catalog with comprehensive
 * metadata for the rule-based recommendation engine.
 *
 * NO AI/ML - Pure rule-based matching system
 */

import mongoose, { Document, Schema } from 'mongoose';

// Product Interface for TypeScript
export interface IProduct extends Document {
  // Basic Product Information
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];

  // Partner Information
  partnerId: string;
  partnerShopName: string;
  partnerShopUrl: string;
  tier: 'basic' | 'professional' | 'enterprise';

  // Matching Criteria (Core for Recommendation Engine)
  suitableFor: {
    vehicleTypes: string[]; // ["PKW", "SUV", "Limousine", "Transporter"]
    vehicleBrands: string[]; // ["BMW", "Mercedes", "Audi", "ALL"]
    paintTypes: string[]; // ["Metallic", "Uni", "Perleffekt", "Matt"]
    paintColors: string[]; // ["Schwarz", "Weiß", "Rot", "ALL"]
    vehicleAge: {
      min: number; // Minimum vehicle age in years
      max: number; // Maximum vehicle age in years
    };
  };

  // Problem Solving Capabilities
  solves: {
    problems: string[]; // ["Wasserflecken", "Kratzer", "Verwitterung"]
    applications: string[]; // ["Handwäsche", "Maschinenpolitur", "Sprühanwendung"]
    careAreas: string[]; // ["Außenlack", "Innenraum", "Felgen", "Reifen"]
  };

  // Usage Context
  usage: {
    experienceLevel: string[]; // ["Anfänger", "Fortgeschritten", "Profi"]
    frequency: string[]; // ["Täglich", "Wöchentlich", "Monatlich"]
    timeRequired: number; // Minutes required for application
    seasonality: string[]; // ["Frühling", "Sommer", "Herbst", "Winter", "ALL"]
  };

  // Product Specifications
  specifications: {
    volume?: string; // "500ml", "1L", "5L"
    concentration?: string; // "1:10", "1:50", "Ready-to-use"
    packaging?: string; // "Spray", "Bottle", "Canister"
    ingredients?: string[]; // ["Wax", "SiO2", "Keramik"]
    compatibleSurfaces?: string[]; // ["Lack", "Plastik", "Gummi", "Chrom"]
  };

  // Rating & Reviews
  rating: number; // 1-5 stars
  reviewCount: number;

  // Business Logic
  inStock: boolean;
  availabilityStatus:
    | 'in_stock'
    | 'low_stock'
    | 'out_of_stock'
    | 'discontinued';
  minimumOrderQuantity: number;
  bulkDiscounts?: {
    quantity: number;
    discountPercent: number;
  }[];

  // SEO & Marketing
  slug: string;
  tags: string[]; // For search and filtering
  metaTitle?: string;
  metaDescription?: string;

  // System Fields
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User UUID from PostgreSQL
  lastModifiedBy: string;

  // Analytics (computed fields)
  viewCount: number;
  clickCount: number;
  conversionRate: number;

  // Seasonal & Promotional
  isPromotional: boolean;
  promotionalPrice?: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
}

// MongoDB Schema Definition
const ProductSchema: Schema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    brand: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        'Lackreinigung',
        'Innenraumreinigung',
        'Felgenpflege',
        'Reifen & Felgen',
        'Schutzprodukte',
        'Polituren & Wachse',
        'Werkzeuge & Zubehör',
        'Spezialprodukte',
        'Detailing-Tools',
        'Pflegesets',
      ],
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    features: [
      {
        type: String,
        maxlength: 100,
      },
    ],

    // Partner Information
    partnerId: {
      type: String,
      required: true,
      index: true,
    },
    partnerShopName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    partnerShopUrl: {
      type: String,
      required: true,
      maxlength: 200,
    },
    tier: {
      type: String,
      enum: ['basic', 'professional', 'enterprise'],
      default: 'basic',
      index: true,
    },

    // Matching Criteria (CORE for recommendations)
    suitableFor: {
      vehicleTypes: {
        type: [String],
        enum: [
          'PKW',
          'SUV',
          'Limousine',
          'Transporter',
          'Motorrad',
          'Wohnmobil',
          'ALL',
        ],
        default: ['ALL'],
      },
      vehicleBrands: {
        type: [String],
        default: ['ALL'],
      },
      paintTypes: {
        type: [String],
        enum: ['Metallic', 'Uni', 'Perleffekt', 'Matt', 'Folierung', 'ALL'],
        default: ['ALL'],
      },
      paintColors: {
        type: [String],
        default: ['ALL'],
      },
      vehicleAge: {
        min: { type: Number, default: 0, min: 0 },
        max: { type: Number, default: 50, max: 50 },
      },
    },

    // Problem Solving
    solves: {
      problems: {
        type: [String],
        enum: [
          'Wasserflecken',
          'Kalkflecken',
          'Kratzer',
          'Hologramme',
          'Verwitterung',
          'Verschmutzung',
          'Oxidation',
          'Insektenreste',
          'Teerflecken',
          'Vogelkot',
          'Baumharz',
          'Rostflecken',
        ],
        default: [],
      },
      applications: {
        type: [String],
        enum: [
          'Handwäsche',
          '2-Eimer-Methode',
          'Sprühanwendung',
          'Maschinenpolitur',
          'Handpolitur',
          'Foam-Lance',
          'Drucksprüher',
          'Mikrofasertuch',
        ],
        default: [],
      },
      careAreas: {
        type: [String],
        enum: [
          'Außenlack',
          'Innenraum',
          'Felgen',
          'Reifen',
          'Glas',
          'Chrom',
          'Plastik',
        ],
        default: [],
      },
    },

    // Usage Context
    usage: {
      experienceLevel: {
        type: [String],
        enum: ['Anfänger', 'Fortgeschritten', 'Profi'],
        default: ['Anfänger', 'Fortgeschritten'],
      },
      frequency: {
        type: [String],
        enum: ['Täglich', 'Wöchentlich', 'Monatlich', 'Saisonal'],
        default: ['Wöchentlich'],
      },
      timeRequired: {
        type: Number,
        min: 1,
        max: 480, // 8 hours max
        default: 15,
      },
      seasonality: {
        type: [String],
        enum: ['Frühling', 'Sommer', 'Herbst', 'Winter', 'ALL'],
        default: ['ALL'],
      },
    },

    // Specifications
    specifications: {
      volume: String,
      concentration: String,
      packaging: String,
      ingredients: [String],
      compatibleSurfaces: [String],
    },

    // Rating System
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Inventory Management
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      default: 'in_stock',
      index: true,
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    bulkDiscounts: [
      {
        quantity: { type: Number, min: 1 },
        discountPercent: { type: Number, min: 0, max: 50 },
      },
    ],

    // SEO & Marketing
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    tags: [String],
    metaTitle: {
      type: String,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },

    // System Fields
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    lastModifiedBy: {
      type: String,
      index: true,
    },

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Promotional
    isPromotional: {
      type: Boolean,
      default: false,
      index: true,
    },
    promotionalPrice: {
      type: Number,
      min: 0,
    },
    promotionStartDate: Date,
    promotionEndDate: Date,
  },
  {
    timestamps: true,
    collection: 'products',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Indexes for Recommendation Engine Performance
// Note: Cannot index multiple parallel arrays together, so we create separate indexes
ProductSchema.index({
  'suitableFor.vehicleBrands': 1,
  inStock: 1,
  isActive: 1,
});

ProductSchema.index({
  'suitableFor.paintTypes': 1,
  inStock: 1,
  isActive: 1,
});

ProductSchema.index({
  'solves.problems': 1,
  tier: 1,
  isActive: 1,
});

ProductSchema.index({
  'solves.careAreas': 1,
  inStock: 1,
});

ProductSchema.index({
  category: 1,
  price: 1,
  rating: -1,
});

ProductSchema.index({
  partnerId: 1,
  isActive: 1,
  createdAt: -1,
});

// Text Search Index
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text',
});

// Pre-save Hook: Generate slug
ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Ensure slug uniqueness by appending ID if needed
    if (this.isNew && !this._id) {
      this._id = new mongoose.Types.ObjectId();
    }
  }
  next();
});

// Virtual: Computed discount percentage
ProductSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual: Average monthly views (analytics)
ProductSchema.virtual('averageMonthlyViews').get(function () {
  const monthsSinceCreation = Math.ceil(
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return monthsSinceCreation > 0
    ? Math.round(this.viewCount / monthsSinceCreation)
    : 0;
});

// Instance Methods
ProductSchema.methods.incrementView = function () {
  this.viewCount += 1;
  return this.save();
};

ProductSchema.methods.incrementClick = function () {
  this.clickCount += 1;
  this.conversionRate =
    this.viewCount > 0
      ? Math.round((this.clickCount / this.viewCount) * 100)
      : 0;
  return this.save();
};

ProductSchema.methods.isCompatibleWith = function (
  vehicleBrand: string,
  paintType: string
) {
  const isVehicleBrandMatch =
    this.suitableFor.vehicleBrands.includes(vehicleBrand) ||
    this.suitableFor.vehicleBrands.includes('ALL');
  const isPaintTypeMatch =
    this.suitableFor.paintTypes.includes(paintType) ||
    this.suitableFor.paintTypes.includes('ALL');
  return isVehicleBrandMatch && isPaintTypeMatch;
};

// Static Methods for Recommendation Engine
ProductSchema.statics.findForRecommendation = function (criteria: any) {
  const query = this.find({ isActive: true, inStock: true });

  if (criteria.vehicleBrand) {
    query.where({
      'suitableFor.vehicleBrands': { $in: [criteria.vehicleBrand, 'ALL'] },
    });
  }

  if (criteria.paintType) {
    query.where({
      'suitableFor.paintTypes': { $in: [criteria.paintType, 'ALL'] },
    });
  }

  if (criteria.problems && criteria.problems.length > 0) {
    query.where({
      'solves.problems': { $in: criteria.problems },
    });
  }

  if (criteria.maxPrice) {
    query.where({ price: { $lte: criteria.maxPrice } });
  }

  return query.lean();
};

ProductSchema.statics.findByCategory = function (
  category: string,
  limit: number = 20
) {
  return this.find({
    category,
    isActive: true,
    inStock: true,
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .lean();
};

ProductSchema.statics.searchProducts = function (
  searchTerm: string,
  filters: any = {}
) {
  const query = this.find(
    {
      $text: { $search: searchTerm },
      isActive: true,
      ...filters,
    },
    {
      score: { $meta: 'textScore' },
    }
  ).sort({ score: { $meta: 'textScore' } });

  return query;
};

export default mongoose.model<IProduct>('Product', ProductSchema);
