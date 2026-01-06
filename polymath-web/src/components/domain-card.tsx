'use client';

import { SlotButton } from './slot-button';
import { Badge } from './ui/badge';
import { SLOT_CODES } from '@/lib/constants';
import type { Domain } from '@/lib/domains';
import type { SlotProgress, SlotCode } from '@/types';
import { slotKey } from '@/types';

interface DomainCardProps {
  domain: Domain;
  progressMap: Map<string, SlotProgress>;
  onSlotClick: (domainId: string, slot: SlotCode, progress: SlotProgress | null) => void;
}

export function DomainCard({ domain, progressMap, onSlotClick }: DomainCardProps) {
  const completedCount = SLOT_CODES.filter(
    (slot) => progressMap.has(slotKey(domain.id, slot))
  ).length;

  return (
    <div className="py-3 px-4 border-b border-zinc-100 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900">{domain.id}</span>
            <span className="text-zinc-700">{domain.name}</span>
            {domain.isHub && (
              <Badge variant="secondary" className="text-xs">
                HUB
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500 mt-0.5">{domain.description}</p>
        </div>
        <div className="text-sm text-zinc-400 whitespace-nowrap">
          {completedCount}/6
        </div>
      </div>
      <div className="flex gap-1.5 mt-2">
        {SLOT_CODES.map((slot) => {
          const progress = progressMap.get(slotKey(domain.id, slot)) || null;
          return (
            <SlotButton
              key={slot}
              domainId={domain.id}
              slot={slot as SlotCode}
              progress={progress}
              onEmpty={() => onSlotClick(domain.id, slot as SlotCode, null)}
              onFilled={() => onSlotClick(domain.id, slot as SlotCode, progress)}
            />
          );
        })}
      </div>
    </div>
  );
}
