import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="text-slate-400 mb-3">{icon}</div>}
      <p className="text-slate-500 text-center">{message}</p>
    </div>
  );
}
