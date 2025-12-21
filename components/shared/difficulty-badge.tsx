// Difficulty level badge component

import type { QuestionDifficulty } from '@/lib/constants/difficulty';
import { getDifficultyColor } from '@/lib/constants/difficulty';

interface DifficultyBadgeProps {
  difficulty: QuestionDifficulty;
}

const colorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const color = getDifficultyColor(difficulty);
  const classes = colorClasses[color] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${classes}`}>
      {difficulty}
    </span>
  );
}
