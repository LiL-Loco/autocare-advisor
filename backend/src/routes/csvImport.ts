/**
 * CSV Import Routes - AutoCare Advisor
 *
 * Handles CSV file uploads and bulk product imports
 * with progress tracking and error reporting.
 */

import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import CSVImportService, { ImportProgress } from '../services/csvImportService';
import logger from '../utils/logger';

const router = Router();

// Configure multer for CSV file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const csvImportService = new CSVImportService();

// Store active imports for progress tracking
const activeImports = new Map<string, ImportProgress>();

/**
 * POST /api/csv-import/upload
 * Upload and process CSV file
 */
router.post(
  '/upload',
  requireAuth,
  upload.single('csvFile'),
  async (req, res) => {
    try {
      const { partnerId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No CSV file uploaded',
        });
      }

      if (!partnerId) {
        return res.status(400).json({
          success: false,
          message: 'Partner ID is required',
        });
      }

      const importId = `import_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      logger.info('Starting CSV import', {
        importId,
        partnerId,
        filename: req.file.originalname,
        fileSize: req.file.size,
      });

      // Start import in background
      setImmediate(async () => {
        try {
          const result = await csvImportService.importFromCSV(
            req.file!.buffer,
            partnerId,
            (progress) => {
              activeImports.set(importId, progress);
            }
          );

          // Clear progress after completion
          setTimeout(() => {
            activeImports.delete(importId);
          }, 300000); // Keep for 5 minutes

          logger.info('CSV import completed', {
            importId,
            totalRows: result.totalRows,
            successCount: result.successCount,
            errorCount: result.errorCount,
          });
        } catch (error: any) {
          logger.error('CSV import failed', {
            importId,
            error: error.message,
          });

          activeImports.set(importId, {
            processed: 0,
            total: 0,
            percentage: 0,
            errors: [{ row: 0, error: error.message }],
          });
        }
      });

      res.json({
        success: true,
        message: 'CSV import started',
        data: {
          importId,
          filename: req.file.originalname,
          fileSize: req.file.size,
        },
      });
    } catch (error: any) {
      logger.error('CSV upload failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to start CSV import',
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/csv-import/progress/:importId
 * Get import progress
 */
router.get('/progress/:importId', requireAuth, async (req, res) => {
  try {
    const { importId } = req.params;
    const progress = activeImports.get(importId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Import not found or completed',
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    logger.error('Failed to get import progress', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get import progress',
      error: error.message,
    });
  }
});

/**
 * POST /api/csv-import/validate
 * Validate CSV file format without importing
 */
router.post(
  '/validate',
  requireAuth,
  upload.single('csvFile'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No CSV file uploaded',
        });
      }

      const validation = csvImportService.validateCSVFormat(req.file.buffer);

      res.json({
        success: true,
        data: {
          isValid: validation.isValid,
          errors: validation.errors,
          requiredHeaders: validation.requiredHeaders,
          foundHeaders: validation.foundHeaders,
          filename: req.file.originalname,
          fileSize: req.file.size,
        },
      });
    } catch (error: any) {
      logger.error('CSV validation failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to validate CSV file',
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/csv-import/sample
 * Download sample CSV template
 */
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const sampleCSV = await csvImportService.generateSampleCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="product-import-template.csv"'
    );
    res.send(sampleCSV);
  } catch (error: any) {
    logger.error('Failed to generate sample CSV', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to generate sample CSV',
      error: error.message,
    });
  }
});

/**
 * GET /api/csv-import/template-info
 * Get CSV template information
 */
router.get('/template-info', requireAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        requiredColumns: [
          'name',
          'brand',
          'category',
          'price',
          'partner_shop_name',
        ],
        optionalColumns: [
          'description',
          'image_urls',
          'availability',
          'partner_shop_url',
          'specifications',
          'tags',
        ],
        validCategories: [
          'exterior_care',
          'interior_care',
          'engine_care',
          'tire_care',
          'glass_care',
          'detailing_tools',
          'accessories',
          'other',
        ],
        validAvailability: [
          'available',
          'out_of_stock',
          'limited_stock',
          'discontinued',
        ],
        examples: {
          specifications:
            'type:liquid;coverage:10 sq meters;durability:6 months',
          image_urls:
            'https://example.com/img1.jpg,https://example.com/img2.jpg',
          tags: 'wax,shine,protection,carnauba',
          price: '29.99 or €29.99 or $29.99',
        },
        tips: [
          'Use semicolons to separate key:value pairs in specifications',
          'Use commas to separate multiple image URLs',
          'Use commas to separate tags',
          'Price can include currency symbols (€, $) which will be removed',
          'Category must be one of the predefined valid categories',
        ],
      },
    });
  } catch (error: any) {
    logger.error('Failed to get template info', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get template information',
      error: error.message,
    });
  }
});

export default router;
