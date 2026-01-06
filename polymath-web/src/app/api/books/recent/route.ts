import { NextResponse } from 'next/server';
import { getRecentBooks } from '@/lib/supabase';

export async function GET() {
  try {
    const books = await getRecentBooks(30);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to fetch recent books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent books' },
      { status: 500 }
    );
  }
}
