import { RouteOption, RoutePreference, RouteScore, ScoringWeights } from '@/types';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  time: 0.40,
  traffic: 0.25,
  distance: 0.15,
  toll: 0.10,
  preference: 0.10,
};

export function scoreRoutes(
  routesRaw: Omit<RouteOption, 'score' | 'isRecommended'>[],
  userPref: RoutePreference = 'balanced',
  weights: ScoringWeights = DEFAULT_WEIGHTS
): RouteOption[] {
  if (!routesRaw || routesRaw.length === 0) return [];

  const minTime = Math.min(...routesRaw.map((r) => r.durationMin));
  const maxTime = Math.max(...routesRaw.map((r) => r.durationMin));

  const minDist = Math.min(...routesRaw.map((r) => r.distanceKm));
  const maxDist = Math.max(...routesRaw.map((r) => r.distanceKm));

  const scoredRoutes: RouteOption[] = routesRaw.map((route) => {
    // 1. Time Score (Normalized relative to fastest)
    const timeRatio = maxTime === minTime ? 1 : 1 - (route.durationMin - minTime) / (maxTime - minTime || 1);
    const timeScore = Math.round(timeRatio * 100);

    // 2. Distance Score (Normalized relative to shortest)
    const distRatio = maxDist === minDist ? 1 : 1 - (route.distanceKm - minDist) / (maxDist - minDist || 1);
    const distanceScore = Math.round(distRatio * 100);

    // 3. Traffic Score
    let trafficScore = 100;
    if (route.trafficLevel === 'moderate') trafficScore = 70;
    if (route.trafficLevel === 'heavy') trafficScore = 35;

    // 4. Toll Score
    let tollScore = 100;
    if (route.tollCost > 0 && route.tollCost <= 50) tollScore = 60;
    if (route.tollCost > 50) tollScore = 20;

    // 5. User Preference Match Score
    let preferenceScore = 80;
    switch (userPref) {
      case 'fastest':
        preferenceScore = route.durationMin === minTime ? 100 : Math.max(40, timeScore);
        break;
      case 'shortest':
        preferenceScore = route.distanceKm === minDist ? 100 : Math.max(40, distanceScore);
        break;
      case 'avoid_tolls':
        preferenceScore = route.tollCost === 0 ? 100 : 20;
        break;
      case 'avoid_highways':
        preferenceScore = !route.hasHighways ? 100 : 30;
        break;
      case 'eco':
        preferenceScore = Math.round((distanceScore * 0.6) + (trafficScore * 0.4));
        break;
      case 'balanced':
      default:
        preferenceScore = Math.round((timeScore + trafficScore + distanceScore) / 3);
        break;
    }

    // Adjust weights based on user preference emphasis
    let activeWeights = { ...weights };
    if (userPref === 'fastest') {
      activeWeights = { time: 0.55, traffic: 0.20, distance: 0.10, toll: 0.05, preference: 0.10 };
    } else if (userPref === 'shortest') {
      activeWeights = { time: 0.15, traffic: 0.10, distance: 0.55, toll: 0.10, preference: 0.10 };
    } else if (userPref === 'avoid_tolls') {
      activeWeights = { time: 0.25, traffic: 0.15, distance: 0.10, toll: 0.40, preference: 0.10 };
    }

    // Total Overall Weighted Score (0 to 100)
    const overallScore = Math.round(
      timeScore * activeWeights.time +
      trafficScore * activeWeights.traffic +
      distanceScore * activeWeights.distance +
      tollScore * activeWeights.toll +
      preferenceScore * activeWeights.preference
    );

    // Formulate human breakdown rationale
    const reasoningParts: string[] = [];
    if (route.durationMin === minTime) reasoningParts.push('Fastest ETA');
    if (route.distanceKm === minDist) reasoningParts.push('Shortest distance');
    if (route.trafficLevel === 'low') reasoningParts.push('Smooth traffic');
    if (route.tollCost === 0) reasoningParts.push('Toll-free');

    const scoreObj: RouteScore = {
      overallScore,
      timeScore,
      distanceScore,
      trafficScore,
      tollScore,
      preferenceScore,
      reasoning: reasoningParts.join(' • ') || 'Good alternative route',
    };

    return {
      ...route,
      score: scoreObj,
      isRecommended: false,
    };
  });

  // Find the highest overall score
  let maxScore = -1;
  let recommendedIndex = 0;
  scoredRoutes.forEach((r, idx) => {
    if (r.score.overallScore > maxScore) {
      maxScore = r.score.overallScore;
      recommendedIndex = idx;
    }
  });

  return scoredRoutes.map((route, idx) => ({
    ...route,
    isRecommended: idx === recommendedIndex,
  }));
}
