# Polymath-Web Init Considerations

> **Purpose**: Key decisions and context for anyone starting work on this project
> **Last Updated**: 2025-01-06

---

## Project Philosophy

### Core Insight
Traditional learning is siloed by discipline. Innovation happens at intersections. This app guides users through **systematic cross-domain reading** to maximize bisociation (connecting distant ideas).

### Design Principles

1. **One Book at a Time** - Focus over breadth. No "currently reading 5 books" chaos.

2. **Binary Completion** - Read or not read. No "50% through" tracking that causes guilt.

3. **Visual Progress** - See the whole knowledge landscape at a glance.

4. **Guided Journey** - Don't just browse; follow strategic sequences.

5. **Cross-Domain Connections** - The magic happens when Physics meets Poetry.

---

## Technical Decisions Made

### Why Next.js App Router?
- Server Components for data fetching without client-side state
- API routes for mutations
- Easy Vercel deployment
- Future: Server Actions for even simpler forms

### Why Supabase?
- Free tier sufficient for single user
- PostgreSQL with good RLS
- Real-time capabilities (unused but available)
- Simple JavaScript client

### Why D3.js for Visualization?
- Full control over layout algorithms
- Good for custom interactive visualizations
- Familiar to many developers
- **However**: Current radial layout isn't great; may reconsider

### Why No Authentication?
- Single-user personal tool
- Auth adds complexity without value here
- RLS policies allow all access (anon key is fine)

---

## Architecture Constraints

### Server vs Client Components
- **Default to Server Components** - They fetch data, no hydration issues
- **Client Components only for**:
  - DOM manipulation (D3, clipboard)
  - Event handlers (clicks, keyboard)
  - Browser APIs
  - React state/effects

### Hydration Gotchas
- No inline `onClick` in Server Components
- No `useState`/`useEffect` in Server Components
- Must mark with `'use client'` if needed

### Supabase Schema
- All tables in `polymath` schema
- RLS enabled but permissive
- Foreign keys enforce integrity
- No triggers/functions (keep simple)

---

## Domain Model Constraints

### 180 Domains in 15 Branches
- Fixed taxonomy (not user-editable)
- Each domain belongs to exactly one branch
- Branch distances are pre-calculated (0-4 scale)

### Status Model
```
unread → reading → read
```
- Only one book can be "reading" at a time
- "read" means completed (not perfect understanding)
- No partial progress tracking by design

### Queue Model
- Ordered list of books to read
- Each item has domain + book info
- Starting from queue moves book to "reading"

---

## Open Design Questions

### 1. Visualization
**Problem**: 180 dots in radial layout is unreadable
**Options**:
- Collapsible tree (15 branches → 12 domains each)
- Branch cards with progress bars
- Sunburst chart with zoom
- Force-directed graph
- Simple grid/table

**Consider**: Mobile usability, cognitive load, aesthetic appeal

### 2. Recommendation Algorithm
**Problem**: Users don't know what to read next
**Options**:
- Full TraversalEngine (hub completion → problem-driven → bisociation phases)
- Simplified: suggest max-distance domain from current strengths
- Manual only (current state)

**Consider**: Complexity vs value, user agency, habit formation

### 3. Data Persistence
**Current**: All data in Supabase, no local storage
**Options**:
- Keep current (requires internet)
- Add localStorage cache
- Service worker for offline

**Consider**: Is offline use needed for a reading tracker?

---

## Performance Considerations

### Current State
- All 180 domains loaded on home page
- No pagination or virtualization
- D3 renders full tree client-side
- `revalidate = 0` (no caching)

### Future Considerations
- Consider caching if traffic grows
- Consider virtualization if tree gets heavier
- Consider incremental static regeneration

---

## Testing Strategy (Not Yet Implemented)

### Recommended Approach
```
Unit tests: lib/bisociation.ts, lib/distance.ts
Integration tests: API routes
E2E tests: Critical user journeys
```

### Tools to Consider
- Vitest for unit/integration
- Playwright for E2E
- Testing Library for component tests

---

## Common Gotchas

1. **"Cannot read properties of null"** - Usually a missing domain in DB
2. **Hydration mismatch** - Client component needed for browser APIs
3. **Supabase 404** - Check schema name (must be `polymath.tablename`)
4. **Vercel build fails** - Often TypeScript errors, run `npm run build` locally first

---

## Recommended Reading Order

1. `src/types/index.ts` - Understand the data model
2. `src/lib/supabase.ts` - See all DB operations
3. `src/app/page.tsx` - Main page structure
4. `src/lib/bisociation.ts` - Core algorithm
5. `src/components/knowledge-tree.tsx` - Current visualization
