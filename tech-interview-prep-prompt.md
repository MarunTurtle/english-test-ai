# 기술 면접 준비 문서 생성 프롬프트

> **목적**: 이 프롬프트를 AI에게 제공하여 EnglishTestAI 프로젝트에 대한 완벽한 기술 면접 준비 문서를 생성합니다.

---

## AI에게 제공할 프롬프트

```
당신은 시니어 기술 면접관이자 풀스택 개발자입니다. 
아래 프로젝트 정보를 바탕으로 **실전 기술 면접에 완벽히 대비할 수 있는 예상 질문과 모범 답변 문서**를 작성해주세요.

## 프로젝트 개요

**프로젝트명**: EnglishTestAI - AI 기반 영어 시험 문제 생성기
**목적**: 한국 중학교 영어 교사를 위한 지문 기반 객관식 문제 생성 및 검토 플랫폼
**배포**: https://english-test-ai.vercel.app
**저장소**: GitHub (프라이빗)

## 기술 스택

### 프론트엔드
- **Next.js 16.1** (App Router, React Server Components)
- **React 19.2.3** (최신 버전)
- **TypeScript 5.0** (Strict mode)
- **Tailwind CSS 4** (유틸리티 우선 스타일링)
- **Zod 4.2.1** (런타임 스키마 검증)
- **lucide-react** (아이콘), **clsx + tailwind-merge** (클래스 유틸리티)

### 백엔드
- **Next.js API Routes** (서버리스 함수)
- **Supabase** (PostgreSQL + Auth)
  - `@supabase/supabase-js` 2.89.0
  - `@supabase/ssr` 0.8.0 (Server-Side Rendering 지원)
- **Row Level Security (RLS)** (데이터 보안)

### AI/LLM
- **OpenAI API** (6.15.0)
- **모델**: gpt-4o-mini
- **Structured Output**: JSON mode with Zod validation
- **프롬프트 엔지니어링**: System + User prompt 패턴

### 배포 및 인프라
- **Vercel** (서버리스 배포, 자동 CI/CD)
- **환경 변수 관리** (`.env.local`, Vercel Environment Variables)
- **Edge Functions** (빠른 응답 속도)

## 프로젝트 구조

```
/app
  /(app)                 # 인증 보호된 라우트
    /dashboard          # 지문 목록 및 대시보드
    /passage/[id]       # 지문 상세 및 문제 생성
    /bank               # 문제 은행 (저장된 문제 세트)
  /(auth)
    /login             # 로그인 페이지
  /api
    /generate          # OpenAI 문제 생성 API
    /passages          # 지문 CRUD
    /question-sets     # 문제 세트 CRUD
  /auth/callback       # OAuth 콜백 핸들러

/components
  /auth               # 인증 관련 컴포넌트
  /passages           # 지문 관리 UI
  /questions          # 문제 표시 및 편집
  /generation         # AI 생성 워크플로우
  /bank               # 문제 은행 UI
  /layout             # 레이아웃 (Sidebar, Header)
  /shared             # 공유 컴포넌트 (ErrorBoundary, Spinner 등)
  /ui                 # 기본 UI 컴포넌트 (Button, Input, Dialog 등)

/lib
  /ai                 # OpenAI 통합 및 프롬프트
  /supabase           # Supabase 클라이언트 (client/server)
  /db/queries         # 데이터베이스 쿼리 함수
  /utils              # 유틸리티 함수
  /constants          # 상수 및 열거형

/hooks                # 커스텀 React 훅
/schemas              # Zod 스키마 정의
/types                # TypeScript 타입 정의
```

## 데이터베이스 스키마 (Supabase PostgreSQL)

### 1. profiles (사용자 프로필)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. passages (영어 지문)
```sql
CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT,
  content TEXT NOT NULL,
  grade_level TEXT CHECK (grade_level IN ('M1', 'M2', 'M3')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. question_sets (문제 세트)
```sql
CREATE TABLE question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_count INTEGER,
  question_types TEXT[],
  payload JSONB NOT NULL,  -- 전체 문제 데이터 저장
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS 정책
- 모든 테이블에 RLS 활성화
- 사용자는 자신의 데이터만 CRUD 가능
- `auth.uid()` 함수로 현재 사용자 식별
- 정책 예시: `CREATE POLICY "Users can view own passages" ON passages FOR SELECT USING (auth.uid() = user_id);`

## 핵심 기능

### 1. 인증 (Google OAuth)
- Supabase Auth + Google OAuth Provider
- OAuth 콜백 처리: `/auth/callback/route.ts`
- 세션 관리: `@supabase/ssr` 사용
- 자동 프로필 생성: Database Trigger (`handle_new_user()`)

### 2. 지문 관리 (CRUD)
- 지문 생성 시 AI 자동 제목 생성
- 최소 100자 이상 입력 검증
- 학년 선택 (중1/M1, 중2/M2, 중3/M3)
- 지문 수정 및 삭제 (CASCADE 삭제)

### 3. AI 문제 생성
- **OpenAI API 호출**: `/api/generate` 엔드포인트
- **모델**: gpt-4o-mini (비용 효율적)
- **Structured Output**: `response_format: { type: 'json_object' }`
- **프롬프트 구조**:
  - System Prompt: 역할, 제약사항, JSON 스키마 정의
  - User Prompt: 지문 + 설정 (난이도, 문제 수, 문제 유형)
- **검증 파이프라인**:
  1. OpenAI 응답 받기
  2. JSON 파싱
  3. Zod 스키마 검증
  4. 문제 수 및 설정 일치 확인
- **근거 기반 생성**: 각 문제에 지문의 직접 인용구 포함

### 4. 문제 검토 및 편집
- 검증 상태: PASS / NEEDS_FIX
- 개별 문제 수동 편집 (Dialog)
- 개별 문제 재생성 (AI)
- 근거 표시 (Evidence highlighting)

### 5. 문제 은행
- 저장된 문제 세트 조회
- 다중 필터 (학년, 난이도, 문제 유형)
- 문제 세트 상세 보기 및 삭제

## AI 파이프라인 상세

### OpenAI 통합 (`lib/ai/openai.ts`)
```typescript
export async function createOpenAIResponse(params: CreateResponseParams) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessages,
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });
  return completion;
}
```

### 프롬프트 엔지니어링 (`lib/ai/prompts.ts`)
- **System Prompt**: 역할 정의, JSON 스키마, 품질 기준
- **User Prompt**: 지문 + 생성 설정
- **근거 형식**: "Found in Paragraph X: 'quote'" or "Inferred from Paragraph X: 'reasoning'"

### 검증 스키마 (`lib/ai/validation.ts`)
```typescript
const generationResponseSchema = z.object({
  questions: z.array(questionSchema),
  meta: z.object({
    grade_level: gradeLevelSchema,
    difficulty: difficultySchema,
    question_types: z.array(questionTypeSchema),
    question_count: z.number(),
  }),
});
```

## API 엔드포인트

### 지문 관리
- `POST /api/passages` - 지문 생성
- `GET /api/passages` - 지문 목록
- `GET /api/passages/[id]` - 지문 상세
- `PATCH /api/passages/[id]` - 지문 수정
- `DELETE /api/passages/[id]` - 지문 삭제

### AI 생성
- `POST /api/generate` - 문제 생성
  - Body: `{ passageId, gradeLevel, difficulty, count, questionTypes }`
  - Returns: `{ questions, meta }`

### 문제 세트
- `POST /api/question-sets` - 문제 세트 저장
- `GET /api/question-sets` - 문제 세트 목록 (선택적 passageId 필터)
- `GET /api/question-sets/[id]` - 문제 세트 상세
- `DELETE /api/question-sets/[id]` - 문제 세트 삭제

## 보안 고려사항

1. **API 키 보안**: OpenAI API 키는 서버 사이드에서만 사용 (`process.env.OPENAI_API_KEY`)
2. **인증**: 모든 API 라우트에서 `getUser()` 호출로 인증 확인
3. **RLS**: 데이터베이스 레벨에서 사용자 데이터 격리
4. **XSS 방지**: React의 자동 이스케이핑, 사용자 입력 검증
5. **CSRF**: Next.js의 자동 CSRF 보호
6. **환경 변수**: `.env.local` 사용, Vercel에서 안전하게 관리

## 성능 최적화

1. **Server Components**: 기본적으로 서버에서 렌더링
2. **Client Components**: 인터랙션 필요한 부분만 `'use client'` 사용
3. **Lazy Loading**: 지문 목록 페이지네이션 (향후)
4. **Caching**: Next.js 자동 캐싱, Supabase 쿼리 최적화
5. **인덱스**: `passages`, `question_sets`에 `user_id`, `passage_id` 인덱스

## 에러 처리

1. **클라이언트**: ErrorBoundary 컴포넌트
2. **API**: Try-catch + 구조화된 에러 응답 (`lib/utils/error-handler.ts`)
3. **OpenAI**: 재시도 로직, 타임아웃 처리
4. **토스트**: 사용자 친화적 에러 메시지

## 테스팅

- 스크립트: `npm run test:openai` (OpenAI API 테스트)
- 스크립트: `npm run test:title` (제목 자동 생성 테스트)
- 수동 테스팅: 전체 워크플로우 검증

## 배포

- **플랫폼**: Vercel
- **CI/CD**: GitHub 연동, main 브랜치 자동 배포
- **환경 변수**: Vercel 대시보드에서 설정
- **도메인**: `english-test-ai.vercel.app`

---

## 요청사항

위 프로젝트 정보를 바탕으로 **다음 카테고리별로 기술 면접 예상 질문과 상세한 모범 답변**을 작성해주세요:

### 1. 프로젝트 개요 및 동기 (5-7문항)
- 프로젝트 선정 이유, 해결하려는 문제
- 핵심 기능 및 차별점
- 사용자 워크플로우

### 2. 기술 스택 선정 이유 (8-10문항)
- Next.js를 선택한 이유 (vs React, Express)
- App Router vs Pages Router
- TypeScript 사용 이유
- Supabase vs Firebase vs 직접 구축
- Tailwind CSS vs 다른 CSS 프레임워크
- OpenAI API 선택 이유

### 3. 프론트엔드 아키텍처 (10-12문항)
- Next.js App Router 구조
- Server Components vs Client Components
- 상태 관리 전략 (Context API, React Query 대안)
- 커스텀 훅 설계
- 컴포넌트 재사용성
- 폼 처리 및 검증
- 에러 처리 (ErrorBoundary)
- 로딩 상태 처리

### 4. 백엔드 및 API 설계 (10-12문항)
- Next.js API Routes vs 독립 백엔드
- RESTful API 설계 원칙
- API 에러 처리 전략
- 요청/응답 검증 (Zod)
- 서버리스 아키텍처 장단점
- API 성능 최적화

### 5. 데이터베이스 (8-10문항)
- PostgreSQL 선택 이유
- 스키마 설계 결정 (JSONB 사용 이유)
- 정규화 vs 비정규화 (question_sets의 payload)
- 인덱스 전략
- 쿼리 최적화
- N+1 문제 방지
- 트랜잭션 처리
- CASCADE 삭제 전략

### 6. 인증 및 보안 (10-12문항)
- OAuth 2.0 흐름 설명
- Supabase Auth 아키텍처
- 세션 관리 (쿠키 vs 토큰)
- RLS (Row Level Security) 작동 원리
- RLS 정책 설계
- API 키 보안 (환경 변수)
- XSS, CSRF 방지
- SQL Injection 방지
- 사용자 데이터 격리

### 7. AI/LLM 통합 (12-15문항)
- OpenAI API 작동 원리
- gpt-4o-mini 선택 이유 (vs gpt-4, gpt-3.5-turbo)
- Structured Output (JSON mode) 설명
- 프롬프트 엔지니어링 전략
- System vs User prompt 역할
- Temperature 설정 의미
- Few-shot learning vs Zero-shot
- 응답 검증 파이프라인
- 토큰 제한 처리
- 비용 최적화 전략
- AI 응답 오류 처리
- 재시도 로직
- 근거 추출 메커니즘
- 품질 검증 (PASS/NEEDS_FIX)

### 8. TypeScript 및 타입 안전성 (8-10문항)
- TypeScript 이점
- Zod vs 네이티브 TypeScript 타입
- 런타임 검증 중요성
- 타입 추론 활용
- Generic 타입 활용
- Type vs Interface
- 유틸리티 타입 활용

### 9. 성능 최적화 (8-10문항)
- Next.js 렌더링 전략 (SSR, SSG, ISR)
- Server Components 성능 이점
- Lazy Loading 구현
- 이미지 최적화
- Code Splitting
- API 응답 시간 개선
- 데이터베이스 쿼리 최적화
- Caching 전략

### 10. 배포 및 DevOps (7-9문항)
- Vercel 선택 이유
- 서버리스 배포 장단점
- 환경 변수 관리
- CI/CD 파이프라인
- 프로덕션 빌드 최적화
- 모니터링 및 로깅
- 에러 추적

### 11. 코드 품질 및 유지보수성 (7-9문항)
- 프로젝트 구조 설계 원칙
- 컴포넌트 분리 전략
- 파일 명명 규칙
- 코드 재사용성
- 에러 핸들링 패턴
- ESLint 설정
- Git 워크플로우

### 12. 기본 CS 지식 (12-15문항)
- HTTP 메서드 (GET, POST, PATCH, DELETE)
- RESTful API 원칙
- JWT vs Session
- OAuth 2.0 흐름
- CORS 개념
- HTTP 상태 코드
- Promise, async/await
- Event Loop (Node.js)
- Closure, Context (JavaScript)
- 메모이제이션
- SQL vs NoSQL
- ACID 속성
- CAP 정리

### 13. 실무 경험 기반 질문 (8-10문항)
- 프로젝트 중 가장 어려웠던 문제
- 성능 병목 해결 경험
- 버그 디버깅 과정
- 기술적 trade-off 결정
- 코드 리뷰 경험
- 협업 경험 (Git)
- 문서화 중요성
- 향후 개선 계획

### 14. 시스템 설계 질문 (5-7문항)
- 이 시스템을 확장한다면? (사용자 100만명)
- 마이크로서비스 아키텍처 전환
- 실시간 협업 기능 추가
- 문제 은행 검색 최적화
- PDF 내보내기 기능 설계
- 캐싱 전략 (Redis)
- CDN 활용

### 15. 트렌드 및 최신 기술 (5-7문항)
- React 19의 새로운 기능
- Next.js 16의 변경사항
- Server Actions
- Streaming
- AI Agent Framework
- RAG (Retrieval-Augmented Generation)
- Vector Database

---

## 답변 작성 가이드라인

각 질문에 대해:
1. **질문**: 면접관이 물을 법한 실제 질문
2. **핵심 답변**: 1-2문장으로 핵심만 요약
3. **상세 설명**: 기술적 세부사항, 코드 예시, 실제 구현 방식
4. **예상 꼬리 질문**: 해당 답변에서 이어질 수 있는 추가 질문
5. **모범 답변 팁**: 면접관에게 긍정적 인상을 주는 답변 방식

## 출력 형식

```markdown
# EnglishTestAI 프로젝트 기술 면접 준비 문서

## 목차
[자동 생성된 목차]

---

## 1. 프로젝트 개요 및 동기

### Q1-1: 이 프로젝트를 선택한 이유는 무엇인가요?

**핵심 답변**:
[1-2문장 핵심 요약]

**상세 설명**:
[기술적 세부사항, 실제 사례, 수치]

**코드 예시** (필요 시):
```typescript
[관련 코드 스니펫]
```

**예상 꼬리 질문**:
- [꼬리 질문 1]
- [꼬리 질문 2]

**모범 답변 팁**:
[답변 시 주의사항, 강조할 포인트]

---

### Q1-2: ...

[위와 동일한 형식으로 모든 카테고리의 질문 작성]
```

---

## 추가 요청사항

1. **실전성**: 실제 면접에서 물어볼 법한 질문으로 작성
2. **깊이**: 표면적 답변이 아닌 깊이 있는 기술적 이해 반영
3. **연결성**: 질문 간 논리적 흐름 유지
4. **코드 예시**: 가능한 한 실제 프로젝트 코드 기반 예시 포함
5. **최신성**: 2024-2025 기준 최신 기술 트렌드 반영
6. **실무 지향**: 이론보다는 실무 적용 가능한 지식 강조
7. **난이도 조절**: 기초부터 심화까지 점진적으로 난이도 상승
8. **한국어 작성**: 모든 답변은 한국어로 작성 (기술 용어는 영어 병기)

이 문서를 통해 면접장에서 어떤 질문에도 자신 있게 답변할 수 있도록 철저히 준비시켜주세요.
```

---

## 사용 방법

1. 위의 프롬프트 전체를 복사
2. ChatGPT, Claude, 또는 다른 AI에게 제공
3. 생성된 문서를 검토하고 개인화
4. 반복 학습 및 모의 면접 연습

## 예상 출력물

- **분량**: 약 100-150페이지 분량의 상세한 Q&A 문서
- **질문 수**: 총 150-200개의 예상 질문
- **카테고리**: 15개 주요 카테고리
- **형식**: Markdown 형식의 구조화된 문서

