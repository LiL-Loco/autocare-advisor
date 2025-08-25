/**
 * Recommendation Service - AutoCare Advisor
 *
 * Regel-basierte Produktempfehlungsengine ohne KI/ML
 * Verwendet strukturierte Matching-Algorithmen für präzise Empfehlungen
 */

import Product from '../models/Product';
import logger from '../utils/logger';

// Interface für Kundenantworten aus dem Questionnaire
export interface CustomerAnswers {
  // Fahrzeug-Informationen
  vehicleType: string; // "PKW" | "SUV" | "Van" | "Motorrad"
  vehicleBrand: string; // "BMW" | "Mercedes" | "Audi" | etc.
  vehicleModel?: string;
  vehicleYear?: number;
  paintType: string; // "Metallic" | "Uni" | "Perlmutt" | "Matt"
  paintColor?: string; // "Schwarz" | "Weiß" | "Silber" | etc.

  // Problem/Bedarf
  primaryProblem: string[]; // ["Kratzer", "Wasserflecken", "Glanz verbessern"]
  careFrequency: string; // "Wöchentlich" | "Monatlich" | "Saisonal"
  experienceLevel: string; // "Anfänger" | "Fortgeschritten" | "Profi"

  // Präferenzen
  budget?: {
    min: number;
    max: number;
  };
  timeAvailable: string; // "15-30 min" | "30-60 min" | "60+ min"
  season: string; // "Frühling" | "Sommer" | "Herbst" | "Winter"
  preferredBrands?: string[];
}

// Interface für Empfehlungsergebnis
export interface ProductRecommendation {
  product: any; // Product document
  matchScore: number; // 0-100 Punkte
  matchPercentage: number; // 0-100%
  reasoning: ReasoningDetails;
  tier: 'perfect' | 'excellent' | 'good' | 'acceptable';
}

export interface ReasoningDetails {
  vehicleMatch: boolean;
  problemMatch: string[];
  experienceMatch: boolean;
  budgetMatch: boolean;
  seasonMatch: boolean;
  strongPoints: string[];
  considerations: string[];
}

// Gewichtungen für Scoring-Algorithmus
const SCORING_WEIGHTS = {
  VEHICLE_EXACT_MATCH: 25, // Fahrzeug passt exakt
  VEHICLE_COMPATIBLE: 15, // Fahrzeug ist kompatibel
  PROBLEM_EXACT_SOLVE: 20, // Löst Hauptproblem
  PROBLEM_PARTIAL_SOLVE: 10, // Löst Teilproblem
  EXPERIENCE_MATCH: 15, // Erfahrungslevel passt
  BUDGET_MATCH: 10, // Im Budget
  SEASON_MATCH: 5, // Saisonale Eignung
  BRAND_PREFERENCE: 5, // Preferred Brand
  QUALITY_BONUS: 5, // Hohe Bewertung
  POPULARITY_BONUS: 5, // Oft gekauft
};

export class RecommendationService {
  /**
   * Hauptfunktion: Generiert Produktempfehlungen basierend auf Kundenantworten
   */
  async generateRecommendations(
    customerAnswers: CustomerAnswers,
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      logger.info('Generating recommendations for customer', {
        vehicleType: customerAnswers.vehicleType,
        problems: customerAnswers.primaryProblem,
        experience: customerAnswers.experienceLevel,
      });

      // 1. Alle aktiven Produkte laden
      const allProducts = await this.fetchActiveProducts();

      // 2. Harte Filter anwenden (MUSS-Kriterien)
      const compatibleProducts = await this.applyHardFilters(
        allProducts,
        customerAnswers
      );

      // 3. Scoring für kompatible Produkte
      const scoredProducts = await this.scoreProducts(
        compatibleProducts,
        customerAnswers
      );

      // 4. Nach Score sortieren und limitieren
      const recommendations = scoredProducts
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      // 5. Empfehlungs-Tiers zuweisen
      const tieredRecommendations = this.assignTiers(recommendations);

      logger.info(
        `Generated ${tieredRecommendations.length} recommendations from ${allProducts.length} products`
      );

      return tieredRecommendations;
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Lädt alle aktiven Produkte aus der Datenbank
   */
  private async fetchActiveProducts(): Promise<any[]> {
    return await Product.find({
      isActive: true,
      inStock: true,
    }).lean();
  }

  /**
   * Wendet harte Filter an - Produkte MÜSSEN diese Kriterien erfüllen
   */
  private async applyHardFilters(
    products: any[],
    answers: CustomerAnswers
  ): Promise<any[]> {
    return products.filter((product) => {
      // Filter 1: Fahrzeugtyp-Kompatibilität
      const vehicleTypeMatch = this.isVehicleTypeCompatible(product, answers);

      // Filter 2: Marken-Kompatibilität (falls spezifisch)
      const brandMatch = this.isBrandCompatible(product, answers);

      // Filter 3: Lacktyp-Kompatibilität
      const paintTypeMatch = this.isPaintTypeCompatible(product, answers);

      return vehicleTypeMatch && brandMatch && paintTypeMatch;
    });
  }

  /**
   * Berechnet Match-Score für jedes kompatible Produkt
   */
  private async scoreProducts(
    products: any[],
    answers: CustomerAnswers
  ): Promise<ProductRecommendation[]> {
    return products.map((product) => {
      let score = 0;
      const reasoning: ReasoningDetails = {
        vehicleMatch: false,
        problemMatch: [],
        experienceMatch: false,
        budgetMatch: false,
        seasonMatch: false,
        strongPoints: [],
        considerations: [],
      };

      // Fahrzeug-Matching
      const vehicleScore = this.calculateVehicleScore(
        product,
        answers,
        reasoning
      );
      score += vehicleScore;

      // Problem-Solving-Matching
      const problemScore = this.calculateProblemScore(
        product,
        answers,
        reasoning
      );
      score += problemScore;

      // Erfahrungslevel-Matching
      const experienceScore = this.calculateExperienceScore(
        product,
        answers,
        reasoning
      );
      score += experienceScore;

      // Budget-Matching
      const budgetScore = this.calculateBudgetScore(
        product,
        answers,
        reasoning
      );
      score += budgetScore;

      // Saisonale Eignung
      const seasonScore = this.calculateSeasonScore(
        product,
        answers,
        reasoning
      );
      score += seasonScore;

      // Quality & Popularity Bonus
      const qualityScore = this.calculateQualityScore(product, reasoning);
      score += qualityScore;

      const matchPercentage = Math.min(100, Math.round((score / 100) * 100));

      return {
        product,
        matchScore: score,
        matchPercentage,
        reasoning,
        tier: this.determineTier(score),
      };
    });
  }

  /**
   * Fahrzeug-Kompatibilität prüfen
   */
  private isVehicleTypeCompatible(
    product: any,
    answers: CustomerAnswers
  ): boolean {
    if (!product.suitableFor?.vehicleTypes) return true; // Wenn nicht spezifiziert, für alle geeignet

    return (
      product.suitableFor.vehicleTypes.includes(answers.vehicleType) ||
      product.suitableFor.vehicleTypes.includes('ALL')
    );
  }

  /**
   * Marken-Kompatibilität prüfen
   */
  private isBrandCompatible(product: any, answers: CustomerAnswers): boolean {
    if (!product.suitableFor?.vehicleBrands) return true;

    return (
      product.suitableFor.vehicleBrands.includes(answers.vehicleBrand) ||
      product.suitableFor.vehicleBrands.includes('ALL')
    );
  }

  /**
   * Lacktyp-Kompatibilität prüfen
   */
  private isPaintTypeCompatible(
    product: any,
    answers: CustomerAnswers
  ): boolean {
    if (!product.suitableFor?.paintTypes) return true;

    return (
      product.suitableFor.paintTypes.includes(answers.paintType) ||
      product.suitableFor.paintTypes.includes('ALL')
    );
  }

  /**
   * Fahrzeug-Score berechnen
   */
  private calculateVehicleScore(
    product: any,
    answers: CustomerAnswers,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    // Fahrzeugtyp-Match
    if (product.suitableFor?.vehicleTypes?.includes(answers.vehicleType)) {
      score += SCORING_WEIGHTS.VEHICLE_EXACT_MATCH;
      reasoning.vehicleMatch = true;
      reasoning.strongPoints.push(`Perfekt für ${answers.vehicleType}`);
    } else if (product.suitableFor?.vehicleTypes?.includes('ALL')) {
      score += SCORING_WEIGHTS.VEHICLE_COMPATIBLE;
      reasoning.vehicleMatch = true;
      reasoning.strongPoints.push('Universell einsetzbar');
    }

    // Marken-spezifische Bonus
    if (product.suitableFor?.vehicleBrands?.includes(answers.vehicleBrand)) {
      score += SCORING_WEIGHTS.BRAND_PREFERENCE;
      reasoning.strongPoints.push(`Optimiert für ${answers.vehicleBrand}`);
    }

    // Fahrzeugalter-Matching (falls vorhanden)
    if (answers.vehicleYear && product.suitableFor?.vehicleAges) {
      const vehicleAge = new Date().getFullYear() - answers.vehicleYear;
      const ageCategory = this.categorizeVehicleAge(vehicleAge);

      if (product.suitableFor.vehicleAges.includes(ageCategory)) {
        score += 5; // Bonus für passendes Fahrzeugalter
        reasoning.strongPoints.push(`Geeignet für ${ageCategory} Fahrzeuge`);
      }
    }

    return score;
  }

  /**
   * Problem-Solving-Score berechnen
   */
  private calculateProblemScore(
    product: any,
    answers: CustomerAnswers,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    if (!product.solves || !answers.primaryProblem) return 0;

    const solvedProblems: string[] = [];

    answers.primaryProblem.forEach((problem) => {
      // Prüfe auf direkte Problem-Matches
      const problemKey = this.mapProblemToProductKey(problem);

      if (problemKey && product.solves[problemKey]) {
        const effectiveness = product.solves[problemKey];

        if (effectiveness >= 8) {
          score += SCORING_WEIGHTS.PROBLEM_EXACT_SOLVE;
          solvedProblems.push(`${problem} (sehr effektiv)`);
        } else if (effectiveness >= 6) {
          score += SCORING_WEIGHTS.PROBLEM_PARTIAL_SOLVE;
          solvedProblems.push(`${problem} (effektiv)`);
        } else if (effectiveness >= 4) {
          score += 5;
          solvedProblems.push(`${problem} (grundlegend)`);
        }
      }
    });

    reasoning.problemMatch = solvedProblems;

    if (solvedProblems.length > 0) {
      reasoning.strongPoints.push(`Löst: ${solvedProblems.join(', ')}`);
    }

    return score;
  }

  /**
   * Erfahrungslevel-Score berechnen
   */
  private calculateExperienceScore(
    product: any,
    answers: CustomerAnswers,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    if (!product.suitableFor?.experienceLevels) return 0;

    if (
      product.suitableFor.experienceLevels.includes(answers.experienceLevel)
    ) {
      score += SCORING_WEIGHTS.EXPERIENCE_MATCH;
      reasoning.experienceMatch = true;
      reasoning.strongPoints.push(`Ideal für ${answers.experienceLevel}`);
    } else {
      // Partial match für benachbarte Levels
      const experienceOrder = ['Anfänger', 'Fortgeschritten', 'Profi'];
      const userIndex = experienceOrder.indexOf(answers.experienceLevel);
      const productLevels = product.suitableFor.experienceLevels;

      if (
        userIndex > 0 &&
        productLevels.includes(experienceOrder[userIndex - 1])
      ) {
        score += 5; // Etwas einfacher als gewünscht
        reasoning.considerations.push(
          'Etwas einfacher als Ihr Erfahrungslevel'
        );
      } else if (
        userIndex < 2 &&
        productLevels.includes(experienceOrder[userIndex + 1])
      ) {
        score += 3; // Etwas schwieriger als gewünscht
        reasoning.considerations.push('Könnte etwas anspruchsvoller sein');
      }
    }

    return score;
  }

  /**
   * Budget-Score berechnen
   */
  private calculateBudgetScore(
    product: any,
    answers: CustomerAnswers,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    if (!answers.budget) return 0;

    const price = product.price || 0;

    if (price >= answers.budget.min && price <= answers.budget.max) {
      score += SCORING_WEIGHTS.BUDGET_MATCH;
      reasoning.budgetMatch = true;
      reasoning.strongPoints.push(`Im Budget (€${price})`);
    } else if (price < answers.budget.min) {
      score += 5; // Günstiger als erwartet
      reasoning.considerations.push(`Günstiger als erwartet (€${price})`);
    } else if (price <= answers.budget.max * 1.2) {
      score += 2; // Leicht über Budget aber noch akzeptabel
      reasoning.considerations.push(`Leicht über Budget (€${price})`);
    }

    return score;
  }

  /**
   * Saisonale Eignung berechnen
   */
  private calculateSeasonScore(
    product: any,
    answers: CustomerAnswers,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    if (!product.usageContext?.season) return 0;

    if (
      product.usageContext.season.includes(answers.season) ||
      product.usageContext.season.includes('ALL')
    ) {
      score += SCORING_WEIGHTS.SEASON_MATCH;
      reasoning.seasonMatch = true;

      if (product.usageContext.season.includes(answers.season)) {
        reasoning.strongPoints.push(`Ideal für ${answers.season}`);
      }
    }

    return score;
  }

  /**
   * Qualitäts-Score berechnen
   */
  private calculateQualityScore(
    product: any,
    reasoning: ReasoningDetails
  ): number {
    let score = 0;

    // Bewertung
    if (product.rating >= 4.5) {
      score += SCORING_WEIGHTS.QUALITY_BONUS;
      reasoning.strongPoints.push(`Sehr gut bewertet (${product.rating}★)`);
    } else if (product.rating >= 4.0) {
      score += 3;
      reasoning.strongPoints.push(`Gut bewertet (${product.rating}★)`);
    }

    // Popularität
    if (product.viewCount && product.viewCount > 1000) {
      score += SCORING_WEIGHTS.POPULARITY_BONUS;
      reasoning.strongPoints.push('Beliebtes Produkt');
    }

    return score;
  }

  /**
   * Empfehlungs-Tiers zuweisen
   */
  private assignTiers(
    recommendations: ProductRecommendation[]
  ): ProductRecommendation[] {
    return recommendations.map((rec) => ({
      ...rec,
      tier: this.determineTier(rec.matchScore),
    }));
  }

  /**
   * Tier basierend auf Score bestimmen
   */
  private determineTier(
    score: number
  ): 'perfect' | 'excellent' | 'good' | 'acceptable' {
    if (score >= 80) return 'perfect';
    if (score >= 65) return 'excellent';
    if (score >= 50) return 'good';
    return 'acceptable';
  }

  /**
   * Problem zu Produkt-Key mapping
   */
  private mapProblemToProductKey(problem: string): string | null {
    const problemMap: Record<string, string> = {
      Kratzer: 'kratzSchutz',
      Wasserflecken: 'wasserAbweisung',
      Kalkflecken: 'wasserAbweisung',
      'Glanz verbessern': 'lackGlanz',
      'UV-Schutz': 'uVSchutz',
      'Farbe auffrischen': 'farbauffrischung',
      'Schmutz abweisend': 'schmutzAbweisung',
      Langzeitschutz: 'langzeitSchutz',
      Pflegeleichtigkeit: 'pflegeleichtigkeit',
    };

    return problemMap[problem] || null;
  }

  /**
   * Fahrzeugalter kategorisieren
   */
  private categorizeVehicleAge(age: number): string {
    if (age <= 1) return 'Neu';
    if (age <= 3) return '1-3 Jahre';
    if (age <= 7) return '3-7 Jahre';
    if (age <= 15) return '7-15 Jahre';
    return 'Über 15 Jahre';
  }

  /**
   * Spezielle Empfehlungen für bestimmte Szenarien
   */
  async getSpecializedRecommendations(
    type: 'trending' | 'season' | 'beginner' | 'professional',
    limit: number = 5
  ): Promise<any[]> {
    const baseQuery: any = { isActive: true, inStock: true };

    switch (type) {
      case 'trending':
        return await Product.find(baseQuery)
          .sort({ viewCount: -1, clickCount: -1 })
          .limit(limit)
          .lean();

      case 'season':
        const currentSeason = this.getCurrentSeason();
        return await Product.find({
          ...baseQuery,
          'usageContext.season': { $in: [currentSeason, 'ALL'] },
        })
          .sort({ rating: -1 })
          .limit(limit)
          .lean();

      case 'beginner':
        return await Product.find({
          ...baseQuery,
          'suitableFor.experienceLevels': 'Anfänger',
        })
          .sort({ rating: -1 })
          .limit(limit)
          .lean();

      case 'professional':
        return await Product.find({
          ...baseQuery,
          'suitableFor.experienceLevels': 'Profi',
          tier: 'premium',
        })
          .sort({ rating: -1 })
          .limit(limit)
          .lean();

      default:
        return [];
    }
  }

  /**
   * Aktuelle Saison ermitteln
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1; // 1-12

    if (month >= 3 && month <= 5) return 'Frühling';
    if (month >= 6 && month <= 8) return 'Sommer';
    if (month >= 9 && month <= 11) return 'Herbst';
    return 'Winter';
  }
}

export const recommendationService = new RecommendationService();
