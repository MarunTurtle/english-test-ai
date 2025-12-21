'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePassage } from '@/hooks/passages/use-create-passage';
import { useUpdatePassage } from '@/hooks/passages/use-update-passage';
import { GRADE_LEVELS, GradeLevel } from '@/lib/constants/grade-levels';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import { Passage } from '@/types/passage';

const MIN_CHARS = 100;
const MAX_CHARS = 10000;

interface PassageFormProps {
  mode?: 'create' | 'edit';
  initialPassage?: Passage;
}

export function PassageForm({ mode = 'create', initialPassage }: PassageFormProps) {
  const router = useRouter();
  const { createPassage, loading: createLoading, error: createError } = useCreatePassage();
  const { updatePassage, loading: updateLoading, error: updateError } = useUpdatePassage();
  
  const [content, setContent] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('M2');
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize form with existing passage data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialPassage) {
      setContent(initialPassage.content);
      setGradeLevel(initialPassage.grade_level as GradeLevel);
      setTitle(initialPassage.title);
    }
  }, [mode, initialPassage]);

  const loading = mode === 'create' ? createLoading : updateLoading;
  const apiError = mode === 'create' ? createError : updateError;

  const charCount = content.length;
  const isContentValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!isContentValid) {
      setValidationError(`Passage must be between ${MIN_CHARS} and ${MAX_CHARS} characters`);
      return;
    }

    setValidationError(null);

    if (mode === 'create') {
      // Create new passage
      const passage = await createPassage({
        content,
        grade_level: gradeLevel,
        title: title.trim() || undefined,
      });

      if (passage) {
        // Redirect to workbench
        router.push(`/passage/${passage.id}`);
      }
    } else if (mode === 'edit' && initialPassage) {
      // Update existing passage
      const updatedPassage = await updatePassage(initialPassage.id, {
        content,
        grade_level: gradeLevel,
        title: title.trim() || undefined,
      });

      if (updatedPassage) {
        // Redirect back to passage detail
        router.push(`/passage/${updatedPassage.id}`);
      }
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {mode === 'create' ? 'Create New Passage' : 'Edit Passage'}
          </h2>
          <p className="text-slate-500">
            {mode === 'create' 
              ? 'Provide a reading passage and select the grade level.' 
              : 'Update your passage content and settings.'}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Passage Content */}
        <div className="col-span-8 flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
            Reading Passage *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your English reading passage here (minimum 100 characters)..."
            className="h-[500px] w-full p-6 text-base bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm resize-none leading-relaxed text-slate-700"
            required
          />
          
          {/* Character Counter */}
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              charCount < MIN_CHARS 
                ? 'text-red-600' 
                : charCount > MAX_CHARS 
                ? 'text-red-600' 
                : 'text-slate-500'
            }`}>
              {charCount} / {MAX_CHARS} characters
              {charCount < MIN_CHARS && (
                <span className="ml-2">({MIN_CHARS - charCount} more needed)</span>
              )}
            </p>
          </div>

          {/* Validation Error */}
          {(validationError || apiError) && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <p>{validationError || apiError}</p>
            </div>
          )}
        </div>

        {/* Right: Settings */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Settings</h3>

            {/* Title (Optional) */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auto-generated from content"
                maxLength={200}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-slate-500">Leave empty to auto-generate from passage</p>
            </div>

            {/* Grade Level */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                Grade Level *
              </label>
              <div className="space-y-2">
                {GRADE_LEVELS.map((grade) => (
                  <button
                    key={grade.value}
                    type="button"
                    onClick={() => setGradeLevel(grade.value)}
                    className={`w-full p-3 text-sm font-medium rounded-lg border transition-colors ${
                      gradeLevel === grade.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || !isContentValid}
              className="w-full py-3 px-6 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Passage' : 'Update Passage'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full py-3 px-6 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
