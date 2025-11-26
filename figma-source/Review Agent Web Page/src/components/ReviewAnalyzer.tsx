import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { analyzeReviewMock, AnalysisResult } from '../lib/analyzer';
import { SentimentBadge } from './SentimentBadge';
import { ScoreMeter } from './ScoreMeter';
import { Loader2, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESETS = [
  {
    label: '긍정 리뷰',
    text: '배송도 정말 빠르고 상품 마감도 훌륭하네요! 다음에도 여기서 구매하고 싶어요. 강력 추천합니다.',
  },
  {
    label: '부정 리뷰',
    text: '최악입니다. 사진이랑 색감도 완전히 다르고 박스는 다 찌그러져서 왔어요. 환불 요청합니다.',
  },
  {
    label: '완곡 표현',
    text: '가격 대비해서 나쁘지 않은 것 같아요. 엄청 좋은 건 아니지만 쓸만합니다.',
  },
  {
    label: '반어법 (주의)',
    text: '와~ 포장 상태 정말 대단하네요. 비 오는 날 박스를 그냥 던져두고 가셔서 내용물이 아주 촉촉해졌어요. 센스 굿입니다.',
  },
  {
    label: '도메인 맥락',
    text: '이 게임 난이도 진짜 맵다 ㅋㅋ 근데 깰 때 쾌감이 장난 아님. 도전 욕구 자극 제대로네.',
  },
];

export function ReviewAnalyzer() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const data = await analyzeReviewMock(input);
      setResult(data);
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8'>
      <div className='text-center space-y-3 md:space-y-4 mb-4 md:mb-8'>
        <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900'>
          Review Sentiment AI
        </h1>
        <p className='text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2'>
          리뷰 텍스트에 숨겨진 감정을 분석합니다. 반어법, 완곡한 표현, 도메인
          맥락까지 파악하는 고급 분석 에이전트를 경험해보세요.
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-6 md:gap-8'>
        {/* Input Section */}
        <div className='space-y-6'>
          <Card className='border-slate-200 shadow-sm h-full flex flex-col'>
            <CardHeader className='p-4 md:p-6'>
              <CardTitle className='flex items-center gap-2 text-lg md:text-xl'>
                <Quote className='w-5 h-5 text-indigo-500' />
                리뷰 입력
              </CardTitle>
              <CardDescription className='text-xs md:text-sm'>
                분석하고 싶은 리뷰 내용을 입력하거나 예시를 선택하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 space-y-4 p-4 md:p-6 pt-0 md:pt-0'>
              <div className='flex flex-wrap gap-2 mb-2'>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setInput(preset.text)}
                    className='px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-full transition-colors border border-slate-200'
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder='여기에 리뷰 텍스트를 입력하세요...'
                className='min-h-[150px] md:min-h-[200px] resize-none text-sm md:text-base p-3 md:p-4 focus-visible:ring-indigo-500'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
            <CardFooter className='p-4 md:p-6'>
              <Button
                className='w-full h-10 md:h-12 text-base md:text-lg bg-indigo-600 hover:bg-indigo-700 transition-all'
                onClick={handleAnalyze}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className='mr-2 h-5 w-5' />
                    감정 분석 시작
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Result Section */}
        <div className='space-y-6'>
          <AnimatePresence mode='wait'>
            {!result && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='h-full flex flex-col items-center justify-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50'
              >
                <Sparkles className='w-12 h-12 mb-4 opacity-20' />
                <p>리뷰를 입력하고 분석 버튼을 눌러주세요.</p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='h-full flex flex-col items-center justify-center p-8 text-indigo-600'
              >
                <div className='space-y-4 text-center'>
                  <Loader2 className='w-10 h-10 animate-spin mx-auto' />
                  <p className='animate-pulse font-medium'>
                    컨텍스트 분석 중... <br />
                    <span className='text-sm text-slate-500 font-normal'>
                      반어법 탐지 및 점수 계산 중
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='h-full'
              >
                <Card className='border-slate-200 shadow-lg overflow-hidden h-full'>
                  <div className='bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center'>
                    <h3 className='font-semibold text-slate-700 text-sm md:text-base'>
                      분석 결과 리포트
                    </h3>
                    <span className='text-[10px] md:text-xs font-mono text-slate-400'>
                      JSON OUTPUT
                    </span>
                  </div>
                  <CardContent className='p-4 md:p-6 space-y-6 md:space-y-8'>
                    {/* Main Sentiment */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0'>
                      <div>
                        <p className='text-xs md:text-sm text-slate-500 mb-1'>
                          주된 감정 (Sentiment)
                        </p>
                        <SentimentBadge
                          sentiment={result.sentiment}
                          className='text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5'
                        />
                      </div>
                      <div className='text-left sm:text-right'>
                        <p className='text-xs md:text-sm text-slate-500 mb-1'>
                          신뢰도 (Confidence)
                        </p>
                        <div className='flex items-center gap-2 justify-start sm:justify-end'>
                          <div className='w-20 md:w-24 h-2 bg-slate-100 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-indigo-500 rounded-full'
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                          <span className='font-bold text-slate-700 text-sm md:text-base'>
                            {(result.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className='p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-100'>
                      <p className='text-xs md:text-sm text-slate-500 mb-3 md:mb-4 text-center'>
                        감정 점수 (Score)
                      </p>
                      <ScoreMeter score={result.score} />
                    </div>

                    {/* Reasoning */}
                    <div>
                      <p className='text-xs md:text-sm text-slate-500 mb-2 font-medium flex items-center gap-2'>
                        <CheckCircle2 className='w-3 h-3 md:w-4 md:h-4 text-green-600' />
                        AI 분석 근거
                      </p>
                      <div className='bg-white border border-slate-200 p-3 md:p-4 rounded-lg text-slate-700 leading-relaxed text-xs md:text-sm shadow-sm'>
                        {result.reason}
                      </div>
                    </div>

                    {/* Raw JSON Preview */}
                    <div className='pt-4 border-t border-slate-100 w-full min-w-0'>
                      <p className='text-[10px] md:text-xs text-slate-400 mb-2'>
                        Raw Data
                      </p>
                      <div className='bg-slate-900 rounded-lg p-3 w-full overflow-hidden'>
                        <pre className='text-slate-50 text-[10px] md:text-xs font-mono whitespace-pre-wrap break-all'>
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
