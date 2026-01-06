'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getDomainById, getSlotByCode } from '@/lib/domains';
import type { SlotCode } from '@/types';

interface LogModalProps {
  domainId: string;
  slot: SlotCode;
  open: boolean;
  onClose: () => void;
  onSubmit: (bookTitle: string, bookAuthor: string) => void;
  loading?: boolean;
}

export function LogModal({
  domainId,
  slot,
  open,
  onClose,
  onSubmit,
  loading = false,
}: LogModalProps) {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');

  const domain = getDomainById(domainId);
  const slotInfo = getSlotByCode(slot);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bookTitle.trim(), bookAuthor.trim());
    setBookTitle('');
    setBookAuthor('');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Reading</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-zinc-500">Domain</div>
            <div className="font-medium">
              {domainId} {domain?.name}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-zinc-500">Slot</div>
            <div className="font-medium">
              {slot} ({slotInfo?.name})
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-500" htmlFor="bookTitle">
              Book Title (optional)
            </label>
            <Input
              id="bookTitle"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Enter book title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-500" htmlFor="bookAuthor">
              Author (optional)
            </label>
            <Input
              id="bookAuthor"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
              placeholder="Enter author name..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Mark Complete'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
