import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface Campaign {
  _id?: string;
  name: string;
  type: 'onboarding' | 'marketing' | 'transactional' | 'broadcast';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';
  templateId: string;
  audienceId: string;
  subject: string;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    abTest: boolean;
    variants: number;
    trackingEnabled: boolean;
    unsubscribeEnabled: boolean;
  };
  metrics: {
    recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    deliveryRate: number;
  };
}

// GET /api/admin/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    const db = await connectMongoDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const campaigns = await db
      .collection('email_campaigns')
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('email_campaigns').countDocuments(filter);

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Kampagnen' },
      { status: 500 }
    );
  }
}

// POST /api/admin/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const db = await connectMongoDB();
    const body = await request.json();

    const campaign: Campaign = {
      name: body.name,
      type: body.type,
      status: 'draft',
      templateId: body.templateId,
      audienceId: body.audienceId,
      subject: body.subject,
      scheduledDate: body.scheduledDate
        ? new Date(body.scheduledDate)
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        abTest: body.abTest || false,
        variants: body.variants || 1,
        trackingEnabled: true,
        unsubscribeEnabled: true,
      },
      metrics: {
        recipients: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        bounced: 0,
        complained: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        deliveryRate: 0,
      },
    };

    const result = await db.collection('email_campaigns').insertOne(campaign);

    return NextResponse.json({
      success: true,
      campaignId: result.insertedId,
      message: 'Kampagne erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Kampagne' },
      { status: 500 }
    );
  }
}
