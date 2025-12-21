import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getPassageById } from '@/lib/db/queries/passages';
import { generationRequestSchema } from '@/schemas/generation-request';
import { createOpenAIResponse, extractOpenAIJsonText } from '@/lib/ai/openai';
import { GENERATION_SYSTEM_PROMPT, buildGenerationUserPrompt } from '@/lib/ai/prompts';
import { generationResponseSchema } from '@/lib/ai/validation';
import { 
  createErrorResponse, 
  ErrorCode, 
  formatErrorForLog 
} from '@/lib/utils/error-handler';

/**
 * POST /api/generate
 * Generate questions with OpenAI and return validated JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Generate API] Unauthorized access attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = generationRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[Generate API] Request validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        createErrorResponse(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          validationResult.error.flatten().fieldErrors
        ),
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
      console.error(`[Generate API] Passage not found: ${passageId}`);
      return NextResponse.json(
        createErrorResponse(
          'Passage not found',
          ErrorCode.NOT_FOUND
        ),
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

    let openaiResponse;
    try {
      openaiResponse = await createOpenAIResponse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: [{ type: 'input_text', text: GENERATION_SYSTEM_PROMPT }] },
          { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
        ],
      });
    } catch (openaiError) {
      console.error('[Generate API] OpenAI API error:', formatErrorForLog(openaiError));
      return NextResponse.json(
        createErrorResponse(
          'AI service temporarily unavailable',
          ErrorCode.OPENAI_ERROR,
          undefined,
          'AI service is temporarily unavailable. Please try again in a moment.'
        ),
        { status: 503 }
      );
    }

    const jsonText = extractOpenAIJsonText(openaiResponse);
    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[Generate API] JSON parsing failed:', formatErrorForLog(parseError));
      return NextResponse.json(
        createErrorResponse(
          'Model returned invalid JSON',
          ErrorCode.OPENAI_ERROR,
          undefined,
          'AI generated an invalid response. Please try again.'
        ),
        { status: 400 }
      );
    }

    const responseValidation = generationResponseSchema.safeParse(parsedJson);

    if (!responseValidation.success) {
      console.error('[Generate API] Response validation failed:', responseValidation.error.flatten());
      return NextResponse.json(
        createErrorResponse(
          'Model response validation failed',
          ErrorCode.VALIDATION_ERROR,
          responseValidation.error.flatten().fieldErrors,
          'AI generated an invalid response. Please try again.'
        ),
        { status: 400 }
      );
    }

    const { questions, meta } = responseValidation.data;

    if (questions.length !== count || meta.question_count !== count) {
      console.error('[Generate API] Question count mismatch:', {
        expected: count,
        received: questions.length,
      });
      return NextResponse.json(
        createErrorResponse(
          'Model returned incorrect question count',
          ErrorCode.VALIDATION_ERROR,
          {
            expected: count,
            received: questions.length,
          },
          'AI generated incorrect number of questions. Please try again.'
        ),
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
      console.error('[Generate API] Settings mismatch:', {
        requested: {
          grade_level: gradeLevel,
          difficulty,
          question_types: questionTypes,
        },
        received: meta,
      });
      return NextResponse.json(
        createErrorResponse(
          'Model response settings mismatch',
          ErrorCode.VALIDATION_ERROR,
          {
            requested: {
              grade_level: gradeLevel,
              difficulty,
              question_types: questionTypes,
            },
            received: meta,
          },
          'AI generated questions with incorrect settings. Please try again.'
        ),
        { status: 400 }
      );
    }

    // Add unique IDs to each question before returning
    const questionsWithIds = questions.map((q, index) => ({
      ...q,
      id: `q${index + 1}-${Date.now()}`,
      options: q.options as [string, string, string, string], // Ensure tuple type
    }));

    console.log(`[Generate API] Successfully generated ${questionsWithIds.length} questions`);
    return NextResponse.json({
      questions: questionsWithIds,
      meta,
    });
  } catch (error) {
    console.error('[Generate API] Unexpected error:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to generate questions',
        ErrorCode.INTERNAL_ERROR,
        undefined,
        'An unexpected error occurred. Please try again later.'
      ),
      { status: 500 }
    );
  }
}
