import { NextRequest, NextResponse } from 'next/server';
import { SentimentService } from '@/lib/services/sentiment';
import { validateSentimentRequest } from '@/utils/validation';
import { handleAPIError, APIError } from '@/lib/errors';

// POST /api/sentiment
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      throw new APIError('잘못된 JSON 형식입니다', 400, 'INVALID_JSON');
    }

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
