'use client';

import React, { useState } from 'react';
import { SavedPlace } from '@/types';
import { Home, GraduationCap, Briefcase, Star, MapPin, Plus, Trash2, Navigation } from 'lucide-react';

interface SavedPlacesProps {
  places: SavedPlace[];
  onSelectPlaceAsDestination: (place: SavedPlace) => void;
  onAddPlace: (place: Omit<SavedPlace, 'id' | 'createdAt'>) => void;
  onDeletePlace: (id: string) => void;
}

export default function SavedPlacesList({
  places,
  onSelectPlaceAsDestination,
  onAddPlace,
  onDeletePlace,
}: SavedPlacesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<SavedPlace['type']>('favorite');

  const getPlaceIcon = (t: string) => {
    switch (t) {
      case 'home':
        return <Home className="w-5 h-5 text-sky-400" />;
      case 'college':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case 'work':
        return <Briefcase className="w-5 h-5 text-amber-400" />;
      default:
        return <Star className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    // Simulate geocoded lat/lng near default center
    onAddPlace({
      name,
      address,
      type,
      lat: 12.9716 + (Math.random() * 0.04 - 0.02),
      lng: 77.5946 + (Math.random() * 0.04 - 0.02),
    });

    setName('');
    setAddress('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Saved Places</h2>
          <p className="text-xs text-slate-400">Quickly route to your frequent destinations</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Place</span>
        </button>
      </div>

      {/* Add Place Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-sky-500/30 p-4 rounded-xl space-y-3">
          <h3 className="text-sm font-bold text-sky-400">Save New Location</h3>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Place Name</label>
            <input
              type="text"
              placeholder="e.g. Gym, Library, Friend's House"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Address / Location</label>
            <input
              type="text"
              placeholder="Full address or area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SavedPlace['type'])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="home">Home 🏠</option>
              <option value="college">College 🎓</option>
              <option value="work">Work 💼</option>
              <option value="favorite">Favorite ⭐</option>
              <option value="custom">Custom 📍</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded text-xs"
            >
              Save Location
            </button>
          </div>
        </form>
      )}

      {/* Grid of Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex items-start justify-between group transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getPlaceIcon(place.type)}
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm group-hover:text-sky-400 transition-colors">
                  {place.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{place.address}</p>
                <span className="inline-block mt-2 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded capitalize">
                  {place.type}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => onSelectPlaceAsDestination(place)}
                title="Route to this location"
                className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors"
              >
                <Navigation className="w-4 h-4" />
              </button>

              {place.id.startsWith('place-') && !['place-home', 'place-college'].includes(place.id) && (
                <button
                  onClick={() => onDeletePlace(place.id)}
                  title="Delete place"
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
