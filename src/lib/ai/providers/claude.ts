import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/config/env';
import { AIProvider } from '../types';
import { APIError } from '@/lib/errors';

export interface ClaudeProviderOptions {
  apiKey?: string;
  model?: string;
}

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude';
  private client: Anthropic;
  private modelName: string;

  constructor(options?: ClaudeProviderOptions) {
    // 클라이언트 설정 우선, 없으면 환경 변수 사용
    const apiKey = options?.apiKey || env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new APIError(
        'Anthropic API 키가 설정되지 않았습니다.',
        500,
        'CONFIGURATION_ERROR'
      );
    }

    // SDK 클라이언트 초기화
    this.client = new Anthropic({
      apiKey,
    });
    this.modelName = options?.model || env.CLAUDE_MODEL;
  }

  async analyze(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      // Claude API 호출
      const response = await this.client.messages.create({
        model: this.modelName,
        max_tokens: env.MAX_TOKENS,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
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
