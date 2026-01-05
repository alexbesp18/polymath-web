# Polymath Engine - Project Plan

## Vision
A personal knowledge management system for systematic polymathic learning across 170 academic/practical domains.

## Current Priority
**Phase: MVP COMPLETE → Polish & Harden**

### P0 - Immediate (This Session)
1. Initialize git repository
2. Fix domain data issues (180 vs 170, unknown entries)
3. Add CLI integration tests
4. Verify pm-log end-to-end workflow

### P1 - Short Term
1. Test with real Obsidian vault
2. Add pm-distance command
3. Add pm-connections command

### P2 - Medium Term
1. Add pm-synthesize command
2. Dashboard.md Dataview integration
3. Problem-driven traversal phase

## Non-Goals (Explicit)
- Web UI (CLI only for MVP)
- Multi-user support
- Cloud sync
- Mobile app
- AI integrations (future phase)

## Success Criteria
- [ ] Can run full workflow: init → next → log → status
- [ ] All 35+ tests passing
- [ ] Git repo with clean history
- [ ] README with usage instructions

## Tech Stack
- Python 3.10+
- Click CLI
- PyYAML + python-frontmatter
- Rich terminal formatting
- pytest for testing
