import { QuestionDifficulty } from '@/lib/constants/difficulty';
import { GradeLevel } from '@/lib/constants/grade-levels';
import { QuestionType } from '@/lib/constants/question-types';

export const GENERATION_SYSTEM_PROMPT = `You are an expert English test item writer for Korean middle school students.
Your task is to create high-quality, pedagogically sound multiple-choice questions.

Return ONLY a valid JSON object with NO markdown formatting.

Required JSON Schema:
{
  "questions": [
    {
      "type": "Main Idea | Detail | Inference | Vocabulary",
      "difficulty": "Easy | Medium | Hard",
      "question_text": "string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "evidence": "Found in Paragraph X: 'direct quote from passage' OR Inferred from Paragraph X: 'reasoning'",
      "validation_status": "PASS | NEEDS_FIX",
      "validation_note": "string or null"
    }
  ],
  "meta": {
    "grade_level": "M1 | M2 | M3",
    "difficulty": "Easy | Medium | Hard",
    "question_types": ["Main Idea", "Detail"],
    "question_count": 5
  }
}

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown code blocks, no extra text
2. Each question MUST have exactly 4 options (strings)
3. correct_answer is the index (0-3) of the correct option
4. evidence format MUST be one of:
   - "Found in Paragraph X: 'exact quote from passage'"
   - "Inferred from Paragraph X: 'supporting text'"
   - "Context: 'surrounding text for vocabulary questions'"
5. All distractors (wrong options) should be plausible but clearly incorrect
6. validation_status: Use "PASS" for good questions, "NEEDS_FIX" if there are issues
7. validation_note: Only provide if status is "NEEDS_FIX", explain the issue briefly

QUESTION TYPE GUIDELINES:
- Main Idea: Ask about the overall topic, purpose, or central theme
- Detail: Ask about specific facts, information explicitly stated in the passage
- Inference: Ask students to draw conclusions based on passage evidence
- Vocabulary: Test word meaning in context, provide line number reference

QUALITY STANDARDS:
- Questions should be clear, unambiguous, and appropriate for the grade level
- Distractors should test common misconceptions or partial understanding
- Evidence should directly support the correct answer
- Avoid questions that can be answered without reading the passage`;

type GenerationPromptInput = {
  passage: string;
  gradeLevel: GradeLevel;
  difficulty: QuestionDifficulty;
  count: number;
  questionTypes: QuestionType[];
};

export function buildGenerationUserPrompt({
  passage,
  gradeLevel,
  difficulty,
  count,
  questionTypes,
}: GenerationPromptInput) {
  const gradeDescription = {
    'M1': 'Middle School Year 1 (7th grade, ages 12-13)',
    'M2': 'Middle School Year 2 (8th grade, ages 13-14)',
    'M3': 'Middle School Year 3 (9th grade, ages 14-15)',
  }[gradeLevel];

  return [
    'Generate multiple-choice reading comprehension questions from the following passage.',
    '',
    '=== GENERATION SETTINGS ===',
    `Grade Level: ${gradeLevel} (${gradeDescription})`,
    `Difficulty: ${difficulty}`,
    `Question Types: ${questionTypes.join(', ')}`,
    `Total Questions: ${count}`,
    '',
    '=== REQUIREMENTS ===',
    `- Create exactly ${count} questions`,
    `- Distribute question types: ${questionTypes.join(', ')}`,
    `- All questions must be at ${difficulty} difficulty level`,
    `- Ensure questions are appropriate for ${gradeDescription}`,
    '- Provide clear evidence from the passage for each question',
    '- Format evidence as: "Found in Paragraph X: \'quote\'" or "Inferred from Paragraph X: \'text\'"',
    '',
    '=== PASSAGE ===',
    passage,
    '',
    'Generate the questions now in valid JSON format.',
  ].join('\n');
}
