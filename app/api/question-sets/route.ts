import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getQuestionSets, createQuestionSet } from '@/lib/db/queries/question-sets';
import { createQuestionSetSchema } from '@/schemas/question-set';
import type { CreateQuestionSetInput } from '@/types';

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const passageId = searchParams.get('passageId') || undefined;

    const questionSets = await getQuestionSets(user.id, passageId);

    return NextResponse.json({ questionSets });
  } catch (error) {
    console.error('Error fetching question sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question sets' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = createQuestionSetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Type assertion: Zod schema validates the structure, so we can safely assert the type
    const questionSet = await createQuestionSet(validationResult.data as CreateQuestionSetInput, user.id);

    return NextResponse.json({ questionSet }, { status: 201 });
  } catch (error) {
    console.error('Error creating question set:', error);
    return NextResponse.json(
      { error: 'Failed to create question set' },
      { status: 500 }
    );
  }
}

