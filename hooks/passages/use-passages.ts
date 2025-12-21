'use client';

import { useState, useEffect } from 'react';
import { Passage } from '@/types/passage';

interface UsePassagesReturn {
  passages: Passage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch all passages for the current user
 */
export function usePassages(): UsePassagesReturn {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPassages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/passages');

      if (!response.ok) {
        throw new Error('Failed to fetch passages');
      }

      const data = await response.json();
      setPassages(data.passages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassages();
  }, []);

  return {
    passages,
    loading,
    error,
    refetch: fetchPassages,
  };
}
