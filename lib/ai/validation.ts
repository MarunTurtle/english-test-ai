import { z } from 'zod';
import { questionSchema } from '@/schemas/question';

const metaSchema = z.object({
  grade_level: z.enum(['M1', 'M2', 'M3']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  question_types: z.array(z.enum(['Main Idea', 'Detail', 'Inference', 'Vocabulary'])).min(1).max(4),
  question_count: z.number().int().min(1),
});

export const generationResponseSchema = z.object({
  questions: z.array(questionSchema).min(1),
  meta: metaSchema,
});

export type GenerationResponse = z.infer<typeof generationResponseSchema>;
