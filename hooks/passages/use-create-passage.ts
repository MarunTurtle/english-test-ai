'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePassageInput, Passage } from '@/types/passage';
import { parseApiError, getUserFriendlyMessage } from '@/lib/utils/error-handler';

interface UseCreatePassageReturn {
  createPassage: (data: CreatePassageInput) => Promise<Passage | null>;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Hook to create a new passage
 */
export function useCreatePassage(): UseCreatePassageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastData, setLastData] = useState<CreatePassageInput | null>(null);
  const router = useRouter();

  const createPassage = async (data: CreatePassageInput): Promise<Passage | null> => {
    try {
      setLoading(true);
      setError(null);
      setLastData(data);

      const response = await fetch('/api/passages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const apiError = parseApiError(errorData);
        
        // Use user-friendly message from API
        const errorMessage = apiError.message || getUserFriendlyMessage(apiError.code, apiError.error);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.passage;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while creating the passage';
      
      console.error('[useCreatePassage] Error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    if (lastData) {
      createPassage(lastData);
    }
  };

  return {
    createPassage,
    loading,
    error,
    retry,
  };
}
