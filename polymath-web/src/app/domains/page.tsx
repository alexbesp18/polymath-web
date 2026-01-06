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

  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Domain Browser</h1>
        <p className="text-zinc-500 mb-6">
          {domains.length} domains across {sortedBranches.length} branches
        </p>

        {/* Branch Sections */}
        <div className="space-y-8">
          {sortedBranches.map(([branchId, branchDomains]) => {
            const touched = branchDomains.filter((d) => d.status !== 'untouched').length;
            const total = branchDomains.length;

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
                      {touched}/{total} touched
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
                              {domain.books_read} books
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
