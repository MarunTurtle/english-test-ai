import { z } from 'zod';

export const generationRequestSchema = z.object({
  passageId: z.string().uuid(),
  gradeLevel: z.enum(['M1', 'M2', 'M3']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  count: z.number().int().min(1).max(20),
  questionTypes: z.array(z.enum(['Main Idea', 'Detail', 'Inference', 'Vocabulary'])).min(1).max(4),
});

export type GenerationRequest = z.infer<typeof generationRequestSchema>;

