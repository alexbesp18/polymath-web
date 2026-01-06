import { NextResponse } from 'next/server';
import { saveInsight, getInsights } from '@/lib/supabase';

// GET /api/insights - Get recent insights
export async function GET() {
  try {
    const insights = await getInsights(50);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

// POST /api/insights - Save a new insight
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain_a, domain_b, insight_type, content } = body;

    // Validate required fields
    if (!domain_a || !domain_b || !content) {
      return NextResponse.json(
        { error: 'domain_a, domain_b, and content are required' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'content must be 5000 characters or less' },
        { status: 400 }
      );
    }

    const insight = await saveInsight({
      domain_a,
      domain_b,
      insight_type: insight_type || 'bisociation',
      content,
    });

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Failed to save insight:', error);
    return NextResponse.json(
      { error: 'Failed to save insight' },
      { status: 500 }
    );
  }
}
