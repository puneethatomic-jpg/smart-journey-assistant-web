'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser, registerUser, loginUser } from '@/lib/storage/localStorage';
import { UserProfile } from '@/types';
import { Compass, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [currentUser, setUser] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setUser(getCurrentUser());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold">Loading Smart Journey Assistant...</span>
        </div>
      </div>
    );
  }

  // If user is logged in, render the website content
  if (currentUser) {
    return <>{children}</>;
  }

  // Mandatory Full-Screen Registration & Login Gate
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-sky-500/20">
            <Compass className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            User Registration Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Please register or sign in below to unlock Smart Journey Assistant.
          </p>
        </div>

        {/* Clean Registration / Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isRegisterMode ? 'User Registration Format' : 'Account Sign In'}
            </span>

            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-sky-400 hover:underline font-bold"
            >
              {isRegisterMode ? 'Switch to Login' : 'Switch to Registration'}
            </button>
          </div>

          {isRegisterMode && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-xl transition-transform active:scale-95 text-xs flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isRegisterMode ? 'COMPLETE REGISTRATION & ENTER WEBSITE' : 'SIGN IN & ENTER WEBSITE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
