import { z } from 'zod';

// Grade level validation
export const gradeLevelSchema = z.enum(['M1', 'M2', 'M3']);

// Full passage validation
export const passageSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().max(200, 'Title must be 200 characters or less'),
  content: z
    .string()
    .min(100, 'Passage must be at least 100 characters')
    .max(10000, 'Passage must be 10,000 characters or less'),
  grade_level: gradeLevelSchema,
  created_at: z.string().datetime(),
});

// Create passage input validation
export const createPassageSchema = z.object({
  content: z
    .string()
    .min(100, 'Passage must be at least 100 characters')
    .max(10000, 'Passage must be 10,000 characters or less'),
  grade_level: gradeLevelSchema,
  title: z.string().max(200, 'Title must be 200 characters or less').optional(),
});

// Update passage input validation
export const updatePassageSchema = z.object({
  content: z
    .string()
    .min(100, 'Passage must be at least 100 characters')
    .max(10000, 'Passage must be 10,000 characters or less')
    .optional(),
  grade_level: gradeLevelSchema.optional(),
  title: z.string().max(200, 'Title must be 200 characters or less').optional(),
});

// Type exports
export type PassageSchema = z.infer<typeof passageSchema>;
export type CreatePassageSchema = z.infer<typeof createPassageSchema>;
export type UpdatePassageSchema = z.infer<typeof updatePassageSchema>;
