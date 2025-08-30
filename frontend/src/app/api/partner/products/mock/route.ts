import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Forward all query parameters to backend mock endpoint
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Forward request to backend mock endpoint (no auth required)
    const backendUrl = `${BACKEND_URL}/api/partner/products/mock?${searchParams.toString()}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying partner products mock request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mock products',
        message: 'Backend connection error',
      },
      { status: 500 }
    );
  }
}
