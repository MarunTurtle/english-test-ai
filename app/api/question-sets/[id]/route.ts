import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { 
  getQuestionSetById, 
  deleteQuestionSet 
} from '@/lib/db/queries/question-sets';

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const questionSet = await getQuestionSetById(id, user.id);

    if (!questionSet) {
      return NextResponse.json(
        { error: 'Question set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ questionSet });
  } catch (error) {
    console.error('Error fetching question set:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question set' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deleteQuestionSet(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question set:', error);
    return NextResponse.json(
      { error: 'Failed to delete question set' },
      { status: 500 }
    );
  }
}

