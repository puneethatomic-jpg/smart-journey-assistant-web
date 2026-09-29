'use client';

import React from 'react';
import { RoutePreference } from '@/types';
import { Zap, ShieldAlert, DollarSign, Scale, Leaf, Ruler } from 'lucide-react';

interface PreferenceSelectorProps {
  selectedPreference: RoutePreference;
  onSelectPreference: (pref: RoutePreference) => void;
}

export default function RoutePreferenceSelector({
  selectedPreference,
  onSelectPreference,
}: PreferenceSelectorProps) {
  const options: { id: RoutePreference; label: string; icon: React.ElementType }[] = [
    { id: 'balanced', label: 'Balanced', icon: Scale },
    { id: 'fastest', label: 'Fastest', icon: Zap },
    { id: 'shortest', label: 'Shortest', icon: Ruler },
    { id: 'avoid_tolls', label: 'No Tolls', icon: DollarSign },
    { id: 'avoid_highways', label: 'No Highways', icon: ShieldAlert },
    { id: 'eco', label: 'Eco-Friendly', icon: Leaf },
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selectedPreference === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-label={`Filter by preference: ${opt.label}`}
            onClick={() => onSelectPreference(opt.id)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-slate-800 text-sky-400 border border-sky-500/50 shadow-sm font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
