import { getAllDomains, getAllBranches, getBranchDistances } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { BRANCH_NAMES, BRANCH_COLORS } from '@/types';

export const revalidate = 60;

export default async function ReferencePage() {
  const [domains, branches, distances] = await Promise.all([
    getAllDomains(),
    getAllBranches(),
    getBranchDistances(),
  ]);

  // Group by branch
  const domainsByBranch = new Map<string, typeof domains>();
  for (const d of domains) {
    const current = domainsByBranch.get(d.branch_id) || [];
    current.push(d);
    domainsByBranch.set(d.branch_id, current);
  }

  const sortedBranches = Array.from(domainsByBranch.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  // Stats
  const totalRead = domains.filter(d => d.status === 'read').length;
  const totalReading = domains.filter(d => d.status === 'reading').length;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Reference</h1>
      <p className="text-zinc-500 mb-6">
        Browse all {domains.length} domains across {branches.length} branches
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{totalRead}</p>
            <p className="text-sm text-zinc-500">Domains read</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{totalReading}</p>
            <p className="text-sm text-zinc-500">Currently reading</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{Math.round((totalRead / domains.length) * 100)}%</p>
            <p className="text-sm text-zinc-500">Coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">
              {new Set(domains.filter(d => d.status !== 'unread').map(d => d.branch_id)).size}
            </p>
            <p className="text-sm text-zinc-500">Branches touched</p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Sections */}
      <div className="space-y-8">
        {sortedBranches.map(([branchId, branchDomains]) => {
          const read = branchDomains.filter(d => d.status === 'read').length;
          const reading = branchDomains.filter(d => d.status === 'reading').length;
          const total = branchDomains.length;

          return (
            <div key={branchId}>
              {/* Branch Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: BRANCH_COLORS[branchId] }}
                  >
                    {branchId}
                  </span>
                  <h2 className="text-xl font-semibold">{BRANCH_NAMES[branchId]}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-500">
                    {read}/{total} read
                    {reading > 0 && ` · ${reading} reading`}
                  </span>
                  <Progress value={(read / total) * 100} className="w-24 h-2" />
                </div>
              </div>

              {/* Domain Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {branchDomains.map((domain) => (
                  <Link key={domain.domain_id} href={`/domains/${domain.domain_id}`}>
                    <Card
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        domain.status === 'unread'
                          ? 'opacity-60'
                          : domain.status === 'read'
                          ? 'border-green-300 dark:border-green-700'
                          : 'border-blue-300 dark:border-blue-700'
                      }`}
                    >
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-400">{domain.domain_id}</p>
                            <p className="font-medium truncate">{domain.name}</p>
                          </div>
                          {domain.is_hub && (
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                              Hub
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              domain.status === 'unread'
                                ? 'text-zinc-400'
                                : domain.status === 'reading'
                                ? 'text-blue-600'
                                : 'text-green-600'
                            }`}
                          >
                            {domain.status}
                          </Badge>
                          {domain.book_title && (
                            <span className="text-xs text-zinc-500 truncate max-w-[120px]">
                              {domain.book_title}
                            </span>
                          )}
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
