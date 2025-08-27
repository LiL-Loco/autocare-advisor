/**
 * Product Management API Routes Extension - AutoCare Advisor
 *
 * Additional routes for enhanced product management features:
 * - CSV Import Management
 * - Product Categories & Brands
 * - Product Analytics
 * - Bulk Operations
 */

import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import pool from '../database/postgres';
import logger from '../utils/logger';

// CSV Parser types (simplified without external dependency)
interface CSVRow {
  [key: string]: string;
}

interface ImportError {
  row: number;
  error: string;
  data: CSVRow;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  icon: string;
  color: string;
  meta_title: string;
  meta_description: string;
  children: Category[];
}

const router = express.Router();

// Configure multer for CSV uploads
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/csv/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'products-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const csvUpload = multer({
  storage: csvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

/**
 * @route   POST /api/products/import/csv
 * @desc    Upload and process CSV file for bulk product import
 * @access  Private (Partner only)
 */
router.post(
  '/import/csv',
  csvUpload.single('csvFile'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No CSV file uploaded',
        });
      }

      // Mock partner ID (in production, get from JWT token)
      const partnerId = req.body.partnerId || '64a123456789012345678901';

      // Create import job record
      const jobQuery = `
      INSERT INTO product_import_jobs 
      (partner_id, filename, original_filename, file_size, mime_type, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, filename
    `;

      const jobResult = await pool.query(jobQuery, [
        partnerId,
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        'pending',
      ]);

      const jobId = jobResult.rows[0].id;
      const filename = jobResult.rows[0].filename;

      // Start processing job asynchronously
      processCSVImport(jobId, req.file.path, partnerId).catch((error) => {
        logger.error('CSV import processing failed', {
          jobId,
          error: error.message,
        });
      });

      res.json({
        success: true,
        data: {
          jobId,
          filename: req.file.originalname,
          status: 'pending',
          message: 'CSV upload successful. Processing started.',
        },
      });
    } catch (error: any) {
      logger.error('CSV upload failed', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'CSV upload failed',
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/products/import/jobs
 * @desc    Get import job history for partner
 * @access  Private (Partner)
 */
router.get('/import/jobs', async (req: Request, res: Response) => {
  try {
    // Mock partner ID (in production, get from JWT token)
    const partnerId = req.query.partnerId || '64a123456789012345678901';
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      SELECT 
        id,
        original_filename,
        file_size,
        status,
        total_rows,
        processed_rows,
        successful_rows,
        failed_rows,
        error_details,
        started_at,
        completed_at,
        created_at
      FROM product_import_jobs 
      WHERE partner_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [partnerId, limit, offset]);

    // Get total count
    const countQuery =
      'SELECT COUNT(*) as total FROM product_import_jobs WHERE partner_id = $1';
    const countResult = await pool.query(countQuery, [partnerId]);

    res.json({
      success: true,
      data: {
        jobs: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit,
          offset,
          hasMore:
            offset + result.rows.length < parseInt(countResult.rows[0].total),
        },
      },
    });
  } catch (error: any) {
    logger.error('Failed to get import jobs', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve import jobs',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/import/jobs/:jobId
 * @desc    Get detailed import job status
 * @access  Private (Partner)
 */
router.get('/import/jobs/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const query = `
      SELECT * FROM product_import_jobs 
      WHERE id = $1
    `;

    const result = await pool.query(query, [jobId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Import job not found',
      });
    }

    res.json({
      success: true,
      data: { job: result.rows[0] },
    });
  } catch (error: any) {
    logger.error('Failed to get import job details', {
      error: error.message,
      jobId: req.params.jobId,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve import job details',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/categories
 * @desc    Get product categories with hierarchy
 * @access  Public
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';

    let query = `
      SELECT 
        id,
        name,
        slug,
        description,
        parent_id,
        is_active,
        sort_order,
        icon,
        color,
        meta_title,
        meta_description
      FROM product_categories
    `;

    const params: any[] = [];
    if (!includeInactive) {
      query += ' WHERE is_active = true';
    }

    query += ' ORDER BY sort_order ASC, name ASC';

    const result = await pool.query(query, params);

    // Build hierarchy
    const categories = result.rows;
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map
    categories.forEach((category: any) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach((category: any) => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id)!);
        }
      } else {
        rootCategories.push(categoryMap.get(category.id)!);
      }
    });

    res.json({
      success: true,
      data: {
        categories: rootCategories,
        totalCount: categories.length,
      },
    });
  } catch (error: any) {
    logger.error('Failed to get categories', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/brands
 * @desc    Get product brands
 * @access  Public
 */
router.get('/brands', async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const featured = req.query.featured === 'true';

    let query = `
      SELECT 
        id,
        name,
        slug,
        description,
        logo_url,
        website_url,
        is_active,
        is_featured,
        sort_order
      FROM product_brands
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (!includeInactive) {
      conditions.push('is_active = true');
    }

    if (featured) {
      conditions.push('is_featured = true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY sort_order ASC, name ASC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        brands: result.rows,
        totalCount: result.rows.length,
      },
    });
  } catch (error: any) {
    logger.error('Failed to get brands', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve brands',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/analytics/summary/:partnerId
 * @desc    Get product analytics summary for partner
 * @access  Private (Partner)
 */
router.get(
  '/analytics/summary/:partnerId',
  async (req: Request, res: Response) => {
    try {
      const { partnerId } = req.params;
      const days = parseInt(req.query.days as string) || 30;

      const query = `
      SELECT 
        COUNT(*) as total_products,
        SUM(total_views) as total_views,
        SUM(total_clicks) as total_clicks,
        AVG(avg_conversion_rate) as avg_conversion_rate,
        SUM(total_revenue_cents) as total_revenue_cents,
        AVG(performance_score) as avg_performance_score
      FROM product_performance_summary 
      WHERE partner_id = $1
    `;

      const result = await pool.query(query, [partnerId]);
      const summary = result.rows[0];

      // Get top performing products
      const topProductsQuery = `
      SELECT 
        product_id,
        total_views,
        total_clicks,
        avg_conversion_rate,
        total_revenue_cents,
        performance_score
      FROM product_performance_summary 
      WHERE partner_id = $1 
      ORDER BY performance_score DESC 
      LIMIT 10
    `;

      const topProductsResult = await pool.query(topProductsQuery, [partnerId]);

      res.json({
        success: true,
        data: {
          summary: {
            totalProducts: parseInt(summary.total_products) || 0,
            totalViews: parseInt(summary.total_views) || 0,
            totalClicks: parseInt(summary.total_clicks) || 0,
            avgConversionRate: parseFloat(summary.avg_conversion_rate) || 0,
            totalRevenue: (parseInt(summary.total_revenue_cents) || 0) / 100,
            avgPerformanceScore: parseInt(summary.avg_performance_score) || 0,
          },
          topProducts: topProductsResult.rows,
        },
      });
    } catch (error: any) {
      logger.error('Failed to get analytics summary', {
        error: error.message,
        partnerId: req.params.partnerId,
      });
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve analytics summary',
        message: error.message,
      });
    }
  }
);

/**
 * CSV Processing Function (Background Task)
 */
async function processCSVImport(
  jobId: string,
  filePath: string,
  partnerId: string
): Promise<void> {
  try {
    // Update job status to processing
    await pool.query(
      'UPDATE product_import_jobs SET status = $1, started_at = NOW() WHERE id = $2',
      ['processing', jobId]
    );

    const products: any[] = [];
    const errors: ImportError[] = [];
    let rowNumber = 0;

    // Simple CSV parsing (without external library for now)
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines

      rowNumber++;
      try {
        const values = lines[i]
          .split(',')
          .map((v) => v.trim().replace(/"/g, ''));
        const data: CSVRow = {};

        headers.forEach((header, index) => {
          data[header] = values[index] || '';
        });

        // Basic validation and transformation
        const product = {
          name: data.name || data.Name,
          description: data.description || data.Description,
          brand: data.brand || data.Brand,
          category: data.category || data.Category,
          price: parseFloat(data.price || data.Price) || 0,
          images: [data.image || data.Image || ''],
          partnerId,
          partnerShopName: data.shopName || 'AutoCare Partner',
          partnerShopUrl: data.shopUrl || '#',
          tier: 'basic',
          isActive: true,
          inStock: true,
        };

        // Validate required fields
        if (
          !product.name ||
          !product.description ||
          !product.brand ||
          product.price <= 0
        ) {
          errors.push({
            row: rowNumber,
            error: 'Missing required fields: name, description, brand, price',
            data,
          });
          continue;
        }

        products.push(product);
      } catch (error: any) {
        errors.push({
          row: rowNumber,
          error: error.message,
          data: {},
        });
      }
    }

    // Here would be the MongoDB product creation logic
    // For now, simulate the processing
    const successful = products.length;
    const failed = errors.length;

    // Update job with results
    await pool.query(
      `
      UPDATE product_import_jobs 
      SET status = $1, 
          total_rows = $2,
          processed_rows = $3,
          successful_rows = $4,
          failed_rows = $5,
          error_details = $6,
          completed_at = NOW()
      WHERE id = $7
    `,
      [
        'completed',
        rowNumber,
        rowNumber,
        successful,
        failed,
        JSON.stringify(errors),
        jobId,
      ]
    );

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    logger.info('CSV import completed', {
      jobId,
      totalRows: rowNumber,
      successful,
      failed,
    });
  } catch (error: any) {
    logger.error('CSV processing failed', { jobId, error: error.message });

    // Update job status to failed
    await pool.query(
      'UPDATE product_import_jobs SET status = $1, error_details = $2 WHERE id = $3',
      ['failed', JSON.stringify([{ error: error.message }]), jobId]
    );
  }
}

export default router;
