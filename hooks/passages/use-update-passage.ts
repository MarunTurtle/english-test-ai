'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UpdatePassageInput, Passage } from '@/types/passage';

interface UseUpdatePassageReturn {
  updatePassage: (id: string, data: UpdatePassageInput) => Promise<Passage | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to update an existing passage
 */
export function useUpdatePassage(): UseUpdatePassageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updatePassage = async (id: string, data: UpdatePassageInput): Promise<Passage | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/passages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update passage');
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
    updatePassage,
    loading,
    error,
  };
}

