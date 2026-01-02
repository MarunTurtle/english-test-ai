import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { 
  getQuestionSetById, 
  updateQuestionSet,
  deleteQuestionSet 
} from '@/lib/db/queries/question-sets';
import { 
  createErrorResponse, 
  ErrorCode, 
  formatErrorForLog 
} from '@/lib/utils/error-handler';

/**
 * GET /api/question-sets/[id]
 * Get a single question set by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Question Set API] Unauthorized access attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { id } = await params;
    const questionSet = await getQuestionSetById(id, user.id);

    if (!questionSet) {
      console.error(`[Question Set API] Question set not found: ${id}`);
      return NextResponse.json(
        createErrorResponse(
          'Question set not found',
          ErrorCode.NOT_FOUND
        ),
        { status: 404 }
      );
    }

    return NextResponse.json({ questionSet });
  } catch (error) {
    console.error('[Question Set API] Error fetching question set:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch question set',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to load question set. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/question-sets/[id]
 * Update a question set (partial update)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Question Set API] Unauthorized update attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate that we have something to update
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        createErrorResponse(
          'No data provided for update',
          ErrorCode.VALIDATION_ERROR
        ),
        { status: 400 }
      );
    }

    const questionSet = await updateQuestionSet(id, body, user.id);

    console.log(`[Question Set API] Updated question set ${id}`);
    return NextResponse.json({ questionSet });
  } catch (error) {
    console.error('[Question Set API] Error updating question set:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to update question set',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to update question set. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/question-sets/[id]
 * Delete a question set
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Question Set API] Unauthorized delete attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { id } = await params;
    await deleteQuestionSet(id, user.id);

    console.log(`[Question Set API] Deleted question set ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Question Set API] Error deleting question set:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to delete question set',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to delete question set. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

