'use client';

import React from 'react';
import { Journey } from '@/types';
import { History, Calendar, MapPin, Navigation, Clock, Trash2, Award } from 'lucide-react';

interface HistoryProps {
  journeys: Journey[];
  onClearHistory: () => void;
}

export default function JourneyHistoryList({ journeys, onClearHistory }: HistoryProps) {
  if (!journeys || journeys.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 text-slate-400">
        <History className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Journey History Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Completed journeys will automatically be saved here with detailed stats and route scores.
        </p>
      </div>
    );
  }

  const totalKm = journeys.reduce((acc, j) => acc + (j.selectedRoute?.distanceKm || 0), 0);
  const totalMin = journeys.reduce((acc, j) => acc + (j.selectedRoute?.durationMin || 0), 0);

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Journey History</h2>
          <p className="text-xs text-slate-400">Review past travels and efficiency analytics</p>
        </div>

        <button
          onClick={onClearHistory}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-3 gap-3 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Journeys</span>
          <span className="text-xl font-black text-sky-400">{journeys.length}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Distance Traveled</span>
          <span className="text-xl font-black text-emerald-400">{totalKm.toFixed(1)} km</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Time Saved</span>
          <span className="text-xl font-black text-amber-400">{totalMin} mins</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {journeys.map((journey) => (
          <div
            key={journey.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(journey.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>

              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {journey.travelMode} Mode
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-100">
                  <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>{journey.origin.name}</span>
                  <span className="text-slate-500">→</span>
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{journey.destination.name}</span>
                </div>
                <p className="text-xs text-slate-400">{journey.selectedRoute.name}</p>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-emerald-400 flex items-center justify-end space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{journey.selectedRoute.score.overallScore}%</span>
                </div>
                <span className="text-[10px] text-slate-400">Efficiency</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>{journey.selectedRoute.distanceKm} km</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{journey.selectedRoute.durationMin} mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
