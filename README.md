# English Question Generator

A specialized AI workbench for Korean middle school English teachers to generate **high-quality MCQs** from reading passages, with **evidence-based validation** and a professional review workflow.

## Overview

This project is a classroom-ready AI item generator that prioritizes **Teacher Control** (review + fix) over "AI magic." The system produces outputs that teachers can trust, edit, and finalize.

## Features

- 🔐 Google OAuth login (Supabase Auth)
- 📝 Passage creation + listing + detail view
- 🤖 AI generation of MCQ items (with **evidence quotes**)
- ✅ Teacher review view (PASS / NEEDS_FIX + reason)
- 💾 Save / load / delete question sets (DB CRUD)
- 📊 Vibe coding log tracking

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **UI:** Tailwind CSS + shadcn/ui (Radix UI) + lucide-react
- **Auth:** Supabase Auth + Google OAuth
- **DB:** Supabase (PostgreSQL)
- **AI:** OpenAI API (gpt-5-mini)
- **Deployment:** Vercel (Automatic CI/CD from GitHub)

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

## Documentation

See `docs/edited_project_blueprint.md` for detailed project documentation.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
