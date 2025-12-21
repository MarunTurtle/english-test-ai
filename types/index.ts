// Re-export all type definitions
export * from './passage';
export * from './question';

// Question Set types
import type { Question } from './question';
import type { QuestionType } from '@/lib/constants/question-types';
import type { QuestionDifficulty } from '@/lib/constants/difficulty';
import type { GradeLevel } from '@/lib/constants/grade-levels';

export interface QuestionSetPayload {
  questions: Question[];
  meta: {
    grade_level: GradeLevel;
    difficulty: QuestionDifficulty;
    question_types: QuestionType[];
    question_count: number;
  };
}

export interface QuestionSet {
  id: string;
  passage_id: string;
  user_id: string;
  difficulty: QuestionDifficulty;
  question_count: number;
  question_types: QuestionType[];
  payload: QuestionSetPayload;
  created_at: string;
}

export interface CreateQuestionSetInput {
  passage_id: string;
  difficulty: QuestionDifficulty;
  question_count: number;
  question_types: QuestionType[];
  payload: QuestionSetPayload;
}

export interface QuestionSetWithPassage extends QuestionSet {
  passage: {
    id: string;
    title: string;
    content: string;
    grade_level: GradeLevel;
  };
}
