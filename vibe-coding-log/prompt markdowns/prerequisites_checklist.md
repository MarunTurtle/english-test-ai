# Prerequisites Checklist — Before Building

This document outlines all the setup and configuration needed **before** starting to code, based on the project blueprint.

---

## 1. Supabase Project Setup

### 1.1 Create Supabase Project
- [ ] Sign up/login at [supabase.com](https://supabase.com)
- [ ] Create a new project
- [ ] Note your **Project URL** (e.g., `https://xxxxx.supabase.co`) 
- [ ] Note your **Publishable key** (found in Settings → API → API Keys tab, format: `sb_publishable_...`)
- [ ] Note your **Secret key** (found in Settings → API → API Keys tab, format: `sb_secret_...`, keep secret!)
- [ ] **Note:** Supabase now uses Publishable/Secret keys instead of the legacy `anon`/`service_role` JWT keys. See [API Keys documentation](https://supabase.com/docs/guides/api/api-keys) for details.

### 1.2 Database Schema Setup
Create the following tables in Supabase SQL Editor:

#### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### `passages` table
```sql
CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  grade_level TEXT CHECK (grade_level IN ('M1', 'M2', 'M3')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE passages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for passages
CREATE POLICY "Users can view own passages" ON passages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passages" ON passages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passages" ON passages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passages" ON passages
  FOR DELETE USING (auth.uid() = user_id);
```

#### `question_sets` table
```sql
CREATE TABLE question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_count INTEGER,
  question_types TEXT[],
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_sets
CREATE POLICY "Users can view own question sets" ON question_sets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question sets" ON question_sets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question sets" ON question_sets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own question sets" ON question_sets
  FOR DELETE USING (auth.uid() = user_id);
```

### 1.3 Database Trigger (Optional but Recommended)
Create a trigger to automatically create a profile when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.4 Google OAuth Configuration
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] Enable **Google** provider
- [ ] You'll need to set up Google OAuth credentials (see Section 2 below)
- [ ] Add redirect URL: `https://nlijxwdfotzdlwroihmx.supabase.co/auth/v1/callback`
- [ ] Save the **Client ID** and **Client Secret** from Google (you'll add these to Supabase)

---

## 2. Google OAuth Setup

### 2.1 Create Google Cloud Project
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create a new project (or select existing)
- [ ] Enable **Google+ API** (if not already enabled)

### 2.2 Create OAuth 2.0 Credentials
- [ ] Go to **APIs & Services** → **Credentials**
- [ ] Click **Create Credentials** → **OAuth client ID**
- [ ] Choose **Web application**
- [ ] Add **Authorized redirect URIs**:
  - `https://your-project-ref.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback` (for local development)
- [ ] Save and note your **Client ID** and **Client Secret**

### 2.3 Configure in Supabase
- [V] Go back to Supabase Dashboard → Authentication → Providers → Google
- [V] Paste **Client ID** and **Client Secret**
- [V] Save

---

## 3. OpenAI API Setup

### 3.1 Get API Key
- [ ] Sign up/login at [platform.openai.com](https://platform.openai.com)
- [ ] Go to **API Keys** section
- [ ] Create a new secret key
- [ ] **Important:** Copy and save it immediately (you won't see it again!)
- [ ] Decide on model: `gpt-5-mini`

### 3.2 Set Usage Limits (Optional but Recommended)
- [ ] Set up usage limits/billing alerts in OpenAI dashboard
- [ ] Monitor usage during development

---

## 4. GitHub Repository Setup

### 4.1 Create Repository
- [v] Create a new GitHub repository
- [v] Make it **public** (or add collaborators if private)
- [v] Initialize with README (optional)
- [v] Note the repository URL

### 4.2 Repository Settings (for Vercel)
- [ ] Ensure repository is accessible
- [ ] Note: Vercel will connect to this repo automatically

---

## 5. Vercel Account Setup (Optional for Now)

### 5.1 Create Account
- [v] Sign up at [vercel.com](https://vercel.com) (can use GitHub account)
- [v] Connect your GitHub account
- [v] Vercel URL: https://nextjs-boilerplate-rho-one-19.vercel.app/

---

## 6. Environment Variables

### 6.1 Create `.env.local` File
Create a `.env.local` file in the project root with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key-here
# Note: Variable name uses "ANON_KEY" but value should be your Publishable key (sb_publishable_...)
SUPABASE_SERVICE_ROLE_KEY=your-secret-key-here
# Note: Variable name uses "SERVICE_ROLE_KEY" but value should be your Secret key (sb_secret_...)

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# Next.js Auth (for OAuth callback)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** The environment variable names (`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`) remain the same for compatibility, but the actual key values should be your new **Publishable key** and **Secret key** (not the legacy JWT-based keys).

### 6.2 Create `.env.example` File
Create a `.env.example` file (without actual keys) for documentation:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Use your Publishable key (sb_publishable_...) here
SUPABASE_SERVICE_ROLE_KEY=
# Use your Secret key (sb_secret_...) here

# OpenAI
OPENAI_API_KEY=

# Next.js Auth
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6.3 Add to `.gitignore`
Ensure `.env.local` is in `.gitignore` (should be by default in Next.js)

---

## 7. Development Tools Setup

### 7.1 Node.js & npm
- [ ] Ensure Node.js 18+ is installed (`node --version`)
- [ ] Ensure npm is installed (`npm --version`)

### 7.2 Code Editor
- [ ] VS Code (recommended) or your preferred editor
- [ ] Install TypeScript extension (if using VS Code)

---

## 8. Quick Verification Checklist

Before starting to code, verify:

- [ ] Supabase project created and accessible
- [ ] All three tables created (`profiles`, `passages`, `question_sets`)
- [ ] RLS policies enabled and created for all tables
- [ ] Google OAuth configured in Supabase
- [ ] Google Cloud OAuth credentials created
- [ ] OpenAI API key obtained
- [ ] `.env.local` file created with all keys
- [ ] `.env.example` file created (template)
- [ ] GitHub repository created
- [ ] Node.js 18+ installed

---

## 9. Next Steps After Prerequisites

Once all prerequisites are complete, you can proceed with:

1. **Project Initialization** (Section 10.2 of blueprint):
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint
   npx shadcn-ui@latest init
   ```

2. **Install Dependencies**:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr openai zod
   ```

3. **Start Building** following the blueprint's implementation steps

---

## Notes

- **Security:** Never commit `.env.local` to git
- **Keys:** Keep Secret key (sb_secret_...) secret (server-side only). Publishable key (sb_publishable_...) is safe for client-side use with RLS enabled.
- **OAuth:** Redirect URLs must match exactly (including http vs https)
- **RLS:** Test RLS policies work correctly before proceeding
- **Costs:** Monitor OpenAI API usage during development
- **API Keys:** Supabase now uses Publishable/Secret keys instead of legacy JWT-based keys. See [API Keys documentation](https://supabase.com/docs/guides/api/api-keys) for migration details.

