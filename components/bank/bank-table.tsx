'use client';

import { useState, useMemo } from 'react';
import { useQuestionSets } from '@/hooks/questions/use-question-sets';
import { BankRow } from './bank-row';
import { EmptyState } from '@/components/shared/empty-state';
import { SkeletonLoader } from '@/components/shared/skeleton-loader';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { FiDatabase } from 'react-icons/fi';
import { useToast } from '@/hooks/shared/use-toast';
import type { FilterOptions } from './bank-filters';
import type { QuestionSetWithPassage } from '@/types';

interface BankTableProps {
  filters: FilterOptions;
}

export function BankTable({ filters }: BankTableProps) {
  const { questionSets, loading, error, refetch } = useQuestionSets();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionSetToDelete, setQuestionSetToDelete] = useState<string | null>(null);

  // Apply filters and sorting
  const filteredAndSortedSets = useMemo(() => {
    if (!questionSets) return [];

    let filtered = [...questionSets];

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((set) => {
        const titleMatch = set.passage?.title?.toLowerCase().includes(searchLower);
        return titleMatch;
      });
    }

    // Difficulty filter (multiple selection)
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((set) => 
        filters.difficulties.includes(set.difficulty)
      );
    }

    // Grade level filter (multiple selection)
    if (filters.gradeLevels.length > 0) {
      filtered = filtered.filter((set) => 
        set.passage?.grade_level && filters.gradeLevels.includes(set.passage.grade_level)
      );
    }

    // Question type filter (multiple selection)
    if (filters.questionTypes.length > 0) {
      filtered = filtered.filter((set) => {
        // Check if the set contains ANY of the selected question types
        return set.payload?.questions?.some(
          (q) => filters.questionTypes.includes(q.type)
        );
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title-asc':
          return (a.passage?.title || '').localeCompare(b.passage?.title || '');
        case 'title-desc':
          return (b.passage?.title || '').localeCompare(a.passage?.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [questionSets, filters]);

  const handleDelete = async (id: string) => {
    setQuestionSetToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionSetToDelete) return;

    try {
      setDeletingId(questionSetToDelete);
      const response = await fetch(`/api/question-sets/${questionSetToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete question set');
      }

      toast({
        title: 'Question set deleted',
        description: 'The question set has been successfully deleted.',
        variant: 'success',
      });

      setShowDeleteDialog(false);
      setQuestionSetToDelete(null);

      // Refetch the list
      await refetch();
    } catch (err) {
      console.error('Error deleting question set:', err);
      toast({
        title: 'Deletion failed',
        description: 'Failed to delete question set. Please try again.',
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Passage Title
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Grade
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Count
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Types
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <SkeletonLoader variant="table-row" count={5} />
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <p className="font-medium">Error loading question sets</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Check if no results after filtering
  const hasNoResults = questionSets.length === 0;
  const hasNoFilteredResults = filteredAndSortedSets.length === 0 && questionSets.length > 0;

  if (hasNoResults) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Passage Title
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Details
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <FiDatabase className="w-12 h-12 text-slate-300" />
                  <p className="italic">
                    No questions saved yet. Start by generating a new set!
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (hasNoFilteredResults) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Passage Title
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Details
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <FiDatabase className="w-12 h-12 text-slate-300" />
                  <p className="italic">
                    No question sets match the current filters.
                  </p>
                  <p className="text-sm">Try adjusting your search criteria.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Passage Title
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Details
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredAndSortedSets.map((questionSet) => (
            <BankRow
              key={questionSet.id}
              questionSet={questionSet}
              onDelete={handleDelete}
              isDeleting={deletingId === questionSet.id}
            />
          ))}
        </tbody>
      </table>
      
      {/* Results count */}
      {filteredAndSortedSets.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredAndSortedSets.length} of {questionSets.length} question set{questionSets.length !== 1 ? 's' : ''}
        </div>
      )}

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Question Set"
        description="Are you sure you want to delete this question set? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={deletingId !== null}
      />
    </div>
  );
}
