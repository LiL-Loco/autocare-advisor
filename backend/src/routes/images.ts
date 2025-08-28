/**
 * Image Upload Routes - AutoCare Advisor
 *
 * Handles image uploads for products with validation,
 * thumbnail generation, and storage management.
 */

import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middleware/auth';
import ImageService from '../services/imageService';
import logger from '../utils/logger';

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File type ${
            file.mimetype
          } is not allowed. Allowed types: ${allowedTypes.join(', ')}`
        )
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10, // Maximum 10 files per upload
  },
});

const imageService = new ImageService();

/**
 * POST /api/images/upload
 * Upload single image
 */
router.post(
  '/upload',
  requireAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      const options = {
        maxWidth: parseInt(req.body.maxWidth) || 1200,
        maxHeight: parseInt(req.body.maxHeight) || 1200,
        quality: parseInt(req.body.quality) || 85,
        format: req.body.format || 'jpeg',
        generateThumbnails: req.body.generateThumbnails !== 'false',
      };

      logger.info('Processing single image upload', {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      const imageMetadata = await imageService.processAndSaveImage(
        req.file.buffer,
        req.file.originalname,
        options
      );

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: imageMetadata,
      });
    } catch (error: any) {
      logger.error('Image upload failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message,
      });
    }
  }
);

/**
 * POST /api/images/upload-multiple
 * Upload multiple images
 */
router.post(
  '/upload-multiple',
  requireAuth,
  upload.array('images', 10),
  async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided',
        });
      }

      const options = {
        maxWidth: parseInt(req.body.maxWidth) || 1200,
        maxHeight: parseInt(req.body.maxHeight) || 1200,
        quality: parseInt(req.body.quality) || 85,
        format: req.body.format || 'jpeg',
        generateThumbnails: req.body.generateThumbnails !== 'false',
      };

      logger.info('Processing multiple image upload', {
        fileCount: req.files.length,
        totalSize: req.files.reduce((sum, file) => sum + file.size, 0),
      });

      const files = req.files.map((file) => ({
        buffer: file.buffer,
        originalName: file.originalname,
      }));

      const imageMetadataArray = await imageService.processMultipleImages(
        files,
        options
      );

      res.json({
        success: true,
        message: `Successfully uploaded ${imageMetadataArray.length} images`,
        data: {
          images: imageMetadataArray,
          totalCount: imageMetadataArray.length,
          failedCount: files.length - imageMetadataArray.length,
        },
      });
    } catch (error: any) {
      logger.error('Multiple image upload failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message,
      });
    }
  }
);

/**
 * POST /api/images/validate
 * Validate image without uploading
 */
router.post(
  '/validate',
  requireAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      const validation = await imageService.validateImage(
        req.file.buffer,
        req.file.originalname
      );
      const imageInfo = await imageService.getImageInfo(req.file.buffer);

      res.json({
        success: true,
        data: {
          validation,
          imageInfo,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error: any) {
      logger.error('Image validation failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to validate image',
        error: error.message,
      });
    }
  }
);

/**
 * DELETE /api/images/:filename
 * Delete image and its thumbnails
 */
router.delete('/:filename', requireAuth, async (req, res) => {
  try {
    const { filename } = req.params;

    // Construct image metadata for deletion
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'products');
    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';

    const imagePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Create metadata object for deletion
    const imageMetadata = {
      filename,
      path: imagePath,
      url: `${baseUrl}/uploads/products/${filename}`,
      // Find thumbnails
      thumbnails: findImageThumbnails(filename, uploadDir, baseUrl),
    };

    await imageService.deleteImage(imageMetadata as any);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    logger.error('Image deletion failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
});

/**
 * GET /api/images/info/:filename
 * Get image information
 */
router.get('/info/:filename', requireAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'products');
    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
    const imagePath = path.join(uploadDir, filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const buffer = fs.readFileSync(imagePath);
    const imageInfo = await imageService.getImageInfo(buffer);
    const stats = fs.statSync(imagePath);

    res.json({
      success: true,
      data: {
        filename,
        url: `${baseUrl}/uploads/products/${filename}`,
        fileSize: stats.size,
        lastModified: stats.mtime,
        ...imageInfo,
        thumbnails: findImageThumbnails(filename, uploadDir, baseUrl),
      },
    });
  } catch (error: any) {
    logger.error('Failed to get image info', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get image information',
      error: error.message,
    });
  }
});

/**
 * POST /api/images/optimize/:filename
 * Optimize existing image
 */
router.post('/optimize/:filename', requireAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'products');
    const imagePath = path.join(uploadDir, filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const options = {
      quality: parseInt(req.body.quality) || 85,
      format: req.body.format || 'jpeg',
    };

    await imageService.optimizeImage(imagePath, options);

    res.json({
      success: true,
      message: 'Image optimized successfully',
    });
  } catch (error: any) {
    logger.error('Image optimization failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to optimize image',
      error: error.message,
    });
  }
});

/**
 * Helper function to find thumbnails for an image
 */
function findImageThumbnails(
  filename: string,
  uploadDir: string,
  baseUrl: string
) {
  const fileBaseName = path.parse(filename).name;
  const fileExt = path.parse(filename).ext;
  const thumbnailSuffixes = ['thumb', 'small', 'medium'];

  const thumbnails = [];

  for (const suffix of thumbnailSuffixes) {
    const thumbnailFilename = `${fileBaseName}_${suffix}${fileExt}`;
    const thumbnailPath = path.join(uploadDir, thumbnailFilename);

    if (fs.existsSync(thumbnailPath)) {
      const stats = fs.statSync(thumbnailPath);
      thumbnails.push({
        filename: thumbnailFilename,
        path: thumbnailPath,
        url: `${baseUrl}/uploads/products/${thumbnailFilename}`,
        suffix,
        size: stats.size,
      });
    }
  }

  return thumbnails;
}

export default router;
