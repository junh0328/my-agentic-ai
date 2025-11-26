// 에러 코드 정의
export type ErrorCode =
  | 'VALIDATION_ERROR'     // 입력값 오류
  | 'INVALID_JSON'         // JSON 파싱 오류
  | 'CONFIGURATION_ERROR'  // 설정 오류
  | 'UNAUTHORIZED'         // API 키 오류
  | 'RATE_LIMIT_ERROR'     // API 호출 제한
  | 'AI_SERVICE_ERROR'     // AI 응답 오류
  | 'UNKNOWN_ERROR';       // 기타

// 커스텀 API 에러 클래스
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: ErrorCode
  ) {
    super(message);
    this.name = 'APIError';
  }
}
