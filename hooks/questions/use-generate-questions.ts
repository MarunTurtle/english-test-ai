'use client';

import { useState } from 'react';
import type { Question } from '@/types/question';
import { parseApiError, getUserFriendlyMessage } from '@/lib/utils/error-handler';

interface GenerateQuestionsInput {
  passageId: string;
  gradeLevel: 'M1' | 'M2' | 'M3';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
  questionTypes: Array<'Main Idea' | 'Detail' | 'Inference' | 'Vocabulary'>;
}

interface UseGenerateQuestionsReturn {
  generateQuestions: (input: GenerateQuestionsInput) => Promise<Question[]>;
  isGenerating: boolean;
  error: string | null;
  retry: () => void;
}

export function useGenerateQuestions(): UseGenerateQuestionsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<GenerateQuestionsInput | null>(null);

  const generateQuestions = async (input: GenerateQuestionsInput): Promise<Question[]> => {
    setIsGenerating(true);
    setError(null);
    setLastInput(input);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passageId: input.passageId,
          gradeLevel: input.gradeLevel,
          difficulty: input.difficulty,
          count: input.count,
          questionTypes: input.questionTypes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const apiError = parseApiError(errorData);
        
        // Use user-friendly message from API
        const errorMessage = apiError.message || getUserFriendlyMessage(apiError.code, apiError.error);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // API now returns questions with IDs already included
      return data.questions;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while generating questions';
      
      console.error('[useGenerateQuestions] Error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const retry = () => {
    if (lastInput) {
      return generateQuestions(lastInput);
    }
    return Promise.resolve([]);
  };

  return {
    generateQuestions,
    isGenerating,
    error,
    retry,
  };
}
