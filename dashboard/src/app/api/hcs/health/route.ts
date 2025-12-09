import { NextResponse } from 'next/server';

const HCS_BACKEND_URL = 'https://hcs-u7-backend.onrender.com';

export async function GET() {
  try {
    const response = await fetch(`${HCS_BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json({ status: 'ok', raw: text }, { status: response.status });
    }
  } catch (error: any) {
    console.error('HCS health error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Backend unreachable', message: error.message },
      { status: 503 }
    );
  }
}
