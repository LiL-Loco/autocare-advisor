/**
 * Partner Product Management API Routes
 * Implements CL-29: Produktdatenbank Setup & Management Interface
 */

import { Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateToken } from '../../middleware/auth';
import { requirePartner } from '../../middleware/partnerAuth';
import Product from '../../models/Product';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requirePartner);

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('brand')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand must be between 2 and 100 characters'),

  body('category')
    .isIn([
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
    ])
    .withMessage('Invalid category selected'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),

  body('suitableFor.vehicleTypes')
    .isArray({ min: 1 })
    .withMessage('At least one vehicle type must be selected'),

  body('partnerShopName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Partner shop name is required'),

  body('partnerShopUrl')
    .isURL()
    .withMessage('Valid partner shop URL is required'),
];

/**
 * GET /api/partner/products
 * List all products for authenticated partner
 */
router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be 1-100'),
    query('category').optional().trim(),
    query('status').optional().isIn(['active', 'inactive', 'all']),
    query('search').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const category = req.query.category as string;
      const status = (req.query.status as string) || 'all';
      const search = req.query.search as string;

      // Build filter object
      const filter: any = { partnerId };

      if (category) {
        filter.category = category;
      }

      if (status !== 'all') {
        filter.isActive = status === 'active';
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      // Execute queries in parallel
      const [products, totalCount] = await Promise.all([
        Product.find(filter)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNext,
            hasPrev,
            limit,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching partner products:', error);
      res.status(500).json({
        error: 'Failed to fetch products',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

/**
 * GET /api/partner/products/:id
 * Get single product details for authenticated partner
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid product ID')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const productId = req.params.id;

      const product = await Product.findOne({
        _id: productId,
        partnerId,
      }).lean();

      if (!product) {
        return res.status(404).json({
          error: 'Product not found or unauthorized access',
        });
      }

      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        error: 'Failed to fetch product details',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

/**
 * POST /api/partner/products
 * Create new product for authenticated partner
 */
router.post('/', productValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const partnerId = req.user?.id;
    const userTier = req.user?.tier || 'basic';

    // Create product with partner information
    const productData = {
      ...req.body,
      partnerId,
      tier: userTier,
      createdBy: partnerId,
      lastModifiedBy: partnerId,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    // Handle duplicate slug error
    if ((error as any).code === 11000 && (error as any).keyValue?.slug) {
      return res.status(400).json({
        error: 'Product with similar name already exists',
        field: 'name',
      });
    }

    res.status(500).json({
      error: 'Failed to create product',
      message:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

/**
 * PUT /api/partner/products/:id
 * Update existing product for authenticated partner
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    ...productValidation,
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const productId = req.params.id;

      // Find and validate ownership
      const existingProduct = await Product.findOne({
        _id: productId,
        partnerId,
      });

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Product not found or unauthorized access',
        });
      }

      // Update product data
      const updateData = {
        ...req.body,
        lastModifiedBy: partnerId,
        updatedAt: new Date(),
      };

      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product },
      });
    } catch (error) {
      console.error('Error updating product:', error);

      // Handle duplicate slug error
      if ((error as any).code === 11000 && (error as any).keyValue?.slug) {
        return res.status(400).json({
          error: 'Product with similar name already exists',
          field: 'name',
        });
      }

      res.status(500).json({
        error: 'Failed to update product',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

/**
 * DELETE /api/partner/products/:id
 * Delete product for authenticated partner
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid product ID')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const productId = req.params.id;

      const product = await Product.findOneAndDelete({
        _id: productId,
        partnerId,
      });

      if (!product) {
        return res.status(404).json({
          error: 'Product not found or unauthorized access',
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: { deletedProduct: product },
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        error: 'Failed to delete product',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

/**
 * GET /api/partner/products/:id/analytics
 * Get analytics data for specific product
 */
router.get(
  '/:id/analytics',
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    query('period')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Invalid period'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const productId = req.params.id;
      const period = (req.query.period as string) || '30d';

      const product = await Product.findOne({
        _id: productId,
        partnerId,
      })
        .select(
          'name viewCount clickCount conversionRate rating reviewCount createdAt'
        )
        .lean();

      if (!product) {
        return res.status(404).json({
          error: 'Product not found or unauthorized access',
        });
      }

      // Calculate analytics metrics
      const daysSinceCreation = Math.max(
        1,
        Math.ceil(
          (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const analytics = {
        product: {
          id: productId,
          name: product.name,
        },
        metrics: {
          totalViews: product.viewCount,
          totalClicks: product.clickCount,
          conversionRate: product.conversionRate,
          avgViewsPerDay: Math.round(product.viewCount / daysSinceCreation),
          avgClicksPerDay: Math.round(product.clickCount / daysSinceCreation),
          rating: product.rating,
          reviewCount: product.reviewCount,
        },
        period: period,
        performance: {
          isPopular: product.viewCount > 100,
          isConvertingWell: product.conversionRate > 2,
          needsImprovement:
            product.conversionRate < 1 && product.viewCount > 50,
        },
      };

      res.json({
        success: true,
        data: { analytics },
      });
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      res.status(500).json({
        error: 'Failed to fetch analytics',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

/**
 * PATCH /api/partner/products/bulk-update
 * Bulk update products (activate/deactivate, change category, etc.)
 */
router.patch(
  '/bulk-update',
  [
    body('productIds')
      .isArray({ min: 1 })
      .withMessage('Product IDs array required'),
    body('productIds.*')
      .isMongoId()
      .withMessage('All product IDs must be valid'),
    body('action')
      .isIn(['activate', 'deactivate', 'change-category'])
      .withMessage('Invalid bulk action'),
    body('category').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const partnerId = req.user?.id;
      const { productIds, action, category } = req.body;

      let updateData: any = {
        lastModifiedBy: partnerId,
        updatedAt: new Date(),
      };

      switch (action) {
        case 'activate':
          updateData.isActive = true;
          break;
        case 'deactivate':
          updateData.isActive = false;
          break;
        case 'change-category':
          if (!category) {
            return res
              .status(400)
              .json({
                error: 'Category is required for change-category action',
              });
          }
          updateData.category = category;
          break;
      }

      const result = await Product.updateMany(
        {
          _id: { $in: productIds },
          partnerId,
        },
        updateData
      );

      res.json({
        success: true,
        message: `Bulk ${action} completed`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      console.error('Error in bulk update:', error);
      res.status(500).json({
        error: 'Failed to perform bulk update',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

export default router;
