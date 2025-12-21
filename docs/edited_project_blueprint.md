# Project Blueprint (MVP+) — English Test Question Generator

> **Goal:** Build a classroom-ready AI item generator that prioritizes **Teacher Control** (review + fix) over “AI magic,” while meeting mini-project RFQ requirements: **Google OAuth**, **LLM integration**, **DB CRUD**, **vibe coding log**, **deployable web app**.

---

## 1) Product Overview

### 1.1 One-liner

A specialized AI workbench for Korean middle school English teachers to generate **high-quality MCQs** from reading passages, with **evidence-based validation** and a professional review workflow.

### 1.2 Core Mission

**Move from “AI Magic” → “Teacher Control.”**
The system must produce outputs that teachers can trust, edit, and finalize.

### 1.3 MVP Scope

**Included (MVP)**

* Google OAuth login (Supabase Auth)
* Passage creation + listing + detail view
* AI generation of MCQ items (with **evidence quotes**)
* Teacher review view (PASS / NEEDS_FIX + reason)
* Save / load / delete question sets (DB CRUD)
* `prompts.md` vibe coding log
* Deployed on Vercel

**Out of Scope (Future)**

* Export PDF / Word (.docx)
* Search/filter in the bank
* Fully normalized `questions` table
* Supabase Edge Functions

---

## 2) Technical Stack & Architecture

### 2.1 Stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript (strict)
* **UI:** Tailwind CSS + shadcn/ui (Radix UI) + lucide-react → Bonus points in RFQ
* **Auth:** Supabase Auth + Google OAuth
* **DB:** Supabase (PostgreSQL)
* **AI:** OpenAI API (gpt-4o-mini or gpt-3.5-turbo, server-side only)
* **Deployment:** Vercel (Automatic CI/CD from GitHub)

### 2.2 Architecture (Single-Repo Fullstack Next.js)

```
Browser(UI)
  → Supabase Auth (OAuth)
  → Next.js Server (Route Handlers / API)
    → Supabase Postgres (with RLS)
    → OpenAI API
```

**Key principle**

* OpenAI API key is **never exposed** to the client
* Authentication handled by Supabase Auth (OAuth flow)
* DB access uses Supabase client with RLS policies enforced
* Server-side API routes use Supabase server client for admin operations
* **Supabase API Keys:** Use Publishable key (`sb_publishable_...`) for client-side and Secret key (`sb_secret_...`) for server-side. Never expose Secret key to the client.

---

## 3) Data Model & Schema (Supabase)

### 3.1 Why “Question Sets” over per-question rows?

The product workflow saves a **generated set** and reviews it as a unit (matches prototype):

* passage + options + generated questions[] + review results

### 3.2 Tables

#### profiles (User Table)

Used to store app-level user identity & metadata. References Supabase `auth.users`.

* id (uuid, PK, references auth.users.id)
* email (text, unique, not null)
* full_name (text)
* created_at (timestamptz, default now())

**Note:** `avatar_url` removed from MVP as it's not used in the UI. Can be added later if profile pictures are needed.

#### passages

* id (uuid, PK)
* user_id (uuid, FK → profiles.id)
* title (text, auto-generated or first 50 chars)
* content (text, not null)
* grade_level (text: M1 | M2 | M3)
* created_at (timestamptz)

#### question_sets

Stores the entire generated result in one row (payload JSONB).

* id (uuid, PK)
* passage_id (uuid, FK → passages.id, ON DELETE CASCADE)
* user_id (uuid, FK → profiles.id)
* difficulty (text: Easy | Medium | Hard)
* question_count (int)
* question_types (text[])
* payload (jsonb, not null)
* created_at (timestamptz)

### 3.3 JSON Payload Shape (Canonical)

**Question Types Enum:** `'Main Idea' | 'Detail' | 'Inference' | 'Vocabulary'`

```json
{
  "questions": [
    {
      "id": "q1",
      "type": "Main Idea",
      "difficulty": "Easy",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "evidence": "string (quote from passage)",
      "status": "PASS",
      "issue": null
    }
  ],
  "meta": {
    "grade_level": "M2",
    "difficulty": "Medium",
    "question_types": ["Main Idea", "Detail"]
  }
}
```

---

## 4) User Workflow & UI Requirements

### Screen Map

* `/login` — sign-in
* `/app` — dashboard (passage list + create)
* `/app/passage/[id]` — workbench (generate → review → save; show saved sets)

### Phase 1: Input & Settings

* **UI:** Split-pane layout. Left: Textarea (min 100 chars). Right: Form (shadcn/ui components)
* **Input Validation:** Prevent submission if text is too short (minimum 100 characters)
* **Settings:** Grade Level, Difficulty, Count (5-10), Question Types

### Phase 2: Generation

* **Logic:** User clicks "Generate" → Server API calls OpenAI with `response_format: { type: "json_object" }`
* **System Prompt Requirement:** AI must generate the question AND highlight specific "evidence" text (verbatim quote from passage)
* **UI:** Display "Generating..." skeleton loader
* **Error Handling:** Error toast + retry option

### Phase 3: Quality Review (Teacher Control)

**Feature:** This is the core differentiator.

* **UI:**
  * **PASS:** Green badge
  * **NEEDS_FIX:** Amber badge with a specific reason (e.g., "Distractor C is too ambiguous")
* **Actions:**
  * "Regenerate Single Item" (AI re-roll)
  * "Edit Manually" (Dialog input)

### Phase 4: Bank (Saved Sets)

* **UI:** Table view of saved passages/question sets
* List saved sets (latest first)
* View / Delete
* **Out of Scope (MVP):** Search/filter by Grade or Date

---

## 5) AI Generation Design

### 5.1 Requirements

* **Strict JSON output:** Use OpenAI `response_format: { type: "json_object" }`
* **Evidence requirement:** AI must generate the question AND highlight specific "evidence" text (verbatim quote from passage)
* **Quality validation:** Ambiguous distractors → NEEDS_FIX + explanation

### 5.2 Prompt Strategy

* System: role + constraints + JSON-only rule
* User: passage + settings

### 5.3 Validation

* Zod schema validation
* Invalid output → 400 + regenerate CTA

---

## 6) API Design (Next.js Route Handlers)

### Auth

* `app/auth/callback/route.ts` (OAuth callback handler)
* Supabase Auth with Google OAuth provider
* On sign-in: upsert profiles by email (using database trigger or API)
* Use `@supabase/ssr` for server-side session management

### Passages

* POST `/api/passages`
* GET `/api/passages`
* GET `/api/passages/[id]`

### Generation

* POST `/api/generate`
* Load passage → call OpenAI → validate → return payload

### Question Sets

* POST `/api/question-sets`
* GET `/api/question-sets?passageId=...`
* DELETE `/api/question-sets/[id]`
* PATCH `/api/question-sets/[id]` (optional)

---

## 7) Security & Access Control

* All API routes require authenticated session (via Supabase Auth)
* Use `auth.uid()` from Supabase session to get user ID
* **RLS Policies:** Enable Row Level Security on all tables
  * `passages`: Users can only see/insert/update/delete their own passages
  * `question_sets`: Users can only see/insert/update/delete their own question sets
  * `profiles`: Users can only see/update their own profile
* Server-side API routes use Supabase client with user session
* Client-side components use Supabase client with RLS enforcement

---

## 8) Repo Structure (Recommended)

```
/app
  /login/page.tsx
  /app/page.tsx
  /app/passage/[id]/page.tsx
  /auth
    /callback/route.ts (OAuth callback handler)
  /api
    /passages/route.ts
    /passages/[id]/route.ts
    /generate/route.ts
    /question-sets/route.ts
    /question-sets/[id]/route.ts

/lib
  supabase/
    client.ts (client-side Supabase client)
    server.ts (server-side Supabase client with SSR)
  db.ts
  llm.ts
  schemas.ts

/docs
  project_blueprint.md
  REQUIREMENTS.md

prompts.md
README.md
.env.example
middleware.ts
```

---

## 9) Vibe Coding & Documentation

### prompts.md Format

```md
## Feature: [Feature Name]
- Intent:
- Prompt:
- Verification:
- Refinement:
```

Minimum recommended entries:

* Auth setup
* Supabase schema
* Passage CRUD
* Generate API + Zod validation
* Question set CRUD
* Review UI

---

## 10) One-Day MVP Plan

### 10.1 High-Level Timeline

1. Bootstrapping (0.5h)
2. Auth (1–1.5h)
3. DB + Passage CRUD (1.5h)
4. Generate API (2h)
5. Save/Load/Delete Sets (1.5h)
6. Docs + Deploy (1h)

### 10.2 Detailed Implementation Steps

**Project Init:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint
npx shadcn-ui@latest init (Select Slate/Blue theme)
```

**Supabase Setup:**
* Install `@supabase/supabase-js` and `@supabase/ssr`
* Generate migration file based on schema in Section 3
* **API Keys:** Use Supabase's new **Publishable key** (`sb_publishable_...`) for client-side and **Secret key** (`sb_secret_...`) for server-side operations. See [Supabase API Keys documentation](https://supabase.com/docs/guides/api/api-keys) for details.
* **Environment Variables:** Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` (use Publishable key value) and `SUPABASE_SERVICE_ROLE_KEY` (use Secret key value) in `.env.local`
* **RLS Policies:** Enable Row Level Security on all tables
  * `passages`: `CREATE POLICY "Users can only see their own passages" ON passages FOR SELECT USING (auth.uid() = user_id);`
  * `question_sets`: `CREATE POLICY "Users can only see their own question sets" ON question_sets FOR SELECT USING (auth.uid() = user_id);`
  * Similar policies for INSERT, UPDATE, DELETE operations

**Auth Implementation:**
* Install `@supabase/supabase-js` and `@supabase/ssr`
* Configure Supabase Auth with Google OAuth provider in Supabase dashboard
* Create `app/auth/callback/route.ts` for OAuth callback handling
* Create `lib/supabase/client.ts` (client-side Supabase client)
* Create `lib/supabase/server.ts` (server-side Supabase client with SSR support)
* Add "Login with Google" button using Supabase Auth
* Set up database trigger or API route to upsert profiles on sign-in

**Core UI Layout:**
* Create `components/layout/sidebar.tsx`
* Create `app/app/page.tsx` (dashboard)
* Create `app/app/passage/[id]/page.tsx` (workbench)

**AI Generation API:**
* Create `app/api/generate/route.ts`
* Implement OpenAI call with strict JSON schema validation (Zod)
* Use `response_format: { type: "json_object" }`

**State Wiring:**
* Connect UI Forms → Next.js API → Supabase Database
* Implement question set CRUD operations

**Final Polish:**
* Add README.md (with architecture diagram, setup guide)
* Deploy to Vercel (automatic CI/CD from GitHub)

---

## 11) Acceptance Criteria (RFQ)

### 11.1 Submission Checklist

- [ ] Functional Web App (Next.js + Supabase)
- [ ] SNS Login (Google OAuth working)
- [ ] LLM Integration (Questions generated with Evidence)
- [ ] Database CRUD (Save/Load Questions)
- [ ] Vibe Coding Log (`prompts.md` filled out)
- [ ] Source Code (GitHub Repo Public/Invited)
- [ ] README (Install guide, Features, Tech Stack)
- [ ] Deployment (Vercel URL active)

### 11.2 Core Requirements

* Google OAuth works
* LLM generates MCQs with evidence
* DB CRUD implemented
* `prompts.md` included
* README included
* Vercel deployment live

---

## 12) Future Enhancements

* PDF / Word export
* Search & filter
* Normalize questions table
* ~~Add RLS~~ (Already implemented with Supabase Auth)
* Advanced per-item regeneration
