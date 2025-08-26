// AutoCare Advisor - Problem Assessment Configuration

export interface ProblemCategory {
  problem: string;
  severity: 'niedrig' | 'mittel' | 'hoch';
  solutions: string[];
}

export interface AssessmentStep {
  question: string;
  options: string[];
  nextStep?: (answer: string) => string;
}

export const problemCategories = {
  lackProbleme: {
    schwarzerLack: [
      {
        problem: 'schleier_hologramme',
        severity: 'hoch' as const,
        solutions: ['politur', 'compound', 'microfiber_tuecher'],
      },
      {
        problem: 'kratzer_swirls',
        severity: 'mittel' as const,
        solutions: ['schleifpolitur', 'scratch_remover', 'microfiber'],
      },
      {
        problem: 'oxidation',
        severity: 'hoch' as const,
        solutions: ['compound', 'wachs', 'versiegelung'],
      },
      {
        problem: 'wasserflecken',
        severity: 'niedrig' as const,
        solutions: ['detailer', 'quick_wax', 'wasserfleckenentferner'],
      },
    ],
    helle_farben: [
      {
        problem: 'vergilbung',
        severity: 'mittel' as const,
        solutions: ['bleaching_compound', 'politur'],
      },
      {
        problem: 'kratzer',
        severity: 'niedrig' as const,
        solutions: ['scratch_remover', 'politur'],
      },
    ],
    metallic_pearl: [
      {
        problem: 'matt_geworden',
        severity: 'hoch' as const,
        solutions: ['gloss_enhancer', 'compound'],
      },
      {
        problem: 'orange_peel',
        severity: 'hoch' as const,
        solutions: ['wet_sanding', 'compound'],
      },
    ],
  },

  innenraumProbleme: [
    {
      problem: 'leder_risse',
      severity: 'mittel' as const,
      solutions: ['leder_conditioner', 'reparatur_kit'],
    },
    {
      problem: 'kunststoff_grau',
      severity: 'niedrig' as const,
      solutions: ['kunststoff_tiefenpflege'],
    },
    {
      problem: 'flecken_sitze',
      severity: 'mittel' as const,
      solutions: ['textil_reiniger', 'dampfreiniger'],
    },
  ],

  felgenProbleme: [
    {
      problem: 'bremsstaub',
      severity: 'niedrig' as const,
      solutions: ['felgenreiniger_sauer', 'eisenentferner'],
    },
    {
      problem: 'korrosion',
      severity: 'hoch' as const,
      solutions: ['felgenreiniger_neutral', 'versiegelung'],
    },
  ],
};

export const assessmentFlow: Record<string, AssessmentStep> = {
  step1: {
    question: 'Was möchten Sie an Ihrem Auto pflegen?',
    options: ['Lack', 'Innenraum', 'Felgen', 'Glas', 'Komplettaufbereitung'],
  },
  step2_lack: {
    question: 'Welche Farbe hat Ihr Auto?',
    options: ['Schwarz', 'Weiß', 'Grau/Silber', 'Rot/Blau', 'Metallic/Pearl'],
  },
  step2_general: {
    question: 'Beschreiben Sie Ihr Problem genauer:',
    options: ['Verschmutzung', 'Beschädigung', 'Pflege/Schutz', 'Reparatur'],
  },
  step3_problem: {
    question: 'Was ist das Hauptproblem mit dem Lack?',
    options: [
      'Schleier/Hologramme',
      'Kratzer/Swirls',
      'Matt geworden',
      'Wasserflecken',
      'Oxidation/Verwitterung',
    ],
  },
  step4_experience: {
    question: 'Wie erfahren sind Sie mit Autopflege?',
    options: [
      'Anfänger (erste Schritte)',
      'Fortgeschritten (regelmäßige Pflege)',
      'Profi (detaillierte Aufbereitung)',
    ],
  },
  step5_budget: {
    question: 'Was ist Ihr Budget für die Lösung?',
    options: [
      'Bis 25€ (Basis-Lösung)',
      '25-50€ (Standard)',
      '50-100€ (Premium)',
      'Über 100€ (Profi-Setup)',
    ],
  },
};

// Product Database - wird später aus API geladen
export const productDatabase = {
  menzerna_super_finish: {
    name: 'Menzerna Super Finish 3500',
    category: 'politur',
    problems: ['schleier_hologramme', 'kratzer_swirls'],
    difficulty: 'anfaenger',
    price_range: '25-35',
    description: 'Speziell für Anfänger geeignete Hochglanzpolitur',
  },
  chemical_guys_microfiber: {
    name: 'Chemical Guys Microfiber Towel Set',
    category: 'zubehoer',
    problems: ['schleier_hologramme', 'kratzer_swirls'],
    difficulty: 'alle',
    price_range: '15-25',
    description: 'Premium Mikrofasertücher für schlierfreie Anwendung',
  },
  sonax_spray_wax: {
    name: 'Sonax Xtreme Spray Wax',
    category: 'schutz',
    problems: ['schutz', 'glanz'],
    difficulty: 'anfaenger',
    price_range: '10-15',
    description: 'Einfach anzuwendender Sprühwachs für schnellen Schutz',
  },
};

// Shop Configuration
export const partnerShops = [
  {
    name: 'Amazon',
    commission: 5,
    shipping: 'Prime',
    specialty: 'Große Auswahl, schnelle Lieferung',
  },
  {
    name: 'ATU',
    commission: 8,
    shipping: '2-3 Tage',
    specialty: 'Fachberatung, lokale Verfügbarkeit',
  },
  {
    name: 'Autodoc',
    commission: 12,
    shipping: '1-2 Tage',
    specialty: 'Professionelle Produkte, günstige Preise',
  },
];
