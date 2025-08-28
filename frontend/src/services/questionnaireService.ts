/**
 * Questionnaire Service
 * Handles all questionnaire-related API calls with local storage backup
 * Synchronized with existing frontend implementation
 */

import {
  Question,
  QuestionnaireAnswers,
  ProgressSaveRequest,
  ProgressLoadRequest,
  QuestionnaireSubmitRequest,
  QuestionnaireApiResponse,
  BackendQuestion,
} from '@/types/questionnaire';

class QuestionnaireService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      ...this.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response.json();
  }

  /**
   * Get questionnaire questions from backend
   */
  async getQuestions(): Promise<Question[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/questions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<QuestionnaireApiResponse>(response);
      return result.data?.questions || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Save questionnaire progress
   */
  async saveProgress(request: ProgressSaveRequest): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/save-progress`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      await this.handleResponse<QuestionnaireApiResponse>(response);
      
      // Also save locally as backup
      this.saveProgressLocally(request);
      
    } catch (error) {
      console.error('Error saving progress to backend, falling back to local storage:', error);
      this.saveProgressLocally(request);
    }
  }

  /**
   * Load questionnaire progress
   */
  async loadProgress(request: ProgressLoadRequest): Promise<QuestionnaireAnswers | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/load-progress`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result = await this.handleResponse<QuestionnaireApiResponse>(response);
      
      if (result.data?.answers) {
        return result.data.answers;
      }
      
      // Fallback to local storage
      return this.loadProgressLocally(request.sessionId);
      
    } catch (error) {
      console.error('Error loading progress from backend, falling back to local storage:', error);
      return this.loadProgressLocally(request.sessionId);
    }
  }

  /**
   * Submit completed questionnaire
   */
  async submitQuestionnaire(request: QuestionnaireSubmitRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result = await this.handleResponse<QuestionnaireApiResponse>(response);
      
      // Clear local progress on successful submission
      this.clearLocalProgress(request.sessionId);
      
      return result.data;
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      throw error;
    }
  }

  /**
   * Get questionnaire statistics (admin only)
   */
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<QuestionnaireApiResponse>(response);
      return result.data;
      
    } catch (error) {
      console.error('Error fetching questionnaire stats:', error);
      throw error;
    }
  }

  /**
   * Delete questionnaire session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/questionnaire/session/${sessionId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse<QuestionnaireApiResponse>(response);
      
      // Also clear local storage
      this.clearLocalProgress(sessionId);
      
    } catch (error) {
      console.error('Error deleting session:', error);
      // Still clear local storage
      this.clearLocalProgress(sessionId);
    }
  }

  // Local storage methods as backup
  private saveProgressLocally(request: ProgressSaveRequest): void {
    try {
      localStorage.setItem('questionnaire_answers', JSON.stringify(request.answers));
      localStorage.setItem('questionnaire_session_id', request.sessionId);
      if (request.currentQuestionIndex !== undefined) {
        localStorage.setItem('questionnaire_current_index', request.currentQuestionIndex.toString());
      }
      localStorage.setItem('questionnaire_last_saved', new Date().toISOString());
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  private loadProgressLocally(sessionId: string): QuestionnaireAnswers | null {
    try {
      const storedSessionId = localStorage.getItem('questionnaire_session_id');
      if (storedSessionId !== sessionId) {
        return null;
      }

      const answersStr = localStorage.getItem('questionnaire_answers');
      return answersStr ? JSON.parse(answersStr) : null;
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return null;
    }
  }

  private clearLocalProgress(sessionId: string): void {
    try {
      const storedSessionId = localStorage.getItem('questionnaire_session_id');
      if (storedSessionId === sessionId) {
        localStorage.removeItem('questionnaire_answers');
        localStorage.removeItem('questionnaire_current_index');
        localStorage.removeItem('questionnaire_session_id');
        localStorage.removeItem('questionnaire_last_saved');
      }
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if questionnaire is completed locally
   */
  isCompletedLocally(): boolean {
    return localStorage.getItem('questionnaire_completed') === 'true';
  }

  /**
   * Mark questionnaire as completed locally
   */
  markCompletedLocally(): void {
    localStorage.setItem('questionnaire_completed', 'true');
  }

  /**
   * Reset completion status
   */
  resetCompletion(): void {
    localStorage.removeItem('questionnaire_completed');
    localStorage.removeItem('questionnaire_results');
  }

  /**
   * GDPR compliance - export user data
   */
  exportUserData(sessionId: string): any {
    return {
      sessionId,
      answers: this.loadProgressLocally(sessionId),
      lastSaved: localStorage.getItem('questionnaire_last_saved'),
      completed: this.isCompletedLocally(),
    };
  }

  /**
   * GDPR compliance - delete all user data
   */
  deleteAllUserData(): void {
    const keys = [
      'questionnaire_answers',
      'questionnaire_current_index', 
      'questionnaire_session_id',
      'questionnaire_last_saved',
      'questionnaire_completed',
      'questionnaire_results'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const questionnaireService = new QuestionnaireService();
export default questionnaireService;