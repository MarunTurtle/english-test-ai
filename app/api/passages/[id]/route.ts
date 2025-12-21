import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { 
  getPassageById, 
  updatePassage, 
  deletePassage 
} from '@/lib/db/queries/passages';
import { updatePassageSchema } from '@/schemas/passage';
import { 
  createErrorResponse, 
  ErrorCode, 
  formatErrorForLog 
} from '@/lib/utils/error-handler';

/**
 * GET /api/passages/[id]
 * Get a single passage by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Passage API] Unauthorized access attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { id } = await params;
    const passage = await getPassageById(id, user.id);

    if (!passage) {
      console.error(`[Passage API] Passage not found: ${id}`);
      return NextResponse.json(
        createErrorResponse(
          'Passage not found',
          ErrorCode.NOT_FOUND
        ),
        { status: 404 }
      );
    }

    return NextResponse.json({ passage });
  } catch (error) {
    console.error('[Passage API] Error fetching passage:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch passage',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to load passage. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/passages/[id]
 * Update a passage
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Passage API] Unauthorized update attempt');
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

    // Validate input
    const validationResult = updatePassageSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[Passage API] Update validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        createErrorResponse(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          validationResult.error.flatten().fieldErrors
        ),
        { status: 400 }
      );
    }

    const passage = await updatePassage(id, validationResult.data, user.id);

    console.log(`[Passage API] Updated passage ${id}`);
    return NextResponse.json({ passage });
  } catch (error) {
    console.error('[Passage API] Error updating passage:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to update passage',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to update passage. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/passages/[id]
 * Delete a passage
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Passage API] Unauthorized delete attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const { id } = await params;
    await deletePassage(id, user.id);

    console.log(`[Passage API] Deleted passage ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Passage API] Error deleting passage:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to delete passage',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to delete passage. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

