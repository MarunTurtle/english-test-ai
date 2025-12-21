# Vibe Coding Log (바이브 코딩 로그)

이 문서는 요구사항에 따라 개발 과정에서 사용된 주요 프롬프트, 사용된 AI 모델, 의도, 검증 결과 및 수정 사항의 기록입니다.

## 0. Cursor 세팅

### 사용 모델 (Model): Cursor Composer1

### 의도 (Intent): Cursor AI 에이전트가 일관된 Git 워크플로우와 커밋 메시지 형식을 따르도록 하기 위해 프로젝트 규칙을 설정. MVP 개발을 위한 간단한 브랜치 전략과 RFQ 요구사항인 바이브 코딩 로그 작성 규칙을 포함.

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

### 사용 모델 (Model): Gemini 3.0 Pro

### 의도 (Intent): 영어 교사를 위한 AI 문제 생성 도구의 핵심 UX 흐름(입력 -> 생성 -> 검토 -> 저장)을 정의하고, 복잡하지 않은 직관적인 UI 구조를 설계하기 위함.

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

### 검증 (Verification): 생성된 텍스트 와이어프레임이 4단계(Input, Generated Set, Validation, Question Bank)를 모두 포함하고 있는지 확인. 교사 중심의 '통제권'이 강조된 UI인지 확인. 또한 pdf파일을 첨부해 과제의 요구사항을 모두 반영했는지 확인.

```
Now after reading this document, check if we meet the basic necessary criteria of the tasks.
```

### 수정 (Refinement): 초안이 요구사항을 잘 반영하여 별도의 수정 없이 프로토타입 단계로 진행.

## 2. 인터랙티브 프로토타입 구현

### 사용 모델 (Model): Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent): 와이어프레임을 바탕으로 실제 화면 전환과 데이터 흐름을 시각적으로 확인하기 위해 단일 파일(Single File) 형태의 React 프로토타입을 제작.

### 프롬프트 (Prompt): "Now let's build a prototype according to it. (Generate a high-fidelity, single-file React prototype...)"

### 검증 (Verification): App.jsx 파일이 생성됨. 사이드바 네비게이션, 문제 생성 시뮬레이션, PASS/NEEDS FIX 뱃지 등 핵심 기능이 React 상태(State)로 구현되었는지 확인.

### 수정 (Refinement): 기능 구현은 완료되었으나, 앱의 진입점이 부족하여 구글 로그인이 추가된 랜딩 페이지 추가.


## 3. 개발 청사진(Blueprint) 작성

### 사용 모델 (Model): Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent): Cursor AI를 활용해 실제 Next.js 앱을 구축하기 위한 '지시서' 역할을 할 기술 명세서(DB 스키마, 기술 스택, 기능 명세) 작성.

### 프롬프트 (Prompt): "I am planning to build this using next.js, supabase, using cursor to actually build this application. Create a markdown document that can be the base of the operation in cursor including all the schematics and requirements..."

### 검증 (Verification): project_blueprint.md 파일 생성. Supabase 테이블(profiles, passages, questions) 구조와 Tailwind CSS 스타일 가이드 포함 여부 확인.

### 수정 (Refinement): 초안 작성 후 제안요청서(RFQ)와의 정합성 검토 필요성 인지.

## 4. 요구사항 명세서 반영 및 명세서 고도화

### 사용 모델 (Model): Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent): 업로드한 과제 제안요청서를 분석하여, 누락된 필수 요건(SNS 로그인, 바이브 코딩 로그 등)을 Blueprint에 추가.

### 프롬프트 (Prompt): "Now after reading this document [RFQ], check if we meet the basic necessary criteria of the tasks. ... Good now let's go ahead and edit the project blueprint."

### 검증 (Verification): Blueprint 문서 업데이트 확인.
- Auth: Supabase Auth + Google OAuth (필수 요건 반영)
- Deliverables: prompts.md (바이브 코딩 로그) 작성 지침 추가
- Tech Stack: shadcn/ui 추가 (가산점 항목 반영)

## 5. 랜딩 페이지 및 로그인 기능 추가

### 의도 (Intent): 앱의 첫인상을 결정하는 랜딩 페이지와 RFQ 필수 요건인 '로그인' 경험을 프로토타입에 시각화.

### 프롬프트 (Prompt): "Now let's add a landing page to the AI Question Workbench Prototype with google log in."

### 사용 모델 (Model): Gemini 3.0 Pro + Canvas 기능

### 검증 (Verification): App.jsx 업데이트 확인. isLoggedIn 상태를 추가하여 비로그인 시 랜딩 페이지, 로그인 시 워크벤치로 진입하는 조건부 렌더링 로직 동작 확인.

## 6. 프로젝트 폴더 구조 확정

### 사용 모델 (Model): 
- **1차 생성**: Cursor Composer1
- **2차 검증**: Gemini 3.0 Pro + Canvas 기능

### 의도 (Intent): 확장 가능한 Next.js 14 App Router 기반의 디렉토리 구조를 정의하여 개발 혼선 방지. 프로토타입의 UI 구조와 Blueprint의 기능 요구사항을 모두 반영한 실용적이고 확장 가능한 아키텍처 설계.

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

## 7. 프로젝트 빌드 전 필수 준비사항 정리

### 사용 모델 (Model): Cursor Composer1

### 의도 (Intent): 프로젝트 빌드를 시작하기 전에 필요한 모든 설정(Supabase 프로젝트, Google OAuth, OpenAI API, 환경 변수 등)을 체계적으로 정리하고, 실제 설정 과정에서 기록할 수 있는 템플릿을 제공하기 위함. 또한 Supabase의 새로운 API 키 시스템(Publishable/Secret 키)을 반영하여 최신 문서화를 유지.

### 프롬프트 (Prompt):
**1단계: Prerequisites Checklist 생성**
```
@docs/edited_project_blueprint.md According to the blueprint, what should we prepare before start builiding the project? I am looking for such things as setting up supabase project, or api keys and stuff
```

**2단계: Prerequisites Notes 템플릿 생성**
```
ok now than make a new markdown to take notes on the things that @prerequisites_checklist.md requires.
```

**3단계: 보안을 위한 .gitignore 추가**
```
add it to .gitignore please
```

**4단계: Supabase API 키 시스템 업데이트**
```
instead of anon/public and service_role keys the supabase has new pair as public key and secret key.

https://supabase.com/docs/guides/api/api-keys
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

**보안 설정:**
- `docs/prerequisites_notes.md`가 `.gitignore`에 추가되어 API 키 등 민감 정보가 커밋되지 않도록 설정 확인

**문서 업데이트:**
- `docs/prerequisites_checklist.md`: Supabase의 새로운 API 키 시스템 반영
  - Publishable key (`sb_publishable_...`) - 클라이언트 사이드용
  - Secret key (`sb_secret_...`) - 서버 사이드용
  - 환경 변수 이름은 호환성을 위해 유지하되, 실제 값은 새로운 키 사용 명시

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

## 8. Supabase 데이터베이스 스키마 설정

### 사용 모델 (Model): Cursor Composer1

### 의도 (Intent): Prerequisites Checklist의 1.2 단계인 Supabase 데이터베이스 스키마를 설정하기 위함. Blueprint와 프로토타입 코드를 검증하여 필요한 테이블(`profiles`, `passages`, `question_sets`), RLS 정책, 그리고 자동 프로필 생성 트리거를 생성.

### 프롬프트 (Prompt):
**1단계: 스키마 검증 및 SQL 스크립트 생성**
```
Help me on doing 1.2 step on supabase. @docs/prerequisites_checklist.md 
Also check if the tables are appropriately made according to the @edited_project_blueprint.md 
and @docs/prototype_code.tsx.
```

**2단계: avatar_url 필드 제거 (MVP 범위 최적화)**
```
do we really need the avatar_url?
```

**3단계: Supabase 경고 대응 (DROP POLICY 문장으로 인한 경고)**
```
I got this warning in the image when I clicked run.
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

### 수정 (Refinement):
**MVP 범위 최적화:**
- `avatar_url` 필드를 `profiles` 테이블에서 제거 (프로토타입에서 사용되지 않음)
- Blueprint 문서 업데이트: MVP 범위에서 제외, 필요시 나중에 추가 가능하다는 메모 추가
- 트리거 함수에서 `avatar_url` 관련 코드 제거

**사용자 경험 개선:**
- Supabase SQL Editor에서 `DROP POLICY` 문장으로 인한 경고 대응
- 첫 설정용 스크립트(`supabase_schema_first_time.sql`) 생성하여 경고 없이 실행 가능하도록 개선
- 설정 가이드에 경고 설명 및 두 가지 옵션(첫 설정 vs 재실행) 제공

**스키마 최적화:**
- `CREATE TABLE IF NOT EXISTS` 사용으로 안전한 재실행 보장
- `DROP POLICY IF EXISTS` 사용으로 정책 업데이트 시 충돌 방지
- 트리거 함수에 `ON CONFLICT` 처리 추가로 중복 생성 방지

## 9. 랜딩 페이지 및 Google OAuth 로그인 구현

### 사용 모델 (Model): Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent): 필수 요건인 Google OAuth 로그인 기능을 구현하기 위해 Supabase Auth와 Google OAuth를 활용한 로그인 시스템 구축. 동시에 앱의 진입점이 되는 랜딩 페이지와 로그인 성공 후 대시보드 페이지를 개발하여 사용자 인증 플로우 완성.

### 프롬프트 (Prompt):
**1단계: 대시보드 페이지 생성 및 Google 로그인 구현**
```
Now, let's implement the google login in @english-question-generator/app/page.tsx. 
First let's create a simple app dashboard page @english-question-generator/app/(app)/page.tsx 
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

## 10. 세션 관리 및 인증 보호 구현

### 사용 모델 (Model): Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent): 참고 프로젝트와의 비교 분석을 통해 누락된 세션 관리 기능을 파악하고, Next.js App Router에 최적화된 다층 방어 전략(Middleware + Server Components + Client Listener)으로 보호된 라우트를 구현. MVP 단계에서 필요한 핵심 인증 기능을 완성.

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
**생성된 파일 및 구조:**

**Layer 1: Middleware (Edge 보호)** - `middleware.ts`
- 모든 요청을 가장 먼저 가로채서 세션 확인
- 보호된 라우트 (`/dashboard`, `/bank`, `/passage`)에 대한 즉시 리디렉트
- 로그인된 사용자가 홈페이지 접근 시 자동으로 `/dashboard`로 리디렉트
- 장점: Edge에서 실행되어 가장 빠른 리디렉트, 페이지 렌더링 전 보호

**Layer 2: Server-side Client** - `lib/supabase/server.ts`
- Server Component와 API Route에서 사용할 Supabase 클라이언트
- 최신 API 사용: `getAll()`, `setAll()` (배치 쿠키 작업)
- Helper 함수: `getSession()`, `getUser()`
- Deprecated API 제거 (`get`, `set`, `remove` → `getAll`, `setAll`)

**Layer 3: Auth Provider (Client-side Listener)** - `components/auth/auth-provider.tsx`
- 실시간 auth state 변경 감지 (`onAuthStateChange`)
- 로그아웃 시 자동 홈페이지 리디렉트
- `useAuth()` hook 제공으로 컴포넌트에서 쉽게 인증 상태 접근
- 멀티탭 로그아웃 지원

**Layer 4: Hook** - `hooks/auth/use-auth.ts`
- `useAuth()` export로 일관된 import 경로 제공

**업데이트된 파일:**
- `app/layout.tsx`: `<AuthProvider>` 래핑으로 전역 auth context 제공
- `app/(app)/dashboard/page.tsx`: 
  - 사용자 이메일 표시
  - Sign Out 버튼 추가
  - `useAuth()` hook 사용 예시

**Middleware 설정:**
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```
- 정적 파일 제외
- 이미지 최적화 파일 제외
- 모든 앱 라우트에 대해 실행

**인증 플로우:**
1. 사용자가 `/dashboard` 접근 시도
2. **Middleware**: 세션 없음 → `/`로 즉시 리디렉트
3. 사용자 로그인 → `/dashboard`로 이동
4. **AuthProvider**: 세션 감지 및 상태 업데이트
5. **Dashboard**: 사용자 정보 표시
6. Sign Out 클릭 → **AuthProvider**: 세션 종료 및 `/`로 리디렉트
7. **Middleware**: 보호된 페이지 접근 차단

**테스트 시나리오 검증:**
- Test 1: 비로그인 상태에서 `/dashboard` 접근 → `/`로 즉시 리디렉트
- Test 2: 로그인 → Google OAuth → `/dashboard`로 자동 리디렉트
- Test 3: 로그인 상태에서 `/` 접근 → `/dashboard`로 자동 리디렉트
- Test 4: Sign Out 클릭 → `/`로 리디렉트 후 보호된 페이지 접근 불가
- Test 5: 멀티탭에서 로그아웃 → 모든 탭에서 자동 리디렉트
- Test 6: 터미널 로그 확인 → 307 리디렉트 및 200 성공 응답 확인

### 수정 (Refinement):
**Deprecated Cookie API 업데이트:**
- **구식 API (제거됨)**:
  ```typescript
  cookies: {
    get(name) { return cookieStore.get(name)?.value },
    set(name, value, options) { cookieStore.set({ name, value, ...options }) },
    remove(name, options) { cookieStore.set({ name, value: '', ...options }) }
  }
  ```
  
- **최신 API (적용됨)**:
  ```typescript
  cookies: {
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)
      )
    }
  }
  ```

- **변경 이유**:
  - 배치 작업으로 성능 향상 (한 번에 여러 쿠키 설정)
  - API 단순화 (3개 메서드 → 2개 메서드)
  - Supabase SSR 공식 문서 권장 방식

**리디렉트 전략:**
- 즉시 리디렉트 (로딩 상태 없음)
- 로그인 후 기본 랜딩: `/dashboard`
- UX 개선: 페이지 깜빡임 없이 즉시 전환

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

## 11. Phase 1: Foundation - 앱 레이아웃, 사이드바 및 인증 보호 구현

### 사용 모델 (Model): Claude Sonnet 4.5 (Cursor Agent)

### 의도 (Intent): 프로토타입의 UI를 참고하여 실제 앱의 기본 구조(레이아웃, 사이드바 네비게이션, 인증 가드)를 구현. 모든 보호된 라우트에 대한 일관된 레이아웃과 네비게이션을 제공하며, 프로토타입에서 경험한 것과 동일한 UI/UX를 Next.js App Router에서 구현.

### 프롬프트 (Prompt):
**1단계: 개발 우선순위 확인**
```
Now according to @docs/edited_project_blueprint.md and @docs/project_structure.md, what should I start developing now? I have completed the landing page and google oauth.
```

**2단계: Phase 1 Foundation 시작**
```
Ok then, let's start with Phase1 Foundation (complete first). 
Take into account the @docs/prototype_code.tsx for the ui.
```

**3단계: 무한 리디렉트 루프 문제 발생**
```
After I logged in, I got this infinite redirects...
```
(터미널 로그에서 `/login` ↔ `/dashboard` 간 무한 리디렉트 확인)

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

**5. 업데이트된 페이지**:
- `app/(app)/dashboard/page.tsx`: 
  - Welcome 메시지와 사용자 이메일 표시
  - "Create New Passage" CTA 버튼
  - 빈 상태(empty state) UI
  
- `app/(app)/bank/page.tsx`:
  - Question Bank 페이지 스켈레톤
  - Search bar와 Filter 버튼
  - 빈 테이블 UI

**UI/UX 검증:**
- 프로토타입의 slate-100 배경색 사이드바 재현
- Active state 시 white background + blue text + shadow
- "Teacher Control Panel" 서브타이틀
- 워크플로우 인디케이터 blue-50 배경
- react-icons 사용 (lucide-react 대신)
- No linter errors

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

**Step 4: AuthGuard 단순화**
```typescript
// Before: Client-side redirect 시도 (문제 발생)
useEffect(() => {
  if (!loading && !user) {
    router.push(ROUTES.LOGIN);  // ← 제거
  }
}, [user, loading, router]);

// After: Middleware에 맡김
// Loading만 처리, redirect는 proxy.ts가 담당
if (loading) return <LoadingSpinner />;
if (!user) return null;
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

**핵심 교훈:**
1. **Next.js 제약**: `middleware.ts`와 `proxy.ts` 동시 사용 불가
2. **책임 분리**: Edge에서 redirect, Client에서 UI state만 관리
3. **Loading state**: Auth 체크 중 premature render 방지 필수
4. **Auth callback 예외**: OAuth callback 라우트는 리디렉트 대상에서 제외

**파일 요약:**
- 생성: 7개 컴포넌트 + 1개 constants 파일
- 수정: `proxy.ts`, `AuthProvider`, `AuthGuard`
- 삭제: `middleware.ts` (충돌 해결)
- 업데이트: Dashboard, Bank 페이지


