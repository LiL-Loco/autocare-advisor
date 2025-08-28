/**
 * Image Processing Queue Service - AutoCare Advisor
 *
 * Redis-backed queue system for bulk image processing
 * with job management, progress tracking, and error handling.
 */

import Bull, { Job, Queue } from 'bull';
import Redis from 'ioredis';
import logger from '../utils/logger';
import ImageService, {
  ImageMetadata,
  ImageUploadOptions,
} from './imageService';

export interface ImageProcessingJob {
  images: Array<{
    buffer: Buffer;
    originalName: string;
  }>;
  options: ImageUploadOptions;
  partnerId?: string;
  metadata?: any;
}

export interface SingleImageJob {
  buffer: Buffer;
  originalName: string;
  options: ImageUploadOptions;
}

export interface WebPConversionJob {
  imagePath: string;
  quality: number;
}

export interface BatchProcessingResult {
  jobId: string;
  totalImages: number;
  processedImages: ImageMetadata[];
  failedImages: Array<{
    originalName: string;
    error: string;
  }>;
  processingTime: number;
  status: 'completed' | 'failed' | 'processing';
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  totalProcessed: number;
}

export default class ImageProcessingQueue {
  private queue: Queue<ImageProcessingJob>;
  private imageService: ImageService;
  private redis: Redis;

  constructor() {
    // Initialize Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    // Initialize Bull queue
    this.queue = new Bull<ImageProcessingJob>('image processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 50, // Keep last 50 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.imageService = new ImageService();
    this.setupQueueProcessors();
    this.setupEventHandlers();
  }

  /**
   * Setup queue processors
   */
  private setupQueueProcessors(): void {
    // Single image processing
    this.queue.process('process-single-image', 5, async (job: Job<any>) => {
      const { buffer, originalName, options } = job.data;

      try {
        job.progress(10);

        const result = await this.imageService.processAndSaveImage(
          buffer,
          originalName,
          options
        );

        job.progress(100);
        return result;
      } catch (error: any) {
        logger.error('Single image processing failed', {
          originalName,
          error: error.message,
        });
        throw error;
      }
    });

    // Batch image processing
    this.queue.process(
      'process-batch-images',
      2,
      async (job: Job<ImageProcessingJob>) => {
        const { images, options, partnerId, metadata } = job.data;
        const startTime = Date.now();

        const result: BatchProcessingResult = {
          jobId: job.id as string,
          totalImages: images.length,
          processedImages: [],
          failedImages: [],
          processingTime: 0,
          status: 'processing',
        };

        try {
          logger.info('Starting batch image processing', {
            jobId: job.id,
            imageCount: images.length,
            partnerId,
          });

          for (let i = 0; i < images.length; i++) {
            const { buffer, originalName } = images[i];

            try {
              // Update progress
              const progress = Math.floor((i / images.length) * 100);
              job.progress(progress);

              // Process image
              const imageMetadata = await this.imageService.processAndSaveImage(
                buffer,
                originalName,
                options
              );

              result.processedImages.push(imageMetadata);

              logger.debug('Image processed in batch', {
                jobId: job.id,
                originalName,
                progress: `${i + 1}/${images.length}`,
              });
            } catch (error: any) {
              result.failedImages.push({
                originalName,
                error: error.message,
              });

              logger.error('Image failed in batch processing', {
                jobId: job.id,
                originalName,
                error: error.message,
              });
            }
          }

          result.processingTime = Date.now() - startTime;
          result.status =
            result.failedImages.length === images.length
              ? 'failed'
              : 'completed';

          job.progress(100);

          logger.info('Batch image processing completed', {
            jobId: job.id,
            processed: result.processedImages.length,
            failed: result.failedImages.length,
            processingTime: result.processingTime,
          });

          return result;
        } catch (error: any) {
          result.status = 'failed';
          result.processingTime = Date.now() - startTime;

          logger.error('Batch image processing failed', {
            jobId: job.id,
            error: error.message,
          });

          throw error;
        }
      }
    );

    // WebP conversion processing
    this.queue.process('convert-to-webp', 10, async (job: Job<any>) => {
      const { imagePath, quality = 80 } = job.data;

      try {
        await this.imageService.optimizeImage(imagePath, {
          format: 'webp',
          quality,
        });

        return { success: true, imagePath };
      } catch (error: any) {
        logger.error('WebP conversion failed', {
          imagePath,
          error: error.message,
        });
        throw error;
      }
    });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.queue.on('completed', (job: Job, result: any) => {
      logger.info('Image processing job completed', {
        jobId: job.id,
        jobType: job.name,
        processingTime: Date.now() - job.processedOn!,
      });
    });

    this.queue.on('failed', (job: Job, error: Error) => {
      logger.error('Image processing job failed', {
        jobId: job.id,
        jobType: job.name,
        error: error.message,
        attempts: job.attemptsMade,
      });
    });

    this.queue.on('stalled', (job: Job) => {
      logger.warn('Image processing job stalled', {
        jobId: job.id,
        jobType: job.name,
      });
    });
  }

  /**
   * Add single image to processing queue
   */
  async addSingleImageJob(
    buffer: Buffer,
    originalName: string,
    options: ImageUploadOptions = {}
  ): Promise<string> {
    const job = await this.queue.add(
      'process-single-image',
      {
        buffer,
        originalName,
        options,
      } as any,
      {
        priority: 10,
      }
    );

    logger.info('Single image job added to queue', {
      jobId: job.id,
      originalName,
    });

    return job.id as string;
  }

  /**
   * Add batch of images to processing queue
   */
  async addBatchImageJob(
    images: Array<{ buffer: Buffer; originalName: string }>,
    options: ImageUploadOptions = {},
    partnerId?: string,
    metadata?: any
  ): Promise<string> {
    const job = await this.queue.add(
      'process-batch-images',
      {
        images,
        options,
        partnerId,
        metadata,
      },
      {
        priority: 5,
      }
    );

    logger.info('Batch image job added to queue', {
      jobId: job.id,
      imageCount: images.length,
      partnerId,
    });

    return job.id as string;
  }

  /**
   * Add WebP conversion job
   */
  async addWebPConversionJob(
    imagePath: string,
    quality: number = 80
  ): Promise<string> {
    const job = await this.queue.add(
      'convert-to-webp',
      {
        imagePath,
        quality,
      } as any,
      {
        priority: 1,
      }
    );

    logger.info('WebP conversion job added to queue', {
      jobId: job.id,
      imagePath,
    });

    return job.id as string;
  }

  /**
   * Get job status and result
   */
  async getJobStatus(jobId: string): Promise<{
    status: string;
    progress: number;
    result?: any;
    error?: string;
  }> {
    try {
      const job = await this.queue.getJob(jobId);

      if (!job) {
        return { status: 'not_found', progress: 0 };
      }

      const state = await job.getState();
      const progress = job.progress();

      return {
        status: state,
        progress: typeof progress === 'number' ? progress : 0,
        result: job.returnvalue,
        error: job.failedReason,
      };
    } catch (error: any) {
      logger.error('Failed to get job status', { jobId, error: error.message });
      return { status: 'error', progress: 0, error: error.message };
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<QueueStats> {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.queue.getWaiting(),
        this.queue.getActive(),
        this.queue.getCompleted(),
        this.queue.getFailed(),
        this.queue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        totalProcessed: completed.length + failed.length,
      };
    } catch (error: any) {
      logger.error('Failed to get queue stats', { error: error.message });
      throw error;
    }
  }

  /**
   * Clean old jobs
   */
  async cleanOldJobs(): Promise<void> {
    try {
      await this.queue.clean(24 * 60 * 60 * 1000, 'completed'); // 24 hours
      await this.queue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // 7 days

      logger.info('Old jobs cleaned successfully');
    } catch (error: any) {
      logger.error('Failed to clean old jobs', { error: error.message });
    }
  }

  /**
   * Pause queue processing
   */
  async pauseQueue(): Promise<void> {
    await this.queue.pause();
    logger.info('Image processing queue paused');
  }

  /**
   * Resume queue processing
   */
  async resumeQueue(): Promise<void> {
    await this.queue.resume();
    logger.info('Image processing queue resumed');
  }

  /**
   * Close queue and Redis connections
   */
  async close(): Promise<void> {
    await this.queue.close();
    await this.redis.disconnect();
    logger.info('Image processing queue closed');
  }
}

// Create and export singleton instance
export const imageProcessingQueue = new ImageProcessingQueue();
