'use client';

import { useMemo } from 'react';
import { useSentimentAnalysis, useApiConfig } from '@/hooks';
import { ReviewForm, SentimentResult } from '@/components/sentiment';
import { ApiKeyModal } from '@/components/settings';

export default function Home() {
  const {
    serverConfig,
    clientConfig,
    isConfigured,
    isLoading: configLoading,
    setClientConfig,
    getRequestHeaders,
  } = useApiConfig();

  // 클라이언트 설정이 있으면 헤더에 포함
  const headers = useMemo(() => getRequestHeaders(), [getRequestHeaders]);

  const { analyze, result, isLoading, error } = useSentimentAnalysis({ headers });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* API 설정 모달 버튼 */}
      <ApiKeyModal
        hasServerConfig={serverConfig?.hasServerConfig ?? false}
        onConfigChange={setClientConfig}
      />

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 md:space-y-4 mb-4 md:mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
            Review Sentiment AI
          </h1>
          <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            리뷰 텍스트에 숨겨진 감정을 분석합니다. 반어법, 완곡한 표현, 도메인 맥락까지 파악하는 고급 분석 에이전트를 경험해보세요.
          </p>

          {/* API 설정 상태 표시 */}
          {!configLoading && (
            <div className="text-xs text-slate-500">
              {isConfigured ? (
                clientConfig ? (
                  <span className="text-green-600">
                    {clientConfig.provider === 'gemini' ? 'Google Gemini' : 'Claude'} API 사용 중 ({clientConfig.model})
                  </span>
                ) : (
                  <span className="text-blue-600">서버 API 키 사용 중</span>
                )
              ) : (
                <span className="text-amber-600">
                  우측 상단 설정 버튼을 눌러 API 키를 입력해주세요
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main Content - 2 Column Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <ReviewForm
              onAnalyze={analyze}
              isLoading={isLoading}
              disabled={!isConfigured}
            />
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <SentimentResult result={result} isLoading={isLoading} error={error} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-8">
          <p>Powered by AI</p>
        </footer>
      </div>
    </div>
  );
}
