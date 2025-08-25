/**
 * Product Service - AutoCare Advisor
 *
 * Comprehensive service layer for product management
 * with MongoDB integration and recommendation engine support.
 *
 * Features:
 * - CRUD Operations
 * - Search & Filtering
 * - Bulk Operations
 * - Analytics Tracking
 * - Image Management
 * - Category Management
 */

import mongoose from 'mongoose';
import Product, { IProduct } from '../models/Product';
import logger from '../utils/logger';

export interface ProductCreateData {
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  partnerId: string;
  partnerShopName: string;
  partnerShopUrl: string;
  tier?: 'basic' | 'professional' | 'enterprise';
  suitableFor?: any;
  solves?: any;
  usage?: any;
  specifications?: any;
  tags?: string[];
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  lastModifiedBy: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  partnerId?: string;
  priceRange?: { min: number; max: number };
  inStock?: boolean;
  isActive?: boolean;
  tier?: string;
  availabilityStatus?: string;
  vehicleBrand?: string;
  paintType?: string;
  problems?: string[];
  experienceLevel?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkImportResult {
  successful: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
  createdProducts: string[];
}

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(
    productData: ProductCreateData,
    createdBy: string
  ): Promise<IProduct> {
    try {
      // Validate partner exists
      if (!mongoose.Types.ObjectId.isValid(productData.partnerId)) {
        throw new Error('Invalid partner ID');
      }

      // Generate default values
      const newProduct = new Product({
        ...productData,
        partnerId: new mongoose.Types.ObjectId(productData.partnerId),
        createdBy: new mongoose.Types.ObjectId(createdBy),
        lastModifiedBy: new mongoose.Types.ObjectId(createdBy),

        // Default matching criteria if not provided
        suitableFor: {
          vehicleTypes: ['ALL'],
          vehicleBrands: ['ALL'],
          paintTypes: ['ALL'],
          paintColors: ['ALL'],
          vehicleAge: { min: 0, max: 50 },
          ...productData.suitableFor,
        },

        // Default problem solving if not provided
        solves: {
          problems: [],
          applications: [],
          careAreas: [],
          ...productData.solves,
        },

        // Default usage context
        usage: {
          experienceLevel: ['Anfänger', 'Fortgeschritten'],
          frequency: ['Wöchentlich'],
          timeRequired: 15,
          seasonality: ['ALL'],
          ...productData.usage,
        },
      });

      const savedProduct = await newProduct.save();

      logger.info('Product created successfully', {
        productId: savedProduct._id,
        name: savedProduct.name,
        partnerId: savedProduct.partnerId,
        createdBy,
      });

      return savedProduct;
    } catch (error: any) {
      logger.error('Failed to create product', {
        error: error.message,
        productData,
      });
      throw new Error(`Product creation failed: ${error.message}`);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(
    productId: string,
    incrementView: boolean = false
  ): Promise<IProduct | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const product = await Product.findById(productId)
        .populate('partnerId', 'company_name email first_name last_name')
        .populate('createdBy', 'first_name last_name email');

      if (product && incrementView) {
        product.viewCount += 1;
        await product.save();
      }

      return product;
    } catch (error: any) {
      logger.error('Failed to get product by ID', {
        error: error.message,
        productId,
      });
      throw new Error(`Failed to retrieve product: ${error.message}`);
    }
  }

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    updateData: ProductUpdateData
  ): Promise<IProduct | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          ...updateData,
          lastModifiedBy: new mongoose.Types.ObjectId(
            updateData.lastModifiedBy
          ),
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate('partnerId', 'company_name email');

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      logger.info('Product updated successfully', {
        productId: updatedProduct._id,
        name: updatedProduct.name,
        lastModifiedBy: updateData.lastModifiedBy,
      });

      return updatedProduct;
    } catch (error: any) {
      logger.error('Failed to update product', {
        error: error.message,
        productId,
        updateData,
      });
      throw new Error(`Product update failed: ${error.message}`);
    }
  }

  /**
   * Delete product (soft delete by setting isActive = false)
   */
  async deleteProduct(productId: string, deletedBy: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const result = await Product.findByIdAndUpdate(productId, {
        isActive: false,
        lastModifiedBy: new mongoose.Types.ObjectId(deletedBy),
        updatedAt: new Date(),
      });

      if (!result) {
        throw new Error('Product not found');
      }

      logger.info('Product deleted successfully', {
        productId,
        name: result.name,
        deletedBy,
      });

      return true;
    } catch (error: any) {
      logger.error('Failed to delete product', {
        error: error.message,
        productId,
        deletedBy,
      });
      throw new Error(`Product deletion failed: ${error.message}`);
    }
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ products: IProduct[]; totalCount: number; totalPages: number }> {
    try {
      // Build query
      const query = this.buildQuery(filters);

      // Pagination
      const page = pagination.page || 1;
      const limit = Math.min(pagination.limit || 20, 100); // Max 100 per page
      const skip = (page - 1) * limit;

      // Sorting
      const sortField = pagination.sortBy || 'createdAt';
      const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1;
      const sortObject: any = {};
      sortObject[sortField] = sortOrder;

      // Execute queries in parallel
      const [products, totalCount] = await Promise.all([
        Product.find(query)
          .populate('partnerId', 'company_name email first_name last_name')
          .sort(sortObject)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logger.info('Products retrieved successfully', {
        totalCount,
        page,
        limit,
        filters: Object.keys(filters),
      });

      return {
        products: products as IProduct[],
        totalCount,
        totalPages,
      };
    } catch (error: any) {
      logger.error('Failed to get products', {
        error: error.message,
        filters,
        pagination,
      });
      throw new Error(`Failed to retrieve products: ${error.message}`);
    }
  }

  /**
   * Search products with text search and filters
   */
  async searchProducts(
    searchTerm: string,
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ products: IProduct[]; totalCount: number; totalPages: number }> {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return this.getProducts(filters, pagination);
      }

      const query = {
        $text: { $search: searchTerm },
        ...this.buildQuery(filters),
      };

      const page = pagination.page || 1;
      const limit = Math.min(pagination.limit || 20, 100);
      const skip = (page - 1) * limit;

      const [products, totalCount] = await Promise.all([
        Product.find(query, { score: { $meta: 'textScore' } })
          .populate('partnerId', 'company_name email first_name last_name')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logger.info('Product search completed', {
        searchTerm,
        totalCount,
        page,
        limit,
      });

      return {
        products: products as IProduct[],
        totalCount,
        totalPages,
      };
    } catch (error: any) {
      logger.error('Product search failed', {
        error: error.message,
        searchTerm,
        filters,
      });
      throw new Error(`Product search failed: ${error.message}`);
    }
  }

  /**
   * Get products for recommendation engine
   */
  async getProductsForRecommendation(criteria: {
    vehicleBrand?: string;
    paintType?: string;
    problems?: string[];
    careAreas?: string[];
    maxPrice?: number;
    experienceLevel?: string;
    excludeProductIds?: string[];
  }): Promise<IProduct[]> {
    try {
      const query: any = {
        isActive: true,
        inStock: true,
      };

      // Vehicle compatibility
      if (criteria.vehicleBrand) {
        query['suitableFor.vehicleBrands'] = {
          $in: [criteria.vehicleBrand, 'ALL'],
        };
      }

      if (criteria.paintType) {
        query['suitableFor.paintTypes'] = { $in: [criteria.paintType, 'ALL'] };
      }

      // Problem solving
      if (criteria.problems && criteria.problems.length > 0) {
        query['solves.problems'] = { $in: criteria.problems };
      }

      // Care areas
      if (criteria.careAreas && criteria.careAreas.length > 0) {
        query['solves.careAreas'] = { $in: criteria.careAreas };
      }

      // Price filtering
      if (criteria.maxPrice) {
        query.price = { $lte: criteria.maxPrice };
      }

      // Experience level
      if (criteria.experienceLevel) {
        query['usage.experienceLevel'] = { $in: [criteria.experienceLevel] };
      }

      // Exclude specific products
      if (criteria.excludeProductIds && criteria.excludeProductIds.length > 0) {
        query._id = {
          $nin: criteria.excludeProductIds.map(
            (id) => new mongoose.Types.ObjectId(id)
          ),
        };
      }

      const products = await Product.find(query)
        .sort({ rating: -1, reviewCount: -1 })
        .limit(50) // Reasonable limit for recommendation engine
        .lean();

      logger.info('Products retrieved for recommendation', {
        count: products.length,
        criteria: Object.keys(criteria),
      });

      return products as IProduct[];
    } catch (error: any) {
      logger.error('Failed to get products for recommendation', {
        error: error.message,
        criteria,
      });
      throw new Error(
        `Failed to retrieve products for recommendation: ${error.message}`
      );
    }
  }

  /**
   * Increment product click count
   */
  async incrementProductClick(productId: string): Promise<void> {
    try {
      const product = await Product.findById(productId);
      if (product) {
        product.clickCount += 1;
        product.conversionRate =
          product.viewCount > 0
            ? Math.round((product.clickCount / product.viewCount) * 100)
            : 0;
        await product.save();
      }
    } catch (error: any) {
      logger.error('Failed to increment product click', {
        error: error.message,
        productId,
      });
      // Don't throw error as this is non-critical
    }
  }

  /**
   * Get product categories with counts
   */
  async getCategories(): Promise<Array<{ category: string; count: number }>> {
    try {
      const categories = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
      ]);

      return categories;
    } catch (error: any) {
      logger.error('Failed to get categories', { error: error.message });
      throw new Error(`Failed to retrieve categories: ${error.message}`);
    }
  }

  /**
   * Get product brands with counts
   */
  async getBrands(): Promise<Array<{ brand: string; count: number }>> {
    try {
      const brands = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { brand: '$_id', count: 1, _id: 0 } },
      ]);

      return brands;
    } catch (error: any) {
      logger.error('Failed to get brands', { error: error.message });
      throw new Error(`Failed to retrieve brands: ${error.message}`);
    }
  }

  /**
   * Bulk import products from array
   */
  async bulkImportProducts(
    products: ProductCreateData[],
    createdBy: string
  ): Promise<BulkImportResult> {
    const result: BulkImportResult = {
      successful: 0,
      failed: 0,
      errors: [],
      createdProducts: [],
    };

    for (let i = 0; i < products.length; i++) {
      try {
        const product = await this.createProduct(products[i], createdBy);
        result.successful++;
        result.createdProducts.push(product._id.toString());
      } catch (error: any) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          error: error.message,
          data: products[i],
        });
      }
    }

    logger.info('Bulk import completed', {
      total: products.length,
      successful: result.successful,
      failed: result.failed,
      createdBy,
    });

    return result;
  }

  /**
   * Get products by partner ID
   */
  async getProductsByPartner(
    partnerId: string,
    pagination: PaginationOptions = {}
  ): Promise<{ products: IProduct[]; totalCount: number }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        throw new Error('Invalid partner ID');
      }

      const filters: ProductFilters = {
        partnerId,
        isActive: true,
      };

      const result = await this.getProducts(filters, pagination);
      return {
        products: result.products,
        totalCount: result.totalCount,
      };
    } catch (error: any) {
      logger.error('Failed to get products by partner', {
        error: error.message,
        partnerId,
      });
      throw new Error(`Failed to retrieve partner products: ${error.message}`);
    }
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(productId: string): Promise<{
    views: number;
    clicks: number;
    conversionRate: number;
    averageRating: number;
    reviewCount: number;
    monthlyViews: number;
  }> {
    try {
      const product = await this.getProductById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      const monthsSinceCreation = Math.ceil(
        (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const monthlyViews =
        monthsSinceCreation > 0
          ? Math.round(product.viewCount / monthsSinceCreation)
          : 0;

      return {
        views: product.viewCount,
        clicks: product.clickCount,
        conversionRate: product.conversionRate,
        averageRating: product.rating,
        reviewCount: product.reviewCount,
        monthlyViews: monthlyViews,
      };
    } catch (error: any) {
      logger.error('Failed to get product analytics', {
        error: error.message,
        productId,
      });
      throw new Error(`Failed to retrieve product analytics: ${error.message}`);
    }
  }

  /**
   * Private helper: Build MongoDB query from filters
   */
  private buildQuery(filters: ProductFilters): any {
    const query: any = {};

    // Basic filters
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = filters.brand;
    if (filters.tier) query.tier = filters.tier;
    if (filters.availabilityStatus)
      query.availabilityStatus = filters.availabilityStatus;

    // Boolean filters
    if (typeof filters.inStock === 'boolean') query.inStock = filters.inStock;
    if (typeof filters.isActive === 'boolean')
      query.isActive = filters.isActive;
    else query.isActive = true; // Default to active products only

    // Partner filter
    if (
      filters.partnerId &&
      mongoose.Types.ObjectId.isValid(filters.partnerId)
    ) {
      query.partnerId = new mongoose.Types.ObjectId(filters.partnerId);
    }

    // Price range
    if (filters.priceRange) {
      query.price = {};
      if (filters.priceRange.min !== undefined)
        query.price.$gte = filters.priceRange.min;
      if (filters.priceRange.max !== undefined)
        query.price.$lte = filters.priceRange.max;
    }

    // Vehicle compatibility
    if (filters.vehicleBrand) {
      query['suitableFor.vehicleBrands'] = {
        $in: [filters.vehicleBrand, 'ALL'],
      };
    }

    if (filters.paintType) {
      query['suitableFor.paintTypes'] = { $in: [filters.paintType, 'ALL'] };
    }

    // Problem solving
    if (filters.problems && filters.problems.length > 0) {
      query['solves.problems'] = { $in: filters.problems };
    }

    // Experience level
    if (filters.experienceLevel) {
      query['usage.experienceLevel'] = { $in: [filters.experienceLevel] };
    }

    return query;
  }
}

export default new ProductService();
