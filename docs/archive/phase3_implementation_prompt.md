# Phase 3 Implementation Prompt - Polish & Production Readiness

## Context
We have completed Phase 1 (Foundation) and Phase 2 (Core Features). The application now has:
- ✅ Google OAuth authentication
- ✅ Passage CRUD
- ✅ OpenAI question generation
- ✅ Validation screen with regenerate/edit
- ✅ Question Sets CRUD (save/load/delete)
- ✅ Complete workflow: Input → Generate → Review → Save → Bank

## Phase 3 Goal
Polish the application to production-ready state following RFQ requirements and industry best practices. Focus on user experience, error handling, documentation, and deployment readiness.

---

## Task 1: Toast Notification System

### Objective
Implement a professional toast notification system using shadcn/ui for user feedback on actions.

### Requirements
1. **Install shadcn/ui toast component**
   - Use `npx shadcn-ui@latest add toast`
   - Configure toast provider in root layout

2. **Implement toast for key actions**
   - ✅ Passage created successfully
   - ✅ Passage updated successfully
   - ✅ Passage deleted successfully
   - ✅ Questions generated successfully
   - ✅ Question set saved successfully
   - ✅ Question set deleted successfully
   - ❌ API errors (with retry option if applicable)
   - ❌ Network errors
   - ❌ Validation errors

3. **Toast variants**
   - Success (green)
   - Error (red)
   - Warning (amber)
   - Info (blue)

4. **Replace existing alerts**
   - Remove `alert()` and `confirm()` calls
   - Replace with toast notifications
   - Keep confirm dialogs for destructive actions (delete)

### Files to update
- `app/layout.tsx`: Add Toaster component
- `components/passages/passage-card.tsx`: Delete confirmation
- `components/passages/passage-form.tsx`: Success/error toasts
- `components/bank/bank-table.tsx`: Delete confirmation
- `app/(app)/passage/[id]/page.tsx`: Generation/save success/error
- `hooks/passages/use-create-passage.ts`: Consider adding toast logic
- `hooks/questions/use-save-question-set.ts`: Consider adding toast logic

### Design Reference
Follow @docs/prototype_code.tsx minimalist approach - unobtrusive, auto-dismissing toasts in bottom-right corner.

---

## Task 2: Enhanced Error Handling

### Objective
Implement comprehensive error handling with user-friendly messages and recovery options.

### Requirements
1. **API Route Error Responses**
   - Standardize error response format:
     ```typescript
     { error: string, details?: any, code?: string }
     ```
   - Add specific error codes (AUTH_ERROR, VALIDATION_ERROR, API_ERROR, etc.)
   - Log errors server-side for debugging

2. **Client-side Error Boundaries**
   - Create `components/shared/error-boundary.tsx`
   - Wrap app sections with error boundaries
   - Provide "Try Again" and "Go Home" actions
   - Log errors to console (or error tracking service in future)

3. **Hook Error Handling**
   - All custom hooks should return `{ data, loading, error }`
   - Error objects should include user-friendly messages
   - Add retry functions where applicable

4. **Specific Error Scenarios**
   - OpenAI API failures → Show "AI service unavailable, please try again"
   - Network timeouts → Show "Connection lost, check your internet"
   - Authentication errors → Redirect to login with message
   - Validation errors → Show specific field errors
   - Rate limiting → Show "Too many requests, please wait"

### Files to create
- `components/shared/error-boundary.tsx`
- `lib/utils/error-handler.ts` (error message formatter)

### Files to update
- All API routes in `app/api/`
- All hooks in `hooks/`
- `app/(app)/passage/[id]/page.tsx`
- `components/passages/passage-form.tsx`
- `components/generation/generation-settings.tsx`

---

## Task 3: Loading State Refinements

### Objective
Enhance loading states to match @docs/prototype_code.tsx polish and provide better UX.

### Requirements
1. **Skeleton Loaders**
   - Create skeleton components for:
     - Passage cards (dashboard)
     - Question cards (validation screen)
     - Bank table rows
   - Match @docs/prototype_code.tsx `animate-pulse` style

2. **Button Loading States**
   - All action buttons should show loading spinner when processing
   - Disable buttons during loading to prevent double-clicks
   - Show descriptive loading text ("Generating...", "Saving...", "Deleting...")

3. **Progress Indicators**
   - Generation screen: Already has loader, verify it matches prototype
   - Add progress indicator for long operations (if applicable)

4. **Optimistic UI Updates**
   - Delete operations: Immediately remove from UI
   - Create operations: Add to list immediately
   - Show undo option if action fails

### Files to create
- `components/shared/skeleton-loader.tsx`

### Files to update
- `components/passages/passage-list.tsx`
- `components/bank/bank-table.tsx`
- `components/generation/generation-loader.tsx` (verify matches prototype)
- All buttons in components

---

## Task 4: Documentation Updates

### Objective
Complete documentation to meet RFQ requirements and help future developers.

### Requirements
1. **README.md Enhancement**
   - Add comprehensive "Features" section
   - Add "Prerequisites" section (Node.js version, API keys)
   - Enhance "Environment Variables" section with examples
   - Add "Architecture" section with tech stack details
   - Add "Development" section with setup instructions
   - Add "Deployment" section for Vercel
   - Add "Testing" section (if tests exist)
   - Add "Contributing" section (if open source)
   - Add screenshots or GIF demo (optional but nice)

2. **API Documentation** (Optional but recommended)
   - Create `docs/api_documentation.md`
   - Document all API endpoints:
     - `/api/passages` (GET, POST)
     - `/api/passages/[id]` (GET, PATCH, DELETE)
     - `/api/generate` (POST)
     - `/api/question-sets` (GET, POST)
     - `/api/question-sets/[id]` (GET, DELETE)
   - Include request/response examples
   - Document error codes

3. **Component Documentation** (Optional)
   - Add JSDoc comments to complex components
   - Document props and usage examples
   - Helpful for future maintenance

### Files to update
- `README.md` (major update)

### Files to create
- `docs/api_documentation.md` (optional)
- `.env.example` (if not exists, create with all required vars)

---

## Task 5: Regenerate Single Question Feature

### Objective
Enhance the regenerate functionality with loading states and better UX.

### Requirements
1. **Loading State per Question**
   - Track which question is regenerating: `regeneratingQuestionId`
   - Show loading overlay on specific question card
   - Disable Regenerate/Edit buttons during regeneration
   - Show spinner on Regenerate button

2. **Error Handling**
   - If regeneration fails, keep original question
   - Show error toast with retry option
   - Don't block other questions

3. **Animation**
   - Smooth transition when replacing question
   - Match @docs/prototype_code.tsx style

### Files to update
- `app/(app)/passage/[id]/page.tsx`
- `components/generation/validation-screen.tsx`

---

## Task 6: Question Bank Enhancements

### Objective
Polish the Question Bank page with better empty states and actions.

### Requirements
1. **Enhanced Empty State**
   - Add illustration or icon (from react-icons)
   - Add CTA button: "Create Your First Passage"
   - Match @docs/prototype_code.tsx empty state style

2. **View Question Set Detail** (Optional)
   - Clicking on a question set shows detail view
   - Display all questions in the set
   - Provide download/export option (future)

3. **Confirmation Dialogs**
   - Use shadcn/ui AlertDialog for delete confirmation
   - Replace `window.confirm()` with proper dialog

### Files to update
- `app/(app)/bank/page.tsx`
- `components/bank/bank-table.tsx`
- `components/bank/bank-row.tsx`

---

## Task 7: Deployment Preparation

### Objective
Prepare the application for Vercel deployment per RFQ requirements.

### Requirements
1. **Environment Variables Check**
   - Verify all required env vars are documented
   - Test with missing env vars (should show helpful errors)
   - Add `.env.example` with placeholders

2. **Build Optimization**
   - Run `npm run build` and fix any warnings
   - Check bundle size (optimize if needed)
   - Verify no console errors in production build

3. **Vercel Configuration**
   - Create `vercel.json` if needed
   - Configure environment variables in Vercel dashboard
   - Set up domain (if applicable)

4. **Performance Check**
   - Test app with real data
   - Verify OpenAI API calls work in production
   - Check Supabase connection in production

### Files to create
- `.env.example`
- `vercel.json` (if needed)

### Files to update
- `README.md` (add deployment section)

---

## Task 8: Final QA & Testing

### Objective
Test the complete workflow end-to-end and fix any issues.

### Test Scenarios
1. **Authentication Flow**
   - [ ] Login with Google works
   - [ ] Logout works
   - [ ] Protected routes redirect to login
   - [ ] Logged-in users can't access login page

2. **Passage Management**
   - [ ] Create passage with valid content (100-10,000 chars)
   - [ ] Create passage with invalid content shows error
   - [ ] View passage detail
   - [ ] Edit passage (if implemented)
   - [ ] Delete passage shows confirmation
   - [ ] Delete passage removes from list

3. **Question Generation**
   - [ ] Generate questions with valid settings
   - [ ] Generate questions with different counts (5-10)
   - [ ] Generate questions with different types
   - [ ] Generation shows loading state
   - [ ] Generation error shows error message
   - [ ] Back button resets to input phase

4. **Question Validation**
   - [ ] Questions display correctly
   - [ ] PASS/NEEDS_FIX badges show correctly
   - [ ] Regenerate single question works
   - [ ] Edit question works (manual edit dialog)
   - [ ] Evidence quotes display correctly

5. **Question Sets**
   - [ ] Save question set to database
   - [ ] Saved set appears in Question Bank
   - [ ] View saved question set
   - [ ] Delete question set with confirmation
   - [ ] Deleted set removes from bank

6. **UI/UX**
   - [ ] All buttons have correct loading states
   - [ ] All actions show success/error feedback
   - [ ] No console errors
   - [ ] Responsive on different screen sizes (desktop focus)
   - [ ] Colors match prototype (slate/blue theme)

---

## Success Criteria

Phase 3 is complete when:

1. **RFQ Requirements Met**
   - [x] Functional Web App ✅
   - [x] SNS Login (Google OAuth) ✅
   - [x] LLM Integration (OpenAI) ✅
   - [x] Database CRUD ✅
   - [x] Vibe Coding Log (`docs/vibe_coding_log.md`) ✅
   - [ ] Source Code (GitHub repo accessible)
   - [ ] README with setup instructions
   - [ ] Deployment (Vercel URL live)

2. **User Experience**
   - [ ] No `alert()` or `confirm()` - use toast/dialogs
   - [ ] All actions have feedback (loading/success/error)
   - [ ] Errors are user-friendly and actionable
   - [ ] Loading states are polished
   - [ ] Empty states are helpful

3. **Code Quality**
   - [ ] No linter errors
   - [ ] No console errors in production
   - [ ] TypeScript strict mode passes
   - [ ] Build succeeds without warnings
   - [ ] All types are properly defined

4. **Documentation**
   - [ ] README is comprehensive
   - [ ] Environment variables documented
   - [ ] Setup instructions tested
   - [ ] Deployment guide included

---

## Implementation Order Recommendation

1. **Start with Toast System** (Task 1)
   - Quick win, improves UX immediately
   - Foundation for other tasks

2. **Enhanced Error Handling** (Task 2)
   - Makes app more robust
   - Better debugging experience

3. **Loading State Refinements** (Task 3)
   - Polish existing loading states
   - Add skeleton loaders

4. **Regenerate Feature Enhancement** (Task 5)
   - Already partially implemented
   - Add loading states

5. **Question Bank Enhancements** (Task 6)
   - Polish empty states
   - Better delete confirmation

6. **Documentation** (Task 4)
   - Can be done in parallel
   - Should be completed before deployment

7. **Deployment Preparation** (Task 7)
   - Final step before launch
   - Test everything in production environment

8. **Final QA** (Task 8)
   - Comprehensive testing
   - Fix any issues found

---

## Notes

- Follow @docs/prototype_code.tsx for design consistency
- Use react-icons (user preference) instead of lucide-react
- Maintain slate/blue color scheme throughout
- Keep MVP scope - don't add features beyond Phase 3
- Update vibe coding log after each major task
- Test thoroughly before marking complete

---

## Reference Files

- **Design**: `docs/prototype_code.tsx`
- **Architecture**: `docs/project_structure.md`
- **Requirements**: `docs/edited_project_blueprint.md`
- **Progress Log**: `docs/vibe_coding_log.md`

