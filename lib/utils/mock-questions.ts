// Mock questions for testing and development

import type { Question } from '@/types/question';

export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    type: 'Main Idea',
    difficulty: 'Medium',
    question_text: 'What is the main idea of the passage?',
    options: [
      'The importance of reading comprehension',
      'How to write better questions',
      'Understanding different question types',
      'The role of evidence in testing',
    ],
    correct_answer: 0,
    evidence: 'Reading comprehension is a critical skill that enables students to understand and analyze written text effectively.',
    validation_status: 'PASS',
  },
  {
    id: 'q-2',
    type: 'Detail',
    difficulty: 'Easy',
    question_text: 'According to the passage, what are the four question types?',
    options: [
      'Main Idea, Detail, Inference, Vocabulary',
      'Reading, Writing, Speaking, Listening',
      'Easy, Medium, Hard, Expert',
      'Multiple choice, True/False, Short answer, Essay',
    ],
    correct_answer: 0,
    evidence: 'The four question types used in this system are Main Idea, Detail, Inference, and Vocabulary questions.',
    validation_status: 'PASS',
  },
  {
    id: 'q-3',
    type: 'Inference',
    difficulty: 'Hard',
    question_text: 'What can be inferred about the purpose of textual evidence?',
    options: [
      'It makes questions longer',
      'It helps validate answer correctness',
      'It is only for decoration',
      'It replaces the need for reading',
    ],
    correct_answer: 1,
    evidence: 'Each question must include textual evidence from the passage to support the correct answer.',
    validation_status: 'NEEDS_FIX',
    validation_note: 'The inference could be more clearly stated in the question text.',
  },
  {
    id: 'q-4',
    type: 'Vocabulary',
    difficulty: 'Medium',
    question_text: 'In the context of the passage, what does "validate" mean?',
    options: [
      'To make something valid or confirm its accuracy',
      'To reject or deny something',
      'To create something new',
      'To ignore or overlook',
    ],
    correct_answer: 0,
    evidence: 'The system validates each generated question to ensure it meets quality standards.',
    validation_status: 'PASS',
  },
  {
    id: 'q-5',
    type: 'Detail',
    difficulty: 'Easy',
    question_text: 'What are the three difficulty levels mentioned?',
    options: [
      'Beginner, Intermediate, Advanced',
      'Easy, Medium, Hard',
      'Low, Mid, High',
      'Simple, Complex, Expert',
    ],
    correct_answer: 1,
    evidence: 'Questions can be generated at three difficulty levels: Easy, Medium, and Hard.',
    validation_status: 'PASS',
  },
];

/**
 * Get a subset of mock questions
 */
export function getMockQuestions(count: number = 5): Question[] {
  return mockQuestions.slice(0, count);
}

/**
 * Get mock questions by validation status
 */
export function getMockQuestionsByStatus(status: 'PASS' | 'NEEDS_FIX'): Question[] {
  return mockQuestions.filter((q) => q.validation_status === status);
}

/**
 * Get a single mock question by ID
 */
export function getMockQuestionById(id: string): Question | undefined {
  return mockQuestions.find((q) => q.id === id);
}
