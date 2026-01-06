# Polymath-Web Project Status

> **Last Updated**: 2025-01-06
> **Version**: 0.1.0 (MVP)
> **Deployment**: https://polymath-web.vercel.app

---

## Current State: MVP Functional

The application is deployed and operational with core functionality working. Recent fix resolved a hydration error on domain detail pages.

### What's Working
- Knowledge Tree visualization (radial D3 layout)
- Domain detail pages with book entry
- Reading status tracking (unread/reading/read)
- Reading queue management
- Bisociation/connections page
- Reference page with all 180 domains
- Branch distance matrix
- Command palette search (Cmd+K)

### What's Not Working / Missing
- "Suggested Next Domain" feature (removed in redesign)
- Tree visualization is cramped (user feedback)
- No reading history/timeline view
- No blind spot detection

### Recent Changes (2025-01-06)
- Fixed domain page 500 error (CopyButton client component extraction)
- Created ARCHITECTURE.md document
- Verified Vercel deployment working

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| UI | React 19, Tailwind CSS, shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Visualization | D3.js |
| Deployment | Vercel |
| State | Server Components + API routes |

---

## Data Model Overview

- **180 domains** across **15 branches**
- Binary completion: `unread | reading | read`
- One book at a time constraint
- Branch distance matrix (0-4 scale)
- 7 hub domains for strategic learning

---

## Known Issues

1. **Tree visualization cramped** - 180 dots in radial layout hard to read
2. **No recommendations** - TraversalEngine was removed
3. **No session persistence** - Each visit starts fresh

---

## Next Priority Actions

1. Decide on visualization redesign approach
2. Consider restoring "Suggested Next" feature
3. Add reading history/timeline view

---

## File Structure

```
polymath-web/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/           # Business logic (supabase, bisociation, distance)
│   └── types/         # TypeScript definitions
├── supabase/
│   └── migrations/    # Database schema
├── docs/              # Documentation
└── public/            # Static assets
```
