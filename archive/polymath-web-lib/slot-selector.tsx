'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FunctionSlot } from '@/types';
import { SLOT_DESCRIPTIONS, type BookRecommendation } from '@/lib/hub-books';

const SLOTS: FunctionSlot[] = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];

interface SlotSelectorProps {
  domainId: string;
  domainName: string;
  booksRead: number;
  defaultSlot: FunctionSlot;
  recommendations: Record<FunctionSlot, BookRecommendation[]>;
  hasRecommendations: boolean;
}

export function SlotSelector({
  domainId,
  domainName,
  booksRead,
  defaultSlot,
  recommendations,
  hasRecommendations,
}: SlotSelectorProps) {
  const [selectedSlot, setSelectedSlot] = useState<FunctionSlot>(defaultSlot);

  const currentRecommendations = recommendations[selectedSlot] || [];
  const slotInfo = SLOT_DESCRIPTIONS[selectedSlot];

  return (
    <div className="space-y-6">
      {/* Interactive Slot Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Progress</CardTitle>
          <p className="text-sm text-zinc-500">
            Click any slot to see books & log a reading
          </p>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-zinc-500 mb-2">
              <span>{booksRead}/6 slots complete</span>
              <span>{Math.round((booksRead / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(booksRead / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Clickable Slot Grid */}
          <div className="grid grid-cols-6 gap-2">
            {SLOTS.map((slot, index) => {
              const isComplete = index < booksRead;
              const isSuggested = index === booksRead;
              const isSelected = slot === selectedSlot;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900'
                      : ''
                  } ${
                    isComplete
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
                      : isSuggested
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                  }`}
                >
                  <div className="font-bold text-sm">{slot}</div>
                  {isComplete && <div className="text-xs">✓</div>}
                  {isSuggested && !isComplete && <div className="text-xs">→</div>}
                </button>
              );
            })}
          </div>

          {/* Selected Slot Info */}
          <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {slotInfo.name}
                </span>
                <span className="text-zinc-500 ml-2">({selectedSlot})</span>
              </div>
              {selectedSlot === defaultSlot && booksRead < 6 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  Suggested Next
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {slotInfo.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Book Recommendations for Selected Slot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Books for {slotInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasRecommendations && currentRecommendations.length > 0 ? (
            <div className="space-y-3">
              {currentRecommendations.map((book, index) => (
                <div
                  key={index}
                  className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        "{book.title}"
                      </div>
                      <div className="text-sm text-zinc-500">{book.author}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {book.why}
                      </div>
                    </div>
                    <Link
                      href={`/log?domain=${domainId}&slot=${selectedSlot}&book=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Log This
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">
              No specific recommendations for this slot yet.
            </p>
          )}

          {/* Custom book option */}
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Link
              href={`/log?domain=${domainId}&slot=${selectedSlot}`}
              className="inline-flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Log a different book for {selectedSlot} →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
