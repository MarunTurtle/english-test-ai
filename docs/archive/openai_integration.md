# OpenAI Integration Documentation

## Overview

This document describes the OpenAI API integration for generating multiple-choice questions from reading passages in the English Question Generator application.

## Architecture

### Files Structure

```
lib/ai/
├── openai.ts           # OpenAI client and API wrapper functions
├── prompts.ts          # System and user prompt templates
└── validation.ts       # Response validation schemas (Zod)

schemas/
├── generation-request.ts  # Request validation schema
└── question.ts           # Question validation schema

app/api/generate/
└── route.ts             # API endpoint for question generation
```

## Implementation Details

### 1. OpenAI Client (`lib/ai/openai.ts`)

The OpenAI client module provides two main functions:

#### `createOpenAIResponse(params)`

Creates an OpenAI response using the Chat Completions API with JSON mode enabled.

**Parameters:**
```typescript
{
  model: string;           // e.g., "gpt-5-mini"
  messages: Message[];     // Array of system/user messages
}
```

**Features:**
- Converts Responses API format to Chat Completions API format
- Enables JSON output mode with `response_format: { type: 'json_object' }`
- Temperature set to 0.7 for balanced creativity
- Comprehensive error handling

**Returns:**
```typescript
{
  id: string;
  model: string;
  choices: Array<{
    message: { role: string; content: string; };
    finish_reason: string;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number; };
}
```

#### `extractOpenAIJsonText(response)`

Extracts and cleans JSON text from the OpenAI response.

**Features:**
- Removes markdown code blocks (```json ... ```)
- Validates that response contains content
- Returns clean JSON string ready for parsing

### 2. Prompt Engineering (`lib/ai/prompts.ts`)

#### System Prompt

The system prompt defines the AI's role and output schema:

```typescript
export const GENERATION_SYSTEM_PROMPT = `You are an expert English test item writer.
Return ONLY a valid JSON object and nothing else.
Use exactly this schema:
{
  "questions": [...],
  "meta": {...}
}
Rules:
- Output JSON only, no markdown.
- options must have exactly 4 strings.
- correct_answer is the 0-3 index of the correct option.
- evidence must be a direct quote from the passage.
- If validation_status is PASS, set validation_note to null.
- If validation_status is NEEDS_FIX, provide a short reason in validation_note.`
```

#### User Prompt

Built dynamically using `buildGenerationUserPrompt()`:

```typescript
Generate multiple-choice questions from the passage.
Use the settings exactly as provided.

Settings:
- grade_level: M1
- difficulty: Medium
- question_types: Main Idea, Detail
- question_count: 5

Passage:
"""[passage content here]"""
```

### 3. Request Validation (`schemas/generation-request.ts`)

Validates incoming API requests:

```typescript
{
  passageId: UUID string
  gradeLevel: 'M1' | 'M2' | 'M3'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  count: 1-20 questions
  questionTypes: Array of 'Main Idea' | 'Detail' | 'Inference' | 'Vocabulary'
}
```

### 4. Response Validation (`lib/ai/validation.ts`)

Validates OpenAI's JSON response:

```typescript
{
  questions: Array<{
    type: QuestionType
    difficulty: DifficultyLevel
    question_text: string
    options: [string, string, string, string]  // exactly 4
    correct_answer: 0 | 1 | 2 | 3
    evidence: string (direct quote from passage)
    validation_status: 'PASS' | 'NEEDS_FIX'
    validation_note: string | null
  }>
  meta: {
    grade_level: 'M1' | 'M2' | 'M3'
    difficulty: 'Easy' | 'Medium' | 'Hard'
    question_types: QuestionType[]
    question_count: number
  }
}
```

### 5. API Endpoint (`app/api/generate/route.ts`)

The POST endpoint handles the complete generation flow:

1. **Authentication**: Verify user session
2. **Request Validation**: Validate input with Zod schema
3. **Passage Retrieval**: Fetch passage from database
4. **Prompt Building**: Create system + user prompts
5. **OpenAI Call**: Generate questions via Chat Completions API
6. **JSON Extraction**: Extract and parse JSON response
7. **Response Validation**: Validate structure and content
8. **Settings Verification**: Ensure settings match request
9. **Return Data**: Send validated questions to client

## Configuration

### Environment Variables

Required in `.env.local`:

```env
OPENAI_API_KEY=sk-...your-api-key-here
```

### Model Configuration

Current model: **gpt-5-mini**

This can be changed in `app/api/generate/route.ts`:

```typescript
const openaiResponse = await createOpenAIResponse({
  model: 'gpt-5-mini',  // Change model here
  messages: [...],
});
```

### Supported Models

- `gpt-5-mini` (current) - Fast, cost-effective
- `gpt-4` - Higher quality, slower, more expensive
- `gpt-4-turbo` - Faster GPT-4 variant
- `gpt-3.5-turbo` - Legacy support

## Error Handling

The integration handles multiple error scenarios:

1. **Authentication Errors** (401): User not logged in
2. **Validation Errors** (400): Invalid request parameters
3. **Not Found Errors** (404): Passage doesn't exist
4. **OpenAI API Errors** (500): API call failures
5. **JSON Parse Errors** (400): Invalid JSON from model
6. **Schema Validation Errors** (400): Response doesn't match schema
7. **Settings Mismatch Errors** (400): Model didn't follow instructions

## Usage Example

### Client-Side Hook

```typescript
import { useGenerateQuestions } from '@/hooks/questions/use-generate-questions';

function MyComponent() {
  const { mutate: generate, isLoading } = useGenerateQuestions();

  const handleGenerate = () => {
    generate({
      passageId: 'uuid-here',
      gradeLevel: 'M1',
      difficulty: 'Medium',
      count: 5,
      questionTypes: ['Main Idea', 'Detail'],
    });
  };

  return <button onClick={handleGenerate}>Generate</button>;
}
```

### Direct API Call

```typescript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    passageId: 'uuid-here',
    gradeLevel: 'M1',
    difficulty: 'Medium',
    count: 5,
    questionTypes: ['Main Idea', 'Detail'],
  }),
});

const data = await response.json();
// data.questions - Array of generated questions
// data.meta - Metadata about the generation
```

## Quality Assurance

### Validation Layers

1. **Request Validation**: Zod schema validates input
2. **OpenAI JSON Mode**: Ensures valid JSON output
3. **Response Schema Validation**: Validates structure
4. **Settings Verification**: Ensures model followed instructions
5. **Question Count Check**: Verifies correct number of questions
6. **Evidence Validation**: Each question has supporting evidence

### Prompt Engineering Best Practices

1. **Clear Role Definition**: "You are an expert English test item writer"
2. **Explicit Output Format**: Detailed JSON schema in prompt
3. **Strict Rules**: "Output JSON only, no markdown"
4. **Evidence Requirement**: Forces model to ground answers in text
5. **Validation Status**: Model self-assesses quality

## Performance Considerations

### Token Usage

Approximate token usage per request:
- System prompt: ~150 tokens
- User prompt: ~100 tokens + passage length
- Response: ~200 tokens per question

### Response Time

Typical response times:
- 5 questions: 3-8 seconds
- 10 questions: 6-15 seconds
- 20 questions: 12-30 seconds

### Cost Optimization

Current model (gpt-5-mini) is cost-effective:
- Input: ~$0.15 / 1M tokens
- Output: ~$0.60 / 1M tokens

For a typical 5-question generation (~1000 tokens total):
- Cost per generation: ~$0.0006 (less than 1 cent)

## Testing

### Manual Testing

1. Start dev server: `npm run dev`
2. Login with Google OAuth
3. Create a passage
4. Navigate to workbench
5. Configure settings and generate

### API Testing

Use tools like Postman or curl:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "passageId": "uuid-here",
    "gradeLevel": "M1",
    "difficulty": "Medium",
    "count": 5,
    "questionTypes": ["Main Idea", "Detail"]
  }'
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Check if user is logged in
   - Verify Supabase session is valid

2. **"Model returned invalid JSON"**
   - Model may be hallucinating
   - Check prompt for clarity
   - Try regenerating

3. **"Model response validation failed"**
   - Model didn't follow schema exactly
   - Check validation error details
   - Adjust prompt if recurring

4. **"Failed to generate response from OpenAI"**
   - Check OPENAI_API_KEY is set correctly
   - Verify API key has sufficient credits
   - Check OpenAI API status

## Future Enhancements

1. **Streaming Responses**: Show questions as they're generated
2. **Retry Logic**: Auto-retry on failures
3. **Caching**: Cache common passages/settings
4. **Batch Generation**: Generate multiple sets at once
5. **Fine-tuning**: Train custom model on teacher feedback
6. **Prompt Versioning**: A/B test different prompts

## References

- [OpenAI Chat Completions API](https://platform.openai.com/docs/guides/text-generation)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

