import { RouteOption, RoutePreference } from '@/types';

export function generateAIExplanation(
  recommended: RouteOption,
  alternatives: RouteOption[],
  preference: RoutePreference
): { summary: string; bullets: string[]; confidence: number } {
  if (!recommended) {
    return {
      summary: 'No route available to generate an AI explanation.',
      bullets: [],
      confidence: 0,
    };
  }

  const otherRoutes = alternatives.filter((r) => r.id !== recommended.id);
  const bullets: string[] = [];

  if (otherRoutes.length === 0) {
    bullets.push(`Optimal path calculated: ${recommended.distanceKm} km in ${recommended.durationMin} mins.`);
    bullets.push(`Traffic is currently ${recommended.trafficLevel}.`);
    return {
      summary: `I recommend taking ${recommended.name}. It provides the single direct path with an estimated duration of ${recommended.durationMin} minutes.`,
      bullets,
      confidence: 95,
    };
  }

  // Find fastest and shortest among all
  const all = [recommended, ...otherRoutes];
  const fastest = [...all].sort((a, b) => a.durationMin - b.durationMin)[0];
  const shortest = [...all].sort((a, b) => a.distanceKm - b.distanceKm)[0];

  // Time comparison
  if (recommended.id === fastest.id) {
    const timeSaved = otherRoutes[0] ? otherRoutes[0].durationMin - recommended.durationMin : 0;
    if (timeSaved > 0) {
      bullets.push(`⚡ Saves ~${timeSaved} min compared to ${otherRoutes[0].name}.`);
    } else {
      bullets.push(`⚡ Fastest available arrival time (${recommended.durationMin} min).`);
    }
  } else {
    const timeDiff = recommended.durationMin - fastest.durationMin;
    bullets.push(`⏱ Only ${timeDiff} min longer than the absolute fastest route, but avoids bottlenecks.`);
  }

  // Traffic comparison
  if (recommended.trafficLevel === 'low') {
    bullets.push(`🟢 Enjoys smooth, low-density traffic conditions.`);
  } else if (recommended.trafficLevel === 'moderate') {
    bullets.push(`🟡 Has moderate traffic flow, overall steady speed.`);
  }

  // Toll comparison
  if (recommended.tollCost === 0 && otherRoutes.some((r) => r.tollCost > 0)) {
    const maxToll = Math.max(...otherRoutes.map((r) => r.tollCost));
    bullets.push(`💰 Saves ₹${maxToll} in toll fees.`);
  } else if (recommended.tollCost > 0) {
    bullets.push(`💳 Toll fee: ₹${recommended.tollCost}.`);
  }

  // Preference match explanation
  if (preference === 'avoid_tolls' && recommended.tollCost === 0) {
    bullets.push(`🛡 Perfectly aligns with your preference to avoid toll plazas.`);
  } else if (preference === 'fastest') {
    bullets.push(`🚀 Prioritized for minimum overall travel time.`);
  } else if (preference === 'balanced') {
    bullets.push(`⚖ Best overall balance between travel time, distance, and traffic congestion.`);
  }

  const summary = `I recommend ${recommended.name} (${recommended.score.overallScore}/100 score). ` +
    (recommended.id === fastest.id
      ? `It offers the fastest ETA (${recommended.durationMin} mins) with ${recommended.trafficLevel} traffic.`
      : `Even though ${fastest.name} is ${fastest.durationMin} mins, ${recommended.name} offers a smoother drive with less traffic delay.`);

  return {
    summary,
    bullets,
    confidence: 94,
  };
}
