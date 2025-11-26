'use client';

import { useState, useCallback } from 'react';
import { SentimentAnalysisResult } from '@/types/sentiment';
import { API_ENDPOINTS } from '@/config/constants';

interface UseSentimentAnalysisReturn {
  analyze: (review: string) => Promise<void>;
  result: SentimentAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useSentimentAnalysis(): UseSentimentAnalysisReturn {
  const [result, setResult] = useState<SentimentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (review: string) => {
    // 상태 초기화
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_ENDPOINTS.SENTIMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '분석에 실패했습니다');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, result, isLoading, error, reset };
}
