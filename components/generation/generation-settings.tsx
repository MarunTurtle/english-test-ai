"use client";

import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/question';
import { DIFFICULTY_LEVELS } from '@/lib/constants/difficulty';
import { QUESTION_TYPES } from '@/lib/constants/question-types';
import { FiSettings, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';

interface GenerationSettingsProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function GenerationSettings({
  settings,
  onChange,
  onGenerate,
  isGenerating = false,
}: GenerationSettingsProps) {
  const handleDifficultyChange = (difficulty: GenerationSettings['difficulty']) => {
    onChange({ ...settings, difficulty });
  };

  const handleQuestionCountChange = (count: number) => {
    onChange({ ...settings, questionCount: count });
  };

  const handleQuestionTypeToggle = (type: GenerationSettings['questionTypes'][number]) => {
    const types = settings.questionTypes.includes(type)
      ? settings.questionTypes.filter(t => t !== type)
      : [...settings.questionTypes, type];
    
    const newSettings = { ...settings, questionTypes: types };
    
    // Adjust question count if it's below the new minimum
    const minCount = types.length;
    const maxCount = 10;
    if (newSettings.questionCount < minCount) {
      newSettings.questionCount = minCount;
    } else if (newSettings.questionCount > maxCount) {
      newSettings.questionCount = maxCount;
    }
    
    onChange(newSettings);
  };

  // Calculate min and max based on selected question types
  const minQuestionCount = settings.questionTypes.length || 1;
  const maxQuestionCount = 10;

  const handleDecrease = () => {
    if (settings.questionCount > minQuestionCount) {
      handleQuestionCountChange(settings.questionCount - 1);
    }
  };

  const handleIncrease = () => {
    if (settings.questionCount < maxQuestionCount) {
      handleQuestionCountChange(settings.questionCount + 1);
    }
  };

  // Ensure question count is within valid range when question types change
  useEffect(() => {
    if (settings.questionCount < minQuestionCount) {
      onChange({ ...settings, questionCount: minQuestionCount });
    } else if (settings.questionCount > maxQuestionCount) {
      onChange({ ...settings, questionCount: maxQuestionCount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minQuestionCount, maxQuestionCount, settings.questionCount]);

  const canGenerate = settings.questionTypes.length > 0 && !isGenerating;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
        <FiSettings className="w-4 h-4" />
        Generation Settings
      </h3>

      {/* Difficulty Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Difficulty
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTY_LEVELS.map(level => (
            <button
              key={level.value}
              onClick={() => handleDifficultyChange(level.value)}
              className={`py-2 text-xs rounded border transition-colors ${
                settings.difficulty === level.value
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Number of Questions
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={isGenerating || settings.questionCount <= minQuestionCount}
            className={`flex items-center justify-center w-10 h-10 rounded border transition-colors ${
              settings.questionCount <= minQuestionCount || isGenerating
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 active:scale-95'
            }`}
            aria-label="Decrease question count"
          >
            <FiMinus className="w-4 h-4" />
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-lg font-bold text-slate-800">
              {settings.questionCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              {settings.questionCount === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleIncrease}
            disabled={isGenerating || settings.questionCount >= maxQuestionCount}
            className={`flex items-center justify-center w-10 h-10 rounded border transition-colors ${
              settings.questionCount >= maxQuestionCount || isGenerating
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 active:scale-95'
            }`}
            aria-label="Increase question count"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          Min: {minQuestionCount} • Max: {maxQuestionCount}
        </p>
      </div>

      {/* Question Types */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Question Types
        </label>
        <div className="space-y-2">
          {QUESTION_TYPES.map(type => (
            <label
              key={type.value}
              className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
            >
              <span className="text-sm text-slate-600">{type.label}</span>
              <input
                type="checkbox"
                checked={settings.questionTypes.includes(type.value)}
                onChange={() => handleQuestionTypeToggle(type.value)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                disabled={isGenerating}
              />
            </label>
          ))}
        </div>
        {settings.questionTypes.length === 0 && (
          <p className="text-xs text-red-600 italic">
            Please select at least one question type
          </p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
          canGenerate
            ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            : 'bg-slate-300 cursor-not-allowed'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Generating...
          </>
        ) : (
          <>
            Generate Question Set
            <FiChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
