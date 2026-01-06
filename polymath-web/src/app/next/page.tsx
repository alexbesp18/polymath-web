import { getAllDomains, getDailyLogs, getConfig } from '@/lib/supabase';
import { TraversalEngine, getNextSlot, getSlotName } from '@/lib/traversal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BRANCH_NAMES } from '@/types';

export const revalidate = 0; // Always fresh

export default async function NextRecommendation() {
  const [domains, logs, config] = await Promise.all([
    getAllDomains(),
    getDailyLogs(14),
    getConfig(),
  ]);

  // Get recent domain IDs
  const recentDomainIds = [...new Set(logs.map((l) => l.domain_id))];

  // Initialize traversal engine
  const engine = new TraversalEngine({
    hubTargetBooks: config?.hub_target_books || 4,
    expertDomains: config?.expert_domains || [],
  });

  // Get recommendation
  const phase = config?.current_phase || 'hub-completion';
  const recommendation = engine.recommendNext(domains, recentDomainIds, phase);

  if (!recommendation) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-zinc-500">No recommendations available.</p>
            <p className="text-sm text-zinc-400 mt-2">All domains may be recently read or complete.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { domain, slot, reason } = recommendation;
  const branchName = BRANCH_NAMES[domain.branch_id] || 'Unknown';

  return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">📚</div>
            <CardTitle className="text-2xl">Next Reading Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Domain Info */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {domain.domain_id} — {domain.name}
              </h2>
              <p className="text-lg text-zinc-500 mt-1">{branchName}</p>
            </div>

            {/* Badges */}
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                Slot: {slot} ({getSlotName(slot)})
              </Badge>
              <Badge variant="outline" className="text-base px-3 py-1">
                Books: {domain.books_read}
              </Badge>
              {domain.is_hub && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Hub
                </Badge>
              )}
            </div>

            {/* Reason */}
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-sm font-medium text-zinc-500 mb-1">Why this domain?</p>
              <p className="text-zinc-700 dark:text-zinc-300">{reason}</p>
            </div>

            {/* Description */}
            {domain.description && (
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400 italic">
                  {domain.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-4">
              <Link
                href={`/log?domain=${domain.domain_id}`}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Start Reading
              </Link>
              <Link
                href={`/domains/${domain.domain_id}`}
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-6 py-2 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                View Domain
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Recommendations */}
        <div className="mt-8 text-center">
          <Link
            href="/next"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Get another recommendation →
          </Link>
        </div>
      </main>
  );
}
