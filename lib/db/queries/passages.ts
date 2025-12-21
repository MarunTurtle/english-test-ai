import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Passage, CreatePassageInput, UpdatePassageInput } from '@/types/passage';

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

  // Auto-generate title from first 50 chars if not provided
  const title = data.title || data.content.substring(0, 50).trim() + '...';

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

  const updateData: any = {};
  
  if (data.content !== undefined) updateData.content = data.content;
  if (data.grade_level !== undefined) updateData.grade_level = data.grade_level;
  if (data.title !== undefined) updateData.title = data.title;

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
