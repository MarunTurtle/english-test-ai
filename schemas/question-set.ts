import { z } from 'zod';
import { questionSchema } from './question';
import { QUESTION_TYPES } from '@/lib/constants/question-types';
import { DIFFICULTY_LEVELS } from '@/lib/constants/difficulty';
import { GRADE_LEVELS } from '@/lib/constants/grade-levels';

// Extract string values from constants for Zod enum
const DIFFICULTY_VALUES = DIFFICULTY_LEVELS.map(d => d.value) as [string, ...string[]];
const GRADE_VALUES = GRADE_LEVELS.map(g => g.value) as [string, ...string[]];
const QUESTION_TYPE_VALUES = QUESTION_TYPES.map(q => q.value) as [string, ...string[]];

// Schema for the meta object in question set payload
const questionSetMetaSchema = z.object({
  grade_level: z.enum(GRADE_VALUES),
  difficulty: z.enum(DIFFICULTY_VALUES),
  question_types: z.array(z.enum(QUESTION_TYPE_VALUES)),
  question_count: z.number().int().min(1).max(10), // Allow 1-10 questions
});

// Schema for the complete payload
export const questionSetPayloadSchema = z.object({
  questions: z.array(questionSchema).min(1), // At least 1 question required
  meta: questionSetMetaSchema,
});

// Schema for creating a new question set
export const createQuestionSetSchema = z.object({
  passage_id: z.string().uuid(),
  difficulty: z.enum(DIFFICULTY_VALUES),
  question_count: z.number().int().min(1).max(10), // Allow 1-10 questions
  question_types: z.array(z.enum(QUESTION_TYPE_VALUES)).min(1),
  payload: questionSetPayloadSchema,
});

// Schema for the database question set entity
export const questionSetSchema = z.object({
  id: z.string().uuid(),
  passage_id: z.string().uuid(),
  user_id: z.string().uuid(),
  difficulty: z.enum(DIFFICULTY_VALUES),
  question_count: z.number().int(),
  question_types: z.array(z.string()),
  payload: questionSetPayloadSchema,
  created_at: z.string(),
});
