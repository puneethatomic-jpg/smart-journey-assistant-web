import { NextRequest, NextResponse } from 'next/server';
import { generateDemoRoutes } from '@/lib/routing/demoRoutes';
import { generateAIExplanation } from '@/lib/ai/explanationGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, travelMode = 'car', preference = 'balanced' } = body;

    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
    }

    // Generate scored routes
    const routes = generateDemoRoutes(origin, destination, travelMode, preference);
    const recommended = routes.find((r) => r.isRecommended) || routes[0];

    // Generate AI explanation
    const aiExplanation = generateAIExplanation(recommended, routes, preference);

    return NextResponse.json({
      success: true,
      routes,
      recommendedRoute: recommended,
      aiExplanation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
