# Phase 3 Task 7: Deployment - Implementation Guide

## 목표 (Objective)
Vercel에 프로덕션 배포 및 프로덕션 환경에서 전체 기능 테스트

## 현재 상태 (Current State)
- ✅ Phase 2 완료
- ✅ Phase 3 Task 1-6 완료
- ✅ README.md 완성 (배포 가이드 포함)
- ⚠️ 로컬 빌드 테스트 필요
- ⚠️ Vercel 배포 필요

## 배포 체크리스트 (Deployment Checklist)

### 사전 준비 (Pre-deployment)

#### 1. 로컬 빌드 테스트 ⭐⭐⭐
배포 전에 로컬에서 프로덕션 빌드가 성공하는지 확인:

```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 성공 확인
# - 빌드 오류 없음
# - 모든 페이지 정상 생성
# - 번들 크기 확인

# 프로덕션 빌드 로컬 실행 테스트
npm start

# 테스트 항목:
# - http://localhost:3000 접속
# - 랜딩 페이지 정상 렌더링
# - 모든 정적 리소스 로드
# - 콘솔 오류 없음
```

**예상 결과:**
- ✅ 빌드 성공 (Build successful)
- ✅ Route segments generated
- ✅ No TypeScript errors
- ✅ No linting errors

#### 2. 환경 변수 준비 ⭐⭐⭐
Vercel에 설정할 환경 변수 목록:

**필수 환경 변수:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**선택 환경 변수:**
```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here (선택)
```

**주의사항:**
- `OPENAI_API_KEY`는 절대 `NEXT_PUBLIC_`을 붙이지 마세요 (서버 전용)
- 모든 키는 `.env.local`에서 복사 (프로덕션 값과 동일)
- Vercel 대시보드에서 "Environment Variables" 섹션에 추가

#### 3. Git 저장소 준비
```bash
# 모든 변경사항 커밋
git add .
git commit -m "feat: prepare for deployment"

# GitHub에 푸시 (이미 되어있을 수 있음)
git push origin main
```

#### 4. Supabase URL 확인
Supabase 대시보드에서 현재 리디렉션 URL 확인:
- Authentication → URL Configuration
- 현재 설정: `http://localhost:3000/auth/callback`
- 배포 후 추가할 URL: `https://your-app.vercel.app/auth/callback`

---

## Vercel 배포 단계 (Deployment Steps)

### 1단계: Vercel 계정 준비

1. [vercel.com](https://vercel.com) 방문
2. GitHub 계정으로 로그인
3. 계정이 없으면 가입 (무료)

### 2단계: 프로젝트 가져오기

1. Vercel 대시보드에서 **"Add New Project"** 클릭
2. **"Import Git Repository"** 선택
3. GitHub 저장소 선택:
   - `english-test-ai` (또는 실제 저장소 이름)
4. **"Import"** 클릭

### 3단계: 프로젝트 설정

**Framework Preset:**
- Vercel이 자동으로 "Next.js" 감지 ✅

**Root Directory:**
- 변경 없음 (기본값: `.`)

**Build and Output Settings:**
- Build Command: `npm run build` (자동 감지)
- Output Directory: `.next` (자동 감지)
- Install Command: `npm install` (자동 감지)

모두 기본값으로 두면 됩니다!

### 4단계: 환경 변수 추가 ⭐⭐⭐

**중요!** 배포 전에 환경 변수를 반드시 설정해야 합니다.

1. **"Environment Variables"** 섹션 펼치기
2. 다음 변수 추가:

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development (모두 선택)
```

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhb... (실제 anon key)
Environment: Production, Preview, Development (모두 선택)
```

```
Key: OPENAI_API_KEY
Value: sk-... (실제 OpenAI key)
Environment: Production, Preview, Development (모두 선택)
```

```
Key: NEXT_PUBLIC_SITE_URL
Value: https://your-app.vercel.app (배포 후 Vercel이 제공하는 URL)
Environment: Production
```

**주의:**
- 각 변수마다 "Add" 버튼 클릭
- `OPENAI_API_KEY`는 `NEXT_PUBLIC_`을 붙이지 마세요!
- 모든 환경 (Production, Preview, Development)을 선택

### 5단계: 배포 시작

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 모니터링:
   - Building... (1-3분 소요)
   - Running Build Command
   - Collecting Build Output
   - Deploying...
3. 배포 완료 대기

**예상 배포 시간: 2-5분**

### 6단계: Vercel URL 확인

배포가 완료되면:
1. **"Visit"** 버튼 클릭
2. Vercel이 제공하는 URL 확인:
   - 형식: `https://english-test-ai-xxx.vercel.app`
   - 또는 커스텀 도메인 (설정한 경우)
3. 브라우저에서 앱 열기

### 7단계: Supabase 리디렉션 URL 업데이트 ⭐⭐⭐

**중요!** Google OAuth가 작동하려면 반드시 설정해야 합니다.

1. Supabase 대시보드 열기
2. **Authentication** → **URL Configuration** 이동
3. **Redirect URLs** 섹션에 추가:
   ```
   https://your-app.vercel.app/auth/callback
   ```
   (실제 Vercel URL로 대체)
4. **Save** 클릭

### 8단계: 프로덕션 테스트 ⭐⭐⭐

배포된 앱에서 다음 기능 테스트:

#### 인증 테스트
- [ ] 랜딩 페이지 로드
- [ ] "Google로 로그인" 버튼 클릭
- [ ] Google OAuth 팝업 열림
- [ ] 인증 후 대시보드로 리디렉션

#### 지문 기능 테스트
- [ ] 대시보드 로드
- [ ] "새 지문 만들기" 클릭
- [ ] 지문 입력 및 저장
- [ ] 지문 목록에 표시

#### 문제 생성 테스트
- [ ] 지문 열기
- [ ] 설정 구성 (난이도, 문제 수, 유형)
- [ ] "문제 세트 생성" 클릭
- [ ] 문제 생성 완료 (10-30초)
- [ ] 생성된 문제 표시

#### 문제 편집 테스트
- [ ] 문제 편집 대화 상자 열기
- [ ] 문제 수정 및 저장
- [ ] 개별 문제 재생성
- [ ] 변경 사항 반영

#### 문제 은행 테스트
- [ ] 문제 세트 저장
- [ ] "문제 은행" 이동
- [ ] 저장된 세트 표시
- [ ] 필터 기능 작동
- [ ] 세트 삭제

#### 오류 확인
- [ ] 브라우저 콘솔에 오류 없음
- [ ] 네트워크 탭에 실패한 요청 없음
- [ ] 모든 이미지/아이콘 로드
- [ ] 레이아웃 정상

### 9단계: NEXT_PUBLIC_SITE_URL 업데이트 (선택)

이미 환경 변수에 추가했다면 건너뛰세요.

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. `NEXT_PUBLIC_SITE_URL` 추가 또는 업데이트:
   - Value: `https://your-app.vercel.app` (실제 URL)
   - Environment: Production
4. **Save**
5. **Deployments** → 최신 배포 → **Redeploy** (변경 사항 반영)

---

## 배포 후 확인 사항 (Post-Deployment Checklist)

### 기능 확인
- [ ] Google OAuth 로그인 작동
- [ ] 지문 CRUD 작동
- [ ] 문제 생성 작동 (OpenAI API 호출 성공)
- [ ] 문제 편집 작동
- [ ] 문제 세트 저장 작동
- [ ] 문제 은행 조회 작동
- [ ] 토스트 알림 표시
- [ ] 오류 처리 작동

### 성능 확인
- [ ] 페이지 로드 속도 양호 (< 3초)
- [ ] 이미지/아이콘 로드
- [ ] API 응답 시간 양호
- [ ] 모바일에서 정상 작동

### 보안 확인
- [ ] HTTPS 연결 (자동, Vercel 제공)
- [ ] 환경 변수 노출 안 됨
- [ ] CORS 오류 없음
- [ ] RLS 정책 작동 (다른 사용자 데이터 접근 불가)

### 오류 확인
- [ ] 콘솔 오류 없음
- [ ] 404 오류 없음
- [ ] API 오류 없음
- [ ] 빌드 경고 없음

---

## 문제 해결 (Troubleshooting)

### 빌드 실패 (Build Failed)

**증상:** Vercel 빌드 중 오류 발생

**해결 방법:**
1. Vercel 로그 확인 (어떤 오류인지 확인)
2. 로컬에서 `npm run build` 실행하여 재현
3. TypeScript 오류 수정: `npm run lint`
4. 의존성 오류: `package.json` 확인
5. 재배포: Vercel 대시보드 → Redeploy

### Google OAuth 실패

**증상:** 로그인 후 리디렉션 안 됨 또는 오류

**해결 방법:**
1. Supabase 대시보드 → Authentication → URL Configuration
2. Redirect URLs에 Vercel URL 추가:
   ```
   https://your-app.vercel.app/auth/callback
   ```
3. Site URL도 업데이트:
   ```
   https://your-app.vercel.app
   ```
4. 브라우저 캐시 삭제 후 재시도

### 환경 변수 누락

**증상:** "Missing environment variable" 오류

**해결 방법:**
1. Vercel 대시보드 → Settings → Environment Variables
2. 누락된 변수 추가
3. Deployments → 최신 배포 → Redeploy

### OpenAI API 오류

**증상:** 문제 생성 실패 ("API error")

**해결 방법:**
1. OpenAI API 키 확인 (유효한지, 크레딧 있는지)
2. Vercel 환경 변수에 `OPENAI_API_KEY` 올바르게 설정되었는지 확인
3. `NEXT_PUBLIC_` 접두사 없는지 확인 (서버 전용)
4. Vercel 로그에서 자세한 오류 확인

### Supabase 연결 오류

**증상:** "Failed to connect to Supabase" 오류

**해결 방법:**
1. `NEXT_PUBLIC_SUPABASE_URL` 올바른지 확인
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 올바른지 확인
3. Supabase 프로젝트 활성화 상태 확인
4. RLS 정책이 너무 제한적이지 않은지 확인

---

## 최적화 (Optional Optimizations)

### 커스텀 도메인 설정 (선택)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 커스텀 도메인 추가 (예: `englishtestai.com`)
3. DNS 설정 (Vercel이 안내 제공)
4. Supabase Redirect URLs에 커스텀 도메인도 추가

### 성능 모니터링 (선택)

Vercel은 자동으로 다음을 제공:
- Analytics (페이지 뷰, 로드 시간)
- Speed Insights (성능 점수)
- Logs (오류 로그)

Vercel 대시보드에서 확인 가능.

### 환경별 설정 (선택)

- **Production**: `main` 브랜치
- **Preview**: Pull Request마다 자동 배포
- **Development**: 로컬 개발

Vercel이 자동으로 설정.

---

## 배포 완료 체크리스트 (Final Checklist)

### Vercel 배포
- [ ] Vercel 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정 (3개 필수)
- [ ] 배포 성공
- [ ] Vercel URL 확인

### Supabase 설정
- [ ] Redirect URLs에 Vercel URL 추가
- [ ] Site URL에 Vercel URL 추가

### 기능 테스트
- [ ] Google OAuth 로그인
- [ ] 지문 CRUD
- [ ] 문제 생성 (OpenAI)
- [ ] 문제 편집
- [ ] 문제 세트 저장
- [ ] 문제 은행 조회

### 문서 업데이트
- [ ] README.md에 배포 URL 추가 (선택)
- [ ] vibe_coding_log.md 업데이트 (선택)

---

## 성공 기준 (Success Criteria)

### 배포 성공
- ✅ Vercel 빌드 성공
- ✅ 프로덕션 URL 접근 가능
- ✅ HTTPS 연결

### 기능 정상 작동
- ✅ Google OAuth 로그인
- ✅ 모든 CRUD 작업
- ✅ OpenAI API 호출
- ✅ 데이터베이스 연결

### 사용자 경험
- ✅ 페이지 로드 빠름 (< 3초)
- ✅ 모바일 반응형
- ✅ 오류 없음
- ✅ 직관적 UI

---

## 다음 단계

배포 완료 후:
1. **Task 8: Final QA** - 전체 기능 최종 검증
2. **README 업데이트** - 배포 URL 추가 (선택)
3. **vibe_coding_log.md 업데이트** - 배포 과정 기록 (RFQ 요구사항)

---

## 참고 자료

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/app/building-your-application/deploying)
- [Supabase Auth 설정](https://supabase.com/docs/guides/auth)

---

## 실행 프롬프트 (Ready-to-Use)

```
Task 7 (Deployment)를 진행해줘.

단계:
1. 로컬 빌드 테스트 (npm run build)
2. Vercel에 배포 (GitHub 연동)
3. 환경 변수 설정 (Supabase, OpenAI)
4. Supabase Redirect URLs 업데이트
5. 프로덕션 테스트 (전체 기능)
6. 문제 해결 (오류 발생 시)

참고:
- @docs/phase3_task7_deployment_guide.md
- README.md의 Deployment 섹션
```

