import { getAllDomains } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { BRANCH_NAMES } from '@/types';

export const revalidate = 60;

export default async function DomainBrowser() {
  const domains = await getAllDomains();

  // Group by branch
  const domainsByBranch = new Map<string, typeof domains>();
  for (const d of domains) {
    const current = domainsByBranch.get(d.branch_id) || [];
    current.push(d);
    domainsByBranch.set(d.branch_id, current);
  }

  // Sort branches
  const sortedBranches = Array.from(domainsByBranch.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  // Overall stats
  const totalDomains = domains.length;
  const touchedDomains = domains.filter((d) => d.status !== 'untouched').length;
  const totalBooks = domains.reduce((sum, d) => sum + d.books_read, 0);
  const expertDomains = domains.filter((d) => d.books_read >= 6).length;

  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Domain Browser</h1>
        <p className="text-zinc-500 mb-4">
          {domains.length} domains across {sortedBranches.length} branches
        </p>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{touchedDomains}</p>
            <p className="text-sm text-zinc-500">Domains touched</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalBooks}</p>
            <p className="text-sm text-zinc-500">Books read</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{expertDomains}</p>
            <p className="text-sm text-zinc-500">Domains complete</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {Math.round((touchedDomains / totalDomains) * 100)}%
            </p>
            <p className="text-sm text-zinc-500">Coverage</p>
          </div>
        </div>

        {/* Branch Sections */}
        <div className="space-y-8">
          {sortedBranches.map(([branchId, branchDomains]) => {
            const touched = branchDomains.filter((d) => d.status !== 'untouched').length;
            const total = branchDomains.length;
            const totalBooks = branchDomains.reduce((sum, d) => sum + d.books_read, 0);

            return (
              <div key={branchId}>
                {/* Branch Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-zinc-400">{branchId}</span>
                    <h2 className="text-xl font-semibold">{BRANCH_NAMES[branchId]}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500">
                      {touched}/{total} domains · {totalBooks} books
                    </span>
                    <Progress value={(touched / total) * 100} className="w-24 h-2" />
                  </div>
                </div>

                {/* Domain Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {branchDomains.map((domain) => (
                    <Link key={domain.domain_id} href={`/domains/${domain.domain_id}`}>
                      <Card
                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                          domain.status === 'untouched'
                            ? 'opacity-60'
                            : domain.status === 'expert'
                            ? 'border-green-300 dark:border-green-700'
                            : ''
                        }`}
                      >
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-zinc-400">{domain.domain_id}</p>
                              <p className="font-medium truncate">{domain.name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {domain.is_hub && (
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                                  Hub
                                </Badge>
                              )}
                              {domain.is_expert && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                                  Expert
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Mini 6-slot progress bar */}
                          <div className="flex gap-0.5 mt-2">
                            {[0, 1, 2, 3, 4, 5].map((slot) => (
                              <div
                                key={slot}
                                className={`h-1.5 flex-1 rounded-sm ${
                                  slot < domain.books_read
                                    ? 'bg-green-500'
                                    : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                domain.status === 'untouched'
                                  ? 'text-zinc-400'
                                  : domain.status === 'surveying'
                                  ? 'text-blue-600'
                                  : domain.status === 'surveyed'
                                  ? 'text-green-600'
                                  : domain.status === 'deepening'
                                  ? 'text-purple-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {domain.status}
                            </Badge>
                            <span className="text-xs text-zinc-500">
                              {domain.books_read}/6
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
    </main>
  );
}
