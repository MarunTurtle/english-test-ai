'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Passage } from '@/types/passage';
import { FiEye, FiTrash2, FiCalendar } from 'react-icons/fi';
import { GRADE_LEVELS } from '@/lib/constants/grade-levels';
import { useToast } from '@/hooks/shared/use-toast';

interface PassageCardProps {
  passage: Passage;
  onDelete?: (id: string) => void;
}

export function PassageCard({ passage, onDelete }: PassageCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const gradeLabel = GRADE_LEVELS.find(g => g.value === passage.grade_level)?.label || passage.grade_level;
  const contentPreview = passage.content.substring(0, 100) + (passage.content.length > 100 ? '...' : '');
  const createdDate = new Date(passage.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleView = () => {
    router.push(`/passage/${passage.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this passage?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/passages/${passage.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete passage');
      }

      toast({
        title: 'Passage deleted',
        description: 'The passage has been successfully deleted.',
        variant: 'success',
      });

      if (onDelete) {
        onDelete(passage.id);
      }
    } catch (error) {
      console.error('Error deleting passage:', error);
      toast({
        title: 'Deletion failed',
        description: 'Failed to delete passage. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
          {passage.title}
        </h3>
        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded ml-2 whitespace-nowrap">
          {gradeLabel}
        </span>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
        {contentPreview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-slate-500">
          <FiCalendar className="mr-1" />
          <span>{createdDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleView}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View passage"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete passage"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
