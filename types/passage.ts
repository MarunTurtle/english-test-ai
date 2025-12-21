import { GradeLevel } from '@/lib/constants/grade-levels';

// Database passage entity
export interface Passage {
  id: string;
  user_id: string;
  title: string;
  content: string;
  grade_level: GradeLevel;
  created_at: string;
}

// Input for creating a new passage
export interface CreatePassageInput {
  content: string;
  grade_level: GradeLevel;
  title?: string;
}

// Input for updating a passage
export interface UpdatePassageInput {
  content?: string;
  grade_level?: GradeLevel;
  title?: string;
}

// Passage with optional fields for forms
export interface PassageFormData {
  content: string;
  grade_level: GradeLevel;
  title?: string;
}
