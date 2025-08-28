import mongoose, { Document, Schema } from 'mongoose';

// Types for questionnaire structure
export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  weight: number;
}

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text' | 'range';
  text: string;
  description: string;
  options: QuestionOption[];
  required: boolean;
  weight: number;
  order: number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Updated interface to match frontend structure
export interface QuestionnaireAnswers extends Document {
  sessionId: string;
  userId?: string;
  
  // Directly store answers as key-value pairs (matching frontend)
  answers: Record<string, any>;
  
  // Additional metadata
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireAnswersSchema = new Schema<QuestionnaireAnswers>({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: false },
  
  // Store all answers as flexible object
  answers: { type: Schema.Types.Mixed, required: true, default: {} },
  
  // Metadata
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

// Indexes for performance
QuestionnaireAnswersSchema.index({ sessionId: 1 });
QuestionnaireAnswersSchema.index({ userId: 1 });
QuestionnaireAnswersSchema.index({ createdAt: -1 });
QuestionnaireAnswersSchema.index({ isCompleted: 1, createdAt: -1 });

export const QuestionnaireAnswers = mongoose.model<QuestionnaireAnswers>('QuestionnaireAnswers', QuestionnaireAnswersSchema);

// Complete questionnaire structure (synchronized with frontend)
export const QUESTIONNAIRE_STRUCTURE: Question[] = [
  {
    id: 'carMake',
    type: 'single',
    text: 'Welche Fahrzeugmarke fährst du?',
    description: 'Die Marke hilft uns bei spezifischen Empfehlungen',
    options: [
      { id: 'audi', text: 'Audi', value: 'Audi', weight: 1 },
      { id: 'bmw', text: 'BMW', value: 'BMW', weight: 1 },
      { id: 'mercedes', text: 'Mercedes-Benz', value: 'Mercedes-Benz', weight: 1 },
      { id: 'volkswagen', text: 'Volkswagen', value: 'Volkswagen', weight: 1 },
      { id: 'porsche', text: 'Porsche', value: 'Porsche', weight: 2 },
      { id: 'toyota', text: 'Toyota', value: 'Toyota', weight: 1 },
      { id: 'honda', text: 'Honda', value: 'Honda', weight: 1 },
      { id: 'nissan', text: 'Nissan', value: 'Nissan', weight: 1 },
      { id: 'mazda', text: 'Mazda', value: 'Mazda', weight: 1 },
      { id: 'ford', text: 'Ford', value: 'Ford', weight: 1 },
      { id: 'opel', text: 'Opel', value: 'Opel', weight: 1 },
      { id: 'peugeot', text: 'Peugeot', value: 'Peugeot', weight: 1 },
      { id: 'renault', text: 'Renault', value: 'Renault', weight: 1 },
      { id: 'citroen', text: 'Citroën', value: 'Citroën', weight: 1 },
      { id: 'skoda', text: 'Skoda', value: 'Skoda', weight: 1 },
      { id: 'seat', text: 'SEAT', value: 'SEAT', weight: 1 },
      { id: 'volvo', text: 'Volvo', value: 'Volvo', weight: 1 },
      { id: 'jaguar', text: 'Jaguar', value: 'Jaguar', weight: 2 },
      { id: 'landrover', text: 'Land Rover', value: 'Land Rover', weight: 2 },
      { id: 'lexus', text: 'Lexus', value: 'Lexus', weight: 2 },
      { id: 'infiniti', text: 'Infiniti', value: 'Infiniti', weight: 2 },
      { id: 'tesla', text: 'Tesla', value: 'Tesla', weight: 1 },
      { id: 'hyundai', text: 'Hyundai', value: 'Hyundai', weight: 1 },
      { id: 'kia', text: 'Kia', value: 'Kia', weight: 1 },
      { id: 'sonstige', text: 'Sonstige', value: 'Sonstige', weight: 1 },
    ],
    required: true,
    weight: 2,
    order: 1,
  },
  
  {
    id: 'carModel',
    type: 'text',
    text: 'Welches Modell und welche Baureihe hat dein Fahrzeug?',
    description: 'Beispiel: A4 B9, 3er G20, C-Klasse W205',
    options: [],
    required: true,
    weight: 1,
    order: 2,
    placeholder: 'z.B. A4 B9, 3er G20, C-Klasse W205',
  },

  {
    id: 'carYear',
    type: 'range',
    text: 'In welchem Jahr wurde dein Fahrzeug erstmals zugelassen?',
    description: 'Das Alter beeinflusst die Pflegeanforderungen',
    options: [],
    required: true,
    weight: 2,
    order: 3,
    min: 1990,
    max: 2025,
    step: 1,
  },

  {
    id: 'carType',
    type: 'single',
    text: 'Welche Karosserieform hat dein Fahrzeug?',
    description: 'Die Form beeinflusst Reinigungsaufwand und Produktwahl',
    options: [
      { id: 'limousine', text: 'Limousine', value: 'Limousine', weight: 1 },
      { id: 'kombi', text: 'Kombi/Touring', value: 'Kombi/Touring', weight: 1 },
      { id: 'suv', text: 'SUV/SAV', value: 'SUV/SAV', weight: 1 },
      { id: 'coupe', text: 'Coupé', value: 'Coupé', weight: 1 },
      { id: 'cabrio', text: 'Cabrio/Roadster', value: 'Cabrio/Roadster', weight: 2 },
      { id: 'kleinwagen', text: 'Kleinwagen', value: 'Kleinwagen', weight: 1 },
      { id: 'van', text: 'Van/MPV', value: 'Van/MPV', weight: 1 },
      { id: 'pickup', text: 'Pick-up', value: 'Pick-up', weight: 2 },
    ],
    required: true,
    weight: 2,
    order: 4,
  },

  {
    id: 'currentMileage',
    type: 'single',
    text: 'Wie viele Kilometer hat dein Fahrzeug bereits gelaufen?',
    description: 'Die Laufleistung gibt Aufschluss über den Pflegezustand',
    options: [
      { id: 'under10k', text: 'Unter 10.000 km', value: 'Unter 10.000 km', weight: 1 },
      { id: '10k-30k', text: '10.000-30.000 km', value: '10.000-30.000 km', weight: 1 },
      { id: '30k-60k', text: '30.000-60.000 km', value: '30.000-60.000 km', weight: 1 },
      { id: '60k-100k', text: '60.000-100.000 km', value: '60.000-100.000 km', weight: 2 },
      { id: '100k-150k', text: '100.000-150.000 km', value: '100.000-150.000 km', weight: 2 },
      { id: '150k-200k', text: '150.000-200.000 km', value: '150.000-200.000 km', weight: 3 },
      { id: '200k-300k', text: '200.000-300.000 km', value: '200.000-300.000 km', weight: 3 },
      { id: 'over300k', text: 'Über 300.000 km', value: 'Über 300.000 km', weight: 4 },
    ],
    required: true,
    weight: 2,
    order: 5,
  },

  {
    id: 'paintType',
    type: 'single',
    text: 'Welche Art von Lackierung hat dein Fahrzeug? (Schau dir den Lack bei Sonnenlicht an)',
    description: 'Verschiedene Lacktypen benötigen unterschiedliche Pflegeprodukte',
    options: [
      { id: 'metallic', text: 'Metallic-Lack (mit Glitzerpartikeln)', value: 'Metallic-Lack (mit Glitzerpartikeln)', weight: 1 },
      { id: 'pearl', text: 'Perlmutt-/Perleffekt-Lack', value: 'Perlmutt-/Perleffekt-Lack', weight: 2 },
      { id: 'solid', text: 'Uni-Lack (einfarbig)', value: 'Uni-Lack (einfarbig)', weight: 1 },
      { id: 'matte', text: 'Matt-Lack', value: 'Matt-Lack', weight: 3 },
      { id: 'unsure', text: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
    required: true,
    weight: 3,
    order: 6,
  },

  {
    id: 'paintColor',
    type: 'single',
    text: 'Welche Hauptfarbe hat dein Fahrzeug? (Die Farbe beeinflusst die Pflege-Empfehlung)',
    description: 'Verschiedene Farben zeigen Verschmutzung und Kratzer unterschiedlich stark',
    options: [
      { id: 'schwarz', text: 'Schwarz (zeigt jeden Kratzer)', value: 'schwarz', weight: 4 },
      { id: 'weiss', text: 'Weiß (zeigt Verschmutzung stark)', value: 'weiss', weight: 2 },
      { id: 'silber', text: 'Silber (verzeiht kleine Fehler)', value: 'silber', weight: 1 },
      { id: 'grau', text: 'Grau (mittlere Ansprüche)', value: 'grau', weight: 1 },
      { id: 'rot', text: 'Rot (neigt zu Verblassen)', value: 'rot', weight: 2 },
      { id: 'blau', text: 'Blau (pflegeleicht)', value: 'blau', weight: 1 },
      { id: 'andere', text: 'Andere Farbe', value: 'andere', weight: 1 },
    ],
    required: true,
    weight: 3,
    order: 7,
  },

  {
    id: 'paintCondition',
    type: 'range',
    text: 'Wie würdest du den aktuellen Zustand deines Lacks bewerten? (1 = sehr schlecht, 10 = perfekt)',
    description: 'Eine ehrliche Bewertung hilft bei der richtigen Produktauswahl',
    options: [],
    required: true,
    weight: 4,
    order: 8,
    min: 1,
    max: 10,
    step: 1,
  },

  {
    id: 'specificProblems',
    type: 'multiple',
    text: 'Welche spezifischen Lackprobleme kannst du an deinem Fahrzeug erkennen? (Mehrfachauswahl möglich)',
    description: 'Spezifische Probleme erfordern gezielte Lösungen',
    options: [
      { id: 'swirls', text: 'Feine Kratzer/Swirl-Marks', value: 'Feine Kratzer/Swirl-Marks', weight: 3 },
      { id: 'deep_scratches', text: 'Tiefe Einzelkratzer', value: 'Tiefe Einzelkratzer', weight: 4 },
      { id: 'water_spots', text: 'Wasserflecken', value: 'Wasserflecken', weight: 2 },
      { id: 'dull_paint', text: 'Matter Glanz', value: 'Matter Glanz', weight: 3 },
      { id: 'bird_damage', text: 'Vogelkot-Schäden', value: 'Vogelkot-Schäden', weight: 2 },
      { id: 'no_problems', text: 'Keine sichtbaren Probleme', value: 'Keine sichtbaren Probleme', weight: 1 },
    ],
    required: false,
    weight: 3,
    order: 9,
  },

  {
    id: 'parkingPrimary',
    type: 'single',
    text: 'Wo parkst du dein Fahrzeug normalerweise? (Der Stellplatz beeinflusst die Pflegeanforderungen)',
    description: 'Schutz vor Umwelteinflüssen ist wichtig für die Lackpflege',
    options: [
      { id: 'garage', text: 'Garage (geschlossen)', value: 'Garage (geschlossen)', weight: 1 },
      { id: 'carport', text: 'Carport', value: 'Carport', weight: 2 },
      { id: 'private', text: 'Privater Stellplatz', value: 'Privater Stellplatz', weight: 2 },
      { id: 'street', text: 'Straße/Öffentlich', value: 'Straße/Öffentlich', weight: 4 },
      { id: 'underground', text: 'Tiefgarage', value: 'Tiefgarage', weight: 1 },
    ],
    required: true,
    weight: 3,
    order: 10,
  },

  {
    id: 'environmentalExposure',
    type: 'multiple',
    text: 'Welchen Umweltbelastungen ist dein Fahrzeug am Stellplatz regelmäßig ausgesetzt? (Mehrfachauswahl möglich)',
    description: 'Umwelteinflüsse bestimmen die Schutzanforderungen',
    options: [
      { id: 'sun', text: 'Viel Sonne (>6h täglich)', value: 'Viel Sonne (>6h täglich)', weight: 3 },
      { id: 'salt_air', text: 'Salzluft (Meer <30km)', value: 'Salzluft (Meer <30km)', weight: 4 },
      { id: 'industrial', text: 'Industriegebiet', value: 'Industriegebiet', weight: 4 },
      { id: 'trees', text: 'Bäume in der Nähe', value: 'Bäume in der Nähe', weight: 2 },
      { id: 'urban', text: 'Städtischer Bereich', value: 'Städtischer Bereich', weight: 2 },
      { id: 'none', text: 'Keine besonderen Belastungen', value: 'Keine besonderen Belastungen', weight: 1 },
    ],
    required: true,
    weight: 3,
    order: 11,
  },

  {
    id: 'annualMileage',
    type: 'single',
    text: 'Wie viele Kilometer fährst du ungefähr pro Jahr mit deinem Fahrzeug?',
    description: 'Die Fahrleistung beeinflusst die Pflegefrequenz',
    options: [
      { id: 'under5k', text: 'Unter 5.000 km', value: 'Unter 5.000 km', weight: 1 },
      { id: '5k-15k', text: '5.000 - 15.000 km', value: '5.000 - 15.000 km', weight: 1 },
      { id: '15k-25k', text: '15.000 - 25.000 km', value: '15.000 - 25.000 km', weight: 2 },
      { id: '25k-40k', text: '25.000 - 40.000 km', value: '25.000 - 40.000 km', weight: 3 },
      { id: 'over40k', text: 'Über 40.000 km', value: 'Über 40.000 km', weight: 4 },
    ],
    required: true,
    weight: 2,
    order: 12,
  },

  {
    id: 'primaryGoal',
    type: 'single',
    text: 'Was ist dein wichtigstes Ziel bei der Autopflege?',
    description: 'Dein Hauptziel bestimmt die Produktauswahl',
    options: [
      { id: 'max_gloss', text: 'Maximaler Glanz', value: 'Maximaler Glanz', weight: 2 },
      { id: 'protection', text: 'Langzeit-Schutz', value: 'Langzeit-Schutz', weight: 3 },
      { id: 'scratch_removal', text: 'Kratzer entfernen', value: 'Kratzer entfernen', weight: 4 },
      { id: 'easy_care', text: 'Einfache Pflege', value: 'Einfache Pflege', weight: 1 },
      { id: 'value_preservation', text: 'Werterhalt', value: 'Werterhalt', weight: 2 },
    ],
    required: true,
    weight: 4,
    order: 13,
  },

  {
    id: 'timeInvestment',
    type: 'single',
    text: 'Wie viel Zeit möchtest du normalerweise pro Pflegedurchgang investieren?',
    description: 'Die verfügbare Zeit bestimmt die Produktkomplexität',
    options: [
      { id: '15-30min', text: '15-30 Minuten', value: '15-30 Minuten', weight: 1 },
      { id: '30-60min', text: '30-60 Minuten', value: '30-60 Minuten', weight: 1 },
      { id: '1-2h', text: '1-2 Stunden', value: '1-2 Stunden', weight: 2 },
      { id: '2-4h', text: '2-4 Stunden', value: '2-4 Stunden', weight: 3 },
      { id: 'over4h', text: 'Mehr als 4 Stunden', value: 'Mehr als 4 Stunden', weight: 4 },
    ],
    required: true,
    weight: 3,
    order: 14,
  },

  {
    id: 'experienceLevel',
    type: 'single',
    text: 'Wie schätzt du deine Erfahrung und dein Wissen in der Autopflege ein?',
    description: 'Dein Erfahrungslevel bestimmt die Produktkomplexität',
    options: [
      { id: 'beginner', text: 'Anfänger', value: 'Anfänger', weight: 1 },
      { id: 'basic', text: 'Grundkenntnisse', value: 'Grundkenntnisse', weight: 2 },
      { id: 'advanced', text: 'Fortgeschritten', value: 'Fortgeschritten', weight: 3 },
      { id: 'expert', text: 'Sehr erfahren', value: 'Sehr erfahren', weight: 4 },
      { id: 'pro', text: 'Profi-Level', value: 'Profi-Level', weight: 5 },
    ],
    required: true,
    weight: 3,
    order: 15,
  },

  {
    id: 'availableEquipment',
    type: 'multiple',
    text: 'Welche Ausrüstung und Hilfsmittel stehen dir für die Autopflege zur Verfügung? (Mehrfachauswahl möglich)',
    description: 'Verfügbare Ausrüstung erweitert die Produktmöglichkeiten',
    options: [
      { id: 'pressure_washer', text: 'Hochdruckreiniger', value: 'Hochdruckreiniger', weight: 2 },
      { id: 'polisher', text: 'Poliermaschine', value: 'Poliermaschine', weight: 4 },
      { id: 'microfiber', text: 'Mikrofasertücher', value: 'Mikrofasertücher', weight: 2 },
      { id: 'basic_only', text: 'Nur Basis-Ausstattung', value: 'Nur Basis-Ausstattung', weight: 1 },
      { id: 'no_equipment', text: 'Keine spezielle Ausrüstung', value: 'Keine spezielle Ausrüstung', weight: 1 },
    ],
    required: true,
    weight: 2,
    order: 16,
  },

  {
    id: 'totalBudget',
    type: 'single',
    text: 'Welches Budget hast du für eine komplette Grundausstattung an Pflegeprodukten eingeplant?',
    description: 'Das Budget bestimmt die Produktauswahl und -qualität',
    options: [
      { id: 'under50', text: 'Unter 50€', value: 'Unter 50€', weight: 1 },
      { id: '50-100', text: '50€ - 100€', value: '50€ - 100€', weight: 2 },
      { id: '100-200', text: '100€ - 200€', value: '100€ - 200€', weight: 3 },
      { id: '200-350', text: '200€ - 350€', value: '200€ - 350€', weight: 4 },
      { id: 'over350', text: 'Über 350€', value: 'Über 350€', weight: 5 },
    ],
    required: true,
    weight: 3,
    order: 17,
  },
];