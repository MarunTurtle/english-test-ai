// Difficulty level constants

export const DIFFICULTY_LEVELS = [
  { value: 'Easy' as const, label: 'Easy', color: 'green' },
  { value: 'Medium' as const, label: 'Medium', color: 'amber' },
  { value: 'Hard' as const, label: 'Hard', color: 'red' },
] as const;

export type QuestionDifficulty = typeof DIFFICULTY_LEVELS[number]['value'];

export function getDifficultyColor(difficulty: QuestionDifficulty): string {
  const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
  return level?.color || 'slate';
}

