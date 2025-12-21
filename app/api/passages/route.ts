import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getPassages, createPassage } from '@/lib/db/queries/passages';
import { createPassageSchema } from '@/schemas/passage';
import { 
  createErrorResponse, 
  ErrorCode, 
  formatErrorForLog 
} from '@/lib/utils/error-handler';

/**
 * GET /api/passages
 * Get all passages for the authenticated user
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Passages API] Unauthorized access attempt');
      return NextResponse.json(
        createErrorResponse(
          'Unauthorized',
          ErrorCode.UNAUTHORIZED
        ),
        { status: 401 }
      );
    }

    const passages = await getPassages(user.id);

    return NextResponse.json({ passages });
  } catch (error) {
    console.error('[Passages API] Error fetching passages:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to fetch passages',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to load passages. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

/**
 * POST /api/passages
 * Create a new passage
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      console.error('[Passages API] Unauthorized create attempt');
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
    const validationResult = createPassageSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[Passages API] Validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        createErrorResponse(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          validationResult.error.flatten().fieldErrors
        ),
        { status: 400 }
      );
    }

    const passage = await createPassage(validationResult.data, user.id);

    console.log(`[Passages API] Created passage ${passage.id}`);
    return NextResponse.json({ passage }, { status: 201 });
  } catch (error) {
    console.error('[Passages API] Error creating passage:', formatErrorForLog(error));
    return NextResponse.json(
      createErrorResponse(
        'Failed to create passage',
        ErrorCode.DATABASE_ERROR,
        undefined,
        'Unable to create passage. Please try again later.'
      ),
      { status: 500 }
    );
  }
}

