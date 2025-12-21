Project Blueprint: AI English Test Item Workbench
1. Product Overview
A specialized AI-powered workbench for Korean Middle School English teachers to generate high-quality multiple-choice questions (MCQs) from reading passages.
Core Mission: Move from "AI Magic" to "Teacher Control." Provide a reliable, professional workflow that produces classroom-ready assessments while meeting all RFQ requirements for the Mini Project.

2. Technical Stack & Architecture
Framework: Next.js 14+ (App Router)
Language: TypeScript (Strict mode)
Styling: Tailwind CSS + shadcn/ui (Radix UI) -> Bonus points in RFQ
Icons: Lucide React
Backend/Database: Supabase (PostgreSQL)
Authentication: Supabase Auth with Google OAuth (Required "Must-have")
AI Integration: OpenAI (gpt-4o-mini or gpt-3.5-turbo) via Supabase Edge Functions.
Deployment: Vercel (Automatic CI/CD from GitHub).
3. Database Schema (Supabase)
Table: profiles
id: uuid (Primary Key, references auth.users)
full_name: text
email: text
created_at: timestamp with time zone (default: now())
Table: passages
id: uuid (Primary Key, default: gen_random_uuid())
user_id: uuid (Foreign Key -> profiles.id)
content: text (The English reading passage)
title: text (Auto-generated or first 50 chars)
grade_level: text (Enum: 'M1', 'M2', 'M3')
created_at: timestamp with time zone
Table: questions
id: uuid (Primary Key, default: gen_random_uuid())
passage_id: uuid (Foreign Key -> passages.id with ON DELETE CASCADE)
type: text (Enum: 'Main Idea', 'Detail', 'Inference', 'Vocabulary')
difficulty: text (Enum: 'Easy', 'Medium', 'Hard')
question_text: text
options: jsonb (Array of 4 strings: ["Opt A", "Opt B", "Opt C", "Opt D"])
correct_answer: integer (Index 0-3)
evidence: text (Quote from passage proving the answer)
validation_status: text (Enum: 'PASS', 'NEEDS_FIX')
validation_note: text (AI explanation if status is NEEDS_FIX)
4. User Workflow & UI Requirements
Phase 1: Input & Settings (The Setup)
UI: Split-pane. Left: Textarea (min 100 chars). Right: Form (shadcn/ui components).
Input Validation: Prevent submission if text is too short.
Settings: Grade Level, Difficulty, Count (5-10), Question Types.
Phase 2: Generation & Pipeline (The Engine)
Logic:
User clicks "Generate".
Edge Function calls LLM with response_format: { type: "json_object" }.
System Prompt Requirement: AI must generate the question AND highlight specific "evidence" text.
UI: Display "Generating..." skeleton loader.
Phase 3: Quality Review (The "Teacher Control")
Feature: This is the core differentiator.
UI:
Pass: Green badge.
Needs Fix: Amber badge with a specific reason (e.g., "Distractor C is too ambiguous").
Actions: "Regenerate Single Item" (AI re-roll) or "Edit Manually" (Dialog input).
Phase 4: Bank & Export (The Deliverable)
UI: Table view of saved passages.
Search: Filter by Grade or Date.
Export:
PDF: Clean print layout.
Word: .docx download.
5. Vibe Coding & Documentation (RFQ Mandatory)
CRITICAL: You must maintain a prompts.md file in the root directory.
Format for prompts.md:

## Feature: [Feature Name]
- **Intent:** What I wanted to build (e.g., "Create Supabase schema").
- **Prompt:** The exact prompt given to Cursor.
- **Verification:** How I checked it worked (e.g., "Ran migration, checked Table Editor").
- **Refinement:** If it failed, what I asked next.
6. Implementation Steps for Cursor
Project Init:
npx create-next-app@latest . --typescript --tailwind --eslint
npx shadcn-ui@latest init (Select Slate/Blue theme).
Supabase Setup:
Install @supabase/supabase-js @supabase/ssr.
Generate Migration file based on Schema in Section 3.
RLS Policy: Enable "Enable RLS" and add policy "Users can only see their own data."
Auth Implementation:
Create auth/callback route.
Add "Login with Google" button using Supabase Auth UI or custom handler.
Core UI Layout:
Create components/layout/sidebar.tsx and app/dashboard/page.tsx.
AI Edge Function:
Create supabase/functions/generate-questions/index.ts.
Implement OpenAI call with strict JSON schema validation.
State Wiring:
Connect UI Forms -> Edge Function -> Supabase Database.
Final Polish:
Add README.md (with architecture diagram, setup guide).
Deploy to Vercel.
7. Submission Checklist (RFQ)
[ ] Functional Web App (Next.js + Supabase).
[ ] SNS Login (Google OAuth working).
[ ] LLM Integration (Questions generated with Evidence).
[ ] Database CRUD (Save/Load Questions).
[ ] Vibe Coding Log (prompts.md filled out).
[ ] Source Code (GitHub Repo Public/Invited).
[ ] README (Install guide, Features, Tech Stack).
[ ] Deployment (Vercel URL active).