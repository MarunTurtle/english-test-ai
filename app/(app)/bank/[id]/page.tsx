'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Spinner } from '@/components/shared/spinner';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/shared/use-toast';
import type { QuestionSetWithPassage } from '@/types';

export default function QuestionSetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [questionSet, setQuestionSet] = useState<QuestionSetWithPassage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPassageExpanded, setIsPassageExpanded] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const questionSetId = params.id as string;

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const fetchQuestionSet = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/question-sets/${questionSetId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch question set');
        }

        const data = await response.json();
        setQuestionSet(data.questionSet);
      } catch (err) {
        console.error('Error fetching question set:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (questionSetId) {
      fetchQuestionSet();
    }
  }, [questionSetId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/question-sets/${questionSetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question set');
      }

      toast({
        title: 'Question set deleted',
        description: 'The question set has been successfully deleted.',
        variant: 'success',
      });

      router.push('/bank');
    } catch (err) {
      console.error('Error deleting question set:', err);
      toast({
        title: 'Deletion failed',
        description: 'Failed to delete question set. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    if (questionSet) {
      router.push(`/passage/${questionSet.passage_id}?questionSetId=${questionSet.id}`);
    }
  };

  const getAnswerLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !questionSet) {
    return (
      <div className="overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <p className="font-medium">Error loading question set</p>
            <p className="text-sm mt-1">{error || 'Question set not found'}</p>
            <button
              onClick={() => router.push('/bank')}
              className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
            >
              Back to Question Bank
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questions = questionSet.payload?.questions || [];

  return (
    <div className="overflow-y-auto h-full">
      <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/bank')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Question Bank</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {questionSet.passage.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Created on {formatDate(questionSet.created_at)}</span>
              <span>•</span>
              <span>{questions.length} questions</span>
            </div>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">
                {questionSet.passage.grade_level}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                {questionSet.difficulty}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Passage Content */}
      <div className="mb-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsPassageExpanded(!isPassageExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <h2 className="text-lg font-bold text-slate-900">Passage</h2>
          {isPassageExpanded ? (
            <FiChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <FiChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {isPassageExpanded && (
          <div className="px-6 pb-6 border-t border-slate-100">
            <div className="prose prose-slate max-w-none pt-4">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {questionSet.passage.content}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Questions ({questions.length})
        </h2>

        {questions.map((question, index) => {
          const isExpanded = expandedQuestions[index] ?? true;
          
          return (
            <div
              key={question.id || index}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Question Header - Clickable */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-start gap-4 p-6 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-700 font-bold rounded-full flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-slate-900 mb-3">
                    {question.question_text}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded uppercase">
                      {question.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                        question.difficulty === 'Easy'
                          ? 'bg-green-50 text-green-700'
                          : question.difficulty === 'Medium'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <FiChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                ) : (
                  <FiChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                )}
              </button>

              {/* Question Details - Collapsible */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100">
                  {/* Options */}
                  <div className="space-y-3 mb-4 ml-12 mt-4">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          optIndex === question.correct_answer
                            ? 'bg-green-50 border-2 border-green-500'
                            : 'bg-slate-50 border-2 border-transparent'
                        }`}
                      >
                        <span
                          className={`font-bold flex-shrink-0 ${
                            optIndex === question.correct_answer
                              ? 'text-green-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {getAnswerLetter(optIndex)}.
                        </span>
                        <span
                          className={`flex-1 ${
                            optIndex === question.correct_answer
                              ? 'text-green-900 font-medium'
                              : 'text-slate-700'
                          }`}
                        >
                          {option}
                        </span>
                        {optIndex === question.correct_answer && (
                          <span className="text-sm text-green-600 font-bold flex-shrink-0">
                            ✓ Correct Answer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Evidence */}
                  {question.evidence && (
                    <div className="ml-12 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">
                        Evidence from Passage
                      </p>
                      <p className="text-sm text-blue-900 italic leading-relaxed">
                        &quot;{question.evidence}&quot;
                      </p>
                    </div>
                  )}

                  {/* Validation Status */}
                  {question.validation_status === 'NEEDS_FIX' && question.validation_note && (
                    <div className="ml-12 mt-3 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">
                        Needs Review
                      </p>
                      <p className="text-sm text-amber-900">{question.validation_note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Question Set"
        description="Are you sure you want to delete this question set? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
      </div>
    </div>
  );
}

