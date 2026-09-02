'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SavedPlacesList from '@/components/places/SavedPlacesList';
import { getSavedPlaces, savePlace, deleteSavedPlace } from '@/lib/storage/localStorage';
import { SavedPlace } from '@/types';

export default function PlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    setPlaces(getSavedPlaces());
  }, []);

  const handleSelectAsDestination = (place: SavedPlace) => {
    router.push(`/map?preset=custom&dest=${encodeURIComponent(place.name)}`);
  };

  const handleAdd = (newPlace: Omit<SavedPlace, 'id' | 'createdAt'>) => {
    const created = savePlace(newPlace);
    setPlaces(getSavedPlaces());
  };

  const handleDelete = (id: string) => {
    deleteSavedPlace(id);
    setPlaces(getSavedPlaces());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <SavedPlacesList
        places={places}
        onSelectPlaceAsDestination={handleSelectAsDestination}
        onAddPlace={handleAdd}
        onDeletePlace={handleDelete}
      />
    </div>
  );
}
