# EnglishTestAI

> 중학교 영어 교사를 위한 AI 기반 영어 시험 문제 생성기

한국 중학교 영어 교사를 위한 특화된 AI 워크벤치로, 지문 기반 고품질 객관식 문제를 생성하고 근거 기반 검증 및 전문적인 검토 워크플로우를 제공합니다.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 개요

EnglishTestAI는 "AI 마법"보다 **교사 주도(Teacher Control)**를 우선시하는 교실용 AI 문항 생성기입니다. 시스템은 교사가 신뢰하고 검토하며 편집하고 최종 확정할 수 있는 결과물을 생성합니다.

### 핵심 미션

**"AI 마법" → "교사 주도"로의 전환**

기존 AI 생성기는 투명성이나 근거 없이 문제를 생성합니다. EnglishTestAI는 원문 지문에서 **근거 인용구**를 포함한 문제를 생성하여, 교사가 품질을 검증하고 정보에 기반한 결정을 내릴 수 있도록 합니다.

### 대상 사용자

- 한국 중학교 영어 교사
- ESL/EFL 교육자
- 교육 콘텐츠 제작자

---

## 주요 기능

### 구현된 기능

- Google OAuth 인증
- 지문 관리 (생성, 조회, 수정, 삭제)
- AI 기반 문제 생성 (OpenAI GPT-4o-mini 사용)
- 근거 기반 문제 생성 (모든 문제에 지문 인용구 포함)
- 문제 검토 및 검증 (PASS/NEEDS_FIX 상태 및 상세 피드백)
- 수동 문제 편집 (직관적인 대화 상자에서 편집 가능)
- 개별 문제 재생성 (다른 문제에 영향 없이 단일 문제 재생성)
- 문제 세트 관리 (완전한 문제 세트 저장, 로드, 삭제)
- 문제 은행 (필터 기능이 있는 저장된 문제 세트 조회 및 관리)
- 반응형 UI (Tailwind CSS로 구축된 현대적이고 접근 가능한 인터페이스)
- 토스트 알림 (모든 작업에 대한 사용자 친화적 피드백)
- 오류 처리 및 재시도 (재시도 메커니즘을 갖춘 강력한 오류 처리)
- 로딩 상태 (스켈레톤 로더 및 스피너로 향상된 UX)
- 확인 대화 상자 (삭제 등 중요한 작업에 대한 AlertDialog)

### 핵심 차별화 요소

1. **근거 기반 검증**: 모든 생성된 문제에 지문의 직접 인용구가 근거로 포함됨
2. **교사 주도**: 교사가 각 문제를 검토하고 특정 피드백과 함께 승인/거부
3. **전문 워크플로우**: 교실 사용을 위해 설계된 입력 → 생성 → 검토 → 저장 워크플로우

---

## 기술 스택

### 프레임워크 및 언어

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- React 18+

### UI 및 스타일링

- Tailwind CSS
- react-icons
- 커스텀 컴포넌트 (shadcn 스타일)

### 백엔드 및 데이터베이스

- Supabase (PostgreSQL + 인증)
- Row Level Security (RLS)
- Supabase Auth (Google OAuth)

### AI 통합

- OpenAI API (GPT-4o-mini)
- 구조화된 JSON 출력
- Zod (런타임 스키마 검증)

### 배포

- Vercel

---

## 사전 요구사항

### 시스템 요구사항

- Node.js 18.x 이상
- npm 또는 yarn 또는 pnpm
- Git

### 필요한 계정

1. **Supabase 계정** - [supabase.com에서 가입](https://supabase.com)
2. **OpenAI API 키** - [platform.openai.com에서 발급](https://platform.openai.com/api-keys)
3. **Google OAuth 인증** - Supabase Auth 설정에서 구성

---

## 시작하기

### 1. 저장소 복제

```bash
git clone https://github.com/[your-username]/english-test-ai.git
cd english-test-ai
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경 변수 설정

`.env.example`을 `.env.local`로 복사:

```bash
cp .env.example .env.local
```

그런 다음 `.env.local`의 값을 채웁니다. 자세한 내용은 아래 [환경 변수](#환경-변수) 섹션을 참조하세요.

### 4. Supabase 설정

#### Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)으로 이동하여 새 프로젝트 생성
2. 프로젝트 설정이 완료될 때까지 대기

#### 데이터베이스 스키마 실행

1. Supabase 대시보드의 SQL Editor로 이동
2. 이 저장소의 `docs/supabase_schema.sql` 파일 열기
3. SQL을 편집기에 복사하여 붙여넣기
4. SQL을 실행하여 모든 테이블 및 정책 생성

#### Google OAuth 활성화

1. Supabase 대시보드에서 **Authentication** → **Providers**로 이동
2. **Google** 제공자 활성화
3. 승인된 리디렉션 URL 추가:
   - 로컬: `http://localhost:3000/auth/callback`
   - 프로덕션: `https://your-app.vercel.app/auth/callback`

#### 인증 정보 복사

1. Supabase 대시보드에서 **Settings** → **API**로 이동
2. 다음 값을 `.env.local`에 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. OpenAI API 키 발급

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)로 이동
2. 새 API 키 생성
3. `.env.local`의 `OPENAI_API_KEY`에 복사

### 6. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

---

## 환경 변수

루트 디렉터리에 `.env.local` 파일을 생성하고 다음 변수를 설정합니다:

### Supabase 설정

```bash
# Supabase 프로젝트 URL
# 찾는 위치: Supabase 대시보드 → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon/Public 키 (클라이언트에 노출해도 안전)
# 찾는 위치: Supabase 대시보드 → Settings → API → Project API keys → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### OpenAI 설정

```bash
# OpenAI API 키 (서버 측 전용, 절대 클라이언트에 노출하지 마세요)
# 발급: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 선택 사항: Site URL

```bash
# Next.js Site URL
# 로컬 개발:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 프로덕션 (Vercel 배포 후 업데이트):
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 선택 사항: Supabase Service Role 키

```bash
# 서버 측 관리자 작업에만 필요
# 절대 클라이언트에 이 키를 노출하지 마세요!
# 찾는 위치: Supabase 대시보드 → Settings → API → Project API keys → service_role
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**중요 참고 사항:**

- `.env.local`을 버전 관리에 커밋하지 마세요
- `NEXT_PUBLIC_*` 변수는 브라우저에 노출됩니다 (anon 키만 안전)
- `OPENAI_API_KEY`는 서버 측 전용이며 클라이언트로 전송되지 않습니다
- 모든 변수가 포함된 템플릿은 `.env.example`을 참조하세요

---

## 프로젝트 구조

```
english-test-ai/
├── app/                      # Next.js App Router
│   ├── (app)/               # 보호된 라우트 (인증 필요)
│   │   ├── dashboard/       # 지문 목록 및 개요
│   │   ├── passage/[id]/    # 문제 생성 워크벤치
│   │   ├── bank/            # 문제 은행 (저장된 세트)
│   │   └── layout.tsx       # 사이드바가 있는 앱 레이아웃
│   ├── (auth)/              # 인증 라우트 (로그인)
│   ├── api/                 # API 라우트 핸들러
│   │   ├── passages/        # 지문 CRUD
│   │   ├── generate/        # 문제 생성
│   │   └── question-sets/   # 문제 세트 CRUD
│   ├── auth/callback/       # OAuth 콜백 핸들러
│   └── layout.tsx           # 루트 레이아웃
├── components/              # React 컴포넌트
│   ├── auth/               # 인증 컴포넌트
│   ├── passages/           # 지문 관리 UI
│   ├── questions/          # 문제 표시 및 편집
│   ├── generation/         # 생성 워크플로우 UI
│   ├── bank/              # 문제 은행 UI
│   ├── shared/            # 공유 컴포넌트 (ErrorBoundary, Spinner 등)
│   └── ui/                # 기본 UI 컴포넌트 (Button, Input, Dialog 등)
├── lib/                    # 유틸리티 및 핵심 로직
│   ├── supabase/          # Supabase 클라이언트 (client/server)
│   ├── ai/                # OpenAI 통합 및 프롬프트
│   ├── db/                # 데이터베이스 쿼리
│   ├── utils/             # 일반 유틸리티
│   └── constants/         # 상수 및 열거형
├── hooks/                  # 커스텀 React 훅
│   ├── auth/              # 인증 훅
│   ├── passages/          # 지문 데이터 훅
│   ├── questions/         # 문제 생성 훅
│   └── shared/            # 공유 훅 (toast, debounce)
├── types/                  # TypeScript 타입 정의
├── schemas/                # Zod 검증 스키마
├── docs/                   # 문서
│   ├── edited_project_blueprint.md
│   ├── supabase_schema.sql
│   └── vibe_coding_log.md
└── middleware.ts           # Next.js 미들웨어 (인증 보호)
```

---

## 사용 방법

### 1. 로그인

1. 랜딩 페이지로 이동
2. "Google로 로그인" 클릭
3. Google 계정으로 인증
4. 대시보드로 리디렉션됨

### 2. 지문 생성

1. **대시보드**로 이동
2. **"새 지문 만들기"** 클릭
3. 영어 독해 지문 붙여넣기 (최소 100자)
4. **학년 선택**: 중1, 중2, 또는 중3
5. **"지문 생성"** 클릭
6. 제목은 지문 내용에서 자동 생성됨

### 3. 문제 생성

1. 대시보드에서 지문을 클릭하여 열기
2. 생성 설정 구성:
   - **난이도**: 쉬움, 보통, 어려움
   - **문제 수**: 5~10문제
   - **문제 유형**: 주제, 세부사항, 추론, 어휘 (다중 선택 가능)
3. **"문제 세트 생성"** 클릭
4. AI가 문제를 생성할 때까지 대기 (보통 10~30초)

### 4. 문제 검토 및 편집

각 생성된 문제에는 다음이 포함됩니다:
- 문제 텍스트
- 4개의 객관식 선택지
- 정답
- 지문의 근거 인용구
- 검증 상태 (PASS / NEEDS_FIX)

**수행 가능한 작업:**

- 수동 편집: "편집"을 클릭하여 필드 수정
- 재생성: "재생성"을 클릭하여 단일 문제의 새 버전 생성
- 검토 상태: 문제가 검증을 통과했는지 수정이 필요한지 확인
- 저장: 모든 문제에 만족하면 "문제 세트 저장" 클릭

### 5. 문제 은행 관리

1. 사이드바에서 **"문제 은행"**으로 이동
2. 저장된 모든 문제 세트 조회
3. 필터링:
   - 학년 (중1, 중2, 중3)
   - 난이도 (쉬움, 보통, 어려움)
   - 문제 유형
4. 문제 세트 **조회**하여 세부 정보 확인
5. 더 이상 필요 없는 문제 세트 **삭제**

---

## 데이터베이스 스키마

EnglishTestAI는 다음 테이블이 있는 Supabase(PostgreSQL)를 사용합니다:

### 테이블

- **`profiles`**: 사용자 정보 (Supabase Auth와 연결)
- **`passages`**: 교사가 생성한 독해 지문
- **`question_sets`**: 생성된 문제 세트 (JSONB 페이로드로 저장)

### 보안

- 모든 테이블에 **Row Level Security (RLS)** 활성화
- 사용자는 자신의 데이터에만 접근 가능
- 정책이 모든 작업에 대해 user_id 검사 시행

전체 스키마 및 RLS 정책은 `docs/supabase_schema.sql`을 참조하세요.

---

## API 엔드포인트

### 지문

- `POST /api/passages` - 새 지문 생성
- `GET /api/passages` - 현재 사용자의 모든 지문 목록
- `GET /api/passages/[id]` - 특정 지문 조회
- `PATCH /api/passages/[id]` - 지문 업데이트
- `DELETE /api/passages/[id]` - 지문 삭제

### 문제 생성

- `POST /api/generate` - OpenAI로 문제 생성
  - Body: `{ passageId, difficulty, questionCount, questionTypes }`
  - Returns: `{ questions: Question[] }`

### 문제 세트

- `POST /api/question-sets` - 문제 세트 저장
- `GET /api/question-sets` - 문제 세트 목록 (선택적 `?passageId=...` 필터)
- `GET /api/question-sets/[id]` - 특정 문제 세트 조회
- `DELETE /api/question-sets/[id]` - 문제 세트 삭제

---

## 개발

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 개발 서버 시작

### 프로덕션 빌드

```bash
npm run build
```

최적화된 프로덕션 빌드 생성

### 프로덕션 빌드 로컬 실행

```bash
npm run build
npm start
```

### 린팅

```bash
npm run lint
```

### 테스트 스크립트

```bash
# OpenAI 통합 테스트
npm run test:openai

# 제목 자동 생성 테스트
npm run test:title
```

---

## 배포

### Vercel에 배포

EnglishTestAI는 Next.js를 만든 팀이 구축한 플랫폼인 [Vercel](https://vercel.com)에 배포하도록 설계되었습니다.

#### 1단계: GitHub에 푸시

```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

#### 2단계: Vercel에 가져오기

1. [vercel.com](https://vercel.com)으로 이동
2. **"Add New Project"** 클릭
3. GitHub 저장소 가져오기
4. Vercel이 Next.js 설정 자동 감지

#### 3단계: 환경 변수 구성

Vercel 대시보드에서 **Project Settings** → **Environment Variables**로 이동하여 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

#### 4단계: 배포

**"Deploy"**를 클릭하면 Vercel이 앱을 빌드하고 배포합니다.

#### 5단계: Supabase 리디렉션 URL 업데이트

1. Supabase 대시보드로 이동
2. **Authentication** → **URL Configuration**으로 이동
3. **Redirect URLs**에 Vercel URL 추가:
   ```
   https://your-app.vercel.app/auth/callback
   ```

#### 6단계: 배포 테스트

Vercel URL을 방문하여 테스트:
- Google OAuth 로그인
- 지문 생성
- 문제 생성
- 문제 세트 저장

### 지속적 배포

Vercel이 자동으로 배포:
- **프로덕션**: `main` 브랜치에 푸시할 때마다
- **미리보기**: 모든 풀 리퀘스트

---

## 문서

### 프로젝트 문서

- **`docs/edited_project_blueprint.md`** - 완전한 프로젝트 요구사항 및 사양
- **`docs/project_structure.md`** - 상세한 프로젝트 구조 가이드
- **`docs/supabase_schema.sql`** - 데이터베이스 스키마 및 RLS 정책
- **`docs/vibe_coding_log.md`** - 개발 로그 (RFQ 요구사항)

### 외부 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 기여

이 프로젝트는 교육 목적의 미니 프로젝트 과제의 일환으로 제작되었습니다.

기여, 이슈 및 기능 요청을 환영합니다!

### 개발 워크플로우

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. [Conventional Commits](https://www.conventionalcommits.org/)를 따라 변경 사항 커밋
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

---

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 감사의 글

- [Next.js](https://nextjs.org/) 및 [Supabase](https://supabase.com/)로 구축
- [OpenAI](https://openai.com/) 기반 AI
- [shadcn/ui](https://ui.shadcn.com/)에서 영감을 받은 UI 컴포넌트
- [react-icons](https://react-icons.github.io/react-icons/)의 아이콘

---

## 연락처 및 지원

질문, 제안 또는 이슈가 있는 경우:

- GitHub에서 이슈 열기
- 개발팀에 문의

---

**영어 교사를 위해 제작**
