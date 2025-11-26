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
