'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AIExplanationProps {
  explanation: {
    summary: string;
    bullets: string[];
    confidence: number;
  };
}

export default function AIExplanationCard({ explanation }: AIExplanationProps) {
  if (!explanation || !explanation.summary) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 border border-sky-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <span className="font-bold text-sm text-sky-300 tracking-wide uppercase">AI Route Recommendation</span>
        </div>

        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          <span>{explanation.confidence}% Confidence</span>
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mt-1">
        {explanation.summary}
      </p>

      {explanation.bullets && explanation.bullets.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
          {explanation.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
