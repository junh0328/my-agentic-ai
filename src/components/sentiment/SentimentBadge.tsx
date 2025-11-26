'use client';

import { cn } from '@/lib/utils';
import { Smile, Frown, Meh } from 'lucide-react';
import type { Sentiment } from '@/types/sentiment';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const config = {
    positive: {
      icon: Smile,
      label: 'Positive (긍정)',
      style: 'bg-green-100 text-green-700 border-green-200',
    },
    negative: {
      icon: Frown,
      label: 'Negative (부정)',
      style: 'bg-red-100 text-red-700 border-red-200',
    },
    neutral: {
      icon: Meh,
      label: 'Neutral (중립)',
      style: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const { icon: Icon, label, style } = config[sentiment];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium',
        style,
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}
