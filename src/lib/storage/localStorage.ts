import { Journey, SavedPlace, UserPreference, TravelMode, RoutePreference, UserProfile } from '@/types';

const STORAGE_KEYS = {
  SAVED_PLACES: 'sja_saved_places',
  JOURNEY_HISTORY: 'sja_journey_history',
  USER_PREFERENCES: 'sja_user_preferences',
  CURRENT_USER: 'sja_current_user',
  USERS_LIST: 'sja_registered_users',
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-101',
  name: 'Alex Developer',
  email: 'alex.dev@smartjourney.ai',
  phone: '+1 (555) 019-2834',
  createdAt: new Date().toISOString(),
};

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function registerUser(name: string, email: string): UserProfile {
  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(newUser);

  // Add to list
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_LIST) || '[]');
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify([newUser, ...existing]));
  }

  return newUser;
}

export function loginUser(email: string): UserProfile {
  let existingUser: UserProfile | undefined;
  if (typeof window !== 'undefined') {
    const list: UserProfile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_LIST) || '[]');
    existingUser = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  const user = existingUser || {
    id: `usr-${Date.now()}`,
    name: email.split('@')[0] || 'User',
    email,
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(user);
  return user;
}

export const INITIAL_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'place-home',
    name: 'Home',
    address: '100 Feet Rd, Koramangala 4th Block, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    type: 'home',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'place-college',
    name: 'College / University',
    address: 'University Main Gate, Academic Zone',
    lat: 12.9716,
    lng: 77.5946,
    type: 'college',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'place-work',
    name: 'Tech Park / Work',
    address: 'Embassy TechVillage, Outer Ring Rd',
    lat: 12.9279,
    lng: 77.6917,
    type: 'work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'place-station',
    name: 'Railway Terminal',
    address: 'City Railway Terminal',
    lat: 12.9781,
    lng: 77.5697,
    type: 'favorite',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_USER_PREFERENCES = {
  preferredMode: 'car' as TravelMode,
  routePreference: 'balanced' as RoutePreference,
  avoidTolls: false,
  avoidHighways: false,
  allowLocation: true,
  demoMode: true,
};

export function getSavedPlaces(): SavedPlace[] {
  if (typeof window === 'undefined') return INITIAL_SAVED_PLACES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PLACES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(INITIAL_SAVED_PLACES));
      return INITIAL_SAVED_PLACES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved places from localStorage:', e);
    return INITIAL_SAVED_PLACES;
  }
}

export function savePlace(place: Omit<SavedPlace, 'id' | 'createdAt'>): SavedPlace {
  const existing = getSavedPlaces();
  const newPlace: SavedPlace = {
    ...place,
    id: `place-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newPlace, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(updated));
  }
  return newPlace;
}

export function deleteSavedPlace(id: string): void {
  const existing = getSavedPlaces();
  const updated = existing.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(updated));
  }
}

export function getJourneyHistory(): Journey[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load journey history:', e);
    return [];
  }
}

export function saveJourneyToHistory(journey: Journey): void {
  const existing = getJourneyHistory();
  const filtered = existing.filter((j) => j.id !== journey.id);
  const updated = [journey, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.JOURNEY_HISTORY, JSON.stringify(updated));
  }
}

export function clearJourneyHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.JOURNEY_HISTORY);
  }
}

export function getUserPreferences() {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return raw ? { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_USER_PREFERENCES;
  } catch (e) {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function updateUserPreferences(prefs: Partial<typeof DEFAULT_USER_PREFERENCES>) {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  }
  return updated;
}
