'use client';

import React from 'react';
import { usePassages } from '@/hooks/passages/use-passages';
import { PassageCard } from './passage-card';
import { EmptyState } from '@/components/shared/empty-state';
import { SkeletonLoader } from '@/components/shared/skeleton-loader';
import { FiFileText } from 'react-icons/fi';

export function PassageList() {
  const { passages, loading, error, refetch } = usePassages();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error loading passages</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (passages.length === 0) {
    return (
      <EmptyState 
        message="No passages yet. Create your first passage to get started!"
        icon={<FiFileText size={48} />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {passages.map((passage) => (
        <PassageCard 
          key={passage.id} 
          passage={passage}
          onDelete={refetch}
        />
      ))}
    </div>
  );
}
