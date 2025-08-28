/**
 * Image Service - AutoCare Advisor
 *
 * Comprehensive image management service for product images
 * with upload, validation, thumbnail generation, and storage management.
 *
 * Features:
 * - File Upload & Validation
 * - Thumbnail Generation
 * - Multiple Image Support
 * - Cloud Storage Integration
 * - Image Optimization
 * - Metadata Extraction
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
  generateThumbnails?: boolean;
  generateWebP?: boolean;
  webpQuality?: number;
  thumbnailSizes?: Array<{ width: number; height: number; suffix: string }>;
}

export interface ImageMetadata {
  originalName: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  webpUrl?: string;
  webpFilename?: string;
  webpSize?: number;
  thumbnails?: Array<{
    filename: string;
    path: string;
    url: string;
    dimensions: { width: number; height: number };
    suffix: string;
    webpUrl?: string;
    webpFilename?: string;
  }>;
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export default class ImageService {
  private uploadDir: string;
  private baseUrl: string;
  private allowedFormats: string[] = ['image/jpeg', 'image/png', 'image/webp'];
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private defaultThumbnailSizes = [
    { width: 150, height: 150, suffix: 'thumb' },
    { width: 300, height: 300, suffix: 'small' },
    { width: 600, height: 600, suffix: 'medium' },
  ];

  constructor() {
    this.uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'products');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5001';
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await stat(this.uploadDir);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await mkdir(this.uploadDir, { recursive: true });
        logger.info('Created upload directory', { path: this.uploadDir });
      }
    }
  }

  /**
   * Validate image file before processing
   */
  async validateImage(
    buffer: Buffer,
    originalName: string
  ): Promise<ImageValidationResult> {
    const result: ImageValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Check file size
    if (buffer.length > this.maxFileSize) {
      result.isValid = false;
      result.errors.push(
        `File size ${(buffer.length / 1024 / 1024).toFixed(
          2
        )}MB exceeds maximum allowed size of ${
          this.maxFileSize / 1024 / 1024
        }MB`
      );
    }

    // Check file extension
    const ext = path.extname(originalName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(ext)) {
      result.isValid = false;
      result.errors.push(
        `File extension ${ext} is not allowed. Allowed: ${allowedExtensions.join(
          ', '
        )}`
      );
    }

    try {
      // Validate image with sharp
      const metadata = await sharp(buffer).metadata();

      if (!metadata.width || !metadata.height) {
        result.isValid = false;
        result.errors.push('Invalid image: Unable to determine dimensions');
        return result;
      }

      // Check dimensions
      if (metadata.width > 4000 || metadata.height > 4000) {
        result.warnings.push(
          `Large image dimensions ${metadata.width}x${metadata.height}. Consider resizing for better performance.`
        );
      }

      if (metadata.width < 200 || metadata.height < 200) {
        result.warnings.push(
          `Small image dimensions ${metadata.width}x${metadata.height}. May not look good in product displays.`
        );
      }
    } catch (error: any) {
      result.isValid = false;
      result.errors.push(`Invalid image file: ${error.message}`);
    }

    return result;
  }

  /**
   * Process and save image with optional thumbnails
   */
  async processAndSaveImage(
    buffer: Buffer,
    originalName: string,
    options: ImageUploadOptions = {}
  ): Promise<ImageMetadata> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 85,
      format = 'jpeg',
      generateThumbnails = true,
      generateWebP = true,
      webpQuality = 80,
      thumbnailSizes = this.defaultThumbnailSizes,
    } = options;

    // Validate image first
    const validation = await this.validateImage(buffer, originalName);
    if (!validation.isValid) {
      throw new Error(
        `Image validation failed: ${validation.errors.join(', ')}`
      );
    }

    const fileId = uuidv4();
    const filename = `${fileId}.${format}`;
    const filepath = path.join(this.uploadDir, filename);
    const url = `${this.baseUrl}/uploads/products/${filename}`;

    try {
      // Process main image
      const processedImage = sharp(buffer);
      const metadata = await processedImage.metadata();

      // Resize if necessary
      if (metadata.width! > maxWidth || metadata.height! > maxHeight) {
        processedImage.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert format and apply quality
      switch (format) {
        case 'jpeg':
          processedImage.jpeg({ quality });
          break;
        case 'webp':
          processedImage.webp({ quality });
          break;
        case 'png':
          processedImage.png({ compressionLevel: 9 });
          break;
      }

      // Save main image
      const processedBuffer = await processedImage.toBuffer();
      await writeFile(filepath, processedBuffer);

      // Get final metadata
      const finalMetadata = await sharp(processedBuffer).metadata();

      const imageMetadata: ImageMetadata = {
        originalName,
        filename,
        path: filepath,
        url,
        size: processedBuffer.length,
        dimensions: {
          width: finalMetadata.width!,
          height: finalMetadata.height!,
        },
        format,
        thumbnails: [],
      };

      // Generate thumbnails if requested
      if (generateThumbnails && thumbnailSizes.length > 0) {
        imageMetadata.thumbnails = await this.generateThumbnails(
          processedBuffer,
          fileId,
          format,
          thumbnailSizes,
          generateWebP,
          webpQuality
        );
      }

      // Generate WebP version if requested and format is not already WebP
      if (generateWebP && format !== 'webp') {
        const webpMetadata = await this.generateWebPVersion(
          processedBuffer,
          fileId,
          webpQuality
        );
        imageMetadata.webpUrl = webpMetadata.url;
        imageMetadata.webpFilename = webpMetadata.filename;
        imageMetadata.webpSize = webpMetadata.size;
      }

      logger.info('Image processed and saved', {
        originalName,
        filename,
        size: imageMetadata.size,
        dimensions: imageMetadata.dimensions,
        thumbnailCount: imageMetadata.thumbnails?.length || 0,
      });

      return imageMetadata;
    } catch (error: any) {
      logger.error('Failed to process image', {
        error: error.message,
        originalName,
      });
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Generate thumbnails for an image
   */
  private async generateThumbnails(
    imageBuffer: Buffer,
    fileId: string,
    format: string,
    sizes: Array<{ width: number; height: number; suffix: string }>,
    generateWebP: boolean = false,
    webpQuality: number = 80
  ): Promise<ImageMetadata['thumbnails']> {
    const thumbnails: ImageMetadata['thumbnails'] = [];

    for (const size of sizes) {
      try {
        const thumbnailFilename = `${fileId}_${size.suffix}.${format}`;
        const thumbnailPath = path.join(this.uploadDir, thumbnailFilename);
        const thumbnailUrl = `${this.baseUrl}/uploads/products/${thumbnailFilename}`;

        let thumbnail = sharp(imageBuffer).resize(size.width, size.height, {
          fit: 'cover',
          position: 'center',
        });

        // Apply format-specific settings
        switch (format) {
          case 'jpeg':
            thumbnail = thumbnail.jpeg({ quality: 80 });
            break;
          case 'webp':
            thumbnail = thumbnail.webp({ quality: 80 });
            break;
          case 'png':
            thumbnail = thumbnail.png({ compressionLevel: 9 });
            break;
        }

        const thumbnailBuffer = await thumbnail.toBuffer();
        await writeFile(thumbnailPath, thumbnailBuffer);

        const thumbnailData: any = {
          filename: thumbnailFilename,
          path: thumbnailPath,
          url: thumbnailUrl,
          dimensions: size,
          suffix: size.suffix,
        };

        // Generate WebP version of thumbnail if requested
        if (generateWebP && format !== 'webp') {
          const webpThumbnailFilename = `${fileId}_${size.suffix}.webp`;
          const webpThumbnailPath = path.join(
            this.uploadDir,
            webpThumbnailFilename
          );
          const webpThumbnailUrl = `${this.baseUrl}/uploads/products/${webpThumbnailFilename}`;

          const webpThumbnail = sharp(imageBuffer)
            .resize(size.width, size.height, {
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: webpQuality });

          const webpThumbnailBuffer = await webpThumbnail.toBuffer();
          await writeFile(webpThumbnailPath, webpThumbnailBuffer);

          thumbnailData.webpUrl = webpThumbnailUrl;
          thumbnailData.webpFilename = webpThumbnailFilename;
        }

        thumbnails!.push(thumbnailData);
      } catch (error: any) {
        logger.error('Failed to generate thumbnail', {
          error: error.message,
          size: size.suffix,
        });
      }
    }

    return thumbnails;
  }

  /**
   * Generate WebP version of an image
   */
  private async generateWebPVersion(
    imageBuffer: Buffer,
    fileId: string,
    quality: number = 80
  ): Promise<{ filename: string; url: string; size: number }> {
    const webpFilename = `${fileId}.webp`;
    const webpPath = path.join(this.uploadDir, webpFilename);
    const webpUrl = `${this.baseUrl}/uploads/products/${webpFilename}`;

    const webpBuffer = await sharp(imageBuffer).webp({ quality }).toBuffer();

    await writeFile(webpPath, webpBuffer);

    return {
      filename: webpFilename,
      url: webpUrl,
      size: webpBuffer.length,
    };
  }

  /**
   * Delete image and its thumbnails
   */
  async deleteImage(imageMetadata: ImageMetadata): Promise<void> {
    try {
      // Delete main image
      await unlink(imageMetadata.path);

      // Delete thumbnails
      if (imageMetadata.thumbnails) {
        for (const thumbnail of imageMetadata.thumbnails) {
          try {
            await unlink(thumbnail.path);
          } catch (error: any) {
            logger.warn('Failed to delete thumbnail', {
              path: thumbnail.path,
              error: error.message,
            });
          }
        }
      }

      logger.info('Image deleted', { filename: imageMetadata.filename });
    } catch (error: any) {
      logger.error('Failed to delete image', {
        filename: imageMetadata.filename,
        error: error.message,
      });
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Process multiple images
   */
  async processMultipleImages(
    files: Array<{ buffer: Buffer; originalName: string }>,
    options: ImageUploadOptions = {}
  ): Promise<ImageMetadata[]> {
    const results: ImageMetadata[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const metadata = await this.processAndSaveImage(
          file.buffer,
          file.originalName,
          options
        );
        results.push(metadata);
      } catch (error: any) {
        errors.push(`${file.originalName}: ${error.message}`);
      }
    }

    if (errors.length > 0 && results.length === 0) {
      throw new Error(`All image uploads failed: ${errors.join('; ')}`);
    }

    if (errors.length > 0) {
      logger.warn('Some images failed to process', {
        errors,
        successCount: results.length,
      });
    }

    return results;
  }

  /**
   * Get image information without processing
   */
  async getImageInfo(buffer: Buffer): Promise<{
    dimensions: { width: number; height: number };
    format: string;
    size: number;
  }> {
    const metadata = await sharp(buffer).metadata();
    return {
      dimensions: {
        width: metadata.width!,
        height: metadata.height!,
      },
      format: metadata.format!,
      size: buffer.length,
    };
  }

  /**
   * Optimize existing image
   */
  async optimizeImage(
    imagePath: string,
    options: ImageUploadOptions = {}
  ): Promise<void> {
    const { quality = 85, format = 'jpeg' } = options;

    try {
      const buffer = await sharp(imagePath).jpeg({ quality }).toBuffer();

      await writeFile(imagePath, buffer);
      logger.info('Image optimized', { path: imagePath });
    } catch (error: any) {
      logger.error('Failed to optimize image', {
        path: imagePath,
        error: error.message,
      });
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }
}
