'use client';

import React from 'react';
import { LocationPoint } from '@/types';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface JourneyProgressProps {
  origin: LocationPoint;
  destination: LocationPoint;
  progressPercent: number;
  remainingDistanceKm: number;
  remainingDurationMin: number;
}

export default function JourneyProgress({
  origin,
  destination,
  progressPercent,
  remainingDistanceKm,
  remainingDurationMin,
}: JourneyProgressProps) {
  const etaTime = new Date(Date.now() + remainingDurationMin * 60 * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl text-white space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="truncate max-w-[140px] text-sky-400 font-bold flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {origin.name}
        </span>
        <span className="text-slate-300 font-bold">{Math.round(progressPercent)}%</span>
        <span className="truncate max-w-[140px] text-red-400 font-bold flex items-center justify-end">
          {destination.name}
          <MapPin className="w-3.5 h-3.5 ml-1" />
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        ></div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-850">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">REMAINING DISTANCE</span>
            <span className="text-sm font-bold text-slate-100">{remainingDistanceKm} km</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">ESTIMATED ARRIVAL</span>
            <span className="text-sm font-bold text-slate-100">{etaTime} ({remainingDurationMin} min)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
