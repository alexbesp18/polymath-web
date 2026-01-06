import { getAllDomains } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { HUB_DOMAIN_IDS, BRANCH_NAMES } from '@/types';
import { getNextSlot } from '@/lib/traversal';

export const revalidate = 60;

export default async function GapsAnalysis() {
  const domains = await getAllDomains();

  // Find untouched branches
  const branchStats = new Map<string, { touched: number; total: number; domains: typeof domains }>();
  for (const d of domains) {
    const current = branchStats.get(d.branch_id) || { touched: 0, total: 0, domains: [] };
    current.total++;
    current.domains.push(d);
    if (d.status !== 'untouched') current.touched++;
    branchStats.set(d.branch_id, current);
  }

  const untouchedBranches = Array.from(branchStats.entries())
    .filter(([, stats]) => stats.touched === 0)
    .sort(([a], [b]) => a.localeCompare(b));

  // Find incomplete hubs
  const incompleteHubs = domains.filter(
    (d) =>
      HUB_DOMAIN_IDS.includes(d.domain_id as typeof HUB_DOMAIN_IDS[number]) &&
      d.books_read < 4
  );

  // Find stale domains (>90 days since last read)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const staleDomains = domains.filter((d) => {
    if (!d.last_read) return false;
    return new Date(d.last_read) < ninetyDaysAgo && d.status !== 'untouched';
  });

  // Calculate coverage
  const coverage = ((domains.filter((d) => d.status !== 'untouched').length / 180) * 100).toFixed(1);

  return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Gaps Analysis</h1>

        {/* Coverage Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {coverage}%
              </div>
              <p className="text-zinc-500">Domain Coverage</p>
              <p className="text-sm text-zinc-400 mt-2">
                {domains.filter((d) => d.status !== 'untouched').length}/180 domains touched
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Untouched Branches */}
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-500">🚨</span>
              Untouched Branches ({untouchedBranches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {untouchedBranches.length === 0 ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ All branches have been touched!
              </p>
            ) : (
              <div className="space-y-3">
                {untouchedBranches.map(([branchId, stats]) => (
                  <div
                    key={branchId}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{branchId} — {BRANCH_NAMES[branchId]}</span>
                      <p className="text-sm text-zinc-500">{stats.total} domains</p>
                    </div>
                    <Badge variant="destructive">Untouched</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incomplete Hubs */}
        <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-500">📚</span>
              Incomplete Hub Domains ({incompleteHubs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incompleteHubs.length === 0 ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ All hub domains are complete!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Domain</th>
                      <th className="text-center py-2">Books</th>
                      <th className="text-center py-2">Needed</th>
                      <th className="text-center py-2">Next Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incompleteHubs.map((hub) => (
                      <tr key={hub.domain_id} className="border-b">
                        <td className="py-2">
                          <Link
                            href={`/domains/${hub.domain_id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {hub.domain_id} {hub.name}
                          </Link>
                        </td>
                        <td className="text-center py-2">{hub.books_read}</td>
                        <td className="text-center py-2">{4 - hub.books_read}</td>
                        <td className="text-center py-2">
                          <Badge variant="outline">
                            {getNextSlot(hub.books_read)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stale Domains */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-orange-500">⏰</span>
              Stale Domains (&gt;90 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staleDomains.length === 0 ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ No stale domains!
              </p>
            ) : (
              <div className="space-y-2">
                {staleDomains.slice(0, 10).map((d) => (
                  <div
                    key={d.domain_id}
                    className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950 rounded"
                  >
                    <Link
                      href={`/domains/${d.domain_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {d.domain_id} {d.name}
                    </Link>
                    <span className="text-sm text-zinc-500">
                      Last: {d.last_read}
                    </span>
                  </div>
                ))}
                {staleDomains.length > 10 && (
                  <p className="text-sm text-zinc-500">
                    ... and {staleDomains.length - 10} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
  );
}
