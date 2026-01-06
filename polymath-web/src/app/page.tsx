import { getAllDomains, getCurrentBook, getReadingQueue, getStats } from '@/lib/supabase';
import { KnowledgeTree } from '@/components/knowledge-tree';
import { CurrentBookCard } from '@/components/current-book';
import { ReadingQueueCard } from '@/components/reading-queue';

export const revalidate = 0; // Always fresh

export default async function Home() {
  const [domains, currentBook, queue, stats] = await Promise.all([
    getAllDomains(),
    getCurrentBook(),
    getReadingQueue(),
    getStats(),
  ]);

  // Group domains by branch for tree
  const domainsByBranch = new Map<string, typeof domains>();
  for (const d of domains) {
    const current = domainsByBranch.get(d.branch_id) || [];
    current.push(d);
    domainsByBranch.set(d.branch_id, current);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Knowledge Tree */}
      <div className="mb-8">
        <KnowledgeTree
          domains={domains}
          domainsByBranch={Object.fromEntries(domainsByBranch)}
        />
      </div>

      {/* Current Book + Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CurrentBookCard currentBook={currentBook} />
        <ReadingQueueCard queue={queue} />
      </div>

      {/* Stats Footer */}
      <div className="flex flex-wrap gap-6 justify-center text-sm text-zinc-500">
        <span>{stats.domains_read} domains read</span>
        <span>{Math.round((stats.domains_read / stats.total_domains) * 100)}% coverage</span>
        <span>{stats.branches_touched}/15 branches touched</span>
        <span>{stats.queue_length} in queue</span>
      </div>
    </main>
  );
}
