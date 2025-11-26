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
