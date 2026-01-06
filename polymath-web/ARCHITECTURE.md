# Polymath-Web Architecture

> **Status**: Draft for review
> **Last Updated**: 2025-01-06

---

## 1. Vision & Core Principles

### What is Polymath?
A **visual knowledge journey tracker** for systematic polymathic learning across 180 academic/practical domains organized in 15 branches.

### Core Principles

| Principle | Description | Current State |
|-----------|-------------|---------------|
| **One Book at a Time** | Focused reading, not scattered | ✅ Implemented |
| **Binary Completion** | Read / Not Read (no partial tracking) | ✅ Implemented |
| **Visual Progress** | See the whole knowledge tree at a glance | ⚠️ Needs work |
| **Guided Journey** | System suggests what to read next | ❌ Removed |
| **Cross-Domain Connections** | Bisociation for innovation | ✅ Implemented |

### Open Questions
- [ ] **Should we restore recommendations?** The old TraversalEngine had: hub-completion → problem-driven → bisociation phases
- [ ] **What should the tree visualization look like?** Current radial is too cramped

---

## 2. User Journeys

### Journey A: First-Time User
```
1. Land on home page
2. See Knowledge Tree (180 domains across 15 branches)
3. Click a domain that interests them
4. See domain detail + book recommendation prompt
5. Enter a book they want to read
6. Click "Start Reading"
7. Home shows "Currently Reading: [Book]"
```

### Journey B: Active Reader
```
1. Open app
2. See current book + progress
3. When finished, click "Finished" ✓
4. Domain marked as "read"
5. [MISSING] System suggests next domain based on:
   - Distance from strengths (bisociation)
   - Hub completion progress
   - User's expert domains
6. User picks from queue or suggestion
```

### Journey C: Connection Seeker
```
1. Navigate to Connections page
2. Generate bisociation pair (strength + distant domain)
3. See synthesis prompts
4. Save any insights
```

---

## 3. Information Architecture

### Current Pages

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Knowledge Tree + Current Book + Queue | ✅ |
| `/domains/[id]` | Domain detail + Add book | ⚠️ DB error on Vercel |
| `/connections` | Bisociation pairs + Saved insights | ✅ |
| `/reference` | Browse all 180 domains by branch | ✅ |
| `/distance` | Branch distance matrix (15x15) | ✅ |

### Missing/Removed Pages

| Route | Purpose | Status |
|-------|---------|--------|
| `/next` | **Suggested next domain** | ❌ Removed |
| `/gaps` | Identify blind spots | ❌ Removed |
| `/history` | Reading log timeline | ❌ Removed |

### Proposed Navigation
```
[Tree] [Connections] [Reference]    [⌘K Search]

Tree = Home (Current Book + Visualization + Queue)
Connections = Bisociation + Insights
Reference = All domains + Distance matrix
```

---

## 4. Data Model

### Tables (Supabase - polymath schema)

```
┌─────────────────┐     ┌─────────────────┐
│    branches     │     │     domains     │
├─────────────────┤     ├─────────────────┤
│ branch_id (PK)  │◄────│ domain_id (PK)  │
│ name            │     │ name            │
│                 │     │ branch_id (FK)  │
│                 │     │ description     │
│                 │     │ is_hub          │
│                 │     │ is_expert       │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │ domain_progress │
                        ├─────────────────┤
                        │ domain_id (PK)  │
                        │ status          │ ← 'unread' | 'reading' | 'read'
                        │ book_title      │
                        │ book_author     │
                        │ completed_at    │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│ reading_queue   │     │    insights     │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ domain_id (FK)  │     │ domain_a        │
│ book_title      │     │ domain_b        │
│ book_author     │     │ insight_type    │
│ position        │     │ content         │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│branch_distances │     │     config      │
├─────────────────┤     ├─────────────────┤
│ branch_a        │     │ id = 1          │
│ branch_b        │     │ current_phase   │
│ distance (0-4)  │     │ expert_domains  │
└─────────────────┘     └─────────────────┘
```

### Domain Status Flow
```
unread ──[Start Reading]──► reading ──[Finished]──► read
                               │
                               └──[Abandon]──► unread
```

### Removed Tables
- `books` - Was: catalog of all books read
- `daily_logs` - Was: session-by-session reading log

---

## 5. Component Architecture

### Current Components

```
src/components/
├── knowledge-tree.tsx    # D3 radial tree (NEEDS REDESIGN)
├── current-book.tsx      # Current reading card
├── reading-queue.tsx     # Queue list
├── domain-actions.tsx    # Add book form
├── save-insight-button.tsx
├── command-palette.tsx   # ⌘K search
└── layout/
    └── Header.tsx        # Navigation
```

### Knowledge Tree Component (needs redesign)

**Current Implementation**:
- Radial/circular layout
- All 180 domains as dots
- Color: gray/blue/green for status
- Too cramped, hard to read

**Alternative Designs to Consider**:

1. **Sunburst Chart**
   - Branches as inner ring
   - Domains as outer segments
   - Click to zoom

2. **Force-Directed Graph**
   - Clusters by branch
   - Hover to expand
   - Draggable

3. **Tree Map**
   - Rectangular nested boxes
   - Size = importance/progress
   - Branch → Domain hierarchy

4. **Collapsible Tree**
   - Start collapsed (15 branches)
   - Click to expand domains
   - Vertical or horizontal

5. **Simple Grid**
   - 15 columns (branches)
   - Rows = domains
   - Status as colored cells

---

## 6. Recommendation Engine (REMOVED - Should Restore?)

### Previous TraversalEngine Logic

```typescript
// Old phases
type TraversalPhase = 'hub-completion' | 'problem-driven' | 'bisociation';

// Hub Completion Phase
1. Find incomplete hub domains (6 special high-connectivity domains)
2. On Sundays: interleave with max-distance domain
3. Goal: Complete 4 books in each hub

// Problem-Driven Phase
1. User defines active problems
2. Pull domains relevant to problems
3. Balance depth vs breadth

// Bisociation Phase
1. 3 days: Read in strength cluster
2. 3 days: Read at maximum distance
3. 1 day: Synthesis prompt
```

### Simplified Alternative

Instead of complex phases, could do:
```
1. Calculate "next best" based on:
   - Has user read any hubs? → Suggest hub
   - User has strengths? → Suggest max distance (bisociation)
   - Default: Suggest untouched domain in different branch

2. Show as "Suggested Next" card on home page
3. User can ignore and pick from tree/queue
```

---

## 7. Visualization Design (NEEDS DECISION)

### Current: Radial Tree
```
              02
          01     03
        15         04
       14    ●%●    05
        13         06
          12     07
              08
           09  10
             11
```
- **Problem**: 180 dots crammed in rings = unreadable
- **Problem**: No clear hierarchy
- **Problem**: Hard to see which domains are read

### Option A: Collapsible Branch List
```
▼ 01 Physical Sciences (3/12 read)
  ● 01.01 Classical Mechanics ✓
  ○ 01.02 Thermodynamics (Reading...)
  ○ 01.03 Electromagnetism
  ...
▶ 02 Life Sciences (0/12 read)
▶ 03 Formal Sciences (1/12 read)
...
```
- **Pro**: Clear, scannable, works on mobile
- **Con**: Less visual, more like a to-do list

### Option B: Branch Cards Grid
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Physics │ │ Life Sci│ │ Math    │
│ ███░░░░ │ │ ░░░░░░░ │ │ █░░░░░░ │
│ 3/12    │ │ 0/12    │ │ 1/12    │
└─────────┘ └─────────┘ └─────────┘
```
- **Pro**: Clean, shows progress per branch
- **Con**: Loses individual domain visibility

### Option C: Hybrid (Branch Cards → Domain List)
```
Home: 15 branch cards with progress bars
Click branch → Expand to show domains
```

---

## 8. API Routes

### Current
```
/api/domains      GET    → All domains with progress
/api/reading      POST   → Start/finish/abandon/queue actions
/api/insights     GET    → Saved insights
/api/insights     POST   → Save new insight
```

### Missing
```
/api/recommend    GET    → Get suggested next domain (REMOVED)
```

---

## 9. Environment & Deployment

### Local Development
```bash
npm run dev      # Next.js dev server
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Deployment
- **Vercel**: https://polymath-web.vercel.app
- **GitHub**: https://github.com/alexbesp18/polymath-web

### Known Issue
⚠️ **Vercel deployment fails to connect to DB** - likely missing env vars in Vercel dashboard

---

## 10. Open Questions for User

Please review and decide:

### A. Visualization
- [ ] Which tree design do you prefer? (Collapsible list / Branch cards / Hybrid / Other)
- [ ] Should we keep the radial tree at all?

### B. Recommendations
- [ ] Should we restore the "Suggested Next" feature?
- [ ] Full TraversalEngine (phases) or simplified recommendation?

### C. Features
- [ ] Should we restore `/gaps` page (blind spot detection)?
- [ ] Should we restore `/history` page (reading timeline)?
- [ ] Do we need the `/distance` matrix page or fold into reference?

### D. Data Model
- [ ] Should we bring back the `books` table for a reading catalog?
- [ ] Should we bring back `daily_logs` for session tracking?

---

## Next Steps

1. **Fix Vercel DB connection** - Add env vars to Vercel dashboard
2. **Choose visualization approach** - Based on user feedback
3. **Decide on recommendations** - Restore or keep manual
4. **Implement chosen design** - Iterate based on this document
