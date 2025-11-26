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

// 클라이언트에서 전달하는 API 설정
export interface ClientAIConfig {
  provider: 'gemini' | 'claude';
  apiKey: string;
  model: string;
}
