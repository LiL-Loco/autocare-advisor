import { connectMongoDB } from '@/lib/mongodb';
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

// GET /api/admin/audiences - List all audiences
export async function GET() {
  try {
    const db = await connectMongoDB();

    const audiences = await db
      .collection('email_audiences')
      .find({})
      .sort({ lastUpdated: -1 })
      .toArray();

    return NextResponse.json({ audiences });
  } catch (error) {
    console.error('Error fetching audiences:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Zielgruppen' },
      { status: 500 }
    );
  }
}

// POST /api/admin/audiences - Create new audience
export async function POST(request: NextRequest) {
  try {
    const db = await connectMongoDB();
    const body = await request.json();

    // Calculate audience size based on criteria
    const size = await calculateAudienceSize(db, body.criteria);

    const audience: Audience = {
      name: body.name,
      description: body.description,
      criteria: body.criteria,
      size,
      lastUpdated: new Date(),
      createdAt: new Date(),
      isActive: true,
    };

    const result = await db.collection('email_audiences').insertOne(audience);

    return NextResponse.json({
      success: true,
      audienceId: result.insertedId,
      size,
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

async function calculateAudienceSize(db: any, criteria: any): Promise<number> {
  try {
    const query: any = {};

    // Build MongoDB query based on criteria
    if (criteria.partnerType && criteria.partnerType.length > 0) {
      query.partnerType = { $in: criteria.partnerType };
    }

    if (criteria.location && criteria.location.length > 0) {
      query['address.country'] = { $in: criteria.location };
    }

    if (criteria.registrationDate) {
      query.createdAt = {};
      if (criteria.registrationDate.from) {
        query.createdAt.$gte = new Date(criteria.registrationDate.from);
      }
      if (criteria.registrationDate.to) {
        query.createdAt.$lte = new Date(criteria.registrationDate.to);
      }
    }

    if (criteria.revenue) {
      query['metrics.monthlyRevenue'] = {};
      if (criteria.revenue.min !== undefined) {
        query['metrics.monthlyRevenue'].$gte = criteria.revenue.min;
      }
      if (criteria.revenue.max !== undefined) {
        query['metrics.monthlyRevenue'].$lte = criteria.revenue.max;
      }
    }

    if (criteria.activity) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      switch (criteria.activity) {
        case 'new':
          query.createdAt = { $gte: thirtyDaysAgo };
          break;
        case 'active':
          query.lastLoginAt = { $gte: thirtyDaysAgo };
          break;
        case 'inactive':
          query.lastLoginAt = { $lt: sixtyDaysAgo };
          break;
      }
    }

    if (criteria.tags && criteria.tags.length > 0) {
      query.tags = { $in: criteria.tags };
    }

    // Count matching partners
    const count = await db.collection('partners').countDocuments(query);
    return count;
  } catch (error) {
    console.error('Error calculating audience size:', error);
    return 0;
  }
}
