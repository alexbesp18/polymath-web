'use client';

import { useEffect, useState, useCallback } from 'react';
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
  status: 'unread' | 'reading' | 'read';
}

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

const statusIcons: Record<string, string> = {
  unread: '',
  reading: '📖',
  read: '✓',
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch domains when dialog opens
  const fetchDomains = useCallback(async () => {
    if (domains.length > 0) return; // Already loaded
    setLoading(true);
    try {
      const res = await fetch('/api/domains');
      const data = await res.json();
      setDomains(data);
    } catch (err) {
      console.error('Failed to load domains:', err);
    } finally {
      setLoading(false);
    }
  }, [domains.length]);

  useEffect(() => {
    if (open) {
      fetchDomains();
    }
  }, [open, fetchDomains]);

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

  return (
    <>
      {/* Keyboard shortcut trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 border rounded-lg hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
      >
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">⌘K</kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search domains by name or ID..." />
        <CommandList>
          {loading ? (
            <div className="p-4 text-center text-zinc-500">Loading...</div>
          ) : (
            <>
              <CommandEmpty>No domains found.</CommandEmpty>

              {/* Quick actions */}
              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={() => { setOpen(false); router.push('/'); }}>
                  🌳 Knowledge Tree
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push('/connections'); }}>
                  🔀 Bisociation Connections
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push('/reference'); }}>
                  📚 Browse All Domains
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push('/distance'); }}>
                  📐 Distance Matrix
                </CommandItem>
              </CommandGroup>

              {/* Domains by branch */}
              {Object.entries(branchGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([branchId, branchDomains]) => (
                <CommandGroup key={branchId} heading={branchNames[branchId] || branchId}>
                  {branchDomains.map((domain) => (
                    <CommandItem
                      key={domain.domain_id}
                      value={`${domain.domain_id} ${domain.name} ${branchNames[domain.branch_id]}`}
                      onSelect={() => handleSelect(domain.domain_id)}
                    >
                      <span className="text-zinc-400 w-12">{domain.domain_id}</span>
                      <span className="flex-1">{domain.name}</span>
                      <span className={`text-xs ${
                        domain.status === 'read'
                          ? 'text-green-600'
                          : domain.status === 'reading'
                          ? 'text-blue-600'
                          : 'text-zinc-400'
                      }`}>
                        {statusIcons[domain.status]}
                        {domain.status === 'read' ? ' Read' : domain.status === 'reading' ? ' Reading' : ''}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
