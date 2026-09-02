'use client';

import React from 'react';
import { Play, Pause, FastForward, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface DemoGpsControlProps {
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onChangeSpeed: (speed: number) => void;
  onTriggerOffRoute: () => void;
  onFastForwardArrival: () => void;
}

export default function DemoGpsControl({
  isPlaying,
  speed,
  onTogglePlay,
  onChangeSpeed,
  onTriggerOffRoute,
  onFastForwardArrival,
}: DemoGpsControlProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-xl flex flex-wrap items-center justify-between gap-2 text-white">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          DEMO GPS SIMULATOR
        </span>

        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center justify-center transition-transform active:scale-95 shadow"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Speed multiplier */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-0.5 text-xs font-bold rounded ${
                speed === s ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Simulate Off-route */}
        <button
          onClick={onTriggerOffRoute}
          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Off-Route</span>
        </button>

        {/* Complete Journey */}
        <button
          onClick={onFastForwardArrival}
          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Instant Arrive</span>
        </button>
      </div>
    </div>
  );
}
