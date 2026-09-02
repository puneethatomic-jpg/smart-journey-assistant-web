import { LocationPoint, RouteOption, TravelMode, RoutePreference } from '@/types';
import { scoreRoutes } from './scoringEngine';

export const DEMO_PRESET_LOCATIONS: Record<string, LocationPoint> = {
  home: {
    id: 'preset-home',
    name: 'Home (Koramangala / City Center)',
    address: '100 Feet Rd, Koramangala 4th Block, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    type: 'home',
  },
  college: {
    id: 'preset-college',
    name: 'University Campus / College',
    address: 'University Main Gate, Academic Zone',
    lat: 12.9716,
    lng: 77.5946,
    type: 'college',
  },
  station: {
    id: 'preset-station',
    name: 'Central Railway Station',
    address: 'Station Road, City Railway Terminal',
    lat: 12.9781,
    lng: 77.5697,
    type: 'destination',
  },
  airport: {
    id: 'preset-airport',
    name: 'International Airport',
    address: 'Terminal 1, Departure Rd',
    lat: 13.1986,
    lng: 77.7066,
    type: 'destination',
  },
  bus_stand: {
    id: 'preset-bus',
    name: 'Central Bus Stand',
    address: 'Majestic Bus Station, Sector 2',
    lat: 12.9767,
    lng: 77.5713,
    type: 'destination',
  },
};

export function generateDemoRoutes(
  origin: LocationPoint,
  destination: LocationPoint,
  mode: TravelMode = 'car',
  preference: RoutePreference = 'balanced'
): RouteOption[] {
  const modeSpeedFactor = mode === 'walk' ? 4 : mode === 'bicycle' ? 2.5 : mode === 'bike' ? 0.85 : 1.0;

  // Generate 3 distinct realistic alternative routes
  const rawRoutes: Omit<RouteOption, 'score' | 'isRecommended'>[] = [
    {
      id: 'route-recommended',
      name: 'Route A — Main Arterial (Recommended)',
      distanceKm: 8.4,
      durationMin: Math.round(22 * modeSpeedFactor),
      trafficLevel: 'moderate',
      tollCost: 0,
      hasHighways: false,
      summary: 'via MG Road & University Express Avenue',
      highlights: ['Smoothest flow', 'Toll free', 'Easy signals'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + 0.008, origin.lng + 0.005],
        [origin.lat + 0.015, origin.lng - 0.003],
        [origin.lat + 0.024, origin.lng - 0.012],
        [destination.lat - 0.006, destination.lng + 0.004],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Head North on Main Boulevard towards 100 Ft Rd',
          maneuver: 'start',
          distanceMeters: 500,
          durationSeconds: 90,
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Turn left onto MG Road Arterial Highway',
          maneuver: 'turn-left',
          distanceMeters: 2400,
          durationSeconds: 380,
          location: [origin.lat + 0.008, origin.lng + 0.005],
        },
        {
          instruction: 'Slight right onto University Express Avenue',
          maneuver: 'slight-right',
          distanceMeters: 3500,
          durationSeconds: 520,
          location: [origin.lat + 0.015, origin.lng - 0.003],
        },
        {
          instruction: 'Turn right at Campus Gate Entrance',
          maneuver: 'turn-right',
          distanceMeters: 1800,
          durationSeconds: 290,
          location: [origin.lat + 0.024, origin.lng - 0.012],
        },
        {
          instruction: 'You will arrive at your destination on the right',
          maneuver: 'arrive',
          distanceMeters: 200,
          durationSeconds: 40,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-fastest',
      name: 'Route B — Outer Ring Bypass (Fastest)',
      distanceKm: 9.6,
      durationMin: Math.round(19 * modeSpeedFactor),
      trafficLevel: 'low',
      tollCost: mode === 'walk' || mode === 'bicycle' ? 0 : 40,
      hasHighways: true,
      summary: 'via Elevated Expressway Corridor',
      highlights: ['Fastest arrival time', 'Open highway stretch', 'Requires toll ₹40'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + 0.003, origin.lng + 0.015],
        [origin.lat + 0.020, origin.lng + 0.018],
        [origin.lat + 0.032, origin.lng + 0.002],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Take the slip road onto Elevated Expressway (Toll)',
          maneuver: 'start',
          distanceMeters: 1200,
          durationSeconds: 150,
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Continue straight on Bypass Highway for 6.5 km',
          maneuver: 'straight',
          distanceMeters: 6500,
          durationSeconds: 600,
          location: [origin.lat + 0.020, origin.lng + 0.018],
        },
        {
          instruction: 'Exit towards University West Flyover',
          maneuver: 'slight-left',
          distanceMeters: 1700,
          durationSeconds: 280,
          location: [origin.lat + 0.032, origin.lng + 0.002],
        },
        {
          instruction: 'Arrive at destination',
          maneuver: 'arrive',
          distanceMeters: 200,
          durationSeconds: 30,
          location: [destination.lat, destination.lng],
        },
      ],
    },
    {
      id: 'route-shortest',
      name: 'Route C — Inner City Link (Shortest)',
      distanceKm: 7.2,
      durationMin: Math.round(27 * modeSpeedFactor),
      trafficLevel: 'heavy',
      tollCost: 0,
      hasHighways: false,
      summary: 'via Central Market & Heritage Street',
      highlights: ['Minimum distance (7.2 km)', 'Heavy market traffic', 'Narrow roads'],
      polyline: [
        [origin.lat, origin.lng],
        [origin.lat + 0.004, origin.lng - 0.008],
        [origin.lat + 0.011, origin.lng - 0.014],
        [origin.lat + 0.022, origin.lng - 0.005],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          instruction: 'Head West into Central Market Road',
          maneuver: 'start',
          distanceMeters: 800,
          durationSeconds: 200,
          location: [origin.lat, origin.lng],
        },
        {
          instruction: 'Turn right onto Heritage Street',
          maneuver: 'turn-right',
          distanceMeters: 3200,
          durationSeconds: 700,
          location: [origin.lat + 0.004, origin.lng - 0.008],
        },
        {
          instruction: 'Cross Old City Junction',
          maneuver: 'straight',
          distanceMeters: 3000,
          durationSeconds: 650,
          location: [origin.lat + 0.022, origin.lng - 0.005],
        },
        {
          instruction: 'Arrive at Destination',
          maneuver: 'arrive',
          distanceMeters: 200,
          durationSeconds: 50,
          location: [destination.lat, destination.lng],
        },
      ],
    },
  ];

  return scoreRoutes(rawRoutes, preference);
}
