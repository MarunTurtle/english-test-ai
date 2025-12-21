// Question-related type definitions

import type { QuestionType } from '@/lib/constants/question-types';
import type { QuestionDifficulty } from '@/lib/constants/difficulty';

export type ValidationStatus = 'PASS' | 'NEEDS_FIX';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question_text: string;
  options: [string, string, string, string]; // Exactly 4 options
  correct_answer: number; // Index 0-3 (correct answer)
  evidence: string; // Verbatim quote from passage
  validation_status: ValidationStatus;
  validation_note?: string | null; // Only if validation_status is NEEDS_FIX
}

export interface GenerationSettings {
  difficulty: QuestionDifficulty;
  questionCount: number; // 5-10
  questionTypes: QuestionType[];
}

export interface GenerationRequest {
  passageId: string;
  passageContent: string;
  gradeLevel: string;
  difficulty: QuestionDifficulty;
  questionCount: number;
  questionTypes: QuestionType[];
}

export interface GenerationResponse {
  questions: Question[];
  meta: {
    grade_level: string;
    difficulty: QuestionDifficulty;
    question_types: QuestionType[];
  };
}
