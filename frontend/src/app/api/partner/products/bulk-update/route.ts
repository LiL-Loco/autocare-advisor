import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    // Forward request to backend
    const response = await fetch(
      `${BACKEND_URL}/api/partner/products/bulk-update`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      'Error proxying partner products bulk-update request:',
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to bulk update products',
        message: 'Backend connection error',
      },
      { status: 500 }
    );
  }
}
