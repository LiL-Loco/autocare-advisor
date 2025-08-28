/**
 * Questionnaire API Routes
 * Implements CL-30: Intelligenter Fragebogen (Questionnaire Engine)
 */

import { Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import {
  QUESTIONNAIRE_STRUCTURE,
  QuestionnaireAnswers,
} from '../models/Questionnaire';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/questionnaire/questions
 * Get questionnaire structure with conditional logic
 */
router.get('/questions', async (req: Request, res: Response) => {
  try {
    // Return the full questionnaire structure
    // Frontend will handle conditional logic based on previous answers
    res.json({
      success: true,
      data: {
        questions: QUESTIONNAIRE_STRUCTURE,
        totalSteps: QUESTIONNAIRE_STRUCTURE.length,
        estimatedTime: '5-8 Minuten',
        version: '1.0',
      },
    });

    logger.info('Questionnaire structure requested', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    logger.error('Failed to fetch questionnaire structure', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to load questionnaire structure',
    });
  }
});

/**
 * POST /api/questionnaire/save-progress
 * Save questionnaire progress (partial answers)
 */
router.post(
  '/save-progress',
  [
    body('sessionId')
      .isString()
      .notEmpty()
      .withMessage('Session ID is required'),
    body('answers').isObject().withMessage('Answers must be an object'),
    body('currentStep')
      .isInt({ min: 0, max: 15 })
      .withMessage('Current step must be a valid number'),
  ],
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { sessionId, answers, currentStep } = req.body;
      const userId = req.user?.userId;

      // Check if session already exists
      let session = await QuestionnaireAnswers.findOne({ sessionId });

      if (session) {
        // Update existing session
        Object.assign(session, answers);
        session.updatedAt = new Date();
        if (userId) session.userId = userId;
      } else {
        // Create new session
        session = new QuestionnaireAnswers({
          sessionId,
          userId,
          ...answers,
          isCompleted: false,
        });
      }

      await session.save();

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          currentStep,
          saved: true,
          progress: `${currentStep + 1}/${QUESTIONNAIRE_STRUCTURE.length}`,
        },
      });

      logger.info('Questionnaire progress saved', {
        sessionId,
        userId,
        currentStep,
        ip: req.ip,
      });
    } catch (error) {
      logger.error('Failed to save questionnaire progress', {
        error,
        sessionId: req.body?.sessionId,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to save progress',
      });
    }
  }
);

/**
 * GET /api/questionnaire/load-progress/:sessionId
 * Load saved questionnaire progress
 */
router.get(
  '/load-progress/:sessionId',
  [
    param('sessionId')
      .isString()
      .notEmpty()
      .withMessage('Session ID is required'),
  ],
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { sessionId } = req.params;
      const session = await QuestionnaireAnswers.findOne({ sessionId });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found',
          message: 'No saved progress found for this session',
        });
      }

      // Calculate current step based on completed answers
      let currentStep = 0;
      const answers = session.toObject();

      for (const question of QUESTIONNAIRE_STRUCTURE) {
        if (answers[question.id as keyof typeof answers]) {
          currentStep = question.order;
        }
      }

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          answers: session.toObject(),
          currentStep,
          isCompleted: session.isCompleted,
          progress: `${currentStep}/${QUESTIONNAIRE_STRUCTURE.length}`,
          lastUpdated: session.updatedAt,
        },
      });

      logger.info('Questionnaire progress loaded', {
        sessionId,
        currentStep,
        isCompleted: session.isCompleted,
        ip: req.ip,
      });
    } catch (error) {
      logger.error('Failed to load questionnaire progress', {
        error,
        sessionId: req.params.sessionId,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to load progress',
      });
    }
  }
);

/**
 * POST /api/questionnaire/submit
 * Submit completed questionnaire and generate session
 */
router.post(
  '/submit',
  [
    body('sessionId').optional().isString(),
    body('vehicleType')
      .isString()
      .notEmpty()
      .withMessage('Vehicle type is required'),
    body('vehicleBrand')
      .isString()
      .notEmpty()
      .withMessage('Vehicle brand is required'),
    body('paintCondition')
      .isString()
      .notEmpty()
      .withMessage('Paint condition is required'),
    body('paintType')
      .isString()
      .notEmpty()
      .withMessage('Paint type is required'),
    body('experienceLevel')
      .isString()
      .notEmpty()
      .withMessage('Experience level is required'),
    body('primaryProblems')
      .isArray({ min: 1 })
      .withMessage('At least one problem must be selected'),
    body('timeAvailable')
      .isString()
      .notEmpty()
      .withMessage('Time available is required'),
    body('budgetRange')
      .isString()
      .notEmpty()
      .withMessage('Budget range is required'),
    body('careGoals')
      .isArray({ min: 1 })
      .withMessage('At least one care goal must be selected'),
    body('season').isString().notEmpty().withMessage('Season is required'),
    body('usageLocation')
      .isString()
      .notEmpty()
      .withMessage('Usage location is required'),
    body('environmentPreference')
      .isString()
      .notEmpty()
      .withMessage('Environment preference is required'),
  ],
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const sessionId = req.body.sessionId || uuidv4();
      const userId = req.user?.userId;
      const answers = req.body;

      // Calculate questionnaire score for recommendation weighting
      let totalScore = 0;
      let maxPossibleScore = 0;

      QUESTIONNAIRE_STRUCTURE.forEach((question) => {
        maxPossibleScore += question.weight * 4; // Max weight per question

        const userAnswer = answers[question.id];
        if (userAnswer) {
          if (Array.isArray(userAnswer)) {
            // Multiple choice questions
            userAnswer.forEach((answer: string) => {
              const option = question.options.find(
                (opt) => opt.value === answer
              );
              if (option) {
                totalScore += (option.weight || 1) * question.weight;
              }
            });
          } else {
            // Single choice questions
            const option = question.options.find(
              (opt) => opt.value === userAnswer
            );
            if (option) {
              totalScore += (option.weight || 1) * question.weight;
            }
          }
        }
      });

      const complexityScore = Math.round((totalScore / maxPossibleScore) * 100);

      // Save completed questionnaire
      let questionnaire = await QuestionnaireAnswers.findOne({ sessionId });

      if (questionnaire) {
        // Update existing
        Object.assign(questionnaire, answers);
        questionnaire.isCompleted = true;
        questionnaire.completedAt = new Date();
        questionnaire.userId = userId || questionnaire.userId;
      } else {
        // Create new
        questionnaire = new QuestionnaireAnswers({
          sessionId,
          userId,
          ...answers,
          isCompleted: true,
          completedAt: new Date(),
        });
      }

      await questionnaire.save();

      res.json({
        success: true,
        data: {
          sessionId: questionnaire.sessionId,
          recommendationId: uuidv4(), // For next step integration
          complexityScore,
          profile: {
            level: answers.experienceLevel,
            budget: answers.budgetRange,
            timeCommitment: answers.timeAvailable,
            primaryFocus: answers.primaryProblems[0],
            vehicleType: answers.vehicleType,
          },
          completedAt: questionnaire.completedAt,
          nextStep: '/recommendations',
        },
      });

      logger.info('Questionnaire completed successfully', {
        sessionId: questionnaire.sessionId,
        userId,
        complexityScore,
        vehicleType: answers.vehicleType,
        experienceLevel: answers.experienceLevel,
        budgetRange: answers.budgetRange,
        ip: req.ip,
      });
    } catch (error) {
      logger.error('Failed to submit questionnaire', {
        error,
        sessionId: req.body?.sessionId,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to submit questionnaire',
      });
    }
  }
);

/**
 * GET /api/questionnaire/stats
 * Get questionnaire completion statistics (for admin)
 */
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    const [
      totalSubmissions,
      completedSubmissions,
      vehicleTypeStats,
      experienceLevelStats,
    ] = await Promise.all([
      QuestionnaireAnswers.countDocuments(),
      QuestionnaireAnswers.countDocuments({ isCompleted: true }),
      QuestionnaireAnswers.aggregate([
        { $match: { isCompleted: true } },
        { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      QuestionnaireAnswers.aggregate([
        { $match: { isCompleted: true } },
        { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const completionRate =
      totalSubmissions > 0
        ? Math.round((completedSubmissions / totalSubmissions) * 100)
        : 0;

    res.json({
      success: true,
      data: {
        totalSubmissions,
        completedSubmissions,
        completionRate,
        vehicleTypes: vehicleTypeStats,
        experienceLevels: experienceLevelStats,
        generatedAt: new Date(),
      },
    });

    logger.info('Questionnaire stats requested', {
      userId: req.user?.userId,
      ip: req.ip,
    });
  } catch (error) {
    logger.error('Failed to fetch questionnaire stats', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch statistics',
    });
  }
});

/**
 * DELETE /api/questionnaire/session/:sessionId
 * Delete questionnaire session (GDPR compliance)
 */
router.delete(
  '/session/:sessionId',
  [
    param('sessionId')
      .isString()
      .notEmpty()
      .withMessage('Session ID is required'),
  ],
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { sessionId } = req.params;
      const deleted = await QuestionnaireAnswers.findOneAndDelete({
        sessionId,
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Session not found',
          message: 'No session found to delete',
        });
      }

      res.json({
        success: true,
        message: 'Session deleted successfully',
        deletedAt: new Date(),
      });

      logger.info('Questionnaire session deleted', {
        sessionId,
        userId: req.user?.userId,
        ip: req.ip,
      });
    } catch (error) {
      logger.error('Failed to delete questionnaire session', {
        error,
        sessionId: req.params.sessionId,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete session',
      });
    }
  }
);

export default router;
