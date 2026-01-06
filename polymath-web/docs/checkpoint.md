# Polymath-Web Session Checkpoint

> **Last Updated**: 2025-01-06
> **Purpose**: Resume context for new Claude sessions

---

## Current State Summary

Polymath-Web is an **MVP web application** for tracking polymathic learning across 180 knowledge domains. The app is deployed to Vercel and functional.

---

## Recent Session Work (2025-01-06)

### Issues Resolved
1. **Domain page 500 error** - Fixed hydration error by extracting inline `onClick` handler to `CopyButton` client component

### Files Modified
- `src/app/domains/[id]/page.tsx` - Removed inline onClick, uses CopyButton
- `src/components/copy-button.tsx` - NEW: Client component for clipboard operations

### Files Created
- `ARCHITECTURE.md` - High-level architecture overview
- `project_status.md` - Current project status
- `docs/plan.md` - Development plan
- `docs/architecture.md` - Detailed architecture
- `docs/checkpoint.md` - This file
- `docs/init_considerations.md` - New session guidance
- `docs/future_roadmap.md` - Future features

---

## Known Issues (Unresolved)

1. **Tree visualization cramped** - User feedback: "too squished"
   - Current: D3 radial layout with 180 dots
   - Location: `src/components/knowledge-tree.tsx`
   - Status: Awaiting user decision on alternative design

2. **No recommendation engine** - "Suggested domain" feature was removed
   - Previously: TraversalEngine in CLI version
   - Status: Awaiting decision on whether to restore

3. **No reading history** - No timeline view of completed books
   - Status: Low priority, not started

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | All database operations |
| `src/types/index.ts` | TypeScript type definitions |
| `src/app/page.tsx` | Home page (tree + current book + queue) |
| `src/components/knowledge-tree.tsx` | D3 visualization (needs redesign) |
| `src/lib/bisociation.ts` | Cross-domain pairing algorithm |
| `supabase/migrations/*.sql` | Database schema |

---

## Database Details

- **Provider**: Supabase
- **Schema**: `polymath`
- **Tables**: domains, branches, domain_progress, reading_queue, branch_distances, insights
- **RLS**: Enabled with permissive policies (`USING (true)`)
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Deployment

- **Platform**: Vercel
- **URL**: https://polymath-web.vercel.app
- **Auto-deploy**: Yes, from main branch
- **Status**: Working (verified 2025-01-06)

---

## User Decisions Pending

1. **Visualization approach** - Collapsible list? Branch cards? Hybrid?
2. **Recommendation feature** - Restore TraversalEngine? Simplified suggestions?
3. **History page** - Worth implementing?

---

## Commands to Run

```bash
# Local development
cd /Users/alexbespalov/Desktop/Projects/book_reader/polymath-web
npm run dev

# Build check
npm run build

# Deploy (auto via Vercel on push)
git push origin main
```

---

## Context for New Sessions

When starting a new session:

1. Read `docs/plan.md` for current goals
2. Check `project_status.md` for latest state
3. Review this checkpoint for recent work
4. Check git status for uncommitted changes

The user's main pain points are:
- Tree visualization is hard to read
- Missing "what should I read next" guidance
- Wants systematic polymathic learning, not random browsing
