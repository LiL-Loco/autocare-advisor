import { Router } from 'express';

const router = Router();

// Get product recommendations
router.post('/', (req, res) => {
  const { carModel, carYear, carType, issueDescription, budget } = req.body;
  
  // TODO: Implement rule-based recommendation engine
  const mockRecommendations = [
    {
      id: 1,
      productName: "Premium Car Wash Soap",
      brand: "Chemical Guys",
      category: "Exterior Care",
      price: 24.99,
      confidence: 95,
      reason: "Perfect for regular maintenance cleaning",
      partnerDiscount: 15
    },
    {
      id: 2,
      productName: "Microfiber Washing Mitt",
      brand: "Meguiar's",
      category: "Tools & Accessories", 
      price: 12.99,
      confidence: 90,
      reason: "Essential tool for scratch-free washing",
      partnerDiscount: 10
    }
  ];

  res.json({
    carInfo: { carModel, carYear, carType },
    issue: issueDescription,
    budget,
    recommendations: mockRecommendations,
    totalProducts: mockRecommendations.length,
    message: 'Recommendations based on rule-based engine'
  });
});

// Get recommendation explanation
router.get('/explain/:recommendationId', (req, res) => {
  const { recommendationId } = req.params;
  
  res.json({
    recommendationId,
    explanation: {
      rules: [
        "Car age indicates need for gentle cleaning products",
        "Budget allows for premium quality products",
        "Issue type matches exterior care category"
      ],
      confidence: 95,
      alternatives: 2
    }
  });
});

export default router;
