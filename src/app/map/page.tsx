'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MapWrapper from '@/components/map/MapWrapper';
import TravelModeSelector from '@/components/routes/TravelModeSelector';
import RoutePreferenceSelector from '@/components/routes/RoutePreferenceSelector';
import RouteCard from '@/components/routes/RouteCard';
import AIExplanationCard from '@/components/routes/AIExplanationCard';
import NavigationOverlay from '@/components/navigation/NavigationOverlay';
import DemoGpsControl from '@/components/navigation/DemoGpsControl';
import JourneyProgress from '@/components/navigation/JourneyProgress';
import ArrivalModal from '@/components/navigation/ArrivalModal';
import { DEMO_PRESET_LOCATIONS, generateDemoRoutes } from '@/lib/routing/demoRoutes';
import { generateAIExplanation } from '@/lib/ai/explanationGenerator';
import { getSavedPlaces, saveJourneyToHistory } from '@/lib/storage/localStorage';
import { LocationPoint, RouteOption, TravelMode, RoutePreference, Journey, SavedPlace } from '@/types';
import { Search, Compass, Crosshair, Sparkles, Car, Filter } from 'lucide-react';

function RoutePlannerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State Management
  const [origin, setOrigin] = useState<LocationPoint>(DEMO_PRESET_LOCATIONS.home);
  const [destination, setDestination] = useState<LocationPoint | null>(DEMO_PRESET_LOCATIONS.college);
  const [waypoints, setWaypoints] = useState<LocationPoint[]>([]);
  const [destSearchQuery, setDestSearchQuery] = useState('University Campus / College');

  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [preference, setPreference] = useState<RoutePreference>('balanced');

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<{ summary: string; bullets: string[]; confidence: number } | null>(null);

  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  // Navigation & Demo State
  const [isNavigating, setIsNavigating] = useState(false);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [vehiclePosIndex, setVehiclePosIndex] = useState(0);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [showArrival, setShowArrival] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSavedPlaces(getSavedPlaces());
  }, []);

  // Handle Preset URL query params (e.g. India regional presets)
  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset === 'mumbai_pune') {
      setOrigin(DEMO_PRESET_LOCATIONS.mumbai);
      setDestination(DEMO_PRESET_LOCATIONS.pune);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.pune.name);
    } else if (preset === 'delhi_agra') {
      setOrigin(DEMO_PRESET_LOCATIONS.delhi);
      setDestination(DEMO_PRESET_LOCATIONS.agra);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.agra.name);
    } else if (preset === 'chennai_puducherry') {
      setOrigin(DEMO_PRESET_LOCATIONS.chennai);
      setDestination(DEMO_PRESET_LOCATIONS.puducherry);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.puducherry.name);
    } else if (preset === 'bengaluru_mysuru') {
      setOrigin(DEMO_PRESET_LOCATIONS.bengaluru);
      setDestination(DEMO_PRESET_LOCATIONS.mysuru);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.mysuru.name);
    } else if (preset === 'home_station') {
      setOrigin(DEMO_PRESET_LOCATIONS.home);
      setDestination(DEMO_PRESET_LOCATIONS.station);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.station.name);
    } else if (preset === 'home_airport') {
      setOrigin(DEMO_PRESET_LOCATIONS.home);
      setDestination(DEMO_PRESET_LOCATIONS.airport);
      setDestSearchQuery(DEMO_PRESET_LOCATIONS.airport.name);
    } else {
      setOrigin(DEMO_PRESET_LOCATIONS.home);
      setDestination(DEMO_PRESET_LOCATIONS.college);
    }
  }, [searchParams]);

  // Recalculate routes whenever inputs change
  useEffect(() => {
    if (!origin || !destination) return;

    const calculated = generateDemoRoutes(origin, destination, travelMode, preference);
    setRoutes(calculated);

    const recommended = calculated.find((r) => r.isRecommended) || calculated[0];
    if (recommended) {
      setSelectedRouteId(recommended.id);
      const explanation = generateAIExplanation(recommended, calculated, preference);
      setAiExplanation(explanation);
    }
  }, [origin, destination, travelMode, preference]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin({
            name: 'My Current Location (GPS)',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            type: 'current',
          });
        },
        () => {
          alert('GPS unavailable or permission denied. Using Demo Location Mode.');
        }
      );
    }
  };

  const handleSelectPresetRoute = (orig: LocationPoint, dest: LocationPoint) => {
    setOrigin(orig);
    setDestination(dest);
    setDestSearchQuery(dest.name);
  };

  const handleSearchDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destSearchQuery.trim()) return;

    const queryLower = destSearchQuery.toLowerCase();
    let foundLocation = Object.values(DEMO_PRESET_LOCATIONS).find(
      (p) => p.name.toLowerCase().includes(queryLower) || (p.address && p.address.toLowerCase().includes(queryLower))
    );

    if (!foundLocation) {
      foundLocation = {
        id: `custom-${Date.now()}`,
        name: destSearchQuery,
        address: `${destSearchQuery}, India`,
        lat: origin.lat + (Math.random() * 0.4 - 0.2),
        lng: origin.lng + (Math.random() * 0.4 - 0.2),
        type: 'custom',
      };
    }

    setDestination(foundLocation);
  };

  const handleMapClick = (lat: number, lng: number) => {
    const clickedPoint: LocationPoint = {
      id: `map-click-${Date.now()}`,
      name: `Selected Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat,
      lng,
      type: 'custom',
    };
    setDestination(clickedPoint);
    setDestSearchQuery(clickedPoint.name);
  };

  const handleStartJourney = () => {
    if (!activeRoute) return;

    const newJourney: Journey = {
      id: `journey-${Date.now()}`,
      origin,
      destination: destination!,
      waypoints,
      travelMode,
      preference,
      selectedRoute: activeRoute,
      alternativeRoutes: routes.filter((r) => r.id !== activeRoute.id),
      startedAt: new Date().toISOString(),
      status: 'active',
      progressPercent: 0,
      remainingDistanceKm: activeRoute.distanceKm,
      remainingDurationMin: activeRoute.durationMin,
      currentStepIndex: 0,
    };

    setJourney(newJourney);
    setIsNavigating(true);
    setVehiclePosIndex(0);
    setIsPlayingDemo(true);
    setIsOffRoute(false);
    setShowArrival(false);
  };

  useEffect(() => {
    if (!isNavigating || !isPlayingDemo || !activeRoute || !activeRoute.polyline) return;

    const polyline = activeRoute.polyline;
    const totalPoints = polyline.length;

    timerRef.current = setInterval(() => {
      setVehiclePosIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= totalPoints) {
          clearInterval(timerRef.current!);
          setShowArrival(true);
          return totalPoints - 1;
        }

        const progress = (nextIndex / (totalPoints - 1)) * 100;
        const remainingKm = Number((activeRoute.distanceKm * (1 - progress / 100)).toFixed(1));
        const remainingMin = Math.round(activeRoute.durationMin * (1 - progress / 100));

        setJourney((prev) =>
          prev
            ? {
                ...prev,
                progressPercent: progress,
                remainingDistanceKm: Math.max(0, remainingKm),
                remainingDurationMin: Math.max(0, remainingMin),
                currentStepIndex: Math.min(
                  Math.floor((nextIndex / totalPoints) * activeRoute.steps.length),
                  activeRoute.steps.length - 1
                ),
              }
            : null
        );

        return nextIndex;
      });
    }, 1500 / demoSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isNavigating, isPlayingDemo, demoSpeed, activeRoute]);

  const handleTriggerOffRoute = () => {
    setIsOffRoute(true);
    setTimeout(() => {
      const rerouted: RouteOption = {
        ...activeRoute,
        id: `rerouted-${Date.now()}`,
        name: 'Route A — Dynamic Reroute (Faster Expressway)',
        durationMin: Math.max(2, activeRoute.durationMin - 3),
        summary: 'Rerouted via Bypass Expressway Exit to skip traffic',
        trafficLevel: 'low',
        score: {
          ...activeRoute.score,
          overallScore: Math.min(99, activeRoute.score.overallScore + 4),
          reasoning: 'Rerouted around congestion',
        },
      };

      setRoutes([rerouted, ...routes.filter((r) => r.id !== activeRoute.id)]);
      setSelectedRouteId(rerouted.id);
      setIsOffRoute(false);
    }, 2500);
  };

  const handleSaveToHistory = () => {
    if (journey) {
      const completedJourney: Journey = {
        ...journey,
        completedAt: new Date().toISOString(),
        status: 'completed',
        progressPercent: 100,
      };
      saveJourneyToHistory(completedJourney);
      router.push('/history');
    }
  };

  const handleEndJourney = () => {
    setIsNavigating(false);
    setShowArrival(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const currentVehiclePos: [number, number] | null =
    isNavigating && activeRoute && activeRoute.polyline[vehiclePosIndex]
      ? activeRoute.polyline[vehiclePosIndex]
      : null;

  const [filterTag, setFilterTag] = useState<'all' | 'good_road' | 'no_traffic' | 'toll_free'>('all');

  const filteredRoutes = routes.filter((r) => {
    if (filterTag === 'good_road') return r.roadQuality === 'excellent' || r.roadQuality === 'good';
    if (filterTag === 'no_traffic') return r.trafficLevel === 'none' || r.trafficLevel === 'low';
    if (filterTag === 'toll_free') return r.tollCost === 0;
    return true;
  });

  const handleSwapLocations = () => {
    if (!destination) return;
    const prevOrigin = origin;
    const prevDest = destination;
    setOrigin(prevDest);
    setDestination(prevOrigin);
    setDestSearchQuery(prevOrigin.name);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Sidebar Controls Panel */}
      <div className="w-full lg:w-[470px] bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto p-3.5 space-y-3 shadow-xl z-20 flex-shrink-0">
        {!isNavigating ? (
          <>
            {/* Step 1: Route Plan A to B & Presets */}
            <div className="space-y-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-extrabold text-white tracking-tight flex items-center space-x-1.5 uppercase">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>Step 1: Set Origin & Destination</span>
                </h1>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    title="Reverse Route"
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-semibold transition-colors"
                  >
                    ⇅ Swap
                  </button>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 px-2 py-0.5 rounded flex items-center space-x-1 font-semibold transition-colors"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              {/* Origin A Input */}
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-sky-400 font-bold">A</span>
                <input
                  type="text"
                  readOnly
                  value={origin.name}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none cursor-default"
                />
              </div>

              {/* Destination B Form */}
              <form onSubmit={handleSearchDestination} className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-rose-500 font-bold">B</span>
                <input
                  type="text"
                  placeholder="Search city / destination in India..."
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg pl-7 pr-8 py-1.5 text-xs font-semibold text-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Search destination"
                  className="absolute right-1.5 top-1 p-1 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick India Route Presets */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSelectPresetRoute(DEMO_PRESET_LOCATIONS.mumbai, DEMO_PRESET_LOCATIONS.pune)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded whitespace-nowrap transition-colors"
                >
                  🏙️ Mumbai → Pune
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPresetRoute(DEMO_PRESET_LOCATIONS.delhi, DEMO_PRESET_LOCATIONS.agra)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded whitespace-nowrap transition-colors"
                >
                  🏛️ Delhi → Agra
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPresetRoute(DEMO_PRESET_LOCATIONS.bengaluru, DEMO_PRESET_LOCATIONS.mysuru)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded whitespace-nowrap transition-colors"
                >
                  🏰 Bengaluru → Mysuru
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPresetRoute(DEMO_PRESET_LOCATIONS.chennai, DEMO_PRESET_LOCATIONS.puducherry)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded whitespace-nowrap transition-colors"
                >
                  🌴 Chennai → Puducherry
                </button>
              </div>
            </div>

            {/* Step 2: Interactive Prompt - "What vehicle mode do you prefer?" */}
            <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center space-x-1.5">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Step 2: What vehicle mode do you prefer?</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Required
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose your travel mode to customize road quality assessment, speeds, and traffic routes.
              </p>
              <TravelModeSelector selectedMode={travelMode} onSelectMode={setTravelMode} />
            </div>

            {/* Route Priority Filter */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center space-x-1">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Route Priority Preference</span>
                </span>
              </div>
              <RoutePreferenceSelector selectedPreference={preference} onSelectPreference={setPreference} />
            </div>

            {/* Step 3: AI Route Recommendation Card */}
            {aiExplanation && <AIExplanationCard explanation={aiExplanation} />}

            {/* Step 4: All Calculated Routes for Destination */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Calculated Routes for Destination ({routes.length})</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  AI Scored
                </span>
              </div>

              {/* Quick Filter Badges */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    filterTag === 'all'
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Routes ({routes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('good_road')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    filterTag === 'good_road'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-emerald-500/20'
                  }`}
                >
                  ✨ Good Road
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('no_traffic')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    filterTag === 'no_traffic'
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-teal-300 hover:bg-slate-700 border border-teal-500/20'
                  }`}
                >
                  🟢 No Traffic
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('toll_free')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    filterTag === 'toll_free'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/20'
                  }`}
                >
                  💰 Toll-Free
                </button>
              </div>

              {/* Render Filtered Routes */}
              {filteredRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isSelected={route.id === selectedRouteId}
                  onSelect={() => setSelectedRouteId(route.id)}
                  onStartJourney={handleStartJourney}
                />
              ))}
            </div>
          </>
        ) : (
          /* Active Navigation View */
          <div className="space-y-3">
            <NavigationOverlay
              currentStep={activeRoute?.steps[journey?.currentStepIndex || 0] || activeRoute?.steps[0]}
              destinationName={destination?.name || 'Destination'}
              isOffRoute={isOffRoute}
              onEndJourney={handleEndJourney}
            />

            <DemoGpsControl
              isPlaying={isPlayingDemo}
              speed={demoSpeed}
              onTogglePlay={() => setIsPlayingDemo(!isPlayingDemo)}
              onChangeSpeed={setDemoSpeed}
              onTriggerOffRoute={handleTriggerOffRoute}
              onFastForwardArrival={() => setShowArrival(true)}
            />

            {journey && (
              <JourneyProgress
                origin={journey.origin}
                destination={journey.destination}
                progressPercent={journey.progressPercent}
                remainingDistanceKm={journey.remainingDistanceKm}
                remainingDurationMin={journey.remainingDurationMin}
              />
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Map Canvas (Covers All India) */}
      <div className="flex-1 h-full min-h-[450px] relative w-full">
        <MapWrapper
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          routes={routes}
          selectedRouteId={selectedRouteId}
          currentVehiclePos={currentVehiclePos}
          onSelectRoute={setSelectedRouteId}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Arrival Modal */}
      {showArrival && journey && (
        <ArrivalModal
          journey={journey}
          onSaveToHistory={handleSaveToHistory}
          onNewJourney={handleEndJourney}
        />
      )}
    </div>
  );
}

export default function RoutePlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Loading Smart Route Engine...</span>
          </div>
        </div>
      }
    >
      <RoutePlannerContent />
    </Suspense>
  );
}
