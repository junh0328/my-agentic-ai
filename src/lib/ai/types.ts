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
