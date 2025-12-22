# GitHub Secrets 설정 가이드

CI/CD 파이프라인이 빌드 시 필요한 환경 변수를 GitHub Secrets에 설정하는 방법입니다.

## 📋 필요한 Secrets 목록

다음 3개의 환경 변수를 GitHub Secrets에 설정해야 합니다:

1. `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon/Public Key
3. `OPENAI_API_KEY` - OpenAI API 키

---

## 🔧 GitHub Secrets 설정 방법

### 1단계: GitHub 저장소로 이동

1. 브라우저에서 GitHub 저장소로 이동:
   ```
   https://github.com/MarunTurtle/english-test-ai
   ```

### 2단계: Settings 메뉴 접근

1. 저장소 페이지 상단의 **Settings** 탭 클릭
2. 왼쪽 사이드바에서 **Secrets and variables** → **Actions** 클릭

### 3단계: New repository secret 추가

각 환경 변수마다 다음 단계를 반복합니다:

1. **New repository secret** 버튼 클릭
2. **Name** 필드에 환경 변수 이름 입력 (예: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Secret** 필드에 실제 값 입력
4. **Add secret** 버튼 클릭

---

## 📝 각 Secret 값 찾는 방법

### 1. NEXT_PUBLIC_SUPABASE_URL

**Supabase 대시보드에서 확인:**

1. [supabase.com](https://supabase.com)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. **Project URL** 섹션에서 URL 복사
   - 예: `https://xxxxxxxxxxxxx.supabase.co`

**GitHub Secrets에 추가:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Secret: `https://xxxxxxxxxxxxx.supabase.co` (실제 URL)

---

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Supabase 대시보드에서 확인:**

1. 같은 페이지 (Settings → API)에서
2. **Project API keys** 섹션 확인
3. **anon** 또는 **public** 키 복사
   - 이 키는 클라이언트에서 사용해도 안전한 공개 키입니다

**GitHub Secrets에 추가:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Secret: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (실제 키)

---

### 3. OPENAI_API_KEY

**OpenAI 플랫폼에서 확인:**

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)에 로그인
2. **Create new secret key** 클릭 (또는 기존 키 사용)
3. 키 이름 입력 (선택사항)
4. **Create secret key** 클릭
5. 생성된 키를 **즉시 복사** (다시 볼 수 없음)
   - 예: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**GitHub Secrets에 추가:**
- Name: `OPENAI_API_KEY`
- Secret: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (실제 키)

---

## ✅ 설정 확인

모든 Secrets를 추가한 후:

1. **Actions** 탭으로 이동
2. 최근 워크플로우 실행 확인
3. 또는 새로운 커밋을 푸시하여 CI 트리거
4. 빌드가 성공적으로 완료되는지 확인

---

## 🔒 보안 주의사항

1. **절대 공개하지 마세요**
   - GitHub Secrets는 저장소에 접근 권한이 있는 사람만 볼 수 있습니다
   - 코드나 커밋 메시지에 실제 값을 포함하지 마세요

2. **키 관리**
   - OpenAI API 키는 사용량에 따라 비용이 발생합니다
   - 필요시 키를 회전(재생성)할 수 있습니다

3. **권한 확인**
   - 저장소 Settings에 접근할 수 있는 권한이 있어야 합니다
   - Organization 저장소인 경우 관리자 권한이 필요할 수 있습니다

---

## 🐛 문제 해결

### 빌드가 여전히 실패하는 경우

1. **Secrets 이름 확인**
   - 대소문자 정확히 일치하는지 확인
   - `NEXT_PUBLIC_SUPABASE_URL` (정확히 이 형식)

2. **값 확인**
   - 공백이나 줄바꿈이 포함되지 않았는지 확인
   - 전체 값을 정확히 복사했는지 확인

3. **워크플로우 재실행**
   - Actions 탭에서 실패한 워크플로우를 찾아 **Re-run jobs** 클릭

4. **로그 확인**
   - 빌드 로그에서 환경 변수가 제대로 전달되었는지 확인
   - 환경 변수 값은 마스킹되어 표시됩니다 (보안상 이유)

---

## 📚 참고 자료

- [GitHub Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase API Keys 가이드](https://supabase.com/docs/guides/api/api-keys)
- [OpenAI API Keys 가이드](https://platform.openai.com/docs/guides/production-best-practices/api-keys)

