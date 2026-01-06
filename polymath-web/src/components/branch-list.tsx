'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DomainCard } from './domain-card';
import { SLOT_CODES } from '@/lib/constants';
import type { Branch } from '@/lib/domains';
import type { SlotProgress, SlotCode } from '@/types';
import { slotKey } from '@/types';

interface BranchListProps {
  branch: Branch;
  progressMap: Map<string, SlotProgress>;
  onSlotClick: (domainId: string, slot: SlotCode, progress: SlotProgress | null) => void;
  defaultExpanded?: boolean;
}

export function BranchList({
  branch,
  progressMap,
  onSlotClick,
  defaultExpanded = false,
}: BranchListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Count domains with at least one slot complete
  const domainsStarted = branch.domains.filter((d) =>
    SLOT_CODES.some((slot) => progressMap.has(slotKey(d.id, slot)))
  ).length;

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          )}
          <span className="font-medium text-zinc-900">
            {branch.id} {branch.name}
          </span>
        </div>
        <span className="text-sm text-zinc-500">
          {domainsStarted}/{branch.domains.length}
        </span>
      </button>
      {expanded && (
        <div className="bg-white">
          {branch.domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              progressMap={progressMap}
              onSlotClick={onSlotClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
