import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Passage, CreatePassageInput, UpdatePassageInput } from '@/types/passage';
import { generatePassageTitle } from '@/lib/ai/title-generation';

/**
 * Get all passages for a user
 * @param userId - The user's ID
 * @returns Array of passages ordered by created_at DESC
 */
export async function getPassages(userId: string): Promise<Passage[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('passages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch passages: ${error.message}`);
  }

  return data as Passage[];
}

/**
 * Get a single passage by ID
 * @param id - The passage ID
 * @param userId - The user's ID (for RLS check)
 * @returns Single passage or null if not found
 */
export async function getPassageById(
  id: string,
  userId: string
): Promise<Passage | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('passages')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch passage: ${error.message}`);
  }

  return data as Passage;
}

/**
 * Create a new passage
 * @param data - The passage data
 * @param userId - The user's ID
 * @returns The created passage
 */
export async function createPassage(
  data: CreatePassageInput,
  userId: string
): Promise<Passage> {
  const supabase = await createServerSupabaseClient();

  // Auto-generate title using GPT-4o-mini if not provided
  let title = data.title?.trim();
  
  if (!title) {
    try {
      title = await generatePassageTitle(data.content);
    } catch (error) {
      console.error('Failed to generate title with GPT, using fallback:', error);
      // Fallback to first 50 chars if GPT generation fails
      title = data.content.substring(0, 50).trim() + '...';
    }
  }

  const { data: passage, error } = await supabase
    .from('passages')
    .insert({
      user_id: userId,
      title,
      content: data.content,
      grade_level: data.grade_level,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create passage: ${error.message}`);
  }

  return passage as Passage;
}

/**
 * Update an existing passage
 * @param id - The passage ID
 * @param data - The fields to update
 * @param userId - The user's ID (for RLS check)
 * @returns The updated passage
 */
export async function updatePassage(
  id: string,
  data: UpdatePassageInput,
  userId: string
): Promise<Passage> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  
  if (data.content !== undefined) updateData.content = data.content;
  if (data.grade_level !== undefined) updateData.grade_level = data.grade_level;
  
  // Handle title: if empty/undefined and content is being updated, generate new title
  if (data.title !== undefined) {
    const titleValue = data.title?.trim();
    
    // If title is empty and content is being updated, generate title from new content
    if (!titleValue && data.content !== undefined) {
      try {
        updateData.title = await generatePassageTitle(data.content);
      } catch (error) {
        console.error('Failed to generate title with GPT, using fallback:', error);
        // Fallback to first 50 chars if GPT generation fails
        updateData.title = data.content.substring(0, 50).trim() + '...';
      }
    } else if (titleValue) {
      // Use provided title
      updateData.title = titleValue;
    }
    // If title is empty string and content is not being updated, don't change title
  } else if (data.content !== undefined) {
    // Content is being updated but title is not provided
    // Check if current title is auto-generated (ends with '...')
    const currentPassage = await getPassageById(id, userId);
    if (currentPassage && currentPassage.title.endsWith('...')) {
      // Regenerate title from new content
      try {
        updateData.title = await generatePassageTitle(data.content);
      } catch (error) {
        console.error('Failed to generate title with GPT, using fallback:', error);
        updateData.title = data.content.substring(0, 50).trim() + '...';
      }
    }
  }

  const { data: passage, error } = await supabase
    .from('passages')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update passage: ${error.message}`);
  }

  return passage as Passage;
}

/**
 * Delete a passage
 * @param id - The passage ID
 * @param userId - The user's ID (for RLS check)
 * @returns True if deleted successfully
 */
export async function deletePassage(
  id: string,
  userId: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('passages')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete passage: ${error.message}`);
  }

  return true;
}
