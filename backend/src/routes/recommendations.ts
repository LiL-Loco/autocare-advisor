/**
 * Recommendation Routes - AutoCare Advisor
 *
 * Enhanced API Endpoints für die regel-basierte Produktempfehlungsengine
 */

import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomerAnswers,
  recommendationService,
} from '../services/recommendationService';
import logger from '../utils/logger';

const router = express.Router();

// Rate Limiting für Recommendation-Requests
const recommendationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests pro 15 min pro IP
  message: {
    error: 'Too many recommendation requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/recommendations/generate
 * Generiert Produktempfehlungen basierend auf Kundenantworten
 */
router.post(
  '/generate',
  recommendationRateLimit,
  [
    // Validierung der Eingabedaten
    body('vehicleType')
      .notEmpty()
      .withMessage('Vehicle type is required')
      .isIn(['PKW', 'SUV', 'Van', 'Motorrad', 'LKW'])
      .withMessage('Invalid vehicle type'),

    body('vehicleBrand')
      .notEmpty()
      .withMessage('Vehicle brand is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Vehicle brand must be 2-50 characters'),

    body('paintType')
      .notEmpty()
      .withMessage('Paint type is required')
      .isIn(['Metallic', 'Uni', 'Perlmutt', 'Matt'])
      .withMessage('Invalid paint type'),

    body('primaryProblem')
      .isArray({ min: 1 })
      .withMessage('At least one primary problem is required'),

    body('experienceLevel')
      .notEmpty()
      .withMessage('Experience level is required')
      .isIn(['Anfänger', 'Fortgeschritten', 'Profi'])
      .withMessage('Invalid experience level'),

    body('careFrequency')
      .notEmpty()
      .withMessage('Care frequency is required')
      .isIn(['Wöchentlich', 'Monatlich', 'Saisonal'])
      .withMessage('Invalid care frequency'),

    body('timeAvailable').notEmpty().withMessage('Time available is required'),

    body('season')
      .notEmpty()
      .withMessage('Season is required')
      .isIn(['Frühling', 'Sommer', 'Herbst', 'Winter'])
      .withMessage('Invalid season'),

    // Optionale Felder
    body('vehicleYear')
      .optional()
      .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
      .withMessage('Invalid vehicle year'),

    body('budget.min')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Budget min must be a positive number'),

    body('budget.max')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Budget max must be a positive number'),

    body('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validierung prüfen
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
          code: 'VALIDATION_ERROR',
        });
      }

      const customerAnswers: CustomerAnswers = req.body;
      const limit = req.body.limit || 10;

      // Budget-Validierung
      if (
        customerAnswers.budget &&
        customerAnswers.budget.min > customerAnswers.budget.max
      ) {
        return res.status(400).json({
          success: false,
          error: 'Budget minimum cannot be greater than maximum',
          code: 'INVALID_BUDGET_RANGE',
        });
      }

      logger.info('Generating recommendations', {
        vehicleType: customerAnswers.vehicleType,
        vehicleBrand: customerAnswers.vehicleBrand,
        problems: customerAnswers.primaryProblem,
        experienceLevel: customerAnswers.experienceLevel,
        requestId: req.headers['x-request-id'] || 'unknown',
      });

      // Empfehlungen generieren
      const startTime = Date.now();
      const recommendations =
        await recommendationService.generateRecommendations(
          customerAnswers,
          limit
        );
      const processingTime = Date.now() - startTime;

      // Empfehlungen nach Tiers gruppieren
      const groupedByTier = {
        perfect: recommendations.filter((r) => r.tier === 'perfect'),
        excellent: recommendations.filter((r) => r.tier === 'excellent'),
        good: recommendations.filter((r) => r.tier === 'good'),
        acceptable: recommendations.filter((r) => r.tier === 'acceptable'),
      };

      // Analytics-Event loggen
      logger.info('Recommendations generated successfully', {
        totalRecommendations: recommendations.length,
        tiers: {
          perfect: groupedByTier.perfect.length,
          excellent: groupedByTier.excellent.length,
          good: groupedByTier.good.length,
          acceptable: groupedByTier.acceptable.length,
        },
        processingTimeMs: processingTime,
        averageScore:
          recommendations.reduce((sum, r) => sum + r.matchScore, 0) /
            recommendations.length || 0,
      });

      res.json({
        success: true,
        data: {
          recommendations,
          groupedByTier,
          meta: {
            totalRecommendations: recommendations.length,
            processingTime: processingTime,
            timestamp: new Date().toISOString(),
            sessionId: uuidv4(),
            parameters: {
              vehicleType: customerAnswers.vehicleType,
              vehicleBrand: customerAnswers.vehicleBrand,
              primaryProblems: customerAnswers.primaryProblem.length,
              experienceLevel: customerAnswers.experienceLevel,
            },
          },
        },
      });
    } catch (error: any) {
      logger.error('Error generating recommendations:', {
        error: error.message,
        stack: error.stack,
        requestData: req.body,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations',
        code: 'RECOMMENDATION_ERROR',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      });
    }
  }
);

/**
 * GET /api/recommendations/specialized/:type
 * Spezielle Empfehlungen (Trending, Seasonal, etc.)
 */
router.get(
  '/specialized/:type',
  recommendationRateLimit,
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Limit must be between 1 and 20'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;

      if (!['trending', 'season', 'beginner', 'professional'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid recommendation type',
          validTypes: ['trending', 'season', 'beginner', 'professional'],
          code: 'INVALID_TYPE',
        });
      }

      const recommendations =
        await recommendationService.getSpecializedRecommendations(
          type as 'trending' | 'season' | 'beginner' | 'professional',
          limit
        );

      logger.info('Specialized recommendations fetched', {
        type,
        count: recommendations.length,
      });

      res.json({
        success: true,
        data: {
          type,
          recommendations,
          count: recommendations.length,
          meta: {
            timestamp: new Date().toISOString(),
            cacheFor: '5 minutes', // Empfohlene Cache-Zeit
          },
        },
      });
    } catch (error: any) {
      logger.error('Error fetching specialized recommendations:', {
        error: error.message,
        type: req.params.type,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to fetch specialized recommendations',
        code: 'SPECIALIZED_RECOMMENDATION_ERROR',
      });
    }
  }
);

/**
 * GET /api/recommendations/stats
 * Statistiken zur Recommendation Engine
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Basis-Statistiken für Monitoring
    res.json({
      success: true,
      data: {
        engine: {
          status: 'active',
          version: '2.0.0',
          algorithm: 'rule-based',
          supportedVehicleTypes: ['PKW', 'SUV', 'Van', 'Motorrad', 'LKW'],
          supportedPaintTypes: ['Metallic', 'Uni', 'Perlmutt', 'Matt'],
          maxRecommendations: 50,
        },
        scoring: {
          maxScore: 100,
          weights: {
            vehicleMatch: 25,
            problemSolving: 20,
            experienceLevel: 15,
            budget: 10,
            season: 5,
            quality: 5,
          },
        },
        performance: {
          averageResponseTime: '< 200ms',
          cacheStrategy: 'none', // Für jetzt, später Redis-Cache
          rateLimit: '100 requests per 15 minutes',
        },
        meta: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
      },
    });
  } catch (error: any) {
    logger.error('Error fetching recommendation stats:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation statistics',
    });
  }
});

// Legacy endpoint für Rückwärtskompatibilität (behält die alte Funktionalität bei)
router.post('/', (req, res) => {
  try {
    const { questionnaire } = req.body;

    if (!questionnaire) {
      return res.status(400).json({
        error: 'Questionnaire data is required',
        message: 'Please provide questionnaire answers',
      });
    }

    // Für jetzt verwenden wir die alte Implementierung für Kompatibilität
    // TODO: Migration auf neuen Service nach Frontend-Update

    res.json({
      message: 'Legacy endpoint - please migrate to /generate',
      recommendations: [],
      sessionId: uuidv4(),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error in legacy recommendations endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate recommendations. Please try again.',
    });
  }
});

export default router;
