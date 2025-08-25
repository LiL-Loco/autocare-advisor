/**
 * MongoDB Connection - AutoCare Advisor
 *
 * MongoDB setup for product catalog and recommendation engine
 * with proper error handling and connection management.
 */

import mongoose from 'mongoose';
import logger from '../utils/logger';

// MongoDB connection configuration
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/autocare_products';
const MONGODB_OPTIONS = {
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds

  // Retry settings
  retryWrites: true,
  retryReads: true,

  // Index settings
  autoIndex: process.env.NODE_ENV !== 'production',
};

class MongoDBConnection {
  private isConnected: boolean = false;
  private connectionPromise: Promise<typeof mongoose> | null = null;

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<typeof mongoose> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  /**
   * Establish MongoDB connection with proper error handling
   */
  private async establishConnection(): Promise<typeof mongoose> {
    try {
      logger.info('Connecting to MongoDB...', {
        uri: MONGODB_URI.replace(/:[^:]*@/, ':****@'),
      });

      const connection = await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);

      // Connection event handlers
      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
        this.isConnected = true;
      });

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      // Graceful shutdown handling
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

      // Validate connection
      await this.validateConnection();

      return connection;
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      this.connectionPromise = null;
      throw error;
    }
  }

  /**
   * Validate MongoDB connection and create indexes
   */
  private async validateConnection(): Promise<void> {
    try {
      // Test basic connectivity
      await mongoose.connection.db.admin().ping();
      logger.info('MongoDB connectivity verified');

      // Create indexes for better performance
      await this.createIndexes();

      logger.info('MongoDB setup completed successfully');
    } catch (error) {
      logger.error('MongoDB validation failed:', error);
      throw error;
    }
  }

  /**
   * Create additional indexes for performance
   */
  private async createIndexes(): Promise<void> {
    try {
      const db = mongoose.connection.db;

      // Product collection indexes (additional to schema indexes)
      const productsCollection = db.collection('products');

      // Compound index for recommendation queries
      await productsCollection.createIndex(
        {
          isActive: 1,
          inStock: 1,
          'suitableFor.vehicleBrands': 1,
          tier: 1,
        },
        {
          name: 'idx_recommendation_base',
          background: true,
        }
      );

      // Performance index for partner queries
      await productsCollection.createIndex(
        {
          partnerId: 1,
          isActive: 1,
          createdAt: -1,
        },
        {
          name: 'idx_partner_products',
          background: true,
        }
      );

      // Analytics index
      await productsCollection.createIndex(
        {
          viewCount: -1,
          clickCount: -1,
          rating: -1,
        },
        {
          name: 'idx_product_analytics',
          background: true,
        }
      );

      logger.info('MongoDB indexes created successfully');
    } catch (error) {
      logger.error('Failed to create MongoDB indexes:', error);
      // Don't throw error as indexes are not critical for basic functionality
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isConnected || mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected successfully');
      }

      this.isConnected = false;
      this.connectionPromise = null;
    } catch (error) {
      logger.error('Error during MongoDB disconnect:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    isConnected: boolean;
    readyState: number;
    readyStateName: string;
    host?: string;
    port?: number;
    name?: string;
  } {
    const readyStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateName:
        readyStates[
          mongoose.connection.readyState as keyof typeof readyStates
        ] || 'unknown',
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }

  /**
   * Health check for MongoDB connection
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      if (!this.isConnected || mongoose.connection.readyState !== 1) {
        return {
          status: 'unhealthy',
          latency: 0,
          error: 'Not connected to MongoDB',
        };
      }

      // Ping database
      await mongoose.connection.db.admin().ping();

      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;

      return {
        status: 'unhealthy',
        latency,
        error: error.message,
      };
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to MongoDB');
      }

      const stats = await mongoose.connection.db.stats();
      return stats;
    } catch (error) {
      logger.error('Failed to get database stats:', error);
      throw error;
    }
  }

  /**
   * Graceful shutdown handler
   */
  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}, closing MongoDB connection...`);

    try {
      await this.disconnect();
      logger.info('MongoDB connection closed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

// Export singleton instance
export const mongoConnection = new MongoDBConnection();

/**
 * Initialize MongoDB connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await mongoConnection.connect();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

/**
 * Utility function to check if MongoDB is ready
 */
export const isDatabaseReady = (): boolean => {
  return mongoConnection.getConnectionStatus().isConnected;
};

export default mongoConnection;
