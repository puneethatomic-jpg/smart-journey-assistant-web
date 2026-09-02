import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/explanationGenerator';

export async function POST(req: NextRequest) {
  try {
    const { recommended, alternatives, preference = 'balanced' } = await req.json();
    const explanation = generateAIExplanation(recommended, alternatives || [], preference);
    return NextResponse.json({ success: true, explanation });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to generate explanation' }, { status: 500 });
  }
}
