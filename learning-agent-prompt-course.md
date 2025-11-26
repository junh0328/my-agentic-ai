# AI 모델 연결 학습 코스

> Claude API를 사용한 리뷰 감정 분석 프로젝트를 단계별로 구현하며 학습합니다.

---

## 학습 목표

이 코스를 완료하면 다음을 할 수 있습니다:
- AI 모델 API 연결 원리 이해
- 프롬프트 엔지니어링 기초
- Next.js에서 백엔드/프론트엔드 통합
- 확장 가능한 코드 구조 설계
- shadcn/ui를 활용한 모던 UI 구축

---

## 기술 스택

| 영역 | 기술 | 설명 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | React 풀스택 프레임워크 |
| 언어 | TypeScript | 타입 안전성 |
| AI | @anthropic-ai/sdk | Claude API 공식 SDK |
| 검증 | Zod | 런타임 타입 검증 |
| **UI 라이브러리** | **shadcn/ui** | **Radix UI 기반 컴포넌트 라이브러리** |
| **스타일링** | **Tailwind CSS 4** | **유틸리티 기반 CSS 프레임워크** |
| **애니메이션** | **Motion (Framer Motion)** | **부드러운 UI 전환 효과** |
| **아이콘** | **Lucide React** | **일관된 아이콘 시스템** |

### shadcn/ui란?

shadcn/ui는 Radix UI와 Tailwind CSS를 기반으로 한 재사용 가능한 컴포넌트 모음입니다.

**특징:**
- **복사/붙여넣기 방식**: npm 패키지가 아닌, 코드를 직접 프로젝트에 복사
- **완전한 제어권**: 컴포넌트 코드를 직접 수정 가능
- **접근성 내장**: Radix UI 기반으로 접근성(a11y) 지원
- **Tailwind 통합**: Tailwind CSS와 완벽 호환
- **타입 안전**: TypeScript 완벽 지원

---

## Figma 디자인 소스 활용

이 프로젝트에는 **figma-source** 폴더에 Figma에서 생성된 디자인 컴포넌트가 포함되어 있습니다.

### figma-source 구조

```
figma-source/
└── Review Agent Web Page/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                    # shadcn/ui 컴포넌트 (50개)
    │   │   ├── ReviewAnalyzer.tsx     # 메인 리뷰 분석 UI
    │   │   ├── ScoreMeter.tsx         # 감정 점수 시각화
    │   │   └── SentimentBadge.tsx     # 감정 배지
    │   ├── lib/
    │   │   ├── analyzer.ts            # 모의 분석 로직 (참고용)
    │   │   └── utils.ts               # cn() 유틸리티
    │   └── styles/
    │       └── globals.css            # 디자인 시스템 (CSS 변수)
    └── package.json
```

### 활용 전략

figma-source의 컴포넌트를 **참조**하여 Next.js 프로젝트에 맞게 통합합니다:

| figma-source 파일 | 활용 방법 |
|-------------------|----------|
| `components/ui/*` | shadcn/ui 컴포넌트 그대로 복사하여 사용 |
| `ReviewAnalyzer.tsx` | 레이아웃 및 UX 패턴 참조 → Next.js 페이지로 변환 |
| `ScoreMeter.tsx` | 감정 점수 시각화 컴포넌트 재사용 |
| `SentimentBadge.tsx` | 감정 배지 컴포넌트 재사용 |
| `styles/globals.css` | CSS 변수 및 디자인 토큰 통합 |
| `lib/analyzer.ts` | 타입 정의 참조 (실제 로직은 Claude API로 대체) |

### 핵심 디자인 토큰 (globals.css)

```css
:root {
  /* 색상 */
  --primary: #030213;           /* 진한 보라 - 주요 액션 */
  --secondary: oklch(0.95 0.0058 264.53);  /* 밝은 보라 */
  --destructive: #d4183d;       /* 빨강 - 에러/삭제 */
  --muted-foreground: #717182;  /* 보조 텍스트 */

  /* 반경 */
  --radius: 0.625rem;           /* 10px */

  /* 감정 색상 */
  /* positive: green-100/700 */
  /* negative: red-100/700 */
  /* neutral: slate-100/700 */
}
```

---

## 전체 구조 이해하기

```
[사용자] 리뷰 입력
    ↓
[프론트엔드] React 컴포넌트
    ↓
[API Route] /api/sentiment (서버)
    ↓
[서비스] SentimentService
    ↓
[AI Provider] Claude SDK → Claude API
    ↓
[응답] JSON 결과 표시
```

---

## Phase 1: 기반 설정

### 학습 포인트
- 환경 변수를 사용한 API 키 관리
- Zod를 사용한 런타임 타입 검증
- 설정과 코드 분리의 중요성

### 1.1 패키지 설치

```bash
# 핵심 패키지 설치
npm install @anthropic-ai/sdk zod

# 애니메이션 라이브러리 (figma-source에서 사용)
npm install motion
```

### 1.2 figma-source에서 UI 컴포넌트 복사

figma-source의 컴포넌트를 Next.js 프로젝트로 복사합니다:

```bash
# shadcn/ui 컴포넌트 복사
cp -r figma-source/Review\ Agent\ Web\ Page/src/components/ui src/components/

# 커스텀 컴포넌트 복사
cp figma-source/Review\ Agent\ Web\ Page/src/components/ScoreMeter.tsx src/components/sentiment/
cp figma-source/Review\ Agent\ Web\ Page/src/components/SentimentBadge.tsx src/components/sentiment/

# 유틸리티 함수 복사
cp figma-source/Review\ Agent\ Web\ Page/src/lib/utils.ts src/lib/

# 스타일 통합 (globals.css 내용을 기존 globals.css에 병합)
```

> **참고**: figma-source/Review Agent Web Page/src/styles/globals.css의 CSS 변수를 src/app/globals.css에 병합하세요.

### 1.3 globals.css 통합

`src/app/globals.css`에 figma-source의 디자인 토큰을 추가합니다:

```css
@import "tailwindcss";

/* figma-source/styles/globals.css에서 가져온 디자인 토큰 */
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --primary: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --border: oklch(0.269 0 0);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**왜 이 패키지들인가?**
- `@anthropic-ai/sdk`: Claude API 공식 SDK. 타입 안전성과 에러 처리가 내장됨
- `zod`: 런타임에서 데이터 유효성 검증. 환경 변수가 제대로 설정되었는지 확인
- `motion`: 부드러운 UI 애니메이션. figma-source의 ScoreMeter에서 사용
- **figma-source UI**: Figma에서 디자인된 검증된 컴포넌트. 일관된 디자인 시스템 제공

### 1.4 환경 변수 템플릿 (.env.example)

```env
# Anthropic API 키 (https://console.anthropic.com 에서 발급)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# 사용할 Claude 모델
CLAUDE_MODEL=claude-sonnet-4-20250514

# 최대 토큰 수
MAX_TOKENS=1024
```

### 1.5 실제 환경 변수 (.env.local)

```env
ANTHROPIC_API_KEY=여기에_실제_API_키_입력
CLAUDE_MODEL=claude-sonnet-4-20250514
MAX_TOKENS=1024
```

> **중요**: `.env.local`은 절대 Git에 커밋하지 마세요!

### 1.6 환경 변수 검증 (src/config/env.ts)

```typescript
import { z } from 'zod';

// 환경 변수 스키마 정의
const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'API 키가 필요합니다'),
  CLAUDE_MODEL: z.string().default('claude-sonnet-4-20250514'),
  MAX_TOKENS: z.coerce.number().default(1024),
});

// 환경 변수 파싱 및 검증
// 서버 시작 시 잘못된 설정이 있으면 즉시 에러 발생
export const env = envSchema.parse({
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  CLAUDE_MODEL: process.env.CLAUDE_MODEL,
  MAX_TOKENS: process.env.MAX_TOKENS,
});

export type Env = z.infer<typeof envSchema>;
```

**이 코드가 하는 일:**
1. `z.object()`로 필요한 환경 변수의 형태 정의
2. `z.string().min(1)`로 빈 문자열 방지
3. `z.coerce.number()`로 문자열을 숫자로 자동 변환
4. `.default()`로 기본값 제공
5. `.parse()`로 실제 검증 수행 - 실패 시 에러 발생

### 1.7 상수 정의 (src/config/constants.ts)

```typescript
// prompt.md에서 가져온 시스템 프롬프트
export const SYSTEM_PROMPT = `당신은 리뷰 감정 분석 전문가입니다.
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
</주의사항>

<출력형식>
결과를 JSON 형식으로 반환해주세요:
{
  "sentiment": "positive|negative|neutral",
  "score": 0.8,
  "confidence": 0.9,
  "reason": "분석 근거"
}
</출력형식>`;

// API 관련 상수
export const API_ENDPOINTS = {
  SENTIMENT: '/api/sentiment',
} as const;
```

**프롬프트 엔지니어링 포인트:**
- XML 태그(`<감정분류>`, `<주의사항>`)로 섹션 구분 → Claude가 구조를 잘 이해함
- 출력 형식을 명확히 지정 → 파싱하기 쉬운 JSON 응답
- 한국어 특수 표현 가이드 → 더 정확한 분석

---

## Phase 2: 타입 및 에러 처리

### 학습 포인트
- TypeScript 타입으로 코드 안전성 확보
- 커스텀 에러 클래스로 일관된 에러 처리
- 에러 코드 체계화

### 2.1 도메인 타입 (src/types/sentiment.ts)

```typescript
// 감정 종류
export type Sentiment = 'positive' | 'negative' | 'neutral';

// API 요청 타입
export interface SentimentAnalysisRequest {
  review: string;
}

// API 응답 타입 (Claude가 반환하는 형식)
export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  score: number;        // -1.0 ~ 1.0
  confidence: number;   // 0 ~ 1
  reason: string;       // 분석 근거
}
```

### 2.2 API 타입 (src/types/api.ts)

```typescript
import { SentimentAnalysisResult } from './sentiment';

// 성공 응답
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

// 에러 응답
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// 통합 응답 타입
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// 감정 분석 API 응답
export type SentimentApiResponse = ApiResponse<SentimentAnalysisResult>;
```

### 2.3 타입 배럴 export (src/types/index.ts)

```typescript
export * from './sentiment';
export * from './api';
```

### 2.4 커스텀 에러 클래스 (src/lib/errors/api-error.ts)

```typescript
// 에러 코드 정의
export type ErrorCode =
  | 'VALIDATION_ERROR'    // 입력값 오류
  | 'UNAUTHORIZED'        // API 키 오류
  | 'RATE_LIMIT_ERROR'    // API 호출 제한
  | 'AI_SERVICE_ERROR'    // AI 응답 오류
  | 'UNKNOWN_ERROR';      // 기타

// 커스텀 API 에러 클래스
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: ErrorCode
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

### 2.5 에러 핸들러 (src/lib/errors/handlers.ts)

```typescript
import { NextResponse } from 'next/server';
import { APIError } from './api-error';

// 에러를 일관된 형식의 응답으로 변환
export function handleAPIError(error: unknown): NextResponse {
  // 우리가 정의한 에러인 경우
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // 예상치 못한 에러
  console.error('Unhandled error:', error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다',
      },
    },
    { status: 500 }
  );
}
```

### 2.6 에러 배럴 export (src/lib/errors/index.ts)

```typescript
export * from './api-error';
export * from './handlers';
```

---

## Phase 3: AI 통합

### 학습 포인트
- SDK를 사용한 API 호출
- 프로바이더 패턴으로 AI 서비스 추상화
- 응답 파싱 및 검증

### 3.1 AI 프로바이더 인터페이스 (src/lib/ai/types.ts)

```typescript
// AI 프로바이더 공통 인터페이스
// 나중에 OpenAI, Gemini 등 추가 시 이 인터페이스 구현
export interface AIProvider {
  name: string;
  analyze(systemPrompt: string, userPrompt: string): Promise<string>;
}

// AI 호출 옵션
export interface AIOptions {
  model?: string;
  maxTokens?: number;
}
```

### 3.2 Claude Provider (src/lib/ai/providers/claude.ts)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/config/env';
import { AIProvider } from '../types';
import { APIError } from '@/lib/errors';

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude';
  private client: Anthropic;

  constructor() {
    // SDK 클라이언트 초기화
    this.client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  async analyze(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      // Claude API 호출
      const response = await this.client.messages.create({
        model: env.CLAUDE_MODEL,
        max_tokens: env.MAX_TOKENS,
        system: systemPrompt,    // 시스템 프롬프트 (AI의 역할 정의)
        messages: [
          { role: 'user', content: userPrompt }  // 사용자 메시지
        ],
      });

      // 응답에서 텍스트 추출
      const textBlock = response.content.find(block => block.type === 'text');

      if (!textBlock || textBlock.type !== 'text') {
        throw new APIError(
          'Claude로부터 텍스트 응답을 받지 못했습니다',
          500,
          'AI_SERVICE_ERROR'
        );
      }

      return textBlock.text;

    } catch (error) {
      // Anthropic SDK 에러 처리
      if (error instanceof Anthropic.RateLimitError) {
        throw new APIError(
          'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          429,
          'RATE_LIMIT_ERROR'
        );
      }

      if (error instanceof Anthropic.AuthenticationError) {
        throw new APIError(
          'API 키가 유효하지 않습니다.',
          401,
          'UNAUTHORIZED'
        );
      }

      // 이미 APIError인 경우 그대로 전달
      if (error instanceof APIError) {
        throw error;
      }

      // 기타 에러
      throw new APIError(
        'AI 서비스 오류가 발생했습니다.',
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }
}
```

**Claude API 호출 구조:**
```
client.messages.create({
  model: 'claude-sonnet-4-20250514',  // 사용할 모델
  max_tokens: 1024,               // 최대 응답 길이
  system: '시스템 프롬프트',        // AI의 역할/지시사항
  messages: [                     // 대화 내용
    { role: 'user', content: '사용자 메시지' }
  ]
})
```

### 3.3 Provider 배럴 export (src/lib/ai/providers/index.ts)

```typescript
export * from './claude';
```

### 3.4 AI 모듈 배럴 export (src/lib/ai/index.ts)

```typescript
export * from './types';
export * from './providers';
```

### 3.5 입력 검증 유틸리티 (src/utils/validation.ts)

```typescript
import { z } from 'zod';
import { APIError } from '@/lib/errors';
import type { SentimentAnalysisRequest } from '@/types/sentiment';

// 감정 분석 요청 스키마
const sentimentRequestSchema = z.object({
  review: z
    .string()
    .min(1, '리뷰 내용을 입력해주세요')
    .max(5000, '리뷰는 5000자 이내로 입력해주세요'),
});

// 요청 검증 함수
export function validateSentimentRequest(data: unknown): SentimentAnalysisRequest {
  try {
    return sentimentRequestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => e.message).join(', ');
      throw new APIError(message, 400, 'VALIDATION_ERROR');
    }
    throw error;
  }
}
```

### 3.6 Utils 배럴 export (src/utils/index.ts)

```typescript
export * from './validation';
```

### 3.7 감정 분석 서비스 (src/lib/services/sentiment.ts)

```typescript
import { ClaudeProvider } from '@/lib/ai/providers/claude';
import { SYSTEM_PROMPT } from '@/config/constants';
import { APIError } from '@/lib/errors';
import type {
  SentimentAnalysisRequest,
  SentimentAnalysisResult
} from '@/types/sentiment';

export class SentimentService {
  private ai: ClaudeProvider;

  constructor() {
    this.ai = new ClaudeProvider();
  }

  async analyze(request: SentimentAnalysisRequest): Promise<SentimentAnalysisResult> {
    // 1. 사용자 프롬프트 구성
    const userPrompt = `다음 리뷰를 분석해주세요:\n\n"${request.review}"`;

    // 2. AI 호출
    const response = await this.ai.analyze(SYSTEM_PROMPT, userPrompt);

    // 3. 응답 파싱
    return this.parseResponse(response);
  }

  private parseResponse(response: string): SentimentAnalysisResult {
    try {
      // JSON 추출 (마크다운 코드 블록이 있을 수 있음)
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/)
                       || response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('JSON not found in response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const result = JSON.parse(jsonStr);

      // 필수 필드 검증
      if (!result.sentiment || typeof result.score !== 'number') {
        throw new Error('Invalid response structure');
      }

      return {
        sentiment: result.sentiment,
        score: result.score,
        confidence: result.confidence ?? 0.8,
        reason: result.reason ?? '분석 완료',
      };

    } catch (error) {
      console.error('Response parsing error:', error, response);
      throw new APIError(
        'AI 응답을 파싱하는데 실패했습니다.',
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }
}
```

### 3.8 Services 배럴 export (src/lib/services/index.ts)

```typescript
export * from './sentiment';
```

---

## Phase 4: API 엔드포인트

### 학습 포인트
- Next.js App Router의 Route Handler
- HTTP 요청/응답 처리
- 서비스 레이어 연동

### 4.1 감정 분석 API (src/app/api/sentiment/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SentimentService } from '@/lib/services/sentiment';
import { validateSentimentRequest } from '@/utils/validation';
import { handleAPIError } from '@/lib/errors';

// POST /api/sentiment
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 파싱
    const body = await request.json();

    // 2. 입력 검증
    const validatedRequest = validateSentimentRequest(body);

    // 3. 서비스 호출
    const service = new SentimentService();
    const result = await service.analyze(validatedRequest);

    // 4. 성공 응답
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    // 5. 에러 응답
    return handleAPIError(error);
  }
}
```

**Next.js Route Handler 규칙:**
- `route.ts` 파일에서 HTTP 메서드명으로 함수 export
- `GET`, `POST`, `PUT`, `DELETE` 등 지원
- `/api/sentiment/route.ts` → `/api/sentiment` 엔드포인트

---

## Phase 5: 프론트엔드

### 학습 포인트
- shadcn/ui 컴포넌트 활용
- 커스텀 Hook으로 로직 분리
- Tailwind CSS + CSS Variables 스타일링
- 로딩/에러 상태 처리

### 5.1 shadcn/ui 컴포넌트 (자동 생성됨)

shadcn/ui 초기화 시 아래 컴포넌트들이 `src/components/ui/` 폴더에 자동 생성됩니다:

```bash
npx shadcn@latest add button card textarea badge progress alert
```

생성되는 파일들:
- `src/components/ui/button.tsx` - 버튼 컴포넌트
- `src/components/ui/card.tsx` - 카드 컴포넌트
- `src/components/ui/textarea.tsx` - 텍스트 입력 컴포넌트
- `src/components/ui/badge.tsx` - 배지 컴포넌트
- `src/components/ui/progress.tsx` - 진행률 바 컴포넌트
- `src/components/ui/alert.tsx` - 알림 컴포넌트

> **참고**: shadcn/ui 컴포넌트는 직접 코드가 프로젝트에 복사되므로 자유롭게 수정할 수 있습니다.

### 5.2 cn 유틸리티 함수 (src/lib/utils.ts)

shadcn/ui 초기화 시 자동 생성되는 유틸리티 함수입니다:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 클래스명을 조건부로 결합하고 Tailwind 충돌을 해결
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**사용 예시:**
```typescript
import { cn } from "@/lib/utils";

// 조건부 클래스 적용
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "bg-blue-500" : "bg-gray-500"
)} />
```

### 5.3 감정 분석 Hook (src/hooks/useSentimentAnalysis.ts)

```typescript
'use client';

import { useState, useCallback } from 'react';
import { SentimentAnalysisResult } from '@/types/sentiment';
import { API_ENDPOINTS } from '@/config/constants';

interface UseSentimentAnalysisReturn {
  analyze: (review: string) => Promise<void>;
  result: SentimentAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useSentimentAnalysis(): UseSentimentAnalysisReturn {
  const [result, setResult] = useState<SentimentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (review: string) => {
    // 상태 초기화
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_ENDPOINTS.SENTIMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '분석에 실패했습니다');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, result, isLoading, error, reset };
}
```

#### Hooks 배럴 export (src/hooks/index.ts)

```typescript
export * from './useSentimentAnalysis';
```

### 5.4 감정 분석 컴포넌트 (figma-source 활용)

figma-source에서 복사한 컴포넌트를 Next.js에 맞게 수정합니다.

#### SentimentBadge (src/components/sentiment/SentimentBadge.tsx)

figma-source에서 복사한 컴포넌트입니다. 아이콘과 함께 감정 상태를 표시합니다:

```typescript
import { cn } from "@/lib/utils";
import { Smile, Frown, Meh } from "lucide-react";
import { Sentiment } from "@/types/sentiment";

interface SentimentBadgeProps {
  sentiment: Sentiment;
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const config = {
    positive: {
      icon: Smile,
      label: "Positive (긍정)",
      style: "bg-green-100 text-green-700 border-green-200",
    },
    negative: {
      icon: Frown,
      label: "Negative (부정)",
      style: "bg-red-100 text-red-700 border-red-200",
    },
    neutral: {
      icon: Meh,
      label: "Neutral (중립)",
      style: "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const { icon: Icon, label, style } = config[sentiment];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium",
        style,
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}
```

#### ScoreMeter (src/components/sentiment/ScoreMeter.tsx)

figma-source에서 복사한 감정 점수 시각화 컴포넌트입니다. Motion 애니메이션을 사용합니다:

```typescript
import { motion } from "motion/react";

interface ScoreMeterProps {
  score: number; // -1.0 to 1.0
}

export function ScoreMeter({ score }: ScoreMeterProps) {
  // -1 ~ 1 사이의 점수를 0 ~ 100% 위치로 변환
  const percentage = ((score + 1) / 2) * 100;

  return (
    <div className="w-full space-y-2">
      {/* 라벨 영역 */}
      <div className="grid grid-cols-3 text-[10px] sm:text-xs text-muted-foreground font-medium">
        <div className="text-left">
          <span className="text-red-500 block">-1.0</span>
          <span className="text-red-400/80 block scale-90 origin-top-left">(부정)</span>
        </div>
        <div className="text-center flex items-end justify-center pb-1">
          <span className="text-slate-400">0.0</span>
        </div>
        <div className="text-right">
          <span className="text-green-500 block">+1.0</span>
          <span className="text-green-400/80 block scale-90 origin-top-right">(긍정)</span>
        </div>
      </div>

      {/* 미터 바 */}
      <div className="relative h-4 sm:h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        {/* 그래디언트 배경 */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-slate-200 to-green-400 opacity-30" />

        {/* 중앙 마커 */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400/50" />

        {/* 점수 인디케이터 (애니메이션) */}
        <motion.div
          className="absolute top-0 bottom-0 w-1.5 h-full bg-slate-900 rounded-full shadow-md z-10 transform -translate-x-1/2"
          initial={{ left: "50%" }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>

      {/* 점수 표시 */}
      <div className="text-center font-mono text-lg font-bold text-slate-700 mt-1">
        {score > 0 ? "+" : ""}{score.toFixed(1)}
      </div>
    </div>
  );
}
```

**ScoreMeter 특징:**
- Motion 라이브러리로 부드러운 점수 이동 애니메이션
- 그래디언트 배경으로 감정 범위 시각화
- 반응형 디자인 (모바일/데스크톱)

#### ReviewForm (src/components/sentiment/ReviewForm.tsx)

figma-source의 ReviewAnalyzer 입력 부분을 참조하여 구현합니다:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Quote } from 'lucide-react';

// 테스트용 프리셋 (figma-source에서 가져옴)
const PRESETS = [
  { label: "긍정 리뷰", text: "배송도 정말 빠르고 상품 마감도 훌륭하네요! 강력 추천합니다." },
  { label: "부정 리뷰", text: "최악입니다. 사진이랑 완전히 다르고 환불 요청합니다." },
  { label: "완곡 표현", text: "가격 대비해서 나쁘지 않은 것 같아요." },
  { label: "반어법", text: "와~ 포장 상태 정말 대단하네요. 박스가 찌그러져서 왔어요." },
  { label: "도메인 맥락", text: "이 게임 난이도 진짜 어렵다 ㅋㅋ 근데 깰 때 쾌감이 장난 아님." },
];

interface ReviewFormProps {
  onSubmit: (review: string) => void;
  isLoading: boolean;
}

export function ReviewForm({ onSubmit, isLoading }: ReviewFormProps) {
  const [review, setReview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.trim()) {
      onSubmit(review);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Quote className="w-5 h-5 text-indigo-500" />
          리뷰 입력
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          분석하고 싶은 리뷰 내용을 입력하거나 예시를 선택하세요.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-6 pt-0">
        {/* 프리셋 버튼 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setReview(preset.text)}
              className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50
                         text-slate-700 hover:text-indigo-600 rounded-full
                         transition-colors border border-slate-200"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <Textarea
          placeholder="여기에 리뷰 텍스트를 입력하세요..."
          className="min-h-[150px] md:min-h-[200px] resize-none text-sm md:text-base
                     p-3 md:p-4 focus-visible:ring-indigo-500"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={isLoading}
        />
      </CardContent>

      <CardFooter className="p-4 md:p-6">
        <Button
          className="w-full h-10 md:h-12 text-base md:text-lg bg-indigo-600 hover:bg-indigo-700"
          onClick={handleSubmit}
          disabled={isLoading || !review.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              감정 분석 시작
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### SentimentResult (src/components/sentiment/SentimentResult.tsx)

figma-source의 결과 표시 부분을 참조하여 구현합니다:

```typescript
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { SentimentBadge } from './SentimentBadge';
import { ScoreMeter } from './ScoreMeter';
import { CheckCircle2 } from 'lucide-react';
import type { SentimentAnalysisResult } from '@/types/sentiment';

interface SentimentResultProps {
  result: SentimentAnalysisResult;
}

export function SentimentResult({ result }: SentimentResultProps) {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <Card className="border-slate-200 shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 text-sm md:text-base">
          분석 결과 리포트
        </h3>
        <span className="text-[10px] md:text-xs font-mono text-slate-400">
          JSON OUTPUT
        </span>
      </div>

      <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* 감정 & 신뢰도 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs md:text-sm text-slate-500 mb-1">
              주된 감정 (Sentiment)
            </p>
            <SentimentBadge
              sentiment={result.sentiment}
              className="text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5"
            />
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm text-slate-500 mb-1">
              신뢰도 (Confidence)
            </p>
            <div className="flex items-center gap-2 justify-start sm:justify-end">
              <div className="w-20 md:w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span className="font-bold text-slate-700 text-sm md:text-base">
                {confidencePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 점수 미터 */}
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs md:text-sm text-slate-500 mb-3 md:mb-4 text-center">
            감정 점수 (Score)
          </p>
          <ScoreMeter score={result.score} />
        </div>

        {/* AI 분석 근거 */}
        <div>
          <p className="text-xs md:text-sm text-slate-500 mb-2 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            AI 분석 근거
          </p>
          <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-lg
                          text-slate-700 leading-relaxed text-xs md:text-sm shadow-sm">
            {result.reason}
          </div>
        </div>

        {/* Raw JSON 프리뷰 */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-400 mb-2">Raw Data</p>
          <div className="bg-slate-900 rounded-lg p-3 overflow-hidden">
            <pre className="text-slate-50 text-[10px] md:text-xs font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Sentiment 배럴 export (src/components/sentiment/index.ts)

```typescript
export * from './SentimentBadge';
export * from './ScoreMeter';
export * from './ReviewForm';
export * from './SentimentResult';
```

### 5.5 메인 페이지 (src/app/page.tsx)

figma-source의 ReviewAnalyzer 레이아웃을 참조하여 2열 그리드 레이아웃을 구현합니다:

```typescript
'use client';

import { useSentimentAnalysis } from '@/hooks';
import { ReviewForm, SentimentResult } from '@/components/sentiment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const { analyze, result, isLoading, error } = useSentimentAnalysis();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* 헤더 (figma-source 스타일) */}
      <div className="text-center space-y-3 md:space-y-4 mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          Review Sentiment AI
        </h1>
        <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
          리뷰 텍스트에 숨겨진 감정을 분석합니다.
          반어법, 완곡한 표현, 도메인 맥락까지 파악하는 고급 분석 에이전트를 경험해보세요.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 2열 그리드 레이아웃 (figma-source 스타일) */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <ReviewForm onSubmit={analyze} isLoading={isLoading} />
        </div>

        {/* 결과 섹션 */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {/* 대기 상태 */}
            {!result && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8
                           text-slate-400 border-2 border-dashed border-slate-200
                           rounded-xl bg-slate-50/50 min-h-[300px]"
              >
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>리뷰를 입력하고 분석 버튼을 눌러주세요.</p>
              </motion.div>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8
                           text-indigo-600 min-h-[300px]"
              >
                <div className="space-y-4 text-center">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto" />
                  <p className="animate-pulse font-medium">
                    컨텍스트 분석 중... <br />
                    <span className="text-sm text-slate-500 font-normal">
                      반어법 탐지 및 점수 계산 중
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* 결과 표시 */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <SentimentResult result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```

**figma-source 레이아웃 특징:**
- `lg:grid-cols-2`: 대형 화면에서 2열 그리드
- `AnimatePresence`: 상태 전환 시 부드러운 애니메이션
- 대기/로딩/결과 3가지 상태 분리
- 반응형 패딩과 간격 (`p-4 md:p-6`, `gap-6 md:gap-8`)

---

## 테스트 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 브라우저에서 확인

http://localhost:3000 접속

### 3. 테스트 리뷰 예시

**긍정적:**
```
이 제품 정말 최고예요! 배송도 빠르고 품질도 좋아서 너무 만족합니다. 다음에도 꼭 재구매할 거예요!
```

**부정적:**
```
실망이에요. 사진과 너무 다르고 품질도 좋지 않네요. 환불 요청했습니다.
```

**중립적:**
```
보통이에요. 가격 대비 무난한 것 같습니다.
```

**반어법 테스트:**
```
아 정말 좋네요~ 3일이나 걸려서 배송오고 박스도 찌그러져있고
```

---

## 트러블슈팅

### API 키 오류
```
Error: ANTHROPIC_API_KEY가 설정되지 않았습니다
```
→ `.env.local` 파일에 API 키가 제대로 설정되었는지 확인

### Rate Limit 오류
```
Error: API 호출 한도를 초과했습니다
```
→ 잠시 후 다시 시도하거나, Anthropic 콘솔에서 사용량 확인

### JSON 파싱 오류
```
Error: AI 응답을 파싱하는데 실패했습니다
```
→ 프롬프트를 수정하여 JSON 출력을 더 명확히 요청

---

## 다음 단계 (확장)

1. **다른 AI 프로바이더 추가**
   - OpenAI, Gemini 등 `AIProvider` 인터페이스 구현

2. **배치 분석**
   - 여러 리뷰를 한 번에 분석하는 기능

3. **분석 히스토리**
   - 로컬 스토리지 또는 DB에 분석 결과 저장

4. **스트리밍 응답**
   - Claude의 스트리밍 API로 실시간 응답 표시

5. **테스트 작성**
   - Jest, React Testing Library로 단위/통합 테스트
