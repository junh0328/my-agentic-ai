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
