'use client';

import { motion } from 'motion/react';

interface ScoreMeterProps {
  score: number; // -1.0 to 1.0
}

export function ScoreMeter({ score }: ScoreMeterProps) {
  // -1 ~ 1 사이의 점수를 0 ~ 100% 위치로 변환
  const percentage = ((score + 1) / 2) * 100;

  return (
    <div className="w-full space-y-2">
      {/* 라벨 영역 */}
      <div className="grid grid-cols-3 text-[10px] sm:text-xs text-muted-foreground font-medium">
        <div className="text-left">
          <span className="text-red-500 block">-1.0</span>
          <span className="text-red-400/80 block scale-90 origin-top-left">(부정)</span>
        </div>
        <div className="text-center flex items-end justify-center pb-1">
          <span className="text-slate-400">0.0</span>
        </div>
        <div className="text-right">
          <span className="text-green-500 block">+1.0</span>
          <span className="text-green-400/80 block scale-90 origin-top-right">(긍정)</span>
        </div>
      </div>
      <div className="relative h-4 sm:h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-slate-200 to-green-400 opacity-30" />

        {/* Center Marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400/50" />

        {/* Indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-1.5 h-full bg-slate-900 rounded-full shadow-md z-10 transform -translate-x-1/2 transition-all duration-700 ease-out"
          initial={{ left: '50%' }}
          animate={{ left: `${percentage}%` }}
        />
      </div>
      <div className="text-center font-mono text-lg font-bold text-slate-700 mt-1">
        {score > 0 ? '+' : ''}
        {score.toFixed(1)}
      </div>
    </div>
  );
}
