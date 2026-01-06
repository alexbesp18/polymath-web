'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardContent className="pt-6 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Could not generate recommendation
          </h2>
          <p className="text-zinc-500 mb-4">
            There was a problem fetching your reading data.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
            <Link href="/domains">
              <Button variant="ghost">Browse domains</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
