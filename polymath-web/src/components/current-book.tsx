'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BRANCH_NAMES } from '@/types';
import type { CurrentBook } from '@/types';

interface CurrentBookCardProps {
  currentBook: CurrentBook | null;
}

export function CurrentBookCard({ currentBook }: CurrentBookCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'finish' | 'abandon' | null>(null);

  const handleFinish = async () => {
    if (!currentBook) return;
    setLoading('finish');

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finish',
          domain_id: currentBook.domain_id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to finish');
      }

      router.refresh();
    } catch (err) {
      console.error('Error finishing book:', err);
      alert(err instanceof Error ? err.message : 'Failed to finish book');
    } finally {
      setLoading(null);
    }
  };

  const handleAbandon = async () => {
    if (!currentBook) return;
    if (!confirm('Are you sure you want to abandon this book? The domain will be marked as unread.')) {
      return;
    }

    setLoading('abandon');

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'abandon',
          domain_id: currentBook.domain_id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to abandon');
      }

      router.refresh();
    } catch (err) {
      console.error('Error abandoning book:', err);
      alert(err instanceof Error ? err.message : 'Failed to abandon book');
    } finally {
      setLoading(null);
    }
  };

  if (!currentBook) {
    return (
      <Card className="border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="font-semibold text-lg mb-1">No book in progress</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Click a domain in the tree or browse Reference to start reading
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/reference')}
          >
            Browse Domains
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <CardTitle className="text-lg">Currently Reading</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
            {currentBook.book_title}
          </h3>
          {currentBook.book_author && (
            <p className="text-zinc-600 dark:text-zinc-400">
              by {currentBook.book_author}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Domain:</span>
          <button
            onClick={() => router.push(`/domains/${currentBook.domain_id}`)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {currentBook.domain_name}
          </button>
          <span className="text-zinc-400">({BRANCH_NAMES[currentBook.branch_id]})</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleFinish}
            disabled={loading !== null}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {loading === 'finish' ? 'Saving...' : '✓ Finished'}
          </Button>
          <Button
            variant="outline"
            onClick={handleAbandon}
            disabled={loading !== null}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          >
            {loading === 'abandon' ? '...' : '✗ Abandon'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
