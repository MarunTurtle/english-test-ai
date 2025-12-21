import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getQuestionSets, createQuestionSet } from '@/lib/db/queries/question-sets';
import { createQuestionSetSchema } from '@/schemas/question-set';
import type { CreateQuestionSetInput } from '@/types';
import { 
  createErrorResponse, 
  ErrorCode, 
  formatErrorForLog 
} from '@/lib/utils/error-handler';

/**
 * GET /api/question-sets
 * Get all question sets for the authenticated user
 * Query params:
 *   - passageId: Optional passage ID to filter by
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Question Sets API] Unauthorized access attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const passageId = searchParams.get('passageId') || undefined;

    const questionSets = await getQuestionSets(user.id, passageId);

    return NextResponse.json({ questionSets });
  } catch (error) {
    console.error('[Question Sets API] Error fetching question sets:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch question sets',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to load question sets. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * POST /api/question-sets
 * Create a new question set
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Question Sets API] Unauthorized create attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = createQuestionSetSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[Question Sets API] Validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        createErrorResponse(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          validationResult.error.flatten().fieldErrors
        ),
        { status: 400 }
      );
    }

    // Type assertion: Zod schema validates the structure, so we can safely assert the type
    const questionSet = await createQuestionSet(validationResult.data as CreateQuestionSetInput, user.id);

    console.log(`[Question Sets API] Created question set ${questionSet.id}`);
    return NextResponse.json({ questionSet }, { status: 201 });
  } catch (error) {
    console.error('[Question Sets API] Error creating question set:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to create question set',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to save question set. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

