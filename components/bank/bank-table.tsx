'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestionSets } from '@/hooks/questions/use-question-sets';
import { EmptyState } from '@/components/shared/empty-state';
import { SkeletonLoader } from '@/components/shared/skeleton-loader';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { FiDatabase, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/hooks/shared/use-toast';
import type { FilterOptions } from './bank-filters';
import type { Question } from '@/types';

interface BankTableProps {
  filters: FilterOptions;
}

interface QuestionRow extends Question {
  questionSetId: string;
  passageId: string;
  passageTitle: string;
  gradeLevel: string;
  setDifficulty: string;
  createdAt: string;
}

export function BankTable({ filters }: BankTableProps) {
  const { questionSets, loading, error, refetch } = useQuestionSets();
  const { toast } = useToast();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{ setId: string; questionId: string } | null>(null);

  // Flatten question sets into individual questions
  const allQuestions = useMemo((): QuestionRow[] => {
    if (!questionSets) return [];
    
    return questionSets.flatMap(set => 
      (set.payload?.questions || []).map(question => ({
        ...question,
        questionSetId: set.id,
        passageId: set.passage_id,
        passageTitle: set.passage?.title || 'Untitled',
        gradeLevel: set.passage?.grade_level || 'M1',
        setDifficulty: set.difficulty,
        createdAt: set.created_at,
      }))
    );
  }, [questionSets]);

  // Apply filters and sorting to individual questions
  const filteredAndSortedQuestions = useMemo(() => {
    if (!allQuestions.length) return [];

    let filtered = [...allQuestions];

    // Search filter (passage title or question text)
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((q) => {
        const titleMatch = q.passageTitle.toLowerCase().includes(searchLower);
        const questionMatch = q.question_text.toLowerCase().includes(searchLower);
        return titleMatch || questionMatch;
      });
    }

    // Difficulty filter (multiple selection)
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((q) => 
        filters.difficulties.includes(q.difficulty)
      );
    }

    // Grade level filter (multiple selection)
    if (filters.gradeLevels.length > 0) {
      filtered = filtered.filter((q) => 
        filters.gradeLevels.includes(q.gradeLevel)
      );
    }

    // Question type filter (multiple selection)
    if (filters.questionTypes.length > 0) {
      filtered = filtered.filter((q) => 
        filters.questionTypes.includes(q.type)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-asc':
          return a.passageTitle.localeCompare(b.passageTitle);
        case 'title-desc':
          return b.passageTitle.localeCompare(a.passageTitle);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allQuestions, filters]);

  const handleDelete = async (questionSetId: string, questionId: string) => {
    setQuestionToDelete({ setId: questionSetId, questionId });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    try {
      setDeletingId(questionToDelete.questionId);
      
      // Find the question set
      const questionSet = questionSets?.find(set => set.id === questionToDelete.setId);
      if (!questionSet) throw new Error('Question set not found');

      // Remove the question from the payload
      const updatedQuestions = questionSet.payload.questions.filter(
        q => q.id !== questionToDelete.questionId
      );

      // If no questions left, delete the entire set
      if (updatedQuestions.length === 0) {
        const response = await fetch(`/api/question-sets/${questionToDelete.setId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete question set');
        }

        toast({
          title: 'Question set deleted',
          description: 'The last question was removed, so the entire set was deleted.',
          variant: 'success',
        });
      } else {
        // Update the question set with remaining questions
        const response = await fetch(`/api/question-sets/${questionToDelete.setId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: {
              ...questionSet.payload,
              questions: updatedQuestions,
            },
            question_count: updatedQuestions.length,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete question');
        }

        toast({
          title: 'Question deleted',
          description: 'The question has been successfully removed.',
          variant: 'success',
        });
      }

      setShowDeleteDialog(false);
      setQuestionToDelete(null);

      // Refetch the list
      await refetch();
    } catch (err) {
      console.error('Error deleting question:', err);
      toast({
        title: 'Deletion failed',
        description: 'Failed to delete question. Please try again.',
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (questionSetId: string) => {
    router.push(`/bank/${questionSetId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                Question
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Grade
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
  const hasNoResults = allQuestions.length === 0;
  const hasNoFilteredResults = filteredAndSortedQuestions.length === 0 && allQuestions.length > 0;

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
                Question
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Grade
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
              <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
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
                Question
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Grade
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
              <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <FiDatabase className="w-12 h-12 text-slate-300" />
                  <p className="italic">
                    No questions match the current filters.
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
              Question
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Type
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Difficulty
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Grade
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
          {filteredAndSortedQuestions.map((question) => (
            <tr key={`${question.questionSetId}-${question.id}`} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(question.questionSetId)}
                  className="font-medium text-slate-700 hover:text-blue-600 transition-colors text-left"
                >
                  {question.passageTitle}
                </button>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-slate-600 truncate max-w-md">
                  {question.question_text}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded uppercase">
                  {question.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-[10px] font-black rounded uppercase ${
                    question.difficulty === 'Easy'
                      ? 'bg-green-50 text-green-700'
                      : question.difficulty === 'Medium'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {question.difficulty}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded uppercase">
                  {question.gradeLevel}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {formatDate(question.createdAt)}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => handleEdit(question.questionSetId)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="View Question Set"
                  disabled={deletingId === question.id}
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(question.questionSetId, question.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    deletingId === question.id
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Delete"
                  disabled={deletingId === question.id}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Results count */}
      {filteredAndSortedQuestions.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredAndSortedQuestions.length} of {allQuestions.length} question{allQuestions.length !== 1 ? 's' : ''}
        </div>
      )}

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Question"
        description="Are you sure you want to delete this question? If this is the last question in the set, the entire set will be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={deletingId !== null}
      />
    </div>
  );
}
