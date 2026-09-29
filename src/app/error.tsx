'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled App Exception:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="bg-slate-900 border border-rose-500/30 p-8 sm:p-10 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 mx-auto flex items-center justify-center shadow-xl">
          <AlertTriangle className="w-8 h-8 text-rose-400 font-black" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Something Went Wrong</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            An unexpected error occurred while processing route calculations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4 text-sky-400" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
