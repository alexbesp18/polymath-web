'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/command-palette';

const navItems = [
  { href: '/', label: 'Tree' },
  { href: '/connections', label: 'Connections' },
  { href: '/reference', label: 'Reference' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Polymath
          </Link>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center px-4">
            <CommandPalette />
          </div>

          <nav className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
