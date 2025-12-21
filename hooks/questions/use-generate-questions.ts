'use client';

import { useState } from 'react';
import type { Question } from '@/types/question';

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
}

export function useGenerateQuestions(): UseGenerateQuestionsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (input: GenerateQuestionsInput): Promise<Question[]> => {
    setIsGenerating(true);
    setError(null);

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
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      
      // API now returns questions with IDs already included
      return data.questions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuestions,
    isGenerating,
    error,
  };
}
