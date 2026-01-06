# Polymath Tracker — Rebuild Spec v1.0

> **Date**: 2025-01-06
> **Status**: Ready to build
> **Estimated build time**: 4-6 hours

---

## Product Definition

**One sentence**: A long-term reading progress tracker for systematic learning across 180 domains with 6 depth levels each.

**What it is**:
- A checklist with structure
- A progress visualization
- A "pick random" button for mild guidance

**What it is NOT**:
- A recommendation engine
- A habit tracker
- A note-taking app
- A synthesis tool

---

## Core Concepts

### Hierarchy
```
Branch (15)
└── Domain (180)
    └── Slot (6 per domain)
```

### The 6 Slots
| Code | Name | Purpose |
|------|------|---------|
| FND | Foundation | Core concepts, entry point |
| ORT | Orthodoxy | Mainstream consensus view |
| HRS | Heresy | Contrarian/alternative takes |
| FRN | Frontier | Active research, cutting edge |
| HST | History | How the field evolved |
| BRG | Bridge | Cross-domain connections |

### Hub Domains (7)
These connect to many fields — visually marked but not enforced:
- 01.02 Thermodynamics
- 02.04 Evolutionary Biology
- 03.04 Probability & Statistics
- 03.06 Combinatorics & Graph Theory
- 03.07 Information Theory
- 03.09 Game Theory
- 07.14 Systems Engineering

---

## Data Model

### Static Data (Hardcoded JSON)

```typescript
// domains.json — NEVER changes, no database needed
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
        // ... 11 more
      ]
    }
    // ... 14 more branches
  ]
}
```

### Dynamic Data (Single Table)

```sql
CREATE TABLE slot_progress (
  domain_id    TEXT NOT NULL,        -- "01.02"
  slot         TEXT NOT NULL,        -- "FND", "ORT", "HRS", "FRN", "HST", "BRG"
  book_title   TEXT,                 -- optional
  book_author  TEXT,                 -- optional
  completed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (domain_id, slot)
);

-- That's it. One table.
```

### Derived Stats (Computed on render)
```typescript
// No caching needed — 180 domains × 6 slots = 1080 max rows
const stats = {
  totalDomains: 180,
  domainsStarted: countDistinct(progress, 'domain_id'),  // at least 1 slot
  domainsComplete: countWhere(progress, domain => domain.slots === 6),
  totalSlots: 1080,
  slotsComplete: progress.length,
  percentComplete: (progress.length / 1080 * 100).toFixed(1)
};
```

---

## UI Specification

### Single Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  POLYMATH                                                           │
│                                                                     │
│  ████████████░░░░░░░░░░░░░░░░░░  312/1080 slots (29%)              │
│  47 domains started · 12 complete                    [Pick Random]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ▼ 01 Physical Sciences                                      3/13   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  01.02 Thermodynamics                              HUB      │   │
│  │  Heat, entropy, energy transfer                             │   │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┐                     │   │
│  │  │ FND │ ORT │ HRS │ FRN │ HST │ BRG │           4/6       │   │
│  │  │  ✓  │  ✓  │  ✓  │  ✓  │     │     │                     │   │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┘                     │   │
│  │                                                             │   │
│  │  01.01 Classical Mechanics                                  │   │
│  │  Motion, forces, energy at human scale                      │   │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┐                     │   │
│  │  │ FND │ ORT │ HRS │ FRN │ HST │ BRG │           1/6       │   │
│  │  │  ✓  │     │     │     │     │     │                     │   │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┘                     │   │
│  │                                                             │   │
│  │  01.03 Electromagnetism                                     │   │
│  │  Electric/magnetic fields, light                            │   │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┐                     │   │
│  │  │ FND │ ORT │ HRS │ FRN │ HST │ BRG │           0/6       │   │
│  │  │     │     │     │     │     │     │                     │   │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┘                     │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ▶ 02 Life Sciences                                          1/12   │
│  ▶ 03 Formal Sciences                                        4/11   │
│  ▶ 04 Mind Sciences                                          0/10   │
│  ▶ 05 Social Sciences                                        2/16   │
│  ...                                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Interactions

1. **Click branch header** → Expand/collapse domain list
2. **Click empty slot** → Opens log modal
3. **Click filled slot** → Shows book info + "Remove" option
4. **Click "Pick Random"** → Scrolls to random unread slot, highlights it
5. **Click "HUB" badge** → No action (just visual indicator)

### Log Modal (Minimal)

```
┌────────────────────────────────────────┐
│  Log Reading                       ✕   │
├────────────────────────────────────────┤
│                                        │
│  Domain: 01.02 Thermodynamics          │
│  Slot: FND (Foundation)                │
│                                        │
│  Book Title (optional)                 │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  Author (optional)                     │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  ┌────────────────────────────────┐   │
│  │         Mark Complete          │   │
│  └────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### Slot Detail Popover (When clicking filled slot)

```
┌─────────────────────────────────┐
│  FND · Foundation               │
│  ─────────────────────────────  │
│  "Laws of Thermodynamics"       │
│  Peter Atkins                   │
│  Completed: Jan 3, 2025         │
│                                 │
│  [Remove]                       │
└─────────────────────────────────┘
```

---

## Tech Stack

### Option A: Minimal (Recommended)
```
- Next.js 14 (App Router)
- Supabase (1 table)
- Tailwind CSS
- No component library (just HTML)
- Deployed on Vercel
```

### Option B: Even Simpler (If rebuilding from scratch)
```
- Single HTML file + vanilla JS
- localStorage (no backend)
- No build step
- Host anywhere (GitHub Pages, S3)
```

**Recommendation**: Option A if you want cloud sync across devices. Option B if you only use one device.

---

## File Structure (Option A)

```
polymath-tracker/
├── src/
│   ├── app/
│   │   ├── page.tsx              # The one page
│   │   ├── layout.tsx            # Minimal shell
│   │   └── globals.css           # Tailwind + minimal styles
│   ├── components/
│   │   ├── branch-list.tsx       # Collapsible branch
│   │   ├── domain-card.tsx       # Domain with slots
│   │   ├── slot-button.tsx       # Individual slot
│   │   ├── log-modal.tsx         # Log entry form
│   │   └── progress-bar.tsx      # Top progress
│   ├── lib/
│   │   ├── supabase.ts           # DB client
│   │   ├── domains.ts            # Static domain data
│   │   └── types.ts              # TypeScript types
│   └── data/
│       └── domains.json          # 180 domains, 15 branches
├── package.json
├── tailwind.config.js
└── .env.local                    # Supabase keys
```

**Total files**: ~15 (vs current ~50+)

---

## What Gets Deleted

| File/Feature | Status |
|--------------|--------|
| `knowledge-tree.tsx` (D3 viz) | DELETE |
| `reading-queue.tsx` | DELETE |
| `bisociation.ts` | DELETE |
| `traversal.ts` | DELETE |
| `distance.ts` | DELETE |
| `hub-books.ts` | DELETE |
| `/connections` page | DELETE |
| `/distance` page | DELETE |
| `/api/insights` route | DELETE |
| `insights` table | DELETE |
| `reading_queue` table | DELETE |
| `branch_distances` table | DELETE |
| `books` table | DELETE |
| `daily_logs` table | DELETE |
| `domain_progress` table | REPLACE with `slot_progress` |

---

## Migration Path

### From Current System

```sql
-- Extract existing progress into new schema
INSERT INTO slot_progress (domain_id, slot, book_title, book_author, completed_at)
SELECT 
  domain_id,
  CASE 
    WHEN books_read = 1 THEN 'FND'
    WHEN books_read = 2 THEN 'ORT'
    WHEN books_read = 3 THEN 'HRS'
    WHEN books_read = 4 THEN 'FRN'
    WHEN books_read = 5 THEN 'HST'
    WHEN books_read >= 6 THEN 'BRG'
  END as slot,
  book_title,
  book_author,
  completed_at
FROM domain_progress
WHERE status = 'read';
```

### From Scratch
Just start fresh. It's a reading tracker — you'll rebuild the data as you read.

---

## Implementation Checklist

### Phase 1: Data (30 min)
- [ ] Create `domains.json` with all 180 domains
- [ ] Create Supabase table `slot_progress`
- [ ] Add RLS policy (permissive for single user)

### Phase 2: Core UI (2 hours)
- [ ] Page layout with progress header
- [ ] Collapsible branch list
- [ ] Domain cards with 6 slot buttons
- [ ] Visual states: empty, filled, hub badge

### Phase 3: Interactions (1 hour)
- [ ] Log modal (open on empty slot click)
- [ ] Save to Supabase
- [ ] Slot detail popover (on filled slot click)
- [ ] Remove functionality

### Phase 4: Polish (1 hour)
- [ ] "Pick Random" button logic
- [ ] Smooth expand/collapse animations
- [ ] Mobile responsive
- [ ] Loading states

### Phase 5: Deploy (30 min)
- [ ] Push to GitHub
- [ ] Connect Vercel
- [ ] Set env vars
- [ ] Verify production

---

## Future (Only If Actually Needed)

| Feature | Add When |
|---------|----------|
| Book suggestions per slot | When you want curation |
| Export to JSON | When you want backup |
| Reading history timeline | When you care about velocity |
| Obsidian sync | When you miss it |

**Don't build these now.** Add only when you feel the pain.

---

## Success Criteria

1. **Page load < 500ms** (no D3, no complex queries)
2. **Log a book in < 5 seconds** (click slot → optional title → done)
3. **See all progress at a glance** (collapsible list, not tiny dots)
4. **Works on mobile** (slots are tap-friendly)
5. **Zero decision fatigue** (no "what should I read next" — just random)

---

## The Mantra

**Track reading. See progress. That's it.**

No algorithms. No recommendations. No synthesis prompts. No queues.

You decide what to read. The app just remembers what you've done.
