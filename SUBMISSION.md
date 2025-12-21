# 📦 신입 개발자 과제 제출

## 프로젝트 정보

**프로젝트 명**: EnglishTestAI - 영어 교사를 위한 AI 문제 생성 도구

**개발 기간**: 2024년 12월 (MVP 개발 완료)

**개발자**: [이름]

---

## 🌐 배포 정보

### 프로덕션 URL
**https://english-test-ai.vercel.app**

### 테스트 방법
1. 위 URL 접속
2. "Continue with Google" 버튼 클릭하여 로그인
3. 대시보드에서 "Create New Passage" 클릭
4. 영어 지문 입력 (최소 100자) 및 학년 선택
5. 지문 생성 후 "Generate Question Set" 클릭
6. AI가 생성한 문제 검토 및 편집
7. "Save Question Set" 클릭하여 저장
8. "Question Bank"에서 저장된 문제 확인

---

## 📋 필수 요구사항 충족 현황

### ✅ 1. SNS 로그인(OAuth) 적용
- **구현**: Google OAuth (Supabase Auth 활용)
- **기능**:
  - Google 계정으로 로그인/로그아웃
  - 세션 유지 (Middleware + AuthProvider)
  - 보호된 라우트 (비로그인 시 자동 리디렉트)
- **증빙 파일**:
  - `components/auth/login-form.tsx`
  - `app/auth/callback/route.ts`
  - `proxy.ts`

### ✅ 2. LLM API 연동
- **사용 모델**: OpenAI GPT-4o-mini
- **기능**:
  - 영어 지문에서 객관식 문제 자동 생성
  - 문제 유형 선택 (Main Idea, Detail, Inference, Vocabulary)
  - 난이도 설정 (Easy, Medium, Hard)
  - 문제 개수 지정 (5-10개)
  - **근거 기반 검증**: 모든 문제에 지문 인용구 포함
  - 개별 문제 재생성 기능
- **증빙 파일**:
  - `lib/ai/openai.ts`
  - `lib/ai/prompts.ts`
  - `app/api/generate/route.ts`

### ✅ 3. 데이터베이스 연동
- **사용 DB**: Supabase (PostgreSQL)
- **테이블 구조**:
  - `profiles`: 사용자 프로필 (auth.users 연동)
  - `passages`: 영어 지문 (title, content, grade_level)
  - `question_sets`: 생성된 문제 세트 (JSONB payload)
- **CRUD 구현**:
  - ✅ Passages: 생성, 조회, 수정, 삭제
  - ✅ Question Sets: 생성, 조회, 삭제
- **보안**: Row Level Security (RLS) 적용
- **증빙 파일**:
  - `docs/archive/supabase_schema.sql`
  - `lib/db/queries/passages.ts`
  - `lib/db/queries/question-sets.ts`

### ✅ 4. 소스 코드 공유
- **GitHub 저장소**: `english-question-generator`
- **커밋 히스토리**: 20+ 커밋 (Conventional Commits 형식)
- **브랜치 전략**: `develop` → `main` (rebase workflow)
- **커밋 예시**:
  - `feat(bank): add filtering and sorting to question bank`
  - `refactor: update passage and bank components`
  - `docs: update README and project configuration`

### ✅ 5. 바이브 코딩 증빙
- **문서**: `docs/vibe_coding_log.md` (2,635 lines)
- **내용**:
  - 25개 주요 개발 단계 기록
  - 각 단계별 상세 기록:
    - **사용 모델**: Claude Sonnet 4.5, Gemini 2.0 Pro 등
    - **의도(Intent)**: 왜 이 작업을 수행했는지
    - **프롬프트(Prompt)**: 사용한 정확한 프롬프트
    - **검증(Verification)**: 결과 확인 방법
    - **수정(Refinement)**: 개선 및 수정 사항
- **주요 단계**:
  - 초기 기획 및 와이어프레임
  - 프로토타입 구현
  - Blueprint 작성
  - Supabase 스키마 설정
  - Google OAuth 구현
  - Passage CRUD
  - OpenAI API 통합
  - Question 생성 및 검증
  - Toast/Error Handling/Loading States
  - Question Bank 필터링
  - 최종 배포

---

## 📊 비기능 요구사항 충족 현황

### ✅ README 작성
- **파일**: `README.md` (549 lines)
- **포함 내용**:
  - 프로젝트 소개 및 핵심 미션
  - 구현된 기능 목록 (14개)
  - 기술 스택 상세 설명
  - 사전 요구사항 (Node.js, Supabase, OpenAI)
  - 설치 가이드 (6단계)
  - 환경 변수 설정 방법
  - 로컬 실행 방법
  - 사용 방법 (5단계 워크플로우)
  - 데이터베이스 스키마 설명
  - API 엔드포인트 목록
  - Vercel 배포 가이드
  - 프로젝트 구조 설명

### ✅ 환경 변수 예시
- **파일**: `.env.example`
- **포함 내용**:
  - Supabase URL/Key (새 키 시스템 안내 포함)
  - OpenAI API Key
  - Next.js Site URL

### ✅ 예외 처리 및 사용자 피드백
- **표준화된 에러 처리**:
  - 11가지 에러 코드 정의 (`lib/utils/error-handler.ts`)
  - 모든 API 라우트에 try-catch 적용
  - 사용자 친화적 에러 메시지 변환
  - Error Boundary 구현
  - 재시도(retry) 기능
- **사용자 피드백**:
  - Toast 알림 시스템 (success/error/warning/info)
  - Skeleton loaders (로딩 중)
  - Spinner 애니메이션
  - AlertDialog (삭제 확인)
  - 실시간 폼 검증

---

## 🎁 가산점 항목 충족 현황

### ✅ 1. 배포 (완료)
- **플랫폼**: Vercel
- **URL**: https://english-test-ai.vercel.app
- **자동 배포**: main 브랜치 푸시 시 자동 배포
- **환경 변수**: Vercel 대시보드에 설정 완료

### ❌ 2. CI/CD (미구현)
- **상태**: MVP 범위에서 제외
- **대안**: Vercel 자동 배포 활용

### ✅ 3. 추가 기능 (다수 구현)
- ✅ 검색 및 필터링 (Question Bank)
  - 제목 검색
  - 난이도 필터 (다중 선택)
  - 학년 필터 (다중 선택)
  - 문제 유형 필터 (다중 선택)
  - 정렬 (최신순, 오래된순, 제목 A-Z/Z-A)
- ✅ 문제 편집 기능 (QuestionEditDialog)
  - 문제 텍스트, 선택지, 정답, Evidence 수정
- ✅ 단일 문제 재생성
  - 다른 문제에 영향 없이 특정 문제만 재생성
- ✅ 저장된 문제 세트 관리
  - 상세 조회 (Passage + 모든 문제)
  - 수정 (Review 단계로 로드)
  - 삭제 (확인 다이얼로그 포함)
- ✅ 워크플로우 인디케이터
  - Input → Generate → Review → Save 진행 표시
- ✅ 검증 상태 시각화
  - PASS/NEEDS_FIX 배지
  - 검증 이슈 설명
- ✅ 근거 기반 검증 (핵심 차별화 요소)
  - 모든 문제에 지문 인용구 포함
  - 교사가 답안 근거 확인 가능

### ❌ 4. 테스트 코드 (부분 구현)
- **상태**: Unit Test 미구현
- **테스트 스크립트**:
  - `scripts/test-openai.ts`: OpenAI API 테스트
  - `scripts/test-title-autogen.ts`: 제목 자동 생성 테스트
  - `scripts/test-question-set-schema.ts`: 스키마 검증 테스트

### ❌ 5. Agent Framework (미구현)
- **상태**: MVP 범위에서 제외

### ✅ 6. 프론트엔드 가산점 (모두 충족)
- ✅ **Tailwind CSS**: 전체 스타일링
- ✅ **TypeScript**: strict mode, 완벽한 타입 안전성
- ✅ **react-icons**: 모든 아이콘
- ✅ **커스텀 UI 컴포넌트**: Toast, AlertDialog, Button, Input, Dialog 등
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 대응

---

## 🏗️ 아키텍처 및 기술적 특징

### 프로젝트 구조
```
english-question-generator/
├── app/                      # Next.js App Router
│   ├── (app)/               # 보호된 라우트
│   │   ├── dashboard/       # 지문 목록
│   │   ├── passage/[id]/    # 문제 생성 워크벤치
│   │   └── bank/            # 문제 은행
│   ├── (auth)/              # 인증 라우트
│   ├── api/                 # API 라우트
│   └── auth/callback/       # OAuth 콜백
├── components/              # React 컴포넌트
│   ├── auth/               # 인증
│   ├── passages/           # 지문 관리
│   ├── questions/          # 문제 표시/편집
│   ├── generation/         # 생성 워크플로우
│   ├── bank/              # 문제 은행
│   └── shared/            # 공유 컴포넌트
├── lib/                    # 유틸리티
│   ├── supabase/          # DB 클라이언트
│   ├── ai/                # OpenAI 통합
│   ├── db/                # 쿼리 함수
│   └── utils/             # 헬퍼 함수
├── hooks/                  # 커스텀 훅
├── types/                  # 타입 정의
├── schemas/                # Zod 검증
└── docs/                   # 문서
```

### 핵심 기술 스택
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, react-icons
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **AI**: OpenAI GPT-4o-mini
- **Validation**: Zod
- **Deployment**: Vercel

### 보안
- Row Level Security (RLS) - 사용자별 데이터 격리
- Google OAuth - 안전한 인증
- Middleware 인증 보호 - Edge에서 세션 검증
- 환경 변수 - API 키 보호

### 성능 최적화
- Server Components - 서버 사이드 렌더링
- Skeleton Loaders - 부드러운 로딩
- 최적화된 이미지 - Next.js Image
- React Query 패턴 - 효율적인 데이터 페칭

---

## 📈 주요 성과 및 차별점

### 1. 근거 기반 검증 시스템 (핵심 차별화)
- **문제점**: 기존 AI 생성기는 답안 근거 없이 문제만 생성
- **해결책**: 모든 문제에 지문의 직접 인용구 포함
- **효과**: 교사가 답안의 타당성을 즉시 검증 가능

### 2. 교사 주도 워크플로우
- **문제점**: AI가 일방적으로 문제 생성 후 제공
- **해결책**: 입력 → 생성 → 검토 → 편집 → 저장 단계별 제어
- **효과**: 교사가 모든 단계에서 품질 관리

### 3. 프로덕션 레벨 코드 품질
- TypeScript strict mode
- 표준화된 에러 처리 (11가지 에러 코드)
- Toast/AlertDialog/Loading States
- Error Boundary
- 재시도 메커니즘
- Skeleton Loaders

### 4. 완전한 문서화
- README: 549 lines
- Vibe Coding Log: 2,635 lines
- Blueprint: 394 lines
- Project Structure: 376 lines
- Supabase Schema: 전체 DDL 포함

---

## 🎯 개발 과정 하이라이트

### 사용한 AI 도구
- **Claude Sonnet 4.5** (Cursor Agent): 대부분의 구현
- **Gemini 2.0 Pro**: 초기 기획 및 Blueprint
- **Cursor Composer**: 프로젝트 구조 설계

### 주요 기술적 도전과제
1. **API 응답 타입 정렬**: snake_case ↔ camelCase 불일치 해결
2. **무한 리디렉트 루프**: Middleware 충돌 해결
3. **Deprecated Cookie API**: Supabase SSR 최신 API로 업데이트
4. **OpenAI JSON 검증**: AI 응답 스키마 분리

### 개발 프로세스
1. 와이어프레임 → 프로토타입 → Blueprint
2. Foundation (인증, 레이아웃)
3. Core Features (CRUD, API)
4. Polish (Toast, Error Handling, Loading)
5. Deployment

---

## 📝 로컬 실행 방법

### 1. 저장소 클론
```bash
git clone [repository-url]
cd english-question-generator
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일을 열어 다음 값 설정:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - OPENAI_API_KEY
```

### 4. Supabase 설정
1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `docs/archive/supabase_schema.sql` 실행
3. Authentication → Providers에서 Google OAuth 활성화

### 5. 개발 서버 실행
```bash
npm run dev
# http://localhost:3000 접속
```

---

## 📚 제출 문서 목록

### 필수 문서
1. ✅ **README.md** - 종합 설치/실행 가이드 (549 lines)
2. ✅ **SUBMISSION.md** - 본 제출 문서
3. ✅ **docs/vibe_coding_log.md** - 바이브 코딩 로그 (2,635 lines)
4. ✅ **.env.example** - 환경 변수 템플릿
5. ✅ **docs/archive/supabase_schema.sql** - DB 스키마

### 참고 문서
- `docs/edited_project_blueprint.md` - 프로젝트 설계 문서
- `docs/project_structure.md` - 프로젝트 구조 설명
- `package.json` - 의존성 목록

---

## 🔗 링크 모음

- **배포 URL**: https://english-test-ai.vercel.app
- **GitHub 저장소**: [repository-url]
- **Supabase 문서**: https://supabase.com/docs
- **OpenAI API 문서**: https://platform.openai.com/docs
- **Next.js 문서**: https://nextjs.org/docs

---

## 💡 향후 개선 계획

### Phase 4 (향후 개발)
- [ ] Unit Test 추가 (Vitest)
- [ ] E2E Test (Playwright)
- [ ] GitHub Actions CI/CD
- [ ] 문제 PDF 내보내기
- [ ] 문제 템플릿 관리
- [ ] 협업 기능 (문제 공유)
- [ ] 통계 대시보드 (문제 생성 이력)

---

## 📞 연락처

**개발자**: [이름]
**이메일**: [이메일]
**GitHub**: [GitHub 프로필]

---

## 🙏 감사의 글

이 프로젝트는 신입 개발자 과제로 제작되었으며, 다음 기술 및 도구에 감사드립니다:
- Next.js 및 Vercel 팀
- Supabase 팀
- OpenAI 팀
- Cursor AI 및 Claude AI
- shadcn/ui 및 react-icons 커뮤니티

---

**제출일**: 2024년 12월 22일
**프로젝트 버전**: 1.0.0 (MVP)

