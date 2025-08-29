import { NextRequest, NextResponse } from 'next/server';

interface Audience {
  _id?: string;
  name: string;
  description: string;
  criteria: {
    partnerType?: string[];
    location?: string[];
    registrationDate?: {
      from?: Date;
      to?: Date;
    };
    revenue?: {
      min?: number;
      max?: number;
    };
    activity?: 'active' | 'inactive' | 'new';
    tags?: string[];
  };
  size: number;
  lastUpdated: Date;
  createdAt: Date;
  isActive: boolean;
}

// GET /api/admin/audiences - List all audiences (Mock Implementation)
export async function GET() {
  try {
    const mockAudiences = [
      {
        _id: '1',
        name: 'Neue Partner (30 Tage)',
        description:
          'Partner, die sich in den letzten 30 Tagen registriert haben',
        criteria: {
          activity: 'new' as const,
        },
        size: 89,
        lastUpdated: new Date(),
        createdAt: new Date(),
        isActive: true,
      },
      {
        _id: '2',
        name: 'Premium Partner',
        description: 'Partner mit hohem monatlichen Umsatz',
        criteria: {
          revenue: { min: 1000 },
          activity: 'active' as const,
        },
        size: 234,
        lastUpdated: new Date(),
        createdAt: new Date(),
        isActive: true,
      },
    ];

    return NextResponse.json({ audiences: mockAudiences });
  } catch (error) {
    console.error('Error fetching audiences:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Zielgruppen' },
      { status: 500 }
    );
  }
}

// POST /api/admin/audiences - Create new audience (Mock Implementation)
export async function POST(request: NextRequest) {
  try {
    await request.json(); // Parse but don't use for mock

    return NextResponse.json({
      success: true,
      audienceId: 'new-audience-id',
      size: 150,
      message: 'Zielgruppe erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Error creating audience:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Zielgruppe' },
      { status: 500 }
    );
  }
}
