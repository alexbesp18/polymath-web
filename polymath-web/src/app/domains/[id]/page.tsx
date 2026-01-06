import { getDomain, getAllDomains, getBranchDistances, getReadingQueue } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DomainActions } from '@/components/domain-actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRANCH_NAMES, BRANCH_COLORS } from '@/types';

export const revalidate = 0;

// Generate static params for all domains
export async function generateStaticParams() {
  const domains = await getAllDomains();
  return domains.map((d) => ({ id: d.domain_id }));
}

export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [domain, allDomains, distances, queue] = await Promise.all([
    getDomain(id),
    getAllDomains(),
    getBranchDistances(),
    getReadingQueue(),
  ]);

  if (!domain) {
    notFound();
  }

  const branchName = BRANCH_NAMES[domain.branch_id] || domain.branch_id;
  const branchColor = BRANCH_COLORS[domain.branch_id] || '#71717a';
  const isQueued = queue.some(q => q.domain_id === domain.domain_id);

  // Get related domains (same branch)
  const relatedDomains = allDomains
    .filter((d) => d.branch_id === domain.branch_id && d.domain_id !== domain.domain_id)
    .slice(0, 6);

  // Get distant domains for connections
  const distantDomains = allDomains
    .filter((d) => {
      if (d.branch_id === domain.branch_id) return false;
      const dist = distances.find(
        dd => (dd.branch_a === domain.branch_id && dd.branch_b === d.branch_id) ||
              (dd.branch_b === domain.branch_id && dd.branch_a === d.branch_id)
      );
      return dist && dist.distance >= 3;
    })
    .slice(0, 4);

  // Book recommendation prompt
  const bookPrompt = `Recommend 5 foundational books for ${domain.name} (${branchName}) that would give a comprehensive understanding of the field. Consider both classic texts and modern syntheses. For each book, explain why it's essential.`;

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 inline-flex items-center gap-1"
      >
        <span>←</span> Back to Tree
      </Link>

      {/* Domain Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-sm font-mono font-bold"
                style={{ color: branchColor }}
              >
                {domain.domain_id}
              </span>
              {domain.is_hub && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Hub
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {domain.name}
            </h1>
            <p className="text-zinc-500 mt-1">{branchName}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-sm ${
              domain.status === 'unread'
                ? 'text-zinc-400 border-zinc-300'
                : domain.status === 'reading'
                ? 'text-blue-600 border-blue-300 bg-blue-50'
                : 'text-green-600 border-green-300 bg-green-50'
            }`}
          >
            {domain.status === 'unread' ? 'Not Read' : domain.status === 'reading' ? 'Reading' : 'Read'}
          </Badge>
        </div>

        {domain.description && (
          <p className="text-zinc-600 dark:text-zinc-400 mt-4 italic">
            {domain.description}
          </p>
        )}

        {/* Show current book if reading */}
        {domain.status === 'reading' && domain.book_title && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Currently Reading</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {domain.book_title}
            </p>
            {domain.book_author && (
              <p className="text-zinc-600 dark:text-zinc-400">by {domain.book_author}</p>
            )}
          </div>
        )}

        {/* Show completed book if read */}
        {domain.status === 'read' && domain.book_title && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {domain.book_title}
            </p>
            {domain.book_author && (
              <p className="text-zinc-600 dark:text-zinc-400">by {domain.book_author}</p>
            )}
            {domain.completed_at && (
              <p className="text-xs text-zinc-500 mt-1">
                Completed {new Date(domain.completed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add Book Form (only if not currently reading or already read) */}
      {domain.status === 'unread' && (
        <Card className="mb-6 border-2 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add a Book to Read</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainActions
              domainId={domain.domain_id}
              domainName={domain.name}
              isQueued={isQueued}
            />
          </CardContent>
        </Card>
      )}

      {/* Book Recommendation Prompt */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💡</span> Need Book Ideas?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 mb-3">
            Copy this prompt and paste it into Claude or ChatGPT:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm whitespace-pre-wrap">
              {bookPrompt}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(bookPrompt)}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-white dark:bg-zinc-700 rounded border hover:bg-zinc-50 dark:hover:bg-zinc-600"
            >
              Copy
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Related Domains */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Related Domains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Same branch */}
          <div>
            <p className="text-sm text-zinc-500 mb-2">Same Branch ({branchName})</p>
            <div className="flex flex-wrap gap-2">
              {relatedDomains.map((d) => (
                <Link
                  key={d.domain_id}
                  href={`/domains/${d.domain_id}`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    d.status === 'read'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : d.status === 'reading'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Distant domains */}
          {distantDomains.length > 0 && (
            <div>
              <p className="text-sm text-zinc-500 mb-2">Distant Domains (for Bisociation)</p>
              <div className="flex flex-wrap gap-2">
                {distantDomains.map((d) => (
                  <Link
                    key={d.domain_id}
                    href={`/domains/${d.domain_id}`}
                    className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to Tree
        </Link>
        <Link
          href="/reference"
          className="px-6 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Browse All Domains
        </Link>
      </div>
    </main>
  );
}
