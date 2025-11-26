import { ClaudeProvider } from '@/lib/ai/providers/claude';
import { GeminiProvider } from '@/lib/ai/providers/gemini';
import { AIProvider, ClientAIConfig } from '@/lib/ai/types';
import { SYSTEM_PROMPT } from '@/config/constants';
import { env } from '@/config/env';
import { APIError } from '@/lib/errors';
import type {
  SentimentAnalysisRequest,
  SentimentAnalysisResult
} from '@/types/sentiment';

export class SentimentService {
  private ai: AIProvider;

  constructor(clientConfig?: ClientAIConfig) {
    // 클라이언트 설정이 있으면 우선 사용, 없으면 환경 변수 사용
    this.ai = this.createProvider(clientConfig);
  }

  private createProvider(clientConfig?: ClientAIConfig): AIProvider {
    // 클라이언트에서 설정을 전달한 경우
    if (clientConfig) {
      switch (clientConfig.provider) {
        case 'claude':
          return new ClaudeProvider({
            apiKey: clientConfig.apiKey,
            model: clientConfig.model,
          });
        case 'gemini':
          return new GeminiProvider({
            apiKey: clientConfig.apiKey,
            model: clientConfig.model,
          });
        default:
          return new GeminiProvider({
            apiKey: clientConfig.apiKey,
            model: clientConfig.model,
          });
      }
    }

    // 서버 환경 변수 사용
    switch (env.AI_PROVIDER) {
      case 'claude':
        return new ClaudeProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        // 기본값: Gemini (무료)
        return new GeminiProvider();
    }
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
