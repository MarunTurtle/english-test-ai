"use client";

import { useState } from "react";
import { BankTable } from "@/components/bank/bank-table";
import { BankFilters, FilterOptions } from "@/components/bank/bank-filters";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const DEFAULT_FILTERS: FilterOptions = {
  search: '',
  difficulties: [],
  gradeLevels: [],
  questionTypes: [],
  sortBy: 'date-desc',
};

export default function BankPage() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.difficulties.length > 0 ||
    filters.gradeLevels.length > 0 ||
    filters.questionTypes.length > 0 ||
    filters.sortBy !== 'date-desc';
  
  const activeFilterCount = 
    filters.difficulties.length + 
    filters.gradeLevels.length + 
    filters.questionTypes.length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">My Question Bank</h2>
        
        {/* Search and Filter Toggle */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by passage title or keyword..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <BankFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 overflow-y-auto flex-1">
        <BankTable filters={filters} />
      </div>
    </div>
  );
}
