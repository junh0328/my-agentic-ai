import { z } from 'zod';

// AI 제공자 타입
export type AIProviderType = 'claude' | 'gemini';

// 환경 변수 스키마 정의
const envSchema = z.object({
  // AI Provider 선택 (기본값: gemini - 무료)
  AI_PROVIDER: z.enum(['claude', 'gemini']).default('gemini'),

  // Claude 설정 (선택적)
  ANTHROPIC_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default('claude-sonnet-4-20250514'),

  // Gemini 설정 (선택적)
  GOOGLE_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),

  // 공통 설정
  MAX_TOKENS: z.coerce.number().default(1024),
});

// 환경 변수 파싱 및 검증
export const env = envSchema.parse({
  AI_PROVIDER: process.env.AI_PROVIDER,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  CLAUDE_MODEL: process.env.CLAUDE_MODEL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  MAX_TOKENS: process.env.MAX_TOKENS,
});

export type Env = z.infer<typeof envSchema>;
