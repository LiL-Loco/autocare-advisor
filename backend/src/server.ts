import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import routes
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import { initializeBillingRoutes } from './routes/billing';
import healthRouter from './routes/health';
import invitationsRouter from './routes/invitations';
import partnerAnalyticsRouter from './routes/partnerAnalytics';
import partnersRouter from './routes/partners';
import productsRouter from './routes/products';
import recommendationsRouter from './routes/recommendations';

// Import middleware
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

// Import database connections
import { initializeDatabase } from './database/mongodb';
import billingPool from './database/postgres';
import { seedTestProducts } from './scripts/seedTestProducts';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for accurate IP addresses (for auth system)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/billing', initializeBillingRoutes(billingPool));
app.use('/api/admin', adminRouter);
app.use('/api/invitations', invitationsRouter);
app.use('/api/products', productsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/partners/analytics', partnerAnalyticsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚗 AutoCare Advisor API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      billing: '/api/billing',
      admin: '/api/admin',
      invitations: '/api/invitations',
      products: '/api/products',
      recommendations: '/api/recommendations',
      partners: '/api/partners',
      partnerAnalytics: '/api/partners/analytics',
    },
    features: {
      authentication: 'JWT-based with PostgreSQL',
      userManagement: 'Role-based access control',
      sessions: 'Refresh token with session tracking',
      security: 'bcrypt password hashing, token expiration',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize databases and start server
async function startServer() {
  try {
    // Initialize MongoDB connection
    logger.info('🗄️ Initializing MongoDB connection...');
    await initializeDatabase();
    logger.info('✅ MongoDB connected successfully');

    // Reset database and seed test data in development
    if (process.env.NODE_ENV !== 'production') {
      logger.info('🗄️ Resetting database for development...');
      const { default: resetDatabase } = await import(
        './scripts/resetDatabase'
      );
      await resetDatabase();
      logger.info('✅ Database reset completed');

      logger.info('🌱 Seeding test products...');
      await seedTestProducts();
      logger.info('✅ Test products seeded successfully');
    }

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 AutoCare Advisor Backend running on port ${PORT}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📡 API available at: http://localhost:${PORT}/api`);
      logger.info(`🔐 Authentication System: ACTIVE`);
      logger.info(
        `🗄️ PostgreSQL Database: ${
          process.env.DATABASE_URL ? 'Connected' : 'Fallback config'
        }`
      );
      logger.info(`🗄️ MongoDB Database: Connected & Ready`);

      // Log available API endpoints
      logger.info('API Endpoints:');
      logger.info('  🏥 GET  /api/health - Health check');
      logger.info('  🔐 POST /api/auth/* - Authentication');
      logger.info('  � POST /api/billing/* - Payments & Subscriptions');
      logger.info('  �👥 GET  /api/admin/* - Admin management');
      logger.info('  📧 POST /api/invitations/* - B2B Invitations');
      logger.info('  🛍️ GET  /api/products - Product catalog');
      logger.info('  🤖 POST /api/recommendations - Get recommendations');
      logger.info('  🤝 GET  /api/partners - Partner management');

      // Log authentication endpoints
      logger.info('Authentication Endpoints:');
      logger.info('  POST /api/auth/admin/login - Admin login');
      logger.info('  POST /api/auth/partner/login - Partner login');
      logger.info('  POST /api/auth/refresh - Token refresh');
      logger.info('  POST /api/auth/logout - User logout');
      logger.info('  POST /api/auth/logout-all - Logout from all devices');
      logger.info('  GET /api/auth/me - Get current user');

      // Log product management endpoints
      logger.info('Product Management Endpoints:');
      logger.info('  GET  /api/products - List products (with filtering)');
      logger.info('  GET  /api/products/:id - Get single product');
      logger.info('  POST /api/products - Create product (Auth required)');
      logger.info('  PUT  /api/products/:id - Update product (Auth required)');
      logger.info(
        '  DELETE /api/products/:id - Delete product (Auth required)'
      );
      logger.info('  GET /api/products/meta/categories - Get categories');
      logger.info('  GET /api/products/meta/brands - Get brands');
      logger.info('  POST /api/products/:id/track-click - Track product click');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
// Restart trigger
