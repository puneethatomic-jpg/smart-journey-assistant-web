'use client';

import React from 'react';
import { RouteOption } from '@/types';
import { Star, Clock, Navigation, DollarSign, ShieldAlert, ArrowRight } from 'lucide-react';

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
  onStartJourney: () => void;
}

export default function RouteCard({ route, isSelected, onSelect, onStartJourney }: RouteCardProps) {
  const getTrafficBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Low Traffic</span>;
      case 'moderate':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Moderate Traffic</span>;
      case 'heavy':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Heavy Traffic</span>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl cursor-pointer transition-all border relative ${
        isSelected
          ? route.isRecommended
            ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
            : 'bg-slate-900 border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      {/* Recommended Header */}
      {route.isRecommended && (
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
          <Star className="w-3 h-3 fill-slate-950" />
          <span>RECOMMENDED ROUTE</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-slate-100 text-base flex items-center space-x-2">
            <span>{route.name}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{route.summary}</p>
        </div>

        {/* Score Pill */}
        <div className="flex flex-col items-end">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center space-x-1 ${
            route.score.overallScore >= 85
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : route.score.overallScore >= 75
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-slate-800 text-slate-300'
          }`}>
            <span>Score:</span>
            <span className="text-sm">{route.score.overallScore}</span>
            <span className="text-[10px] text-slate-400 font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mt-3.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-sky-400" />
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">EST. TIME</span>
            <span className="text-sm font-bold text-slate-100">{route.durationMin} min</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">DISTANCE</span>
            <span className="text-sm font-bold text-slate-100">{route.distanceKm} km</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">TOLL COST</span>
            <span className="text-sm font-bold text-slate-100">
              {route.tollCost > 0 ? `₹${route.tollCost}` : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Badges & Highlights */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {getTrafficBadge(route.trafficLevel)}
          <span className="text-xs text-slate-400">{route.score.reasoning}</span>
        </div>

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartJourney();
            }}
            className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-md flex items-center space-x-1 transition-transform active:scale-95"
          >
            <span>START JOURNEY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
