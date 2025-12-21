'use client';

import { useState } from 'react';
import { QuestionList } from '@/components/questions/question-list';
import { QuestionEditDialog } from '@/components/questions/question-edit-dialog';
import { getMockQuestions } from '@/lib/utils/mock-questions';
import type { Question } from '@/types/question';

export default function TestQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(getMockQuestions());
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      setEditingQuestion(question);
      setIsEditDialogOpen(true);
    }
  };

  const handleSave = (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const handleRegenerate = (questionId: string) => {
    console.log('Regenerate question:', questionId);
    // In real implementation, this would call the API
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Question Components Test
        </h1>
        <p className="text-slate-600">
          Testing question display components with mock data
        </p>
      </div>

      <QuestionList
        questions={questions}
        showValidationSummary={true}
        onEdit={handleEdit}
        onRegenerate={handleRegenerate}
      />

      {editingQuestion && (
        <QuestionEditDialog
          question={editingQuestion}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

