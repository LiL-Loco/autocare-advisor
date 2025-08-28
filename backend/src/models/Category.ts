/**
 * Category Model - AutoCare Advisor
 *
 * Hierarchical category system for product organization
 * with SEO optimization and metadata support.
 *
 * Features:
 * - Hierarchical structure (parent/child)
 * - SEO metadata
 * - Product count caching
 * - Multi-language support ready
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  parentCategory?: mongoose.Types.ObjectId;

  // SEO Optimization
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Visual & Branding
  icon?: string; // FontAwesome or custom icon name
  image?: string; // Category hero image
  color?: string; // Theme color for category

  // Product Organization
  productCount: number; // Cached count for performance
  subcategories: mongoose.Types.ObjectId[];

  // Display & Navigation
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean; // Show on homepage/featured sections

  // Multi-language Support (Future)
  translations?: {
    [locale: string]: {
      name: string;
      description: string;
      seoTitle: string;
      seoDescription: string;
    };
  };

  // System Fields
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },

    // SEO Metadata
    seoMeta: {
      title: {
        type: String,
        required: true,
        maxlength: 60,
      },
      description: {
        type: String,
        required: true,
        maxlength: 160,
      },
      keywords: [
        {
          type: String,
          maxlength: 50,
        },
      ],
    },

    // Visual Elements
    icon: {
      type: String,
      maxlength: 50,
    },
    image: {
      type: String,
      maxlength: 200,
    },
    color: {
      type: String,
      match: /^#[0-9a-fA-F]{6}$/,
      default: '#4f46e5',
    },

    // Product Management
    productCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    // Display Configuration
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Multi-language (Future Enhancement)
    translations: {
      type: Map,
      of: {
        name: String,
        description: String,
        seoTitle: String,
        seoDescription: String,
      },
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
  },
  {
    timestamps: true,
    collection: 'categories',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Indexes for Performance
CategorySchema.index({ isActive: 1, isVisible: 1, displayOrder: 1 });
CategorySchema.index({ parentCategory: 1, displayOrder: 1 });
CategorySchema.index({ isFeatured: 1, displayOrder: 1 });

// Pre-save Hook: Generate slug and update subcategories
CategorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Ensure slug uniqueness
    const existingCategory = await mongoose.models.Category?.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingCategory) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Update parent category subcategories array
  if (this.isNew && this.parentCategory) {
    await mongoose.models.Category?.findByIdAndUpdate(this.parentCategory, {
      $addToSet: { subcategories: this._id },
    });
  }

  next();
});

// Post-save Hook: Update product counts
CategorySchema.post('save', async function () {
  await this.updateProductCount();
});

// Virtuals
CategorySchema.virtual('level').get(function () {
  return this.parentCategory ? 1 : 0; // 0 = root, 1 = subcategory
});

CategorySchema.virtual('fullPath').get(function () {
  if (this.parentCategory) {
    return `${this.parentCategory.name} > ${this.name}`;
  }
  return this.name;
});

// Instance Methods
CategorySchema.methods.updateProductCount = async function () {
  const Product = mongoose.models.Product;
  if (Product) {
    const count = await Product.countDocuments({
      category: this.name,
      isActive: true,
    });
    this.productCount = count;
    await this.save();
  }
};

CategorySchema.methods.getSubcategoriesWithProducts = async function () {
  const populatedCategory = await this.populate('subcategories');
  return populatedCategory.subcategories.filter(
    (sub: any) => sub.productCount > 0
  );
};

CategorySchema.methods.getBreadcrumb = async function (): Promise<any[]> {
  const breadcrumb = [{ name: this.name, slug: this.slug }];

  if (this.parentCategory) {
    const parent = await mongoose.models.Category.findById(this.parentCategory);
    if (parent) {
      const parentBreadcrumb = await parent.getBreadcrumb();
      return [...parentBreadcrumb, ...breadcrumb];
    }
  }

  return breadcrumb;
};

// Static Methods
CategorySchema.statics.findMainCategories = function (limit: number = 10) {
  return this.find({
    parentCategory: { $exists: false },
    isActive: true,
    isVisible: true,
  })
    .sort({ displayOrder: 1, name: 1 })
    .limit(limit)
    .lean();
};

CategorySchema.statics.findFeaturedCategories = function (limit: number = 6) {
  return this.find({
    isFeatured: true,
    isActive: true,
    isVisible: true,
  })
    .sort({ displayOrder: 1 })
    .limit(limit)
    .lean();
};

CategorySchema.statics.findBySlug = function (slug: string) {
  return this.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
    isVisible: true,
  }).populate('subcategories');
};

CategorySchema.statics.getCategoryTree = async function () {
  const mainCategories = await this.find({
    parentCategory: { $exists: false },
    isActive: true,
    isVisible: true,
  })
    .sort({ displayOrder: 1 })
    .populate('subcategories')
    .lean();

  return mainCategories.map((category: any) => ({
    ...category,
    subcategories: category.subcategories.filter(
      (sub: any) => sub.isActive && sub.isVisible
    ),
  }));
};

CategorySchema.statics.updateAllProductCounts = async function () {
  const categories = await this.find({ isActive: true });
  const Product = mongoose.models.Product;

  if (!Product) return;

  for (const category of categories) {
    const count = await Product.countDocuments({
      category: category.name,
      isActive: true,
    });
    await this.findByIdAndUpdate(category._id, { productCount: count });
  }
};

// Seed Categories Function
export const seedCategories = async () => {
  const Category =
    mongoose.models.Category ||
    mongoose.model<ICategory>('Category', CategorySchema);

  const existingCount = await Category.countDocuments();
  if (existingCount > 0) {
    console.log('Categories already seeded');
    return;
  }

  const mainCategories = [
    {
      name: 'Polituren & Wachse',
      slug: 'polituren-wachse',
      description: 'Hochwertige Polituren und Wachse für perfekten Glanz',
      seoMeta: {
        title: 'Polituren & Wachse - Premium Fahrzeugpflege',
        description:
          'Hochwertige Polituren und Wachse für perfekten Glanz und langanhaltenden Schutz Ihres Fahrzeugs.',
        keywords: ['Politur', 'Wachs', 'Glanz', 'Fahrzeugpflege', 'Lackschutz'],
      },
      icon: 'fas fa-gem',
      color: '#f59e0b',
      displayOrder: 1,
      isFeatured: true,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
    {
      name: 'Lackreinigung',
      slug: 'lackreinigung',
      description:
        'Spezielle Reinigungsprodukte für die schonende Lackreinigung',
      seoMeta: {
        title: 'Lackreinigung - Schonende Fahrzeugwäsche',
        description:
          'Professionelle Lackreinigungsprodukte für schonende und gründliche Fahrzeugwäsche.',
        keywords: [
          'Lackreinigung',
          'Fahrzeugwäsche',
          'Autoshampoo',
          'Reinigung',
        ],
      },
      icon: 'fas fa-soap',
      color: '#3b82f6',
      displayOrder: 2,
      isFeatured: true,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
    {
      name: 'Felgenpflege',
      slug: 'felgenpflege',
      description: 'Spezialisierte Produkte für die optimale Felgenpflege',
      seoMeta: {
        title: 'Felgenpflege - Professionelle Felgenreinigung',
        description:
          'Hochwertige Felgenreiniger und Pflegeprodukte für alle Felgentypen.',
        keywords: [
          'Felgenreiniger',
          'Felgenpflege',
          'Radpflege',
          'Felgenschutz',
        ],
      },
      icon: 'fas fa-circle-notch',
      color: '#6366f1',
      displayOrder: 3,
      isFeatured: true,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
    {
      name: 'Innenraumpflege',
      slug: 'innenraumpflege',
      description: 'Komplette Lösungen für die professionelle Innenraumpflege',
      seoMeta: {
        title: 'Innenraumpflege - Sauberer Fahrzeuginnenraum',
        description:
          'Professionelle Produkte für Polster-, Leder- und Armaturenreinigung.',
        keywords: [
          'Innenraumpflege',
          'Polsterreiniger',
          'Lederpflege',
          'Cockpitpflege',
        ],
      },
      icon: 'fas fa-couch',
      color: '#10b981',
      displayOrder: 4,
      isFeatured: true,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
    {
      name: 'Reinigungs-Zubehör',
      slug: 'reinigungs-zubehoer',
      description: 'Hochwertiges Zubehör für die professionelle Fahrzeugpflege',
      seoMeta: {
        title: 'Reinigungs-Zubehör - Professionelle Autopflege',
        description:
          'Mikrofasertücher, Schwämme und Bürsten für die perfekte Fahrzeugpflege.',
        keywords: [
          'Mikrofasertuch',
          'Reinigungszubehör',
          'Autopflegetools',
          'Schwämme',
        ],
      },
      icon: 'fas fa-tools',
      color: '#8b5cf6',
      displayOrder: 5,
      isFeatured: false,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
    {
      name: 'Motorreinigung',
      slug: 'motorreinigung',
      description: 'Sichere und effektive Motorreinigungsprodukte',
      seoMeta: {
        title: 'Motorreinigung - Sicherer Motorraum',
        description:
          'Spezielle Reinigungsprodukte für die sichere Motorraumreinigung.',
        keywords: [
          'Motorreiniger',
          'Motorraumpflege',
          'Entfettung',
          'Motorraumreinigung',
        ],
      },
      icon: 'fas fa-cog',
      color: '#ef4444',
      displayOrder: 6,
      isFeatured: false,
      isVisible: true,
      isActive: true,
      createdBy: 'system',
    },
  ];

  await Category.insertMany(mainCategories);
  console.log('Main categories seeded successfully');
};

export default mongoose.model<ICategory>('Category', CategorySchema);
