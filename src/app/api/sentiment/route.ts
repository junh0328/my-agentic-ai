import { NextRequest, NextResponse } from 'next/server';
import { SentimentService } from '@/lib/services/sentiment';
import { validateSentimentRequest } from '@/utils/validation';
import { handleAPIError, APIError } from '@/lib/errors';
import type { ClientAIConfig } from '@/lib/ai/types';

// 헤더에서 클라이언트 AI 설정 추출
function getClientConfig(request: NextRequest): ClientAIConfig | undefined {
  const provider = request.headers.get('X-AI-Provider');
  const apiKey = request.headers.get('X-AI-Key');
  const model = request.headers.get('X-AI-Model');

  // 클라이언트 설정이 모두 있는 경우에만 사용
  if (provider && apiKey && model) {
    if (provider !== 'gemini' && provider !== 'claude') {
      return undefined;
    }
    return {
      provider: provider as 'gemini' | 'claude',
      apiKey,
      model,
    };
  }

  return undefined;
}

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

    // 3. 클라이언트 설정 확인 (헤더에서 추출)
    const clientConfig = getClientConfig(request);

    // 4. 서비스 호출 (클라이언트 설정이 있으면 사용, 없으면 서버 환경 변수 사용)
    const service = new SentimentService(clientConfig);
    const result = await service.analyze(validatedRequest);

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    // 6. 에러 응답
    return handleAPIError(error);
  }
}
