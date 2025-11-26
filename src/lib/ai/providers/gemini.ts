import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from '../types';
import { APIError } from '@/lib/errors';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new APIError(
        'Google API 키가 설정되지 않았습니다.',
        500,
        'CONFIGURATION_ERROR'
      );
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async analyze(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new APIError(
          'Gemini로부터 응답을 받지 못했습니다',
          500,
          'AI_SERVICE_ERROR'
        );
      }

      return text;

    } catch (error) {
      // 이미 APIError인 경우 그대로 전달
      if (error instanceof APIError) {
        throw error;
      }

      // Google API 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key')) {
        throw new APIError(
          'Google API 키가 유효하지 않습니다.',
          401,
          'UNAUTHORIZED'
        );
      }

      if (errorMessage.includes('RATE_LIMIT') || errorMessage.includes('quota')) {
        throw new APIError(
          'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          429,
          'RATE_LIMIT_ERROR'
        );
      }

      // 기타 에러
      console.error('Gemini API error:', error);
      throw new APIError(
        'AI 서비스 오류가 발생했습니다.',
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }
}
