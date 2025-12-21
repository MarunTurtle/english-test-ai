// Question type constants

export const QUESTION_TYPES = [
  { value: 'Main Idea' as const, label: 'Main Idea' },
  { value: 'Detail' as const, label: 'Detail' },
  { value: 'Inference' as const, label: 'Inference' },
  { value: 'Vocabulary' as const, label: 'Vocabulary' },
] as const;

export type QuestionType = typeof QUESTION_TYPES[number]['value'];

