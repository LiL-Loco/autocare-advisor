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
 * @route   GET /api/products
 * @desc    Get products with filtering and pagination
 * @access  Public (filtered) / Private (full access)
 */
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
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          hasNext: paginationOptions.page < result.totalPages,
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

    const product = await productService.getProductById(id, track === 'true');

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

export default router;
