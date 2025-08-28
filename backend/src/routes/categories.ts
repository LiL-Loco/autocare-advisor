/**
 * Category Management API Routes - AutoCare Advisor
 *
 * RESTful API for category and product categorization management
 * with support for hierarchical navigation and SEO optimization.
 *
 * Routes:
 * - Category CRUD Operations
 * - Product Categorization
 * - SEO-friendly Category Navigation
 * - Category Tree Structure
 */

import express, { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import logger from '../utils/logger';

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories with optional filtering
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      includeSubcategories = 'true',
      onlyMain = 'false',
      onlyFeatured = 'false',
      includeProductCount = 'true',
    } = req.query;

    let query;

    if (onlyFeatured === 'true') {
      query = Category.find({
        isFeatured: true,
        isActive: true,
        isVisible: true,
      })
        .sort({ displayOrder: 1 })
        .limit(6);
    } else if (onlyMain === 'true') {
      query = Category.find({
        parentCategory: { $exists: false },
        isActive: true,
        isVisible: true,
      })
        .sort({ displayOrder: 1, name: 1 })
        .limit(20);
    } else {
      query = Category.find({
        isActive: true,
        isVisible: true,
      }).sort({ displayOrder: 1, name: 1 });

      if (includeSubcategories === 'true') {
        query = query.populate('subcategories');
      }
    }

    const categories = await query;

    // Add product counts if requested
    let categoriesWithCounts = categories;
    if (includeProductCount === 'true') {
      categoriesWithCounts = await Promise.all(
        categories.map(async (category: any) => {
          const productCount = await Product.countDocuments({
            category: category.name,
            isActive: true,
          });
          return {
            ...(category.toObject ? category.toObject() : category),
            productCount,
          };
        })
      );
    }

    res.json({
      success: true,
      data: {
        categories: categoriesWithCounts,
        total: categoriesWithCounts.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        filters: {
          includeSubcategories: includeSubcategories === 'true',
          onlyMain: onlyMain === 'true',
          onlyFeatured: onlyFeatured === 'true',
        },
      },
    });
  } catch (error: any) {
    logger.error('Failed to fetch categories', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/categories/tree
 * @desc    Get complete category tree structure
 * @access  Public
 */
router.get('/tree', async (req: Request, res: Response) => {
  try {
    const mainCategories = await Category.find({
      parentCategory: { $exists: false },
      isActive: true,
      isVisible: true,
    })
      .sort({ displayOrder: 1 })
      .populate('subcategories')
      .lean();

    const categoryTree = mainCategories.map((category: any) => ({
      ...category,
      subcategories: category.subcategories.filter(
        (sub: any) => sub.isActive && sub.isVisible
      ),
    }));

    res.json({
      success: true,
      data: {
        categoryTree,
        totalCategories: categoryTree.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        description: 'Complete hierarchical category structure',
      },
    });
  } catch (error: any) {
    logger.error('Failed to fetch category tree', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category tree',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/categories/:slug
 * @desc    Get category by slug with products
 * @access  Public
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const {
      includeProducts = 'true',
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query;

    const category = await Category.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
      isVisible: true,
    }).populate('subcategories');

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category with slug '${slug}' does not exist`,
      });
    }

    let responseData: any = {
      category: category.toObject(),
    };

    // Include products if requested
    if (includeProducts === 'true') {
      const productQuery = Product.find({
        category: category.name,
        isActive: true,
        inStock: true,
      });

      // Apply sorting
      const sortOptions: any = {};
      sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
      productQuery.sort(sortOptions);

      // Apply pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [products, totalProducts] = await Promise.all([
        productQuery.skip(skip).limit(limitNum).lean(),
        Product.countDocuments({
          category: category.name,
          isActive: true,
          inStock: true,
        }),
      ]);

      responseData.products = products;
      responseData.pagination = {
        page: pageNum,
        limit: limitNum,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNum),
        hasNext: pageNum * limitNum < totalProducts,
        hasPrev: pageNum > 1,
      };
    }

    // Add breadcrumb (simple version)
    const breadcrumb = [{ name: category.name, slug: category.slug }];
    if (category.parentCategory) {
      const parent = await Category.findById(category.parentCategory);
      if (parent) {
        breadcrumb.unshift({ name: parent.name, slug: parent.slug });
      }
    }
    responseData.breadcrumb = breadcrumb;

    res.json({
      success: true,
      data: responseData,
      meta: {
        timestamp: new Date().toISOString(),
        slug,
      },
    });
  } catch (error: any) {
    logger.error('Failed to fetch category by slug', {
      slug: req.params.slug,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/categories
 * @desc    Create new category (Admin/Partner)
 * @access  Private
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const categoryData = {
      ...req.body,
      createdBy: req.body.createdBy || 'system',
      lastModifiedBy: req.body.createdBy || 'system',
    };

    // Validate required fields
    const requiredFields = ['name', 'description'];
    const missingFields = requiredFields.filter(
      (field) => !categoryData[field]
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: { missingFields },
      });
    }

    // Auto-generate SEO fields if not provided
    if (!categoryData.seoMeta) {
      categoryData.seoMeta = {
        title: `${categoryData.name} - AutoCare Advisor`,
        description: categoryData.description.substring(0, 160),
        keywords: [categoryData.name.toLowerCase()],
      };
    }

    const category = new Category(categoryData);
    await category.save();

    logger.info('Category created successfully', {
      categoryId: category._id,
      name: category.name,
      slug: category.slug,
    });

    res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created successfully',
    });
  } catch (error: any) {
    logger.error('Category creation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Category creation failed',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update existing category
 * @access  Private
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.body.updatedBy || 'system',
      updatedAt: new Date(),
    };

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    logger.info('Category updated successfully', {
      categoryId: id,
      name: category.name,
    });

    res.json({
      success: true,
      data: { category },
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    logger.error('Category update failed', {
      categoryId: req.params.id,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Category update failed',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category (soft delete)
 * @access  Private
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await Product.countDocuments({
      category: { $regex: new RegExp(req.params.id, 'i') },
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with products',
        message: `Category has ${productCount} products assigned`,
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        isActive: false,
        isVisible: false,
        lastModifiedBy: req.body.deletedBy || 'system',
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    logger.info('Category deleted successfully', {
      categoryId: id,
      name: category.name,
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    logger.error('Category deletion failed', {
      categoryId: req.params.id,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Category deletion failed',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/categories/seed
 * @desc    Seed default categories (Development/Admin)
 * @access  Private
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const { seedCategories } = await import('../models/Category');
    await seedCategories();

    logger.info('Categories seeded successfully');

    res.json({
      success: true,
      message: 'Categories seeded successfully',
    });
  } catch (error: any) {
    logger.error('Category seeding failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Category seeding failed',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/categories/update-product-counts
 * @desc    Update product counts for all categories
 * @access  Private
 */
router.post('/update-product-counts', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true });

    const updatePromises = categories.map(async (category) => {
      const productCount = await Product.countDocuments({
        category: category.name,
        isActive: true,
      });
      return Category.findByIdAndUpdate(category._id, { productCount });
    });

    await Promise.all(updatePromises);

    logger.info('Product counts updated for all categories');

    res.json({
      success: true,
      message: `Product counts updated for ${categories.length} categories`,
    });
  } catch (error: any) {
    logger.error('Product count update failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Product count update failed',
      message: error.message,
    });
  }
});

export default router;
