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
    if (route.trafficLevel === 'none') trafficScore = 100;
    else if (route.trafficLevel === 'low') trafficScore = 90;
    else if (route.trafficLevel === 'moderate') trafficScore = 65;
    else if (route.trafficLevel === 'heavy') trafficScore = 30;

    // 4. Road Quality Score (0 to 100)
    const roadQualityScore = route.roadQualityScore || (
      route.roadQuality === 'excellent' ? 98 :
      route.roadQuality === 'good' ? 88 :
      route.roadQuality === 'moderate' ? 70 :
      route.roadQuality === 'rough' ? 52 : 38
    );

    // 5. Toll Score
    let tollScore = 100;
    if (route.tollCost > 0 && route.tollCost <= 50) tollScore = 65;
    if (route.tollCost > 50) tollScore = 25;

    // 6. User Preference Match Score
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
        preferenceScore = Math.round((distanceScore * 0.5) + (trafficScore * 0.5));
        break;
      case 'balanced':
      default:
        preferenceScore = Math.round((timeScore + trafficScore + roadQualityScore) / 3);
        break;
    }

    // Adjust weights based on user preference emphasis
    let activeWeights = { ...weights };
    if (userPref === 'fastest') {
      activeWeights = { time: 0.50, traffic: 0.20, distance: 0.10, toll: 0.05, preference: 0.15 };
    } else if (userPref === 'shortest') {
      activeWeights = { time: 0.15, traffic: 0.10, distance: 0.55, toll: 0.10, preference: 0.10 };
    } else if (userPref === 'avoid_tolls') {
      activeWeights = { time: 0.25, traffic: 0.15, distance: 0.10, toll: 0.40, preference: 0.10 };
    } else if (userPref === 'eco') {
      activeWeights = { time: 0.20, traffic: 0.35, distance: 0.25, toll: 0.10, preference: 0.10 };
    }

    // Total Overall Weighted Score (0 to 100), factoring in road quality (10% weight)
    const overallScore = Math.min(99, Math.max(20, Math.round(
      (timeScore * activeWeights.time +
      trafficScore * activeWeights.traffic +
      distanceScore * activeWeights.distance +
      tollScore * activeWeights.toll +
      preferenceScore * activeWeights.preference) * 0.90 +
      roadQualityScore * 0.10
    )));

    // Formulate human breakdown rationale
    const reasoningParts: string[] = [];
    if (route.trafficLevel === 'none') reasoningParts.push('🟢 No Traffic Area');
    else if (route.trafficLevel === 'low') reasoningParts.push('🟡 Less Traffic Area');
    
    if (route.roadQuality === 'excellent' || route.roadQuality === 'good') {
      reasoningParts.push('✨ Good Road');
    } else if (route.roadQuality === 'rough' || route.roadQuality === 'bad') {
      reasoningParts.push('⚠️ Patchy / Bad Road Warning');
    }

    if (route.durationMin === minTime) reasoningParts.push('Fastest ETA');
    if (route.tollCost === 0) reasoningParts.push('Toll-free');

    const scoreObj: RouteScore = {
      overallScore,
      timeScore,
      distanceScore,
      trafficScore,
      tollScore,
      preferenceScore,
      reasoning: reasoningParts.slice(0, 3).join(' • ') || 'Calculated Alternative',
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
