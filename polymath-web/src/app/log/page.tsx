'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getNextSlot } from '@/lib/traversal';

interface Domain {
  domain_id: string;
  name: string;
  branch_id: string;
  books_read: number;
}

function LogSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || '');
  const [bookTitle, setBookTitle] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load domains on mount
  useEffect(() => {
    async function loadDomains() {
      try {
        const res = await fetch('/api/domains');
        const data = await res.json();
        setDomains(data);
      } catch (err) {
        console.error('Failed to load domains:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDomains();
  }, []);

  // Filter domains for search
  const filteredDomains = domains.filter(
    (d) =>
      d.domain_id.includes(searchTerm) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDomainData = domains.find((d) => d.domain_id === selectedDomain);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDomain || !bookTitle) {
      setError('Please select a domain and enter a book title');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain_id: selectedDomain,
          book_title: bookTitle,
          pages_read: parseInt(pagesRead) || 0,
          reading_time_minutes: parseInt(readingTime) || 0,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to log session');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError('Failed to log session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Session Logged!</h2>
              <p className="text-zinc-500">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </main>
    );
  }

  return (
      <main className="container mx-auto px-4 py-8 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Log Reading Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Domain Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Domain</label>
                {selectedDomain ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {selectedDomain} — {selectedDomainData?.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {selectedDomainData?.books_read || 0} books read
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDomain('')}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search domains..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto border rounded-lg">
                      {loading ? (
                        <p className="p-3 text-zinc-500">Loading...</p>
                      ) : (
                        filteredDomains.slice(0, 20).map((d) => (
                          <button
                            key={d.domain_id}
                            type="button"
                            onClick={() => {
                              setSelectedDomain(d.domain_id);
                              setSearchTerm('');
                            }}
                            className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b last:border-0"
                          >
                            <span className="text-zinc-400">{d.domain_id}</span>{' '}
                            <span className="font-medium">{d.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Auto-detected slot */}
              {selectedDomainData && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-500">Next function slot:</p>
                  <Badge className="mt-1">
                    {getNextSlot(selectedDomainData.books_read)}
                  </Badge>
                </div>
              )}

              {/* Book Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Book Title</label>
                <Input
                  placeholder="Enter book title..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  required
                />
              </div>

              {/* Pages & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pages Read</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={pagesRead}
                    onChange={(e) => setPagesRead(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time (minutes)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !selectedDomain || !bookTitle}
              >
                {submitting ? 'Logging...' : 'Log Session'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
  );
}

export default function LogSession() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-zinc-500">Loading...</div>
      </main>
    }>
      <LogSessionContent />
    </Suspense>
  );
}
