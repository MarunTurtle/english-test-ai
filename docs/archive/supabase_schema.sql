-- ============================================
-- Supabase Database Schema Setup
-- English Test Question Generator
-- ============================================
-- This script creates all required tables, RLS policies, and triggers
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores user profile information linked to Supabase Auth
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. PASSAGES TABLE
-- ============================================
-- Stores reading passages created by users
CREATE TABLE IF NOT EXISTS passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  grade_level TEXT CHECK (grade_level IN ('M1', 'M2', 'M3')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE passages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own passages" ON passages;
DROP POLICY IF EXISTS "Users can insert own passages" ON passages;
DROP POLICY IF EXISTS "Users can update own passages" ON passages;
DROP POLICY IF EXISTS "Users can delete own passages" ON passages;

-- RLS Policies for passages
CREATE POLICY "Users can view own passages" ON passages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passages" ON passages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passages" ON passages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passages" ON passages
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. QUESTION_SETS TABLE
-- ============================================
-- Stores generated question sets as JSONB payloads
CREATE TABLE IF NOT EXISTS question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_count INTEGER,
  question_types TEXT[],
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own question sets" ON question_sets;
DROP POLICY IF EXISTS "Users can insert own question sets" ON question_sets;
DROP POLICY IF EXISTS "Users can update own question sets" ON question_sets;
DROP POLICY IF EXISTS "Users can delete own question sets" ON question_sets;

-- RLS Policies for question_sets
CREATE POLICY "Users can view own question sets" ON question_sets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question sets" ON question_sets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question sets" ON question_sets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own question sets" ON question_sets
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. DATABASE TRIGGER (Auto-create profiles)
-- ============================================
-- Automatically creates a profile when a user signs up via OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists (for re-running script)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES (Optional)
-- ============================================
-- Run these after executing the script to verify everything was created:

-- Check tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('profiles', 'passages', 'question_sets');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'passages', 'question_sets');

-- Check policies exist
-- SELECT schemaname, tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'passages', 'question_sets');

-- Check trigger exists
-- SELECT trigger_name, event_object_table FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

