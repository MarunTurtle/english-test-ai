# Recommended Project Structure

> **Next.js 14+ App Router | TypeScript | Supabase | Scalable Architecture**

This structure follows Next.js conventions, ensures clean code separation, and supports scalability.

---

## 📁 Complete Directory Structure

```
english-question-generator/
├── app/                          # Next.js App Router (Pages & Routes)
│   ├── page.tsx                   # Root landing page (entry point at /)
│   ├── (auth)/                   # Auth route group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx          # Landing/Login page
│   │   └── layout.tsx            # Optional: Auth-specific layout
│   │
│   ├── (app)/                    # Protected app route group
│   │   ├── layout.tsx            # App layout with Sidebar + Auth guard
│   │   ├── page.tsx              # Dashboard: Passage list + create
│   │   │
│   │   ├── passage/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Workbench: Input → Generate → Review
│   │   │   │   └── loading.tsx   # Loading UI
│   │   │   │
│   │   │   └── new/
│   │   │       └── page.tsx      # Create new passage
│   │   │
│   │   └── bank/
│   │       └── page.tsx          # Question Bank (saved sets)
│   │
│   ├── api/                      # API Route Handlers
│   │
│   │   ├── passages/
│   │   │   ├── route.ts          # GET, POST /api/passages
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE /api/passages/[id]
│   │   │
│   │   ├── generate/
│   │   │   └── route.ts          # POST /api/generate
│   │   │
│   │   └── question-sets/
│   │       ├── route.ts          # GET, POST /api/question-sets
│   │       └── [id]/
│   │           └── route.ts       # GET, PATCH, DELETE /api/question-sets/[id]
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Supabase OAuth callback
│   │
│   ├── layout.tsx                 # Root layout (providers, fonts, metadata)
│   ├── globals.css                # Global styles + Tailwind
│   ├── loading.tsx                # Global loading UI
│   ├── error.tsx                  # Global error boundary
│   └── not-found.tsx              # 404 page
│
├── components/                    # React Components (Client & Server)
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── table.tsx
│   │   └── ...                    # Other shadcn components
│   │
│   ├── layout/                    # Layout Components
│   │   ├── sidebar.tsx            # Sidebar navigation
│   │   ├── sidebar-nav-item.tsx   # Reusable nav item
│   │   ├── workflow-indicator.tsx # Workflow progress indicator
│   │   └── header.tsx             # Optional: Top header
│   │
│   ├── auth/                      # Auth Components
│   │   ├── login-form.tsx         # Login form with Google OAuth
│   │   ├── logout-button.tsx      # Logout button
│   │   └── auth-guard.tsx         # Client-side auth guard wrapper
│   │
│   ├── passages/                  # Passage-related Components
│   │   ├── passage-list.tsx      # Dashboard passage list
│   │   ├── passage-card.tsx      # Passage card item
│   │   ├── passage-form.tsx      # Create/edit passage form
│   │   └── passage-viewer.tsx    # Display passage (read-only)
│   │
│   ├── questions/                 # Question-related Components
│   │   ├── question-card.tsx     # Individual question display
│   │   ├── question-options.tsx  # Multiple choice options
│   │   ├── question-evidence.tsx # Evidence display
│   │   ├── question-list.tsx     # List of questions
│   │   └── question-edit-dialog.tsx # Manual edit dialog
│   │
│   ├── generation/                # Generation Flow Components
│   │   ├── input-screen.tsx      # Phase 1: Input & Settings
│   │   ├── generation-screen.tsx # Phase 2: Generated Questions
│   │   ├── validation-screen.tsx # Phase 3: Quality Review
│   │   ├── generation-settings.tsx # Settings form panel
│   │   └── generation-loader.tsx  # Loading skeleton during generation
│   │
│   ├── bank/                      # Question Bank Components
│   │   ├── bank-table.tsx        # Saved sets table
│   │   ├── bank-row.tsx          # Table row component
│   │   └── bank-filters.tsx      # Filter/search (future)
│   │
│   └── shared/                    # Shared/Reusable Components
│       ├── badge.tsx             # Status badges (PASS/NEEDS_FIX)
│       ├── difficulty-badge.tsx  # Difficulty indicator
│       ├── status-indicator.tsx  # Validation status UI
│       └── empty-state.tsx       # Empty state placeholder
│
├── lib/                           # Utilities & Core Logic
│   ├── supabase/                  # Supabase Clients
│   │   ├── client.ts             # Client-side Supabase client
│   │   ├── server.ts             # Server-side Supabase client (SSR)
│   │   └── middleware.ts         # Middleware helper for auth
│   │
│   ├── db/                        # Database Utilities
│   │   ├── queries/              # Database query functions
│   │   │   ├── passages.ts      # Passage queries
│   │   │   ├── question-sets.ts # Question set queries
│   │   │   └── profiles.ts      # Profile queries
│   │   │
│   │   └── types.ts              # Database type definitions (from Supabase)
│   │
│   ├── ai/                        # AI/LLM Integration
│   │   ├── openai.ts             # OpenAI client & configuration
│   │   ├── prompts.ts            # Prompt templates
│   │   └── validation.ts         # Response validation (Zod schemas)
│   │
│   ├── utils/                     # General Utilities
│   │   ├── cn.ts                 # Tailwind class name utility
│   │   ├── format.ts             # Date/number formatting
│   │   └── validation.ts         # Form validation helpers
│   │
│   └── constants/                 # Constants & Enums
│       ├── question-types.ts    # Question type enums
│       ├── difficulty.ts        # Difficulty levels
│       ├── grade-levels.ts      # Grade level options
│       └── routes.ts            # Route paths constants
│
├── hooks/                         # Custom React Hooks
│   ├── auth/
│   │   ├── use-auth.ts          # Auth state hook
│   │   └── use-session.ts       # Session management hook
│   │
│   ├── passages/
│   │   ├── use-passages.ts      # Fetch passages hook
│   │   ├── use-passage.ts       # Fetch single passage hook
│   │   └── use-create-passage.ts # Create passage mutation
│   │
│   ├── questions/
│   │   ├── use-generate-questions.ts # Generate questions hook
│   │   ├── use-question-sets.ts # Fetch question sets hook
│   │   └── use-save-question-set.ts # Save question set mutation
│   │
│   └── shared/
│       ├── use-toast.ts         # Toast notifications (if using shadcn)
│       └── use-debounce.ts      # Debounce utility hook
│
├── types/                         # TypeScript Type Definitions
│   ├── database.ts               # Supabase database types (generated)
│   ├── question.ts               # Question-related types
│   ├── passage.ts                # Passage-related types
│   ├── api.ts                    # API request/response types
│   └── index.ts                  # Re-export all types
│
├── schemas/                       # Zod Validation Schemas
│   ├── question.ts               # Question validation schema
│   ├── passage.ts                # Passage validation schema
│   ├── generation-request.ts    # Generation API request schema
│   └── question-set.ts           # Question set validation schema
│
├── middleware.ts                  # Next.js Middleware (Auth protection)
│
├── docs/                          # Documentation
│   ├── project_blueprint.md
│   ├── project_structure.md      # This file
│   ├── supabase_schema.sql
│   └── vibe_coding_log.md        # Development log
│
├── public/                        # Static Assets
│   ├── favicon.ico
│   └── ...                       # Other static files
│
├── .env.example                   # Environment variables template
├── .env.local                     # Local environment (gitignored)
├── .gitignore
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.mjs
├── package.json
├── README.md
└── prompts.md                     # Vibe coding log (RFQ requirement)
```

---

## 🎯 Key Architectural Decisions

### 1. **Route Groups** (`(auth)` and `(app)`)
- **`(auth)`**: Public routes (login) without app layout
- **`(app)`**: Protected routes with sidebar layout and auth guard
- Parentheses make them route groups (don't affect URL structure)

### 2. **Component Organization**
- **`components/ui/`**: Reusable shadcn/ui components
- **`components/[feature]/`**: Feature-specific components grouped by domain
- **`components/shared/`**: Cross-feature reusable components

### 3. **Separation of Concerns**

#### **Client vs Server Components**
- **Server Components** (default): Pages, layouts, data fetching
- **Client Components** (`'use client'`): Interactive UI, hooks, forms

#### **API Routes**
- All API routes in `app/api/` following RESTful conventions
- Server-side only (never expose secrets to client)

#### **Data Layer**
- **`lib/db/queries/`**: Database query functions (reusable)
- **`hooks/`**: React hooks for data fetching/mutations
- **`types/`**: TypeScript type definitions
- **`schemas/`**: Zod validation schemas

### 4. **Type Safety**
- **Database types**: Generated from Supabase schema
- **API types**: Request/response type definitions
- **Component props**: Typed with TypeScript interfaces
- **Validation**: Zod schemas for runtime validation

### 5. **Scalability Patterns**

#### **Feature-Based Organization**
```
components/
  ├── passages/     # All passage-related components
  ├── questions/    # All question-related components
  └── generation/   # Generation flow components
```

#### **Hooks for Data Management**
- Custom hooks encapsulate data fetching logic
- Easy to add caching, error handling, loading states
- Reusable across components

#### **Utility Functions**
- Domain-specific utilities in `lib/[domain]/`
- General utilities in `lib/utils/`
- Constants in `lib/constants/`

---

## 📝 File Naming Conventions

### **Components**
- **PascalCase**: `QuestionCard.tsx`, `InputScreen.tsx`
- **Descriptive names**: Clear purpose from filename

### **Hooks**
- **camelCase with `use-` prefix**: `use-passages.ts`, `use-auth.ts`
- **Kebab-case filenames**: `use-passages.ts` (Next.js convention)

### **Utilities**
- **camelCase**: `cn.ts`, `format.ts`
- **Descriptive names**: `question-validation.ts`

### **Types**
- **camelCase**: `question.ts`, `passage.ts`
- **PascalCase for exported types**: `Question`, `Passage`

### **API Routes**
- **route.ts**: Standard Next.js convention
- **RESTful naming**: `/api/passages/[id]/route.ts`

---

## 🔐 Security & Best Practices

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Publishable key (client-side)
SUPABASE_SERVICE_ROLE_KEY=...      # Secret key (server-side only)
OPENAI_API_KEY=...                  # Server-side only
```

### **Auth Protection**
- **Middleware**: Protects routes at edge
- **Server Components**: Check auth in `layout.tsx` or `page.tsx`
- **API Routes**: Validate session in each route handler

### **Type Safety**
- **Strict TypeScript**: `strict: true` in `tsconfig.json`
- **Zod validation**: Validate all API inputs/outputs
- **Database types**: Generate from Supabase schema

---

## 🚀 Implementation Priority

### **Phase 1: Foundation**
1. Project setup (Next.js, TypeScript, Tailwind, shadcn/ui)
2. Supabase configuration (client/server setup)
3. Auth flow (Google OAuth + proxy)
4. Basic layout (Sidebar + protected routes)

### **Phase 2: Core Features**
1. Passage CRUD (create, list, view)
2. Generation API (OpenAI integration)
3. Question display components
4. Validation screen

### **Phase 3: Polish**
1. Question Bank (save/load/delete)
2. Error handling & loading states
3. Toast notifications
4. Documentation

---

## 📚 Additional Notes

### **Why This Structure?**

1. **Next.js App Router**: Uses latest Next.js conventions (App Router)
2. **Type Safety**: Full TypeScript coverage with generated types
3. **Scalability**: Feature-based organization supports growth
4. **Maintainability**: Clear separation of concerns
5. **Developer Experience**: Easy to find and modify code
6. **Best Practices**: Follows React/Next.js community standards

### **Future Enhancements**
- Add `tests/` directory for unit/integration tests
- Add `scripts/` for build/deployment scripts
- Consider `app/loading.tsx` and `app/error.tsx` per route
- Add `lib/analytics/` for tracking (if needed)

---

## 🎨 Component Breakdown (Based on Prototype)

### **Landing Screen** (`app/(auth)/login/page.tsx`)
- Uses: `components/auth/login-form.tsx`
- Uses: `components/shared/empty-state.tsx` (optional)

### **App Layout** (`app/(app)/layout.tsx`)
- Uses: `components/layout/sidebar.tsx`
- Uses: `components/layout/workflow-indicator.tsx`
- Uses: `components/auth/auth-guard.tsx`

### **Dashboard** (`app/(app)/page.tsx`)
- Uses: `components/passages/passage-list.tsx`
- Uses: `components/passages/passage-card.tsx`

### **Workbench** (`app/(app)/passage/[id]/page.tsx`)
- Uses: `components/generation/input-screen.tsx`
- Uses: `components/generation/generation-screen.tsx`
- Uses: `components/generation/validation-screen.tsx`
- Uses: `components/questions/question-list.tsx`
- Uses: `components/questions/question-card.tsx`

### **Question Bank** (`app/(app)/bank/page.tsx`)
- Uses: `components/bank/bank-table.tsx`
- Uses: `components/bank/bank-row.tsx`

---

This structure provides a solid foundation for building a scalable, maintainable Next.js application that follows industry best practices.

