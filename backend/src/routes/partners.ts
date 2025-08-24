import { Router } from 'express';

const router = Router();

// B2B Partners API
router.get('/', (req, res) => {
  res.json({
    message: '🤝 AutoCare Partners API',
    endpoints: {
      'GET /': 'List all partners',
      'GET /dashboard': 'Partner dashboard data',
      'POST /products': 'Add partner products'
    }
  });
});

// Partner dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    stats: {
      totalRecommendations: 1247,
      clickThroughRate: 23.5,
      revenue: 8942.50,
      topProducts: [
        'Premium Car Wash Soap',
        'Microfiber Cloth Set',
        'Tire Shine Spray'
      ]
    },
    message: 'Partner dashboard data'
  });
});

export default router;
