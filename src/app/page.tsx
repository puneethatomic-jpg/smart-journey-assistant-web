'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Navigation, Zap, Sparkles, MapPin, PlayCircle, ShieldCheck, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-400 shadow-lg">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI-POWERED MULTI-FACTOR ROUTE SCORING ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Journey.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300">
              Smarter.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Find the most suitable route from your location to any destination. We evaluate time, traffic flow, distance, toll fees, travel mode, and personal preferences to recommend the optimal path with AI explanations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/map"
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2 group"
            >
              <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              <span>PLAN A JOURNEY NOW</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/map?demo=true"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-7 py-4 rounded-xl text-base transition-colors flex items-center justify-center space-x-2"
            >
              <PlayCircle className="w-5 h-5 text-emerald-400" />
              <span>Try Demo Scenario</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Multi-Factor Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't just pick the shortest path. We analyze travel time (40%), traffic density (25%), distance (15%), tolls (10%), and your preferences (10%).
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Route Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear, transparent explanations detailing trade-offs like why a slightly longer route saves 5 minutes by skipping traffic bottlenecks.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Live & Demo GPS Navigation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full turn-by-turn navigation with real GPS or simulated movement mode, complete with dynamic off-route detection and instant recalculation.
            </p>
          </div>
        </div>

        {/* Demo Preset Quick-Start Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-white flex items-center justify-center md:justify-start space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Demonstration Presets Included</span>
            </h4>
            <p className="text-xs text-slate-400">
              Test Home → College, Railway Station, or Airport routes immediately without needing GPS.
            </p>
          </div>

          <Link
            href="/map?preset=home_college"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow transition-colors whitespace-nowrap"
          >
            Launch Home → College Demo
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        Smart Journey Assistant v1.0 • Built with Next.js, Leaflet, and AI Scoring Engine
      </footer>
    </div>
  );
}
