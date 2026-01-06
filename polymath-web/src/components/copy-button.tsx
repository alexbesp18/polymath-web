'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={className || "absolute top-2 right-2 px-2 py-1 text-xs bg-white dark:bg-zinc-700 rounded border hover:bg-zinc-50 dark:hover:bg-zinc-600"}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
