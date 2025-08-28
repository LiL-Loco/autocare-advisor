/**
 * Questionnaire Types & Interfaces
 * Synchronized with existing frontend implementation and backend
 */

// Frontend question structure (matches page.tsx)
export interface Question {
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

// Flexible answers structure (matching current usage)
export interface QuestionnaireAnswers {
  [key: string]: any; // Flexible structure to handle all answer types
}

export interface QuestionnaireState {
  sessionId: string;
  currentQuestionIndex: number;
  answers: QuestionnaireAnswers;
  isCompleted: boolean;
  completedAt?: Date;
  isLoading?: boolean;
  error?: string | null;
}

// API Request/Response types
export interface ProgressSaveRequest {
  sessionId: string;
  answers: QuestionnaireAnswers;
  currentQuestionIndex?: number;
}

export interface ProgressLoadRequest {
  sessionId: string;
}

export interface QuestionnaireSubmitRequest {
  sessionId: string;
  answers: QuestionnaireAnswers;
  timestamp: string;
}

export interface QuestionnaireApiResponse {
  success: boolean;
  data?: {
    questions?: Question[];
    sessionId?: string;
    currentQuestionIndex?: number;
    answers?: QuestionnaireAnswers;
    isCompleted?: boolean;
    progress?: number;
    recommendationId?: string;
    recommendations?: any[];
    completedAt?: string;
  };
  error?: string;
  message?: string;
}

// Backend option structure (for API compatibility)
export interface BackendOption {
  id: string;
  text: string;
  value: string;
  weight: number;
}

export interface BackendQuestion {
  id: string;
  type: 'single' | 'multiple' | 'text' | 'range';
  text: string;
  description: string;
  options: BackendOption[];
  required: boolean;
  weight: number;
  order: number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}
