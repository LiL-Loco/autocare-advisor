/**
 * Enhanced Product Search Service - AutoCare Advisor
 *
 * Advanced search functionality for product discovery and categorization
 * with intelligent filtering, faceted search, and SEO optimization.
 *
 * Features:
 * - Full-text search with auto-suggest
 * - Advanced filtering and faceted search
 * - Category-based browsing
 * - Performance optimization
 * - Search analytics tracking
 */

import { PipelineStage } from 'mongoose';
import Category from '../models/Category';
import Product, { IProduct } from '../models/Product';
import logger from '../utils/logger';

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  brand?: string[];
  priceRange?: { min: number; max: number };
  rating?: { min: number };
  inStock?: boolean;
  vehicleBrand?: string;
  paintType?: string;
  problems?: string[];
  experienceLevel?: string;
  features?: string[];
  tags?: string[];
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
  includeOutOfStock?: boolean;
}

export interface SearchSuggestion {
  term: string;
  type: 'product' | 'brand' | 'category' | 'tag';
  count: number;
}

export interface FacetData {
  brands: Array<{ name: string; count: number }>;
  categories: Array<{ name: string; count: number }>;
  priceRanges: Array<{
    range: string;
    min: number;
    max: number;
    count: number;
  }>;
  ratings: Array<{ rating: number; count: number }>;
  features: Array<{ feature: string; count: number }>;
}

export interface SearchResult {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets: FacetData;
  suggestions: SearchSuggestion[];
  searchTerm?: string;
  appliedFilters: SearchFilters;
  processingTime: number;
}

class EnhancedProductSearchService {
  private readonly SEARCH_CACHE_TTL = 300; // 5 minutes cache
  private searchCache = new Map<
    string,
    { data: SearchResult; timestamp: number }
  >();

  /**
   * Main product search function with intelligent filtering
   */
  async searchProducts(
    searchTerm: string = '',
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      // Build cache key
      const cacheKey = this.buildCacheKey(searchTerm, filters, options);
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Build MongoDB aggregation pipeline
      const pipeline = this.buildSearchPipeline(searchTerm, filters, options);

      // Execute search with parallel facet calculation
      const [searchResults, facetData] = await Promise.all([
        this.executeSearch(pipeline, options),
        this.calculateFacets(searchTerm, filters),
      ]);

      // Generate suggestions if search term provided
      const suggestions = searchTerm
        ? await this.generateSuggestions(
            searchTerm,
            searchResults.products.length
          )
        : [];

      const result: SearchResult = {
        products: searchResults.products,
        pagination: searchResults.pagination,
        facets: facetData,
        suggestions,
        searchTerm: searchTerm || undefined,
        appliedFilters: filters,
        processingTime: Date.now() - startTime,
      };

      // Cache result
      this.cacheResult(cacheKey, result);

      // Track search analytics (async, non-blocking)
      this.trackSearch(searchTerm, filters, result.products.length).catch(
        (error) =>
          logger.warn('Search tracking failed', { error: error.message })
      );

      return result;
    } catch (error: any) {
      logger.error('Product search failed', {
        searchTerm,
        filters,
        options,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get products by category with smart filtering
   */
  async getProductsByCategory(
    categorySlug: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    try {
      // Find category
      const category = await Category.findOne({
        slug: categorySlug,
        isActive: true,
        isVisible: true,
      });

      if (!category) {
        throw new Error(`Category '${categorySlug}' not found`);
      }

      // Add category filter
      const categoryFilters: SearchFilters = {
        ...filters,
        category: category.name,
      };

      return this.searchProducts('', categoryFilters, options);
    } catch (error: any) {
      logger.error('Category products fetch failed', {
        categorySlug,
        filters,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Auto-suggest functionality
   */
  async getSearchSuggestions(
    query: string,
    limit: number = 10
  ): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const searchRegex = new RegExp(query, 'i');

      const [productSuggestions, brandSuggestions, categorySuggestions] =
        await Promise.all([
          // Product name suggestions
          Product.aggregate([
            {
              $match: {
                name: { $regex: searchRegex },
                isActive: true,
                inStock: true,
              },
            },
            { $group: { _id: '$name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit / 3 },
            {
              $project: {
                term: '$_id',
                type: { $literal: 'product' },
                count: 1,
                _id: 0,
              },
            },
          ]),

          // Brand suggestions
          Product.aggregate([
            {
              $match: {
                brand: { $regex: searchRegex },
                isActive: true,
              },
            },
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit / 3 },
            {
              $project: {
                term: '$_id',
                type: { $literal: 'brand' },
                count: 1,
                _id: 0,
              },
            },
          ]),

          // Category suggestions
          Category.aggregate([
            {
              $match: {
                name: { $regex: searchRegex },
                isActive: true,
                isVisible: true,
              },
            },
            { $sort: { productCount: -1 } },
            { $limit: limit / 3 },
            {
              $project: {
                term: '$name',
                type: { $literal: 'category' },
                count: '$productCount',
                _id: 0,
              },
            },
          ]),
        ]);

      // Combine and sort suggestions
      const allSuggestions = [
        ...productSuggestions,
        ...brandSuggestions,
        ...categorySuggestions,
      ];

      return allSuggestions.sort((a, b) => b.count - a.count).slice(0, limit);
    } catch (error: any) {
      logger.error('Search suggestions failed', {
        query,
        error: error.message,
      });
      return [];
    }
  }

  /**
   * Get popular/trending products
   */
  async getTrendingProducts(limit: number = 10): Promise<IProduct[]> {
    try {
      return await Product.find({
        isActive: true,
        inStock: true,
      })
        .sort({ viewCount: -1, clickCount: -1, rating: -1 })
        .limit(limit)
        .lean();
    } catch (error: any) {
      logger.error('Trending products fetch failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Build MongoDB aggregation pipeline for search
   */
  private buildSearchPipeline(
    searchTerm: string,
    filters: SearchFilters,
    options: SearchOptions
  ): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    // Match stage
    const matchStage: any = {
      isActive: true,
    };

    if (!options.includeOutOfStock) {
      matchStage.inStock = true;
    }

    // Text search
    if (searchTerm) {
      matchStage.$text = { $search: searchTerm };
    }

    // Apply filters
    if (filters.category) {
      matchStage.category = filters.category;
    }

    if (filters.subcategory) {
      matchStage.subcategory = filters.subcategory;
    }

    if (filters.brand && filters.brand.length > 0) {
      matchStage.brand = { $in: filters.brand };
    }

    if (filters.priceRange) {
      matchStage.price = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      };
    }

    if (filters.rating) {
      matchStage.rating = { $gte: filters.rating.min };
    }

    if (filters.vehicleBrand) {
      matchStage['suitableFor.vehicleBrands'] = {
        $in: [filters.vehicleBrand, 'ALL'],
      };
    }

    if (filters.paintType) {
      matchStage['suitableFor.paintTypes'] = {
        $in: [filters.paintType, 'ALL'],
      };
    }

    if (filters.problems && filters.problems.length > 0) {
      matchStage['solves.problems'] = { $in: filters.problems };
    }

    if (filters.experienceLevel) {
      matchStage['usage.experienceLevel'] = { $in: [filters.experienceLevel] };
    }

    if (filters.features && filters.features.length > 0) {
      matchStage.features = { $in: filters.features };
    }

    if (filters.tags && filters.tags.length > 0) {
      matchStage.tags = { $in: filters.tags };
    }

    pipeline.push({ $match: matchStage });

    // Add score for text search
    if (searchTerm) {
      pipeline.push({
        $addFields: {
          searchScore: { $meta: 'textScore' },
        },
      });
    }

    return pipeline;
  }

  /**
   * Execute search with pagination
   */
  private async executeSearch(
    pipeline: any[],
    options: SearchOptions
  ): Promise<{
    products: IProduct[];
    pagination: SearchResult['pagination'];
  }> {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Add sorting
    const sortStage: any = {};

    switch (options.sortBy) {
      case 'price':
        sortStage.price = options.sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortStage.rating = -1;
        sortStage.reviewCount = -1;
        break;
      case 'name':
        sortStage.name = 1;
        break;
      case 'newest':
        sortStage.createdAt = -1;
        break;
      case 'relevance':
      default:
        if (pipeline.some((stage) => stage.$addFields?.searchScore)) {
          sortStage.searchScore = { $meta: 'textScore' };
        }
        sortStage.rating = -1;
        sortStage.reviewCount = -1;
        break;
    }

    pipeline.push({ $sort: sortStage });

    // Execute aggregation with facet for pagination
    const aggregationPipeline = [
      ...pipeline,
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await Product.aggregate(aggregationPipeline);

    const products = result.products || [];
    const totalProducts = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Calculate facets for search results
   */
  private async calculateFacets(
    searchTerm: string,
    filters: SearchFilters
  ): Promise<FacetData> {
    const baseMatch: any = { isActive: true, inStock: true };

    if (searchTerm) {
      baseMatch.$text = { $search: searchTerm };
    }

    // Don't include the current filter in its own facet calculation
    const facetFilters = { ...filters };

    const pipeline: PipelineStage[] = [
      { $match: baseMatch },
      {
        $facet: {
          brands: [
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
            { $project: { name: '$_id', count: 1, _id: 0 } },
          ],
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { name: '$_id', count: 1, _id: 0 } },
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: '$price',
                boundaries: [0, 25, 50, 100, 200, 500, 1000],
                default: '1000+',
                output: { count: { $sum: 1 } },
              },
            },
            {
              $project: {
                range: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$_id', 0] }, then: '€0 - €25' },
                      { case: { $eq: ['$_id', 25] }, then: '€25 - €50' },
                      { case: { $eq: ['$_id', 50] }, then: '€50 - €100' },
                      { case: { $eq: ['$_id', 100] }, then: '€100 - €200' },
                      { case: { $eq: ['$_id', 200] }, then: '€200 - €500' },
                      { case: { $eq: ['$_id', 500] }, then: '€500 - €1000' },
                    ],
                    default: '€1000+',
                  },
                },
                min: '$_id',
                max: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$_id', 0] }, then: 25 },
                      { case: { $eq: ['$_id', 25] }, then: 50 },
                      { case: { $eq: ['$_id', 50] }, then: 100 },
                      { case: { $eq: ['$_id', 100] }, then: 200 },
                      { case: { $eq: ['$_id', 200] }, then: 500 },
                      { case: { $eq: ['$_id', 500] }, then: 1000 },
                    ],
                    default: 9999999,
                  },
                },
                count: 1,
                _id: 0,
              },
            },
          ],
          ratings: [
            {
              $bucket: {
                groupBy: '$rating',
                boundaries: [1, 2, 3, 4, 5],
                default: 5,
                output: { count: { $sum: 1 } },
              },
            },
            { $project: { rating: '$_id', count: 1, _id: 0 } },
            { $sort: { rating: -1 } },
          ],
          features: [
            { $unwind: '$features' },
            { $group: { _id: '$features', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            { $project: { feature: '$_id', count: 1, _id: 0 } },
          ],
        },
      },
    ];

    const [facetResults] = await Product.aggregate(pipeline);

    return {
      brands: facetResults.brands || [],
      categories: facetResults.categories || [],
      priceRanges: facetResults.priceRanges || [],
      ratings: facetResults.ratings || [],
      features: facetResults.features || [],
    };
  }

  /**
   * Generate intelligent search suggestions
   */
  private async generateSuggestions(
    searchTerm: string,
    resultCount: number
  ): Promise<SearchSuggestion[]> {
    if (resultCount > 5) {
      return []; // Don't show suggestions for successful searches
    }

    return this.getSearchSuggestions(searchTerm, 5);
  }

  /**
   * Cache management
   */
  private buildCacheKey(
    searchTerm: string,
    filters: SearchFilters,
    options: SearchOptions
  ): string {
    return btoa(JSON.stringify({ searchTerm, filters, options }));
  }

  private getCachedResult(cacheKey: string): SearchResult | null {
    const cached = this.searchCache.get(cacheKey);
    if (
      cached &&
      Date.now() - cached.timestamp < this.SEARCH_CACHE_TTL * 1000
    ) {
      return cached.data;
    }
    return null;
  }

  private cacheResult(cacheKey: string, result: SearchResult): void {
    this.searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    // Clean old cache entries
    if (this.searchCache.size > 100) {
      const oldestKey = Array.from(this.searchCache.keys())[0];
      this.searchCache.delete(oldestKey);
    }
  }

  /**
   * Track search analytics (async)
   */
  private async trackSearch(
    searchTerm: string,
    filters: SearchFilters,
    resultCount: number
  ): Promise<void> {
    try {
      // This could be integrated with your analytics service
      // For now, just log important searches
      if (searchTerm && resultCount === 0) {
        logger.info('Zero results search', { searchTerm, filters });
      }
    } catch (error) {
      // Silent fail for analytics
    }
  }
}

export default new EnhancedProductSearchService();
