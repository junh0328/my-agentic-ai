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
      const message = error.issues.map(e => e.message).join(', ');
      throw new APIError(message, 400, 'VALIDATION_ERROR');
    }
    throw error;
  }
}
