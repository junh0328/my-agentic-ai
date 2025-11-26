# 프롬프트 엔지니어링으로 리뷰 텍스트 평가 Agent AI 만들기

## 들어가며

이 글은 LLM(Large Language Model)을 처음 활용해보시는 분들을 위해 작성했습니다. 프롬프트 하나로 시작해서 실제 동작하는 감정 분석 웹 애플리케이션을 만들어가는 과정을 공유합니다.

**이런 분들에게 도움이 될 것 같습니다:**

- 웹 개발자, 웹 디자이너로서 AI를 활용해보고 싶은 분
- 처음 프롬프트 엔지니어링을 시도해보려는 분
- LLM API를 처음 연동해보시는 분

## 프로젝트 개요

리뷰 텍스트의 감정을 분석하는 웹 애플리케이션을 구현했습니다. 사용자가 리뷰를 입력하면 AI가 긍정/부정/중립 감정을 판단하고, 점수와 분석 근거를 제공합니다.

**기술 스택:**

- **프론트엔드**: Next.js 16, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Framer Motion
- **AI**: Google Gemini API (무료) / Claude API (유료)
- **도구**: Claude Code, Figma Make

<img src='./etc/agentic-ai.gif' alt="agent ai 사용 결과물">

## 빠른 시작

코드를 먼저 실행해보고 싶은 분들을 위한 간단한 설정 방법입니다.

**1. 저장소 클론 및 의존성 설치**

```bash
git clone https://github.com/junh0328/my-agentic-ai.git
cd my-agentic-ai
npm install
```

**2. 환경 변수 설정**

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성합니다.

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 API 키를 입력합니다:

```env
# Gemini 사용 시 (무료)
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Claude 사용 시 (유료) - AI_PROVIDER=claude로 변경
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- **Gemini API 키**: [Google AI Studio](https://ai.google.dev)에서 무료 발급
- **Claude API 키**: [Anthropic Console](https://console.anthropic.com)에서 발급 (유료)

**3. 개발 서버 실행**

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

### 환경 변수 없이 사용하기 (Vercel 배포 시)

서버에 환경 변수가 설정되지 않은 경우, 웹 페이지에서 직접 API 키를 입력할 수 있습니다.

1. 우측 상단의 **설정 버튼(톱니바퀴)** 클릭
2. AI Provider 선택 (Gemini 무료 / Claude 유료)
3. API 키 입력
4. 모델 선택 후 저장

> **보안 안내**: 입력한 API 키는 브라우저 세션 스토리지에만 저장되며, 탭을 닫으면 자동으로 삭제됩니다.

## 1\. 프롬프트 설계 - 모든 것의 시작

AI 에이전트의 성능은 프롬프트 설계에서 결정됩니다. 다음은 이 프로젝트에서 사용한 시스템 프롬프트입니다.

```
SYSTEM_PROMPT = """
당신은 리뷰 감정 분석 전문가입니다.
리뷰 텍스트를 분석하여 감정을 분류하고 점수를 매겨주세요.

<감정분류>
- positive: 긍정적 감정 (만족, 기쁨, 추천 등)
- negative: 부정적 감정 (불만, 실망, 비추천 등)
- neutral: 중립적 감정 (객관적 서술, 단순 정보 등)
</감정분류>

<점수범위>
감정 점수: -1.0 (매우 부정) ~ 1.0 (매우 긍정)
</점수범위>

<주의사항>
- 반어법, 비꼬는 표현('정말 좋네요' + 부정적 맥락)을 주의깊게 감지해주세요
- 복합 감정이 있는 경우 전체적인 주된 감정을 파악해주세요
- 한국어 완곡 표현을 고려해주세요: '나쁘지 않다'는 긍정적, '그럭저럭'은 보통 만족
- 도메인별 전문용어의 맥락을 파악해주세요 (예: 게임의 '어려움'은 긍정적일 수 있음)
- 비교 표현('~보다 나아요')의 상대적 의미를 고려해주세요
- 텍스트가 너무 짧거나 모호한 경우 confidence를 낮게 설정해주세요
</주의사항>

<출력형식>
결과를 JSON 형식으로 반환해주세요:
{
  "sentiment": "positive|negative|neutral",
  "score": 0.8,
  "confidence": 0.9,
  "reason": "분석 근거"
}
</출력형식>
"""
```

### 프롬프트 설계 포인트

1.  **역할 부여**: "리뷰 감정 분석 전문가"로 명확한 역할 정의
2.  **구조화된 지시**: XML 태그(`<감정분류>`, `<주의사항>`)로 섹션 구분
3.  **엣지 케이스 처리**: 반어법, 완곡 표현, 도메인 용어 등 예외 상황 명시
4.  **출력 형식 고정**: JSON 스키마를 명시하여 파싱 가능한 응답 유도

## 2\. Claude Code와의 대화 과정

이 프로젝트는 Claude Code와의 대화를 통해 단계적으로 구현했습니다. 주요 대화 내용을 공유합니다.

### 대화 1: 프로젝트 계획 수립

#### 사용자 질문

**"prompt.md와 같이 모델에 입력할 기본 프롬프트가 있다고 했을 때, 어떤식으로 모델을 연결하여 사용할 수 있는지 계획을 세워줘. 나는 한 번도 모델을 연결해본적이 없는 개발자야. 모델 연결 -> 프롬프트 삽입 -> 실제 화면에서 확인 구조로 사용할 수 있는 작은 프로젝트를 만들어보고 싶어."**

#### Claude 응답 요약

- 사용자에게 선택지 제공: AI 모델(Claude/OpenAI), 프론트엔드(Next.js/Vite), 구조 복잡도
- 사용자 선택: Claude API, Next.js, 확장 가능한 구조, @anthropic-ai/sdk
- 5단계 구현 계획 수립 (Plan 파일 생성)

### 대화 2: 학습용 문서 생성 요청

#### 사용자 질문

**"우선 계획을 단계 별로 실행하기 위한 learning-agent-prompt-course.md 파일을 만들어줘"**

#### Claude 응답 요약

- `learning-agent-prompt-course.md` 파일 생성
- 5개 Phase로 구성된 상세 학습 가이드 작성
  - Phase 1: 기반 설정
  - Phase 2: 타입 및 에러 처리
  - Phase 3: AI 통합
  - Phase 4: API 엔드포인트
  - Phase 5: 프론트엔드

### 대화 3: shadcn/ui 통합 요청

#### 사용자 질문

**"좋아. 하나만 더 추가 혹은 수정하자. course에 shadcn/ui을 바탕으로 구현한다고 수정할 수 있어? 만약 css 또는 css를 위한 라이브러리에 대한 지침이 없다면 추가하고, 있다면 수정해줘. 이후 기존 문맥에 벗어나게 작성되진 않았는지 평가해줘."**

#### Claude 응답 요약

- learning-agent-prompt-course.md에 shadcn/ui 섹션 추가
- 필요 패키지: `class-variance-authority`, `clsx`, `tailwind-merge`
- shadcn/ui 초기화 및 컴포넌트 설치 방법 추가
- 기존 Tailwind CSS 컴포넌트를 shadcn/ui 컴포넌트로 대체

### 대화 4: figma-source 통합 요청

#### 사용자 질문

**"추가된 figma-source 패키지는 figma-make, shadcn/ui를 통해 만들어진 '뷰 용 컴포넌트'야. 해당 컴포넌트 및 구조를 활용할 수 있도록, figma-source 폴더를 분석한 후 learning-agent-prompt-course.md를 수정해줘"**

#### Claude 응답 요약

- figma-source 폴더 분석 수행
  - `ReviewAnalyzer.tsx`: 2컬럼 그리드 레이아웃, preset 버튼
  - `ScoreMeter.tsx`: motion 애니메이션 점수 표시
  - `SentimentBadge.tsx`: lucide-react 아이콘 활용
  - `globals.css`: CSS 변수 기반 디자인 토큰
- learning-agent-prompt-course.md에 figma-source 활용 섹션 추가
- 컴포넌트 복사 및 적용 방법 문서화

### 대화 5: 실제 구현 요청

#### 사용자 질문

**"좋아 우리가 작성한 문서를 바탕으로 실제 구현을 단계별로 진행해줘"**

#### Claude 응답 요약

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
- Sentiment 컴포넌트: `SentimentBadge.tsx`, `ScoreMeter.tsx`, `ReviewForm.tsx`, `SentimentResult.tsx`
- 메인 페이지: `src/app/page.tsx`
- React Hook: `src/hooks/useSentimentAnalysis.ts`

**테스트 및 검증:**

- figma-source의 버전 번호 포함 import 문 수정
- tsconfig.json에서 figma-source 폴더 exclude 처리
- 빌드 성공 확인

### 대화 6: 무료 AI API 대안 질문

#### 사용자 질문

**"claude code api key가 유료인데, 무료인 에이전트가 있는지 확인해줄래?"**

#### Claude 응답 요약

- 웹 검색을 통해 무료 AI API 대안 조사
- **Google Gemini API 추천** (무료 티어 제공)
  - Gemini 2.5 Flash: 분당 15 요청, 하루 150만 토큰
  - Gemini 2.5 Pro: 분당 5 요청, 하루 25 요청
  - 상업적 사용 허용
- 기타 대안: DeepSeek, Hugging Face, Mistral AI, Duck.ai
- 로컬 실행 옵션: Ollama, Nut Studio

### 대화 7: Gemini Provider 구현

#### 사용자 질문

**"응"**

#### Claude 응답 요약

**Gemini Provider 추가 구현:**

1. **패키지 설치:** `npm install @google/generative-ai`
2. **새 파일 생성:** `src/lib/ai/providers/gemini.ts`
3. **환경 변수 업데이트:**
   - `AI_PROVIDER`: `gemini` 또는 `claude` 선택
   - `GOOGLE_API_KEY`: Google API 키
   - `GEMINI_MODEL`: 모델 선택 (기본값: gemini-2.0-flash)
4. **서비스 수정:** Provider 선택 로직 추가

**테스트 결과:**

- 영어 리뷰: 정상 작동
- 한국어 리뷰: 정상 작동
- Gemini 무료 티어로 성공적으로 동작 확인

## 3\. Figma Make로 UI 구현

UI 컴포넌트는 **Figma Make**를 활용하여 생성했습니다. Figma에서 디자인한 화면을 shadcn/ui 기반의 React 컴포넌트로 자동 변환할 수 있습니다.

<img src='./etc/figma_make_default.png' alt="figma make 화면">

사전 정의한 프롬프트를 그대로 넣어주면서 피그마 컴포넌트 생성을 요청하세요.

```
아래 프롬프트를 사용하여 유저의 작성된 글을 분석하는 리뷰 에이전트를 만들거야. 내용을 바탕으로 사용할 수 있는 웹 페이지를 만들어줘.


SYSTEM_PROMPT = """
당신은 리뷰 감정 분석 전문가입니다.
리뷰 텍스트를 분석하여 감정을 분류하고 점수를 매겨주세요.

<감정분류>
- positive: 긍정적 감정 (만족, 기쁨, 추천 등)
- negative: 부정적 감정 (불만, 실망, 비추천 등)
- neutral: 중립적 감정 (객관적 서술, 단순 정보 등)
</감정분류>

<점수범위>
감정 점수: -1.0 (매우 부정) ~ 1.0 (매우 긍정)
</점수범위>
...
```

생성된 주요 컴포넌트:

- `ReviewAnalyzer.tsx`: 2컬럼 그리드 레이아웃, 프리셋 버튼
- `ScoreMeter.tsx`: Framer Motion 애니메이션 점수 표시
- `SentimentBadge.tsx`: Lucide React 아이콘 활용

이 컴포넌트들을 다운로드 받은 후에 프로젝트에 복사하고, API 연동 로직을 추가하는 방식으로 개발을 진행했습니다.

<img src='./etc/figma_make_code_download.png' alt="figma make 화면">

#### 위의 질문 사항 참고 (대화 4)

**"추가된 figma-source 패키지는 figma-make, shadcn/ui를 통해 만들어진 '뷰 용 컴포넌트'야. 해당 컴포넌트 및 구조를 활용할 수 있도록, figma-source 폴더를 분석한 후 learning-agent-prompt-course.md를 수정해줘"**

## 4\. 핵심 구현 코드

### AI Provider 패턴

여러 AI 서비스를 쉽게 교체할 수 있도록 Provider 패턴을 적용했습니다.

```
// src/lib/ai/types.ts
export interface AIProvider {
  readonly name: string;
  analyze(systemPrompt: string, userPrompt: string): Promise<string>;
}
```

```
// src/lib/services/sentiment.ts
export class SentimentService {
  private ai: AIProvider;

  constructor() {
    this.ai = this.createProvider();
  }

  private createProvider(): AIProvider {
    switch (env.AI_PROVIDER) {
      case 'claude':
        return new ClaudeProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        return new GeminiProvider();
    }
  }
}
```

### API 엔드포인트

```
// src/app/api/sentiment/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = validateSentimentRequest(body);

    const service = new SentimentService();
    const result = await service.analyze(validatedRequest);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleAPIError(error);
  }
}
```

전체 코드는 [GitHub 저장소](https://github.com/junh0328/my-agentic-ai.git)에서 확인하실 수 있습니다.

## 5\. 무료로 테스트하기 (Gemini)

Google Gemini API는 무료 티어를 제공하므로, 비용 부담 없이 테스트할 수 있습니다.

### 설정 방법

1.  [Google AI Studio](https://ai.google.dev)에서 API 키 발급
2.  `.env.local` 파일 생성:
3.  `AI_PROVIDER=gemini GOOGLE_API_KEY=your_api_key_here GEMINI_MODEL=gemini-2.0-flash`
4.  개발 서버 실행:
5.  `npm run dev`
6.  [http://localhost:3000](http://localhost:3000) 접속

### 테스트 결과

한국어 리뷰 테스트:

```
{
  "sentiment": "positive",
  "score": 0.95,
  "confidence": 0.98,
  "reason": "리뷰에서 '빠른 배송', '상품 품질이 정말 좋다'와 같은 긍정적인 표현..."
}
```

## 마무리

### 이번 프로젝트에서 배운 점

1.  **프롬프트 설계의 중요성**: 명확한 역할 부여와 구조화된 지시가 AI 응답 품질을 결정합니다.
2.  **Provider 패턴의 유용성**: 여러 AI 서비스를 쉽게 교체할 수 있는 구조가 유연성을 제공합니다.
3.  **도구 활용**: Claude Code, Figma Make 등의 도구를 활용하면 개발 속도를 크게 높일 수 있습니다.

### 다음 단계

- 분석 히스토리 저장 기능
- 배치 분석 지원
- 다국어 확장

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── config/route.ts        # 환경 변수 상태 확인 API
│   │   └── sentiment/route.ts     # 감정 분석 API
│   └── page.tsx                   # 메인 페이지
├── components/
│   ├── sentiment/                 # 감정 분석 컴포넌트
│   ├── settings/                  # API 키 설정 모달
│   │   └── ApiKeyModal.tsx
│   └── ui/                        # shadcn/ui 컴포넌트
├── lib/
│   ├── ai/
│   │   ├── providers/             # AI Provider (Claude, Gemini)
│   │   └── types.ts               # ClientAIConfig 타입
│   └── services/                  # 비즈니스 로직
└── hooks/
    ├── useApiConfig.ts            # API 키 관리 훅
    └── useSentimentAnalysis.ts    # API 호출 훅
```
