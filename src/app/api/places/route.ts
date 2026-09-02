import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SAVED_PLACES } from '@/lib/storage/localStorage';

export async function GET() {
  return NextResponse.json({ success: true, places: INITIAL_SAVED_PLACES });
}
