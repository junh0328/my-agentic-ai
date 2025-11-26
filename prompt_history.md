# Prompt History - AI 감정 분석 프로젝트

## 대화 1: 프로젝트 계획 수립

### 사용자 질문
> prompt.md와 같이 모델에 입력할 기본 프롬프트가 있다고 했을 때, 어떤식으로 모델을 연결하여 사용할 수 있는지 계획을 세워줘. 나는 한 번도 모델을 연결해본적이 없는 개발자야. 모델 연결 -> 프롬프트 삽입 -> 실제 화면에서 확인 구조로 사용할 수 있는 작은 프로젝트를 만들어보고 싶어.

### Claude 응답 요약
- 사용자에게 선택지 제공: AI 모델(Claude/OpenAI), 프론트엔드(Next.js/Vite), 구조 복잡도
- 사용자 선택: Claude API, Next.js, 확장 가능한 구조, @anthropic-ai/sdk
- 5단계 구현 계획 수립 (Plan 파일 생성)

---

## 대화 2: 학습용 문서 생성 요청

### 사용자 질문
> 우선 계획을 단계 별로 실행하기 위한 learning-agent-prompt-course.md 파일을 만들어줘

### Claude 응답 요약
- `learning-agent-prompt-course.md` 파일 생성
- 5개 Phase로 구성된 상세 학습 가이드 작성
  - Phase 1: 기반 설정
  - Phase 2: 타입 및 에러 처리
  - Phase 3: AI 통합
  - Phase 4: API 엔드포인트
  - Phase 5: 프론트엔드

---

## 대화 3: shadcn/ui 통합 요청

### 사용자 질문
> 좋아. 하나만 더 추가 혹은 수정하자. course에 shadcn/ui을 바탕으로 구현한다고 수정할 수 있어? 만약 css 또는 css를 위한 라이브러리에 대한 지침이 없다면 추가하고, 있다면 수정해줘. 이후 기존 문맥에 벗어나게 작성되진 않았는지 평가해줘.

### Claude 응답 요약
- learning-agent-prompt-course.md에 shadcn/ui 섹션 추가
- 필요 패키지: `class-variance-authority`, `clsx`, `tailwind-merge`
- shadcn/ui 초기화 및 컴포넌트 설치 방법 추가
- 기존 Tailwind CSS 컴포넌트를 shadcn/ui 컴포넌트로 대체

---

## 대화 4: figma-source 통합 요청

### 사용자 질문
> 추가된 figma-source 패키지는 figma-make, shadcn/ui를 통해 만들어진 '뷰 용 컴포넌트'야. 해당 컴포넌트 및 구조를 활용할 수 있도록, figma-source 폴더를 분석한 후 learning-agent-prompt-course.md를 수정해줘

### Claude 응답 요약
- figma-source 폴더 분석 수행
  - `ReviewAnalyzer.tsx`: 2컬럼 그리드 레이아웃, preset 버튼
  - `ScoreMeter.tsx`: motion 애니메이션 점수 표시
  - `SentimentBadge.tsx`: lucide-react 아이콘 활용
  - `globals.css`: CSS 변수 기반 디자인 토큰
- learning-agent-prompt-course.md에 figma-source 활용 섹션 추가
- 컴포넌트 복사 및 적용 방법 문서화

---

## 대화 5: 실제 구현 요청

### 사용자 질문
> 좋아 우리가 작성한 문서를 바탕으로 실제 구현을 단계별로 진행해줘

### Claude 응답 요약

**Phase 1 구현:**
- 패키지 설치: `@anthropic-ai/sdk`, `zod`, `motion`, `lucide-react`, `clsx`, `tailwind-merge`
- 환경 변수: `.env.local`, `.env.example` 생성
- 설정 파일: `src/config/env.ts`, `src/config/constants.ts`

**Phase 2 구현:**
- 타입 정의: `src/types/sentiment.ts`, `src/types/api.ts`
- 에러 처리: `src/lib/errors/api-error.ts`, `src/lib/errors/handlers.ts`

**Phase 3 구현:**
- AI Provider: `src/lib/ai/providers/claude.ts`
- 서비스: `src/lib/services/sentiment.ts`

**Phase 4 구현:**
- API 라우트: `src/app/api/sentiment/route.ts`

**Phase 5 구현:**
- UI 컴포넌트 복사: `src/components/ui/` (button, card, textarea)
- Sentiment 컴포넌트:
  - `src/components/sentiment/SentimentBadge.tsx`
  - `src/components/sentiment/ScoreMeter.tsx`
  - `src/components/sentiment/ReviewForm.tsx`
  - `src/components/sentiment/SentimentResult.tsx`
- 메인 페이지: `src/app/page.tsx`
- React Hook: `src/hooks/useSentimentAnalysis.ts`

**테스트 및 검증:**
- figma-source의 버전 번호 포함 import 문 수정 (예: `@radix-ui/react-slot@1.1.2` → `@radix-ui/react-slot`)
- tsconfig.json에서 figma-source 폴더 exclude 처리
- ZodError 타입 수정 (`error.errors` → `error.issues`)
- JSON 파싱 에러 핸들링 추가
- 빌드 성공 확인

---

## 대화 6: 대화 내역 정리 요청

### 사용자 질문
> 좋아 지금까지의 대화 내역을 prompt_hitstory.md에 정리해줘.
> - 내가 물어본 내용은 원본을 그대로 적어줘
> - 너의 응답은 핵심 내용, 요약본으로 정리해서 적어줘

### Claude 응답 요약
- `prompt_history.md` 문서 생성
- 대화 1~5의 내용을 사용자 질문 원본 + 응답 요약 형식으로 정리

---

## 대화 7: 무료 AI API 대안 질문

### 사용자 질문
> claude code api key가 유료인데, 무료인 에이전트가 있는지 확인해줄래?

### Claude 응답 요약
- 웹 검색을 통해 무료 AI API 대안 조사
- **Google Gemini API 추천** (무료 티어 제공)
  - Gemini 2.5 Flash: 분당 15 요청, 하루 150만 토큰
  - Gemini 2.5 Pro: 분당 5 요청, 하루 25 요청
  - 상업적 사용 허용
- 기타 대안: DeepSeek, Hugging Face, Mistral AI, Duck.ai
- 로컬 실행 옵션: Ollama, Nut Studio

---

## 대화 8: Gemini Provider 구현 요청

### 사용자 질문
> 응

### Claude 응답 요약

**Gemini Provider 추가 구현:**

1. **패키지 설치:**
   ```bash
   npm install @google/generative-ai
   ```

2. **새 파일 생성:**
   - `src/lib/ai/providers/gemini.ts` - Gemini API 래퍼

3. **환경 변수 업데이트 (`src/config/env.ts`):**
   - `AI_PROVIDER`: `gemini` 또는 `claude` 선택 (기본값: gemini)
   - `GOOGLE_API_KEY`: Google API 키
   - `GEMINI_MODEL`: 모델 선택 (기본값: gemini-2.0-flash)

4. **서비스 수정 (`src/lib/services/sentiment.ts`):**
   - Provider 선택 로직 추가 (환경 변수 기반)

5. **에러 코드 추가:**
   - `INVALID_JSON`, `CONFIGURATION_ERROR`

6. **환경 변수 파일 업데이트 (`.env.local`, `.env.example`):**
   ```env
   AI_PROVIDER=gemini
   GOOGLE_API_KEY=your_google_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   ```

**테스트 결과:**
- 영어 리뷰: `{"sentiment":"positive","score":0.9,"confidence":1,...}`
- 한국어 리뷰: `{"sentiment":"positive","score":0.95,"confidence":0.98,...}`
- Gemini 무료 티어로 정상 작동 확인

---

## 대화 9: 대화 내역 업데이트 요청

### 사용자 질문
> 지금 대화 내역 또한 prompt_history.md에 업데이트해줘

### Claude 응답 요약
- 대화 7~9 내용을 prompt_history.md에 추가
- 프로젝트 구조 및 사용 방법 업데이트

---

## 최종 프로젝트 구조

```
src/
├── app/
│   ├── api/sentiment/route.ts    # API 엔드포인트
│   ├── layout.tsx
│   └── page.tsx                   # 메인 페이지
├── components/
│   ├── sentiment/                 # 감정 분석 컴포넌트
│   │   ├── ReviewForm.tsx
│   │   ├── ScoreMeter.tsx
│   │   ├── SentimentBadge.tsx
│   │   ├── SentimentResult.tsx
│   │   └── index.ts
│   └── ui/                        # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── textarea.tsx
│       └── utils.ts
├── config/
│   ├── constants.ts               # SYSTEM_PROMPT
│   └── env.ts                     # 환경 변수 검증 (AI_PROVIDER 선택)
├── hooks/
│   ├── index.ts
│   └── useSentimentAnalysis.ts    # API 호출 훅
├── lib/
│   ├── ai/
│   │   ├── providers/
│   │   │   ├── claude.ts          # Claude API 래퍼
│   │   │   ├── gemini.ts          # Gemini API 래퍼 (무료)
│   │   │   └── index.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── api-error.ts
│   │   ├── handlers.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── sentiment.ts           # 비즈니스 로직 (Provider 선택)
│   │   └── index.ts
│   └── utils.ts
├── types/
│   ├── api.ts
│   ├── sentiment.ts
│   └── index.ts
└── utils/
    ├── validation.ts              # Zod 검증
    └── index.ts
```

## 사용 방법

### Gemini 사용 (무료, 권장)

1. [Google AI Studio](https://ai.google.dev)에서 API 키 발급

2. `.env.local` 설정:
```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. http://localhost:3000 접속

### Claude 사용 (유료)

1. [Anthropic Console](https://console.anthropic.com)에서 API 키 발급

2. `.env.local` 설정:
```bash
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...your-key...
CLAUDE_MODEL=claude-sonnet-4-20250514
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. http://localhost:3000 접속

---

## 대화 10: 커밋 분리 전략 질문

### 사용자 질문
> 지금까지의 작업 내역을 커밋을 나눠 올리려고 하는데, 어떻게 나누면 좋을까? - ui 설정 - 기능 구현 - .. 등이 떠오르는데 어떻게 나누면 좋을지 의견줄래?

### Claude 응답 요약
- 6개의 커밋으로 분리 제안:
  1. `chore: add figma-source reference components` - Figma Make 컴포넌트
  2. `chore: add dependencies and project configuration` - 패키지 및 설정
  3. `feat: add core infrastructure (types, errors, config)` - 타입, 에러, 설정
  4. `feat: add AI providers and sentiment service` - AI Provider, 서비스
  5. `feat: add frontend components and UI` - 프론트엔드 컴포넌트
  6. `docs: add project documentation` - 문서화
- 사용자가 figma-source를 함께 커밋하기로 선택
- 6개 커밋 순차 실행 완료

---

## 대화 11: 블로그 글 작성 요청

### 사용자 질문
> 우리의 지금까지의 작업 내용을 기술 블로그에 올리려고 해. '프롬프트 엔지니어링을 통한 감정평가 agent ai 구현하기'라는 제목으로 글을 작성하고 싶어.
> - 내용은 prompt_history.md를 기반으로 내가 물어본 내용은 원본을 그대로 적어주고, 응답은 핵심 내용 요약본으로 정리해줘
> - figma-source는 figma-make를 통해 만들었다는 내용을 추가해줘
> - 메인 프롬프트는 prompt.md에서 가져오기
> - 대상 독자: 웹 개발자, 웹 디자이너, 처음 프롬프트 엔지니어링을 시도해보려는 분, LLM API를 처음 연동해보시는 분
> - 좀 더 격식체로 작성해줘

### Claude 응답 요약
- 사용자에게 추가 질문:
  - 분량: 간결하게 (5-7분)
  - 코드: 핵심 코드만 + GitHub 링크
  - 스크린샷: 포함 (자리 표시)
- `blog-post.md` 파일 생성
- 구조: 서론 → 프로젝트 개요 → 프롬프트 설계 → Claude Code 대화 과정 → Figma Make UI → 핵심 구현 코드 → Gemini 테스트 → 마무리

---

## 대화 12: 블로그 글 형식 수정 요청

### 사용자 질문
> 질문과 응답 요약을 prompt_history.md의 형식으로 수정해줄래?

### Claude 응답 요약
- blog-post.md의 "Claude Code와의 대화 과정" 섹션을 prompt_history.md 형식으로 수정
- `#### 사용자 질문` + `#### Claude 응답 요약` 형식 적용
- 각 대화 사이에 구분선(`---`) 추가

---

## 대화 13: 사용자 질문 형식 변경 (코드 블록)

### 사용자 질문
> 사용자 질문을 인용문(>) 형식 대신 ``` ``` 내부에 넣어줘

### Claude 응답 요약
- 모든 사용자 질문을 인용문(>)에서 코드 블록(```)으로 변경

---

## 대화 14: 사용자 질문 형식 변경 (볼드체)

### 사용자 질문
> ``` ```대신 ** **로바꿔줘

### Claude 응답 요약
- 모든 사용자 질문을 코드 블록에서 볼드체(**)로 변경

---

## 대화 15: 빠른 시작 섹션 추가 요청

### 사용자 질문
> .env.example을 바탕으로 api key를 넣어줘야 한다는 내용을 Claude Code와의 대화 과정 전에 삽입해줘(빠르게 실행해보고 싶은 사람을 위한 내용). 만약 저 위치보다 나은 위치가 있다면 말해줘.

### Claude 응답 요약
- "프로젝트 개요" 바로 뒤에 "빠른 시작" 섹션 추가 제안 (더 적절한 위치)
- 빠른 시작 섹션 내용:
  1. 저장소 클론 및 의존성 설치
  2. 환경 변수 설정 (`.env.example` → `.env.local`)
  3. API 키 발급 링크 (Gemini/Claude)
  4. 개발 서버 실행

---

## 대화 16: 사용자 질문에 큰 따옴표 추가

### 사용자 질문
> 사용자의 질문에 ** ** 사이에 큰 따옴표(" ")를 넣어줘

### Claude 응답 요약
- 모든 사용자 질문을 `**"질문 내용"**` 형식으로 변경

---

## 대화 17: GitHub 푸시 요청

### 사용자 질문
> 작업한 내용을 깃 허브에 올려줘

### Claude 응답 요약
- 스테이징된 변경사항 확인:
  - `README.md` 수정
  - `etc/agentic-ai.gif` 추가 (데모 GIF)
  - `etc/figma_make_code_download.png` 추가
  - `etc/figma_make_default.png` 추가
- 커밋 메시지: `docs: update README with screenshots and demo`
- GitHub 푸시 완료: https://github.com/junh0328/my-agentic-ai
