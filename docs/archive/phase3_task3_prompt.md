# Phase 3 Task 3: Loading State Refinements - Implementation Prompt

## 목표 (Objective)
애플리케이션의 모든 로딩 상태를 세련되게 개선하여 사용자에게 더 나은 피드백을 제공. Skeleton loaders, spinner, progress indicators를 추가하고 프로토타입 디자인과 일관성을 유지.

## 현재 상태 (Current State)
- ✅ Toast notification system 구현 완료 (Task 1)
- ✅ Enhanced error handling 구현 완료 (Task 2)
- ✅ Bank filtering 기능 구현 완료 (추가 작업)
- ⚠️ 일부 로딩 상태 존재하지만 일관성 부족
- ⚠️ Skeleton loaders 미구현
- ⚠️ 버튼 로딩 상태 일부 누락

## 구현 요구사항 (Requirements)

### 1. Skeleton Loader 컴포넌트 생성
**목표**: 재사용 가능한 skeleton loader 컴포넌트 생성

**생성할 파일**:
- `components/shared/skeleton-loader.tsx`

**요구사항**:
- `animate-pulse` 효과 사용 (Tailwind)
- 다양한 variants 지원:
  - `card`: Passage 카드용 skeleton
  - `question`: Question 카드용 skeleton
  - `table-row`: Bank table row용 skeleton
  - `text`: 텍스트 라인용 skeleton
- Props로 크기/높이 커스터마이징 가능
- @docs/prototype_code.tsx 스타일 매칭

**예시 사용법**:
```tsx
<SkeletonLoader variant="card" />
<SkeletonLoader variant="question" count={3} />
<SkeletonLoader variant="table-row" />
```

---

### 2. Dashboard Loading States
**목표**: Dashboard의 passage 목록 로딩 시 skeleton 표시

**수정할 파일**:
- `app/(app)/dashboard/page.tsx`
- `components/passages/passage-list.tsx`

**요구사항**:
- Passage 로딩 중: 3개의 카드 skeleton 표시
- 그리드 레이아웃 유지 (md:grid-cols-2 lg:grid-cols-3)
- 로딩 상태와 에러 상태 명확히 구분
- Empty state는 기존 유지

---

### 3. Question Bank Loading States
**목표**: Bank table 로딩 시 skeleton 표시

**수정할 파일**:
- `components/bank/bank-table.tsx`

**요구사항**:
- Question sets 로딩 중: 5개의 table row skeleton 표시
- Table header는 항상 표시
- 로딩, 에러, empty, 데이터 상태 모두 처리
- 필터링 중에도 부드러운 전환

---

### 4. Button Loading States
**목표**: 모든 액션 버튼에 로딩 상태 추가

**수정할 파일**:
- `components/generation/generation-settings.tsx` (Generate 버튼)
- `components/passages/passage-form.tsx` (Save 버튼)
- `components/bank/bank-table.tsx` (Delete 버튼)
- `app/(app)/passage/[id]/page.tsx` (Save, Regenerate 버튼)
- `components/questions/question-card.tsx` (Regenerate, Edit 버튼)

**요구사항**:
- 로딩 중: spinner 아이콘 + 설명적 텍스트
  - "Generating..." (질문 생성 중)
  - "Saving..." (저장 중)
  - "Deleting..." (삭제 중)
  - "Regenerating..." (재생성 중)
- 로딩 중 버튼 비활성화 (double-click 방지)
- react-icons의 spinner 아이콘 사용 (`AiOutlineLoading3Quarters` + `animate-spin`)
- 버튼 크기/스타일 유지 (레이아웃 shift 방지)

**예시**:
```tsx
<button disabled={isLoading}>
  {isLoading ? (
    <>
      <AiOutlineLoading3Quarters className="animate-spin" />
      Generating...
    </>
  ) : (
    <>
      <FiZap />
      Generate Questions
    </>
  )}
</button>
```

---

### 5. Generation Screen Loader 검증
**목표**: 기존 generation loader가 프로토타입과 일치하는지 확인 및 개선

**수정할 파일**:
- `components/generation/generation-loader.tsx`

**요구사항**:
- Full-screen overlay 확인
- Spinner + "Generating questions..." 텍스트
- 프로토타입 스타일과 일치 확인
- 애니메이션 부드러움 검증

---

### 6. Spinner 컴포넌트 (Optional)
**목표**: 재사용 가능한 spinner 컴포넌트 생성 (필요시)

**생성할 파일** (optional):
- `components/shared/spinner.tsx`

**요구사항**:
- 다양한 크기 지원 (sm, md, lg)
- 색상 커스터마이징 가능
- react-icons 사용

---

## 디자인 가이드라인 (Design Guidelines)

### 색상 스킴
- Skeleton: `bg-slate-200` (light gray)
- Pulse animation: Tailwind의 `animate-pulse`
- Spinner: `text-blue-600` (primary accent)

### 애니메이션
- Skeleton: `animate-pulse` (Tailwind default)
- Spinner: `animate-spin` (Tailwind default)
- Duration: 부드럽게 (너무 빠르지 않게)

### 일관성
- 모든 로딩 상태는 시각적으로 일관성 유지
- react-icons 사용 (lucide-react 사용 금지)
- Slate/blue 색상 스킴 유지

---

## 체크리스트 (Checklist)

### Skeleton Loaders
- [ ] `skeleton-loader.tsx` 컴포넌트 생성
- [ ] Card variant 구현
- [ ] Question variant 구현
- [ ] Table row variant 구현
- [ ] Text variant 구현

### Dashboard
- [ ] Passage list skeleton 추가
- [ ] 로딩/에러/empty 상태 모두 처리
- [ ] 그리드 레이아웃 유지

### Question Bank
- [ ] Table skeleton 추가
- [ ] 로딩/에러/empty/data 상태 처리
- [ ] 필터링 시 부드러운 전환

### Button States
- [ ] Generate 버튼 로딩 상태
- [ ] Save 버튼 로딩 상태 (passage form)
- [ ] Save 버튼 로딩 상태 (workbench)
- [ ] Delete 버튼 로딩 상태
- [ ] Regenerate 버튼 로딩 상태
- [ ] Edit 버튼 로딩 상태 (if applicable)

### Verification
- [ ] No linter errors
- [ ] TypeScript 컴파일 성공
- [ ] 프로덕션 빌드 성공
- [ ] 모든 로딩 상태 시각적 테스트
- [ ] 애니메이션 부드러움 확인
- [ ] 레이아웃 shift 없음 확인

---

## 참고 파일 (Reference Files)
- **Design**: `docs/prototype_code.tsx` - 프로토타입 UI 참고
- **Icons**: react-icons (사용자 선호도)
- **Colors**: Slate/blue 스킴 유지
- **Animation**: Tailwind `animate-pulse`, `animate-spin`

---

## 주의사항 (Notes)
1. **레이아웃 Shift 방지**: 로딩 상태 전환 시 요소 크기 유지
2. **Double-click 방지**: 로딩 중 버튼 비활성화 필수
3. **일관성**: 모든 로딩 상태는 시각적으로 일관성 유지
4. **성능**: Skeleton 너무 많이 표시하지 않기 (3-5개 적절)
5. **사용자 피드백**: 로딩 텍스트는 구체적으로 ("Loading..." 대신 "Generating questions...")

---

## 성공 기준 (Success Criteria)
- ✅ 모든 주요 로딩 포인트에 skeleton/spinner 구현
- ✅ 버튼 로딩 상태 일관성 있게 적용
- ✅ 프로토타입 디자인과 일치
- ✅ No linter errors
- ✅ 부드러운 애니메이션
- ✅ 레이아웃 shift 없음
- ✅ 사용자 친화적 로딩 텍스트

---

## 구현 순서 (Implementation Order)
1. Skeleton loader 컴포넌트 생성 (foundation)
2. Dashboard loading states 추가
3. Question Bank loading states 추가
4. Button loading states 추가 (Generate → Save → Delete → Regenerate)
5. Generation screen loader 검증 및 개선
6. 전체 테스트 및 빌드 검증
7. vibe_coding_log.md 업데이트

---

## 실행 프롬프트 (Ready-to-Use Prompt)
```
Phase 3 Task 3 (Loading State Refinements)를 구현해줘.

목표:
- Skeleton loader 컴포넌트 생성 (card, question, table-row variants)
- Dashboard passage list에 skeleton 추가
- Question Bank table에 skeleton 추가
- 모든 액션 버튼에 로딩 상태 추가 (Generate, Save, Delete, Regenerate)
- Generation screen loader 검증 및 개선

요구사항:
- react-icons 사용 (AiOutlineLoading3Quarters + animate-spin)
- Tailwind animate-pulse for skeletons
- Slate/blue 색상 스킴 유지
- 레이아웃 shift 방지
- Double-click 방지 (로딩 중 버튼 비활성화)
- 구체적인 로딩 텍스트 ("Generating...", "Saving...", etc.)

@docs/prototype_code.tsx 디자인 참고해서 일관성 유지해줘.
```

