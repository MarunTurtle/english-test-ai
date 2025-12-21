// Individual question card display component

import type { Question } from '@/types/question';
import { QuestionOptions } from './question-options';
import { QuestionEvidence } from './question-evidence';
import { Badge } from '@/components/shared/badge';
import { DifficultyBadge } from '@/components/shared/difficulty-badge';
import { FiAlertCircle, FiRefreshCw, FiEdit3 } from 'react-icons/fi';

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  showAnswer?: boolean;
  onRegenerate?: (questionId: string) => void;
  onEdit?: (questionId: string) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  showAnswer = true,
  onRegenerate,
  onEdit,
}: QuestionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {questionNumber ? `Q${questionNumber}` : 'Question'} — {question.type}
          </span>
        </div>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Question Text */}
        <p className="text-lg font-semibold text-slate-800">
          {question.question_text}
        </p>

        {/* Options */}
        <QuestionOptions
          options={question.options}
          correctAnswer={question.correct_answer}
          showAnswer={showAnswer}
        />

        {/* Evidence */}
        <QuestionEvidence evidence={question.evidence} />

        {/* Validation Status */}
        <div className="flex items-center gap-2 pt-2">
          <Badge
            variant={question.validation_status === 'PASS' ? 'success' : 'warning'}
            size="md"
          >
            {question.validation_status}
          </Badge>
        </div>

        {/* Issue Alert (if NEEDS_FIX) */}
        {question.validation_status === 'NEEDS_FIX' && question.validation_note && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
            <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">
                Validation Issue Detected
              </p>
              <p className="text-sm text-amber-700 italic mt-1">
                {question.validation_note}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions (if provided) */}
      {(onRegenerate || onEdit) && (
        <div className="px-6 pb-6 flex gap-2">
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(question.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(question.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <FiEdit3 className="w-4 h-4" />
              Manual Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
