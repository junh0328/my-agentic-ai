'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Quote } from 'lucide-react';

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

interface ReviewFormProps {
  onAnalyze: (review: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function ReviewForm({ onAnalyze, isLoading, disabled }: ReviewFormProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await onAnalyze(input);
  };

  return (
    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Quote className="w-5 h-5 text-indigo-500" />
          리뷰 입력
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          분석하고 싶은 리뷰 내용을 입력하거나 예시를 선택하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4 md:p-6 pt-0 md:pt-0">
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setInput(preset.text)}
              className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-full transition-colors border border-slate-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="여기에 리뷰 텍스트를 입력하세요..."
          className="min-h-[150px] md:min-h-[200px] resize-none text-sm md:text-base p-3 md:p-4 focus-visible:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </CardContent>
      <CardFooter className="p-4 md:p-6">
        <Button
          className="w-full h-10 md:h-12 text-base md:text-lg bg-indigo-600 hover:bg-indigo-700 transition-all"
          onClick={handleSubmit}
          disabled={isLoading || !input.trim() || disabled}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              감정 분석 시작
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
