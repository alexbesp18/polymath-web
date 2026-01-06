'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Failed to load domains
          </h2>
          <p className="text-zinc-500 mb-4">
            Could not connect to the database. Please check your connection.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
            <Link href="/">
              <Button variant="ghost">Go home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
