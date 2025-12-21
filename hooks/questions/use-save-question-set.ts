import { useState, useCallback } from 'react';
import type { QuestionSet, CreateQuestionSetInput } from '@/types';
import { parseApiError, getUserFriendlyMessage } from '@/lib/utils/error-handler';

interface UseSaveQuestionSetReturn {
  saveQuestionSet: (data: CreateQuestionSetInput) => Promise<QuestionSet | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  retry: () => void;
}

/**
 * Hook to save a question set to the database
 * @returns Function to save question set, loading state, error state, and success flag
 */
export function useSaveQuestionSet(): UseSaveQuestionSetReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastData, setLastData] = useState<CreateQuestionSetInput | null>(null);

  const saveQuestionSet = useCallback(async (
    data: CreateQuestionSetInput
  ): Promise<QuestionSet | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setLastData(data);

      const response = await fetch('/api/question-sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const apiError = parseApiError(errorData);
        
        // Log detailed error information for debugging
        console.error('[useSaveQuestionSet] API error:', {
          status: response.status,
          error: apiError.error,
          code: apiError.code,
          details: apiError.details,
          message: apiError.message,
        });

        // Use user-friendly message from API
        const errorMessage = apiError.message || getUserFriendlyMessage(apiError.code, apiError.error);
        
        // For validation errors, include details if available
        if (apiError.code === 'VALIDATION_ERROR' && apiError.details) {
          const detailsStr = JSON.stringify(apiError.details, null, 2);
          throw new Error(`${errorMessage}\n\nDetails:\n${detailsStr}`);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccess(true);
      return result.questionSet;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while saving the question set';
      
      console.error('[useSaveQuestionSet] Error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = () => {
    if (lastData) {
      return saveQuestionSet(lastData);
    }
    return Promise.resolve(null);
  };

  return {
    saveQuestionSet,
    loading,
    error,
    success,
    retry,
  };
}
