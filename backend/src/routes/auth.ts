import { Router } from 'express';

const router = Router();

// Authentication placeholder routes
router.post('/login', (req, res) => {
  res.json({
    message: 'Authentication system coming soon!',
    status: 'placeholder'
  });
});

router.post('/register', (req, res) => {
  res.json({
    message: 'Registration system coming soon!',
    status: 'placeholder'
  });
});

export default router;
