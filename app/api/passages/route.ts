import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { getPassages, createPassage } from '@/lib/db/queries/passages';
import { createPassageSchema } from '@/schemas/passage';

/**
 * GET /api/passages
 * Get all passages for the authenticated user
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const passages = await getPassages(user.id);

    return NextResponse.json({ passages });
  } catch (error) {
    console.error('Error fetching passages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch passages' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = createPassageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const passage = await createPassage(validationResult.data, user.id);

    return NextResponse.json({ passage }, { status: 201 });
  } catch (error) {
    console.error('Error creating passage:', error);
    return NextResponse.json(
      { error: 'Failed to create passage' },
      { status: 500 }
    );
  }
}

