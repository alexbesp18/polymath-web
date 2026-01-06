'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getNextSlot, getSlotName } from '@/lib/traversal';
import { SLOT_DESCRIPTIONS } from '@/lib/hub-books';
import type { FunctionSlot } from '@/types';

const SLOTS: FunctionSlot[] = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];

interface Domain {
  domain_id: string;
  name: string;
  branch_id: string;
  books_read: number;
}

interface LogResult {
  domain: Domain;
  newBooksRead: number;
  newStatus: string;
  slot: string;
}

interface RecentBook {
  id: string;
  title: string;
  author: string | null;
  domain_id: string;
  created_at: string;
}

function LogSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logResult, setLogResult] = useState<LogResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Form state - pre-fill from URL params
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || '');
  const [selectedSlot, setSelectedSlot] = useState<FunctionSlot | null>(
    (searchParams.get('slot') as FunctionSlot) || null
  );
  const [logDate, setLogDate] = useState(
    searchParams.get('date') || new Date().toISOString().split('T')[0]
  );
  const [bookTitle, setBookTitle] = useState(searchParams.get('book') || '');
  const [bookAuthor, setBookAuthor] = useState(searchParams.get('author') || '');
  const [pagesRead, setPagesRead] = useState('');
  const [readingTime, setReadingTime] = useState('30');
  const [keyInsight, setKeyInsight] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load domains and recent books on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [domainsRes, booksRes] = await Promise.all([
          fetch('/api/domains'),
          fetch('/api/books/recent'),
        ]);
        const domainsData = await domainsRes.json();
        const booksData = await booksRes.json();
        setDomains(domainsData);
        setRecentBooks(booksData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get the most recent book for "Continue reading"
  const lastBook = recentBooks[0];
  const lastBookDomain = lastBook ? domains.find((d) => d.domain_id === lastBook.domain_id) : null;

  // Handle "Continue reading" quick action
  const handleContinueReading = () => {
    if (lastBook && lastBookDomain) {
      setSelectedDomain(lastBook.domain_id);
      setBookTitle(lastBook.title);
      setBookAuthor(lastBook.author || '');
      setReadingTime('30');
    }
  };

  // Filter domains for search
  const filteredDomains = domains.filter(
    (d) =>
      d.domain_id.includes(searchTerm) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDomainData = domains.find((d) => d.domain_id === selectedDomain);
  const suggestedSlot = selectedDomainData ? getNextSlot(selectedDomainData.books_read) : 'FND';
  const effectiveSlot = selectedSlot || suggestedSlot;

  // Time adjustment helpers
  const adjustTime = (delta: number) => {
    const current = parseInt(readingTime) || 0;
    const newTime = Math.max(0, current + delta);
    setReadingTime(newTime.toString());
  };

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
          log_date: logDate,
          book_title: bookTitle,
          book_author: bookAuthor,
          pages_read: parseInt(pagesRead) || 0,
          reading_time_minutes: parseInt(readingTime) || 0,
          key_insight: keyInsight || null,
          function_slot: effectiveSlot,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to log session');
      }

      const data = await res.json();
      setLogResult({
        domain: data.domain,
        newBooksRead: data.domain.books_read,
        newStatus: data.domain.status,
        slot: getNextSlot(data.domain.books_read),
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to log session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Post-log celebration
  if (success && logResult) {
    const nextSlot = getNextSlot(logResult.newBooksRead);
    const isComplete = logResult.newBooksRead >= 6;

    return (
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <div className="text-6xl mb-4">{isComplete ? '🎉' : '✅'}</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Session Logged!</h2>

            <div className="my-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-left">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {logResult.domain.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {logResult.newBooksRead}/6 slots
                </Badge>
                <div className="w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(logResult.newBooksRead / 6) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {!isComplete && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Next up: {nextSlot} ({getSlotName(nextSlot)})
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Continue reading to complete this domain!
                </p>
              </div>
            )}

            {isComplete && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Domain Complete!
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  You've read all 6 slots for this domain. Great work!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href={`/domains/${logResult.domain.domain_id}`}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-center"
              >
                View Domain
              </Link>
              <Link
                href="/"
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-xl">
      {/* Back link */}
      <Link
        href={selectedDomain ? `/domains/${selectedDomain}` : '/'}
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 inline-block"
      >
        ← Back
      </Link>

      {/* Quick Action: Continue Reading */}
      {lastBook && lastBookDomain && !selectedDomain && (
        <Card className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
          <CardContent className="pt-4">
            <p className="text-sm text-zinc-500 mb-2">Quick Log</p>
            <button
              type="button"
              onClick={handleContinueReading}
              className="w-full text-left p-3 bg-white dark:bg-zinc-900 rounded-lg border hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Continue "{lastBook.title}"
                  </p>
                  <p className="text-sm text-zinc-500">
                    {lastBookDomain.name} · +30 min
                  </p>
                </div>
                <span className="text-blue-600 text-sm font-medium">→</span>
              </div>
            </button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Log Reading Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                value={logDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Default: today. Select a past date to backfill.
              </p>
            </div>

            {/* Domain Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Domain</label>
              {selectedDomain ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {selectedDomainData?.name || selectedDomain}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {selectedDomainData?.books_read || 0} books read · Next: {selectedDomainData ? getNextSlot(selectedDomainData.books_read) : 'FND'}
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
                          <span className="text-xs text-zinc-500 ml-2">({d.books_read} books)</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Slot Selection */}
            {selectedDomain && (
              <div>
                <label className="block text-sm font-medium mb-2">Function Slot</label>
                <p className="text-sm text-zinc-500 mb-3">
                  Choose which slot this book fills. Suggested: {suggestedSlot}
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {SLOTS.map((slot, index) => {
                    const booksRead = selectedDomainData?.books_read || 0;
                    const isComplete = index < booksRead;
                    const isSuggested = slot === suggestedSlot;
                    const isSelected = slot === effectiveSlot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-lg text-center transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900'
                            : ''
                        } ${
                          isComplete && !isSelected
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
                            : isSuggested && !selectedSlot
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                            : isSelected
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-500'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        <div className="font-bold text-xs">{slot}</div>
                        {isComplete && !isSelected && <div className="text-xs">✓</div>}
                      </button>
                    );
                  })}
                </div>
                {/* Selected slot description */}
                <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm">
                  <span className="font-medium">{SLOT_DESCRIPTIONS[effectiveSlot].name}:</span>{' '}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {SLOT_DESCRIPTIONS[effectiveSlot].description}
                  </span>
                </div>
              </div>
            )}

            {/* Book Title & Author */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Book Title</label>
                <Input
                  placeholder="Enter book title..."
                  value={bookTitle}
                  onChange={(e) => {
                    setBookTitle(e.target.value);
                    // Auto-fill author if selecting from recent books
                    const matchedBook = recentBooks.find(
                      (b) => b.title.toLowerCase() === e.target.value.toLowerCase()
                    );
                    if (matchedBook && matchedBook.author) {
                      setBookAuthor(matchedBook.author);
                    }
                  }}
                  list="recent-books"
                  required
                />
                <datalist id="recent-books">
                  {recentBooks.map((b) => (
                    <option key={b.id} value={b.title} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author (optional)</label>
                <Input
                  placeholder="Author name..."
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  list="recent-authors"
                />
                <datalist id="recent-authors">
                  {[...new Set(recentBooks.map((b) => b.author).filter(Boolean))].map((author) => (
                    <option key={author} value={author!} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Time with +/- buttons */}
            <div>
              <label className="block text-sm font-medium mb-2">Reading Time</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustTime(-15)}
                  className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {readingTime || '0'}
                  </div>
                  <div className="text-sm text-zinc-500">minutes</div>
                </div>
                <button
                  type="button"
                  onClick={() => adjustTime(15)}
                  className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  +
                </button>
              </div>
              {/* Quick time buttons */}
              <div className="flex gap-2 mt-3 justify-center">
                {[15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setReadingTime(mins.toString())}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      readingTime === mins.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Optional fields (collapsible) */}
            <div>
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <span className={`transform transition-transform ${showOptionalFields ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                {showOptionalFields ? 'Hide optional fields' : 'Add pages, insights...'}
              </button>

              {showOptionalFields && (
                <div className="mt-4 space-y-4 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
                  {/* Pages (optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Pages Read</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pagesRead}
                      onChange={(e) => setPagesRead(e.target.value)}
                    />
                  </div>

                  {/* Key Insight */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Insight</label>
                    <p className="text-sm text-zinc-500 mb-2">
                      What's the one thing you want to remember?
                    </p>
                    <textarea
                      className="w-full p-3 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="The key insight from today's reading..."
                      value={keyInsight}
                      onChange={(e) => setKeyInsight(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
              className="w-full py-6 text-lg"
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
