// Test script to verify question set schema validation
import { createQuestionSetSchema } from '../schemas/question-set';

const testData = {
  passage_id: '123e4567-e89b-12d3-a456-426614174000',
  difficulty: 'Medium',
  question_count: 5,
  question_types: ['Main Idea', 'Detail'],
  payload: {
    questions: [
      {
        id: 'q1-123',
        type: 'Main Idea',
        difficulty: 'Medium',
        question_text: 'What is the main idea?',
        options: ['A', 'B', 'C', 'D'],
        correct_answer: 0,
        evidence: 'Evidence quote',
        validation_status: 'PASS',
        validation_note: null,
      },
    ],
    meta: {
      grade_level: 'M2',
      difficulty: 'Medium',
      question_types: ['Main Idea', 'Detail'],
      question_count: 5,
    },
  },
};

console.log('Testing question set schema validation...');
const result = createQuestionSetSchema.safeParse(testData);

if (result.success) {
  console.log('✅ Validation passed!');
  console.log('Validated data:', JSON.stringify(result.data, null, 2));
} else {
  console.log('❌ Validation failed!');
  console.log('Errors:', JSON.stringify(result.error.flatten(), null, 2));
}

