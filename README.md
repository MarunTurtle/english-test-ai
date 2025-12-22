# EnglishTestAI

> 중학교 영어 교사를 위한 AI 기반 영어 시험 문제 생성기

한국 중학교 영어 교사를 위한 특화된 AI 워크벤치로, 지문 기반 고품질 객관식 문제를 생성하고 근거 기반 검증 및 전문적인 검토 워크플로우를 제공합니다.

[![CI](https://github.com/marun/english-question-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/marun/english-question-generator/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**🌐 라이브 데모**: [https://english-test-ai.vercel.app](https://english-test-ai.vercel.app)

---

## 📖 1. 프로젝트 소개

EnglishTestAI는 **교사 주도 - Teacher Control**를 우선시하는 교실용 AI 문항 생성기입니다. AI가 생성한 문항을 교사가 검토하며 편집하고 최종 확정하여 문제 은행을 생성합니다.

기존 AI 생성기는 교사의 검증 및 편집 기능이 부재합니다. EnglishTestAI는 원문 지문에서 **근거 인용구**를 포함한 문제를 생성하여, 교사가 품질을 검증하고 정보에 기반한 결정을 내릴 수 있도록 돕습니다.

### 대상 사용자

- 한국 중학교 영어 교사
- ESL/EFL 교육자
- 교육 콘텐츠 제작자

### 핵심 차별화 요소

1. **근거 기반 검증**: 모든 생성된 문제에 지문의 직접 인용구가 근거로 포함됨
2. **교사 주도**: 교사가 각 문제를 검토하고 특정 피드백과 함께 승인/거부
3. **워크플로우**: 교실 사용을 위해 설계된 입력 → 생성 → 검토 → 저장 워크플로우

---

## 2. 구현 기능 (필수 요건 체크리스트)

### 핵심 기능

- **사용자 인증**
  - Google OAuth 로그인/로그아웃
  - 세션 관리 및 보안
  - 사용자별 데이터 격리

- **지문 관리 (CRUD)**
  - 영어 지문 생성 및 저장
  - 지문 목록 조회 (대시보드)
  - 지문 상세 보기 및 수정
  - 지문 삭제 (확인 대화 상자)
  - AI 기반 제목 자동 생성

- **AI 문제 생성**
  - OpenAI GPT-4o-mini 통합
  - 다양한 설정 옵션:
    - 학년 선택 (중1, 중2, 중3)
    - 난이도 선택 (쉬움, 보통, 어려움)
    - 문제 수 선택 (5~10개)
    - 문제 유형 선택 (주제, 세부사항, 추론, 어휘)
  - 구조화된 JSON 출력 (Zod 검증)
  - 근거 인용구 자동 추출

- **문제 검토 및 편집**
  - 생성된 문제 미리보기
  - 근거 인용구 표시
  - 검증 상태 (PASS/NEEDS_FIX) 및 피드백
  - 개별 문제 수동 편집
  - 개별 문제 재생성 (AI 기반)

- **문제 세트 관리**
  - 문제 세트 저장 (JSONB 형식)
  - 문제 세트 목록 조회
  - 문제 세트 상세 보기
  - 문제 세트 삭제
  - 지문별 문제 세트 필터링

- **문제 은행**
  - 저장된 모든 문제 세트 조회
  - 다중 필터 기능:
    - 학년별 필터
    - 난이도별 필터
    - 문제 유형별 필터
  - 문제 세트 메타데이터 표시
  - 빠른 조회 및 삭제

- **UI/UX**
  - 반응형 디자인 (모바일, 태블릿, 데스크톱)
  - 사이드바 네비게이션
  - 토스트 알림 시스템
  - 로딩 상태 (스켈레톤, 스피너)
  - 오류 경계 (Error Boundary)
  - 빈 상태 (Empty State) 컴포넌트
  - 확인 대화 상자 (중요 작업)

- **데이터베이스**
  - Supabase PostgreSQL
  - Row Level Security (RLS)
  - 사용자별 데이터 보안
  - 효율적인 쿼리 및 인덱싱

- **배포 및 운영**
  - Vercel 배포 완료
  - 환경 변수 관리
  - 프로덕션 최적화
  - 브랜치별 CI/CD 자동화

---

## 🛠️ 3. 기술 스택

### 프레임워크 및 언어
- **Next.js 16.1** - App Router, Server Components, API Routes
- **TypeScript 5.0** - 타입 안정성 및 개발자 경험 향상
- **React 19** - 최신 React 기능 활용

### UI 및 스타일링
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **react-icons** - 아이콘 라이브러리
- **커스텀 컴포넌트** - shadcn/ui 스타일 컴포넌트 시스템

### 백엔드 및 데이터베이스
- **Supabase** - PostgreSQL 데이터베이스 + 인증
- **Row Level Security (RLS)** - 데이터 보안 및 격리
- **Supabase Auth** - Google OAuth 통합

### AI 통합
- **OpenAI API** - GPT-4o-mini 모델
- **구조화된 출력** - JSON 기반 응답 파싱
- **Zod** - 런타임 스키마 검증 및 타입 안전성

### 배포 및 호스팅
- **Vercel** - 서버리스 배포 플랫폼
- **Edge Functions** - 빠른 API 응답

### 아키텍처 개요

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌──▼──────┐
│Supabase│ │ OpenAI  │
│  (DB)  │ │  (AI)   │
└────────┘ └─────────┘
```

- **클라이언트**: React 컴포넌트, 커스텀 훅, 상태 관리
- **API 레이어**: Next.js API Routes (서버 사이드)
- **데이터베이스**: Supabase PostgreSQL (RLS 적용)
- **AI 서비스**: OpenAI API (문제 및 제목 생성)

---
## 🚀 4. 로컬 실행 방법

### 시스템 요구사항
- **Node.js 18.x 이상**
- **npm** / yarn / pnpm
- **Git**

### 필요한 계정
1. **Supabase 계정** - [supabase.com 가입](https://supabase.com)
2. **OpenAI API 키** - [platform.openai.com에서 발급](https://platform.openai.com/api-keys)
3. **Google OAuth** - [Cloud Console에 redirect url 추가 필요](https://console.cloud.google.com)

### 설치 및 실행
#### 1. 레포지토리 클론

```bash
git clone https://github.com/[your-username]/english-test-ai.git
cd english-test-ai
```

#### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

#### 3. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:
```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI 설정
OPENAI_API_KEY=sk-your-openai-api-key-here

# Site URL (선택 사항)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**환경 변수 발급 방법:**
1. **Supabase 인증 정보**
   - [supabase.com](https://supabase.com)에서 프로젝트 생성
   - Settings → API → Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Settings → API → anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **OpenAI API 키**
   - [platform.openai.com/api-keys](https://platform.openai.com/api-keys)에서 발급
   - `OPENAI_API_KEY`에 복사


#### 4. Supabase 데이터베이스 설정

**데이터베이스 스키마 실행:**
1. Supabase 대시보드의 **SQL Editor**로 이동
2. 이 저장소의 `docs/supabase_schema.sql` 파일 내용 복사
3. SQL 편집기에 붙여넣고 **RUN** 클릭
4. 모든 테이블, RLS 정책, 트리거가 생성됨

**Google OAuth 활성화:**
1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Google** 활성화
3. Redirect URL 추가: `http://localhost:3000/auth/callback`

자세한 데이터베이스 구조는 아래 [5. 데이터베이스 스키마](#-5-데이터베이스-스키마) 섹션 참조

#### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱 확인

### 기타 명령어
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# OpenAI 통합 테스트
npm run test:openai

# 제목 자동 생성 테스트
npm run test:title
```

---
## 💾 5. 데이터베이스 스키마

EnglishTestAI는 Supabase (PostgreSQL)를 사용하며, 다음과 같은 테이블 구조를 가집니다.

### 테이블 구조

#### 1. `profiles` - 사용자 프로필

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 사용자 ID (Supabase Auth와 연동) |
| `email` | TEXT | 사용자 이메일 (Google OAuth) |
| `full_name` | TEXT | 사용자 이름 |
| `created_at` | TIMESTAMPTZ | 생성 시각 |
| `updated_at` | TIMESTAMPTZ | 수정 시각 |

#### 2. `passages` - 영어 지문

```sql
CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('중1', '중2', '중3')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 지문 고유 ID |
| `user_id` | UUID | 작성자 ID |
| `title` | TEXT | 지문 제목 (AI 자동 생성) |
| `content` | TEXT | 영어 지문 본문 |
| `grade_level` | TEXT | 학년 (중1, 중2, 중3) |
| `created_at` | TIMESTAMPTZ | 생성 시각 |
| `updated_at` | TIMESTAMPTZ | 수정 시각 |

#### 3. `question_sets` - 문제 세트

```sql
CREATE TABLE question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  passage_id UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  grade_level TEXT NOT NULL CHECK (grade_level IN ('중1', '중2', '중3')),
  question_count INTEGER NOT NULL,
  question_types TEXT[] NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 문제 세트 고유 ID |
| `user_id` | UUID | 작성자 ID |
| `passage_id` | UUID | 연결된 지문 ID |
| `title` | TEXT | 문제 세트 제목 |
| `difficulty` | TEXT | 난이도 (easy, medium, hard) |
| `grade_level` | TEXT | 학년 (중1, 중2, 중3) |
| `question_count` | INTEGER | 문제 개수 |
| `question_types` | TEXT[] | 문제 유형 배열 |
| `questions` | JSONB | 문제 데이터 (JSON 형식) |
| `created_at` | TIMESTAMPTZ | 생성 시각 |

### ERD (Entity Relationship Diagram)

```
┌─────────────┐
│  profiles   │
│─────────────│
│ id (PK)     │
│ email       │
│ full_name   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│  passages   │
│─────────────│
│ id (PK)     │
│ user_id(FK) │
│ title       │
│ content     │
│ grade_level │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│ question_sets   │
│─────────────────│
│ id (PK)         │
│ user_id (FK)    │
│ passage_id (FK) │
│ questions(JSONB)│
│ difficulty      │
└─────────────────┘
```

### Row Level Security (RLS) 정책

모든 테이블에 RLS가 활성화되어 있으며, 사용자는 **자신의 데이터만** 접근 가능합니다.

**주요 정책:**

```sql
-- 사용자는 자신의 지문만 조회 가능
CREATE POLICY "Users can view own passages"
ON passages FOR SELECT
USING (auth.uid() = user_id);

-- 사용자는 자신의 지문만 생성 가능
CREATE POLICY "Users can create own passages"
ON passages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 동일한 정책이 question_sets에도 적용됨
```

### 인덱스

성능 최적화를 위한 인덱스:

```sql
CREATE INDEX idx_passages_user_id ON passages(user_id);
CREATE INDEX idx_question_sets_user_id ON question_sets(user_id);
CREATE INDEX idx_question_sets_passage_id ON question_sets(passage_id);
```

전체 스키마 SQL 파일: [`docs/supabase_schema.sql`](docs/supabase_schema.sql)

---

---

## 📖 6. 사용 방법

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
- **수동 편집**: "편집"을 클릭하여 필드 수정
- **재생성**: "재생성"을 클릭하여 단일 문제의 새 버전 생성
- **검토 상태**: 문제가 검증을 통과했는지 수정이 필요한지 확인
- **저장**: 모든 문제에 만족하면 "문제 세트 저장" 클릭

### 5. 문제 은행 관리
1. 사이드바에서 **문제 은행**으로 이동
2. 저장된 모든 문제 세트 조회
3. 필터링:
   - 학년 (중1, 중2, 중3)
   - 난이도 (쉬움, 보통, 어려움)
   - 문제 유형
4. 문제 세트 **조회**하여 세부 정보 확인
5. 더 이상 필요 없는 문제 세트 **삭제**

---

## 📁 7. 프로젝트 구조

```
english-test-ai/
├── app/                      # Next.js App Router
│   ├── (app)/               # 보호된 라우트 (인증 필요)
│   │   ├── dashboard/       # 지문 목록 및 개요
│   │   ├── passage/         # 지문 관리
│   │   ├── bank/            # 문제 은행 (저장된 세트)
│   ├── (auth)/              # 인증 라우트 (로그인)
│   ├── api/                 # API 라우트 핸들러
│   ├── auth/callback/       # OAuth 콜백 핸들러
│   └── layout.tsx           # 루트 레이아웃
├── components/              # React 컴포넌트
│   ├── auth/               # 인증 컴포넌트
│   ├── passages/           # 지문 관리 UI
│   ├── questions/          # 문제 표시 및 편집
│   ├── generation/         # 생성 워크플로우 UI
│   ├── bank/              # 문제 은행 UI
│   ├── layout/            # 레이아웃 컴포넌트 (Sidebar 등)
│   ├── shared/            # 공유 컴포넌트 (ErrorBoundary, Spinner 등)
│   └── ui/                # 기본 UI 컴포넌트 (Button, Input, Dialog 등)
├── contexts/               # React Context: 워크플로우 상태 관리
├── lib/                    # 유틸리티 및 핵심 로직
│   ├── supabase/          # Supabase 클라이언트 (client/server)
│   ├── ai/                # OpenAI 통합 및 프롬프트
│   ├── db/                # 데이터베이스 쿼리
│   ├── utils/             # 일반 유틸리티
│   └── constants/         # 상수 및 열거형
├── hooks/                  # 커스텀 React 훅
├── types/                  # TypeScript 타입 정의
├── schemas/                # Zod 검증 스키마
├── scripts/                # 유틸리티 스크립트
│   ├── test-openai.ts     # OpenAI API 테스트
│   ├── test-title-autogen.ts # 타이틀 생성 테스트
│   └── test-question-set-schema.ts # 스키마 검증 테스트
└── docs/                   # 문서
```


## 🔌 8. API 엔드포인트
### 지문 관리
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

## 🚢 9. 배포

EnglishTestAI는 [Vercel](https://vercel.com)에 배포하도록 설계되었습니다.
**현재 프로덕션 URL**: [https://english-test-ai.vercel.app](https://english-test-ai.vercel.app)

### Vercel 배포 가이드

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

**Deploy**를 클릭하면 Vercel이 앱을 빌드하고 배포합니다.

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

## 📚 10. 추가 문서

### 프로젝트 문서

- [`docs/edited_project_blueprint.md`](docs/edited_project_blueprint.md) - 프로젝트 요구사항 및 사양
- [`docs/project_structure.md`](docs/project_structure.md) - 상세한 프로젝트 구조 가이드
- [`docs/supabase_schema.sql`](docs/supabase_schema.sql) - 데이터베이스 스키마 및 RLS 정책
- [`docs/vibe_coding_log.md`](docs/vibe_coding_log.md) - 개발 로그 (Vibe Coding)
- [`FINAL_CHECKLIST.md`](FINAL_CHECKLIST.md) - 최종 체크리스트
- [`SUBMISSION.md`](SUBMISSION.md) - 제출 문서

### 외부 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 💡 11. 향후 개선 계획

### Phase 4 (향후 개발)
- [ ] Questions table 정규화 (현재 JSONB → 개별 테이블)
- [ ] 문제 PDF, Word(.docx), HWP 내보내기
- [ ] Agent Framework 도입
  - Question Generation Agent
  - Validation Agent
  - Evidence Extraction Agent
  - 단, 현재 구현으로도 충분히 고품질
  - 단일 응답 구조 대비 가성비 효과가 낮음
  - 응답 속도 개선 전략이 필요
- [ ] Unit Test 추가 (Vitest)
- [ ] E2E Test (Playwright)
- [ ] 통계 대시보드 (문제 생성 이력)
- [ ] 협업 기능 (문제 공유)