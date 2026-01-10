# Question Display Components Documentation

## Overview

This document describes the question display components implemented in Phase 2, Step 3 of the English Question Generator project. These components provide a comprehensive UI for displaying, editing, and managing generated questions.

---

## Component Architecture

### Component Hierarchy

```
QuestionList
├── ValidationSummary (inline)
└── QuestionCard (multiple)
    ├── QuestionOptions
    ├── QuestionEvidence
    ├── Badge (validation status)
    └── Action Buttons (optional)
        ├── Regenerate Button
        └── Edit Button → QuestionEditDialog
```

---

## Core Components

### 1. QuestionCard

**Location:** `components/questions/question-card.tsx`

**Purpose:** Displays a single question with all its details, including options, evidence, and validation status.

**Props:**
```typescript
interface QuestionCardProps {
  question: Question;           // The question data
  questionNumber?: number;      // Display number (e.g., Q1, Q2)
  showAnswer?: boolean;         // Whether to highlight correct answer
  onRegenerate?: (id: string) => void;  // Regenerate callback
  onEdit?: (id: string) => void;        // Edit callback
}
```

**Features:**
- Header with question type and difficulty badge
- Question text display
- Multiple choice options with correct answer highlighting
- Textual evidence section
- Validation status badge (PASS/NEEDS_FIX)
- Issue alert for NEEDS_FIX questions
- Optional action buttons (Regenerate/Edit)

**Usage Example:**
```tsx
<QuestionCard
  question={question}
  questionNumber={1}
  showAnswer={true}
  onRegenerate={(id) => handleRegenerate(id)}
  onEdit={(id) => handleEdit(id)}
/>
```

---

### 2. QuestionOptions

**Location:** `components/questions/question-options.tsx`

**Purpose:** Displays the four multiple-choice options in a grid layout.

**Props:**
```typescript
interface QuestionOptionsProps {
  options: [string, string, string, string];  // Exactly 4 options
  correctAnswer: number;                      // Index 0-3
  showAnswer?: boolean;                       // Highlight correct answer
}
```

**Features:**
- 2x2 grid layout
- Letter labels (A, B, C, D)
- Visual highlighting of correct answer (blue)
- Hover effects for better UX

**Usage Example:**
```tsx
<QuestionOptions
  options={['Option A', 'Option B', 'Option C', 'Option D']}
  correctAnswer={1}
  showAnswer={true}
/>
```

---

### 3. QuestionEvidence

**Location:** `components/questions/question-evidence.tsx`

**Purpose:** Displays the textual evidence supporting the correct answer.

**Props:**
```typescript
interface QuestionEvidenceProps {
  evidence: string;  // Direct quote from passage
}
```

**Features:**
- Styled quote box with left border
- "TEXTUAL EVIDENCE" label
- Italic text styling
- Subtle background color

**Usage Example:**
```tsx
<QuestionEvidence
  evidence="This is a direct quote from the passage supporting the answer."
/>
```

---

### 4. QuestionList

**Location:** `components/questions/question-list.tsx`

**Purpose:** Displays a list of questions with optional validation summary.

**Props:**
```typescript
interface QuestionListProps {
  questions: Question[];                     // Array of questions
  showValidationSummary?: boolean;           // Show summary at top
  onRegenerate?: (id: string) => void;       // Regenerate callback
  onEdit?: (id: string) => void;             // Edit callback
}
```

**Features:**
- Validation summary badges (Passed/Needs Attention)
- Automatic question numbering
- Empty state message
- Passes callbacks to child QuestionCard components

**Usage Example:**
```tsx
<QuestionList
  questions={questions}
  showValidationSummary={true}
  onRegenerate={handleRegenerate}
  onEdit={handleEdit}
/>
```

---

### 5. QuestionEditDialog

**Location:** `components/questions/question-edit-dialog.tsx`

**Purpose:** Modal dialog for manually editing question details.

**Props:**
```typescript
interface QuestionEditDialogProps {
  question: Question;                        // Question to edit
  open: boolean;                             // Dialog open state
  onOpenChange: (open: boolean) => void;     // Open state handler
  onSave: (updated: Question) => void;       // Save callback
}
```

**Features:**
- Full question editing capabilities
- Question type and difficulty selectors
- Question text textarea
- Four option inputs with letter labels
- Correct answer selector
- Evidence textarea
- Validation status selector
- Issue description (for NEEDS_FIX)
- Cancel/Save buttons

**Usage Example:**
```tsx
const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
const [isOpen, setIsOpen] = useState(false);

<QuestionEditDialog
  question={editingQuestion!}
  open={isOpen}
  onOpenChange={setIsOpen}
  onSave={(updated) => {
    // Update question in state
    setQuestions(prev => prev.map(q => 
      q.id === updated.id ? updated : q
    ));
  }}
/>
```

---

## UI Components

### Base UI Components

The following base UI components were implemented to support the question components:

#### Dialog
**Location:** `components/ui/dialog.tsx`

Modal dialog with overlay, keyboard support (ESC to close), and click-outside-to-close.

**Exports:**
- `Dialog` - Main container
- `DialogContent` - Content wrapper
- `DialogHeader` - Header section
- `DialogTitle` - Title text
- `DialogDescription` - Description text
- `DialogClose` - Close button
- `DialogFooter` - Footer with actions

#### Button
**Location:** `components/ui/button.tsx`

Reusable button component with variants and sizes.

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Sizes:** `sm`, `md`, `lg`

#### Input
**Location:** `components/ui/input.tsx`

Text input with label and error support.

#### Textarea
**Location:** `components/ui/textarea.tsx`

Multi-line text input with label and error support.

#### Select
**Location:** `components/ui/select.tsx`

Dropdown select with label and error support.

---

## Shared Components

### Badge
**Location:** `components/shared/badge.tsx`

Status badge component for validation status.

**Variants:** `success`, `warning`, `error`, `info`, `neutral`  
**Sizes:** `sm`, `md`

### DifficultyBadge
**Location:** `components/shared/difficulty-badge.tsx`

Specialized badge for displaying question difficulty with color coding.

---

## Type Definitions

### Question Type

**Location:** `types/question.ts`

```typescript
export interface Question {
  id: string;
  type: QuestionType;              // 'Main Idea' | 'Detail' | 'Inference' | 'Vocabulary'
  difficulty: QuestionDifficulty;  // 'Easy' | 'Medium' | 'Hard'
  question: string;
  options: [string, string, string, string];
  answer: number;                  // 0-3 (correct answer index)
  evidence: string;
  status: ValidationStatus;        // 'PASS' | 'NEEDS_FIX'
  issue?: string;                  // Optional issue description
}
```

---

## Utility Functions

### question-utils.ts

**Location:** `lib/utils/question-utils.ts`

```typescript
// Get validation summary
export function getValidationSummary(questions: Question[]): ValidationSummary {
  return {
    passed: number,
    needsFix: number,
    total: number,
  };
}
```

### question-transform.ts

**Location:** `lib/utils/question-transform.ts`

```typescript
// Transform API response to component format
export function transformApiQuestion(apiQuestion, index): Question;
export function transformApiQuestions(apiResponse): Question[];

// Transform component format back to API format
export function transformQuestionToApi(question): ApiQuestion;

// Generate unique question ID
export function generateQuestionId(): string;
```

### mock-questions.ts

**Location:** `lib/utils/mock-questions.ts`

```typescript
// Get mock questions for testing
export function getMockQuestions(count?: number): Question[];
export function getMockQuestionsByStatus(status): Question[];
export function getMockQuestionById(id): Question | undefined;
```

---

## Data Flow

### API Response → Component Display

1. **API Response** (snake_case)
   ```json
   {
     "questions": [{
       "question_text": "...",
       "correct_answer": 0,
       "validation_status": "PASS",
       "validation_note": null
     }]
   }
   ```

2. **Transform** using `transformApiQuestions()`
   ```typescript
   const questions = transformApiQuestions(apiResponse);
   ```

3. **Component Display** (camelCase)
   ```typescript
   <QuestionList questions={questions} />
   ```

### Component Edit → API Update

1. **User Edits** via `QuestionEditDialog`
2. **Component State** updates with camelCase Question
3. **Transform** using `transformQuestionToApi()`
4. **API Request** with snake_case format

---

## Styling

### Design System

**Colors:**
- Primary: Blue (`blue-600`, `blue-700`)
- Success: Green (`green-600`, `green-700`)
- Warning: Amber (`amber-600`, `amber-700`)
- Error: Red (`red-600`, `red-700`)
- Neutral: Slate (`slate-600`, `slate-700`)

**Spacing:**
- Component padding: `p-6` (24px)
- Component gap: `gap-4` (16px)
- List spacing: `space-y-6` (24px vertical)

**Typography:**
- Question text: `text-lg font-semibold`
- Labels: `text-xs font-bold uppercase`
- Evidence: `text-sm italic`

**Borders:**
- Cards: `border border-slate-200 rounded-xl`
- Evidence: `border-l-4 border-slate-200`

---

## Testing

### Test Page

**Location:** `app/(app)/test-questions/page.tsx`

A dedicated test page for viewing and testing question components with mock data.

**URL:** `/test-questions`

**Features:**
- Displays 5 mock questions
- Tests QuestionList component
- Tests QuestionEditDialog
- Interactive edit functionality

**Usage:**
```bash
npm run dev
# Navigate to http://localhost:3000/test-questions
```

---

## Integration with Workbench

The question components are integrated into the passage workbench:

**Location:** `app/(app)/passage/[id]/page.tsx`

**Workflow:**
1. **Input Phase:** User configures settings
2. **Generating Phase:** Loading state
3. **Results Phase:** QuestionList displays generated questions

**Features:**
- Side-by-side passage reference and questions
- Validation summary
- Save question set functionality (to be implemented)

---

## Best Practices

### 1. Type Safety
- Always use the `Question` type from `types/question.ts`
- Use transformer functions for API ↔ Component conversion

### 2. Validation Status
- Display validation status prominently
- Show issue descriptions for NEEDS_FIX questions
- Use color coding (green for PASS, amber for NEEDS_FIX)

### 3. User Experience
- Provide clear visual feedback for correct answers
- Use hover effects for interactive elements
- Show loading states during async operations
- Include empty states for no data

### 4. Accessibility
- Use semantic HTML elements
- Include aria-labels for icon buttons
- Support keyboard navigation (ESC to close dialogs)
- Maintain proper heading hierarchy

---

## Future Enhancements

### Planned Features
1. **Inline Editing:** Edit questions without opening dialog
2. **Drag & Drop:** Reorder questions
3. **Bulk Actions:** Select multiple questions for batch operations
4. **Export:** Export questions to various formats (PDF, DOCX)
5. **Print View:** Optimized layout for printing
6. **Question Preview:** Student-facing view without answers
7. **Difficulty Analysis:** Visual indicators of difficulty distribution
8. **Type Distribution:** Chart showing question type breakdown

### Performance Optimizations
1. **Virtualization:** For large question lists (100+ questions)
2. **Lazy Loading:** Load questions on scroll
3. **Memoization:** Optimize re-renders with React.memo
4. **Code Splitting:** Lazy load QuestionEditDialog

---

## Troubleshooting

### Common Issues

**1. Questions not displaying**
- Check that questions array is not empty
- Verify Question type matches expected structure
- Check console for errors

**2. Edit dialog not opening**
- Verify `open` state is being set to `true`
- Check that `editingQuestion` is not null
- Ensure dialog is rendered in component tree

**3. Validation status not showing**
- Verify `status` field is 'PASS' or 'NEEDS_FIX'
- Check Badge component is imported correctly

**4. Options not displaying correctly**
- Ensure options array has exactly 4 elements
- Verify options are strings, not objects
- Check correct_answer is 0-3

---

## API Reference

### QuestionCard API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | `Question` | Required | Question data to display |
| `questionNumber` | `number` | undefined | Display number (e.g., 1 for Q1) |
| `showAnswer` | `boolean` | `true` | Highlight correct answer |
| `onRegenerate` | `(id: string) => void` | undefined | Regenerate callback |
| `onEdit` | `(id: string) => void` | undefined | Edit callback |

### QuestionList API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `questions` | `Question[]` | Required | Array of questions |
| `showValidationSummary` | `boolean` | `true` | Show summary at top |
| `onRegenerate` | `(id: string) => void` | undefined | Regenerate callback |
| `onEdit` | `(id: string) => void` | undefined | Edit callback |

### QuestionEditDialog API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | `Question` | Required | Question to edit |
| `open` | `boolean` | Required | Dialog open state |
| `onOpenChange` | `(open: boolean) => void` | Required | State change handler |
| `onSave` | `(question: Question) => void` | Required | Save callback |

---

## Conclusion

The question display components provide a comprehensive, type-safe, and user-friendly interface for displaying and managing generated questions. They follow React best practices, maintain consistent styling, and are fully integrated with the application's data flow.

**Status:** ✅ Phase 2, Step 3 Complete

**Next Step:** Phase 2, Step 4 - Validation Screen

