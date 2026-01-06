'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProgressHeader } from '@/components/progress-header';
import { BranchList } from '@/components/branch-list';
import { LogModal } from '@/components/log-modal';
import { SlotPopover } from '@/components/slot-popover';
import { branches, allDomains } from '@/lib/domains';
import { SLOT_CODES } from '@/lib/constants';
import { getSlotProgress, markSlotComplete, removeSlotProgress } from '@/lib/supabase';
import type { SlotProgress, SlotCode, SlotProgressMap } from '@/types';
import { slotKey } from '@/types';

export default function PolymathTracker() {
  const [progressMap, setProgressMap] = useState<SlotProgressMap>(new Map());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [logModal, setLogModal] = useState<{
    open: boolean;
    domainId: string;
    slot: SlotCode;
  }>({ open: false, domainId: '', slot: 'FND' });

  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    progress: SlotProgress | null;
  }>({ open: false, progress: null });

  // Ref for scrolling to random slot
  const containerRef = useRef<HTMLDivElement>(null);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await getSlotProgress();
      const map = new Map<string, SlotProgress>();
      for (const p of data) {
        map.set(slotKey(p.domain_id, p.slot), p);
      }
      setProgressMap(map);
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = useCallback(
    (domainId: string, slot: SlotCode, progress: SlotProgress | null) => {
      if (progress) {
        setDetailModal({ open: true, progress });
      } else {
        setLogModal({ open: true, domainId, slot });
      }
    },
    []
  );

  const handleLogSubmit = async (bookTitle: string, bookAuthor: string) => {
    setActionLoading(true);
    try {
      const result = await markSlotComplete(
        logModal.domainId,
        logModal.slot,
        bookTitle || undefined,
        bookAuthor || undefined
      );
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(slotKey(result.domain_id, result.slot), result);
        return next;
      });
      setLogModal({ open: false, domainId: '', slot: 'FND' });
    } catch (err) {
      console.error('Failed to mark slot complete:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!detailModal.progress) return;
    setActionLoading(true);
    try {
      await removeSlotProgress(
        detailModal.progress.domain_id,
        detailModal.progress.slot as SlotCode
      );
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.delete(slotKey(detailModal.progress!.domain_id, detailModal.progress!.slot));
        return next;
      });
      setDetailModal({ open: false, progress: null });
    } catch (err) {
      console.error('Failed to remove slot:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickRandom = useCallback(() => {
    // Find all empty slots
    const emptySlots: { domainId: string; slot: string }[] = [];
    for (const domain of allDomains) {
      for (const slot of SLOT_CODES) {
        if (!progressMap.has(slotKey(domain.id, slot))) {
          emptySlots.push({ domainId: domain.id, slot });
        }
      }
    }

    if (emptySlots.length === 0) {
      alert('All slots complete! Amazing!');
      return;
    }

    // Pick random
    const random = emptySlots[Math.floor(Math.random() * emptySlots.length)];

    // Find the element and scroll to it
    const element = document.querySelector(
      `[data-domain="${random.domainId}"]`
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Flash highlight
      element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
    }

    // Open log modal for that slot
    setLogModal({ open: true, domainId: random.domainId, slot: random.slot as SlotCode });
  }, [progressMap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50" ref={containerRef}>
      <ProgressHeader progressMap={progressMap} onPickRandom={handlePickRandom} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {branches.map((branch, idx) => (
          <div key={branch.id} data-branch={branch.id}>
            {branch.domains.map((domain) => (
              <div key={domain.id} data-domain={domain.id} className="transition-all" />
            ))}
            <BranchList
              branch={branch}
              progressMap={progressMap}
              onSlotClick={handleSlotClick}
              defaultExpanded={idx === 0}
            />
          </div>
        ))}
      </main>

      <LogModal
        domainId={logModal.domainId}
        slot={logModal.slot}
        open={logModal.open}
        onClose={() => setLogModal({ open: false, domainId: '', slot: 'FND' })}
        onSubmit={handleLogSubmit}
        loading={actionLoading}
      />

      {detailModal.progress && (
        <SlotPopover
          progress={detailModal.progress}
          open={detailModal.open}
          onClose={() => setDetailModal({ open: false, progress: null })}
          onRemove={handleRemove}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
