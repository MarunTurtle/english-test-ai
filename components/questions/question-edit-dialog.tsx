'use client';

import { useState } from 'react';
import type { Question } from '@/types/question';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { QUESTION_TYPES } from '@/lib/constants/question-types';
import { DIFFICULTY_LEVELS } from '@/lib/constants/difficulty';

interface QuestionEditDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedQuestion: Question) => void;
}

export function QuestionEditDialog({
  question,
  open,
  onOpenChange,
  onSave,
}: QuestionEditDialogProps) {
  const [formData, setFormData] = useState<Question>(question);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options] as [string, string, string, string];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Make manual adjustments to the generated question.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Type and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Question Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              options={QUESTION_TYPES.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
            />
            <Select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value as any })
              }
              options={DIFFICULTY_LEVELS.map((level) => ({
                value: level.value,
                label: level.label,
              }))}
            />
          </div>

          {/* Question Text */}
          <Textarea
            label="Question Text"
            value={formData.question_text}
            onChange={(e) =>
              setFormData({ ...formData, question_text: e.target.value })
            }
            rows={3}
            required
          />

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Answer Options
            </label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  required
                />
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <Select
            label="Correct Answer"
            value={formData.correct_answer.toString()}
            onChange={(e) =>
              setFormData({ ...formData, correct_answer: parseInt(e.target.value) })
            }
            options={[
              { value: '0', label: 'A' },
              { value: '1', label: 'B' },
              { value: '2', label: 'C' },
              { value: '3', label: 'D' },
            ]}
          />

          {/* Evidence */}
          <Textarea
            label="Textual Evidence"
            value={formData.evidence}
            onChange={(e) =>
              setFormData({ ...formData, evidence: e.target.value })
            }
            rows={3}
            placeholder="Direct quote from the passage supporting the answer"
            required
          />

          {/* Validation Status */}
          <div className="space-y-3">
            <Select
              label="Validation Status"
              value={formData.validation_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  validation_status: e.target.value as 'PASS' | 'NEEDS_FIX',
                })
              }
              options={[
                { value: 'PASS', label: 'PASS' },
                { value: 'NEEDS_FIX', label: 'NEEDS_FIX' },
              ]}
            />
            {formData.validation_status === 'NEEDS_FIX' && (
              <Input
                label="Issue Description"
                value={formData.validation_note || ''}
                onChange={(e) =>
                  setFormData({ ...formData, validation_note: e.target.value })
                }
                placeholder="Describe the issue (optional)"
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
