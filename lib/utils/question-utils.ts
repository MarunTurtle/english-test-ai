// Utility functions for questions

import type { Question } from '@/types/question';

export interface ValidationSummary {
  passed: number;
  needsFix: number;
  total: number;
}

export function getValidationSummary(questions: Question[]): ValidationSummary {
  const passed = questions.filter(q => q.validation_status === 'PASS').length;
  const needsFix = questions.filter(q => q.validation_status === 'NEEDS_FIX').length;
  
  return {
    passed,
    needsFix,
    total: questions.length,
  };
}

