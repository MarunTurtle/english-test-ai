import { useState, useCallback } from 'react';
import type { QuestionSet, CreateQuestionSetInput } from '@/types';

interface UseSaveQuestionSetReturn {
  saveQuestionSet: (data: CreateQuestionSetInput) => Promise<QuestionSet | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook to save a question set to the database
 * @returns Function to save question set, loading state, error state, and success flag
 */
export function useSaveQuestionSet(): UseSaveQuestionSetReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveQuestionSet = useCallback(async (
    data: CreateQuestionSetInput
  ): Promise<QuestionSet | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/question-sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save question set');
      }

      const result = await response.json();
      setSuccess(true);
      return result.questionSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error saving question set:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveQuestionSet,
    loading,
    error,
    success,
  };
}
