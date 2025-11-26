import { NextResponse } from 'next/server';

/**
 * 서버 환경 변수 설정 상태를 확인하는 API
 * 클라이언트에서 모달 표시 여부를 결정하는 데 사용
 */
export async function GET() {
  const hasGeminiKey = !!process.env.GOOGLE_API_KEY;
  const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY;
  const defaultProvider = process.env.AI_PROVIDER || 'gemini';

  return NextResponse.json({
    hasServerConfig: hasGeminiKey || hasClaudeKey,
    availableProviders: {
      gemini: hasGeminiKey,
      claude: hasClaudeKey,
    },
    defaultProvider,
  });
}
