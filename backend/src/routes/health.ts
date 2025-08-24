import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'AutoCare Advisor Backend',
    version: '1.0.0'
  });
});

// Detailed health check
router.get('/detailed', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'AutoCare Advisor Backend',
    version: '1.0.0',
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
