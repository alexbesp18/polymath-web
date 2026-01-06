'use client';

import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { SlotLegend } from './slot-legend';
import { TOTAL_SLOTS, TOTAL_DOMAINS, SLOT_CODES } from '@/lib/constants';
import { allDomains } from '@/lib/domains';
import type { SlotProgress } from '@/types';
import { slotKey } from '@/types';
import { Shuffle } from 'lucide-react';

interface ProgressHeaderProps {
  progressMap: Map<string, SlotProgress>;
  onPickRandom: () => void;
}

export function ProgressHeader({ progressMap, onPickRandom }: ProgressHeaderProps) {
  const slotsComplete = progressMap.size;
  const percentComplete = ((slotsComplete / TOTAL_SLOTS) * 100).toFixed(1);

  // Count domains started (at least 1 slot) and complete (all 6 slots)
  let domainsStarted = 0;
  let domainsComplete = 0;

  for (const domain of allDomains) {
    const domainSlots = SLOT_CODES.filter((slot) =>
      progressMap.has(slotKey(domain.id, slot))
    ).length;
    if (domainSlots > 0) domainsStarted++;
    if (domainSlots === 6) domainsComplete++;
  }

  return (
    <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-zinc-900">POLYMATH</h1>
          <Button onClick={onPickRandom} variant="outline" size="sm">
            <Shuffle className="w-4 h-4 mr-2" />
            Pick Random
          </Button>
        </div>
        <Progress value={Number(percentComplete)} className="h-3 mb-2" />
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>
            {slotsComplete}/{TOTAL_SLOTS} slots ({percentComplete}%)
          </span>
          <span>
            {domainsStarted} started · {domainsComplete} complete
          </span>
        </div>
        <SlotLegend />
      </div>
    </div>
  );
}
