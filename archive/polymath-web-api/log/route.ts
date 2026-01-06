import { NextResponse } from 'next/server';
import {
  logReadingSessionAtomic,
  getDomain,
} from '@/lib/supabase';

// Validation constants
const DOMAIN_ID_PATTERN = /^\d{2}\.\d{2}$/;
const MAX_BOOK_TITLE_LENGTH = 500;
const MAX_AUTHOR_LENGTH = 200;
const MAX_INSIGHT_LENGTH = 5000;
const MAX_PAGES = 10000;
const MAX_READING_TIME = 1440; // 24 hours in minutes
const VALID_SLOTS = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];

// Validation helper
function validateInput(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { domain_id, book_title, book_author, pages_read, reading_time_minutes, key_insight, function_slot } = body;

  // Required fields
  if (!domain_id || typeof domain_id !== 'string') {
    return { valid: false, error: 'domain_id is required' };
  }
  if (!book_title || typeof book_title !== 'string') {
    return { valid: false, error: 'book_title is required' };
  }

  // Domain ID format
  if (!DOMAIN_ID_PATTERN.test(domain_id)) {
    return { valid: false, error: 'domain_id must be in format XX.YY (e.g., 01.02)' };
  }

  // String length limits
  if (book_title.length > MAX_BOOK_TITLE_LENGTH) {
    return { valid: false, error: `book_title must be ${MAX_BOOK_TITLE_LENGTH} characters or less` };
  }
  if (book_author && typeof book_author === 'string' && book_author.length > MAX_AUTHOR_LENGTH) {
    return { valid: false, error: `book_author must be ${MAX_AUTHOR_LENGTH} characters or less` };
  }
  if (key_insight && typeof key_insight === 'string' && key_insight.length > MAX_INSIGHT_LENGTH) {
    return { valid: false, error: `key_insight must be ${MAX_INSIGHT_LENGTH} characters or less` };
  }

  // Numeric validation
  if (pages_read !== undefined && pages_read !== null) {
    const pages = Number(pages_read);
    if (isNaN(pages) || pages < 0 || pages > MAX_PAGES) {
      return { valid: false, error: `pages_read must be between 0 and ${MAX_PAGES}` };
    }
  }
  if (reading_time_minutes !== undefined && reading_time_minutes !== null) {
    const time = Number(reading_time_minutes);
    if (isNaN(time) || time < 0 || time > MAX_READING_TIME) {
      return { valid: false, error: `reading_time_minutes must be between 0 and ${MAX_READING_TIME}` };
    }
  }

  // Function slot validation (optional but must be valid if provided)
  if (function_slot !== undefined && function_slot !== null) {
    if (typeof function_slot !== 'string' || !VALID_SLOTS.includes(function_slot)) {
      return { valid: false, error: `function_slot must be one of: ${VALID_SLOTS.join(', ')}` };
    }
  }

  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { domain_id, book_title, book_author, pages_read, reading_time_minutes, key_insight, function_slot } = body;

    // Use atomic RPC function to prevent race conditions
    const result = await logReadingSessionAtomic({
      domain_id,
      book_title,
      book_author: book_author || undefined,
      pages_read: pages_read || 0,
      reading_time: reading_time_minutes || 0,
      key_insight: key_insight || undefined,
      function_slot: function_slot || undefined,
    });

    if (!result.success) {
      // Handle domain not found
      if (result.error?.includes('not found')) {
        return NextResponse.json(
          { error: 'Domain not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: result.error || 'Failed to log session' },
        { status: 500 }
      );
    }

    // Fetch updated domain for response
    const domain = await getDomain(domain_id);

    return NextResponse.json({
      success: true,
      book: { id: result.book_id },
      domain: domain ? {
        ...domain,
        books_read: result.books_read,
        status: result.status,
      } : {
        domain_id,
        books_read: result.books_read,
        status: result.status,
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
