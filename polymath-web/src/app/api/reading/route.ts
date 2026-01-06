import { NextResponse } from 'next/server';
import {
  startReading,
  finishReading,
  abandonReading,
  addToQueue,
  removeFromQueue,
  startFromQueue,
} from '@/lib/supabase';

// POST /api/reading - Handle all reading operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, domain_id, book_title, book_author } = body;

    switch (action) {
      case 'start': {
        if (!domain_id || !book_title) {
          return NextResponse.json(
            { error: 'domain_id and book_title are required' },
            { status: 400 }
          );
        }
        await startReading(domain_id, book_title, book_author);
        return NextResponse.json({ success: true, action: 'started' });
      }

      case 'finish': {
        if (!domain_id) {
          return NextResponse.json(
            { error: 'domain_id is required' },
            { status: 400 }
          );
        }
        await finishReading(domain_id);
        return NextResponse.json({ success: true, action: 'finished' });
      }

      case 'abandon': {
        if (!domain_id) {
          return NextResponse.json(
            { error: 'domain_id is required' },
            { status: 400 }
          );
        }
        await abandonReading(domain_id);
        return NextResponse.json({ success: true, action: 'abandoned' });
      }

      case 'queue': {
        if (!domain_id || !book_title) {
          return NextResponse.json(
            { error: 'domain_id and book_title are required' },
            { status: 400 }
          );
        }
        await addToQueue(domain_id, book_title, book_author);
        return NextResponse.json({ success: true, action: 'queued' });
      }

      case 'unqueue': {
        if (!domain_id) {
          return NextResponse.json(
            { error: 'domain_id is required' },
            { status: 400 }
          );
        }
        await removeFromQueue(domain_id);
        return NextResponse.json({ success: true, action: 'removed from queue' });
      }

      case 'start_from_queue': {
        if (!domain_id) {
          return NextResponse.json(
            { error: 'domain_id is required' },
            { status: 400 }
          );
        }
        await startFromQueue(domain_id);
        return NextResponse.json({ success: true, action: 'started from queue' });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Reading API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
