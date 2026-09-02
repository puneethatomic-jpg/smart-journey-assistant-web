'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { LocationPoint, RouteOption } from '@/types';

const InteractiveMap = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Initializing Interactive Map Engine...</span>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  origin: LocationPoint;
  destination: LocationPoint | null;
  waypoints?: LocationPoint[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  currentVehiclePos?: [number, number] | null;
  onSelectRoute?: (routeId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <InteractiveMap {...props} />;
}
