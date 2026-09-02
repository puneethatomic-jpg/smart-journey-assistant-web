'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Journey } from '@/types';
import { Trophy, Clock, Navigation, Award, CheckCircle2, RotateCcw, Save } from 'lucide-react';

interface ArrivalModalProps {
  journey: Journey;
  onSaveToHistory: () => void;
  onNewJourney: () => void;
}

export default function ArrivalModal({ journey, onSaveToHistory, onNewJourney }: ArrivalModalProps) {
  useEffect(() => {
    // Fire festive confetti animation upon arrival
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Glow background effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Trophy className="w-8 h-8 text-slate-950 font-bold" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">You&apos;ve Arrived! 🎉</h2>
          <p className="text-xs text-slate-400">
            Successfully navigated to <span className="text-emerald-400 font-bold">{journey.destination.name}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <Navigation className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Distance</span>
            <span className="text-lg font-black text-white">{journey.selectedRoute.distanceKm} km</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Travel Duration</span>
            <span className="text-lg font-black text-white">{journey.selectedRoute.durationMin} min</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Route Efficiency</span>
            <span className="text-lg font-black text-white">{journey.selectedRoute.score.overallScore}%</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Travel Mode</span>
            <span className="text-lg font-black text-white capitalize">{journey.travelMode}</span>
          </div>
        </div>

        {/* Route Used Rationale */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span className="font-bold text-sky-400 block mb-0.5">Route Summary:</span>
          {journey.selectedRoute.name} ({journey.selectedRoute.summary})
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col space-y-2">
          <button
            onClick={onSaveToHistory}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-transform active:scale-95 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>SAVE TO JOURNEY HISTORY</span>
          </button>

          <button
            onClick={onNewJourney}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Plan Another Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
}
