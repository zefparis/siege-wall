import { NextResponse } from 'next/server';

const HCS_BACKEND_URL = process.env.NEXT_PUBLIC_HCS_BACKEND_URL || 'https://hcs-u7-backend.onrender.com';

export async function GET() {
  try {
    const response = await fetch(`${HCS_BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Backend unreachable', message: error.message },
      { status: 503 }
    );
  }
}
