import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: [],
        },
      });
    }

    const response = await fetch(
      `${BACKEND_URL}/api/products/suggestions?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Suggestions fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Laden der Vorschläge',
      },
      { status: 500 }
    );
  }
}
