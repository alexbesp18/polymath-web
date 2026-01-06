import { getAllDomains, getDailyLogs, getBooks, calculateStats } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { HUB_DOMAIN_IDS, BRANCH_NAMES } from '@/types';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Dashboard() {
  // Fetch all data once, calculate stats from it (avoids duplicate queries)
  const [domains, logs, books] = await Promise.all([
    getAllDomains(),
    getDailyLogs(365),
    getBooks(),
  ]);

  const stats = calculateStats(domains, logs, books);

  // Get hub domains
  const hubDomains = domains.filter((d) =>
    HUB_DOMAIN_IDS.includes(d.domain_id as typeof HUB_DOMAIN_IDS[number])
  );

  // Calculate branch coverage
  const branchCoverage = new Map<string, { touched: number; total: number }>();
  for (const d of domains) {
    const current = branchCoverage.get(d.branch_id) || { touched: 0, total: 0 };
    current.total++;
    if (d.status !== 'untouched') current.touched++;
    branchCoverage.set(d.branch_id, current);
  }

  return (
    <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Domains Touched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.domains_touched}/180</div>
              <p className="text-xs text-zinc-500">{((stats.domains_touched / 180) * 100).toFixed(1)}% coverage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Books Read</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_books_read}</div>
              <p className="text-xs text-zinc-500">{stats.total_daily_logs} sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.current_streak} days</div>
              <p className="text-xs text-zinc-500">{stats.branches_touched}/15 branches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">{stats.domains_surveying} surveying</Badge>
                <Badge variant="outline">{stats.domains_surveyed} surveyed</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hub Completion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hub Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hubDomains.map((hub) => (
                <div key={hub.domain_id} className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    {hub.books_read >= 4 ? '✅' : '🔄'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {hub.domain_id} {hub.name}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {hub.books_read}/4
                      </span>
                    </div>
                    <Progress value={(hub.books_read / 4) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/next">
            <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-semibold">Get Recommendation</h3>
                  <p className="text-sm text-zinc-500">Next domain to read</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pair">
            <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎲</div>
                  <h3 className="font-semibold">Bisociation Pair</h3>
                  <p className="text-sm text-zinc-500">Cross-domain insights</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/gaps">
            <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-semibold">Find Gaps</h3>
                  <p className="text-sm text-zinc-500">Untouched areas</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Branch Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from(branchCoverage.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([branchId, { touched, total }]) => (
                  <div
                    key={branchId}
                    className={`p-3 rounded-lg border ${
                      touched === 0
                        ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                        : touched === total
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                    }`}
                  >
                    <div className="text-xs font-medium text-zinc-500">{branchId}</div>
                    <div className="text-sm font-semibold truncate">
                      {BRANCH_NAMES[branchId]}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {touched}/{total}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
    </main>
  );
}
