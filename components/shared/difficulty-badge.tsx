import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors: Record<string, string> = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${colors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
      {difficulty}
    </span>
  );
}
