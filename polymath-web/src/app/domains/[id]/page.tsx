import { getDomain, getBooks, getAllDomains } from '@/lib/supabase';
import { getBranchDistance, getBranchName } from '@/lib/distance';
import { getNextSlot, getSlotName } from '@/lib/traversal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

// Generate static params for all domains
export async function generateStaticParams() {
  const domains = await getAllDomains();
  return domains.map((d) => ({ id: d.domain_id }));
}

export default async function DomainDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const domain = await getDomain(id);

  if (!domain) {
    notFound();
  }

  const [books, allDomains] = await Promise.all([
    getBooks(id),
    getAllDomains(),
  ]);

  // Get related domains (same branch)
  const relatedDomains = allDomains
    .filter((d) => d.branch_id === domain.branch_id && d.domain_id !== domain.domain_id)
    .slice(0, 6);

  // Get distant domains
  const distantDomains = allDomains
    .filter((d) => {
      const distance = getBranchDistance(domain.branch_id, d.branch_id);
      return distance >= 3 && d.domain_id !== domain.domain_id;
    })
    .slice(0, 6);

  const branchName = getBranchName(domain.branch_id);
  const nextSlot = getNextSlot(domain.books_read);

  // Slot progression display
  const slots = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'] as const;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Polymath Engine
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-zinc-500 mb-4">
          <Link href="/domains" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Domains
          </Link>
          {' → '}
          <span>{domain.domain_id}</span>
        </nav>

        {/* Domain Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {domain.domain_id} — {domain.name}
              </h1>
              <p className="text-lg text-zinc-500 mt-1">
                Branch: {domain.branch_id} {branchName}
              </p>
            </div>
            <div className="flex gap-2">
              {domain.is_hub && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Hub Domain
                </Badge>
              )}
              {domain.is_expert && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Expert Area
                </Badge>
              )}
              <Badge variant="outline">{domain.status}</Badge>
            </div>
          </div>
          {domain.description && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 italic">
              {domain.description}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{domain.books_read}</div>
              <p className="text-sm text-zinc-500">Books Read</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{nextSlot}</div>
              <p className="text-sm text-zinc-500">Next Slot</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{domain.last_read || 'Never'}</div>
              <p className="text-sm text-zinc-500">Last Read</p>
            </CardContent>
          </Card>
        </div>

        {/* Slot Progression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Function Slot Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {slots.map((slot, index) => {
                const isComplete = index < domain.books_read;
                const isCurrent = index === domain.books_read;

                return (
                  <div
                    key={slot}
                    className={`flex-1 p-3 rounded-lg text-center ${
                      isComplete
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="font-bold">{slot}</div>
                    <div className="text-xs mt-1">{getSlotName(slot)}</div>
                    {isComplete && <div className="text-xs mt-1">✓</div>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Books in this Domain */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Books Read ({books.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {books.length === 0 ? (
              <p className="text-zinc-500">No books logged yet.</p>
            ) : (
              <div className="space-y-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      {book.author && (
                        <p className="text-sm text-zinc-500">by {book.author}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {book.function_slot && (
                        <Badge variant="outline">{book.function_slot}</Badge>
                      )}
                      {book.rating && (
                        <span className="text-yellow-500">
                          {'★'.repeat(book.rating)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Domains */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Same Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedDomains.map((d) => (
                  <Link
                    key={d.domain_id}
                    href={`/domains/${d.domain_id}`}
                    className="block p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <span className="text-zinc-400 text-sm">{d.domain_id}</span>{' '}
                    <span className="font-medium">{d.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distant Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {distantDomains.map((d) => (
                  <Link
                    key={d.domain_id}
                    href={`/domains/${d.domain_id}`}
                    className="block p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <span className="text-zinc-400 text-sm">{d.domain_id}</span>{' '}
                    <span className="font-medium">{d.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      dist: {getBranchDistance(domain.branch_id, d.branch_id)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/log?domain=${domain.domain_id}`}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Log Reading Session
          </Link>
        </div>
      </main>
    </div>
  );
}
