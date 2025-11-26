'use client';

import { useSentimentAnalysis } from '@/hooks';
import { ReviewForm, SentimentResult } from '@/components/sentiment';

export default function Home() {
  const { analyze, result, isLoading, error } = useSentimentAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 md:space-y-4 mb-4 md:mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
            Review Sentiment AI
          </h1>
          <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            리뷰 텍스트에 숨겨진 감정을 분석합니다. 반어법, 완곡한 표현, 도메인 맥락까지 파악하는 고급 분석 에이전트를 경험해보세요.
          </p>
        </div>

        {/* Main Content - 2 Column Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <ReviewForm onAnalyze={analyze} isLoading={isLoading} />
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <SentimentResult result={result} isLoading={isLoading} error={error} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-8">
          <p>Powered by Claude AI</p>
        </footer>
      </div>
    </div>
  );
}
