import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import routes
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import invitationsRouter from './routes/invitations';
import partnersRouter from './routes/partners';
import productsRouter from './routes/products';
import recommendationsRouter from './routes/recommendations';

// Import middleware
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

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
app.use('/api/admin', adminRouter);
app.use('/api/invitations', invitationsRouter);
app.use('/api/products', productsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/partners', partnersRouter);

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
      admin: '/api/admin',
      invitations: '/api/invitations',
      products: '/api/products',
      recommendations: '/api/recommendations',
      partners: '/api/partners',
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

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 AutoCare Advisor Backend running on port ${PORT}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📡 API available at: http://localhost:${PORT}/api`);
  logger.info(`🔐 Authentication System: ACTIVE`);
  logger.info(
    `🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Fallback config'}`
  );

  // Log available authentication endpoints
  logger.info('Authentication Endpoints:');
  logger.info('  POST /api/auth/register - User registration');
  logger.info('  POST /api/auth/login - User login');
  logger.info('  POST /api/auth/refresh - Token refresh');
  logger.info('  POST /api/auth/logout - User logout');
  logger.info('  POST /api/auth/logout-all - Logout from all devices');
  logger.info('  POST /api/auth/forgot-password - Password reset');
  logger.info('  GET /api/auth/me - Get current user');
});

export default app;
// Restart trigger
