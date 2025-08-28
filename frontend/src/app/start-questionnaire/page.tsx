'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { QuestionnaireTransformService } from '@/services/questionnaireTransform';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Question Type
interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'select' | 'slider' | 'text';
  required: boolean;
  options?: string[] | { value: string; label: string; description?: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  category: string;
}

// All questions in a flat array - one question per card
const allQuestions: Question[] = [
  // Vehicle Basics
  {
    id: 'carMake',
    text: 'Welche Fahrzeugmarke fährst du?',
    type: 'select',
    required: true,
    category: 'Fahrzeug',
    options: [
      'Audi',
      'BMW',
      'Mercedes-Benz',
      'Volkswagen',
      'Porsche',
      'Toyota',
      'Honda',
      'Nissan',
      'Mazda',
      'Ford',
      'Opel',
      'Peugeot',
      'Renault',
      'Citroën',
      'Skoda',
      'SEAT',
      'Volvo',
      'Jaguar',
      'Land Rover',
      'Lexus',
      'Infiniti',
      'Tesla',
      'Hyundai',
      'Kia',
      'Sonstige',
    ],
  },
  {
    id: 'carModel',
    text: 'Welches Modell und welche Baureihe hat dein Fahrzeug?',
    type: 'text',
    required: true,
    category: 'Fahrzeug',
    placeholder: 'z.B. A4 B9, 3er G20, C-Klasse W205',
  },
  {
    id: 'carYear',
    text: 'In welchem Jahr wurde dein Fahrzeug erstmals zugelassen?',
    type: 'slider',
    required: true,
    category: 'Fahrzeug',
    min: 1990,
    max: 2025,
    step: 1,
  },
  {
    id: 'carType',
    text: 'Welche Karosserieform hat dein Fahrzeug?',
    type: 'radio',
    required: true,
    category: 'Fahrzeug',
    options: [
      'Limousine',
      'Kombi/Touring',
      'SUV/SAV',
      'Coupé',
      'Cabrio/Roadster',
      'Kleinwagen',
      'Van/MPV',
      'Pick-up',
    ],
  },
  {
    id: 'currentMileage',
    text: 'Wie viele Kilometer hat dein Fahrzeug bereits gelaufen?',
    type: 'select',
    required: true,
    category: 'Fahrzeug',
    options: [
      'Unter 10.000 km',
      '10.000-30.000 km',
      '30.000-60.000 km',
      '60.000-100.000 km',
      '100.000-150.000 km',
      '150.000-200.000 km',
      '200.000-300.000 km',
      'Über 300.000 km',
    ],
  },
  // Paint Analysis
  {
    id: 'paintType',
    text: 'Welche Art von Lackierung hat dein Fahrzeug? (Schau dir den Lack bei Sonnenlicht an)',
    type: 'radio',
    required: true,
    category: 'Lack',
    options: [
      'Metallic-Lack (mit Glitzerpartikeln)',
      'Perlmutt-/Perleffekt-Lack',
      'Uni-Lack (einfarbig)',
      'Matt-Lack',
      'Nicht sicher',
    ],
  },
  {
    id: 'paintColor',
    text: 'Welche Hauptfarbe hat dein Fahrzeug? (Die Farbe beeinflusst die Pflege-Empfehlung)',
    type: 'radio',
    required: true,
    category: 'Lack',
    options: [
      {
        value: 'schwarz',
        label: 'Schwarz',
        description: 'Zeigt jeden Kratzer',
      },
      {
        value: 'weiss',
        label: 'Weiß',
        description: 'Zeigt Verschmutzung stark',
      },
      {
        value: 'silber',
        label: 'Silber',
        description: 'Verzeiht kleine Fehler',
      },
      { value: 'grau', label: 'Grau', description: 'Mittlere Ansprüche' },
      { value: 'rot', label: 'Rot', description: 'Neigt zu Verblassen' },
      { value: 'blau', label: 'Blau', description: 'Pflegeleicht' },
      { value: 'andere', label: 'Andere Farbe' },
    ],
  },
  {
    id: 'paintCondition',
    text: 'Wie würdest du den aktuellen Zustand deines Lacks bewerten? (1 = sehr schlecht, 10 = perfekt)',
    type: 'slider',
    required: true,
    category: 'Lack',
    min: 1,
    max: 10,
    step: 1,
  },
  {
    id: 'specificProblems',
    text: 'Welche spezifischen Lackprobleme kannst du an deinem Fahrzeug erkennen? (Mehrfachauswahl möglich)',
    type: 'checkbox',
    required: false,
    category: 'Lack',
    options: [
      'Feine Kratzer/Swirl-Marks',
      'Tiefe Einzelkratzer',
      'Wasserflecken',
      'Matter Glanz',
      'Vogelkot-Schäden',
      'Keine sichtbaren Probleme',
    ],
  },
  // Environment & Usage
  {
    id: 'parkingPrimary',
    text: 'Wo parkst du dein Fahrzeug normalerweise? (Der Stellplatz beeinflusst die Pflegeanforderungen)',
    type: 'radio',
    required: true,
    category: 'Nutzung',
    options: [
      'Garage (geschlossen)',
      'Carport',
      'Privater Stellplatz',
      'Straße/Öffentlich',
      'Tiefgarage',
    ],
  },
  {
    id: 'environmentalExposure',
    text: 'Welchen Umweltbelastungen ist dein Fahrzeug am Stellplatz regelmäßig ausgesetzt? (Mehrfachauswahl möglich)',
    type: 'checkbox',
    required: true,
    category: 'Nutzung',
    options: [
      'Viel Sonne (>6h täglich)',
      'Salzluft (Meer <30km)',
      'Industriegebiet',
      'Bäume in der Nähe',
      'Städtischer Bereich',
      'Keine besonderen Belastungen',
    ],
  },
  {
    id: 'annualMileage',
    text: 'Wie viele Kilometer fährst du ungefähr pro Jahr mit deinem Fahrzeug?',
    type: 'select',
    required: true,
    category: 'Nutzung',
    options: [
      'Unter 5.000 km',
      '5.000 - 15.000 km',
      '15.000 - 25.000 km',
      '25.000 - 40.000 km',
      'Über 40.000 km',
    ],
  },
  // Care Goals
  {
    id: 'primaryGoal',
    text: 'Was ist dein wichtigstes Ziel bei der Autopflege?',
    type: 'radio',
    required: true,
    category: 'Ziele',
    options: [
      'Maximaler Glanz',
      'Langzeit-Schutz',
      'Kratzer entfernen',
      'Einfache Pflege',
      'Werterhalt',
    ],
  },
  {
    id: 'timeInvestment',
    text: 'Wie viel Zeit möchtest du normalerweise pro Pflegedurchgang investieren?',
    type: 'radio',
    required: true,
    category: 'Ziele',
    options: [
      '15-30 Minuten',
      '30-60 Minuten',
      '1-2 Stunden',
      '2-4 Stunden',
      'Mehr als 4 Stunden',
    ],
  },
  // Experience & Equipment
  {
    id: 'experienceLevel',
    text: 'Wie schätzt du deine Erfahrung und dein Wissen in der Autopflege ein?',
    type: 'radio',
    required: true,
    category: 'Erfahrung',
    options: [
      'Anfänger',
      'Grundkenntnisse',
      'Fortgeschritten',
      'Sehr erfahren',
      'Profi-Level',
    ],
  },
  {
    id: 'availableEquipment',
    text: 'Welche Ausrüstung und Hilfsmittel stehen dir für die Autopflege zur Verfügung? (Mehrfachauswahl möglich)',
    type: 'checkbox',
    required: true,
    category: 'Erfahrung',
    options: [
      'Hochdruckreiniger',
      'Poliermaschine',
      'Mikrofasertücher',
      'Nur Basis-Ausstattung',
      'Keine spezielle Ausrüstung',
    ],
  },
  // Budget
  {
    id: 'totalBudget',
    text: 'Welches Budget hast du für eine komplette Grundausstattung an Pflegeprodukten eingeplant?',
    type: 'radio',
    required: true,
    category: 'Budget',
    options: [
      'Unter 50€',
      '50€ - 100€',
      '100€ - 200€',
      '200€ - 350€',
      'Über 350€',
    ],
  },
];

export default function DirectQuestionnairePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  // Initialize session and load progress
  useEffect(() => {
    let storedSessionId = localStorage.getItem('questionnaire_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem('questionnaire_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load previous progress
    loadProgress(storedSessionId);
  }, []);

  // Auto-save progress when answers change
  useEffect(() => {
    if (sessionId && Object.keys(answers).length > 0) {
      saveProgress();
    }
  }, [answers, sessionId]);

  // Save progress to backend
  const saveProgress = async () => {
    if (!sessionId) return;

    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        }/api/questionnaire/save-progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: JSON.stringify({
            sessionId,
            answers,
            currentQuestionIndex,
          }),
        }
      );

      // Also save locally as backup
      localStorage.setItem('questionnaire_answers', JSON.stringify(answers));
      localStorage.setItem(
        'questionnaire_current_index',
        currentQuestionIndex.toString()
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      // Fall back to local storage only
      localStorage.setItem('questionnaire_answers', JSON.stringify(answers));
      localStorage.setItem(
        'questionnaire_current_index',
        currentQuestionIndex.toString()
      );
    }
  };

  // Load progress from backend or local storage
  const loadProgress = async (sessionId: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        }/api/questionnaire/load-progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.answers) {
          setAnswers(data.answers);
          if (data.currentQuestionIndex !== undefined) {
            setCurrentQuestionIndex(data.currentQuestionIndex);
          }
        }
      } else {
        // Fallback to local storage
        const storedAnswers = localStorage.getItem('questionnaire_answers');
        const storedIndex = localStorage.getItem('questionnaire_current_index');

        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
        }
        if (storedIndex) {
          setCurrentQuestionIndex(parseInt(storedIndex, 10));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to local storage
      const storedAnswers = localStorage.getItem('questionnaire_answers');
      const storedIndex = localStorage.getItem('questionnaire_current_index');

      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
      if (storedIndex) {
        setCurrentQuestionIndex(parseInt(storedIndex, 10));
      }
    }
  };

  // Handle Enter key press for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        // Only handle Enter if current question is answered
        // Allow Enter everywhere except in textareas (for multi-line input)
        const activeElement = document.activeElement as HTMLElement;
        const isInTextarea = activeElement?.tagName === 'TEXTAREA';

        if (isCurrentQuestionAnswered() && !isInTextarea) {
          event.preventDefault();
          if (currentQuestionIndex < totalQuestions - 1) {
            goToNext();
          } else {
            handleSubmit();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, totalQuestions, answers, isSubmitting]);

  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const value = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== '';
  };

  // Navigation
  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      localStorage.setItem('questionnaire_current_index', nextIndex.toString());
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      localStorage.setItem('questionnaire_current_index', prevIndex.toString());
    }
  };

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Session ID erstellen/abrufen
      const sessionId =
        localStorage.getItem('questionnaire_session_id') ||
        `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Transform questionnaire answers to CustomerAnswers format
      const questionnaireAnswers = {
        carMake: answers.carMake,
        carModel: answers.carModel,
        carYear: answers.carYear,
        carType: answers.carType,
        currentMileage: answers.currentMileage,
        paintType: answers.paintType,
        paintColor: answers.paintColor,
        paintCondition: answers.paintCondition,
        specificProblems: answers.specificProblems || [],
        parkingPrimary: answers.parkingPrimary,
        environmentalExposure: answers.environmentalExposure || [],
        annualMileage: answers.annualMileage,
        primaryGoal: answers.primaryGoal,
        timeInvestment: answers.timeInvestment,
        experienceLevel: answers.experienceLevel,
        availableEquipment: answers.availableEquipment || [],
        totalBudget: answers.totalBudget,
      };

      // Validate answers before transformation
      const validation =
        QuestionnaireTransformService.validateAnswers(questionnaireAnswers);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        // Continue anyway for better user experience, but log errors
      }

      // Transform to CustomerAnswers format
      const customerAnswers =
        QuestionnaireTransformService.transformToCustomerAnswers(
          questionnaireAnswers
        );

      // Log transformation for debugging
      console.log(
        'Transformation Summary:',
        QuestionnaireTransformService.createSummary(questionnaireAnswers)
      );

      // Try new questionnaire-based recommendations endpoint first
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'
        }/api/recommendations/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: JSON.stringify({
            sessionId,
            answers: customerAnswers,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('questionnaire_completed', 'true');
        localStorage.setItem(
          'questionnaire_results',
          JSON.stringify(result.data)
        );
        localStorage.setItem(
          'GLANZtastic_recommendations',
          JSON.stringify(result.data)
        );

        console.log('Recommendations generated successfully:', {
          totalRecommendations: result.data.totalProducts,
          sessionId: result.data.sessionId,
          processingTime: result.data.meta?.processingTime,
        });

        // Redirect to recommendations page
        router.push('/recommendations');
      } else {
        console.error('New API failed:', response.status);
        throw new Error('Recommendations API failed');
      }
    } catch (error) {
      console.error('Error with new recommendations API:', error);

      // Fallback to legacy questionnaire submission for compatibility
      try {
        const sessionId =
          localStorage.getItem('questionnaire_session_id') ||
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'
          }/api/questionnaire/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${
                localStorage.getItem('authToken') || ''
              }`,
            },
            body: JSON.stringify({
              sessionId,
              answers,
              timestamp: new Date().toISOString(),
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('questionnaire_completed', 'true');
          localStorage.setItem('questionnaire_results', JSON.stringify(result));

          // Generate mock recommendations for now
          const mockRecommendations = {
            personalizedMessage:
              'Basierend auf Ihren Antworten haben wir passende Produkte ausgewählt.',
            totalProducts: 4,
            categories: [
              'Shampoo',
              'Wachs',
              'Felgenreiniger',
              'Mikrofasertücher',
            ],
            estimatedTotalCost: 89.99,
            recommendations: [
              {
                id: '1',
                name: 'Premium Auto-Shampoo',
                brand: 'CleanMax',
                category: 'Shampoo',
                price: 19.99,
                rating: 4.8,
                reviewCount: 342,
                image: '/api/placeholder/300/300',
                description: 'Hochwertiges pH-neutrales Autoshampoo',
                features: ['pH-neutral', 'Schaumarm', 'Konzentriert'],
                partnerShopName: 'AutoPflege24',
                partnerShopUrl: '#',
                availabilityStatus: 'in_stock',
                reasonForRecommendation:
                  'Perfekt für Ihr Fahrzeug und Erfahrungslevel',
                matchScore: 95,
              },
            ],
          };

          localStorage.setItem(
            'GLANZtastic_recommendations',
            JSON.stringify(mockRecommendations)
          );
          router.push('/recommendations');
        } else {
          throw new Error('Questionnaire submission failed');
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        // Show error message to user
        alert(
          'Es gab ein Problem bei der Verarbeitung. Bitte versuchen Sie es erneut.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render question input
  const renderQuestionInput = () => {
    const value = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={handleAnswerChange}
            className="space-y-2 sm:space-y-3"
          >
            {currentQuestion.options?.map((option) => {
              const opt =
                typeof option === 'string'
                  ? { value: option, label: option }
                  : option;
              return (
                <div
                  key={opt.value || opt.label}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors touch-manipulation"
                >
                  <RadioGroupItem
                    value={opt.value || opt.label}
                    id={opt.value || opt.label}
                    className="mt-1 touch-manipulation"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={opt.value || opt.label}
                      className="text-sm sm:text-base lg:text-lg font-medium cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                    {opt.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        );

      case 'checkbox':
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options?.map((option) => {
              const opt =
                typeof option === 'string'
                  ? { value: option, label: option }
                  : option;
              const optValue = opt.value || opt.label;
              const isChecked = selectedOptions.includes(optValue);

              return (
                <div
                  key={optValue}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors touch-manipulation"
                >
                  <Checkbox
                    id={optValue}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...selectedOptions, optValue]
                        : selectedOptions.filter((o) => o !== optValue);
                      handleAnswerChange(newValue);
                    }}
                    className="mt-1 touch-manipulation"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={optValue}
                      className="text-sm sm:text-base lg:text-lg font-medium cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                    {opt.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleAnswerChange}>
            <SelectTrigger className="w-full text-sm sm:text-base lg:text-lg h-12 sm:h-14 touch-manipulation">
              <SelectValue placeholder="Bitte wählen..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
              sticky="always"
            >
              {currentQuestion.options?.map((option) => {
                const opt = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="text-sm sm:text-base lg:text-lg"
                  >
                    {opt}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'slider':
        const sliderValue =
          value !== undefined ? [value] : [currentQuestion.min || 0];
        return (
          <div className="space-y-4 sm:space-y-6">
            <Slider
              value={sliderValue}
              onValueChange={([newValue]) => handleAnswerChange(newValue)}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-sm sm:text-base lg:text-lg text-muted-foreground">
              <span>{currentQuestion.min}</span>
              <div className="font-bold text-2xl sm:text-3xl text-primary">
                {value || currentQuestion.min}
              </div>
              <span>{currentQuestion.max}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full text-sm sm:text-base lg:text-lg h-12 sm:h-14 touch-manipulation"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Logo
              size="lg"
              className="cursor-pointer scale-90 sm:scale-100"
              onClick={() => router.push('/')}
            />
            <div className="text-xs sm:text-sm text-muted-foreground">
              {currentQuestionIndex + 1} von {totalQuestions}
            </div>
          </div>

          <Progress value={progress} className="mb-4 sm:mb-6" />

          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-2 text-xs sm:text-sm bg-[#f8de00] text-neutral-950 border-[#f8de00] hover:bg-[#f8de00] hover:text-neutral-950"
            >
              {currentQuestion.category}
            </Badge>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 sm:mb-8 shadow-2xl border-0">
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-center leading-tight">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            <div className="mb-6 sm:mb-8">{renderQuestionInput()}</div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t gap-4 sm:gap-0">
              <Button
                variant="outline"
                size="lg"
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className={`w-full sm:w-auto ${
                  currentQuestionIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Zurück
              </Button>

              <div className="text-center order-first sm:order-none">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Beantwortet: {answeredCount}/{totalQuestions}
                </div>
                {isCurrentQuestionAnswered() && (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">Beantwortet</span>
                  </div>
                )}
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  size="lg"
                  onClick={goToNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="min-w-[120px] w-full sm:w-auto"
                >
                  Weiter
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!isCurrentQuestionAnswered() || isSubmitting}
                  className="min-w-[180px] w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2" />
                      <span className="hidden sm:inline">
                        Wird verarbeitet...
                      </span>
                      <span className="sm:hidden">Loading...</span>
                    </>
                  ) : (
                    <>
                      <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">
                        Empfehlungen erhalten
                      </span>
                      <span className="sm:hidden">Fertig</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Dots */}
        <div className="flex justify-center space-x-1 sm:space-x-2 px-4 overflow-x-auto">
          {allQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all flex-shrink-0 ${
                index < currentQuestionIndex
                  ? 'bg-green-500'
                  : index === currentQuestionIndex
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
