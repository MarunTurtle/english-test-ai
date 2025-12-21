import { z } from 'zod';

export const questionSchema = z.object({
  type: z.enum(['Main Idea', 'Detail', 'Inference', 'Vocabulary']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  question_text: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correct_answer: z.number().int().min(0).max(3),
  evidence: z.string().min(1),
  validation_status: z.enum(['PASS', 'NEEDS_FIX']),
  validation_note: z.string().nullable().optional(),
});

export type QuestionSchema = z.infer<typeof questionSchema>;
