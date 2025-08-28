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
  search?: string;
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
      // Handle both ObjectId and string partner IDs for flexibility
      let partnerIdValue: any;
      let createdByValue: any;

      if (mongoose.Types.ObjectId.isValid(productData.partnerId)) {
        partnerIdValue = new mongoose.Types.ObjectId(productData.partnerId);
      } else {
        // For demo purposes, allow string partner IDs
        partnerIdValue = productData.partnerId;
      }

      if (mongoose.Types.ObjectId.isValid(createdBy)) {
        createdByValue = new mongoose.Types.ObjectId(createdBy);
      } else {
        createdByValue = createdBy;
      }

      // Generate default values
      const newProduct = new Product({
        ...productData,
        partnerId: partnerIdValue,
        createdBy: createdByValue,
        lastModifiedBy: createdByValue,

        // Default matching criteria if not provided
        suitableFor: productData.suitableFor || {
          vehicleTypes: ['ALL'],
          vehicleBrands: ['ALL'],
          paintTypes: ['ALL'],
          experienceLevel: 'ALL',
        },
        solves: productData.solves || {
          problems: [],
          applications: [],
        },
        usage: productData.usage || {
          instructions: '',
          applicationMethods: [],
          safetyPrecautions: [],
        },
        specifications: productData.specifications || {},

        // Metadata
        isActive: true,
        inStock: true,
        availabilityStatus: 'in_stock',
      });

      const savedProduct = await newProduct.save();

      logger.info('Product created successfully', {
        productId: savedProduct._id,
        partnerId: productData.partnerId,
        createdBy,
      });

      return savedProduct;
    } catch (error: any) {
      logger.error('Product creation failed', {
        productData: { ...productData, partnerId: productData.partnerId },
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<IProduct | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const product = await Product.findById(productId)
        .populate('partnerId', 'companyName email')
        .exec();

      return product;
    } catch (error: any) {
      logger.error('Get product by ID failed', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    updateData: ProductUpdateData,
    updatedBy: string
  ): Promise<IProduct | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          ...updateData,
          lastModifiedBy: new mongoose.Types.ObjectId(updatedBy),
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).populate('partnerId', 'companyName email');

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      logger.info('Product updated successfully', {
        productId,
        updatedBy,
        updatedFields: Object.keys(updateData),
      });

      return updatedProduct;
    } catch (error: any) {
      logger.error('Product update failed', {
        productId,
        updateData,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
      }

      const result = await Product.findByIdAndDelete(productId);

      if (!result) {
        throw new Error('Product not found');
      }

      logger.info('Product deleted successfully', { productId });
      return true;
    } catch (error: any) {
      logger.error('Product deletion failed', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get products with enhanced pagination response
   */
  async getProducts(
    filters: ProductFilters = {},
    options: PaginationOptions = {}
  ): Promise<{
    products: IProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasMore: boolean;
      limit: number;
    };
    filters: {
      categories: string[];
      brands: string[];
      priceRange: { min: number; max: number };
    };
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
      } = options;

      // Build MongoDB query
      const query: any = {};

      // Text search across multiple fields
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.brand) {
        query.brand = filters.brand;
      }

      if (
        filters.partnerId &&
        mongoose.Types.ObjectId.isValid(filters.partnerId)
      ) {
        query.partnerId = new mongoose.Types.ObjectId(filters.partnerId);
      }

      if (filters.priceRange) {
        query.price = {
          $gte: filters.priceRange.min,
          $lte: filters.priceRange.max,
        };
      }

      if (filters.inStock !== undefined) {
        query.inStock = filters.inStock;
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      if (filters.tier) {
        query.tier = filters.tier;
      }

      if (filters.availabilityStatus) {
        query.availabilityStatus = filters.availabilityStatus;
      }

      if (filters.vehicleBrand) {
        query['suitableFor.vehicleBrands'] = filters.vehicleBrand;
      }

      if (filters.paintType) {
        query['suitableFor.paintTypes'] = filters.paintType;
      }

      if (filters.problems && filters.problems.length > 0) {
        query['solves.problems'] = { $in: filters.problems };
      }

      if (filters.experienceLevel) {
        query['suitableFor.experienceLevel'] = filters.experienceLevel;
      }

      // Sort options
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute queries
      const skip = (page - 1) * limit;

      const [products, totalCount, categoryStats, brandStats, priceStats] =
        await Promise.all([
          Product.find(query)
            .populate('partnerId', 'companyName email')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec(),

          Product.countDocuments(query),

          // Get unique categories for filtering
          Product.distinct('category', query),

          // Get unique brands for filtering
          Product.distinct('brand', query),

          // Get price range for filtering
          Product.aggregate([
            { $match: query },
            {
              $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
              },
            },
          ]),
        ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasMore = page < totalPages;

      const result = {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: totalCount,
          hasMore,
          limit,
        },
        filters: {
          categories: categoryStats,
          brands: brandStats,
          priceRange: {
            min: priceStats[0]?.minPrice || 0,
            max: priceStats[0]?.maxPrice || 1000,
          },
        },
      };

      logger.info('Products retrieved successfully', {
        query: Object.keys(query),
        totalCount,
        page,
        limit,
      });

      return result;
    } catch (error: any) {
      logger.error('Get products failed', {
        filters,
        options,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Bulk update products
   */
  async bulkUpdateProducts(
    productIds: string[],
    updateData: Partial<ProductUpdateData>,
    partnerId: string
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    try {
      const validProductIds = productIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      if (validProductIds.length === 0) {
        throw new Error('No valid product IDs provided');
      }

      // Handle both ObjectId and string partner IDs
      let partnerQuery: any;
      let lastModifiedByValue: any;

      if (mongoose.Types.ObjectId.isValid(partnerId)) {
        partnerQuery = { partnerId: new mongoose.Types.ObjectId(partnerId) };
        lastModifiedByValue = new mongoose.Types.ObjectId(partnerId);
      } else {
        partnerQuery = { partnerId: partnerId };
        lastModifiedByValue = partnerId;
      }

      const result = await Product.updateMany(
        {
          _id: { $in: validProductIds },
          ...partnerQuery,
        },
        {
          ...updateData,
          lastModifiedBy: lastModifiedByValue,
          updatedAt: new Date(),
        }
      );

      logger.info('Bulk product update completed', {
        partnerId,
        requestedCount: productIds.length,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });

      return {
        modifiedCount: result.modifiedCount || 0,
        matchedCount: result.matchedCount || 0,
      };
    } catch (error: any) {
      logger.error('Bulk product update failed', {
        productIds: productIds.slice(0, 5), // Log first 5 IDs only
        partnerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get products by partner
   */
  async getProductsByPartner(
    partnerId: string,
    options: PaginationOptions = {}
  ): Promise<{
    products: IProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasMore: boolean;
      limit: number;
    };
  }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        throw new Error('Invalid partner ID');
      }

      const filters: ProductFilters = { partnerId };
      const result = await this.getProducts(filters, options);

      return {
        products: result.products,
        pagination: result.pagination,
      };
    } catch (error: any) {
      logger.error('Get products by partner failed', {
        partnerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Search products with advanced filtering
   */
  async searchProducts(
    searchTerm: string,
    filters: ProductFilters = {},
    options: PaginationOptions = {}
  ): Promise<{
    products: IProduct[];
    pagination: any;
    searchMeta: {
      searchTerm: string;
      totalResults: number;
      searchTime: number;
    };
  }> {
    const startTime = Date.now();

    try {
      const searchFilters = {
        ...filters,
        search: searchTerm,
      };

      const result = await this.getProducts(searchFilters, options);
      const searchTime = Date.now() - startTime;

      return {
        products: result.products,
        pagination: result.pagination,
        searchMeta: {
          searchTerm,
          totalResults: result.pagination.totalProducts,
          searchTime,
        },
      };
    } catch (error: any) {
      logger.error('Product search failed', {
        searchTerm,
        filters,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get product analytics for partner dashboard
   */
  async getProductAnalytics(partnerId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    averagePrice: number;
    totalValue: number;
  }> {
    try {
      // Handle both ObjectId and string partner IDs for flexibility
      let partnerQuery: any;

      if (mongoose.Types.ObjectId.isValid(partnerId)) {
        partnerQuery = { partnerId: new mongoose.Types.ObjectId(partnerId) };
      } else {
        // For demo purposes, allow string partner IDs
        partnerQuery = { partnerId: partnerId };
      }

      const [
        totalProducts,
        activeProducts,
        categoryStats,
        brandStats,
        priceStats,
      ] = await Promise.all([
        Product.countDocuments(partnerQuery),
        Product.countDocuments({ ...partnerQuery, isActive: true }),
        Product.aggregate([
          { $match: partnerQuery },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Product.aggregate([
          { $match: partnerQuery },
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Product.aggregate([
          { $match: partnerQuery },
          {
            $group: {
              _id: null,
              averagePrice: { $avg: '$price' },
              totalValue: { $sum: '$price' },
            },
          },
        ]),
      ]);

      const result = {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        categories: categoryStats.map((cat) => ({
          name: cat._id,
          count: cat.count,
        })),
        brands: brandStats.map((brand) => ({
          name: brand._id,
          count: brand.count,
        })),
        averagePrice: priceStats[0]?.averagePrice || 0,
        totalValue: priceStats[0]?.totalValue || 0,
      };

      logger.info('Product analytics retrieved successfully', {
        partnerId,
        analytics: result,
      });

      return result;
    } catch (error: any) {
      logger.error('Get product analytics failed', {
        partnerId,
        error: error.message,
      });
      throw error;
    }
  }
}

export default new ProductService();
