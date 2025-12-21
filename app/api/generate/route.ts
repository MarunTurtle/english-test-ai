import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getPassageById } from '@/lib/db/queries/passages';
import { generationRequestSchema } from '@/schemas/generation-request';
import { createOpenAIResponse, extractOpenAIJsonText } from '@/lib/ai/openai';
import { GENERATION_SYSTEM_PROMPT, buildGenerationUserPrompt } from '@/lib/ai/prompts';
import { generationResponseSchema } from '@/lib/ai/validation';

/**
 * POST /api/generate
 * Generate questions with OpenAI and return validated JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = generationRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      passageId,
      gradeLevel,
      difficulty,
      count,
      questionTypes,
    } = validationResult.data;

    const passage = await getPassageById(passageId, user.id);

    if (!passage) {
      return NextResponse.json(
        { error: 'Passage not found' },
        { status: 404 }
      );
    }

    const userPrompt = buildGenerationUserPrompt({
      passage: passage.content,
      gradeLevel,
      difficulty,
      count,
      questionTypes,
    });

    const openaiResponse = await createOpenAIResponse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: [{ type: 'input_text', text: GENERATION_SYSTEM_PROMPT }] },
        { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
      ],
    });

    const jsonText = extractOpenAIJsonText(openaiResponse);
    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: 'Model returned invalid JSON' },
        { status: 400 }
      );
    }

    const responseValidation = generationResponseSchema.safeParse(parsedJson);

    if (!responseValidation.success) {
      return NextResponse.json(
        {
          error: 'Model response validation failed',
          details: responseValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { questions, meta } = responseValidation.data;

    if (questions.length !== count || meta.question_count !== count) {
      return NextResponse.json(
        {
          error: 'Model returned incorrect question count',
          details: {
            expected: count,
            received: questions.length,
          },
        },
        { status: 400 }
      );
    }

    const requestedTypes = [...questionTypes].sort();
    const responseTypes = [...meta.question_types].sort();

    if (
      meta.grade_level !== gradeLevel ||
      meta.difficulty !== difficulty ||
      requestedTypes.length !== responseTypes.length ||
      requestedTypes.some((type, index) => type !== responseTypes[index])
    ) {
      return NextResponse.json(
        {
          error: 'Model response settings mismatch',
          details: {
            requested: {
              grade_level: gradeLevel,
              difficulty,
              question_types: questionTypes,
            },
            received: meta,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(responseValidation.data);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
