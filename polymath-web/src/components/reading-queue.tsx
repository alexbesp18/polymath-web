'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QueueItem } from '@/types';

interface ReadingQueueCardProps {
  queue: QueueItem[];
}

export function ReadingQueueCard({ queue }: ReadingQueueCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleStartFromQueue = async (domainId: string) => {
    setLoading(domainId);

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_from_queue',
          domain_id: domainId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start');
      }

      router.refresh();
    } catch (err) {
      console.error('Error starting from queue:', err);
      alert(err instanceof Error ? err.message : 'Failed to start');
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveFromQueue = async (domainId: string) => {
    setLoading(domainId);

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unqueue',
          domain_id: domainId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove');
      }

      router.refresh();
    } catch (err) {
      console.error('Error removing from queue:', err);
      alert(err instanceof Error ? err.message : 'Failed to remove');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <CardTitle className="text-lg">Reading Queue</CardTitle>
          </div>
          <span className="text-sm text-zinc-500">{queue.length} items</span>
        </div>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-zinc-500 text-sm">Your queue is empty</p>
            <p className="text-zinc-400 text-xs mt-1">
              Add books from domain pages to build your reading list
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.slice(0, 5).map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 group"
              >
                <span className="text-zinc-400 font-mono text-sm w-5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {item.book_title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {item.domain_name || item.domain_id}
                    {item.book_author && ` · ${item.book_author}`}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleStartFromQueue(item.domain_id)}
                    disabled={loading === item.domain_id}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-red-600"
                    onClick={() => handleRemoveFromQueue(item.domain_id)}
                    disabled={loading === item.domain_id}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
            {queue.length > 5 && (
              <p className="text-xs text-zinc-400 text-center pt-2">
                +{queue.length - 5} more in queue
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
