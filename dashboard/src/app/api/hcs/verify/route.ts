import { NextRequest, NextResponse } from 'next/server';

const HCS_BACKEND_URL = 'https://hcs-u7-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${HCS_BACKEND_URL}/v1/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json({ valid: false, error: text }, { status: response.status });
    }
  } catch (error: any) {
    console.error('HCS verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Backend unreachable', message: error.message },
      { status: 503 }
    );
  }
}
