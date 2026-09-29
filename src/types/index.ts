export type TravelMode = 'car' | 'bike' | 'walk' | 'bicycle' | 'transit';

export type RoutePreference = 
  | 'fastest' 
  | 'shortest' 
  | 'avoid_tolls' 
  | 'avoid_highways' 
  | 'balanced' 
  | 'eco';

export type TrafficLevel = 'low' | 'moderate' | 'heavy';

export interface LocationPoint {
  id?: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  type?: 'current' | 'destination' | 'home' | 'college' | 'work' | 'favorite' | 'waypoint' | 'custom';
}

export interface NavigationStep {
  instruction: string;
  maneuver: 'start' | 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'u-turn' | 'arrive';
  distanceMeters: number;
  durationSeconds: number;
  location: [number, number]; // [lat, lng]
}

export interface RouteScore {
  overallScore: number;
  timeScore: number;
  distanceScore: number;
  trafficScore: number;
  tollScore: number;
  preferenceScore: number;
  reasoning: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMin: number;
  trafficLevel: TrafficLevel;
  tollCost: number;
  hasHighways: boolean;
  score: RouteScore;
  isRecommended: boolean;
  polyline: [number, number][]; // Array of [lat, lng]
  steps: NavigationStep[];
  highlights: string[];
  summary: string;
}

export interface Journey {
  id: string;
  origin: LocationPoint;
  destination: LocationPoint;
  waypoints?: LocationPoint[];
  travelMode: TravelMode;
  preference: RoutePreference;
  selectedRoute: RouteOption;
  alternativeRoutes: RouteOption[];
  startedAt: string;
  completedAt?: string;
  status: 'planning' | 'active' | 'completed';
  progressPercent: number;
  remainingDistanceKm: number;
  remainingDurationMin: number;
  currentLocation?: LocationPoint;
  currentStepIndex: number;
  isOffRoute?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserPreference {
  preferredMode: TravelMode;
  routePreference: RoutePreference;
  avoidTolls: boolean;
  avoidHighways: boolean;
  allowLocation: boolean;
  demoMode: boolean;
}

export interface SavedPlace {

  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'home' | 'college' | 'work' | 'favorite' | 'custom';
  createdAt: string;
}

export interface ScoringWeights {
  time: number;       // e.g. 0.40
  traffic: number;    // e.g. 0.25
  distance: number;   // e.g. 0.15
  toll: number;       // e.g. 0.10
  preference: number; // e.g. 0.10
}
