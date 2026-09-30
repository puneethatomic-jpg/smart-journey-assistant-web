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
  const getTrafficBadge = () => {
    switch (route.trafficLevel) {
      case 'none':
        return (
          <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            🟢 No Traffic Area
          </span>
        );
      case 'low':
        return (
          <span className="bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            🟡 Less Traffic Area
          </span>
        );
      case 'moderate':
        return (
          <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            Moderate Traffic
          </span>
        );
      case 'heavy':
        return (
          <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            Heavy Traffic Area
          </span>
        );
      default:
        return null;
    }
  };

  const getRoadQualityBadge = () => {
    if (route.roadQuality === 'rough' || route.roadQuality === 'bad') {
      return (
        <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span>⚠️ Bad Road (Potholes Reported)</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
        <span>✨ Good Road</span>
        {route.roadQualityScore && (
          <span className="text-[10px] text-emerald-400/80">({route.roadQualityScore}% Smooth)</span>
        )}
      </span>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-xl cursor-pointer transition-all border relative ${
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
          <span>AI RECOMMENDED ROUTE</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="pr-2">
          <h4 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
            <span>{route.name}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{route.summary}</p>
        </div>

        {/* Score Pill */}
        <div className="flex flex-col items-end flex-shrink-0">
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

      {/* Badges: Road Condition & Traffic Area */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        {getRoadQualityBadge()}
        {getTrafficBadge()}
        {route.tollCost === 0 && (
          <span className="bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
            Toll-Free
          </span>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mt-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-slate-400 block -mb-0.5">EST. TIME</span>
            <span className="text-xs font-bold text-slate-100">{route.durationMin} min</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-slate-400 block -mb-0.5">DISTANCE</span>
            <span className="text-xs font-bold text-slate-100">{route.distanceKm} km</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <DollarSign className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-slate-400 block -mb-0.5">TOLL COST</span>
            <span className="text-xs font-bold text-slate-100">
              {route.tollCost > 0 ? `₹${route.tollCost}` : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Details & Action */}
      <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-slate-800/50">
        <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
          {route.score.reasoning}
        </span>

        {isSelected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartJourney();
            }}
            className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-lg shadow-md flex items-center space-x-1 transition-transform active:scale-95"
          >
            <span>START</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
