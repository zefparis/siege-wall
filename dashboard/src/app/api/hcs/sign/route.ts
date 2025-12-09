import { NextRequest, NextResponse } from 'next/server';

const HCS_BACKEND_URL = process.env.NEXT_PUBLIC_HCS_BACKEND_URL || 'https://hcs-u7-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${HCS_BACKEND_URL}/v1/auth/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
