import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { QuestionSet, CreateQuestionSetInput, QuestionSetWithPassage } from '@/types';

/**
 * Get all question sets for a user, optionally filtered by passage
 * @param userId - The user's ID
 * @param passageId - Optional passage ID to filter by
 * @returns Array of question sets ordered by created_at DESC
 */
export async function getQuestionSets(
  userId: string,
  passageId?: string
): Promise<QuestionSetWithPassage[]> {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('question_sets')
    .select(`
      *,
      passage:passages(id, title, grade_level)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (passageId) {
    query = query.eq('passage_id', passageId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch question sets: ${error.message}`);
  }

  return data as QuestionSetWithPassage[];
}

/**
 * Get a single question set by ID
 * @param id - The question set ID
 * @param userId - The user's ID (for RLS check)
 * @returns Single question set or null if not found
 */
export async function getQuestionSetById(
  id: string,
  userId: string
): Promise<QuestionSetWithPassage | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('question_sets')
    .select(`
      *,
      passage:passages(id, title, grade_level)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch question set: ${error.message}`);
  }

  return data as QuestionSetWithPassage;
}

/**
 * Create a new question set
 * @param data - The question set data
 * @param userId - The user's ID
 * @returns The created question set
 */
export async function createQuestionSet(
  data: CreateQuestionSetInput,
  userId: string
): Promise<QuestionSet> {
  const supabase = await createServerSupabaseClient();

  const { data: questionSet, error } = await supabase
    .from('question_sets')
    .insert({
      user_id: userId,
      passage_id: data.passage_id,
      difficulty: data.difficulty,
      question_count: data.question_count,
      question_types: data.question_types,
      payload: data.payload,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create question set: ${error.message}`);
  }

  return questionSet as QuestionSet;
}

/**
 * Delete a question set
 * @param id - The question set ID
 * @param userId - The user's ID (for RLS check)
 * @returns True if deleted successfully
 */
export async function deleteQuestionSet(
  id: string,
  userId: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('question_sets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete question set: ${error.message}`);
  }

  return true;
}
