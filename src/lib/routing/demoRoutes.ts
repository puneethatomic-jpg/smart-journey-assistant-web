import { LocationPoint, RouteOption, TravelMode, RoutePreference } from '@/types';
import { scoreRoutes } from './scoringEngine';

// Major Indian Cities & Key Preset Locations
export const INDIA_MAP_CENTER: [number, number] = [20.5937, 78.9629];

export const DEMO_PRESET_LOCATIONS: Record<string, LocationPoint> = {
  bengaluru: {
    id: 'loc-bengaluru',
    name: 'Bengaluru (Koramangala / MG Road)',
    address: 'City Center, Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    type: 'home',
  },
  mysuru: {
    id: 'loc-mysuru',
    name: 'Mysuru Palace',
    address: 'Sayyaji Rao Rd, Mysuru, Karnataka',
    lat: 12.3052,
    lng: 76.6552,
    type: 'destination',
  },
  mumbai: {
    id: 'loc-mumbai',
    name: 'Mumbai (Bandra Kurla Complex)',
    address: 'BKC Commercial Hub, Maharashtra',
    lat: 19.0600,
    lng: 72.8700,
    type: 'home',
  },
  pune: {
    id: 'loc-pune',
    name: 'Pune (Hinjawadi IT Park)',
    address: 'Hinjawadi Phase 1, Pune, Maharashtra',
    lat: 18.5912,
    lng: 73.7389,
    type: 'destination',
  },
  delhi: {
    id: 'loc-delhi',
    name: 'New Delhi (Connaught Place)',
    address: 'Central Delhi, National Capital Region',
    lat: 28.6315,
    lng: 77.2167,
    type: 'home',
  },
  agra: {
    id: 'loc-agra',
    name: 'Agra (Taj Mahal Zone)',
    address: 'Dharmapuri, Forest Colony, Agra, UP',
    lat: 27.1751,
    lng: 78.0421,
    type: 'destination',
  },
  chennai: {
    id: 'loc-chennai',
    name: 'Chennai (Anna Salai / Guindy)',
    address: 'Guindy Industrial Area, Tamil Nadu',
    lat: 13.0067,
    lng: 80.2020,
    type: 'home',
  },
  puducherry: {
    id: 'loc-puducherry',
    name: 'Puducherry (White Town / Promenade)',
    address: 'Beach Rd, White Town, Puducherry',
    lat: 11.9338,
    lng: 79.8350,
    type: 'destination',
  },
  hyderabad: {
    id: 'loc-hyderabad',
    name: 'Hyderabad (HITEC City)',
    address: 'Cyberabad, Telangana',
    lat: 17.4435,
    lng: 78.3772,
    type: 'home',
  },
  tirupati: {
    id: 'loc-tirupati',
    name: 'Tirupati / Tirumala Hills',
    address: 'Tirumala Peak Road, Andhra Pradesh',
    lat: 13.6780,
    lng: 79.3500,
    type: 'destination',
  },
  home: {
    id: 'preset-home',
    name: 'Home (Koramangala)',
    address: '100 Feet Rd, Koramangala, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    type: 'home',
  },
  college: {
    id: 'preset-college',
    name: 'University Campus / College',
    address: 'Academic Zone Gate 1',
    lat: 12.9716,
    lng: 77.5946,
    type: 'college',
  },
  station: {
    id: 'preset-station',
    name: 'Central Railway Station',
    address: 'Main Terminal',
    lat: 12.9781,
    lng: 77.5697,
    type: 'destination',
  },
  airport: {
    id: 'preset-airport',
    name: 'International Airport',
    address: 'Terminal 1 Departures',
    lat: 13.1986,
    lng: 77.7066,
    type: 'destination',
  },
};

// Calculate Haversine distance in KM between two lat/lng points
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateDemoRoutes(
  origin: LocationPoint,
  destination: LocationPoint,
  mode: TravelMode = 'car',
  preference: RoutePreference = 'balanced'
): RouteOption[] {
  const straightDistKm = calculateHaversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
  
  // Real road multiplier (~1.25x straight line)
  const baseKm = Math.max(1.5, Number((straightDistKm * 1.25).toFixed(1)));
  
  // Speed factors by mode
  const avgSpeedKmH = mode === 'walk' ? 5 : mode === 'bicycle' ? 16 : mode === 'bike' ? 45 : mode === 'transit' ? 35 : 55;
  const baseMin = Math.max(3, Math.round((baseKm / avgSpeedKmH) * 60));

  // Route A: Main Expressway / Arterial
  const distA = baseKm;
  const timeA = baseMin;
  
  // Route B: Bypass / National Highway (Slightly longer, faster speed)
  const distB = Number((baseKm * 1.12).toFixed(1));
  const timeB = Math.max(2, Math.round(baseMin * 0.88));

  // Route C: Inner City / State Highway (Shortest distance, slower traffic)
  const distC = Number((baseKm * 0.92).toFixed(1));
  const timeC = Math.round(baseMin * 1.25);

  const rawRoutes: Omit<RouteOption, 'score' | 'isRecommended'>[] = [
    {
      id: 'route-main-arterial',
      name: 'Route A — National Highway Corridor (Recommended)',
      distanceKm: distA,
      durationMin: timeA,
      trafficLevel: 'moderate',
      tollCost: baseKm > 30 ? 95 : 0,
      hasHighways: true,
      summary: 'via Primary Highway & Arterial Expressway',
      highlights: ['Smoothest flow', 'Standard highway speeds', 'Well-paved corridor'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + (destination.lat - origin.lat) * 0.25, origin.lng + (destination.lng - origin.lng) * 0.2],
        [origin.lat + (destination.lat - origin.lat) * 0.5, origin.lng + (destination.lng - origin.lng) * 0.45],
        [origin.lat + (destination.lat - origin.lat) * 0.75, origin.lng + (destination.lng - origin.lng) * 0.8],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: `Head out towards National Highway Tollway`,
          maneuver: 'start',
          distanceMeters: Math.round(distA * 200),
          durationSeconds: Math.round(timeA * 12),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: `Continue on Primary Arterial Highway for ${(distA * 0.6).toFixed(1)} km`,
          maneuver: 'straight',
          distanceMeters: Math.round(distA * 600),
          durationSeconds: Math.round(timeA * 36),
          location: [origin.lat + (destination.lat - origin.lat) * 0.5, origin.lng + (destination.lng - origin.lng) * 0.45],
        },
        {
          instruction: `Take destination exit ramp towards ${destination.name}`,
          maneuver: 'turn-right',
          distanceMeters: Math.round(distA * 200),
          durationSeconds: Math.round(timeA * 12),
          location: [destination.lat, destination.lng],
        },
        {
          instruction: `Arrive at ${destination.name}`,
          maneuver: 'arrive',
          distanceMeters: 100,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-expressway-bypass',
      name: 'Route B — Outer Ring Expressway (Fastest)',
      distanceKm: distB,
      durationMin: timeB,
      trafficLevel: 'low',
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : baseKm > 20 ? 120 : 40,
      hasHighways: true,
      summary: 'via Ring Road Expressway & Bypass Corridor',
      highlights: [`Fastest arrival time (${timeB} min)`, 'Low traffic congestion', 'Open expressway'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + (destination.lat - origin.lat) * 0.2 + 0.03, origin.lng + (destination.lng - origin.lng) * 0.3 + 0.04],
        [origin.lat + (destination.lat - origin.lat) * 0.6 + 0.04, origin.lng + (destination.lng - origin.lng) * 0.7 + 0.03],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Merge onto Outer Expressway Flyover',
          maneuver: 'start',
          distanceMeters: Math.round(distB * 300),
          durationSeconds: Math.round(timeB * 15),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Maintain 80 km/h cruising speed on Bypass Highway',
          maneuver: 'straight',
          distanceMeters: Math.round(distB * 600),
          durationSeconds: Math.round(timeB * 35),
          location: [origin.lat + (destination.lat - origin.lat) * 0.6 + 0.04, origin.lng + (destination.lng - origin.lng) * 0.7 + 0.03],
        },
        {
          instruction: `Arrive at ${destination.name}`,
          maneuver: 'arrive',
          distanceMeters: 100,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-inner-city',
      name: 'Route C — Direct State Highway (Shortest)',
      distanceKm: distC,
      durationMin: timeC,
      trafficLevel: 'heavy',
      tollCost: 0,
      hasHighways: false,
      summary: 'via Central Link & Town Roads',
      highlights: [`Shortest distance (${distC} km)`, 'Toll free', 'Market signals'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + (destination.lat - origin.lat) * 0.3 - 0.02, origin.lng + (destination.lng - origin.lng) * 0.3 - 0.02],
        [origin.lat + (destination.lat - origin.lat) * 0.7 - 0.01, origin.lng + (destination.lng - origin.lng) * 0.7 - 0.01],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Head straight on Central State Corridor',
          maneuver: 'start',
          distanceMeters: Math.round(distC * 400),
          durationSeconds: Math.round(timeC * 20),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Cross Old City Junction signals',
          maneuver: 'straight',
          distanceMeters: Math.round(distC * 500),
          durationSeconds: Math.round(timeC * 35),
          location: [origin.lat + (destination.lat - origin.lat) * 0.7 - 0.01, origin.lng + (destination.lng - origin.lng) * 0.7 - 0.01],
        },
        {
          instruction: `Arrive at ${destination.name}`,
          maneuver: 'arrive',
          distanceMeters: 100,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
  ];

  return scoreRoutes(rawRoutes, preference);
}
