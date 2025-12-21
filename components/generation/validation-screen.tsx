'use client';

import { useState } from 'react';
import type { Question } from '@/types/question';
import { QuestionEditDialog } from '@/components/questions/question-edit-dialog';
import { getValidationSummary } from '@/lib/utils/question-utils';
import { FiCheckCircle, FiAlertCircle, FiRefreshCw, FiEdit3 } from 'react-icons/fi';

interface ValidationScreenProps {
  questions: Question[];
  onUpdateQuestion: (questionId: string, updatedQuestion: Question) => void;
  onRegenerateQuestion: (questionId: string) => Promise<void>;
  regeneratingQuestionId?: string | null;
}

export function ValidationScreen({
  questions,
  onUpdateQuestion,
  onRegenerateQuestion,
  regeneratingQuestionId,
}: ValidationScreenProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const summary = getValidationSummary(questions);

  // Edit dialog handlers
  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (editingQuestion) {
      onUpdateQuestion(editingQuestion.id, updatedQuestion);
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Summary - Inline badges matching prototype */}
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded border border-green-100 uppercase">
          <FiCheckCircle className="w-3.5 h-3.5" /> {summary.passed} Passed
        </span>
        {summary.needsFix > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-100 uppercase">
            <FiAlertCircle className="w-3.5 h-3.5" /> {summary.needsFix} Needs Attention
          </span>
        )}
      </div>

      {/* Question Cards - Matching prototype layout */}
      {questions.map((question, idx) => {
        const isRegenerating = regeneratingQuestionId === question.id;
        
        return (
        <div
          key={question.id}
          className={`bg-white border-l-8 rounded-xl overflow-hidden shadow-sm flex relative ${
            question.validation_status === 'PASS' ? 'border-l-green-500' : 'border-l-amber-500'
          } ${isRegenerating ? 'opacity-60' : ''}`}
        >
          {/* Loading Overlay */}
          {isRegenerating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-3">
                <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">Regenerating question...</p>
                <p className="text-xs text-slate-500">This may take a few seconds</p>
              </div>
            </div>
          )}
          {/* Main Content Area */}
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                  question.validation_status === 'PASS'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {question.validation_status}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Q{idx + 1} — {question.type}
              </span>
              <span
                className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  question.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-700'
                    : question.difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            <p className="font-bold text-slate-800 text-lg mb-4">
              {question.question_text}
            </p>

            {/* Issue Alert for NEEDS_FIX */}
            {question.validation_status === 'NEEDS_FIX' && question.validation_note && (
              <div className="mb-4 bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Validation Issue Detected
                  </p>
                  <p className="text-sm text-amber-700 italic">
                    {question.validation_note}
                  </p>
                </div>
              </div>
            )}

            {/* Show options in compact format */}
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              {question.options.map((option, oIdx) => (
                <div
                  key={oIdx}
                  className={`flex items-center gap-2 ${
                    oIdx === question.correct_answer ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      oIdx === question.correct_answer
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="truncate">{option}</span>
                </div>
              ))}
            </div>

            {/* Evidence */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                Textual Evidence
              </p>
              <p className="text-sm text-slate-600 italic">
                {question.evidence}
              </p>
            </div>
          </div>

          {/* Action Panel - Right Side (matching prototype) */}
          <div className="w-64 bg-slate-50 border-l border-slate-100 p-6 flex flex-col gap-2 justify-center">
            <button
              onClick={() => onRegenerateQuestion(question.id)}
              disabled={isRegenerating}
              className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border transition-colors ${
                isRegenerating
                  ? 'bg-blue-100 text-blue-400 border-blue-200 cursor-not-allowed'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'
              }`}
            >
              <FiRefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button
              onClick={() => handleEditClick(question)}
              disabled={isRegenerating}
              className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border transition-colors ${
                isRegenerating
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'text-slate-600 bg-white hover:bg-slate-100 border-slate-200'
              }`}
            >
              <FiEdit3 className="w-4 h-4" /> Manual Edit
            </button>
          </div>
        </div>
        );
      })}

      {/* Edit Dialog */}
      {editingQuestion && (
        <QuestionEditDialog
          question={editingQuestion}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}
