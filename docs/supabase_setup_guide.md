# Supabase Database Schema Setup Guide

This guide walks you through setting up the database schema in Supabase for the English Test Question Generator project.

## Prerequisites

- ✅ Supabase project created (Step 1.1 completed)
- ✅ You have access to your Supabase project dashboard

## Step-by-Step Instructions

### Step 1: Open SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** button (top right)

### Step 2: Choose Your Script

**For First-Time Setup (Recommended - No Warnings):**
- Use `docs/supabase_schema_first_time.sql` - This version doesn't include DROP statements, so you won't see any warnings

**For Re-running/Updating (If policies already exist):**
- Use `docs/supabase_schema.sql` - This version includes DROP statements to cleanly recreate policies

### Step 2a: Copy and Paste the Schema

1. Open the appropriate SQL file (`supabase_schema_first_time.sql` for first-time setup)
2. Copy the **entire contents** of the file
3. Paste it into the SQL Editor in Supabase

### Step 3: Execute the Script

**⚠️ Important:** If this is your **first time** setting up the database, use the script below to avoid warnings. If you're **re-running** the script (to update policies), use `supabase_schema.sql` instead.

**Option A: First-Time Setup (No Warnings)**

Use this version if you're setting up a fresh database:

```sql
-- ============================================
-- FIRST-TIME SETUP (No DROP statements)
-- ============================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. PASSAGES TABLE
CREATE TABLE IF NOT EXISTS passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  grade_level TEXT CHECK (grade_level IN ('M1', 'M2', 'M3')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE passages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passages" ON passages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passages" ON passages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passages" ON passages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passages" ON passages
  FOR DELETE USING (auth.uid() = user_id);

-- 3. QUESTION_SETS TABLE
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

ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own question sets" ON question_sets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question sets" ON question_sets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question sets" ON question_sets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own question sets" ON question_sets
  FOR DELETE USING (auth.uid() = user_id);

-- 4. DATABASE TRIGGER
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Option B: Using the Full Script (May Show Warning)**

If you prefer to use `supabase_schema.sql`:

1. Copy the entire contents of `docs/supabase_schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
4. **If you see a warning dialog:**
   - The warning appears because the script includes `DROP POLICY IF EXISTS` statements
   - **This is safe** - it only drops and recreates policies (no data is deleted)
   - Click **"Run this query"** to proceed
5. Wait for execution to complete (should take a few seconds)
6. You should see a success message: "Success. No rows returned"

**Why the warning?** The script includes `DROP POLICY IF EXISTS` statements to allow re-running. These are safe because:
- They use `IF EXISTS` so they won't fail if policies don't exist
- Policies are immediately recreated after being dropped
- **No data is deleted** - only security policies are modified

### Step 4: Verify the Setup

Run these verification queries one by one in the SQL Editor:

#### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'passages', 'question_sets');
```

**Expected Result:** Should return 3 rows (profiles, passages, question_sets)

#### Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'passages', 'question_sets');
```

**Expected Result:** All three tables should show `rowsecurity = true`

#### Check Policies Exist
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'passages', 'question_sets')
ORDER BY tablename, policyname;
```

**Expected Result:** Should show:
- **profiles**: 3 policies (view, update, insert)
- **passages**: 4 policies (view, insert, update, delete)
- **question_sets**: 4 policies (view, insert, update, delete)

#### Check Trigger Exists
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Result:** Should return 1 row showing the trigger on `auth.users` table

### Step 5: Visual Verification (Optional)

1. Go to **Table Editor** in the left sidebar
2. You should see three tables:
   - `profiles`
   - `passages`
   - `question_sets`
3. Click on each table to verify the columns match the schema

## Schema Overview

### Tables Created

1. **`profiles`**
   - Stores user profile information
   - Linked to Supabase Auth users
   - Columns: `id`, `email`, `full_name`, `created_at`

2. **`passages`**
   - Stores reading passages created by teachers
   - Columns: `id`, `user_id`, `title`, `content`, `grade_level` (M1/M2/M3), `created_at`

3. **`question_sets`**
   - Stores generated question sets as JSONB
   - Columns: `id`, `passage_id`, `user_id`, `difficulty`, `question_count`, `question_types`, `payload` (JSONB), `created_at`

### Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **RLS Policies** ensure users can only access their own data
- ✅ **Cascade deletes** configured (deleting a user deletes their passages and question sets)
- ✅ **Auto-profile creation** trigger creates profile when user signs up

## Troubleshooting

### Error: "relation already exists"
- This means the tables already exist
- The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to re-run
- If you want to start fresh, drop tables first (see below)

### Error: "policy already exists"
- The script includes `DROP POLICY IF EXISTS` statements
- Re-run the entire script - it will clean up and recreate policies

### Need to Start Fresh?

If you need to completely reset the database:

```sql
-- WARNING: This will delete all data!
DROP TABLE IF EXISTS question_sets CASCADE;
DROP TABLE IF EXISTS passages CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```

Then re-run the `supabase_schema.sql` script.

### Verify RLS is Working

After setup, test that RLS is working:

1. Try to insert a passage without being authenticated (should fail)
2. Sign in via Google OAuth
3. Try to insert a passage (should succeed)
4. Try to view another user's passages (should only see your own)

## Next Steps

After completing this setup:

1. ✅ Mark Step 1.2 as complete in `prerequisites_checklist.md`
2. ✅ Proceed to Step 1.3 (Database Trigger - already included in the script)
3. ✅ Proceed to Step 1.4 (Google OAuth Configuration)
4. ✅ Continue with remaining prerequisites

## Notes

- The schema matches the requirements in `edited_project_blueprint.md`
- Grade levels are stored as `M1`, `M2`, `M3` (not "Middle 1", etc.) - the app will handle display mapping
- The `payload` column in `question_sets` stores the full JSON structure as defined in the blueprint
- All foreign keys have `ON DELETE CASCADE` to maintain data integrity

