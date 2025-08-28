/**
 * Product Management API Routes - AutoCare Advisor
 *
 * Comprehensive REST API for product management system
 * with MongoDB integration and recommendation engine support.
 *
 * Routes:
 * - CRUD Operations
 * - Search & Filtering
 * - Bulk Import/Export
 * - Analytics & Tracking
 * - Category & Brand Management
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product';
import enhancedSearchService from '../services/enhancedProductSearchService';
import { imageProcessingQueue } from '../services/imageProcessingQueue';
import productService, { ProductFilters } from '../services/productService';
import logger from '../utils/logger';

const router = express.Router();

// Configure multer for image uploads (temporary - will be replaced with S3)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @route   GET /api/products/search
 * @desc    Enhanced product search with filtering and facets
 * @access  Public
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const {
      q: searchTerm = '',
      category,
      subcategory,
      brand,
      priceMin,
      priceMax,
      ratingMin,
      inStock,
      vehicleBrand,
      paintType,
      problems,
      experienceLevel,
      features,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc',
      includeOutOfStock = 'false',
    } = req.query;

    // Build filters
    const filters: any = {};

    if (category) filters.category = category as string;
    if (subcategory) filters.subcategory = subcategory as string;
    if (brand) filters.brand = (brand as string).split(',');
    if (priceMin || priceMax) {
      filters.priceRange = {
        min: priceMin ? parseFloat(priceMin as string) : 0,
        max: priceMax ? parseFloat(priceMax as string) : 99999,
      };
    }
    if (ratingMin) filters.rating = { min: parseFloat(ratingMin as string) };
    if (inStock !== undefined) filters.inStock = inStock === 'true';
    if (vehicleBrand) filters.vehicleBrand = vehicleBrand as string;
    if (paintType) filters.paintType = paintType as string;
    if (problems) filters.problems = (problems as string).split(',');
    if (experienceLevel) filters.experienceLevel = experienceLevel as string;
    if (features) filters.features = (features as string).split(',');
    if (tags) filters.tags = (tags as string).split(',');

    // Search options
    const options = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100),
      sortBy: sortBy as 'relevance' | 'price' | 'rating' | 'name' | 'newest',
      sortOrder: sortOrder as 'asc' | 'desc',
      includeOutOfStock: includeOutOfStock === 'true',
    };

    const result = await enhancedSearchService.searchProducts(
      searchTerm as string,
      filters,
      options
    );

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        query: { searchTerm, filters, options },
      },
    });
  } catch (error: any) {
    logger.error('Enhanced product search failed', {
      query: req.query,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Product search failed',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/suggestions
 * @desc    Get search suggestions/auto-complete
 * @access  Public
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] },
      });
    }

    const suggestions = await enhancedSearchService.getSearchSuggestions(
      query,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: { suggestions },
      meta: {
        query,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Search suggestions failed', {
      query: req.query.q,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/trending
 * @desc    Get trending/popular products
 * @access  Public
 */
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const products = await enhancedSearchService.getTrendingProducts(
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: { products },
      meta: {
        timestamp: new Date().toISOString(),
        count: products.length,
      },
    });
  } catch (error: any) {
    logger.error('Trending products fetch failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get trending products',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/category/:slug
 * @desc    Get products by category with enhanced search
 * @access  Public
 */
router.get('/category/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const {
      brand,
      priceMin,
      priceMax,
      ratingMin,
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query;

    // Build filters
    const filters: any = {};
    if (brand) filters.brand = (brand as string).split(',');
    if (priceMin || priceMax) {
      filters.priceRange = {
        min: priceMin ? parseFloat(priceMin as string) : 0,
        max: priceMax ? parseFloat(priceMax as string) : 99999,
      };
    }
    if (ratingMin) filters.rating = { min: parseFloat(ratingMin as string) };

    const options = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100),
      sortBy: sortBy as 'relevance' | 'price' | 'rating' | 'name' | 'newest',
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await enhancedSearchService.getProductsByCategory(
      slug,
      filters,
      options
    );

    res.json({
      success: true,
      data: result,
      meta: {
        categorySlug: slug,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Category products fetch failed', {
      slug: req.params.slug,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to get category products',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products
 * @desc    Get products with filtering and pagination
 * @access  Public (filtered) / Private (full access)
 */
/**
 * @route   GET /api/products/partner/:partnerId
 * @desc    Get all products for a specific partner
 * @access  Private (Partner)
 */
router.get('/partner/:partnerId', async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      brand,
      search,
      status = 'all', // all, active, inactive
    } = req.query;

    const filters: ProductFilters = {
      partnerId,
    };

    if (category && category !== 'all') filters.category = category as string;
    if (brand && brand !== 'all') filters.brand = brand as string;
    if (status === 'active') filters.isActive = true;
    if (status === 'inactive') filters.isActive = false;

    const result = await productService.getProducts(filters, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      search: search as string,
    });

    res.json({
      success: true,
      data: {
        products: result.products,
        pagination: result.pagination,
        summary: {
          totalProducts: result.pagination.totalProducts,
          activeProducts: result.products.filter((p) => p.isActive).length,
          inactiveProducts: result.products.filter((p) => !p.isActive).length,
        },
      },
    });
  } catch (error: any) {
    logger.error('Partner products fetch failed', {
      partnerId: req.params.partnerId,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch partner products',
      message: error.message,
    });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      brand,
      partnerId,
      priceMin,
      priceMax,
      inStock,
      search,
      vehicleBrand,
      paintType,
      problems,
      experienceLevel,
    } = req.query;

    // Build filters
    const filters: ProductFilters = {};

    if (category) filters.category = category as string;
    if (brand) filters.brand = brand as string;
    if (partnerId) filters.partnerId = partnerId as string;
    if (vehicleBrand) filters.vehicleBrand = vehicleBrand as string;
    if (paintType) filters.paintType = paintType as string;
    if (experienceLevel) filters.experienceLevel = experienceLevel as string;

    if (priceMin || priceMax) {
      filters.priceRange = { min: 0, max: Number.MAX_VALUE };
      if (priceMin) filters.priceRange.min = parseFloat(priceMin as string);
      if (priceMax) filters.priceRange.max = parseFloat(priceMax as string);
    }

    if (inStock !== undefined) {
      filters.inStock = inStock === 'true';
    }

    if (problems && typeof problems === 'string') {
      filters.problems = problems.split(',');
    }

    // Pagination options
    const paginationOptions = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100), // Max 100 per page
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    let result;

    if (search && typeof search === 'string') {
      // Text search
      result = await productService.searchProducts(
        search,
        filters,
        paginationOptions
      );
    } else {
      // Regular filtering
      result = await productService.getProducts(filters, paginationOptions);
    }

    // Response metadata
    const responseData = {
      success: true,
      data: {
        products: result.products,
        pagination: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
          totalCount: result.pagination.totalProducts,
          totalPages: result.pagination.totalPages,
          hasNext: paginationOptions.page < result.pagination.totalPages,
          hasPrev: paginationOptions.page > 1,
        },
        filters: filters,
        sorting: {
          sortBy: paginationOptions.sortBy,
          sortOrder: paginationOptions.sortOrder,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now(),
      },
    };

    res.json(responseData);
  } catch (error: any) {
    logger.error('Failed to get products', {
      error: error.message,
      query: req.query,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { track = 'false' } = req.query;

    const product = await productService.getProductById(id);

    // If tracking is needed, implement it separately
    if (track === 'true') {
      // TODO: Implement tracking logic here
      // await analyticsService.trackProductView(id, req.ip);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`,
      });
    }

    res.json({
      success: true,
      data: { product },
      meta: {
        timestamp: new Date().toISOString(),
        tracked: track === 'true',
      },
    });
  } catch (error: any) {
    logger.error('Failed to get product by ID', {
      error: error.message,
      productId: req.params.id,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create new product (Partner only)
 * @access  Private (Partner)
 */
router.post(
  '/',
  upload.array('images', 5),
  async (req: Request, res: Response) => {
    try {
      const productData = {
        ...req.body,
        images: req.files
          ? (req.files as Express.Multer.File[]).map(
              (file) => `/uploads/products/${file.filename}`
            )
          : [],
        createdBy: req.body.partnerId, // In production, get from JWT token
        lastModifiedBy: req.body.partnerId,
      };

      // Parse JSON fields if they come as strings
      if (typeof productData.suitableFor === 'string') {
        productData.suitableFor = JSON.parse(productData.suitableFor);
      }
      if (typeof productData.solves === 'string') {
        productData.solves = JSON.parse(productData.solves);
      }
      if (typeof productData.usage === 'string') {
        productData.usage = JSON.parse(productData.usage);
      }
      if (typeof productData.specifications === 'string') {
        productData.specifications = JSON.parse(productData.specifications);
      }
      if (typeof productData.features === 'string') {
        productData.features = JSON.parse(productData.features);
      }
      if (typeof productData.tags === 'string') {
        productData.tags = JSON.parse(productData.tags);
      }

      const product = await productService.createProduct(
        productData,
        req.body.partnerId
      );

      logger.info('Product created successfully', {
        productId: product._id,
        partnerId: productData.partnerId,
        name: product.name,
      });

      res.status(201).json({
        success: true,
        data: { product },
        message: 'Product created successfully',
      });
    } catch (error: any) {
      logger.error('Product creation failed', {
        error: error.message,
        partnerId: req.body.partnerId,
      });
      res.status(500).json({
        success: false,
        error: 'Product creation failed',
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update existing product
 * @access  Private (Partner - own products only)
 */
router.put(
  '/:id',
  upload.array('images', 5),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Handle new uploaded images
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const newImages = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/products/${file.filename}`
        );
        updateData.images = [
          ...(updateData.existingImages || []),
          ...newImages,
        ];
      }

      updateData.lastModifiedBy = req.body.partnerId; // In production, get from JWT
      updateData.updatedAt = new Date();

      // Parse JSON fields if they come as strings
      [
        'suitableFor',
        'solves',
        'usage',
        'specifications',
        'features',
        'tags',
      ].forEach((field) => {
        if (typeof updateData[field] === 'string') {
          updateData[field] = JSON.parse(updateData[field]);
        }
      });

      const product = await productService.updateProduct(
        id,
        updateData,
        req.body.partnerId
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      logger.info('Product updated successfully', {
        productId: id,
        partnerId: req.body.partnerId,
      });

      res.json({
        success: true,
        data: { product },
        message: 'Product updated successfully',
      });
    } catch (error: any) {
      logger.error('Product update failed', {
        productId: req.params.id,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'Product update failed',
        message: error.message,
      });
    }
  }
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private (Partner - own products only)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productService.deleteProduct(id);

    // TODO: Implement ownership/authorization check if needed
    // Verify that the product belongs to the requesting partner
    // if (product && product.partnerId !== partnerId) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Access denied - not your product'
    //   });
    // }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or access denied',
      });
    }

    logger.info('Product deleted successfully', {
      productId: id,
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    logger.error('Product deletion failed', {
      productId: req.params.id,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Product deletion failed',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/products/bulk-update
 * @desc    Bulk update products (status, category, etc.)
 * @access  Private (Partner)
 */
router.post('/bulk-update', async (req: Request, res: Response) => {
  try {
    const { productIds, updateData, partnerId } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs are required',
      });
    }

    const result = await productService.bulkUpdateProducts(
      productIds,
      { ...updateData, lastModifiedBy: partnerId },
      partnerId
    );

    logger.info('Bulk product update completed', {
      partnerId,
      productCount: productIds.length,
      modifiedCount: result.modifiedCount,
    });

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        totalRequested: productIds.length,
      },
      message: `${result.modifiedCount} products updated successfully`,
    });
  } catch (error: any) {
    logger.error('Bulk update failed', {
      error: error.message,
      partnerId: req.body.partnerId,
    });
    res.status(500).json({
      success: false,
      error: 'Bulk update failed',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/analytics/:partnerId
 * @desc    Get product analytics for partner dashboard
 * @access  Private (Partner)
 */
router.get('/analytics/:partnerId', async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;

    const analytics = await productService.getProductAnalytics(partnerId);

    logger.info('Product analytics retrieved', {
      partnerId,
      totalProducts: analytics.totalProducts,
    });

    res.json({
      success: true,
      data: analytics,
      meta: {
        timestamp: new Date().toISOString(),
        partnerId,
      },
    });
  } catch (error: any) {
    logger.error('Analytics retrieval failed', {
      partnerId: req.params.partnerId,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Analytics retrieval failed',
      message: error.message,
    });
  }
});

/**
 * Batch Image Processing Routes
 */

// Start batch WebP conversion
router.post('/images/batch/webp', async (req: Request, res: Response) => {
  try {
    const { productIds, priority = 'normal' } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs array is required',
      });
    }

    // Get products with images
    const products = await Promise.all(
      productIds.map((id: string) => productService.getProductById(id))
    );
    const validProducts = products.filter(Boolean);
    const imageUrls: string[] = validProducts
      .filter((p: any) => p.images && p.images.length > 0)
      .flatMap((p: any) => p.images || [])
      .map((img: any) => img.url);

    // Add individual WebP jobs for each image
    const jobIds = await Promise.all(
      imageUrls.map((url) => imageProcessingQueue.addWebPConversionJob(url, 0))
    );

    res.json({
      success: true,
      data: { jobIds },
      message: `Started WebP conversion for ${imageUrls.length} images with ${jobIds.length} jobs`,
    });
  } catch (error: any) {
    logger.error('Batch WebP conversion failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Batch processing failed',
      message: error.message,
    });
  }
});

// Get job status
router.get('/images/jobs/:jobId', async (req: Request, res: Response) => {
  try {
    const job = await imageProcessingQueue.getJobStatus(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    logger.error('Job status retrieval failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Status retrieval failed',
      message: error.message,
    });
  }
});

// Get queue statistics
router.get('/images/queue/stats', async (req: Request, res: Response) => {
  try {
    const stats = await imageProcessingQueue.getQueueStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    logger.error('Queue stats retrieval failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Stats retrieval failed',
      message: error.message,
    });
  }
});

// Clean old jobs
router.delete('/images/jobs/cleanup', async (req: Request, res: Response) => {
  try {
    const { olderThanHours = 24 } = req.query;
    await imageProcessingQueue.cleanOldJobs();

    res.json({
      success: true,
      message: `Cleaned jobs older than ${olderThanHours} hours`,
    });
  } catch (error: any) {
    logger.error('Job cleanup failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Cleanup failed',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get product details by slug
 * @access  Public
 */
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produkt nicht gefunden',
      });
    }

    // Track product view (optional analytics)
    try {
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { viewCount: 1 } },
        { upsert: false }
      );
    } catch (viewError) {
      // Don't fail the request if view tracking fails
      logger.warn('Failed to track product view', {
        productId: product._id,
        error: viewError,
      });
    }

    res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error: any) {
    logger.error('Product slug fetch failed', {
      slug: req.params.slug,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Produkts',
      message: error.message,
    });
  }
});

export default router;
