import { NextResponse } from 'next/server';
import { APIError } from './api-error';

// 에러를 일관된 형식의 응답으로 변환
export function handleAPIError(error: unknown): NextResponse {
  // 우리가 정의한 에러인 경우
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // 예상치 못한 에러
  console.error('Unhandled error:', error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다',
      },
    },
    { status: 500 }
  );
}
