'use client';

import {
  TruckIcon as CarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CogIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Question Types
type QuestionType = 'radio' | 'checkbox' | 'select' | 'slider' | 'text';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

interface QuestionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: Question[];
}

// Questionnaire Data
const questionSteps: QuestionStep[] = [
  {
    id: 'vehicle',
    title: 'Ihr Fahrzeug',
    description: 'Erzählen Sie uns mehr über Ihr Auto',
    icon: CarIcon,
    questions: [
      {
        id: 'carMake',
        text: 'Welche Automarke fahren Sie?',
        type: 'select',
        required: true,
        options: [
          'BMW',
          'Mercedes',
          'Audi',
          'Volkswagen',
          'Toyota',
          'Honda',
          'Ford',
          'Opel',
          'Peugeot',
          'Renault',
          'Andere',
        ],
      },
      {
        id: 'carModel',
        text: 'Welches Modell ist es?',
        type: 'text',
        required: true,
        placeholder: 'z.B. 3er, C-Klasse, A4, Golf...',
      },
      {
        id: 'carYear',
        text: 'Aus welchem Jahr ist Ihr Fahrzeug?',
        type: 'slider',
        required: true,
        min: 1990,
        max: 2025,
        step: 1,
      },
      {
        id: 'carType',
        text: 'Welcher Fahrzeugtyp?',
        type: 'radio',
        required: true,
        options: [
          'Limousine',
          'Kombi',
          'SUV',
          'Cabrio',
          'Coupé',
          'Kleinwagen',
          'Van/Transporter',
        ],
      },
      {
        id: 'paintType',
        text: 'Welchen Lacktyp hat Ihr Auto?',
        type: 'radio',
        required: true,
        options: [
          'Metallic-Lack',
          'Perlmutt-Lack',
          'Uni-Lack',
          'Matt-Lack',
          'Weiß ich nicht',
        ],
      },
      {
        id: 'carColor',
        text: 'Welche Farbe hat Ihr Fahrzeug?',
        type: 'select',
        required: true,
        options: [
          'Schwarz',
          'Weiß',
          'Silber',
          'Grau',
          'Blau',
          'Rot',
          'Grün',
          'Gelb',
          'Braun',
          'Andere',
        ],
      },
      {
        id: 'mileage',
        text: 'Wie viele Kilometer hat Ihr Auto?',
        type: 'select',
        required: true,
        options: [
          'Unter 50.000 km',
          '50.000 - 100.000 km',
          '100.000 - 150.000 km',
          '150.000 - 200.000 km',
          'Über 200.000 km',
        ],
      },
      {
        id: 'condition',
        text: 'Wie würden Sie den Zustand Ihres Fahrzeugs bewerten?',
        type: 'radio',
        required: true,
        options: [
          'Wie neu',
          'Sehr gut',
          'Gut',
          'Befriedigend',
          'Sanierungsbedürftig',
        ],
      },
    ],
  },
  {
    id: 'usage',
    title: 'Nutzung',
    description: 'Wie nutzen Sie Ihr Fahrzeug?',
    icon: CogIcon,
    questions: [
      {
        id: 'drivingStyle',
        text: 'Wo fahren Sie hauptsächlich?',
        type: 'checkbox',
        required: true,
        options: ['Stadt', 'Autobahn', 'Landstraße', 'Gelände/Feld'],
      },
      {
        id: 'parking',
        text: 'Wo parken Sie Ihr Auto normalerweise?',
        type: 'radio',
        required: true,
        options: [
          'Garage',
          'Carport',
          'Straße',
          'Parkplatz (überdacht)',
          'Parkplatz (unüberdacht)',
        ],
      },
      {
        id: 'frequency',
        text: 'Wie oft nutzen Sie Ihr Fahrzeug?',
        type: 'radio',
        required: true,
        options: [
          'Täglich',
          'Mehrmals pro Woche',
          'Wöchentlich',
          'Gelegentlich',
          'Selten',
        ],
      },
      {
        id: 'annualMileage',
        text: 'Wie viele Kilometer fahren Sie pro Jahr?',
        type: 'select',
        required: true,
        options: [
          'Unter 10.000 km',
          '10.000 - 20.000 km',
          '20.000 - 30.000 km',
          '30.000 - 50.000 km',
          'Über 50.000 km',
        ],
      },
      {
        id: 'weatherExposure',
        text: 'Ist Ihr Auto oft schlechtem Wetter ausgesetzt?',
        type: 'checkbox',
        required: false,
        options: [
          'Regen',
          'Schnee/Eis',
          'Starke Sonne',
          'Salz (Meeresluft/Streusalz)',
          'Hagel',
          'Staub/Sand',
        ],
      },
    ],
  },
  {
    id: 'care',
    title: 'Pflegebedürfnisse',
    description: 'Was möchten Sie an Ihrem Auto pflegen?',
    icon: SparklesIcon,
    questions: [
      {
        id: 'currentProblems',
        text: 'Welche Probleme hat Ihr Auto aktuell?',
        type: 'checkbox',
        required: false,
        options: [
          'Kratzer im Lack',
          'Wasserflecken',
          'Verschmutzung',
          'Oxidation/Verfärbung',
          'Hologramme',
          'Swirl-Marks',
          'Keine besonderen Probleme',
        ],
      },
      {
        id: 'careAreas',
        text: 'Welche Bereiche möchten Sie pflegen?',
        type: 'checkbox',
        required: true,
        options: [
          'Außenlack',
          'Innenraum',
          'Felgen',
          'Reifen',
          'Scheiben',
          'Kunststoffteile',
          'Chromteile',
          'Leder',
        ],
      },
      {
        id: 'experienceLevel',
        text: 'Wie schätzen Sie Ihre Erfahrung in der Autopflege ein?',
        type: 'radio',
        required: true,
        options: ['Anfänger', 'Gelegentlich', 'Erfahren', 'Profi'],
      },
      {
        id: 'timeCommitment',
        text: 'Wie viel Zeit möchten Sie für die Autopflege aufwenden?',
        type: 'radio',
        required: true,
        options: [
          '15-30 Minuten',
          '30-60 Minuten',
          '1-2 Stunden',
          '2-4 Stunden',
          'Einen ganzen Tag',
        ],
      },
      {
        id: 'careFrequency',
        text: 'Wie oft möchten Sie Ihr Auto pflegen?',
        type: 'radio',
        required: true,
        options: [
          'Wöchentlich',
          '2-wöchentlich',
          'Monatlich',
          'Saisonal',
          'Bei Bedarf',
        ],
      },
      {
        id: 'tools',
        text: 'Welche Ausrüstung haben Sie bereits?',
        type: 'checkbox',
        required: false,
        options: [
          'Hochdruckreiniger',
          'Poliermaschine',
          'Mikrofasertücher',
          'Waschhandschuh',
          'Schwämme',
          'Bürsten',
          'Nichts davon',
        ],
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Präferenzen',
    description: 'Ihre persönlichen Vorlieben',
    icon: ShieldCheckIcon,
    questions: [
      {
        id: 'budget',
        text: 'Wie viel möchten Sie für Autopflegeprodukte ausgeben?',
        type: 'radio',
        required: true,
        options: [
          'Unter 50€',
          '50€ - 100€',
          '100€ - 200€',
          '200€ - 500€',
          'Über 500€',
        ],
      },
      {
        id: 'brands',
        text: 'Haben Sie bevorzugte Marken?',
        type: 'checkbox',
        required: false,
        options: [
          'Meguiars',
          'Chemical Guys',
          'Sonax',
          'Gyeon',
          'Koch Chemie',
          'Mothers',
          'Turtle Wax',
          'Keine Präferenz',
        ],
      },
      {
        id: 'ecoFriendly',
        text: 'Ist Ihnen Umweltfreundlichkeit wichtig?',
        type: 'radio',
        required: true,
        options: ['Sehr wichtig', 'Wichtig', 'Etwas wichtig', 'Nicht wichtig'],
      },
      {
        id: 'durability',
        text: 'Wie lange sollen die Pflegeergebnisse halten?',
        type: 'radio',
        required: true,
        options: [
          '1-2 Wochen',
          '1 Monat',
          '3-6 Monate',
          '6-12 Monate',
          'Über 1 Jahr',
        ],
      },
    ],
  },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress
  const totalSteps = questionSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const totalQuestions = questionSteps.reduce(
    (sum, step) => sum + step.questions.length,
    0
  );
  const completedQuestions =
    questionSteps
      .slice(0, currentStep)
      .reduce((sum, step) => sum + step.questions.length, 0) +
      questionSteps[currentStep]?.questions.filter(
        (q) => answers[q.id] !== undefined
      ).length || 0;

  const currentStepData = questionSteps[currentStep];

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (!currentStepData) return false;
    const requiredQuestions = currentStepData.questions.filter(
      (q) => q.required
    );
    return requiredQuestions.every(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ''
    );
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit questionnaire
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionnaire: answers,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const recommendations = await response.json();
        // Store recommendations and navigate to results
        localStorage.setItem(
          'autocare_recommendations',
          JSON.stringify(recommendations)
        );
        router.push('/recommendations');
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render question component
  const renderQuestion = (question: Question) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((o) => o !== option);
                    handleAnswerChange(question.id, newValue);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Bitte wählen...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={value || question.min}
              onChange={(e) =>
                handleAnswerChange(question.id, parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.min}</span>
              <span className="font-medium text-blue-600">
                {value || question.min}
              </span>
              <span>{question.max}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      default:
        return null;
    }
  };

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                🚗 AutoCare Advisor Fragebogen
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>3-4 Minuten</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Schritt {currentStep + 1} von {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {completedQuestions} von {totalQuestions} Fragen beantwortet
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            {currentStepData.questions.map((question) => (
              <div key={question.id} className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900">
                  {question.text}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className={`inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Zurück
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={goToNextStep}
                disabled={!isCurrentStepValid()}
                className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all ${
                  isCurrentStepValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Weiter
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentStepValid() || isSubmitting}
                className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all ${
                  isCurrentStepValid() && !isSubmitting
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Wird verarbeitet...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Empfehlungen erhalten
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
