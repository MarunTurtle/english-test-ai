import { z } from 'zod';

// Schema for AI-generated question (before adding ID on server)
const aiQuestionSchema = z.object({
  type: z.enum(['Main Idea', 'Detail', 'Inference', 'Vocabulary']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  question_text: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correct_answer: z.number().int().min(0).max(3),
  evidence: z.string().min(1),
  validation_status: z.enum(['PASS', 'NEEDS_FIX']),
  validation_note: z.string().nullable().optional(),
});

const metaSchema = z.object({
  grade_level: z.enum(['M1', 'M2', 'M3']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  question_types: z.array(z.enum(['Main Idea', 'Detail', 'Inference', 'Vocabulary'])).min(1).max(4),
  question_count: z.number().int().min(1),
});

// Schema for validating OpenAI response (no IDs yet)
export const generationResponseSchema = z.object({
  questions: z.array(aiQuestionSchema).min(1),
  meta: metaSchema,
});

export type GenerationResponse = z.infer<typeof generationResponseSchema>;
export type AIQuestion = z.infer<typeof aiQuestionSchema>;
