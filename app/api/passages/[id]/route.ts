import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { 
  getPassageById, 
  updatePassage, 
  deletePassage 
} from '@/lib/db/queries/passages';
import { updatePassageSchema } from '@/schemas/passage';

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const passage = await getPassageById(id, user.id);

    if (!passage) {
      return NextResponse.json(
        { error: 'Passage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ passage });
  } catch (error) {
    console.error('Error fetching passage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch passage' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updatePassageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const passage = await updatePassage(id, validationResult.data, user.id);

    return NextResponse.json({ passage });
  } catch (error) {
    console.error('Error updating passage:', error);
    return NextResponse.json(
      { error: 'Failed to update passage' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deletePassage(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting passage:', error);
    return NextResponse.json(
      { error: 'Failed to delete passage' },
      { status: 500 }
    );
  }
}

