'use client';

import { useState } from 'react';
import { slots } from '@/lib/domains';
import { Copy, Check } from 'lucide-react';
import type { SlotCode } from '@/types';

const SLOT_PROMPTS: Record<SlotCode, string> = {
  FND: `Recommend 5 foundational books for learning {DOMAIN}.
Focus on: core concepts, beginner-friendly entry points, widely-cited introductions.
Rank by: accessibility first, then depth of coverage.
Format: Title by Author — one-line reason`,

  ORT: `Recommend 5 books representing the mainstream consensus in {DOMAIN}.
Focus on: textbooks, authoritative references, standard academic works.
Rank by: citation count and adoption in curricula.
Format: Title by Author — one-line reason`,

  HRS: `Recommend 5 contrarian or heterodox books in {DOMAIN}.
Focus on: alternative theories, critiques of mainstream, paradigm challengers.
Rank by: intellectual rigor despite being non-mainstream.
Format: Title by Author — one-line reason`,

  FRN: `Recommend 5 books on cutting-edge research in {DOMAIN}.
Focus on: recent publications (last 5 years), active research frontiers, emerging theories.
Rank by: novelty and potential impact.
Format: Title by Author — one-line reason`,

  HST: `Recommend 5 books on the history of {DOMAIN}.
Focus on: how the field developed, key debates, biographical works on founders.
Rank by: narrative quality and historical insight.
Format: Title by Author — one-line reason`,

  BRG: `Recommend 5 books that connect {DOMAIN} to other fields.
Focus on: interdisciplinary works, cross-domain applications, synthesis books.
Rank by: breadth of connections made.
Format: Title by Author — one-line reason`,
};

export function SlotLegend() {
  const [expandedSlot, setExpandedSlot] = useState<SlotCode | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSlotClick = (code: SlotCode) => {
    setExpandedSlot(expandedSlot === code ? null : code);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!expandedSlot) return;
    const prompt = SLOT_PROMPTS[expandedSlot];
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const expandedSlotInfo = expandedSlot
    ? slots.find((s) => s.code === expandedSlot)
    : null;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-200">
      <div className="flex flex-wrap gap-2 text-xs">
        {slots.map((slot) => (
          <button
            key={slot.code}
            onClick={() => handleSlotClick(slot.code as SlotCode)}
            className={`px-2 py-1 rounded transition-colors ${
              expandedSlot === slot.code
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span className="font-mono font-medium">{slot.code}</span>{' '}
            <span className="text-zinc-400">{slot.name}</span>
          </button>
        ))}
      </div>

      {expandedSlot && expandedSlotInfo && (
        <div className="mt-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="text-sm font-medium text-zinc-700 mb-1">
            {expandedSlotInfo.name}
          </div>
          <div className="text-xs text-zinc-500 mb-3">
            {expandedSlotInfo.description}
          </div>
          <div className="relative">
            <pre className="text-xs bg-white p-3 rounded border border-zinc-200 whitespace-pre-wrap font-mono text-zinc-700 pr-12">
              {SLOT_PROMPTS[expandedSlot]}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 transition-colors"
              title="Copy prompt"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-500" />
              )}
            </button>
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Replace <code className="bg-zinc-200 px-1 rounded">{'{DOMAIN}'}</code> with your target domain
          </div>
        </div>
      )}
    </div>
  );
}
