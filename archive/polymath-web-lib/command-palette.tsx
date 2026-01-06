'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Domain {
  domain_id: string;
  name: string;
  branch_id: string;
  books_read: number;
  status: string;
}

interface CommandPaletteProps {
  domains: Domain[];
}

export function CommandPalette({ domains }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (domainId: string) => {
    setOpen(false);
    router.push(`/domains/${domainId}`);
  };

  // Group domains by branch
  const branchGroups = domains.reduce((acc, domain) => {
    const branchId = domain.branch_id;
    if (!acc[branchId]) {
      acc[branchId] = [];
    }
    acc[branchId].push(domain);
    return acc;
  }, {} as Record<string, Domain[]>);

  const branchNames: Record<string, string> = {
    '01': 'Physical Sciences',
    '02': 'Life Sciences',
    '03': 'Formal Sciences',
    '04': 'Earth & Space',
    '05': 'Engineering',
    '06': 'Medicine',
    '07': 'Social Sciences',
    '08': 'Business',
    '09': 'Psychology',
    '10': 'Philosophy',
    '11': 'Arts',
    '12': 'Literature',
    '13': 'History',
    '14': 'Law & Politics',
    '15': 'Religion',
  };

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 border rounded-lg hover:border-zinc-400 transition-colors"
      >
        <span>Search domains...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search domains by name or ID..." />
        <CommandList>
          <CommandEmpty>No domains found.</CommandEmpty>

          {/* Quick actions */}
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => { setOpen(false); router.push('/log'); }}>
              📝 Log Reading Session
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); router.push('/pair'); }}>
              🔀 Generate Bisociation Pair
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); router.push('/next'); }}>
              ➡️ Next Recommended Domain
            </CommandItem>
          </CommandGroup>

          {/* Domains by branch */}
          {Object.entries(branchGroups).map(([branchId, branchDomains]) => (
            <CommandGroup key={branchId} heading={branchNames[branchId] || branchId}>
              {branchDomains.map((domain) => (
                <CommandItem
                  key={domain.domain_id}
                  value={`${domain.domain_id} ${domain.name}`}
                  onSelect={() => handleSelect(domain.domain_id)}
                >
                  <span className="text-zinc-400 w-12">{domain.domain_id}</span>
                  <span className="flex-1">{domain.name}</span>
                  <span className="text-xs text-zinc-500">
                    {domain.books_read}/6
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
