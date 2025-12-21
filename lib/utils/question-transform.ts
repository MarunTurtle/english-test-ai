// Transform API responses to component-compatible types

import type { Question } from '@/types/question';
import type { GenerationResponse } from '@/lib/ai/validation';

/**
 * Transform OpenAI API response to Question type with generated ID
 * 
 * Since Question type now matches API schema (snake_case), no field transformation needed.
 * We only add a unique ID for each question.
 */
export function transformApiQuestion(apiQuestion: GenerationResponse['questions'][0], index: number): Question {
  return {
    id: `q-${Date.now()}-${index}`, // Generate temporary ID
    type: apiQuestion.type,
    difficulty: apiQuestion.difficulty,
    question_text: apiQuestion.question_text,
    options: apiQuestion.options as [string, string, string, string],
    correct_answer: apiQuestion.correct_answer,
    evidence: apiQuestion.evidence,
    validation_status: apiQuestion.validation_status,
    validation_note: apiQuestion.validation_note,
  };
}

/**
 * Transform array of API questions to component Question array
 */
export function transformApiQuestions(apiResponse: GenerationResponse): Question[] {
  return apiResponse.questions.map((q, index) => transformApiQuestion(q, index));
}

/**
 * Transform component Question back to API format (for updates/saves)
 * Since types now match, this is essentially a pass-through with ID removed
 */
export function transformQuestionToApi(question: Question) {
  return {
    type: question.type,
    difficulty: question.difficulty,
    question_text: question.question_text,
    options: question.options,
    correct_answer: question.correct_answer,
    evidence: question.evidence,
    validation_status: question.validation_status,
    validation_note: question.validation_note,
  };
}

/**
 * Generate a unique question ID
 */
export function generateQuestionId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
