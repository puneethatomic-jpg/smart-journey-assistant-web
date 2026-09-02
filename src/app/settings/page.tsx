'use client';

import React, { useState, useEffect } from 'react';
import { getUserPreferences, updateUserPreferences, clearJourneyHistory } from '@/lib/storage/localStorage';
import { Settings, Shield, Sliders, Trash2, CheckCircle2 } from 'lucide-react';
import { TravelMode, RoutePreference } from '@/types';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(getUserPreferences());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (updated: Partial<typeof prefs>) => {
    const res = updateUserPreferences(updated);
    setPrefs(res);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleClearHistory = () => {
    if (confirm('Delete all stored journey data?')) {
      clearJourneyHistory();
      alert('Journey history permanently removed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full text-white space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-sky-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs text-slate-400">Configure route scoring weights, preferences, and privacy controls</p>
      </div>

      {savedMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl flex items-center space-x-2 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Default Travel Mode */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <h3 className="font-bold text-sm text-sky-400 flex items-center space-x-2">
          <Sliders className="w-4 h-4" />
          <span>Default Travel Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Preferred Travel Mode</label>
            <select
              value={prefs.preferredMode}
              onChange={(e) => handleSave({ preferredMode: e.target.value as TravelMode })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="car">🚗 Car</option>
              <option value="bike">🏍 Motorcycle / Two-wheeler</option>
              <option value="walk">🚶 Walking</option>
              <option value="bicycle">🚲 Bicycle</option>
              <option value="transit">🚌 Public Transit</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Default Route Preference</label>
            <select
              value={prefs.routePreference}
              onChange={(e) => handleSave({ routePreference: e.target.value as RoutePreference })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="balanced">Balanced (Optimal overall)</option>
              <option value="fastest">Fastest (Minimum time)</option>
              <option value="shortest">Shortest (Minimum distance)</option>
              <option value="avoid_tolls">Avoid Tolls</option>
              <option value="avoid_highways">Avoid Highways</option>
              <option value="eco">Eco-Friendly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Location Settings */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Privacy & Geolocation Controls</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-slate-200 block">Allow Browser Location Access</span>
              <span className="text-slate-400 text-[11px]">Used exclusively for active route calculations</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.allowLocation}
              onChange={(e) => handleSave({ allowLocation: e.target.checked })}
              className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-slate-200 block">Enable Demo GPS Simulation Fallback</span>
              <span className="text-slate-400 text-[11px]">Provides predefined location paths when physical GPS is offline</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.demoMode}
              onChange={(e) => handleSave({ demoMode: e.target.checked })}
              className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleClearHistory}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Stored Location & Journey Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
