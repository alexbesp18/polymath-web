import { getDomain, getBooks, getAllDomains, getDomainLogs } from '@/lib/supabase';
import { getBranchDistance, getBranchName } from '@/lib/distance';
import { getNextSlot } from '@/lib/traversal';
import {
  getBookRecommendations,
  hasBookRecommendations,
  getConnectedDomains,
  getDomainIsomorphisms,
  type BookRecommendation,
} from '@/lib/hub-books';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlotSelector } from '@/components/slot-selector';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { FunctionSlot } from '@/types';

export const revalidate = 60;

// Generate static params for all domains
export async function generateStaticParams() {
  const domains = await getAllDomains();
  return domains.map((d) => ({ id: d.domain_id }));
}

export default async function DomainLearningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const domain = await getDomain(id);

  if (!domain) {
    notFound();
  }

  const [books, allDomains, logs] = await Promise.all([
    getBooks(id),
    getAllDomains(),
    getDomainLogs(id),
  ]);

  const branchName = getBranchName(domain.branch_id);
  const nextSlot = getNextSlot(domain.books_read);
  const hasRecommendations = hasBookRecommendations(id);
  const isomorphisms = getDomainIsomorphisms(id);
  const connectedDomains = getConnectedDomains(id);

  // Get recommendations for ALL slots (for interactive selector)
  const allSlots: FunctionSlot[] = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];
  const allRecommendations: Record<FunctionSlot, BookRecommendation[]> = {} as Record<FunctionSlot, BookRecommendation[]>;
  for (const slot of allSlots) {
    allRecommendations[slot] = getBookRecommendations(id, slot);
  }

  // Get related domains (same branch)
  const relatedDomains = allDomains
    .filter((d) => d.branch_id === domain.branch_id && d.domain_id !== domain.domain_id)
    .slice(0, 4);

  // Get distant domains for bisociation
  const distantDomains = allDomains
    .filter((d) => {
      const distance = getBranchDistance(domain.branch_id, d.branch_id);
      return distance >= 3 && d.domain_id !== domain.domain_id;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Domain Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-zinc-500 font-mono">{domain.domain_id}</span>
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
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {domain.name}
              </h1>
              <p className="text-zinc-500 mt-1">
                {branchName}
              </p>
            </div>
          </div>
          {domain.description && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 italic">
              {domain.description}
            </p>
          )}
        </div>

        {/* Interactive Slot Selector */}
        <div className="mb-6">
          <SlotSelector
            domainId={domain.domain_id}
            domainName={domain.name}
            booksRead={domain.books_read}
            defaultSlot={nextSlot}
            recommendations={allRecommendations}
            hasRecommendations={hasRecommendations}
          />
        </div>

        {/* Reading History */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Reading History</CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 && books.length === 0 ? (
              <p className="text-zinc-500 text-sm">No reading sessions logged yet.</p>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => {
                  const book = books.find((b) => b.id === log.book_id);
                  return (
                    <div
                      key={log.id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {book ? (
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              "{book.title}"
                              {book.author && (
                                <span className="text-zinc-500 font-normal"> by {book.author}</span>
                              )}
                            </div>
                          ) : (
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              Reading session
                            </div>
                          )}
                          <div className="text-sm text-zinc-500 mt-1">
                            {new Date(log.log_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {log.reading_time_minutes > 0 && ` · ${log.reading_time_minutes} min`}
                            {log.pages_read > 0 && ` · ${log.pages_read} pages`}
                          </div>
                        </div>
                        {log.function_slot && (
                          <Badge variant="outline" className="ml-2">
                            {log.function_slot}
                          </Badge>
                        )}
                      </div>
                      {log.key_insight && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                          <div className="text-xs text-yellow-700 dark:text-yellow-400 font-medium mb-1">
                            Key Insight
                          </div>
                          <div className="text-sm text-zinc-700 dark:text-zinc-300">
                            {log.key_insight}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connections Section */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Connections</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Isomorphisms */}
            {isomorphisms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Shared Concepts (Isomorphisms)
                </h4>
                <div className="space-y-2">
                  {isomorphisms.map((iso) => (
                    <div
                      key={iso.concept}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                    >
                      <div className="font-medium text-purple-800 dark:text-purple-200">
                        {iso.concept}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                        Also in: {iso.domains
                          .filter((d) => d.domain_id !== domain.domain_id)
                          .map((d) => d.name)
                          .join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected through isomorphisms */}
            {connectedDomains.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Connected Domains
                </h4>
                <div className="space-y-2">
                  {connectedDomains.map((d) => (
                    <Link
                      key={d.domain_id}
                      href={`/domains/${d.domain_id}`}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div>
                        <span className="text-zinc-400 text-sm mr-2">{d.domain_id}</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {d.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {d.connection}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Same branch domains */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Same Branch ({branchName})
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedDomains.map((d) => (
                  <Link
                    key={d.domain_id}
                    href={`/domains/${d.domain_id}`}
                    className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Distant domains for bisociation */}
            <div>
              <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Maximum Distance (for Bisociation)
              </h4>
              <div className="space-y-2">
                {distantDomains.map((d) => (
                  <Link
                    key={d.domain_id}
                    href={`/domains/${d.domain_id}`}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <div>
                      <span className="text-zinc-400 text-sm mr-2">{d.domain_id}</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {d.name}
                      </span>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      dist: {getBranchDistance(domain.branch_id, d.branch_id)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <div className="flex justify-center">
          <Link
            href={`/log?domain=${domain.domain_id}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Log Reading Session
          </Link>
        </div>
      </main>
    </div>
  );
}
