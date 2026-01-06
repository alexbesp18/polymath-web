# Polymath Tracker - Architecture Documentation

> **Last Updated**: 2025-01-06 (Post-Rebuild)
> **Live URL**: https://polymath-web.vercel.app

## Overview

A reading tracker for systematic polymathic learning across **180 academic domains** organized into **15 branches**. Each domain has **6 function slots** representing different reading perspectives (1,080 total slots to complete).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix primitives) |
| Database | Supabase (PostgreSQL, custom `polymath` schema) |
| Hosting | Vercel |

---

## Project Structure

```
polymath-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Main tracker page (client component)
│   │   ├── globals.css         # Tailwind + custom styles
│   │   └── error.tsx           # Error boundary
│   ├── components/
│   │   ├── progress-header.tsx # Stats bar + slot legend
│   │   ├── branch-list.tsx     # Collapsible branch accordion
│   │   ├── domain-card.tsx     # Domain row with 6 slot buttons
│   │   ├── slot-button.tsx     # Individual slot (empty/filled)
│   │   ├── slot-legend.tsx     # Interactive legend with prompts
│   │   ├── log-modal.tsx       # Modal to mark slot complete
│   │   ├── slot-popover.tsx    # Modal to view/remove completed slot
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── supabase.ts         # Database operations (3 functions)
│   │   ├── domains.ts          # Static data loader + helpers
│   │   ├── constants.ts        # System dimensions
│   │   └── utils.ts            # cn() helper for classnames
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── data/
│       └── domains.json        # Static domain/branch/slot definitions
├── .env.local                  # Supabase credentials
└── package.json
```

---

## Database Schema

**Schema:** `polymath` (custom schema, not public)

### Table: `slot_progress`

```sql
CREATE TABLE polymath.slot_progress (
  domain_id    TEXT NOT NULL,
  slot         TEXT NOT NULL CHECK (slot IN ('FND','ORT','HRS','FRN','HST','BRG')),
  book_title   TEXT,
  book_author  TEXT,
  completed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (domain_id, slot)
);

-- RLS Policy (permissive for single-user)
ALTER TABLE polymath.slot_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON polymath.slot_progress FOR ALL USING (true) WITH CHECK (true);
```

| Column | Type | Description |
|--------|------|-------------|
| `domain_id` | TEXT | e.g., "01.02" |
| `slot` | TEXT | One of: FND, ORT, HRS, FRN, HST, BRG |
| `book_title` | TEXT | Optional book title |
| `book_author` | TEXT | Optional author name |
| `completed_at` | TIMESTAMPTZ | When marked complete |

**Primary Key:** `(domain_id, slot)` - composite

---

## Data Model

### Domain Hierarchy

```
Branch (15 total)
  └── Domain (12 per branch avg, 180 total)
       └── Slot (6 per domain, 1,080 total)
```

### The 15 Branches

| ID | Name | Domains |
|----|------|---------|
| 01 | Physical Sciences | 13 |
| 02 | Life Sciences | 12 |
| 03 | Formal Sciences | 11 |
| 04 | Mind Sciences | 10 |
| 05 | Social Sciences | 16 |
| 06 | Humanities | 14 |
| 07 | Applied Sciences | 16 |
| 08 | Health Sciences | 11 |
| 09 | Creative Arts | 12 |
| 10 | Business | 12 |
| 11 | Communications | 10 |
| 12 | Education | 8 |
| 13 | Law & Governance | 10 |
| 14 | Trades & Crafts | 13 |
| 15 | Religion & Spirituality | 12 |

### The 6 Slot Types

| Code | Name | Purpose |
|------|------|---------|
| **FND** | Foundation | Core concepts, entry point |
| **ORT** | Orthodoxy | Mainstream consensus view |
| **HRS** | Heresy | Contrarian/alternative takes |
| **FRN** | Frontier | Active research, cutting edge |
| **HST** | History | How the field evolved |
| **BRG** | Bridge | Cross-domain connections |

### Hub Domains (7 High-Connectivity Domains)

These domains have cross-domain applicability:
- `01.02` Thermodynamics
- `02.04` Evolutionary Biology
- `03.04` Probability & Statistics
- `03.06` Combinatorics
- `03.07` Information Theory
- `03.09` Game Theory
- `07.14` Systems Engineering

---

## TypeScript Types

### `src/types/index.ts`

```typescript
// The 6 slot codes
type SlotCode = 'FND' | 'ORT' | 'HRS' | 'FRN' | 'HST' | 'BRG';

// Database row from slot_progress table
interface SlotProgress {
  domain_id: string;      // e.g., "01.02"
  slot: SlotCode;
  book_title: string | null;
  book_author: string | null;
  completed_at: string;   // ISO timestamp
}

// In-memory lookup map, keyed by "domainId:slot"
type SlotProgressMap = Map<string, SlotProgress>;

// Helper to create map key
function slotKey(domainId: string, slot: string): string {
  return `${domainId}:${slot}`;
}
```

### `src/lib/domains.ts`

```typescript
interface Domain {
  id: string;           // e.g., "01.02"
  name: string;         // e.g., "Thermodynamics"
  description: string;  // Short description
  isHub: boolean;       // Is this a hub domain?
}

interface Branch {
  id: string;           // e.g., "01"
  name: string;         // e.g., "Physical Sciences"
  domains: Domain[];
}

interface Slot {
  code: string;         // e.g., "FND"
  name: string;         // e.g., "Foundation"
  description: string;  // e.g., "Core concepts, entry point"
}

// Exported data
const branches: Branch[];           // 15 branches
const slots: Slot[];                // 6 slot types
const hubDomains: string[];         // 7 hub domain IDs
const allDomains: Domain[];         // 180 domains (flattened)

// Helper functions
function getDomainById(id: string): Domain | undefined;
function getBranchById(id: string): Branch | undefined;
function getBranchForDomain(domainId: string): Branch | undefined;
function isHubDomain(domainId: string): boolean;
function getSlotByCode(code: string): Slot | undefined;
```

---

## Supabase Client

### `src/lib/supabase.ts`

Only 3 database operations:

```typescript
import { createClient } from '@supabase/supabase-js';

// Client configured for custom 'polymath' schema
const supabase = createClient(url, anonKey, {
  db: { schema: 'polymath' }
});

// 1. Get all progress entries
async function getSlotProgress(): Promise<SlotProgress[]> {
  const { data, error } = await supabase
    .from('slot_progress')
    .select('*')
    .order('completed_at', { ascending: false });
  if (error) throw error;
  return data as SlotProgress[];
}

// 2. Mark a slot complete (upsert - creates or updates)
async function markSlotComplete(
  domainId: string,
  slot: SlotCode,
  bookTitle?: string,
  bookAuthor?: string
): Promise<SlotProgress> {
  const { data, error } = await supabase
    .from('slot_progress')
    .upsert({
      domain_id: domainId,
      slot,
      book_title: bookTitle || null,
      book_author: bookAuthor || null,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as SlotProgress;
}

// 3. Remove a slot entry
async function removeSlotProgress(domainId: string, slot: SlotCode): Promise<void> {
  const { error } = await supabase
    .from('slot_progress')
    .delete()
    .eq('domain_id', domainId)
    .eq('slot', slot);
  if (error) throw error;
}
```

---

## Component Architecture

### Data Flow Diagram

```
page.tsx (state owner)
    │
    ├── progressMap: Map<string, SlotProgress>  ← loaded from Supabase on mount
    ├── logModal: { open, domainId, slot }       ← for logging new reading
    └── detailModal: { open, progress }          ← for viewing/removing
    │
    ├── ProgressHeader
    │       ├── Progress bar (% complete)
    │       ├── Stats (slots complete, domains started/complete)
    │       ├── "Pick Random" button → finds random empty slot
    │       └── SlotLegend → clickable legend with copy-pastable prompts
    │
    └── BranchList[] (15 branches)
            │
            ├── Collapsed: shows branch name + "X/Y domains started"
            └── Expanded: shows DomainCard[] for each domain
                    │
                    └── DomainCard
                            ├── Domain ID, name, description
                            ├── HUB badge (if hub domain)
                            ├── "X/6" completion count
                            └── SlotButton[] (6 buttons)
                                    ├── Empty (gray) → click opens LogModal
                                    └── Filled (green ✓) → click opens SlotPopover
```

### Component Props Reference

```typescript
// ProgressHeader
interface ProgressHeaderProps {
  progressMap: Map<string, SlotProgress>;
  onPickRandom: () => void;
}

// BranchList
interface BranchListProps {
  branch: Branch;
  progressMap: Map<string, SlotProgress>;
  onSlotClick: (domainId: string, slot: SlotCode, progress: SlotProgress | null) => void;
  defaultExpanded?: boolean;  // First branch starts expanded
}

// DomainCard
interface DomainCardProps {
  domain: Domain;
  progressMap: Map<string, SlotProgress>;
  onSlotClick: (domainId: string, slot: SlotCode, progress: SlotProgress | null) => void;
}

// SlotButton
interface SlotButtonProps {
  domainId: string;
  slot: SlotCode;
  progress: SlotProgress | null;
  onEmpty: () => void;   // Called when clicking empty slot
  onFilled: () => void;  // Called when clicking filled slot
}

// LogModal (for marking slot complete)
interface LogModalProps {
  domainId: string;
  slot: SlotCode;
  open: boolean;
  onClose: () => void;
  onSubmit: (bookTitle: string, bookAuthor: string) => void;
  loading?: boolean;
}

// SlotPopover (for viewing/removing completed slot)
interface SlotPopoverProps {
  progress: SlotProgress;
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
  loading?: boolean;
}
```

---

## Key Algorithms

### Progress Map Lookup (O(1))

Progress is stored in a `Map<string, SlotProgress>` for fast lookup:

```typescript
// Create key
const key = slotKey(domainId, slot);  // Returns "01.02:FND"

// Check if complete
const isComplete = progressMap.has(key);

// Get progress details
const progress = progressMap.get(key);
```

### Stats Calculation

```typescript
// Total slots complete
const slotsComplete = progressMap.size;
const percentComplete = ((slotsComplete / 1080) * 100).toFixed(1);

// Domains started (at least 1 slot)
let domainsStarted = 0;
for (const domain of allDomains) {
  const hasAny = SLOT_CODES.some(slot => progressMap.has(slotKey(domain.id, slot)));
  if (hasAny) domainsStarted++;
}

// Domains complete (all 6 slots)
let domainsComplete = 0;
for (const domain of allDomains) {
  const count = SLOT_CODES.filter(slot =>
    progressMap.has(slotKey(domain.id, slot))
  ).length;
  if (count === 6) domainsComplete++;
}
```

### Pick Random Algorithm

Selects a random empty slot, scrolls to it, and opens the log modal:

```typescript
const handlePickRandom = useCallback(() => {
  // 1. Build list of all empty slots
  const emptySlots: { domainId: string; slot: string }[] = [];
  for (const domain of allDomains) {
    for (const slot of SLOT_CODES) {
      if (!progressMap.has(slotKey(domain.id, slot))) {
        emptySlots.push({ domainId: domain.id, slot });
      }
    }
  }

  // 2. Handle completion
  if (emptySlots.length === 0) {
    alert('All slots complete! Amazing!');
    return;
  }

  // 3. Pick random
  const random = emptySlots[Math.floor(Math.random() * emptySlots.length)];

  // 4. Scroll to element with data-domain attribute
  const element = document.querySelector(`[data-domain="${random.domainId}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Flash highlight
    element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
    setTimeout(() => {
      element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
    }, 2000);
  }

  // 5. Open log modal for that slot
  setLogModal({ open: true, domainId: random.domainId, slot: random.slot as SlotCode });
}, [progressMap]);
```

---

## Slot Legend Prompts

### `src/components/slot-legend.tsx`

Each slot has a tailored LLM prompt for book recommendations:

```typescript
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
```

**Usage**: Click a slot code in the legend → expands to show prompt → click Copy → paste into ChatGPT/Claude with your domain name.

---

## Static Data Format

### `src/data/domains.json`

```json
{
  "branches": [
    {
      "id": "01",
      "name": "Physical Sciences",
      "domains": [
        {
          "id": "01.01",
          "name": "Classical Mechanics",
          "description": "Motion, forces, energy at human scale",
          "isHub": false
        },
        {
          "id": "01.02",
          "name": "Thermodynamics",
          "description": "Heat, entropy, energy transfer",
          "isHub": true
        }
      ]
    }
  ],
  "slots": [
    { "code": "FND", "name": "Foundation", "description": "Core concepts, entry point" },
    { "code": "ORT", "name": "Orthodoxy", "description": "Mainstream consensus view" },
    { "code": "HRS", "name": "Heresy", "description": "Contrarian/alternative takes" },
    { "code": "FRN", "name": "Frontier", "description": "Active research, cutting edge" },
    { "code": "HST", "name": "History", "description": "How the field evolved" },
    { "code": "BRG", "name": "Bridge", "description": "Cross-domain connections" }
  ],
  "hubDomains": ["01.02", "02.04", "03.04", "03.06", "03.07", "03.09", "07.14"],
  "stats": {
    "totalBranches": 15,
    "totalDomains": 180,
    "totalSlots": 1080
  }
}
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Deployment

```bash
# Local development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

Vercel auto-deploys on push to `master` branch.

**GitHub:** https://github.com/alexbesp18/polymath-web

---

## Improvement Ideas

### Quick Wins
1. **Search/filter domains** - Command+K palette to jump to any domain
2. **Bulk import** - CSV upload for existing reading history
3. **Export** - Download progress as JSON/CSV
4. **Date picker** - Backdate completion dates
5. **Notes field** - Add reading notes per slot

### Medium Effort
6. **Reading stats** - Charts showing reading velocity, branch distribution
7. **Book details** - Link to Goodreads/Amazon for logged books
8. **Mobile optimizations** - Better touch targets, swipe gestures

### Larger Features
9. **Multi-user** - Auth + RLS for sharing progress
10. **Recommendations** - Suggest next slot based on patterns (hub completion, bisociation)
11. **Insights** - Cross-domain connection prompts
12. **API** - REST endpoints for external integrations
