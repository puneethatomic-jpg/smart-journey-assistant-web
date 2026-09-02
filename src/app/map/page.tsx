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
import { Search, Compass, Crosshair } from 'lucide-react';

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

  // Handle Preset URL query params
  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset === 'home_station') {
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
        address: `${destSearchQuery}, City Center`,
        lat: origin.lat + (Math.random() * 0.04 - 0.02),
        lng: origin.lng + (Math.random() * 0.04 - 0.02),
        type: 'custom',
      };
    }

    setDestination(foundLocation);
  };

  const handleMapClick = (lat: number, lng: number) => {
    const clickedPoint: LocationPoint = {
      id: `map-click-${Date.now()}`,
      name: `Selected Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
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
        name: 'Route A — Dynamic Reroute (Faster Bypass)',
        durationMin: Math.max(2, activeRoute.durationMin - 3),
        summary: 'Rerouted via Highway Exit 4 to bypass roadblock',
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Sidebar Controls Panel */}
      <div className="w-full lg:w-[480px] bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto p-4 space-y-4 shadow-xl z-20 flex-shrink-0">
        {!isNavigating ? (
          <>
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <span>Route Planner</span>
                </h1>

                <button
                  onClick={handleUseCurrentLocation}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-semibold transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GPS Location</span>
                </button>
              </div>

              {/* Origin Input */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-sky-400 font-bold">A</span>
                <input
                  type="text"
                  readOnly
                  value={origin.name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none cursor-default"
                />
              </div>

              {/* Destination Form */}
              <form onSubmit={handleSearchDestination} className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-rose-500 font-bold">B</span>
                <input
                  type="text"
                  placeholder="Search destination or click map..."
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl pl-8 pr-10 py-2 text-xs font-semibold text-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 p-1 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Destination Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => {
                    setDestination(DEMO_PRESET_LOCATIONS.college);
                    setDestSearchQuery(DEMO_PRESET_LOCATIONS.college.name);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1 whitespace-nowrap transition-colors"
                >
                  <span>🎓 College</span>
                </button>

                <button
                  onClick={() => {
                    setDestination(DEMO_PRESET_LOCATIONS.station);
                    setDestSearchQuery(DEMO_PRESET_LOCATIONS.station.name);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1 whitespace-nowrap transition-colors"
                >
                  <span>🚆 Station</span>
                </button>

                <button
                  onClick={() => {
                    setDestination(DEMO_PRESET_LOCATIONS.airport);
                    setDestSearchQuery(DEMO_PRESET_LOCATIONS.airport.name);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1 whitespace-nowrap transition-colors"
                >
                  <span>✈ Airport</span>
                </button>
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Select Travel Mode
              </label>
              <TravelModeSelector selectedMode={travelMode} onSelectMode={setTravelMode} />
            </div>

            {/* Route Preferences */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Route Preference Filter
              </label>
              <RoutePreferenceSelector selectedPreference={preference} onSelectPreference={setPreference} />
            </div>

            {/* AI Explanation Component */}
            {aiExplanation && <AIExplanationCard explanation={aiExplanation} />}

            {/* Calculated Route Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Calculated Routes ({routes.length})
                </span>
                <span className="text-[11px] text-sky-400 font-semibold">Scored & Ranked</span>
              </div>

              {routes.map((route) => (
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
          <div className="space-y-4">
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

      {/* Main Interactive Map Canvas */}
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
