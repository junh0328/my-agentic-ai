'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SentimentBadge } from './SentimentBadge';
import { ScoreMeter } from './ScoreMeter';
import type { SentimentAnalysisResult } from '@/types/sentiment';

interface SentimentResultProps {
  result: SentimentAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

export function SentimentResult({ result, isLoading, error }: SentimentResultProps) {
  return (
    <AnimatePresence mode="wait">
      {/* 에러 상태 */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col items-center justify-center p-8 text-red-500 border-2 border-dashed border-red-200 rounded-xl bg-red-50/50"
        >
          <p className="font-medium">{error}</p>
        </motion.div>
      )}

      {/* 초기 상태 */}
      {!result && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col items-center justify-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
        >
          <Sparkles className="w-12 h-12 mb-4 opacity-20" />
          <p>리뷰를 입력하고 분석 버튼을 눌러주세요.</p>
        </motion.div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col items-center justify-center p-8 text-indigo-600"
        >
          <div className="space-y-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto" />
            <p className="animate-pulse font-medium">
              컨텍스트 분석 중... <br />
              <span className="text-sm text-slate-500 font-normal">
                반어법 탐지 및 점수 계산 중
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {/* 결과 상태 */}
      {result && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
        >
          <Card className="border-slate-200 shadow-lg overflow-hidden h-full">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700 text-sm md:text-base">
                분석 결과 리포트
              </h3>
              <span className="text-[10px] md:text-xs font-mono text-slate-400">
                JSON OUTPUT
              </span>
            </div>
            <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
              {/* Main Sentiment */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                  <p className="text-xs md:text-sm text-slate-500 mb-1">
                    주된 감정 (Sentiment)
                  </p>
                  <SentimentBadge
                    sentiment={result.sentiment}
                    className="text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5"
                  />
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs md:text-sm text-slate-500 mb-1">
                    신뢰도 (Confidence)
                  </p>
                  <div className="flex items-center gap-2 justify-start sm:justify-end">
                    <div className="w-20 md:w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 text-sm md:text-base">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs md:text-sm text-slate-500 mb-3 md:mb-4 text-center">
                  감정 점수 (Score)
                </p>
                <ScoreMeter score={result.score} />
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-2 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  AI 분석 근거
                </p>
                <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-lg text-slate-700 leading-relaxed text-xs md:text-sm shadow-sm">
                  {result.reason}
                </div>
              </div>

              {/* Raw JSON Preview */}
              <div className="pt-4 border-t border-slate-100 w-full min-w-0">
                <p className="text-[10px] md:text-xs text-slate-400 mb-2">Raw Data</p>
                <div className="bg-slate-900 rounded-lg p-3 w-full overflow-hidden">
                  <pre className="text-slate-50 text-[10px] md:text-xs font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
