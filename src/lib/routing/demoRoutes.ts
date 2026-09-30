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
  const avgSpeedKmH = mode === 'walk' ? 5 : mode === 'bicycle' ? 16 : mode === 'bike' ? 48 : mode === 'transit' ? 36 : 58;
  const baseMin = Math.max(3, Math.round((baseKm / avgSpeedKmH) * 60));

  // Route 1: Main National Highway (AI Recommended)
  const dist1 = baseKm;
  const time1 = baseMin;

  // Route 2: Outer Expressway Bypass (Zero Traffic Area / High Speed)
  const dist2 = Number((baseKm * 1.10).toFixed(1));
  const time2 = Math.max(2, Math.round(baseMin * 0.82));

  // Route 3: Green Eco Corridor (Less Traffic Area / Fuel Saver)
  const dist3 = Number((baseKm * 1.05).toFixed(1));
  const time3 = Math.max(3, Math.round(baseMin * 0.95));

  // Route 4: Old State Highway (Shortest Distance / Bad Road Warning)
  const dist4 = Number((baseKm * 0.90).toFixed(1));
  const time4 = Math.round(baseMin * 1.30);

  // Route 5: Scenic EV Charging Link (No Traffic Area)
  const dist5 = Number((baseKm * 1.15).toFixed(1));
  const time5 = Math.round(baseMin * 0.92);

  // Perpendicular offset helpers for distinct map polylines
  const dLat = destination.lat - origin.lat;
  const dLng = destination.lng - origin.lng;

  const rawRoutes: Omit<RouteOption, 'score' | 'isRecommended'>[] = [
    {
      id: 'route-ai-recommended',
      name: 'Route 1 — National Expressway Corridor',
      distanceKm: dist1,
      durationMin: time1,
      trafficLevel: 'low',
      trafficZoneLabel: '🟡 Less Traffic Area (Steady Highway Flow)',
      roadQuality: 'excellent',
      roadQualityLabel: '✨ Good Road (Smooth 6-Lane Expressway)',
      roadQualityScore: 96,
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : baseKm > 25 ? 90 : 0,
      hasHighways: true,
      summary: 'via Central National Corridor • Best Balanced Efficiency',
      highlights: ['✨ Good Road Quality (96%)', '🟡 Less Traffic Corridor', 'Standard Highway Cruising'],
      tags: ['AI Recommended', 'Good Road', 'Less Traffic Area'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + dLat * 0.25, origin.lng + dLng * 0.22],
        [origin.lat + dLat * 0.50, origin.lng + dLng * 0.48],
        [origin.lat + dLat * 0.75, origin.lng + dLng * 0.78],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: `Head out towards National Highway Corridor`,
          maneuver: 'start',
          distanceMeters: Math.round(dist1 * 200),
          durationSeconds: Math.round(time1 * 12),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: `Continue on 6-Lane Expressway for ${(dist1 * 0.6).toFixed(1)} km`,
          maneuver: 'straight',
          distanceMeters: Math.round(dist1 * 600),
          durationSeconds: Math.round(time1 * 36),
          location: [origin.lat + dLat * 0.5, origin.lng + dLng * 0.48],
        },
        {
          instruction: `Take exit ramp towards ${destination.name}`,
          maneuver: 'turn-right',
          distanceMeters: Math.round(dist1 * 200),
          durationSeconds: Math.round(time1 * 12),
          location: [destination.lat, destination.lng],
        },
        {
          instruction: `Arrive at destination: ${destination.name}`,
          maneuver: 'arrive',
          distanceMeters: 100,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-no-traffic-bypass',
      name: 'Route 2 — Outer Ring Expressway Bypass',
      distanceKm: dist2,
      durationMin: time2,
      trafficLevel: 'none',
      trafficZoneLabel: '🟢 No Traffic Area (Free-Flow High-Speed Bypass)',
      roadQuality: 'excellent',
      roadQualityLabel: '✨ Good Road (High-Speed Asphalt Pavement)',
      roadQualityScore: 98,
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : baseKm > 20 ? 115 : 40,
      hasHighways: true,
      summary: 'via Outer Expressway • Zero Congestion & Maximum Cruising Speed',
      highlights: ['🟢 No Traffic Area', '✨ Good Road Quality (98%)', `Fastest ETA (${time2} min)`],
      tags: ['No Traffic Area', 'Good Road', 'Fastest Speed'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + dLat * 0.25 + 0.035, origin.lng + dLng * 0.30 + 0.045],
        [origin.lat + dLat * 0.60 + 0.045, origin.lng + dLng * 0.70 + 0.035],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Merge smoothly onto Outer Ring Expressway Flyover',
          maneuver: 'start',
          distanceMeters: Math.round(dist2 * 300),
          durationSeconds: Math.round(time2 * 15),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Maintain 90 km/h cruising on free-flow Bypass Corridor',
          maneuver: 'straight',
          distanceMeters: Math.round(dist2 * 600),
          durationSeconds: Math.round(time2 * 35),
          location: [origin.lat + dLat * 0.6 + 0.045, origin.lng + dLng * 0.7 + 0.035],
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
      id: 'route-eco-green-corridor',
      name: 'Route 3 — Green Arterial Corridor (Eco-Saver)',
      distanceKm: dist3,
      durationMin: time3,
      trafficLevel: 'low',
      trafficZoneLabel: '🟡 Less Traffic Area (Steady Suburban Speed)',
      roadQuality: 'good',
      roadQualityLabel: '✨ Good Road (Freshly Paved Arterial)',
      roadQualityScore: 89,
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : baseKm > 30 ? 45 : 0,
      hasHighways: true,
      summary: 'via Green Linkway • Low Fuel Burn & Relaxed Drive',
      highlights: ['🟡 Less Traffic Area', '18% Lower Fuel Burn', '✨ Good Road (89%)'],
      tags: ['Less Traffic Area', 'Good Road', 'Eco-Saver'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + dLat * 0.30 - 0.025, origin.lng + dLng * 0.25 - 0.035],
        [origin.lat + dLat * 0.65 - 0.020, origin.lng + dLng * 0.65 - 0.025],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Take Green Eco Link Avenue towards South Bypass',
          maneuver: 'start',
          distanceMeters: Math.round(dist3 * 250),
          durationSeconds: Math.round(time3 * 15),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Drive at constant eco-speed (60-70 km/h) through tree-lined avenue',
          maneuver: 'straight',
          distanceMeters: Math.round(dist3 * 650),
          durationSeconds: Math.round(time3 * 40),
          location: [origin.lat + dLat * 0.65 - 0.02, origin.lng + dLng * 0.65 - 0.025],
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
      id: 'route-bad-road-warning',
      name: 'Route 4 — Old State Road (Shortest • Caution: Bad Road)',
      distanceKm: dist4,
      durationMin: time4,
      trafficLevel: 'heavy',
      trafficZoneLabel: '🔴 Dense Traffic Area (Town Junctions)',
      roadQuality: 'bad',
      roadQualityLabel: '⚠️ Bad Road (Patchy Surface & Potholes Reported)',
      roadQualityScore: 45,
      tollCost: 0,
      hasHighways: false,
      summary: 'via Old Town Highway • 100% Toll-Free but Uneven Pavement',
      highlights: ['⚠️ Bad Road Warning', 'Shortest Distance (Toll-Free)', 'Pothole patches reported'],
      tags: ['Shortest Distance', 'Toll-Free', 'Bad Road Warning'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + dLat * 0.20 - 0.045, origin.lng + dLng * 0.15 - 0.040],
        [origin.lat + dLat * 0.50 - 0.050, origin.lng + dLng * 0.45 - 0.045],
        [origin.lat + dLat * 0.80 - 0.030, origin.lng + dLng * 0.80 - 0.025],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Enter Old State Road (Caution: uneven road surface)',
          maneuver: 'start',
          distanceMeters: Math.round(dist4 * 300),
          durationSeconds: Math.round(time4 * 20),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Proceed cautiously over patchy asphalt sector for 8.5 km',
          maneuver: 'straight',
          distanceMeters: Math.round(dist4 * 500),
          durationSeconds: Math.round(time4 * 45),
          location: [origin.lat + dLat * 0.5 - 0.05, origin.lng + dLng * 0.45 - 0.045],
        },
        {
          instruction: `Arrive at destination: ${destination.name}`,
          maneuver: 'arrive',
          distanceMeters: 100,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-ev-scenic-corridor',
      name: 'Route 5 — Scenic Expressway Link (EV Hubs)',
      distanceKm: dist5,
      durationMin: time5,
      trafficLevel: 'none',
      trafficZoneLabel: '🟢 No Traffic Area (Scenic Valley Route)',
      roadQuality: 'good',
      roadQualityLabel: '✨ Good Road (Smooth Elevated Highway)',
      roadQualityScore: 92,
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : 50,
      hasHighways: true,
      summary: 'via Elevated Scenic Link • Multiple EV Fast Chargers & Smooth Tarmac',
      highlights: ['🟢 No Traffic Area', '✨ Good Road (92%)', 'EV Fast Charging Stations'],
      tags: ['EV Optimized', 'Good Road', 'No Traffic Area'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + dLat * 0.35 + 0.055, origin.lng + dLng * 0.25 + 0.060],
        [origin.lat + dLat * 0.70 + 0.060, origin.lng + dLng * 0.60 + 0.055],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Head onto Scenic Elevated Bypass',
          maneuver: 'start',
          distanceMeters: Math.round(dist5 * 250),
          durationSeconds: Math.round(time5 * 12),
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Pass EV High-Power Charging Plaza at km 35',
          maneuver: 'straight',
          distanceMeters: Math.round(dist5 * 650),
          durationSeconds: Math.round(time5 * 38),
          location: [origin.lat + dLat * 0.7 + 0.06, origin.lng + dLng * 0.6 + 0.055],
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
