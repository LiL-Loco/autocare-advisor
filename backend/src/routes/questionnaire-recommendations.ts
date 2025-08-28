import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomerAnswers,
  RecommendationService,
} from '../services/recommendationService';
import logger from '../utils/logger';

const router = express.Router();
const recommendationService = new RecommendationService();

/**
 * POST /api/recommendations/generate
 * Generiert Empfehlungen basierend auf Fragebogen-Antworten
 */
router.post('/generate', async (req, res) => {
  try {
    const { sessionId, answers, timestamp } = req.body;

    // Validierung
    if (!answers) {
      return res.status(400).json({
        success: false,
        error: 'Fragebogen-Antworten sind erforderlich',
        code: 'MISSING_ANSWERS',
      });
    }

    // Session ID generieren falls nicht vorhanden
    const requestSessionId = sessionId || uuidv4();

    logger.info('Processing questionnaire for recommendations', {
      sessionId: requestSessionId,
      timestamp,
      vehicleBrand: answers.vehicleBrand,
      vehicleType: answers.vehicleType,
      experienceLevel: answers.experienceLevel,
      problems: answers.primaryProblem?.length || 0,
    });

    // CustomerAnswers Interface validieren
    const customerAnswers: CustomerAnswers = {
      vehicleType: answers.vehicleType,
      vehicleBrand: answers.vehicleBrand,
      vehicleModel: answers.vehicleModel,
      vehicleYear: answers.vehicleYear,
      paintType: answers.paintType,
      paintColor: answers.paintColor,
      primaryProblem: Array.isArray(answers.primaryProblem)
        ? answers.primaryProblem
        : [answers.primaryProblem].filter(Boolean),
      careFrequency: answers.careFrequency || 'Monatlich',
      experienceLevel: answers.experienceLevel,
      budget: answers.budget,
      timeAvailable: answers.timeAvailable || '30-60 min',
      season: answers.season || 'Sommer',
      preferredBrands: answers.preferredBrands,
    };

    // Empfehlungen generieren
    const startTime = Date.now();
    const recommendations = await recommendationService.generateRecommendations(
      customerAnswers,
      10
    );
    const processingTime = Date.now() - startTime;

    // Mindestens 3 Empfehlungen sicherstellen
    if (recommendations.length < 3) {
      logger.warn(
        'Less than 3 recommendations found, fetching fallback products',
        {
          sessionId: requestSessionId,
          foundRecommendations: recommendations.length,
        }
      );

      // Fallback: Beste bewertete Produkte hinzufügen
      const fallbackProducts =
        await recommendationService.getSpecializedRecommendations(
          'trending',
          3 - recommendations.length
        );

      fallbackProducts.forEach((product) => {
        recommendations.push({
          product,
          matchScore: 50, // Niedrigerer Score für Fallback
          matchPercentage: 50,
          reasoning: {
            vehicleMatch: false,
            problemMatch: [],
            experienceMatch: false,
            budgetMatch: false,
            seasonMatch: false,
            strongPoints: ['Beliebtes Produkt', 'Gute Bewertungen'],
            considerations: [
              'Nicht spezifisch für Ihre Anforderungen optimiert',
            ],
          },
          tier: 'good' as const, // Change to 'good' instead of 'acceptable'
        });
      });
    }

    // Tier-Distribution anwenden (40% Enterprise, 40% Professional, 20% Basic)
    const tieredRecommendations = recommendations.map((rec, index) => {
      let tier: 'perfect' | 'excellent' | 'good' | 'acceptable' = 'acceptable';
      if (index < Math.ceil(recommendations.length * 0.4)) {
        tier = 'perfect';
      } else if (index < Math.ceil(recommendations.length * 0.8)) {
        tier = 'excellent';
      } else {
        tier = 'good';
      }
      return { ...rec, tier };
    });

    // Empfehlungen nach Tiers gruppieren
    const groupedByTier = {
      perfect: tieredRecommendations.filter((r) => r.tier === 'perfect'),
      excellent: tieredRecommendations.filter((r) => r.tier === 'excellent'),
      good: tieredRecommendations.filter((r) => r.tier === 'good'),
    };

    // Personalisierte Nachricht generieren
    const personalizedMessage = generatePersonalizedMessage(
      customerAnswers,
      tieredRecommendations.length
    );

    // Geschätzten Gesamtpreis berechnen
    const estimatedTotalCost = tieredRecommendations.reduce((sum, rec) => {
      return sum + (rec.product.price || 0);
    }, 0);

    // Session für Analytics speichern
    logger.info('Recommendations generated successfully', {
      sessionId: requestSessionId,
      totalRecommendations: tieredRecommendations.length,
      tiers: {
        perfect: groupedByTier.perfect.length,
        excellent: groupedByTier.excellent.length,
        good: groupedByTier.good.length,
      },
      processingTimeMs: processingTime,
      estimatedTotalCost,
      averageScore:
        tieredRecommendations.reduce((sum, r) => sum + r.matchScore, 0) /
        tieredRecommendations.length,
    });

    res.json({
      success: true,
      data: {
        sessionId: requestSessionId,
        personalizedMessage,
        totalProducts: tieredRecommendations.length,
        categories: Array.from(
          new Set(tieredRecommendations.map((r) => r.product.category))
        ),
        estimatedTotalCost,
        recommendations: tieredRecommendations.map((rec) => ({
          id: rec.product._id,
          name: rec.product.name,
          brand: rec.product.brand,
          category: rec.product.category,
          price: rec.product.price,
          originalPrice: rec.product.originalPrice,
          rating: rec.product.rating,
          reviewCount: rec.product.reviewCount,
          image: rec.product.images?.[0] || '/api/placeholder/300/300',
          description: rec.product.description,
          features: rec.product.features || [],
          partnerShopName:
            rec.product.partner?.companyName || 'AutoCare Partner',
          partnerShopUrl: rec.product.partner?.website || '#',
          availabilityStatus: rec.product.inStock ? 'in_stock' : 'out_of_stock',
          reasonForRecommendation: generateReasonForRecommendation(
            rec.reasoning
          ),
          matchScore: Math.round(rec.matchPercentage),
          tier: rec.tier,
        })),
        groupedByTier: {
          perfect: groupedByTier.perfect.map((r) => r.product._id),
          excellent: groupedByTier.excellent.map((r) => r.product._id),
          good: groupedByTier.good.map((r) => r.product._id),
        },
        meta: {
          timestamp: new Date().toISOString(),
          processingTime: processingTime,
          cacheFor: '30 minutes',
          source: 'questionnaire',
          qualityThreshold: 70,
          parameters: {
            vehicleType: customerAnswers.vehicleType,
            vehicleBrand: customerAnswers.vehicleBrand,
            experienceLevel: customerAnswers.experienceLevel,
            budgetRange: customerAnswers.budget
              ? `${customerAnswers.budget.min}-${customerAnswers.budget.max}`
              : 'not-specified',
          },
        },
      },
    });
  } catch (error: any) {
    logger.error('Error generating recommendations from questionnaire:', {
      error: error.message,
      stack: error.stack,
      sessionId: req.body?.sessionId,
    });

    res.status(500).json({
      success: false,
      error: 'Empfehlungen konnten nicht generiert werden',
      code: 'RECOMMENDATION_GENERATION_ERROR',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/recommendations/session/:sessionId
 * Ruft gespeicherte Empfehlungen für eine Session ab
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // In einer echten Anwendung würden hier die Empfehlungen aus der Datenbank geladen
    // Für jetzt geben wir eine entsprechende Antwort zurück
    logger.info('Fetching recommendations for session', { sessionId });

    res.json({
      success: true,
      data: {
        sessionId,
        message: 'Session-basierte Empfehlungen sind in Entwicklung',
        available: false,
      },
    });
  } catch (error: any) {
    logger.error('Error fetching session recommendations:', {
      error: error.message,
      sessionId: req.params.sessionId,
    });

    res.status(500).json({
      success: false,
      error: 'Session-Empfehlungen konnten nicht geladen werden',
      code: 'SESSION_FETCH_ERROR',
    });
  }
});

/**
 * Helper function: Generiert personalisierte Nachricht
 */
function generatePersonalizedMessage(
  answers: CustomerAnswers,
  recommendationCount: number
): string {
  const messages = [
    `Basierend auf Ihrem ${answers.vehicleBrand} ${answers.vehicleType} haben wir ${recommendationCount} perfekte Pflegeprodukte gefunden.`,
    `Für Ihr ${answers.paintType}-Lack und Ihr ${answers.experienceLevel}-Level haben wir eine maßgeschneiderte Auswahl zusammengestellt.`,
    `Mit Ihrem Budget von €${answers.budget?.min}-${answers.budget?.max} erhalten Sie optimale Pflegelösungen.`,
    `Diese ${recommendationCount} Produkte lösen Ihre Hauptprobleme: ${answers.primaryProblem
      .slice(0, 2)
      .join(' und ')}.`,
  ];

  // Wähle eine zufällige personalisierte Nachricht
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Helper function: Generiert Begründung für Empfehlung
 */
function generateReasonForRecommendation(reasoning: any): string {
  const reasons = [];

  if (reasoning.vehicleMatch) {
    reasons.push('Perfekt für Ihr Fahrzeugmodell');
  }
  if (reasoning.problemMatch.length > 0) {
    reasons.push(`Löst ${reasoning.problemMatch.slice(0, 2).join(' und ')}`);
  }
  if (reasoning.experienceMatch) {
    reasons.push('Passend zu Ihrer Erfahrung');
  }
  if (reasoning.budgetMatch) {
    reasons.push('In Ihrem Budget');
  }
  if (reasoning.strongPoints.length > 0) {
    reasons.push(reasoning.strongPoints[0]);
  }

  return reasons.length > 0
    ? reasons.slice(0, 2).join(' • ')
    : 'Bewährtes Qualitätsprodukt';
}

export default router;
