'use client';

import { FiX } from 'react-icons/fi';
import { DIFFICULTY_LEVELS } from '@/lib/constants/difficulty';
import { GRADE_LEVELS } from '@/lib/constants/grade-levels';
import { QUESTION_TYPES } from '@/lib/constants/question-types';

export interface FilterOptions {
  search: string;
  difficulties: string[];
  gradeLevels: string[];
  questionTypes: string[];
  sortBy: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
}

interface BankFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function BankFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: BankFiltersProps) {
  const toggleArrayFilter = (
    key: 'difficulties' | 'gradeLevels' | 'questionTypes',
    value: string
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    onFilterChange({ ...filters, [key]: newArray });
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Difficulty
          </label>
          <div className="space-y-2.5">
            {DIFFICULTY_LEVELS.map((level) => (
              <label
                key={level.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.difficulties.includes(level.value)}
                  onChange={() => toggleArrayFilter('difficulties', level.value)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {level.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Grade Level Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Grade Level
          </label>
          <div className="space-y-2.5">
            {GRADE_LEVELS.map((grade) => (
              <label
                key={grade.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.gradeLevels.includes(grade.value)}
                  onChange={() => toggleArrayFilter('gradeLevels', grade.value)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {grade.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Question Type Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Question Type
          </label>
          <div className="space-y-2.5">
            {QUESTION_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.questionTypes.includes(type.value)}
                  onChange={() => toggleArrayFilter('questionTypes', type.value)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Active filters applied</span>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
          >
            Clear all <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
