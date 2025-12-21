"use client";

import { useState } from 'react';
import type { GenerationSettings } from '@/types/question';
import { DIFFICULTY_LEVELS } from '@/lib/constants/difficulty';
import { QUESTION_TYPES } from '@/lib/constants/question-types';
import { FiSettings, FiChevronRight } from 'react-icons/fi';

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
    
    onChange({ ...settings, questionTypes: types });
  };

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
        <select
          value={settings.questionCount}
          onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isGenerating}
        >
          {[5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>
              {num} Questions
            </option>
          ))}
        </select>
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
