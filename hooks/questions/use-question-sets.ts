import { useState, useEffect, useCallback } from 'react';
import type { QuestionSetWithPassage } from '@/types';

interface UseQuestionSetsOptions {
  passageId?: string;
  autoFetch?: boolean;
}

interface UseQuestionSetsReturn {
  questionSets: QuestionSetWithPassage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch question sets for the authenticated user
 * @param options - Configuration options
 * @returns Question sets data, loading state, error state, and refetch function
 */
export function useQuestionSets(
  options: UseQuestionSetsOptions = {}
): UseQuestionSetsReturn {
  const { passageId, autoFetch = true } = options;
  const [questionSets, setQuestionSets] = useState<QuestionSetWithPassage[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionSets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL('/api/question-sets', window.location.origin);
      if (passageId) {
        url.searchParams.set('passageId', passageId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch question sets');
      }

      const data = await response.json();
      setQuestionSets(data.questionSets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching question sets:', err);
    } finally {
      setLoading(false);
    }
  }, [passageId]);

  useEffect(() => {
    if (autoFetch) {
      fetchQuestionSets();
    }
  }, [autoFetch, fetchQuestionSets]);

  return {
    questionSets,
    loading,
    error,
    refetch: fetchQuestionSets,
  };
}
