'use client';

import { useState, useEffect } from 'react';
import { Passage } from '@/types/passage';

interface UsePassageReturn {
  passage: Passage | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch a single passage by ID
 */
export function usePassage(id: string | null): UsePassageReturn {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPassage = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/passages/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Passage not found');
        }
        throw new Error('Failed to fetch passage');
      }

      const data = await response.json();
      setPassage(data.passage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassage();
  }, [id]);

  return {
    passage,
    loading,
    error,
    refetch: fetchPassage,
  };
}
