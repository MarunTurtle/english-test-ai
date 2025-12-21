import { z } from 'zod';
import { questionSchema } from './question';
import { QUESTION_TYPES } from '@/lib/constants/question-types';
import { DIFFICULTIES } from '@/lib/constants/difficulty';
import { GRADE_LEVELS } from '@/lib/constants/grade-levels';

// Schema for the meta object in question set payload
const questionSetMetaSchema = z.object({
  grade_level: z.enum(GRADE_LEVELS as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTIES as [string, ...string[]]),
  question_types: z.array(z.enum(QUESTION_TYPES as [string, ...string[]])),
  question_count: z.number().int().min(5).max(10),
});

// Schema for the complete payload
export const questionSetPayloadSchema = z.object({
  questions: z.array(questionSchema),
  meta: questionSetMetaSchema,
});

// Schema for creating a new question set
export const createQuestionSetSchema = z.object({
  passage_id: z.string().uuid(),
  difficulty: z.enum(DIFFICULTIES as [string, ...string[]]),
  question_count: z.number().int().min(5).max(10),
  question_types: z.array(z.enum(QUESTION_TYPES as [string, ...string[]])).min(1),
  payload: questionSetPayloadSchema,
});

// Schema for the database question set entity
export const questionSetSchema = z.object({
  id: z.string().uuid(),
  passage_id: z.string().uuid(),
  user_id: z.string().uuid(),
  difficulty: z.enum(DIFFICULTIES as [string, ...string[]]),
  question_count: z.number().int(),
  question_types: z.array(z.string()),
  payload: questionSetPayloadSchema,
  created_at: z.string(),
});
