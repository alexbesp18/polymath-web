import { getDailyLogs, getBooks, getAllDomains } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BRANCH_NAMES } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Reading History - Polymath Engine',
};

export default async function ReadingHistory() {
  const [logs, books, domains] = await Promise.all([
    getDailyLogs(365),
    getBooks(),
    getAllDomains(),
  ]);

  // Create lookup maps
  const domainMap = new Map(domains.map((d) => [d.domain_id, d]));
  const bookMap = new Map(books.map((b) => [b.id, b]));

  // Group logs by month
  const logsByMonth = new Map<string, typeof logs>();
  for (const log of logs) {
    const monthKey = log.log_date.substring(0, 7); // YYYY-MM
    const monthLogs = logsByMonth.get(monthKey) || [];
    monthLogs.push(log);
    logsByMonth.set(monthKey, monthLogs);
  }

  // Sort months descending
  const sortedMonths = Array.from(logsByMonth.entries()).sort(([a], [b]) =>
    b.localeCompare(a)
  );

  // Calculate stats
  const totalPages = logs.reduce((sum, l) => sum + l.pages_read, 0);
  const totalMinutes = logs.reduce((sum, l) => sum + l.reading_time_minutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Reading History</h1>
        <p className="text-zinc-500 mb-6">
          {logs.length} sessions • {totalPages.toLocaleString()} pages • {totalHours} hours
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold">{logs.length}</div>
              <p className="text-sm text-zinc-500">Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold">{totalPages.toLocaleString()}</div>
              <p className="text-sm text-zinc-500">Pages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold">{totalHours}</div>
              <p className="text-sm text-zinc-500">Hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        {logs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-zinc-500">No reading sessions logged yet.</p>
              <Link href="/log" className="text-blue-600 hover:underline mt-2 inline-block">
                Log your first session →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedMonths.map(([month, monthLogs]) => {
              const [year, monthNum] = month.split('-');
              const monthName = new Date(
                parseInt(year),
                parseInt(monthNum) - 1
              ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

              return (
                <div key={month}>
                  <h2 className="text-lg font-semibold mb-4 text-zinc-600 dark:text-zinc-400">
                    {monthName}
                    <span className="text-sm font-normal ml-2">
                      ({monthLogs.length} sessions)
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {monthLogs.map((log) => {
                      const domain = domainMap.get(log.domain_id);
                      const book = log.book_id ? bookMap.get(log.book_id) : null;

                      return (
                        <Card key={log.id}>
                          <CardContent className="py-3 px-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-zinc-400">
                                    {log.log_date}
                                  </span>
                                  {log.function_slot && (
                                    <Badge variant="outline" className="text-xs">
                                      {log.function_slot}
                                    </Badge>
                                  )}
                                </div>
                                <Link
                                  href={`/domains/${log.domain_id}`}
                                  className="font-medium hover:text-blue-600"
                                >
                                  {log.domain_id} — {domain?.name || 'Unknown'}
                                </Link>
                                {book && (
                                  <p className="text-sm text-zinc-500 truncate">
                                    📖 {book.title}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm text-zinc-500">
                                {log.pages_read > 0 && <div>{log.pages_read} pages</div>}
                                {log.reading_time_minutes > 0 && (
                                  <div>{log.reading_time_minutes} min</div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
  );
}
