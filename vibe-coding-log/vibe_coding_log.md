# Vibe Coding Log

이 문서는 요구사항에 따라 개발 과정에서 사용된 주요 프롬프트, 사용된 AI 모델, 의도, 검증 결과 및 수정 사항의 기록입니다.

## 🎯 개발 과정 하이라이트

### 사용한 AI 도구
- **Claude Sonnet 4.5** (Cursor Agent): 대부분의 구현
- **Gemini 3.0 Pro**: 초기 기획 및 Blueprint
- **Cursor Composer1**: 프로젝트 구조 설계, 깃 커밋 및 브랜치 관리

#### 바이브 코딩 프로세스
- 와이어프레임과 프로토타입은 Gemini 3.0 Pro와 canvas 기능을 사용하여 빠르게 개발 진행.
- 모든 개발 단계에서 다음 파일들을 Cursor Agent의 컨텍스트로 활용:
  - `docs/edited_project_blueprint.md` (요구사항 명세서)
  - `docs/project_structure.md` (프로젝트 구조)
  - `docs/prototype_code.tsx` (프로토타입 코드)
- 단계별 구현 과정에 맞춰 프롬프트 마크다운 파일을 생성하도록 지시 후 해당 프롬픔트 검증 이후 구현 진행
- `.cursorrules` 파일에 Git 커밋 규칙(Conventional Commits), 브랜치 전략(main/develop), 바이브 코딩 로그 작성 규칙을 정의하여 Cursor Agent가 일관된 개발 프로세스를 따르도록 설정

#### 1단계: 기획 및 설계 (Planning & Design)
- **Gemini 2.0 Pro**: 와이어프레임 생성 및 UI/UX 설계
- **프로토타입 코드 추출**: HTML/CSS를 기반으로 React 컴포넌트 구조 파악
- **Cursor Composer**: 
  - 요구사항 명세서(Project Blueprint) 생성 및 검증
  - 프로젝트 구조 설계 (폴더 구조, 파일 구조)
  - 상세 개발 계획 수립 (단계별 구현 로드맵)

#### 2단계: Foundation (기반 구조 구축)
- Next.js 14 App Router 프로젝트 초기 설정
- Supabase 인증 시스템 구현 (Google OAuth)
- 레이아웃 및 네비게이션 구조 구축
- 라우팅 및 미들웨어 설정

#### 3단계: Core Features (핵심 기능 구현)
- Passage CRUD API 및 페이지 구현
- OpenAI 통합 (문제 생성 API)
- Question Set CRUD 구현
- 문제 검증 및 편집 기능
- Question Bank 구현

#### 4단계: Polish (완성도 향상)
- Toast 알림 시스템
- Error Boundary 및 에러 처리
- Loading 상태 및 Skeleton UI
- 사용자 경험 개선 (UX refinement)
- 코드 리팩토링 및 최적화

#### 5단계: Deployment (배포)
- Vercel 배포 설정
- 환경 변수 관리
- 프로덕션 빌드 최적화

각 단계별로 구체적인 프롬프트를 작성하여 Claude Sonnet 4.5 (Cursor Agent)와 협업하며, 모든 주요 개발 과정을 이 로그에 기록.

---

## 0. Cursor 세팅

### 사용 모델 (Model):
- Cursor Composer1

### 의도 (Intent): 
- Cursor AI 에이전트가 일관된 Git 워크플로우와 커밋 메시지 형식을 따르도록 하기 위해 프로젝트 규칙을 설정. 
- MVP 개발을 위한 간단한 브랜치 전략과 RFQ 요구사항인 바이브 코딩 로그 작성 규칙을 포함.

### 프롬프트 (Prompt):
**1단계: Git 커밋 및 리베이스 규칙 생성**
```
Create a prompt for agent in cursor that is responsible for git commit and rebase. 
It should include rules of naming of the commit and the rules for writing details.
```

**2단계: 브랜치 전략 추가**
```
add a branch rule in cursorrules. Since we are building an mvp, make it simple. Any suggestions?
```

**3단계: 바이브 코딩 로그 규칙 추가**
- `.cursorrules` 파일에 Vibe Coding Log Rules 섹션 추가 요청

### 검증 (Verification):
- `.cursorrules` 파일 생성 확인
- Conventional Commits 형식 규칙 포함 여부 확인
- 커밋 본문에 1-5개 bullet point 사용 규칙 확인
- develop 브랜치를 main에 병합 시 rebase 후 fast-forward merge로 merge commit 방지 규칙 확인
- MVP용 간단한 브랜치 전략 (main, develop, optional feature branches) 포함 확인
- 바이브 코딩 로그 작성 시점 및 형식 규칙 포함 확인

### 수정 (Refinement):
**초기 커밋 규칙 설정:**
- 커밋 본문 형식을 더 간결하게 수정 요청: "Have you added that you should rebase main on develop branch and than merge to avoid leaving dirty merge commits? I do not want merge commits."
- 커밋 본문 bullet point 개수 제한: "I want the commit body to be much concise please. let is use only maximum 5bulletpoints. minimum 1."

**Git 설정:**
- 한국어 파일명 인코딩 문제 해결: `git config core.quotepath false` 설정으로 UTF-8 파일명 정상 표시 확인

**초기 커밋 작업:**
- `.gitignore` 파일 추가 (macOS, Windows, React, Next.js, Node.js용 종합 설정)
- `.cursorrules` 파일 커밋
- 프로젝트 문서 (`docs/` 폴더) 추가
- `develop` 브랜치 생성 및 원격 저장소에 푸시

## 1. 초기 기획 및 와이어프레임 설계

### 사용 모델 (Model):
- Gemini 3.0 Pro

### 의도 (Intent):
- 영어 교사를 위한 AI 문제 생성 도구의 핵심 UX 흐름(입력 -> 생성 -> 검토 -> 저장)을 정의하고, 복잡하지 않은 직관적인 UI 구조를 설계하기 위함.

### 프롬프트 (Prompt):
```
Design a low-fidelity wireframe for a web-based teacher tool.

Product concept:
An English teacher-focused AI-powered test item generation workbench.

Teachers input an English reading passage and generate high-quality multiple-choice test questions with controlled difficulty, clear textual evidence, and automatic quality validation.

Target users:
Middle school English teachers in Korea.
They are experienced educators, not tech experts.
They value clarity, control, reliability, and reusability over flashy UI.

Tone & UX principles:
- Professional, calm, and practical
- Minimal cognitive load
- Clear step-by-step workflow
- Emphasis on “teacher control” rather than “AI magic”

Pages to design (4 main screens):

1) Input & Settings Page
- Large text area for pasting an English passage
- Settings panel with:
- Grade level (Middle 1 / Middle 2 / Middle 3)
- Question type ratio (Main idea / Detail / Inference / Vocabulary)
- Difficulty distribution (Easy / Medium / Hard)
- Number of questions (5–10)
- Primary CTA button: “Generate Question Set”

2) Generated Question Set Page
- List of generated multiple-choice questions
- Each question card includes:
- Question text
- 4 answer choices
- Clearly marked correct answer
- Highlighted textual evidence from the passage
- Visual distinction between question content and evidence

3) Quality Review & Validation Page
- Same question list with validation status badges:
- PASS
- NEEDS FIX
- For items marked NEEDS FIX:
- Short explanation of the issue (e.g., ambiguous distractor, weak evidence)
- Optional action buttons:
- “Regenerate this question”
- “Edit manually”

4) Question Bank / Save Page
- Ability to save selected questions
- Saved question list with:
- Passage title
- Question type
- Difficulty tag
- Button to regenerate a new set using the same settings

Wireframe requirements:
- Use clear section labels
- Avoid colors and branding (grayscale wireframe only)
- Desktop-first layout
- Emphasize workflow progression (Input → Generate → Review → Save)

Do NOT design marketing pages.
Focus only on functional teacher workflow screens.
```

### 검증 (Verification):
- 생성된 텍스트 와이어프레임이 4단계(Input, Generated Set, Validation, Question Bank)를 모두 포함하고 있는지 확인.
- 교사 중심의 '통제권'이 강조된 UI인지 확인.
- pdf파일을 첨부해 과제의 요구사항을 모두 반영했는지 확인.

```
Now after reading this document, check if we meet the basic necessary criteria of the tasks.
```

### 수정 (Refinement):
- 초안이 요구사항을 잘 반영하여 별도의 수정 없이 프로토타입 단계로 진행.

## 2. 인터랙티브 프로토타입 구현

### 사용 모델 (Model):
- Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent):
- 와이어프레임을 바탕으로 실제 화면 전환과 데이터 흐름을 시각적으로 확인하기 위해 단일 파일(Single File) 형태의 React 프로토타입을 제작.

### 프롬프트 (Prompt):
- "Now let's build a prototype according to it. (Generate a high-fidelity, single-file React prototype...)"

### 검증 (Verification):
- App.jsx 파일이 생성됨.
- 사이드바 네비게이션, 문제 생성 시뮬레이션, PASS/NEEDS FIX 뱃지 등 핵심 기능이 React 상태(State)로 구현되었는지 확인.

### 수정 (Refinement):
- 기능 구현은 완료되었으나, 앱의 진입점이 부족하여 구글 로그인이 추가된 랜딩 페이지 추가.


## 3. 개발 청사진(Blueprint) 작성

### 사용 모델 (Model):
- Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent):
- Cursor AI를 활용해 실제 Next.js 앱을 구축하기 위한 '지시서' 역할을 할 기술 명세서(DB 스키마, 기술 스택, 기능 명세) 작성.

### 프롬프트 (Prompt):
- "I am planning to build this using next.js, supabase, using cursor to actually build this application. Create a markdown document that can be the base of the operation in cursor including all the schematics and requirements..."

### 검증 (Verification):
- project_blueprint.md 파일 생성.
- Supabase 테이블(profiles, passages, questions) 구조와 Tailwind CSS 스타일 가이드 포함 여부 확인.

## 4. 요구사항 명세서 반영 및 명세서 고도화

### 사용 모델 (Model):
- Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent):
- 업로드한 과제 제안요청서를 분석하여, 누락된 필수 요건(SNS 로그인, 바이브 코딩 로그 등)을 Blueprint에 추가.

### 프롬프트 (Prompt):
- "Now after reading this document [과제 명세서], check if we meet the basic necessary criteria of the tasks. ... Good now let's go ahead and edit the project blueprint."

### 검증 (Verification):
- Blueprint 문서 업데이트 확인.
- Auth: Supabase Auth + Google OAuth (필수 요건 반영)
- Deliverables: prompts.md (바이브 코딩 로그) 작성 지침 추가
- Tech Stack: shadcn/ui 추가 (가산점 항목 반영)

## 5. 프로젝트 폴더 구조 확정

### 사용 모델 (Model): 
- **1차 생성**: Cursor Composer1
- **2차 검증**: Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent):
- 확장 가능한 Next.js 14 App Router 기반의 디렉토리 구조를 정의하여 개발 혼선 방지.
- 프로토타입의 UI 구조와 Blueprint의 기능 요구사항을 모두 반영한 실용적이고 확장 가능한 아키텍처 설계.

### 프롬프트 (Prompt): 
**1차 생성 (Cursor Composer1 모델 사용):**
```
Our goal is to build a nextjs/typescript/supabase webapp that has the ui of @english-question-generator/docs/prototype_code.tsx and the features that are in @english-question-generator/docs/edited_project_blueprint.md. Recommend me project-structure that follows the convention of nextjs/typescript projects and also guarantees clean code and scalability.
```

**2차 검증 (Gemini 2.0 Flash 모델 사용):**
```
I have developed a project structure for this app. Do you think below structure is appropriate for the current app?
```
(생성된 project_structure.md 내용 전체를 첨부하여 검증 요청)

### 검증 (Verification): 
**1차 생성 결과:**
- `docs/project_structure.md` 파일 생성 확인
- Next.js 14 App Router 기반 구조 제안
- Route Groups `(auth)`와 `(app)` 분리로 인증/비인증 라우트 구분
- 기능별 컴포넌트 폴더링 (`components/generation/`, `components/questions/`, `components/passages/` 등)
- TypeScript 타입 정의, Zod 스키마, 커스텀 훅 등 확장 가능한 구조 포함

**2차 검증 결과 (Gemini 피드백):**
- 구조가 RFQ 요구사항을 잘 반영함 (docs/vibe_coding_log.md, prompts.md 포함)
- 확장 가능한 "Workbench" 구조 (passage/[id] 라우트로 딥링크 지원)
- 컴포넌트 분리로 유지보수성 확보 (generation vs questions)
- **제안사항**: 루트 경로(`app/page.tsx`)를 랜딩 페이지 엔트리 포인트로 추가하여 404 방지

### 수정 (Refinement): 
Gemini의 제안을 검토한 결과, 루트 경로(`app/page.tsx`)를 랜딩 페이지 엔트리 포인트로 추가하여 404를 방지하는 것이 좋다고 판단. 최종 구조는:
- `app/page.tsx`: 루트 랜딩 페이지 (엔트리 포인트, `/` 경로)
- `app/(auth)/login/page.tsx`: 로그인 전용 페이지 (`/login` 경로)
- `app/(app)/`: 보호된 앱 라우트 그룹 (사이드바 레이아웃 포함)
- Route Groups `(auth)`와 `(app)`을 활용하여 인증/비인증 라우트를 명시적으로 분리

## 6. 프로젝트 빌드 전 필수 준비사항 정리

### 사용 모델 (Model):
- Cursor Composer1

### 의도 (Intent):
- 프로젝트 빌드를 시작하기 전에 필요한 모든 설정(Supabase 프로젝트, Google OAuth, OpenAI API, 환경 변수 등)을 체계적으로 정리하고, 실제 설정 과정에서 기록할 수 있는 템플릿을 제공하기 위함.
- Supabase의 새로운 API 키 시스템(Publishable/Secret 키)을 반영하여 최신 문서화를 유지.

### 프롬프트 (Prompt):
**1단계: Prerequisites Checklist 생성**
```
[edited_project_blueprint.md] According to the blueprint, what should we prepare before start builiding the project? I am looking for such things as setting up supabase project, or api keys and stuff
```

**2단계: Prerequisites Notes 템플릿 생성**
```
ok now than make a new markdown to take notes on the things that @prerequisites_checklist.md requires.
```

### 검증 (Verification):
**생성된 문서:**
- `docs/prerequisites_checklist.md`: 프로젝트 빌드 전 필수 준비사항 체크리스트 생성 확인
  - Supabase 프로젝트 설정 (테이블, RLS 정책, OAuth 설정)
  - Google OAuth 설정 (Google Cloud Console)
  - OpenAI API 키 설정
  - GitHub 및 Vercel 설정
  - 환경 변수 설정 가이드
  - SQL 스크립트 포함 (profiles, passages, question_sets 테이블 및 RLS 정책)

- `docs/prerequisites_notes.md`: 설정 과정에서 실제 값과 메모를 기록할 수 있는 템플릿 생성 확인
  - 각 섹션별 필수 정보 입력 필드
  - 진행 상황 추적용 체크박스
  - 테스트 결과 기록 섹션
  - 빠른 참조용 요약 섹션

- `docs/edited_project_blueprint.md`: Blueprint에 새로운 API 키 시스템 반영
  - Section 2.2 (Key principle)에 API 키 사용 가이드 추가
  - Section 10.2 (Supabase Setup)에 환경 변수 설정 명시

### 수정 (Refinement):
**Supabase API 키 시스템 업데이트:**
- Supabase가 새로운 API 키 시스템을 도입했다는 사실 확인
- Legacy JWT 기반 `anon`/`service_role` 키 대신 새로운 Publishable/Secret 키 사용
- 환경 변수 이름(`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)은 호환성을 위해 유지하되, 실제 값은 새로운 키 형식 사용
- [Supabase API Keys 문서](https://supabase.com/docs/guides/api/api-keys) 링크 추가

**문서 일관성:**
- `prerequisites_checklist.md`와 `prerequisites_notes.md`의 용어 통일
- Blueprint 문서와 Prerequisites 문서 간 일관성 유지
- 모든 문서에서 새로운 API 키 시스템 반영

## 7. Supabase 데이터베이스 스키마 설정

### 사용 모델 (Model):
- Cursor Composer1

### 의도 (Intent):
- Prerequisites Checklist의 1.2 단계인 Supabase 데이터베이스 스키마를 설정하기 위함.
- Blueprint와 프로토타입 코드를 검증하여 필요한 테이블(`profiles`, `passages`, `question_sets`), RLS 정책, 그리고 자동 프로필 생성 트리거를 생성.

### 프롬프트 (Prompt):
**1단계: 스키마 검증 및 SQL 스크립트 생성**
```
Help me on doing 1.2 step on supabase. [prerequisites_checklist.md] 
Also check if the tables are appropriately made according to the @edited_project_blueprint.md 
and @docs/prototype_code.tsx.
```

### 검증 (Verification):
**스키마 검증:**
- Blueprint의 데이터 모델 요구사항과 완전히 일치 확인
- 프로토타입 코드의 데이터 구조와 호환성 확인
- RLS 정책이 모든 테이블에 적용되었는지 확인
- Foreign key 제약조건과 CASCADE 삭제 설정 확인

**생성된 파일:**
- `docs/supabase_schema.sql`: 전체 스키마 스크립트 (DROP 문 포함, 재실행 가능)
- `docs/supabase_schema_first_time.sql`: 첫 설정용 스크립트 (경고 없음)
- `docs/supabase_setup_guide.md`: 단계별 설정 가이드
- `docs/schema_verification.md`: 스키마 검증 문서

**실행 결과:**
- SQL 스크립트 실행 성공: "Success. No rows returned" 메시지 확인
- 3개 테이블 생성 확인 (`profiles`, `passages`, `question_sets`)
- 11개 RLS 정책 생성 확인
- 자동 프로필 생성 트리거 생성 확인

## 8. 랜딩 페이지 및 Google OAuth 로그인 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 필수 요건인 Google OAuth 로그인 기능을 구현하기 위해 Supabase Auth와 Google OAuth를 활용한 로그인 시스템 구축.
- 동시에 앱의 진입점이 되는 랜딩 페이지와 로그인 성공 후 대시보드 페이지를 개발하여 사용자 인증 플로우 완성.

### 프롬프트 (Prompt):
**1단계: 대시보드 페이지 생성 및 Google 로그인 구현**
```
Now, let's implement the google login in [app/page.tsx]. 
First let's create a simple app dashboard page [app/(app)/page.tsx] 
so that after login we can know it worked. just for now put succeded on the center.
```

**2단계: redirect_uri_mismatch 오류 해결**
```
이 앱에서 잘못된 요청을 전송했으므로 로그인할 수 없습니다. 
400 오류: redirect_uri_mismatch
```
→ Supabase URL Configuration 및 Google Cloud Console 설정 확인

**3단계: 리디렉션 경로 문제 해결**
→ 대시보드를 `/dashboard` 경로로 분리

**4단계: 최종 리디렉트 URL 수정**
→ `redirectTo`를 명시적으로 `/auth/callback`으로 설정

### 검증 (Verification):
**생성된 파일 및 구조:**
- `app/page.tsx`: 랜딩/로그인 페이지
  - Google OAuth 로그인 버튼 포함
  - 프로페셔널한 hero section 디자인
  - prototype의 raw svg 대신 react-icons의 FaGoogle 사용
  
- `app/(app)/dashboard/page.tsx`: 로그인 성공 후 대시보드
  - "Login Succeeded!" 메시지 표시
  
- `lib/supabase/client.ts`: 클라이언트 사이드 Supabase 클라이언트
  - `@supabase/ssr` 사용 (Next.js App Router 최적화)
  - `createBrowserClient` 함수로 구현
  
- `app/auth/callback/route.ts`: OAuth 콜백 라우트
  - `exchangeCodeForSession`으로 인증 코드 처리
  - `/dashboard`로 리디렉트

- `components/auth/login-form.tsx`: 로그인 폼 컴포넌트
  - Google OAuth 플로우 처리
  - 로딩 상태 관리
  - 에러 핸들링

**설치된 패키지:**
- `@supabase/supabase-js`: Supabase 클라이언트 라이브러리
- `@supabase/ssr`: Next.js App Router SSR 지원

**로그인 플로우 검증:**
1. `http://localhost:3000` 접속 → 랜딩 페이지 표시
2. "Continue with Google" 클릭 → Google OAuth 화면으로 리디렉트
3. Google 계정 선택 및 로그인 → Supabase 콜백 처리
4. `/auth/callback` → `/dashboard`로 리디렉트
5. "Login Succeeded!" 메시지 표시

### 수정 (Refinement):
**라우트 구조 변경:**
- 초기: `app/(app)/page.tsx` (루트 경로와 충돌)
- 변경: `app/(app)/dashboard/page.tsx` (`/dashboard` 경로로 분리)
- 이유: Next.js가 `app/page.tsx`와 `app/(app)/page.tsx`를 동일한 `/` 경로로 인식하여 충돌 발생

**OAuth 리디렉션 URL 설정 순서:**
1. 처음: `redirectTo: window.location.origin` → 홈페이지로 리디렉트되어 콜백 라우트가 호출되지 않음
2. 수정: `redirectTo: \`\${window.location.origin}/auth/callback\`` → 정확한 콜백 경로 지정

**콜백 라우트 개선:**
- 에러 핸들링 추가 (try-catch로 쿠키 설정 오류 처리)
- 기본 리디렉트 경로를 `/dashboard`로 설정
- 로그인 실패 시 홈페이지(`/`)로 리디렉트

**구현 접근 방식 비교 (참고 블로그 프로젝트 vs 현재 프로젝트):**
```
Now compare the logic that @/Users/marun/Documents/GitHub/nextjs-supabase-auth/ implemented to make google login work. What are the differences?
```

| 항목 | 참고 프로젝트 | 현재 프로젝트 | 우수성 |
|------|--------------|--------------|--------|
| Client 생성 | `@supabase/supabase-js` | `@supabase/ssr` | ✅ 현재 (App Router 최적화) |
| OAuth 설정 | redirectTo 없음 | 명시적 redirectTo | ✅ 현재 (명확한 제어) |
| 콜백 처리 | 구식 `setAuthCookie` API | 최신 `exchangeCodeForSession` | ✅ 현재 |
| SSR 지원 | 제한적 | 완전 지원 | ✅ 현재 |
| 세션 관리 | ✅ 구현됨 | ❌ 미구현 (다음 단계) | - |

## 9. 세션 관리 및 인증 보호 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 참고 프로젝트와의 비교 분석을 통해 누락된 세션 관리 기능을 파악하고, Next.js App Router에 최적화된 다층 방어 전략(Middleware + Server Components + Client Listener)으로 보호된 라우트를 구현.
- MVP 단계에서 필요한 핵심 인증 기능을 완성.

### 프롬프트 (Prompt):
**1단계: 참고 프로젝트와의 차이점 분석**
```
Perfect! Now compare it with the logic that @/Users/marun/Documents/GitHub/nextjs-supabase-auth/ 
implemented to make google login work. What are the differences?
```

**2단계: 세션 관리 구현 방법 논의**
```
Ok than. Let's add session management. What are your thoughts on the method?
```
Response:
```
Questions for You:
Do you want all routes under (app) protected? Or should some be public?
Where should logged-in users go by default? /dashboard or /passage/new?
Should we show a loading state while checking auth, or redirect immediately?
```

**3단계: 구현 요구사항 확정**
```
1. Protect ALL routes under (app) - 선택
2. /dashboard
3. redirect immediately
```

### 검증 (Verification):
**인증 플로우:**
1. 사용자가 `/dashboard` 접근 시도
2. **Proxy**: 세션 없음 → `/`로 즉시 리디렉트
3. 사용자 로그인 → `/dashboard`로 이동
4. **AuthProvider**: 세션 감지 및 상태 업데이트
5. **Dashboard**: 사용자 정보 표시
6. Sign Out 클릭 → **AuthProvider**: 세션 종료 및 `/`로 리디렉트
7. **Proxy**: 보호된 페이지 접근 차단

**테스트 시나리오 검증:**
- Test 1: 비로그인 상태에서 `/dashboard` 접근 → `/`로 즉시 리디렉트
- Test 2: 로그인 → Google OAuth → `/dashboard`로 자동 리디렉트
- Test 3: 로그인 상태에서 `/` 접근 → `/dashboard`로 자동 리디렉트
- Test 4: Sign Out 클릭 → `/`로 리디렉트 후 보호된 페이지 접근 불가
- Test 5: 멀티탭에서 로그아웃 → 모든 탭에서 자동 리디렉트
- Test 6: 터미널 로그 확인 → 307 리디렉트 및 200 성공 응답 확인

**참고 프로젝트 대비 개선사항:**
1. **Edge-level 보호**: Middleware로 페이지 렌더링 전 차단 (참고 프로젝트는 클라이언트 사이드만)
2. **SSR 최적화**: `@supabase/ssr` 사용으로 서버 컴포넌트 완전 지원
3. **최신 API**: Deprecated API 제거, Supabase 권장 패턴 적용
4. **다층 방어**: Middleware + Server + Client 3단계 보호
5. **UX 향상**: 깜빡임 없는 즉시 리디렉트, 로딩 상태 제거

**보안 강화:**
- Edge에서 세션 검증 (클라이언트 JS 로드 전)
- 쿠키 기반 인증 (XSS 공격 완화)
- RLS와 연동된 서버 사이드 검증
- 모든 보호된 라우트에 대한 일관된 접근 제어

## 10. Foundation - 앱 레이아웃, 사이드바 및 인증 보호 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 프로토타입의 UI를 참고하여 실제 앱의 기본 구조(레이아웃, 사이드바 네비게이션, 인증 가드)를 구현.
- 모든 보호된 라우트에 대한 일관된 레이아웃과 네비게이션을 제공하며, 프로토타입에서 경험한 것과 동일한 UI/UX를 Next.js App Router에서 구현.

### 프롬프트 (Prompt):
**1단계: 개발 우선순위 확인**
```
Now according to [edited_project_blueprint.md] and [project_structure.md], what should I start developing now? I have completed the landing page and google oauth.
```

**2단계: Phase 1 Foundation 시작**
```
Ok then, let's start with Phase1 Foundation (complete first). 
Take into account the @docs/prototype_code.tsx for the ui.
```

### 검증 (Verification):
**생성된 파일 및 구조:**
**1. Route Constants** - `lib/constants/routes.ts`
- 모든 앱 라우트 경로를 상수로 정의
- Public routes와 Protected routes 분리
- Type-safe route 함수 (예: `PASSAGE_DETAIL(id)`)

**2. Layout Components**:
- `components/layout/sidebar-nav-item.tsx`: 재사용 가능한 네비게이션 아이템
  - `usePathname`으로 active 상태 감지
  - 프로토타입의 스타일 그대로 적용 (active 시 white background)
  
- `components/layout/workflow-indicator.tsx`: 워크플로우 진행 표시기
  - Input → Generate → Review → Save 4단계 표시
  - 현재 단계 하이라이트

- `components/auth/logout-button.tsx`: 로그아웃 버튼
  - `useAuth` hook 사용
  - react-icons 사용 (사용자 선호 반영)

- `components/layout/sidebar.tsx`: 메인 사이드바
  - 프로토타입 디자인 완전 재현
  - "New Question Set", "Question Bank" 네비게이션
  - 하단에 워크플로우 인디케이터 + 로그아웃 버튼
  - Database 아이콘과 "AI Workbench" 브랜딩

**3. Auth Guard** - `components/auth/auth-guard.tsx`
- Client-side 인증 보호
- Loading 상태 처리
- 미인증 시 로딩 스피너 표시

**4. App Layout** - `app/(app)/layout.tsx`
- `AuthGuard`로 전체 래핑
- Sidebar + Main content area flex 레이아웃
- 프로토타입의 "flex h-screen bg-white" 스타일 재현

### 수정 (Refinement):
**문제 1: 무한 리디렉트 루프**

**원인 분석:**
1. `proxy.ts`가 이미 존재하며 auth 리디렉트 처리 중
2. 새로 만든 `middleware.ts`와 충돌 → Next.js 에러 발생
3. 원래 `proxy.ts`가 미인증 사용자를 `/` (홈)으로 리디렉트
4. `AuthGuard`가 client-side에서 `/login`으로 리디렉트 시도
5. `AuthProvider`에 `loading` state 누락으로 premature render

**해결 과정:**
**Step 1: middleware.ts 삭제**
- Next.js는 `middleware.ts`와 `proxy.ts`를 동시에 허용하지 않음
- `proxy.ts` 사용 (이미 존재했던 파일)

**Step 2: proxy.ts 리디렉트 로직 수정**
```typescript
// Before (문제 있는 코드)
if (!session && isProtectedRoute) {
  return NextResponse.redirect(new URL('/', request.url))  // 홈으로 리디렉트
}
if (session && pathname === '/') {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

// After (수정된 코드)
const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback')

// 미인증 + 보호된 라우트 → /login으로
if (!user && isProtectedRoute && !isAuthCallback) {
  return NextResponse.redirect(new URL('/login', request.url))
}

// 인증됨 + (로그인 페이지 or 홈) → /dashboard로
if (user && (isAuthRoute || request.nextUrl.pathname === '/')) {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

**Step 3: AuthProvider에 loading state 추가**
```typescript
// Before
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

// After
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;  // ← 추가
  signOut: () => Promise<void>;
}
```
**최종 인증 플로우:**
1. **Edge (proxy.ts)**: 모든 요청 가로채기 → 세션 없으면 `/login`으로, 있으면 통과
2. **Client (AuthProvider)**: 실시간 세션 변경 감지, loading state 관리
3. **Client (AuthGuard)**: Loading UI 표시, 미인증 시 null 반환 (proxy가 이미 리디렉트함)

**테스트 결과:**
- 비로그인 상태에서 `/dashboard` 접근 → `/login`으로 즉시 리디렉트
- 로그인 후 `/dashboard` 접근 → 정상 표시
- 로그인 상태에서 `/login` 접근 → `/dashboard`로 리디렉트
- 로그인 상태에서 `/` 접근 → `/dashboard`로 리디렉트
- 무한 리디렉트 루프 해결

## 11. Passage CRUD 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- Question 생성 워크플로우의 기반이 되는 Passage(지문) CRUD 기능을 구현.
- 교사가 영어 지문을 생성, 조회, 수정, 삭제할 수 있는 완전한 데이터 관리 시스템을 구축하여 Phase 3 (Question Generation)의 기초를 마련.

### 프롬프트 (Prompt):
```
# Task: Implement Passage CRUD (Phase 2 - Core Features) 
[project_structure.md] [edited_project_blueprint.md] 

## Goal
Implement complete CRUD functionality for reading passages, following the architecture 
defined in @docs/edited_project_blueprint.md and @docs/project_structure.md. 
This is the foundation for the question generation workflow.

## Requirements
1. Type Definitions (types/passage.ts)
2. Validation Schemas (schemas/passage.ts)
3. Database Queries (lib/db/queries/passages.ts)
4. API Routes (passages/route.ts and [id]/route.ts)
5. Custom Hooks (use-passages, use-passage, use-create-passage)
6. UI Components (passage-card, passage-list, passage-form)
7. Pages (dashboard, passage/new)

[... detailed requirements ...]
```

### 검증 (Verification):
**기능 검증:**
- Passage 생성: 100자 이상 필수, 제목 자동 생성 (첫 50자)
- Passage 목록: 그리드 레이아웃, 최신순 정렬
- Passage 삭제: 확인 다이얼로그 + 즉시 UI 업데이트
- 상세 보기: 전체 내용 표시 + Phase 3 안내
- RLS 보안: user_id 기반 소유권 검증
- Validation: Zod 스키마로 입력 검증
- Loading states: 스켈레톤 UI
- Error handling: 재시도 옵션 포함

**프로토타입 디자인 준수:**
- Slate 색상 스킴 (slate-50, slate-100, slate-600, slate-800)
- Blue 액센트 (blue-600 CTA 버튼)
- react-icons 사용 (FiFileText, FiEye, FiTrash2, FiCalendar)
- 반응형 그리드 (md:grid-cols-2 lg:grid-cols-3)
- 문자 카운터 (빨강: 부족/초과, 회색: 정상)

**No linter errors** - 모든 TypeScript/ESLint 검증 통과

### 수정 (Refinement):
**Passage Detail Page 추가:**
- UX 개선을 위해 추가
- 생성 후 리디렉트 대상 필요
- Phase 3 워크벤치로 전환될 placeholder 역할

**Character Validation:**
- 최소: 100자 (의미 있는 지문 보장)
- 최대: 10,000자 (DB 제약 + UX)
- 실시간 카운터 표시 (빨강/회색 색상 변화)
- 제출 버튼 비활성화 (조건 미충족 시)

**Delete 확인:**
- `window.confirm` 다이얼로그로 실수 방지
- API 호출 실패 시 `alert`로 에러 표시
- 성공 시 `onDelete` 콜백으로 목록 새로고침

## 12. Question Generation UI 구현 (Mock Data 사용)

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- OpenAI API 통합 전에 완전한 UI/UX를 먼저 구축하여 사용자 경험을 검증.
- Mock 데이터를 사용한 3단계 워크플로우(Input → Generating → Results)를 구현하고 프로토타입 디자인을 정확히 재현.

### 프롬프트 (Prompt):
**1단계: 개발 우선순위 확인**
```
Now according to [edited_project_blueprint.md] and [project_structure.md], 
what should I start developing now? I have completed the landing page and google oauth.
```

**2단계: UI 우선 접근 제안**
```
Before this, shouldn't we implement ui's for all pages now? Create a new prompt markdown for this step.
```

### 검증 (Verification):
**프로토타입 디자인 매칭:**
- Slate 색상 스킴 (slate-50, slate-100, slate-600, slate-800)
- Blue 액센트 (blue-600, blue-50)
- 검증 상태 색상 (green-100/700 PASS, amber-100/700 NEEDS_FIX)
- react-icons 사용 (FiSettings, FiChevronRight, FiCheckCircle, FiAlertCircle)
- Split-pane 레이아웃
- 반응형 (grid, flex)

**빌드 검증:**
- No linter errors (15개 파일 전체)
- TypeScript 컴파일 성공
- 모든 import 경로 검증
- Type safety 완벽

**기능 테스트:**
- Settings validation (no types selected → button disabled)
- Phase transitions (input → generating → results)
- Mock data slicing (settings.questionCount 반영)
- Back button (results → input, questions cleared)
- Save button (placeholder alert)
- Validation summary (동적 계산)
 
## 13. Generation API (OpenAI Integration) 완료

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- OpenAI gpt-5-mini 모델을 사용하여 영어 지문에서 검증된 MCQ 문제를 생성하는 서버 사이드 API를 구현.
- JSON 모드 강제, Zod 검증, 에러 처리를 포함한 프로덕션 레벨의 통합을 완성.

### 프롬프트 (Prompt):
**1단계: OpenAI 문서 확인**
```
[OpenAI - text generation] Read this document. https://platform.openai.com/docs/guides/text
```

**2단계: Phase 2 Step 2 구현 시작**
```
Now let's implement the [project_structure.md] phase 2, step2. We will use gpt-4o-mini model. Create a new prompt markdown for this step.
```

### 검증 (Verification):
**빌드 검증:**
- `npm run build` 성공
- TypeScript 컴파일 에러 없음
- No linter errors
- 모든 타입 정렬 완료

**테스트 코드 작성:**
- `scripts/test-openai.ts` 파일 생성 및 `npm run test:openai` 스크립트 추가
- OPENAI_API_KEY 환경 변수 확인 및 실제 API 호출 테스트 (gpt-4o-mini 모델 사용)
- 응답 JSON 파싱, questions 배열 검증, validation_status 확인 등 전체 플로우 검증

## 14. Question Display Components 및 타입 정렬

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- API 응답과 프론트엔드 컴포넌트 간의 타입 불일치를 해결하고, 5개 질문 표시 컴포넌트의 완전성을 검증.
- 프로덕션 레벨의 타입 안전성 확보.

### 프롬프트 (Prompt):
```
Now let's move on to phase 2, step 3. Create a new prompt markdown for this step.
```

### 검증 (Verification):
**타입 불일치 발견:**
- **API Schema** (snake_case): `question_text`, `correct_answer`, `validation_status`, `validation_note`
- **Frontend Types** (camelCase): `question`, `answer`, `status`, `issue`
- 이 불일치는 런타임 에러를 발생시킬 수 있었음

**빌드 검증:**
- TypeScript 컴파일 성공
- No linter errors
- API ↔ Frontend 타입 완벽 정렬

## 15. Validation Screen 구현 (프로토타입 매칭)

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 교사가 생성된 질문을 검토하고 검증할 수 있는 UI를 구현.
- 프로토타입 디자인과 정확히 일치하도록 구현하여 일관된 사용자 경험 제공.

### 프롬프트 (Prompt):
**1단계: Phase 2 Step 4 시작**
```
Now let's move on to phase 2, step 4. Create a new prompt markdown for this step.
```

**2단계: 프로토타입 디자인 확인 (중요한 피드백)**
```
Check if [prototype_code.tsx] matches the prototype design.
```

### 검증 (Verification):
**첫 번째 구현 (기능 중심):**
- 필터 버튼 (All/PASS/NEEDS_FIX)
- 대량 작업 (Approve All, Regenerate Issues)
- 통계 카드 (Total, Passed, Needs Fix)
- **프로토타입과 디자인이 달랐음**

**프로토타입과 비교 후 수정:**
- **왼쪽 굵은 테두리** (border-l-8) - 녹색(PASS), 주황색(NEEDS_FIX)
- **오른쪽 액션 패널** (w-64) - Regenerate, Manual Edit 버튼
- **인라인 요약 배지** - 카드 형태가 아닌 간단한 배지
- **간결한 질문 표시** - 옵션을 컴팩트하게 표시

### 수정 (Refinement):
**디자인 변경 (첫 버전 → 프로토타입 매칭):**

| 요소 | 첫 버전 | 프로토타입 매칭 버전 |
|------|---------|---------------------|
| 요약 | 큰 통계 카드 | 인라인 배지 |
| 필터 | All/PASS/NEEDS_FIX 버튼 | 없음 (단순화) |
| 대량 작업 | Approve All, Regenerate Issues | 없음 (MVP 범위) |
| 질문 카드 | 일반 카드 | border-l-8 색상 구분 |
| 액션 배치 | 카드 하단 | 오른쪽 패널 |

**색상 스킴 (프로토타입 준수):**
- PASS: border-l-green-500, bg-green-100, text-green-700
- NEEDS_FIX: border-l-amber-500, bg-amber-100, text-amber-700
- 액션 버튼: blue-50 (Regenerate), white (Manual Edit)

**사용자 피드백 반영:**
- 사용자가 프로토타입 확인을 요청 → 즉시 디자인 수정
- 기능보다 일관성 우선 (MVP 단계)
- 추가 기능은 Phase 3 이후로 연기

**Edit Dialog 통합:**
- Manual Edit 버튼 → `QuestionEditDialog` 열기
- 질문 편집 후 `onUpdateQuestion` 콜백
- 상태 즉시 업데이트

## 16. 실제 API 연결 (Mock Data 제거)

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- Mock 데이터를 제거하고 실제 OpenAI API를 호출하도록 workbench를 업데이트.
- 질문 세트 생성 및 단일 질문 재생성 기능을 실제 API와 연결하여 프로덕션 준비 완료.

### 프롬프트 (Prompt):
**1단계: Phase 3 준비 확인**
```
Now are we ready for the [project_structure.md] phase 3? 
Please check if everything is done in phase2 before we move on.
```

**2단계: API 연결 상태 확인**
```
Now let's implement the [project_structure.md] phase 3, step 1. Create a new prompt markdown for this step.
1. generate questions set
2. regenerate
```

### 검증 (Verification):
**빌드 검증:**
- `npm run build` 성공
- No linter errors
- TypeScript 컴파일 성공
- Mock data 완전 제거

**API 플로우:**
```
User → Settings → Generate Button
  ↓
POST /api/generate
  ↓
OpenAI gpt-5-mini (실제 호출)
  ↓
JSON Response
  ↓
Validation (Zod)
  ↓
Transform (add IDs)
  ↓
Display in ValidationScreen
```
 
## 17. Question Sets CRUD 구현 및 Phase 2 완료

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- Phase 2의 누락된 핵심 기능인 Question Sets CRUD를 완성하여 전체 워크플로우(입력 → 생성 → 검토 → 저장 → 뱅크 조회)를 완결.
- 생성된 질문 세트를 데이터베이스에 저장하고, Question Bank 페이지에서 조회 및 삭제할 수 있는 기능을 구현하여 MVP의 모든 필수 기능을 완성.

### 프롬프트 (Prompt):
**1단계: Phase 3 준비 상태 확인**
```
Read[project_structure.md] and [edited_project_blueprint.md] and check if we are ready to move on to phase3.
```

**2단계: 누락된 기능 구현 요청**
```
Now let's implement the [project_structure.md] phase 3, step 2. Create a new prompt markdown for this step.
```

### 검증 (Verification):
**Phase 2 완성도 분석:**
- Phase 1: Foundation 완료
- Phase 2: Core Features 대부분 완료
  - Passage CRUD
  - Generation API (OpenAI 통합)
  - Question Display Components
  - Validation Screen
  - ❌ Question Sets CRUD (누락 발견)

**완전한 워크플로우 검증:**
1. Dashboard → Passage 목록 조회
2. Create Passage → 지문 생성
3. Generate Questions → AI 질문 생성
4. Review & Validate → 질문 검토 및 수정
5. **Save Question Set** → 데이터베이스 저장 (신규)
6. **Question Bank** → 저장된 세트 조회 (신규)
7. **Delete Sets** → 불필요한 세트 삭제 (신규)

### 수정 (Refinement):
**question_sets 데이터베이스 설계 및 CRUD 구현:**
- question_sets 테이블의 payload JSONB 컬럼 활용
- passage 정보 join으로 지문 제목 표시
- CASCADE 삭제로 데이터 정합성 보장

## 18. Phase 3 Task 1: Toast Notification System 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 사용자 피드백을 개선하기 위해 전문적인 toast 알림 시스템을 구현.
- 기존의 `alert()` 및 `confirm()` 호출을 세련된 toast 알림으로 대체하여 더 나은 UX 제공.
- 프로토타입 디자인과 일관성을 유지하면서 모든 주요 액션(생성, 수정, 삭제, 생성, 저장)에 대한 성공/실패 피드백 제공.

### 프롬프트 (Prompt):
```
Now let's implement the [project_structure.md] phase 3, step 3. Create a new prompt markdown for this step.
```

### 검증 (Verification):
**구현된 기능:**

**1. Custom Toast Component (`components/ui/toast.tsx`)**
- React Context API 기반 전역 toast 시스템
- 4가지 variants: success (green), error (red), warning (amber), info (blue)
- 자동 dismiss 기능 (기본 5초, 설정 가능)
- 수동 닫기 버튼 (X) 포함
- Bottom-right 위치 (프로토타입 스타일)
- Slide-in animation 적용
- react-icons 사용 (FiCheckCircle, FiAlertCircle, FiInfo, FiX)

**2. 전역 통합 (`app/layout.tsx`)**
- `ToastProvider`를 root layout에 추가
- `AuthProvider` 내부에서 래핑하여 전역 접근 가능
- `useToast` hook export (`hooks/shared/use-toast.ts`)

**빌드 검증:**
- No linter errors
- TypeScript 컴파일 성공
- 모든 alert() 호출 제거 완료
- confirm() 다이얼로그는 삭제 액션에 유지 (베스트 프랙티스)

## 19. Phase 3 Task 2: Enhanced Error Handling 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 애플리케이션의 전체 에러 처리를 개선하여 프로덕션 수준의 견고성 확보.
- 표준화된 에러 응답 형식 도입, 사용자 친화적인 에러 메시지 제공, Error Boundary로 예상치 못한 에러 처리, 재시도 기능 추가.
- OpenAI API 실패, 네트워크 타임아웃, 인증 에러, 검증 실패 등 다양한 에러 시나리오를 체계적으로 관리.

### 프롬프트 (Prompt):
Now let's implement the [project_structure.md] phase 3, task 2. Create a new prompt markdown for this step.

### 검증 (Verification):

**생성된 핵심 파일:**
- `lib/utils/error-handler.ts`: 표준화된 에러 코드, 사용자 친화적 메시지 매핑, API 에러 파싱 유틸리티
- `components/shared/error-boundary.tsx`: React Error Boundary 구현 (Try Again/Go Home 액션, 개발 환경 스택 트레이스)

**적용 범위:**
- 모든 API 라우트 (/api/generate, /api/passages, /api/question-sets)에 표준화된 에러 처리 적용
- Custom hooks (use-create-passage, use-generate-questions, use-save-question-set)에 에러 파싱 및 재시도 기능 추가
- 전체 앱에 Error Boundary 적용 (app/(app)/layout.tsx)

**빌드 검증:**
- No linter errors (모든 파일)
- TypeScript 컴파일 성공
- 프로덕션 빌드 성공
- 모든 API 라우트 및 훅 정상 작동

**에러 처리 계층:**
1. **API 라우트 레벨**: 서버 에러 캐치 및 로깅
2. **훅 레벨**: API 응답 파싱 및 사용자 친화적 메시지 변환
3. **컴포넌트 레벨**: 에러 상태 표시 및 재시도 UI
4. **Error Boundary 레벨**: 예상치 못한 React 에러 캐치

**사용자 친화적 메시지 예시:**
- `OPENAI_ERROR`: "AI service is temporarily unavailable. Please try again in a moment."
- `NETWORK_ERROR`: "Network connection lost. Please check your internet connection."
- `VALIDATION_ERROR`: "The provided data is invalid. Please check your input."
- `UNAUTHORIZED`: "You do not have permission to access this resource."

**재시도 기능:**
- 모든 주요 훅에 `retry()` 함수 추가
- 마지막 요청 데이터 저장 (`lastData`, `lastInput`)
- 네트워크 오류나 일시적 문제 발생 시 사용자가 쉽게 재시도 가능

**로깅 전략:**
- 서버: 상세한 에러 정보와 스택 트레이스 로깅
- 클라이언트: 에러 메시지와 컨텍스트만 로깅
- 로그 메시지에 컴포넌트/함수 이름 접두사 추가 (디버깅 용이)

**Error Boundary 특징:**
- 프로덕션: 사용자 친화적 UI만 표시
- 개발: 스택 트레이스 details 섹션 추가
- "Try Again" 버튼으로 에러 상태 리셋
- "Go Home" 버튼으로 대시보드 이동

## 20. My Question Bank 필터링 기능 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor)

### 의도 (Intent):
- My Question Bank 페이지에 검색 및 필터링 기능을 추가하여 사용자가 저장된 문제 세트를 효율적으로 찾고 관리할 수 있도록 개선.
- 초기 구현에서는 비활성화된 상태였던 검색 및 필터 기능을 완전히 구현.

### 프롬프트 (Prompt):

```
Check if the filter is properly implemented in My Question Bank page. 
If not, implement the filter feature with checkboxes for multiple selection 
(grade level and difficulty filters).
```

### 검증 (Verification):

**초기 상태 확인:**
- `bank/page.tsx`: 검색 및 필터 UI는 있으나 모두 `disabled` 상태
- `bank-filters.tsx`: 거의 빈 파일 (주석만 존재)
- `bank-table.tsx`: 필터링 로직 없음

**필터링 로직:**
- 검색: passage.title에서 대소문자 무시 검색
- 다중 필터: OR 조건으로 작동 (선택한 항목 중 하나라도 매칭)
- 문제 유형: 세트 내 문제 중 선택한 유형이 하나라도 있으면 포함
- 정렬: created_at 또는 title 기준 정렬

### 수정 (Refinement):
**단일 선택에서 다중 선택으로 변경:**
- 초기 구현: `<select>` 드롭다운으로 단일 선택
- 개선: `<input type="checkbox">`로 변경하여 다중 선택 가능
- 타입 변경:
  ```typescript
  // Before
  difficulty: string
  gradeLevel: string
  questionType: string
  
  // After
  difficulties: string[]
  gradeLevels: string[]
  questionTypes: string[]
  ```

**성능 최적화:**
- `useMemo` 훅으로 필터링/정렬 결과 캐싱
- 불필요한 리렌더링 방지

## 21. Phase 3 Task 3: Loading State Refinements 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- 애플리케이션의 모든 로딩 상태를 세련되게 개선하여 사용자에게 일관되고 명확한 피드백 제공.
- Skeleton loaders로 콘텐츠 로딩을 부드럽게 표현하고, 모든 액션 버튼에 로딩 spinner와 설명적 텍스트를 추가.
- 레이아웃 shift 방지 및 double-click 방지로 UX 개선. 프로토타입 디자인과 일관성 유지.

### 프롬프트 (Prompt):
```
Now let's implement the [project_structure.md] phase 3, task 3. Create a new prompt markdown for this step.
```
### 검증 (Verification):

**생성된 핵심 컴포넌트:**
- `components/shared/skeleton-loader.tsx`: 4가지 variant (card, question, table-row, text) 지원, Tailwind animate-pulse 사용
- `components/shared/spinner.tsx`: 재사용 가능한 spinner (sm/md/lg 크기 옵션, react-icons AiOutlineLoading3Quarters)

**적용된 로딩 상태:**
- Dashboard, Question Bank: Skeleton loaders 적용 (passage list, table rows)
- 모든 액션 버튼: Spinner + 로딩 텍스트 ("Creating...", "Generating...", "Saving..." 등) + disabled 상태로 double-click 방지
- Generation Screen: 일관된 Spinner 컴포넌트로 교체

**빌드 검증:**
- No linter errors, TypeScript 컴파일 성공, 프로덕션 빌드 성공


## 22. Phase 3 Task 5 & 6: Regenerate Feature Polish + AlertDialog Implementation

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- Task 5 (Regenerate Feature Enhancement)와 Task 6 (Question Bank Enhancements)를 완료.
- Regenerate 기능은 이미 완벽하게 구현되어 있어 검증만 수행.
- 주요 작업은 브라우저 `confirm()` 다이얼로그를 전문적인 AlertDialog 컴포넌트로 교체하여 UX 일관성 개선 및 로딩 상태 표시.

### 프롬프트 (Prompt):
```
Let's start with Task 5 and Task 6 from phase 3.

Task 5 (Regenerate Feature Enhancement) is already partially implemented with loading states 
completed in Task 3. Polish if there are any improvements needed.

Task 6 (Question Bank Enhancements): Replace browser confirm() dialogs with professional 
AlertDialog components for delete confirmations.
```

### 검증 (Verification):

**Task 5 (Regenerate Feature):**
- 이미 완벽하게 구현됨 (로딩 상태, Toast 알림, 에러 처리 모두 완료)
- 추가 작업 불필요

**Task 6 (AlertDialog 구현):**
- `components/ui/alert-dialog.tsx` 생성: danger/warning/info variants, 로딩 상태 지원, fadeIn/scaleIn 애니메이션
- `passage-card.tsx`, `bank-table.tsx`의 모든 browser confirm() 다이얼로그를 전문적인 AlertDialog 컴포넌트로 교체
- 로딩 중 spinner 표시, 비동기 삭제 작업 시각적 피드백 제공

**빌드 검증:**
- No linter errors, TypeScript 컴파일 성공, 프로덕션 빌드 성공


## 23. Question Bank UX 개선 및 상세 페이지 구현

### 사용 모델 (Model):
- Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent):
- Question Bank의 사용자 경험을 크게 개선하여 저장된 문제들을 더 효율적으로 확인하고 관리할 수 있도록 함.
- 기존에는 테이블 행만 표시되었으나, 이제 개별 문제를 상세히 볼 수 있는 전용 페이지를 추가하고, passage와 question 카드를 collapse/expand 할 수 있는 기능을 구현하여 긴 내용의 탐색성을 향상.

### 프롬프트 (Prompt):
```
I want to view individual saved questions in the question bank page. 
When clicking the passage title, it should navigate to a dedicated page showing the saved questions.
Also, change the "View" button to "Edit" and when clicked, it should navigate back to the review stage page.
I need a new page to view saved questions (not expand/collapse in the table).
```

### 검증 (Verification):

**생성된 핵심 파일:**
- `app/(app)/bank/[id]/page.tsx`: 저장된 question set 상세 보기 페이지 (Passage + 모든 질문 표시, Edit/Delete 액션)

**구현 과정 및 개선:**
1. **초기 구현 후 Passage 누락 발견** → `lib/db/queries/question-sets.ts`에서 passage content 필드 추가
2. **타입 불일치 문제** → `QuestionSetWithPassage` 타입에 `content: string` 추가
3. **긴 내용 관리 필요** → Passage와 각 Question 카드에 독립적인 collapse/expand 기능 추가
4. **스크롤 안되는 문제** → 최상위 컨테이너에 `overflow-y-auto h-full` 추가
5. **Edit 동작 이상** → `app/(app)/passage/[id]/page.tsx`에서 questionSetId 쿼리 파라미터 읽어서 자동 로드 후 review 단계로 이동

**네비게이션 플로우:**
- Title 클릭 → `/bank/[id]` (read-only 상세 보기)
- Edit 클릭 → `/passage/[passageId]?questionSetId=[id]` (review 단계에서 수정 가능)

**빌드 검증:**
- No linter errors, TypeScript 컴파일 성공

