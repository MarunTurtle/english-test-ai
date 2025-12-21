export const GRADE_LEVELS = [
  { value: 'M1', label: 'Middle 1' },
  { value: 'M2', label: 'Middle 2' },
  { value: 'M3', label: 'Middle 3' },
] as const;

export type GradeLevel = typeof GRADE_LEVELS[number]['value'];
