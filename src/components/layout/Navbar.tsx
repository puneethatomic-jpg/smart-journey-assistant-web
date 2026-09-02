'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Navigation, Bookmark, History, Settings, PlayCircle, MapPin } from 'lucide-react';

interface NavbarProps {
  onTriggerDemoPreset?: (key: string) => void;
}

export default function Navbar({ onTriggerDemoPreset }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Route Planner', path: '/map', icon: Navigation },
    { label: 'Saved Places', path: '/places', icon: Bookmark },
    { label: 'Journey History', path: '/history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-sky-400">
                Smart Journey
              </span>
              <span className="text-xs text-sky-400 block -mt-1 font-semibold">AI Route Assistant v1.0</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path === '/map' && pathname === '/');
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Demo Action Bar */}
          <div className="flex items-center space-x-2">
            {onTriggerDemoPreset && (
              <div className="hidden lg:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 px-2 font-medium flex items-center">
                  <PlayCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Demo Scenarios:
                </span>
                <button
                  onClick={() => onTriggerDemoPreset('home_college')}
                  className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-sky-600 text-slate-200 hover:text-white rounded transition-colors"
                >
                  🎓 Home → College
                </button>
                <button
                  onClick={() => onTriggerDemoPreset('home_station')}
                  className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-sky-600 text-slate-200 hover:text-white rounded transition-colors"
                >
                  🚆 Station
                </button>
                <button
                  onClick={() => onTriggerDemoPreset('home_airport')}
                  className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-sky-600 text-slate-200 hover:text-white rounded transition-colors"
                >
                  ✈ Airport
                </button>
              </div>
            )}

            <Link
              href="/map"
              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Plan Route</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
