import { NextResponse } from 'next/server';
import {
  createBook,
  createDailyLog,
  getDomain,
  updateDomainProgress,
} from '@/lib/supabase';
import { getNextSlot } from '@/lib/traversal';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain_id, book_title, pages_read, reading_time_minutes } = body;

    if (!domain_id || !book_title) {
      return NextResponse.json(
        { error: 'domain_id and book_title are required' },
        { status: 400 }
      );
    }

    // Get current domain state
    const domain = await getDomain(domain_id);
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      );
    }

    const slot = getNextSlot(domain.books_read);

    // Create book record
    const book = await createBook({
      title: book_title,
      domain_id,
      function_slot: slot,
      status: 'completed',
      date_finished: new Date().toISOString().split('T')[0],
    });

    // Create daily log
    const today = new Date().toISOString().split('T')[0];
    await createDailyLog({
      log_date: today,
      domain_id,
      book_id: book.id,
      function_slot: slot,
      pages_read: pages_read || 0,
      reading_time_minutes: reading_time_minutes || 0,
      phase: 'hub-completion',
    });

    // Update domain progress
    const newBooksRead = domain.books_read + 1;
    let newStatus = domain.status;

    if (domain.status === 'untouched') {
      newStatus = 'surveying';
    } else if (domain.status === 'surveying' && newBooksRead >= 2) {
      newStatus = 'surveyed';
    } else if (domain.status === 'surveyed' && newBooksRead >= 4) {
      newStatus = 'deepening';
    }

    await updateDomainProgress(domain_id, newStatus, newBooksRead, today);

    return NextResponse.json({
      success: true,
      book,
      domain: {
        ...domain,
        books_read: newBooksRead,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error('Error logging session:', error);
    return NextResponse.json(
      { error: 'Failed to log session' },
      { status: 500 }
    );
  }
}
