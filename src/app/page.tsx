'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Navigation, Zap, Sparkles, MapPin, PlayCircle, User, ArrowRight, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { getCurrentUser, registerUser, loginUser } from '@/lib/storage/localStorage';
import { UserProfile } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setUser] = useState<UserProfile | null>(null);

  // Quick Inline Sign Up / Login Form State
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleQuickAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegisterMode) {
      if (!name) return;
      const u = registerUser(name, email);
      setUser(u);
    } else {
      const u = loginUser(email);
      setUser(u);
    }

    router.push('/map');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
      {/* Glow Background Layer */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-sky-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10 space-y-12">
        {/* Main Hero & User Registration Gate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vision & Intro */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-slate-900 border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-400 shadow-lg">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>AI-POWERED MULTI-FACTOR ROUTE OPTIMIZATION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your Journey.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300">
                Smarter.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Find the best possible route from your location to any destination. We evaluate time, traffic flow, distance, toll fees, travel mode, and personal preferences with AI route explanations.
            </p>

            {currentUser && (
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/map"
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-xl shadow-sky-500/20 flex items-center space-x-2 group"
                >
                  <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>OPEN LIVE ROUTE PLANNER</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/profile"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-5 py-3.5 rounded-xl text-sm transition-colors flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-sky-400" />
                  <span>User Profile</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: User Registration / Sign In Gate Card */}
          <div className="lg:col-span-5 w-full">
            {currentUser ? (
              <div className="bg-slate-900/90 border border-emerald-500/40 p-6 rounded-2xl shadow-2xl space-y-4 text-center">
                <div className="w-14 h-14 bg-gradient-to-tr from-sky-400 to-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Logged In Account</span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/map"
                    className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>GO TO LIVE ROUTE</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-sky-400" />
                    <h3 className="text-base font-extrabold text-white">
                      {isRegisterMode ? 'User Registration' : 'Account Sign In'}
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-xs text-sky-400 hover:underline font-bold"
                  >
                    {isRegisterMode ? 'Sign In instead' : 'Register new account'}
                  </button>
                </div>

                <form onSubmit={handleQuickAuth} className="space-y-3.5">
                  {isRegisterMode && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <span>{isRegisterMode ? 'REGISTER & ENTER WEBSITE' : 'SIGN IN & CONTINUE'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[11px] text-slate-400 text-center">
                  Registration enables personalized route scoring, saved places, and AI explanations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Multi-Factor Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We evaluate travel time (40%), traffic density (25%), distance (15%), tolls (10%), and your preferences (10%).
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Route Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear explanations detailing why a slightly longer route saves time by skipping traffic bottlenecks.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Live & Demo Navigation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn-by-turn navigation with real GPS or simulated movement mode, complete with off-route recalculation.
            </p>
          </div>
        </div>

        {/* Quick Live Route Start Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-white flex items-center justify-center md:justify-start space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore Live Route Planning</span>
            </h4>
            <p className="text-xs text-slate-400">
              Test Home → College, Railway Station, or Airport routes immediately.
            </p>
          </div>

          <Link
            href="/map?preset=home_college"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow transition-colors whitespace-nowrap"
          >
            Launch Home → College Route
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
