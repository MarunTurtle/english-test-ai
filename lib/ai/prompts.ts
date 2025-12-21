import { QuestionDifficulty } from '@/lib/constants/difficulty';
import { GradeLevel } from '@/lib/constants/grade-levels';
import { QuestionType } from '@/lib/constants/question-types';

export const GENERATION_SYSTEM_PROMPT = `You are an expert English test item writer.
Return ONLY a valid JSON object and nothing else.
Use exactly this schema:
{
  "questions": [
    {
      "type": "Main Idea | Detail | Inference | Vocabulary",
      "difficulty": "Easy | Medium | Hard",
      "question_text": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "evidence": "verbatim quote from the passage",
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
Rules:
- Output JSON only, no markdown.
- options must have exactly 4 strings.
- correct_answer is the 0-3 index of the correct option.
- evidence must be a direct quote from the passage.
- If validation_status is PASS, set validation_note to null.
- If validation_status is NEEDS_FIX, provide a short reason in validation_note.`;

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
  return [
    'Generate multiple-choice questions from the passage.',
    'Use the settings exactly as provided.',
    '',
    'Settings:',
    `- grade_level: ${gradeLevel}`,
    `- difficulty: ${difficulty}`,
    `- question_types: ${questionTypes.join(', ')}`,
    `- question_count: ${count}`,
    '',
    'Passage:',
    `"""${passage}"""`,
  ].join('\n');
}
