import { getAllDomains, getDailyLogs, getBooks, calculateStats } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { HUB_DOMAIN_IDS, BRANCH_NAMES } from '@/types';
import { getNextSlot, getSlotName, TraversalEngine } from '@/lib/traversal';
import { getBranchDistance } from '@/lib/distance';
import { HUB_TARGET_BOOKS } from '@/lib/constants';

export const revalidate = 60;

export default async function Dashboard() {
  const [domains, logs, books] = await Promise.all([
    getAllDomains(),
    getDailyLogs(365),
    getBooks(),
  ]);

  const stats = calculateStats(domains, logs, books);

  // Get hub domains with progress
  const hubDomains = domains.filter((d) =>
    HUB_DOMAIN_IDS.includes(d.domain_id as typeof HUB_DOMAIN_IDS[number])
  );

  // Find the current hub to continue (incomplete, most progress)
  const incompleteHubs = hubDomains
    .filter((h) => h.books_read < HUB_TARGET_BOOKS)
    .sort((a, b) => b.books_read - a.books_read);
  const currentHub = incompleteHubs[0];

  // Count completed hubs
  const completedHubs = hubDomains.filter((h) => h.books_read >= HUB_TARGET_BOOKS).length;

  // Find a distant domain for exploration (maximum distance from expert areas)
  const traversalEngine = new TraversalEngine();
  const recentDomainIds = logs.slice(0, 7).map((l) => l.domain_id);
  const distantRec = traversalEngine.recommendNext(domains, recentDomainIds, 'hub-completion');

  // Get recent activity
  const recentLogs = logs.slice(0, 5);

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
        {greeting}
      </h1>

      {/* Continue Learning Hero */}
      {currentHub && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  Continue Learning
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {currentHub.name}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Hub {completedHubs + 1}/7 · Book {currentHub.books_read + 1} of {HUB_TARGET_BOOKS}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentHub.books_read / HUB_TARGET_BOOKS) * 100}%` }}
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getNextSlot(currentHub.books_read)}
                  </Badge>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  Next: {getSlotName(getNextSlot(currentHub.books_read))}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                href={`/domains/${currentHub.domain_id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Open Domain
              </Link>
              <Link
                href={`/log?domain=${currentHub.domain_id}`}
                className="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-center"
              >
                Log Session
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All hubs complete message */}
      {!currentHub && hubDomains.length > 0 && (
        <Card className="mb-6 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              All Hub Domains Complete!
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              You've completed all 7 hub domains. Time for bisociation phase!
            </p>
            <Link
              href="/pair"
              className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Bisociation Pair
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Distant Exploration */}
      {distantRec && distantRec.domain.domain_id !== currentHub?.domain_id && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                  Distant Exploration
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {distantRec.domain.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {distantRec.reason}
                </p>
              </div>
              <Link
                href={`/domains/${distantRec.domain.domain_id}`}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                Explore
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold">{stats.current_streak}</div>
            <p className="text-xs text-zinc-500">day streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold">{stats.total_books_read}</div>
            <p className="text-xs text-zinc-500">books</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold">{stats.domains_touched}</div>
            <p className="text-xs text-zinc-500">domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold">{completedHubs}/7</div>
            <p className="text-xs text-zinc-500">hubs</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-zinc-500 text-sm">No recent activity. Start reading!</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => {
                const domain = domains.find((d) => d.domain_id === log.domain_id);
                const book = books.find((b) => b.id === log.book_id);
                return (
                  <Link
                    key={log.id}
                    href={`/domains/${log.domain_id}`}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {domain?.name || log.domain_id}
                      </p>
                      {book && (
                        <p className="text-sm text-zinc-500 truncate">
                          {book.title}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-zinc-500">
                        {new Date(log.log_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {log.reading_time_minutes > 0 && (
                        <p className="text-xs text-zinc-400">
                          {log.reading_time_minutes} min
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hub Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hub Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hubDomains.map((hub) => {
              const isComplete = hub.books_read >= HUB_TARGET_BOOKS;
              const isCurrent = hub.domain_id === currentHub?.domain_id;

              return (
                <Link
                  key={hub.domain_id}
                  href={`/domains/${hub.domain_id}`}
                  className={`p-3 rounded-lg transition-colors ${
                    isComplete
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : isCurrent
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="text-xs text-zinc-500 mb-1">{hub.domain_id}</div>
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {hub.name}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isComplete ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(hub.books_read / HUB_TARGET_BOOKS) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">
                      {hub.books_read}/{HUB_TARGET_BOOKS}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
