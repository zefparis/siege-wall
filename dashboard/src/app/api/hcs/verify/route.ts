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
      // Backend returns 500 for invalid codes, normalize to 200 with valid: false
      if (response.status === 500 && data.error === 'invalid') {
        return NextResponse.json({ valid: false, error: 'invalid' }, { status: 200 });
      }
      return NextResponse.json(data, { status: 200 });
    } catch {
      return NextResponse.json({ valid: false, error: text }, { status: 200 });
    }
  } catch (error: any) {
    console.error('HCS verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Backend unreachable', message: error.message },
      { status: 200 }
    );
  }
}
