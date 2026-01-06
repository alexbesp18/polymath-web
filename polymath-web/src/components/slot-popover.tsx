'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { getSlotByCode } from '@/lib/domains';
import type { SlotProgress } from '@/types';

interface SlotPopoverProps {
  progress: SlotProgress;
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
  loading?: boolean;
}

export function SlotPopover({
  progress,
  open,
  onClose,
  onRemove,
  loading = false,
}: SlotPopoverProps) {
  const slotInfo = getSlotByCode(progress.slot);
  const completedDate = new Date(progress.completed_at).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {progress.slot} · {slotInfo?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {progress.book_title && (
            <div>
              <div className="text-sm text-zinc-500">Book</div>
              <div className="font-medium">&quot;{progress.book_title}&quot;</div>
              {progress.book_author && (
                <div className="text-sm text-zinc-600">{progress.book_author}</div>
              )}
            </div>
          )}
          <div>
            <div className="text-sm text-zinc-500">Completed</div>
            <div className="text-sm">{completedDate}</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
