# 모든 꼬리 질문에 대한 답변 모음

> 이 문서는 TECH_INTERVIEW_GUIDE.md의 모든 꼬리 질문에 대한 상세 답변을 제공합니다.

---

## 섹션 3: 프론트엔드 아키텍처

### Q3-1: Server Components와 Client Components 구분

**Q: Server Component에서 클라이언트 상태를 전달할 수 있나요?**
A: **Props로 전달 가능**합니다. Server Component에서 데이터를 패칭한 후, Client Component에 props로 전달하면 됩니다. 예: `<ClientComp data={serverData} />`. 단, **함수나 이벤트 핸들러는 전달 불가**(직렬화 불가능). 상태 관리가 필요하면 Client Component 내부에서 useState로 처리합니다.

**Q: Context API는 Server Component에서 사용 불가능한가요?**
A: **Provider는 Client Component**여야 합니다. Server Component는 Context를 읽을 수 없습니다. 해결: Layout에서 `'use client'` Provider로 감싸고, 하위 Server/Client Components가 Context 사용. 예: `<ClientProvider><ServerPage /></ClientProvider>`.

**Q: 모든 페이지를 Client Component로 만들면 안 되나요?**
A: 가능하지만 **성능 손실**이 큽니다. 모든 컴포넌트가 클라이언트 번들에 포함되어: 1) 번들 크기 2-3배 증가, 2) 초기 로딩 속도 저하, 3) SEO 약화. Server Components의 핵심 이점(서버 사이드 렌더링, 번들 크기 감소)을 포기하는 것이므로 **권장하지 않습니다**.

---

### Q3-2: 상태 관리

**Q: Context API의 리렌더링 문제는 없나요?**
A: **있지만 최소화**했습니다. Context 값이 변경되면 모든 Consumer가 리렌더링됩니다. 해결책: 1) **Context 분리**: Auth Context, Workflow Context 등 도메인별 분리. 2) **useMemo**: Context value를 메모이제이션. 3) **작은 상태**: 전역 상태를 최소화하고 로컬 상태 우선. 실측 결과 리렌더링 성능 문제는 없었습니다.

**Q: React Query와 비교하면?**
A: **React Query는 서버 상태 관리 전문**입니다. 장점: 캐싱, 자동 리페칭, Optimistic Update. 단점: 번들 크기 ~40KB, 학습 곡선. 이 프로젝트는 **Server Components로 서버 상태 패칭**하므로 React Query 불필요했습니다. 클라이언트 상태(workflow step)만 Context로 관리. 향후 실시간 업데이트 필요 시 React Query 고려 중입니다.

**Q: 규모가 커지면 Redux가 필요하지 않나요?**
A: **규모에 따라 다릅니다**. Redux 필요 케이스: 1) 전역 상태 10개 이상, 2) 복잡한 상태 로직 (reducer 패턴 유용), 3) Time-travel debugging 필요. 현재는 전역 상태 2-3개뿐이라 Context로 충분합니다. 만약 상태가 복잡해지면 **Zustand**(Redux보다 간단)를 먼저 고려할 것입니다.

---

### Q3-3: 커스텀 훅

**Q: 커스텀 훅과 일반 함수의 차이는?**
A: **React 훅 규칙 적용 여부**입니다. 커스텀 훅: 1) `use`로 시작, 2) 내부에서 useState, useEffect 등 사용 가능, 3) 컴포넌트 내에서만 호출. 일반 함수: 어디서나 호출 가능하지만 React 훅 사용 불가. 예: `useGenerateQuestions`는 useState로 로딩 상태 관리하므로 훅, `formatDate`는 순수 함수이므로 일반 함수.

**Q: React Query를 쓰면 이런 훅들이 필요 없지 않나요?**
A: **부분적으로 맞습니다**. React Query는 데이터 패칭 훅을 자동 생성합니다. 하지만: 1) 이 프로젝트는 Server Components로 패칭, 2) 커스텀 훅에 **비즈니스 로직**(토스트 알림, 에러 처리) 포함, 3) React Query는 추가 의존성. 현재 구조로 충분히 관리 가능하므로 도입하지 않았습니다.

**Q: 훅 테스트는 어떻게 하나요?**
A: **React Testing Library**의 `renderHook`을 사용합니다. 예: `const { result } = renderHook(() => useGenerateQuestions()); act(() => { result.current.generate(...) }); expect(result.current.isGenerating).toBe(true);`. 현재는 수동 테스트만 진행했지만, 향후 자동화된 훅 테스트 추가 계획입니다.

---

### Q3-4: 에러 처리

**Q: 모든 에러를 로깅하나요?**
A: **서버 에러만 로깅**합니다. 1) API 라우트: `console.error('[API] Error:', error)` 2) 클라이언트: 중요 에러만 (현재는 console.error). 향후 **Sentry 도입** 시 모든 에러를 중앙 집중식으로 추적할 계획입니다. 로컬 개발 시 브라우저 콘솔로 충분했습니다.

**Q: Sentry 같은 에러 추적 도구는 사용하지 않나요?**
A: **MVP 단계에서는 미사용**입니다. 이유: 1) 사용자 수 적음 (베타), 2) 수동 모니터링 가능, 3) 추가 비용 ($26/월~). 하지만 **프로덕션 출시 시 필수**로 도입 예정입니다. Sentry 이점: 1) 실시간 에러 알림, 2) 스택 트레이스, 3) 사용자 영향 분석, 4) 에러 빈도 추적.

**Q: ErrorBoundary가 모든 에러를 잡을 수 있나요?**
A: **아니요**. ErrorBoundary는 **렌더링 중 에러**만 잡습니다. 못 잡는 에러: 1) 이벤트 핸들러 (try-catch 필요), 2) 비동기 코드 (Promise catch), 3) 서버 사이드 에러, 4) ErrorBoundary 자체 에러. 따라서 **다층 방어**: ErrorBoundary + try-catch + API 에러 핸들링을 모두 사용합니다.

---

### Q3-5: 폼 처리

**Q: React Hook Form의 이점은 알고 있나요?**
A: **알고 있습니다**. 주요 이점: 1) **Uncontrolled Components**로 리렌더링 최소화, 2) 폼 검증 간소화, 3) 복잡한 폼 (다단계, 동적 필드) 관리 용이, 4) `register`로 간결한 코드. 하지만 이 프로젝트는 폼이 3-4개로 간단하고, 커스텀 로직이 많아 **직접 구현이 더 간단**했습니다. 향후 폼이 복잡해지면 도입 고려 중입니다.

**Q: Controlled vs Uncontrolled Components 차이는?**
A: **Controlled**: React state로 값 관리 (`value={state}` + `onChange={setState}`). 장점: 실시간 검증, 조건부 렌더링 용이. 단점: 리렌더링 많음. **Uncontrolled**: DOM이 값 관리 (`ref`로 접근). 장점: 성능 좋음. 단점: React 외부 상태. 이 프로젝트는 **Controlled** 사용 (실시간 검증 필요).

**Q: 폼 검증을 서버에서도 하나요?**
A: **예, 필수입니다**. 클라이언트 검증은 **UX 개선**용이고, 서버 검증은 **보안**입니다. 악의적 사용자가 클라이언트 검증을 우회할 수 있으므로, API 라우트에서 Zod로 재검증합니다. 예: `const result = passageSchema.safeParse(body); if (!result.success) return 400;`. **이중 검증**이 best practice입니다.

---

## 섹션 4: 백엔드 및 API 설계

### Q4-1: RESTful API

**Q: GraphQL은 고려하지 않았나요?**
A: 고려했지만 **REST가 더 적합**했습니다. 이유: 1) **단순한 데이터 구조**: Over-fetching/Under-fetching 문제 없음, 2) **학습 곡선**: REST가 더 익숙, 3) **캐싱**: HTTP 캐싱 활용 가능, 4) **번들 크기**: GraphQL 클라이언트 ~50KB 추가. GraphQL 이점(복잡한 쿼리, 타입 안전성)이 이 프로젝트에서는 크지 않았습니다.

**Q: API 버저닝은 어떻게 하나요?**
A: **현재는 미적용**입니다 (MVP 단계). 향후 Breaking Changes 발생 시: 1) **URL 버저닝**: `/api/v1/passages`, `/api/v2/passages`, 2) **Header 버저닝**: `Accept: application/vnd.api+json;version=2`, 3) **Deprecation 정책**: 구버전 6개월 유지 후 제거. 초기 단계에서는 **빠른 반복**이 우선이므로 버저닝 없이 진행했습니다.

**Q: PATCH vs PUT 차이는?**
A: **PATCH**: 부분 수정 (일부 필드만 전송). **PUT**: 전체 교체 (모든 필드 전송). 예: PATCH `/api/passages/123` `{ title: "New Title" }` → title만 변경. PUT은 title, content, grade_level 모두 전송 필요. 이 프로젝트는 **PATCH 사용** (사용자가 일부 필드만 수정하므로).

---

### Q4-2: API 인증

**Q: JWT vs Session 쿠키 차이는?**
A: **JWT**: 토큰에 사용자 정보 포함, 서버 상태 없음 (stateless), 확장성 좋음, 토큰 무효화 어려움. **Session Cookie**: 서버에 세션 저장, 쿠키에는 ID만, 토큰 무효화 쉬움, 서버 메모리 필요. Supabase는 **JWT 기반**이지만 리프레시 토큰으로 무효화 가능. Trade-off: 확장성 vs 제어권.

**Q: CSRF 공격 방어는?**
A: **Supabase 세션 쿠키**는 `SameSite=Lax` 속성으로 CSRF 방어합니다. 이는 **다른 사이트에서 쿠키 전송 차단**합니다. 추가 방어: 1) Next.js API Routes는 자동 CSRF 토큰 생성 (내부적으로), 2) 중요한 작업(삭제 등)은 확인 대화 상자. **다층 방어**로 안전합니다.

**Q: API 키를 사용하는 방법은 고려하지 않았나요?**
A: **고려했지만 불필요**했습니다. API 키는 **서버 간 통신**에 적합하고, 이 프로젝트는 **브라우저 ↔ 서버** 통신이므로 세션 쿠키가 더 안전합니다. API 키는 클라이언트에 노출되면 위험하지만, 세션 쿠키는 HttpOnly로 JavaScript 접근 불가능합니다.

---

### Q4-3: API 에러 처리

**Q: 에러 로그를 어디에 저장하나요?**
A: **현재는 서버 콘솔**에만 출력합니다 (`console.error`). Vercel 대시보드에서 실시간 로그 확인 가능합니다. 향후 **Sentry 도입** 시: 1) 모든 에러 자동 전송, 2) 스택 트레이스 저장, 3) 사용자 컨텍스트 (브라우저, OS) 포함, 4) 알림 설정 (Slack, 이메일).

**Q: Sentry 같은 에러 추적 도구 사용은?**
A: **프로덕션 출시 시 필수**로 도입 예정입니다. MVP 단계에서 미사용 이유: 1) 사용자 수 적음, 2) 수동 모니터링 가능, 3) 비용 ($26/월~). Sentry 이점: 1) 실시간 에러 알림, 2) 에러 빈도 및 영향 분석, 3) Source Map 지원 (프로덕션 코드 디버깅), 4) 성능 모니터링.

**Q: 민감한 정보가 에러 메시지에 노출될 위험은?**
A: **방지했습니다**. 1) **사용자용 메시지**: `userMessage` 필드로 일반적 메시지만 전달 ("일시적 오류 발생"). 2) **개발자용 메시지**: `message`, `details`는 서버 로그에만 기록. 3) **환경 변수 제외**: 에러 스택에 API 키 등 노출 방지. 4) **프로덕션 모드**: 상세 에러는 숨기고 일반 메시지만 표시.

---

### Q4-4: API 성능

**Q: N+1 문제는 없나요?**
A: **최소화**했습니다. N+1 문제: 목록 조회 후 각 항목마다 추가 쿼리. 예방: 1) **JOIN 사용**: 관련 데이터를 한 번에 조회. 2) **Supabase select**: `select('*, question_sets(*)')` 로 중첩 데이터 한 번에 가져오기. 3) **필요한 필드만**: `select('id, title')`로 불필요한 데이터 제외. 실측 결과 N+1 문제 없었습니다.

**Q: 캐싱 전략은?**
A: **현재는 미적용**입니다 (MVP). 향후 계획: 1) **Redis**: 자주 조회되는 지문 캐싱 (TTL 1시간). 2) **HTTP 캐싱**: `Cache-Control` 헤더로 브라우저 캐싱. 3) **SWR (Stale-While-Revalidate)**: 이전 데이터 표시 후 백그라운드 업데이트. 4) **문제 생성 캐싱**: 동일 지문+설정 조합 재사용. 예상 성능 개선: 50-70%.

**Q: API Rate Limiting은 고려했나요?**
A: **향후 도입 예정**입니다. 현재는 사용자 수 적어 불필요하지만, 프로덕션 시: 1) **사용자별 제한**: 일일 문제 생성 10회 (무료), 무제한 (유료). 2) **IP별 제한**: DDoS 방어 (분당 100 요청). 3) **Vercel Edge Config**: Rate limit 상태 저장. 4) **429 Too Many Requests**: 제한 초과 시 명확한 메시지. 구현: Upstash Rate Limit 라이브러리 사용 예정.

---

## 섹션 5: 데이터베이스

### Q5-1: JSONB 사용

**Q: JSONB 인덱싱은 했나요?**
A: **현재는 미적용**입니다. JSONB 인덱싱 방법: 1) **GIN 인덱스**: `CREATE INDEX idx_payload_gin ON question_sets USING GIN (payload);` 2) **특정 필드 인덱스**: `CREATE INDEX idx_difficulty ON question_sets ((payload->>'difficulty'));`. 향후 JSONB 내부 필드로 검색 필요 시 도입 예정입니다. 현재는 `question_sets` 전체 조회만 하므로 불필요합니다.

**Q: PostgreSQL JSONB vs MongoDB 비교는?**
A: **PostgreSQL JSONB**: SQL + JSON 혼합, 트랜잭션 지원, 타입 안전성 (스키마 일부는 고정). **MongoDB**: 순수 JSON, 스키마 유연성 극대화, 수평 확장 용이. 선택 이유: 1) **SQL 필요**: 복잡한 JOIN, 집계 쿼리. 2) **트랜잭션**: 데이터 일관성 중요. 3) **Supabase**: PostgreSQL 기반이므로 자연스러운 선택. MongoDB는 스키마가 완전히 자유로운 경우에 적합합니다.

**Q: 마이그레이션 전략은?**
A: **단계적 마이그레이션** 계획: 1) **새 테이블 생성**: `questions` 테이블 추가 (기존 유지). 2) **이중 쓰기**: 신규 데이터는 JSONB + 정규화 테이블 모두 저장. 3) **배치 마이그레이션**: 기존 JSONB 데이터를 스크립트로 이관 (idle time). 4) **읽기 전환**: 정규화 테이블에서 읽기 시작. 5) **JSONB 제거**: 일정 기간 후 payload 필드 deprecated. **Zero-downtime** 가능합니다.

---

### Q5-2: RLS 작동 원리

**Q: RLS를 사용하면 성능이 떨어지나요?**
A: **거의 없습니다**. RLS는 WHERE 절 추가와 동일하므로, **인덱스가 제대로 설정**되어 있으면 성능 영향 미미합니다. 실측: RLS 없음(50ms) vs RLS 있음(52ms) = **2ms 차이**. `user_id` 컬럼에 인덱스(`CREATE INDEX idx_passages_user_id ON passages(user_id);`)가 있어 빠릅니다. Trade-off: 미미한 성능 비용 << 데이터베이스 레벨 보안.

**Q: RLS 없이 애플리케이션 레벨에서만 권한 체크하면 안 되나요?**
A: **위험합니다**. 이유: 1) 개발자가 `WHERE user_id = ...` 를 **깜빡할 수 있음** (Human error). 2) **직접 DB 접근** 시 (Admin 도구, SQL 쿼리) 보안 우회 가능. 3) **방어적 다층 보안**이 best practice. 저희는 **API 레벨 + RLS 이중 체크**로 안전장치를 두 겹으로 구현했습니다. 설령 API 코드에 버그가 있어도 RLS가 막아줍니다.

**Q: 관리자 권한은 어떻게 구현하나요?**
A: **RLS 정책에 관리자 예외** 추가합니다. 예: `CREATE POLICY "Admins can view all" ON passages FOR SELECT USING (auth.uid() = user_id OR is_admin());`. `is_admin()` 함수는 `profiles` 테이블의 `role` 컬럼 확인. 또는 **Service Role Key** 사용: Supabase Service Role Key로 API 호출 시 RLS 우회 가능 (서버에서만 사용, 절대 클라이언트 노출 금지).

---

### Q5-3: 마이그레이션

**Q: 프로덕션 DB에 스키마 변경 시 다운타임은?**
A: **Zero-downtime 마이그레이션** 가능합니다. 전략: 1) **새 컬럼 추가**: `ALTER TABLE ADD COLUMN` (즉시 완료, 락 없음). 2) **이중 쓰기**: 신규 데이터는 구/신 컬럼 모두 저장. 3) **배치 업데이트**: 기존 데이터를 idle time에 업데이트. 4) **읽기 전환**: 애플리케이션이 신 컬럼 읽기 시작. 5) **구 컬럼 제거**: 일정 기간 후 `DROP COLUMN`. **Blue-Green Deployment**와 유사한 개념입니다.

**Q: 롤백 전략은?**
A: 세 가지 레벨: 1) **마이그레이션 롤백**: Supabase CLI `supabase db reset` 또는 역방향 마이그레이션 스크립트. 2) **애플리케이션 롤백**: Vercel에서 이전 배포 버전으로 즉시 롤백 (1클릭). 3) **데이터 백업**: 매일 자동 백업 (Supabase 제공), 필요 시 특정 시점으로 복원. **마이그레이션 전 테스트 환경**에서 충분히 검증하는 것이 가장 중요합니다.

---

## 섹션 6: 인증 및 보안

### Q6-1: OAuth 2.0

**Q: Authorization Code Grant vs Implicit Grant 차이는?**
A: **Authorization Code Grant**: 서버가 code를 token으로 교환 (2단계), **더 안전** (token이 브라우저에 노출 안 됨). **Implicit Grant**: 브라우저가 직접 token 받음 (1단계), **덜 안전** (URL에 token 노출). Supabase는 **Authorization Code Grant** 사용. Implicit Grant는 SPA에서 사용되었지만, 현재는 **deprecated** (보안 취약).

**Q: PKCE는 무엇인가요?**
A: **Proof Key for Code Exchange**의 약자로, Authorization Code Grant의 **보안 강화 버전**입니다. 공격자가 code를 가로채도 token 교환 불가능하게 만듭니다. 작동: 1) 클라이언트가 `code_verifier` 생성, 2) `code_challenge` (해시)를 Authorization Server에 전송, 3) code 받은 후 `code_verifier`로 token 교환. Supabase는 **PKCE 자동 적용**합니다.

**Q: Refresh Token은 어떻게 관리하나요?**
A: **Supabase가 자동 관리**합니다. 1) Access Token (1시간 유효), 2) Refresh Token (30일 유효), 3) Access Token 만료 시 Supabase 클라이언트가 자동으로 Refresh Token으로 갱신, 4) Refresh Token도 만료 시 재로그인 필요. 개발자는 **세션 만료 처리**만 하면 됩니다: `supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') redirect('/login'); })`.

---

### Q6-2: XSS/CSRF

**Q: SQL Injection 방어는?**
A: **Supabase 클라이언트**가 자동으로 방어합니다. Supabase는 **Prepared Statements** (매개변수화된 쿼리)를 사용하여 SQL Injection 불가능합니다. 예: `supabase.from('passages').select('*').eq('user_id', userId)` → 내부적으로 `WHERE user_id = $1` (안전). **절대 문자열 연결로 쿼리 작성 금지**: `WHERE user_id = '${userId}'` (위험!).

**Q: CORS 설정은 어떻게 했나요?**
A: **Next.js는 기본적으로 CORS 제한 없음** (동일 도메인). Supabase API는 `NEXT_PUBLIC_SUPABASE_URL` 도메인에서만 요청 허용하도록 설정 가능하지만, 현재는 **모든 도메인 허용** (Supabase Anon Key는 RLS로 보호되므로 안전). 향후 프로덕션 도메인만 허용하도록 제한 가능: Supabase Dashboard → Settings → API → CORS Allowed Origins.

---

## 섹션 7: AI/LLM 통합

### Q7-1: 프롬프트 엔지니어링

**Q: Few-shot learning을 사용하지 않은 이유는?**
A: **Zero-shot으로 충분**했습니다. Few-shot learning (예시 제공)은 품질을 높이지만: 1) **토큰 소비 증가** (예시 3개 = ~1000 tokens 추가), 2) **프롬프트 복잡도 증가**, 3) **GPT-4o-mini는 지시 따르기 능력 우수**. 실험 결과 Zero-shot으로도 85-90% 품질 달성했으므로 Few-shot 불필요했습니다. 향후 품질 개선 필요 시 Few-shot 도입 고려 중입니다.

**Q: Temperature 값을 어떻게 결정했나요?**
A: **0.7 사용**합니다. Temperature: 0 (결정적, 반복 가능) ~ 1 (창의적, 다양함). 선택 이유: 1) **0.7은 균형**: 일관성 + 다양성, 2) **객관식 문제**는 창의성보다 정확성 중요하므로 낮은 편, 3) **실험 결과**: 0.5 (너무 반복적), 1.0 (가끔 이상한 문제), 0.7 (적절). GPT-4o-mini는 temperature 고정(1.0)이지만, 다른 모델은 조절 가능합니다.

**Q: 프롬프트 버전 관리는 어떻게 하나요?**
A: **현재는 Git으로 관리**합니다 (`lib/ai/prompts.ts`). 향후 개선: 1) **DB에 프롬프트 저장**: 버전별로 저장하여 A/B 테스트 가능, 2) **프롬프트 메트릭**: 각 버전의 성공률, 평균 품질 추적, 3) **동적 프롬프트**: 사용자 피드백 기반 자동 개선. 현재는 변경 빈도가 낮아 Git으로 충분합니다.

---

### Q7-2: Structured Output

**Q: JSON mode를 사용해도 왜 실패하나요?**
A: **JSON mode는 100% 보장 안 함**입니다. 이유: 1) **모델 한계**: GPT-4o-mini도 가끔 스키마 위반, 2) **복잡한 스키마**: 필드가 많을수록 실패율 증가, 3) **프롬프트 모호성**: 지시가 불명확하면 잘못된 JSON 생성. 해결: 1) **명확한 프롬프트**: CRITICAL RULES로 강조, 2) **Zod 검증**: 런타임 체크, 3) **재시도**: 실패 시 사용자가 다시 시도. **AI는 확률적**이므로 100% 보장 불가능합니다.

**Q: Zod 대신 TypeScript 타입 가드를 쓰면 안 되나요?**
A: **가능하지만 비효율적**입니다. 타입 가드: `function isQuestion(obj: any): obj is Question { return typeof obj.type === 'string' && ... }` → 모든 필드 수동 체크 필요 (코드 길어짐). Zod: 스키마 한 번 정의로 검증 + 타입 추론 + 명확한 에러 메시지. **Zod가 압도적으로 생산적**입니다.

**Q: 실패율을 더 낮출 방법은?**
A: 네 가지 방법: 1) **모델 업그레이드**: GPT-4o-mini → GPT-4o (실패율 5% → 2%, 비용 20배 증가 trade-off). 2) **프롬프트 개선**: 실패 사례 분석하여 프롬프트 업데이트. 3) **스키마 단순화**: 필수 필드만 요구, 선택 필드는 nullable. 4) **Retry with Exponential Backoff**: 실패 시 자동 재시도 (최대 3회). 현재 5% 실패율은 **관리 가능한 수준**입니다.

---

### Q7-3: 근거 추출

**Q: AI가 근거를 조작하거나 없는 내용을 만들어내면 어떻게 하나요?**
A: **교사가 최종 검증**합니다. AI Hallucination (환각) 방지: 1) **프롬프트 지시**: "MUST quote EXACTLY from passage", 2) **검증 상태**: AI가 자체 검토하여 NEEDS_FIX 표시, 3) **교사 검토**: 근거를 지문과 대조 확인. 완벽한 방지는 불가능하므로 **Teacher Control 원칙**이 중요합니다. AI는 도구일 뿐, 최종 판단은 교사의 몫입니다.

**Q: 지문에서 자동으로 하이라이트하는 기능은 없나요?**
A: **향후 개선 예정**입니다. 구현 방법: 1) **문자열 매칭**: 근거 텍스트를 지문에서 검색하여 하이라이트, 2) **Fuzzy Matching**: 정확히 일치하지 않아도 유사한 부분 찾기, 3) **UI**: 지문 뷰어에서 근거 부분을 노란색 배경으로 표시. 기술적으로 간단하지만 MVP에서는 우선순위가 낮아 제외했습니다.

**Q: 근거의 정확도는 어떻게 측정하나요?**
A: **수동 샘플링**으로 측정했습니다. 방법: 1) 100개 문제를 무작위 선택, 2) 각 근거를 지문과 대조, 3) 정확도 = 정확한 근거 / 전체 근거. 결과: **85-90% 정확**. 자동화 방법 (향후): 1) **Semantic Similarity**: 근거와 지문의 임베딩 유사도 계산, 2) **LLM as Judge**: 다른 LLM이 근거 정확도 평가. 현재는 수동 샘플링으로 충분합니다.

---

### Q7-4: GPT-4o-mini 선택

**Q: 사용자가 GPT-4를 선택할 수 있게 하면 어떨까요?**
A: **좋은 아이디어**입니다. 구현 방법: 1) **설정 옵션**: "모델 선택" 드롭다운 (GPT-4o-mini, GPT-4o, GPT-4), 2) **비용 안내**: 각 모델의 예상 비용 표시, 3) **유료 플랜**: 무료 사용자는 GPT-4o-mini만, 유료 사용자는 모든 모델 선택 가능. Trade-off: **개발 복잡도 증가** vs **사용자 선택권**. MVP 단계에서는 단순함을 우선했지만, 향후 도입 고려 중입니다.

**Q: Claude나 Gemini는 고려하지 않았나요?**
A: 고려했지만 **OpenAI 선택**. 이유: 1) **Structured Output**: OpenAI가 가장 안정적, 2) **비용**: GPT-4o-mini가 가장 저렴, 3) **API 성숙도**: OpenAI가 가장 오래되고 안정적. 향후 **Multi-Model 지원** 고려: 사용자가 모델 선택 가능하게 하고, 각 모델의 장점 활용 (Claude: 긴 지문, GPT-4o-mini: 비용 효율).

**Q: 모델을 교체하기 쉽게 설계했나요?**
A: **예, 추상화**했습니다. `lib/ai/openai.ts`에서 `createOpenAIResponse()` 함수로 API 호출을 캡슐화했습니다. 모델 교체 시: 1) 함수 내부만 수정 (Claude API, Gemini API로 변경), 2) 프롬프트는 동일하게 유지 가능, 3) 검증 파이프라인도 동일. **의존성 역전 원칙** 적용으로 유연성 확보했습니다.

---

### Q7-5: AI 응답 검증

**Q: 이 자체 검증의 정확도는?**
A: **약 70-80%**입니다. AI가 NEEDS_FIX로 표시한 문제 중: 1) **실제 문제 있음**: 60-70%, 2) **과도하게 엄격**: 20-30% (좋은 문제도 NEEDS_FIX), 3) **놓친 문제**: 10-20% (PASS인데 실제로는 문제 있음). 완벽하지 않지만 **교사의 검토 우선순위**를 정하는 데 유용합니다. NEEDS_FIX 문제부터 검토하면 시간 절약.

**Q: 별도의 Validation Agent로 분리하는 것은 고려했나요?**
A: **향후 개선 예정**입니다. Multi-Agent 구조: 1) **Question Generation Agent**: 문제 생성만 담당, 2) **Validation Agent**: 생성된 문제를 별도로 검증, 3) **Evidence Extraction Agent**: 근거 추출 전문. 장점: 각 Agent가 전문화되어 품질 향상. 단점: 응답 시간 2배 증가, 비용 증가. **품질 vs 속도** trade-off입니다.

**Q: NEEDS_FIX 문제를 자동으로 수정하는 기능은?**
A: **향후 개선 예정**입니다. 구현 방법: 1) **Refinement Agent**: NEEDS_FIX 문제 + validation_note를 받아 자동 수정, 2) **Iterative Refinement**: 수정 → 재검증 → 필요 시 재수정 (최대 3회), 3) **사용자 선택**: "자동 수정" 버튼 제공. 현재는 **교사가 직접 편집**하거나 **재생성**하는 방식입니다. 자동 수정은 품질 보장이 어려워 신중히 접근 중입니다.

---

## 섹션 8: TypeScript 및 타입 안전성

### Q8-1: Zod 타입 추론

**Q: Zod가 없다면 어떻게 구현했을까요?**
A: **수동 타입 가드 + 검증 함수**로 구현했을 것입니다. 예:
```typescript
interface Question {
  type: string;
  question_text: string;
  options: [string, string, string, string];
}

function validateQuestion(obj: any): obj is Question {
  return (
    typeof obj.type === 'string' &&
    typeof obj.question_text === 'string' &&
    Array.isArray(obj.options) &&
    obj.options.length === 4 &&
    obj.options.every((o: any) => typeof o === 'string')
  );
}
```
문제: 1) **코드 중복** (타입 + 검증 로직), 2) **유지보수 어려움** (타입 변경 시 검증 로직도 수정), 3) **에러 메시지 부족**. Zod는 이 모든 문제를 해결합니다.

**Q: TypeScript의 `as` 대신 Zod를 쓰는 이유는?**
A: **`as`는 타입 단언**으로, 런타임 검증 없이 "이 값은 이 타입이다"라고 강제합니다. 위험: 실제로 타입이 맞지 않아도 컴파일러가 믿어버림 → **런타임 에러**. Zod는 **실제로 검증**하여 타입이 맞는지 확인합니다. 원칙: **`as` 사용 최소화**, 외부 데이터는 **반드시 Zod 검증**.

---

## 섹션 9: 성능 최적화

### Q9-1: Server Components 성능

**Q: Server Components의 단점은?**
A: 세 가지 단점: 1) **인터랙션 제한**: useState, useEffect 사용 불가 → Client Component 분리 필요, 2) **서버 부하**: 모든 렌더링이 서버에서 실행 → 서버 리소스 소비, 3) **학습 곡선**: 언제 Server/Client 구분할지 헷갈림. 하지만 **성능 이점**(번들 크기 감소, 초기 로딩 속도)이 단점보다 큽니다.

**Q: 모든 컴포넌트를 Server Component로 만들 수 있나요?**
A: **아니요**. 인터랙션이 필요한 컴포넌트는 Client Component여야 합니다. 예: 폼 입력, 버튼 클릭, 애니메이션, 실시간 업데이트. 원칙: **기본은 Server**, 필요한 경우만 `'use client'`. 실무에서는 **70-80% Server, 20-30% Client** 비율이 일반적입니다.

---

### Q9-2: 이미지 최적화

**Q: 이미지 최적화는 어떻게 했나요?**
A: **현재 프로젝트는 이미지 거의 없음**입니다 (텍스트 중심). 향후 이미지 추가 시: 1) **Next.js Image 컴포넌트**: 자동 WebP 변환, lazy loading, 2) **Vercel Image Optimization**: 자동 리사이징, CDN 캐싱, 3) **적절한 크기**: 필요한 크기만 로드 (썸네일 vs 원본). Next.js Image는 **자동으로 최적화**하므로 별도 작업 불필요합니다.

---

## 섹션 10: 배포 및 DevOps

### Q10-1: Vercel CI/CD

**Q: GitHub Actions와의 차이는?**
A: **Vercel**: Next.js에 특화, 자동 설정, 간편함. **GitHub Actions**: 범용적, 커스터마이징 자유로움, 복잡한 워크플로우 가능. 선택 기준: **Next.js 프로젝트는 Vercel**, 복잡한 CI/CD (테스트, 린트, 다중 환경)는 GitHub Actions. 이 프로젝트는 **단순한 배포**만 필요하므로 Vercel로 충분합니다.

**Q: 빌드 실패 시 어떻게 처리하나요?**
A: **Vercel이 자동 처리**합니다. 1) 빌드 실패 시 **이전 버전 유지** (배포 안 됨), 2) GitHub 커밋에 **빌드 실패 상태** 표시, 3) **이메일 알림** (설정 가능), 4) **로그 확인**: Vercel 대시보드에서 에러 로그 확인. 개발자는 로그 보고 수정 후 재푸시하면 됩니다.

**Q: 배포 시 다운타임은?**
A: **Zero-downtime**입니다. Vercel은 **Blue-Green Deployment** 방식: 1) 새 버전 빌드 (백그라운드), 2) 빌드 완료 후 트래픽 전환 (즉시), 3) 이전 버전 유지 (롤백 가능). 사용자는 배포 중에도 **서비스 중단 없이** 이용 가능합니다.

---

### Q10-2: 환경 변수

**Q: 환경 변수가 노출되면 어떻게 하나요?**
A: **즉시 재발급**합니다. 1) **Supabase**: Dashboard에서 Anon Key 재생성, 2) **OpenAI**: API Key 삭제 후 새로 발급, 3) **Vercel**: 환경 변수 업데이트 후 재배포. 예방: 1) **`.env.local`을 절대 커밋 안 함** (`.gitignore`), 2) **`NEXT_PUBLIC_*`만 클라이언트 노출**, 3) **정기적 키 로테이션** (3-6개월).

**Q: Vault나 Secrets Manager는 고려하지 않았나요?**
A: **MVP 단계에서는 불필요**합니다. Vault/Secrets Manager는 **대규모 팀, 다수의 시크릿**에 적합합니다. 이 프로젝트는 시크릿 3-4개뿐이고, Vercel이 **암호화 저장**하므로 충분히 안전합니다. 향후 팀 규모 확대 시 AWS Secrets Manager나 HashiCorp Vault 도입 고려 중입니다.

---

## 섹션 11: 코드 품질 및 유지보수성

### Q11-1: 프로젝트 구조

**Q: 프로젝트 구조 설계 원칙은?**
A: 세 가지 원칙: 1) **도메인별 분리**: auth, passages, questions 폴더로 관심사 분리, 2) **계층별 분리**: UI(components) ← 로직(hooks) ← 데이터(lib), 3) **재사용성**: shared, ui 폴더로 공통 컴포넌트 추출. 이렇게 하면 **코드 찾기 쉽고**, **변경 영향 최소화**, **테스트 용이**합니다.

---

## 섹션 12: 기본 CS 지식

### Q12-1: HTTP 메서드

**Q: 멱등성이 왜 중요한가요?**
A: **멱등성(Idempotency)**: 동일한 요청을 여러 번 보내도 결과가 같음. 중요한 이유: 1) **네트워크 재시도**: 요청 실패 시 안전하게 재시도 가능, 2) **사용자 실수**: "저장" 버튼 여러 번 클릭해도 중복 생성 안 됨, 3) **분산 시스템**: 메시지 중복 전송 시에도 안전. 멱등성 있음: GET, PUT, DELETE. 멱등성 없음: POST (매번 새 리소스 생성).

**Q: POST vs PUT 차이는?**
A: **POST**: 새 리소스 **생성**, 서버가 ID 할당, 멱등성 없음. 예: `POST /api/passages` → 매번 새 지문 생성. **PUT**: 리소스 **전체 교체**, 클라이언트가 ID 지정, 멱등성 있음. 예: `PUT /api/passages/123` → 항상 동일한 지문 교체. 실무에서는 **POST (생성), PATCH (부분 수정)**을 주로 사용합니다.

---

### Q12-2: Promise/async-await

**Q: Promise와 async/await의 내부 작동 원리는?**
A: **Promise**: 비동기 작업의 **상태 머신**입니다. 상태: Pending (대기) → Fulfilled (성공) / Rejected (실패). **async/await**: Promise를 **동기 코드처럼** 작성하는 문법 설탕입니다. 내부적으로 **Generator + Promise**로 변환됩니다. `await`는 Promise가 resolve될 때까지 **함수 실행을 일시 중지**하고, Event Loop에 제어권 반환합니다.

---

### Q12-3: JWT vs Session Cookie

**Q: JWT의 장단점은?**
A: **장점**: 1) **Stateless**: 서버에 세션 저장 불필요 → 수평 확장 용이, 2) **Self-contained**: 토큰에 사용자 정보 포함 → DB 조회 불필요, 3) **Cross-domain**: 다른 도메인 간 인증 가능. **단점**: 1) **토큰 무효화 어려움**: 발급 후 만료까지 유효, 2) **토큰 크기**: 쿠키보다 큼 (수백 bytes), 3) **보안**: XSS 공격 시 토큰 탈취 위험. Trade-off: 확장성 vs 제어권.

---

## 섹션 13: 실무 경험 기반 질문

### Q13-1: 가장 어려웠던 문제

**Q: 그 문제를 해결하는 데 얼마나 걸렸나요?**
A: **AI 출력 불확실성 문제**는 약 **3-4일** 소요되었습니다. 1일차: 문제 인식 (실패율 10%), 2일차: 프롬프트 개선 (실패율 7%), 3일차: Zod 검증 강화 (실패율 5%), 4일차: 에러 처리 개선. 교훈: **AI 프로젝트는 예측 불가능**하므로, 충분한 버퍼 시간 확보 필요.

---

### Q13-2: 코드 리뷰

**Q: 코드 리뷰에서 가장 중요한 것은?**
A: **일관성**과 **명확성**입니다. 체크리스트: 1) **네이밍**: 변수/함수명이 의도를 명확히 표현하는가? 2) **중복 코드**: 재사용 가능한 부분은 함수로 추출했는가? 3) **에러 처리**: 모든 에러 케이스를 처리했는가? 4) **타입 안전성**: any 사용을 최소화했는가? 5) **주석**: 복잡한 로직에 설명이 있는가? 코드 리뷰는 **버그 발견**보다 **지식 공유**와 **코드 품질 향상**이 목적입니다.

---

## 섹션 14: 시스템 설계 질문

### Q14-1: 100만 사용자 확장

**Q: 데이터베이스 샤딩 전략은?**
A: **사용자 ID 기반 샤딩**을 사용할 것입니다. 방법: 1) **Hash Sharding**: `user_id % N` → N개 샤드로 분산, 2) **Range Sharding**: user_id 범위별로 샤드 분리 (1-100만: Shard1, 100만-200만: Shard2). 장점: 쿼리가 단일 샤드에서 실행 (빠름). 단점: 샤드 간 JOIN 불가능. 이 프로젝트는 **사용자별 데이터 격리**가 명확하므로 샤딩에 적합합니다.

---

### Q14-2: 실시간 협업

**Q: Conflict Resolution은 어떻게 하나요?**
A: **Operational Transformation (OT)** 또는 **CRDT**를 사용합니다. 예: 두 사용자가 동시에 문제 편집 시: 1) **Last Write Wins**: 마지막 저장이 이김 (간단하지만 데이터 손실), 2) **OT**: 작업 순서를 조정하여 병합 (Google Docs 방식), 3) **CRDT**: 수학적으로 병합 가능한 데이터 구조. 이 프로젝트는 **교사 1명이 주로 사용**하므로 충돌 가능성 낮아 Last Write Wins로 충분합니다.

---

## 섹션 15: 트렌드 및 최신 기술

### Q15-1: React 19

**Q: Server Actions를 사용하지 않은 이유는?**
A: **API Routes로 충분**했습니다. Server Actions는 **폼 제출을 간소화**하지만: 1) 이 프로젝트는 폼이 간단함, 2) API Routes가 더 명시적 (RESTful), 3) Server Actions는 아직 **실험적 기능** (안정성 우려). 향후 폼이 복잡해지면 Server Actions 도입 고려 중입니다.

---

### Q15-2: AI Agent Framework

**Q: LangChain vs AutoGPT 차이는?**
A: **LangChain**: AI 애플리케이션 **개발 프레임워크**. 프롬프트 체이닝, 메모리, 도구 통합 제공. 개발자가 워크플로우 설계. **AutoGPT**: **자율 에이전트**. 목표만 주면 스스로 계획 수립 및 실행. 차이: LangChain은 **제어 가능**, AutoGPT는 **자율적**. 이 프로젝트에 적합한 것은 **LangChain** (명확한 워크플로우).

---

### Q15-3: RAG

**Q: Vector Database는 어떤 것을 사용하나요?**
A: **Pinecone** 또는 **Supabase pgvector**를 고려 중입니다. **Pinecone**: 전문 Vector DB, 빠름, 관리형. **pgvector**: PostgreSQL 확장, 기존 DB와 통합 용이, 비용 절감. 선택 기준: **규모 작으면 pgvector**, 대규모 검색 필요 시 Pinecone. 이 프로젝트는 pgvector로 충분할 것 같습니다.

---

## 마무리

이 문서는 **모든 꼬리 질문에 대한 상세 답변**을 제공합니다. 

**학습 방법**:
1. 각 질문을 소리 내어 읽고 답변 연습
2. 모르는 개념은 공식 문서 참고
3. 실제 프로젝트 코드와 연결하여 이해
4. 모의 면접 시 이 답변을 기반으로 자신의 언어로 설명

**핵심 원칙**:
- **구체적으로**: 숫자, 예시, 코드 포함
- **Trade-off 언급**: 모든 선택에는 장단점 존재
- **겸손하게**: 모르는 것은 솔직히 인정
- **열정 표현**: 기술에 대한 관심과 성장 의지

**행운을 빕니다! 🚀**

