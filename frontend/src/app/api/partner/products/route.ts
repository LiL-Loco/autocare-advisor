import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Forward all query parameters to backend
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Get auth token from headers
    const authHeader = request.headers.get('authorization');

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/partner/products?${searchParams.toString()}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying partner products request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: 'Backend connection error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/partner/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying partner products POST request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        message: 'Backend connection error',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

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
    console.error('Error proxying partner products PATCH request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update products',
        message: 'Backend connection error',
      },
      { status: 500 }
    );
  }
}
