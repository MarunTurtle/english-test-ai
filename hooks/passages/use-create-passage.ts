'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePassageInput, Passage } from '@/types/passage';

interface UseCreatePassageReturn {
  createPassage: (data: CreatePassageInput) => Promise<Passage | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to create a new passage
 */
export function useCreatePassage(): UseCreatePassageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createPassage = async (data: CreatePassageInput): Promise<Passage | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/passages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create passage');
      }

      const result = await response.json();
      return result.passage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPassage,
    loading,
    error,
  };
}
