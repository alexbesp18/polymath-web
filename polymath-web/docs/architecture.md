# Polymath-Web Architecture

> **Last Updated**: 2025-01-06
> **Framework**: Next.js 16.1.1 (App Router)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel Edge                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Next.js    │    │   Next.js    │    │   Next.js    │     │
│   │   Pages      │    │   API Routes │    │   Server     │     │
│   │   (SSR)      │    │   (/api/*)   │    │   Actions    │     │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│          │                   │                   │              │
│          └───────────────────┴───────────────────┘              │
│                              │                                   │
│                    ┌─────────▼─────────┐                        │
│                    │   Supabase Client │                        │
│                    │   (src/lib/)      │                        │
│                    └─────────┬─────────┘                        │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     Supabase        │
                    │     PostgreSQL      │
                    │  (polymath schema)  │
                    └─────────────────────┘
```

---

## Directory Structure

```
polymath-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home (Tree + Current Book + Queue)
│   │   ├── layout.tsx          # Root layout with header
│   │   ├── globals.css         # Tailwind base styles
│   │   ├── domains/
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Domain detail
│   │   │       ├── error.tsx   # Error boundary
│   │   │       └── not-found.tsx
│   │   ├── connections/
│   │   │   └── page.tsx        # Bisociation pairs
│   │   ├── reference/
│   │   │   └── page.tsx        # All domains by branch
│   │   ├── distance/
│   │   │   └── page.tsx        # Branch distance matrix
│   │   └── api/
│   │       ├── reading/
│   │       │   └── route.ts    # Reading operations
│   │       └── insights/
│   │           └── route.ts    # Save/get insights
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── knowledge-tree.tsx  # D3 radial visualization
│   │   ├── current-book.tsx    # Current reading card
│   │   ├── reading-queue.tsx   # Queue list
│   │   ├── domain-actions.tsx  # Add book form
│   │   ├── copy-button.tsx     # Client-side copy
│   │   ├── command-palette.tsx # Cmd+K search
│   │   └── save-insight-button.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts         # DB client + operations
│   │   ├── bisociation.ts      # Pairing algorithm
│   │   ├── distance.ts         # Branch distance matrix
│   │   ├── hub-books.ts        # Isomorphism definitions
│   │   └── utils.ts            # Helpers (cn, etc.)
│   │
│   └── types/
│       └── index.ts            # TypeScript definitions
│
├── supabase/
│   └── migrations/
│       └── 20250106_ux_redesign.sql
│
├── public/                     # Static assets
├── docs/                       # Documentation
└── package.json
```

---

## Data Model

### Database Schema (Supabase)

```sql
-- Schema: polymath

-- Core reference data
CREATE TABLE polymath.branches (
  branch_id TEXT PRIMARY KEY,  -- "01", "02", etc.
  name TEXT NOT NULL           -- "Physical Sciences", etc.
);

CREATE TABLE polymath.domains (
  domain_id TEXT PRIMARY KEY,  -- "01.01", "01.02", etc.
  name TEXT NOT NULL,
  branch_id TEXT REFERENCES polymath.branches(branch_id),
  description TEXT,
  is_hub BOOLEAN DEFAULT false,
  is_expert BOOLEAN DEFAULT false
);

CREATE TABLE polymath.branch_distances (
  branch_a TEXT,
  branch_b TEXT,
  distance INTEGER CHECK (distance BETWEEN 0 AND 4),
  PRIMARY KEY (branch_a, branch_b)
);

-- User progress
CREATE TABLE polymath.domain_progress (
  domain_id TEXT PRIMARY KEY REFERENCES polymath.domains(domain_id),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'read')),
  book_title TEXT,
  book_author TEXT,
  completed_at TIMESTAMPTZ
);

CREATE TABLE polymath.reading_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id TEXT NOT NULL,
  book_title TEXT NOT NULL,
  book_author TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE polymath.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_a TEXT NOT NULL,
  domain_b TEXT NOT NULL,
  insight_type TEXT DEFAULT 'bisociation',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### TypeScript Types

```typescript
type DomainStatus = 'unread' | 'reading' | 'read';

interface Domain {
  domain_id: string;
  name: string;
  branch_id: string;
  description: string | null;
  is_hub: boolean;
  is_expert: boolean;
}

interface DomainWithProgress extends Domain {
  status: DomainStatus;
  book_title: string | null;
  book_author: string | null;
  completed_at: string | null;
}

interface QueueItem {
  id: string;
  domain_id: string;
  domain_name: string;
  book_title: string;
  book_author: string | null;
  position: number;
}

interface BisociationPair {
  anchor: DomainWithProgress;
  distant: DomainWithProgress;
  distance: number;
}
```

---

## Key Algorithms

### Bisociation Pairing (`src/lib/bisociation.ts`)

```
1. Find anchor domain:
   - User's strongest branch (most books read)
   - Pick a domain from that branch

2. Find distant domain:
   - Calculate branch distances from anchor
   - Filter branches at distance >= 3
   - Pick unread domain from distant branch

3. Generate synthesis prompts:
   - What isomorphisms exist between these domains?
   - What would a practitioner of A notice in B?
   - What would break if you applied A's rules to B?
```

### Branch Distance Matrix (`src/lib/distance.ts`)

```
Distance scale:
0 = Same branch
1 = Adjacent branches (Physics ↔ Chemistry)
2 = Related disciplines (Biology ↔ Medicine)
3 = Different fields (Engineering ↔ Psychology)
4 = Maximum distance (Physics ↔ Religion)

Matrix is symmetric, stored as branch_a < branch_b
```

---

## Component Architecture

### Server Components (Default)
- All pages in `/app`
- Data fetching at render time
- No client-side state

### Client Components (`'use client'`)
- `KnowledgeTree` - D3 visualization needs DOM
- `CopyButton` - Browser clipboard API
- `CommandPalette` - Keyboard events
- `DomainActions` - Form submission with state

### Data Flow

```
Page (Server) → Supabase → Data
     ↓
Client Components → API Routes → Supabase → Mutations
```

---

## API Routes

### POST /api/reading

```typescript
// Actions: start, finish, abandon, queue, unqueue

// Start reading
{ action: 'start', domainId: '01.01', bookTitle: 'The Book', bookAuthor: 'Author' }

// Finish reading
{ action: 'finish', domainId: '01.01' }

// Abandon (reset to unread)
{ action: 'abandon', domainId: '01.01' }

// Add to queue
{ action: 'queue', domainId: '01.01', bookTitle: 'Title', bookAuthor: 'Author' }

// Remove from queue
{ action: 'unqueue', queueId: 'uuid' }
```

### POST /api/insights

```typescript
// Save insight
{ domainA: '01.01', domainB: '15.01', insightType: 'bisociation', content: '...' }
```

---

## State Transitions

```
READING STATUS:
unread ──[Start Reading]──► reading ──[Finish]──► read
              ↑                │
              └──[Abandon]─────┘

QUEUE:
(empty) ──[Add to Queue]──► queued ──[Start from Queue]──► reading
                              │
                    [Remove from Queue]
                              ↓
                          (removed)
```

---

## Security

- **RLS Policies**: All tables have `USING (true)` for anon access
- **No Auth**: Single-user app, no authentication required
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Performance Considerations

1. **revalidate = 0** on all pages (fresh data each request)
2. **No caching** currently implemented
3. **D3 renders client-side** (can cause flash)
4. **All 180 domains loaded at once** (no pagination)

---

## Deployment

- **Platform**: Vercel
- **URL**: https://polymath-web.vercel.app
- **Branch**: main (auto-deploy)
- **Environment**: Production env vars set in Vercel dashboard
