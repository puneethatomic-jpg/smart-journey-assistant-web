'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, RouteOption } from '@/types';

// Fix default Leaflet icon paths in React
const createCustomIcon = (color: string, label?: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">${label || ''}</div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const userIcon = L.divIcon({
  className: 'user-marker-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const vehicleIcon = L.divIcon({
  className: 'vehicle-marker-icon',
  html: `<div style="font-size: 14px;">🚗</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const originIcon = createCustomIcon('#0284c7', 'A');
const destIcon = createCustomIcon('#ef4444', 'B');
const waypointIcon = createCustomIcon('#a855f7', '+');

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
}

function MapBoundsUpdater({
  origin,
  destination,
  routes,
}: {
  origin?: LocationPoint;
  destination?: LocationPoint | null;
  routes?: RouteOption[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const points: [number, number][] = [];

    if (origin) points.push([origin.lat, origin.lng]);
    if (destination) points.push([destination.lat, destination.lng]);

    if (routes && routes.length > 0) {
      routes.forEach((r) => {
        r.polyline.forEach((pt) => points.push(pt));
      });
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [map, origin, destination, routes]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !onMapClick) return;
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onMapClick]);
  return null;
}

interface MapProps {
  origin: LocationPoint;
  destination: LocationPoint | null;
  waypoints?: LocationPoint[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  currentVehiclePos?: [number, number] | null;
  onSelectRoute?: (routeId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function InteractiveMap({
  origin,
  destination,
  waypoints = [],
  routes,
  selectedRouteId,
  currentVehiclePos,
  onSelectRoute,
  onMapClick,
}: MapProps) {
  const defaultCenter: [number, number] = [origin.lat, origin.lng];

  return (
    <div className="relative w-full h-full min-h-[450px]">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px] rounded-xl overflow-hidden shadow-inner z-10"
        style={{ height: '100%', width: '100%', minHeight: '450px' }}
      >
        {/* Standard reliable OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup className="text-slate-900 font-semibold">
            <div>
              <span className="text-xs text-sky-600 block font-bold">CURRENT LOCATION / ORIGIN</span>
              {origin.name}
            </div>
          </Popup>
        </Marker>

        {/* Waypoints */}
        {waypoints.map((wp, idx) => (
          <Marker key={`wp-${idx}`} position={[wp.lat, wp.lng]} icon={waypointIcon}>
            <Popup className="text-slate-900 font-semibold">
              <div>
                <span className="text-xs text-purple-600 block font-bold">WAYPOINT #{idx + 1}</span>
                {wp.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination Marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
            <Popup className="text-slate-900 font-semibold">
              <div>
                <span className="text-xs text-red-600 block font-bold">DESTINATION</span>
                {destination.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live / Demo Vehicle Marker */}
        {currentVehiclePos && (
          <Marker position={currentVehiclePos} icon={vehicleIcon}>
            <Popup className="text-slate-900 font-semibold">
              <div>
                <span className="text-xs text-emerald-600 block font-bold">LIVE NAVIGATION</span>
                Simulated Vehicle Position
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polylines */}
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isRecommended = route.isRecommended;

          let color = '#64748b';
          let weight = 4;
          let opacity = 0.6;

          if (isSelected) {
            color = isRecommended ? '#10b981' : '#0284c7';
            weight = 7;
            opacity = 0.95;
          } else if (isRecommended) {
            color = '#059669';
            weight = 5;
            opacity = 0.7;
          }

          return (
            <Polyline
              key={route.id}
              positions={route.polyline}
              pathOptions={{
                color,
                weight,
                opacity,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: isSelected ? undefined : '8, 8',
              }}
              eventHandlers={{
                click: () => onSelectRoute && onSelectRoute(route.id),
              }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-slate-900">{route.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {route.distanceKm} km • {route.durationMin} mins • {route.trafficLevel} traffic
                  </div>
                  {route.isRecommended && (
                    <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      ⭐ Recommended
                    </span>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        <MapResizeHandler />
        <MapBoundsUpdater origin={origin} destination={destination} routes={routes} />
        <MapClickHandler onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}
