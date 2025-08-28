/**
 * Questionnaire Transformation Service
 * Konvertiert Fragebogen-Antworten zu CustomerAnswers Interface für RecommendationService
 */

export interface QuestionnaireAnswers {
  // Vehicle Information
  carMake: string;
  carModel?: string;
  carYear: number;
  carType: string;
  currentMileage: string;

  // Paint Information
  paintType: string;
  paintColor: string;
  paintCondition: number; // 1-10 scale
  specificProblems: string[];

  // Environment & Usage
  parkingPrimary: string;
  environmentalExposure: string[];
  annualMileage: string;

  // Goals & Preferences
  primaryGoal: string;
  timeInvestment: string;
  experienceLevel: string;
  availableEquipment: string[];
  totalBudget: string;
}

export interface CustomerAnswers {
  // Fahrzeug-Informationen
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel?: string;
  vehicleYear?: number;
  paintType: string;
  paintColor?: string;

  // Problem/Bedarf
  primaryProblem: string[];
  careFrequency: string;
  experienceLevel: string;

  // Präferenzen
  budget?: {
    min: number;
    max: number;
  };
  timeAvailable: string;
  season: string;
  preferredBrands?: string[];
}

export class QuestionnaireTransformService {
  /**
   * Transformiert Fragebogen-Antworten zu CustomerAnswers für RecommendationService
   */
  static transformToCustomerAnswers(
    answers: QuestionnaireAnswers
  ): CustomerAnswers {
    // Vehicle Type Mapping
    const vehicleTypeMapping: { [key: string]: string } = {
      Limousine: 'PKW',
      'Kombi/Touring': 'PKW',
      'SUV/SAV': 'SUV',
      Coupé: 'PKW',
      'Cabrio/Roadster': 'PKW',
      Kleinwagen: 'PKW',
      'Van/MPV': 'Van',
      'Pick-up': 'SUV',
    };

    // Paint Type Mapping
    const paintTypeMapping: { [key: string]: string } = {
      'Metallic-Lack (mit Glitzerpartikeln)': 'Metallic',
      'Perlmutt-/Perleffekt-Lack': 'Perlmutt',
      'Uni-Lack (einfarbig)': 'Uni',
      'Matt-Lack': 'Matt',
      'Nicht sicher': 'Uni',
    };

    // Experience Level Mapping
    const experienceLevelMapping: { [key: string]: string } = {
      Anfänger: 'Anfänger',
      Grundkenntnisse: 'Anfänger',
      Fortgeschritten: 'Fortgeschritten',
      'Sehr erfahren': 'Profi',
      'Profi-Level': 'Profi',
    };

    // Budget Mapping
    const budgetMapping: { [key: string]: { min: number; max: number } } = {
      'Unter 50€': { min: 0, max: 50 },
      '50€ - 100€': { min: 50, max: 100 },
      '100€ - 200€': { min: 100, max: 200 },
      '200€ - 350€': { min: 200, max: 350 },
      'Über 350€': { min: 350, max: 1000 },
    };

    // Time Investment to Care Frequency Mapping
    const careFrequencyMapping: { [key: string]: string } = {
      '15-30 Minuten': 'Wöchentlich',
      '30-60 Minuten': 'Wöchentlich',
      '1-2 Stunden': 'Monatlich',
      '2-4 Stunden': 'Monatlich',
      'Mehr als 4 Stunden': 'Saisonal',
    };

    // Primary Goal to Problem Mapping
    const primaryGoalToProblems: { [key: string]: string[] } = {
      'Maximaler Glanz': ['Glanz verbessern', 'Politur'],
      'Langzeit-Schutz': ['Schutz', 'Versiegelung'],
      'Kratzer entfernen': ['Kratzer', 'Polieren'],
      'Einfache Pflege': ['Reinigung', 'Pflege'],
      Werterhalt: ['Schutz', 'Reinigung', 'Pflege'],
    };

    // Get current season
    const getCurrentSeason = (): string => {
      const month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) return 'Frühling';
      if (month >= 6 && month <= 8) return 'Sommer';
      if (month >= 9 && month <= 11) return 'Herbst';
      return 'Winter';
    };

    // Build primary problems from multiple sources
    const primaryProblems: string[] = [];

    // From primary goal
    if (answers.primaryGoal && primaryGoalToProblems[answers.primaryGoal]) {
      primaryProblems.push(...primaryGoalToProblems[answers.primaryGoal]);
    }

    // From specific problems
    if (answers.specificProblems && answers.specificProblems.length > 0) {
      const problemMapping: { [key: string]: string } = {
        'Feine Kratzer/Swirl-Marks': 'Kratzer',
        'Tiefe Einzelkratzer': 'Kratzer',
        Wasserflecken: 'Wasserflecken',
        'Matter Glanz': 'Glanz verbessern',
        'Vogelkot-Schäden': 'Reinigung',
        'Keine sichtbaren Probleme': 'Pflege',
      };

      answers.specificProblems.forEach((problem) => {
        if (problemMapping[problem]) {
          primaryProblems.push(problemMapping[problem]);
        }
      });
    }

    // Default to basic care if no specific problems
    if (primaryProblems.length === 0) {
      primaryProblems.push('Pflege', 'Reinigung');
    }

    // Remove duplicates
    const uniqueProblems = Array.from(new Set(primaryProblems));

    return {
      vehicleType: vehicleTypeMapping[answers.carType] || 'PKW',
      vehicleBrand: answers.carMake,
      vehicleModel: answers.carModel,
      vehicleYear: answers.carYear,
      paintType: paintTypeMapping[answers.paintType] || 'Uni',
      paintColor: answers.paintColor,
      primaryProblem: uniqueProblems,
      careFrequency:
        careFrequencyMapping[answers.timeInvestment] || 'Monatlich',
      experienceLevel:
        experienceLevelMapping[answers.experienceLevel] || 'Anfänger',
      budget: budgetMapping[answers.totalBudget] || { min: 50, max: 200 },
      timeAvailable: answers.timeInvestment,
      season: getCurrentSeason(),
      preferredBrands: undefined, // Can be extended based on previous purchases
    };
  }

  /**
   * Validiert Fragebogen-Antworten vor der Transformation
   */
  static validateAnswers(answers: QuestionnaireAnswers): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields
    if (!answers.carMake) errors.push('Fahrzeugmarke ist erforderlich');
    if (!answers.carType) errors.push('Fahrzeugtyp ist erforderlich');
    if (!answers.carYear || answers.carYear < 1990 || answers.carYear > 2025) {
      errors.push('Gültiges Baujahr ist erforderlich (1990-2025)');
    }
    if (!answers.paintType) errors.push('Lacktyp ist erforderlich');
    if (!answers.experienceLevel)
      errors.push('Erfahrungslevel ist erforderlich');
    if (!answers.primaryGoal) errors.push('Hauptziel ist erforderlich');
    if (!answers.totalBudget) errors.push('Budget ist erforderlich');

    // Paint condition validation
    if (
      answers.paintCondition !== undefined &&
      (answers.paintCondition < 1 || answers.paintCondition > 10)
    ) {
      errors.push('Lackzustand muss zwischen 1 und 10 liegen');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Erstellt eine Zusammenfassung der Antworten für Debugging/Logging
   */
  static createSummary(answers: QuestionnaireAnswers): string {
    const transformed = this.transformToCustomerAnswers(answers);
    return (
      `Vehicle: ${transformed.vehicleBrand} ${transformed.vehicleType} (${transformed.vehicleYear}), ` +
      `Paint: ${transformed.paintType} ${transformed.paintColor || ''}, ` +
      `Experience: ${transformed.experienceLevel}, ` +
      `Problems: ${transformed.primaryProblem.join(', ')}, ` +
      `Budget: €${transformed.budget?.min}-${transformed.budget?.max}`
    );
  }
}
