'use client';

import React from 'react';
import { TravelMode } from '@/types';

interface TravelModeSelectorProps {
  selectedMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
}

export default function TravelModeSelector({ selectedMode, onSelectMode }: TravelModeSelectorProps) {
  const modes: { id: TravelMode; label: string; icon: string }[] = [
    { id: 'car', label: 'Car', icon: '🚗' },
    { id: 'bike', label: 'Bike', icon: '🏍' },
    { id: 'walk', label: 'Walk', icon: '🚶' },
    { id: 'bicycle', label: 'Bicycle', icon: '🚲' },
    { id: 'transit', label: 'Transit', icon: '🚌' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            aria-label={`Select travel mode: ${mode.label}`}
            onClick={() => onSelectMode(mode.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="text-base mb-0.5">{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
