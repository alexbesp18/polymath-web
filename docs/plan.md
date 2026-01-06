# Polymath Engine - Project Plan

## Vision
A personal knowledge management system for systematic polymathic learning across 180 academic/practical domains.

## Current Priority
**Phase: MVP + WEB COMPLETE → P2 Features**

### Completed (P0/P1)
- ✅ 8 CLI commands (init, status, next, pair, log, gaps, distance, connections)
- ✅ 51 tests passing
- ✅ Supabase backend (15 branches, 180 domains, distance matrix)
- ✅ Next.js web app (191 pages, deployed to Vercel)
- ✅ Real-time sync between CLI and web

### P2 - Medium Term
1. Problem-driven traversal phase (TODO in traversal.py)
2. pm-synthesize command (weekly synthesis generation)
3. Expanded isomorphism database

### P3 - Long Term
1. AI integrations (LLM-powered synthesis)
2. Mobile-responsive improvements
3. Multi-vault support

## Completed Goals
- ✅ Web UI at https://polymath-web.vercel.app
- ✅ Cloud sync via Supabase
- ✅ Full workflow: init → next → log → status (CLI + web)
- ✅ Git repo with clean history
- ✅ README with usage instructions

## Non-Goals (Explicit)
- Multi-user support (single-user system)
- Mobile native app (web is mobile-responsive)
- Offline-first (Supabase is primary)

## Tech Stack
- **CLI**: Python 3.10+, Click, Rich, python-frontmatter
- **Backend**: Supabase (PostgreSQL, custom `polymath` schema)
- **Web**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Hosting**: Vercel
