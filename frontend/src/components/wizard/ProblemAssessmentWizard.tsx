import { useState } from 'react';

interface WizardStep {
  id: string;
  question: string;
  options: string[];
  nextStep?: (answer: string) => string;
}

interface Shop {
  name: string;
  price: string;
  link: string;
  shipping: string;
}

interface Product {
  product: string;
  price: string;
  reason: string;
  application?: string;
  note?: string;
  frequency?: string;
  shops?: Shop[];
}

interface Recommendation {
  problem: string;
  cause: string;
  solution: {
    primary: Product;
    secondary: Product;
    prevention: Product;
  };
  summary: {
    totalCost: string;
    timeRequired: string;
    difficultyLevel: string;
    expectedResult: string;
  };
}

export default function ProblemAssessmentWizard() {
  const [currentStep, setCurrentStep] = useState<string>('step1');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const wizardSteps: Record<string, WizardStep> = {
    step1: {
      id: 'step1',
      question: 'Was möchten Sie an Ihrem Auto pflegen?',
      options: ['Lack', 'Innenraum', 'Felgen', 'Glas', 'Komplettaufbereitung'],
      nextStep: (answer) =>
        answer === 'Lack' ? 'step2_lack' : 'step2_general',
    },
    step2_lack: {
      id: 'step2_lack',
      question: 'Welche Farbe hat Ihr Auto?',
      options: ['Schwarz', 'Weiß', 'Grau/Silber', 'Rot/Blau', 'Metallic/Pearl'],
      nextStep: () => 'step3_problem',
    },
    step2_general: {
      id: 'step2_general',
      question: 'Beschreiben Sie Ihr Problem genauer:',
      options: ['Verschmutzung', 'Beschädigung', 'Pflege/Schutz', 'Reparatur'],
      nextStep: () => 'step4_experience',
    },
    step3_problem: {
      id: 'step3_problem',
      question: 'Was ist das Hauptproblem mit dem Lack?',
      options: [
        'Schleier/Hologramme',
        'Kratzer/Swirls',
        'Matt geworden',
        'Wasserflecken',
        'Oxidation/Verwitterung',
      ],
      nextStep: () => 'step4_experience',
    },
    step4_experience: {
      id: 'step4_experience',
      question: 'Wie erfahren sind Sie mit Autopflege?',
      options: [
        'Anfänger (erste Schritte)',
        'Fortgeschritten (regelmäßige Pflege)',
        'Profi (detaillierte Aufbereitung)',
      ],
      nextStep: () => 'step5_budget',
    },
    step5_budget: {
      id: 'step5_budget',
      question: 'Was ist Ihr Budget für die Lösung?',
      options: [
        'Bis 25€ (Basis-Lösung)',
        '25-50€ (Standard)',
        '50-100€ (Premium)',
        'Über 100€ (Profi-Setup)',
      ],
      nextStep: () => 'complete',
    },
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentStep]: answer };
    setAnswers(newAnswers);

    const step = wizardSteps[currentStep];
    const nextStepId = step.nextStep?.(answer);

    if (nextStepId === 'complete') {
      setIsComplete(true);
      generateRecommendation(newAnswers);
    } else if (nextStepId) {
      setCurrentStep(nextStepId);
    }
  };

  const generateRecommendation = async (assessment: Record<string, string>) => {
    // Hier würden wir unsere Recommendation Engine aufrufen
    const mockRecommendation = {
      problem: 'Schleier und Hologramme auf schwarzem Lack',
      cause:
        'Meist durch falsche Polituranwendung oder minderwertige Tücher entstanden',

      solution: {
        primary: {
          product: 'Menzerna Super Finish 3500',
          price: '€29.99',
          reason:
            'Speziell für Anfänger geeignet, entfernt Schleier schonend ohne Risiko',
          application:
            'Mit Mikrofasertuch in kreisenden Bewegungen auftragen, dann abnehmen',
          shops: [
            {
              name: 'Amazon',
              price: '€29.99',
              link: 'https://amazon.de/...',
              shipping: 'Prime',
            },
            {
              name: 'ATU',
              price: '€32.50',
              link: 'https://atu.de/...',
              shipping: '2-3 Tage',
            },
            {
              name: 'Autodoc',
              price: '€27.90',
              link: 'https://autodoc.de/...',
              shipping: '1-2 Tage',
            },
          ],
        },

        secondary: {
          product: 'Chemical Guys Microfiber Towel Set',
          price: '€18.99',
          reason: 'Hochwertige Tücher verhindern neue Schleier beim Auftragen',
          note: 'Essentiell für schlierfreie Anwendung - nie ohne verwenden!',
        },

        prevention: {
          product: 'Sonax Xtreme Spray Wax',
          price: '€12.95',
          reason:
            'Schützt vor zukünftigen Problemen und erleichtert die Reinigung',
          frequency: 'Nach jeder Wäsche anwenden für dauerhaften Schutz',
        },
      },

      summary: {
        totalCost: '€61.84',
        timeRequired: '45-60 Minuten',
        difficultyLevel: 'Einfach (Anfänger geeignet)',
        expectedResult: 'Schlierfreier, glänzender schwarzer Lack',
      },
    };

    setRecommendation(mockRecommendation);
  };

  const resetWizard = () => {
    setCurrentStep('step1');
    setAnswers({});
    setIsComplete(false);
    setRecommendation(null);
  };

  if (isComplete && recommendation) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Ihre persönliche Lösung
          </h2>
          <p className="text-gray-600">
            Basierend auf Ihren Angaben haben wir die perfekte Lösung für Sie
            gefunden
          </p>
        </div>

        {/* Problem Identification */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">🔍 Ihr Problem:</h3>
          <p className="text-red-700">{recommendation.problem}</p>
          <p className="text-red-600 text-sm mt-1">
            <strong>Ursache:</strong> {recommendation.cause}
          </p>
        </div>

        {/* Main Solution */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
          <h3 className="font-semibold text-green-800 mb-3">
            🏆 Hauptlösung: {recommendation.solution.primary.product}
          </h3>
          <p className="text-green-700 mb-3">
            {recommendation.solution.primary.reason}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Anwendung:</strong>{' '}
            {recommendation.solution.primary.application}
          </p>

          {/* Price Comparison */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium mb-3">💰 Preisvergleich:</h4>
            <div className="space-y-2">
              {recommendation.solution.primary.shops?.map(
                (shop: Shop, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
                  >
                    <div>
                      <span className="font-medium">{shop.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({shop.shipping})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{shop.price}</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Zum Shop
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Additional Products */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              🧽 {recommendation.solution.secondary.product}
            </h4>
            <p className="text-blue-700 text-sm mb-2">
              {recommendation.solution.secondary.reason}
            </p>
            <p className="text-blue-600 font-medium">
              {recommendation.solution.secondary.price}
            </p>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              ⚠️ {recommendation.solution.secondary.note}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">
              🛡️ {recommendation.solution.prevention.product}
            </h4>
            <p className="text-purple-700 text-sm mb-2">
              {recommendation.solution.prevention.reason}
            </p>
            <p className="text-purple-600 font-medium">
              {recommendation.solution.prevention.price}
            </p>
            <p className="text-xs text-purple-600 mt-2">
              📅 {recommendation.solution.prevention.frequency}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            📋 Zusammenfassung
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {recommendation.summary.totalCost}
              </div>
              <div className="text-sm text-gray-600">Gesamtkosten</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {recommendation.summary.timeRequired}
              </div>
              <div className="text-sm text-gray-600">Zeitaufwand</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {recommendation.summary.difficultyLevel}
              </div>
              <div className="text-sm text-gray-600">Schwierigkeit</div>
            </div>
            <div>
              <div className="text-2xl">✨</div>
              <div className="text-sm text-gray-600">
                {recommendation.summary.expectedResult}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetWizard}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Neue Beratung starten
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Lösung als PDF speichern
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = wizardSteps[currentStep];
  const progress = (Object.keys(answers).length / 5) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Schritt {Object.keys(answers).length + 1} von 5</span>
          <span>{Math.round(progress)}% abgeschlossen</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {currentStepData?.question}
        </h2>
        <p className="text-gray-600">
          Wählen Sie die passende Option für eine personalisierte Empfehlung
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentStepData?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3"></div>
              <span className="font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Back Button */}
      {Object.keys(answers).length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const answerKeys = Object.keys(answers);
              const previousStep = answerKeys[answerKeys.length - 1];
              const newAnswers = { ...answers };
              delete newAnswers[previousStep];
              setAnswers(newAnswers);

              // Determine previous step
              if (answerKeys.length === 1) {
                setCurrentStep('step1');
              } else {
                // Logic to determine previous step based on answers
                setCurrentStep(previousStep);
              }
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Zurück zur vorherigen Frage
          </button>
        </div>
      )}
    </div>
  );
}
