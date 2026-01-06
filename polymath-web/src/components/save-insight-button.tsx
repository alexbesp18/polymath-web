'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SaveInsightButtonProps {
  domainA: string;
  domainB: string;
  domainAName: string;
  domainBName: string;
  prompts: string[];
}

export function SaveInsightButton({
  domainA,
  domainB,
  domainAName,
  domainBName,
  prompts,
}: SaveInsightButtonProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Please enter your insight');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain_a: domainA,
          domain_b: domainB,
          insight_type: 'bisociation',
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save insight');
      }

      setSaved(true);
      setTimeout(() => {
        setOpen(false);
        setSaved(false);
        setContent('');
      }, 1500);
    } catch (_err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>💡</span>
          Save Insight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Bisociation Insight</DialogTitle>
          <DialogDescription>
            Capture your synthesis between {domainAName} and {domainBName}
          </DialogDescription>
        </DialogHeader>

        {saved ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-600 font-medium">Insight Saved!</p>
          </div>
        ) : (
          <>
            {/* Prompts as inspiration */}
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                Prompts to consider:
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                {prompts.slice(0, 2).map((prompt, i) => (
                  <li key={i} className="text-xs">• {prompt}</li>
                ))}
              </ul>
            </div>

            <textarea
              className="w-full p-3 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder="What connection or insight did you discover between these domains?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Insight'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
