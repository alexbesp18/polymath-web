# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymath Tracker — A simple reading progress tracker for systematic learning across 180 academic domains with 6 depth slots each.

**What it is:**
- A checklist with structure
- A progress visualization
- A "Pick Random" button for mild guidance

**What it is NOT:**
- A recommendation engine
- A habit tracker
- A synthesis tool

## Build Commands

```bash
cd polymath-web
npm install
npm run dev                    # http://localhost:3000
npm run build && npm start     # Production
npm run lint                   # ESLint
```

## Architecture

```
polymath-web/src/
├── app/
│   ├── page.tsx               # Single page tracker (client component)
│   ├── layout.tsx             # Minimal shell
│   └── globals.css            # Tailwind styles
├── components/
│   ├── progress-header.tsx    # Top bar: progress + Pick Random
│   ├── branch-list.tsx        # Collapsible branch accordion
│   ├── domain-card.tsx        # Domain with 6 slot buttons
│   ├── slot-button.tsx        # Individual slot (empty/filled)
│   ├── log-modal.tsx          # Mark slot complete
│   ├── slot-popover.tsx       # View/remove completed slot
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── supabase.ts            # 3 operations: get, mark, remove
│   ├── domains.ts             # Static domain data loader
│   ├── constants.ts           # TOTAL_SLOTS, SLOT_CODES
│   └── utils.ts               # cn() helper
├── data/
│   └── domains.json           # 180 domains, 15 branches (static)
└── types/
    └── index.ts               # SlotProgress, SlotCode types
```

## Data Model

### Static Data (Hardcoded JSON)
- 15 branches, 180 domains
- 6 slots per domain: FND, ORT, HRS, FRN, HST, BRG
- 7 hub domains visually marked

### Dynamic Data (Single Supabase Table)
```sql
-- polymath.slot_progress
domain_id    TEXT NOT NULL,    -- "01.02"
slot         TEXT NOT NULL,    -- "FND", "ORT", etc.
book_title   TEXT,             -- optional
book_author  TEXT,             -- optional
completed_at TIMESTAMPTZ,
PRIMARY KEY (domain_id, slot)
```

## Key Concepts

- **180 Domains**: Organized into 15 branches
- **6 Slots per Domain**: FND (Foundation), ORT (Orthodoxy), HRS (Heresy), FRN (Frontier), HST (History), BRG (Bridge)
- **1080 Total Slots**: 180 × 6
- **7 Hub Domains**: Thermodynamics, Evolutionary Biology, Probability, Combinatorics, Information Theory, Game Theory, Systems Engineering

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Archived Code

The `archive/` folder contains the previous complex system with:
- Python CLI (`pm/`)
- Traversal/bisociation logic
- Distance calculations
- Multiple pages (distance, connections, pair)

Tagged as `v0-complex` in git.
