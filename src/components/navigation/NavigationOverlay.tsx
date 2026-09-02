'use client';

import React from 'react';
import { NavigationStep } from '@/types';
import { CornerUpRight, CornerUpLeft, ArrowUp, Flag, AlertTriangle, Square } from 'lucide-react';

interface NavigationOverlayProps {
  currentStep: NavigationStep;
  destinationName: string;
  isOffRoute?: boolean;
  onEndJourney: () => void;
}

export default function NavigationOverlay({
  currentStep,
  destinationName,
  isOffRoute,
  onEndJourney,
}: NavigationOverlayProps) {
  const getManeuverIcon = (maneuver: string) => {
    switch (maneuver) {
      case 'turn-left':
      case 'slight-left':
        return <CornerUpLeft className="w-8 h-8 text-sky-400" />;
      case 'turn-right':
      case 'slight-right':
        return <CornerUpRight className="w-8 h-8 text-sky-400" />;
      case 'arrive':
        return <Flag className="w-8 h-8 text-emerald-400" />;
      default:
        return <ArrowUp className="w-8 h-8 text-sky-400" />;
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl text-white">
      {isOffRoute && (
        <div className="mb-3 bg-amber-500/20 border border-amber-500/40 p-2.5 rounded-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Off-route detected! Calculating faster dynamic reroute...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
            {getManeuverIcon(currentStep?.maneuver || 'straight')}
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider block">
              NEXT MANEUVER ({currentStep?.distanceMeters || 200} m)
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 line-clamp-1">
              {currentStep?.instruction || `Head towards ${destinationName}`}
            </h3>
          </div>
        </div>

        <button
          onClick={onEndJourney}
          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5"
        >
          <Square className="w-3.5 h-3.5 fill-rose-400" />
          <span>END JOURNEY</span>
        </button>
      </div>
    </div>
  );
}
