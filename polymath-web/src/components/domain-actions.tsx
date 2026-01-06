'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DomainActionsProps {
  domainId: string;
  domainName: string;
  isQueued: boolean;
}

export function DomainActions({ domainId, domainName, isQueued }: DomainActionsProps) {
  const router = useRouter();
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [loading, setLoading] = useState<'start' | 'queue' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!bookTitle.trim()) {
      setError('Please enter a book title');
      return;
    }

    setLoading('start');
    setError(null);

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          domain_id: domainId,
          book_title: bookTitle.trim(),
          book_author: bookAuthor.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start');
      }

      router.refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start reading');
    } finally {
      setLoading(null);
    }
  };

  const handleAddToQueue = async () => {
    if (!bookTitle.trim()) {
      setError('Please enter a book title');
      return;
    }

    setLoading('queue');
    setError(null);

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'queue',
          domain_id: domainId,
          book_title: bookTitle.trim(),
          book_author: bookAuthor.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to queue');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to queue');
    } finally {
      setLoading(null);
    }
  };

  if (isQueued) {
    return (
      <div className="text-center py-4">
        <p className="text-zinc-500 mb-2">This domain is already in your queue</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          View Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Book Title *
        </label>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          placeholder="e.g., Thinking, Fast and Slow"
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Author (optional)
        </label>
        <input
          type="text"
          value={bookAuthor}
          onChange={(e) => setBookAuthor(e.target.value)}
          placeholder="e.g., Daniel Kahneman"
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleStart}
          disabled={loading !== null}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading === 'start' ? 'Starting...' : 'Start Reading Now'}
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToQueue}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === 'queue' ? 'Adding...' : 'Add to Queue'}
        </Button>
      </div>

      <p className="text-xs text-zinc-400 text-center">
        You can only read one book at a time. Adding to queue saves it for later.
      </p>
    </div>
  );
}
