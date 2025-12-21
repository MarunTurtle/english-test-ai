// List of questions display component

import type { Question } from '@/types/question';
import { QuestionCard } from './question-card';
import { getValidationSummary } from '@/lib/utils/question-utils';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface QuestionListProps {
  questions: Question[];
  showValidationSummary?: boolean;
  onRegenerate?: (questionId: string) => void;
  onEdit?: (questionId: string) => void;
}

export function QuestionList({
  questions,
  showValidationSummary = true,
  onRegenerate,
  onEdit,
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 italic">
        No questions generated yet.
      </div>
    );
  }

  const summary = getValidationSummary(questions);

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      {showValidationSummary && (
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded border border-green-100 uppercase">
            <FiCheckCircle className="w-3.5 h-3.5" />
            {summary.passed} Passed
          </span>
          {summary.needsFix > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-100 uppercase">
              <FiAlertCircle className="w-3.5 h-3.5" />
              {summary.needsFix} Needs Attention
            </span>
          )}
        </div>
      )}

      {/* Questions */}
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          questionNumber={index + 1}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
