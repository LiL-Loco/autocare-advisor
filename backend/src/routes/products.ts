import { Router } from 'express';

const router = Router();

// Get all products
router.get('/', (req, res) => {
  res.json({
    message: '🧽 AutoCare Products API',
    endpoints: {
      'GET /': 'List all products',
      'GET /search': 'Search products',
      'GET /categories': 'Product categories',
      'GET /:id': 'Get product details'
    }
  });
});

// Search products
router.get('/search', (req, res) => {
  const { query, category, brand } = req.query;
  
  // TODO: Implement actual search logic
  res.json({
    query,
    category,
    brand,
    results: [],
    total: 0,
    message: 'Search functionality coming soon!'
  });
});

// Get product categories
router.get('/categories', (req, res) => {
  res.json({
    categories: [
      'Exterior Care',
      'Interior Care',
      'Engine Care',
      'Wheel Care',
      'Glass Care',
      'Tools & Accessories'
    ]
  });
});

export default router;
