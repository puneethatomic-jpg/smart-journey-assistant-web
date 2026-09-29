'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser, getSavedPlaces, savePlace, deleteSavedPlace, getJourneyHistory, clearJourneyHistory } from '@/lib/storage/localStorage';
import SavedPlacesList from '@/components/places/SavedPlacesList';
import JourneyHistoryList from '@/components/journey/JourneyHistoryList';
import { UserProfile, SavedPlace, Journey } from '@/types';
import { User, Mail, Calendar, LogOut, Bookmark, History, Shield, CheckCircle2 } from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const [currentUser, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'history'>('overview');

  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      // If user not logged in, direct them to login
      router.push('/login');
      return;
    }
    setUser(u);
    setPlaces(getSavedPlaces());
    setJourneys(getJourneyHistory());
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleSelectPlaceAsDestination = (place: SavedPlace) => {
    router.push(`/map?preset=custom&dest=${encodeURIComponent(place.name)}`);
  };

  const handleAddPlace = (newPlace: Omit<SavedPlace, 'id' | 'createdAt'>) => {
    savePlace(newPlace);
    setPlaces(getSavedPlaces());
  };

  const handleDeletePlace = (id: string) => {
    deleteSavedPlace(id);
    setPlaces(getSavedPlaces());
  };

  const handleClearHistory = () => {
    if (confirm('Clear all journey history logs?')) {
      clearJourneyHistory();
      setJourneys([]);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full text-white space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-sky-500/20">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
              <span>{currentUser.name}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentUser.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Member since {new Date(currentUser.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('places')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'places'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Places ({places.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'history'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Journey Logs ({journeys.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Saved Places</span>
            <div className="text-3xl font-black text-sky-400">{places.length}</div>
            <p className="text-xs text-slate-400">Quick locations for 1-click routing</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Completed Journeys</span>
            <div className="text-3xl font-black text-emerald-400">{journeys.length}</div>
            <p className="text-xs text-slate-400">Log entries with travel efficiency scores</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Account Status</span>
            <div className="text-3xl font-black text-purple-400">Verified</div>
            <p className="text-xs text-slate-400">AI Route Optimization Enabled</p>
          </div>
        </div>
      )}

      {activeTab === 'places' && (
        <SavedPlacesList
          places={places}
          onSelectPlaceAsDestination={handleSelectPlaceAsDestination}
          onAddPlace={handleAddPlace}
          onDeletePlace={handleDeletePlace}
        />
      )}

      {activeTab === 'history' && (
        <JourneyHistoryList journeys={journeys} onClearHistory={handleClearHistory} />
      )}
    </div>
  );
}
