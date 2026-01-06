'use client';

import { cn } from '@/lib/utils';
import type { SlotProgress, SlotCode } from '@/types';
import { getSlotByCode } from '@/lib/domains';

interface SlotButtonProps {
  domainId: string;
  slot: SlotCode;
  progress: SlotProgress | null;
  onEmpty: () => void;
  onFilled: () => void;
}

export function SlotButton({
  slot,
  progress,
  onEmpty,
  onFilled,
}: SlotButtonProps) {
  const slotInfo = getSlotByCode(slot);
  const isComplete = progress !== null;

  return (
    <button
      onClick={isComplete ? onFilled : onEmpty}
      className={cn(
        'w-12 h-10 text-xs font-medium rounded border transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
        isComplete
          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
          : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300'
      )}
      title={slotInfo?.name || slot}
    >
      {isComplete ? '✓' : slot}
    </button>
  );
}
