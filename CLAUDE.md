# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymath Engine — A CLI + Obsidian-based system for systematic polymathic learning across 180 academic/practical domains. Tracks reading progress, identifies cross-domain connections (isomorphisms), manages strategic reading sequences, and produces insights for innovation.

## Build Commands

```bash
# Setup
python -m venv venv && source venv/bin/activate
pip install -e ".[dev]"

# Run tests
pytest --cov=pm tests/
pytest tests/test_distance.py -v          # Single file
pytest -k "test_hub_completion"            # By pattern

# Linting
ruff check pm/
black pm/ --check
mypy pm/

# CLI usage (after pip install -e .)
pm status                                  # Show progress dashboard
pm next                                    # Get next reading recommendation
pm next --distant                          # Force distant domain recommendation
pm pair                                    # Generate bisociation pairing
pm pair --min-distance 4                   # Max distance pairing
pm log --domain 01.02 --book "Title"       # Log reading session
pm gaps                                    # Show untouched branches and incomplete hubs
pm distance 01 15                          # Show distance between branches
pm connections 01.02                       # Show domain connections
```

## Architecture

```
pm/
├── cli.py              # Click group with all subcommands
├── config.py           # Config dataclass + YAML loader (~/.polymath/config.yaml)
├── commands/           # One file per CLI command
│   ├── init.py         # Creates vault structure + 180 domain files
│   ├── status.py       # Rich dashboard with progress bars
│   ├── next_cmd.py     # Uses TraversalEngine for recommendations
│   ├── pair.py         # Bisociation pairing generator
│   ├── log.py          # Records reading sessions, updates domain progress
│   ├── gaps.py         # Shows untouched branches and incomplete hubs
│   ├── distance.py     # Branch distance lookup
│   └── connections.py  # Domain relationship viewer
├── core/
│   ├── vault.py        # Main interface: load/save domains, books, daily logs
│   ├── domain.py       # Domain/Branch models with DomainStatus enum
│   ├── traversal.py    # TraversalEngine: hub → problem-driven → bisociation phases
│   ├── bisociation.py  # Maximum-distance pairing with synthesis prompts
│   ├── book.py         # Book note model
│   ├── daily_log.py    # Daily reading log model
│   ├── errors.py       # Custom exceptions
│   └── supabase_client.py  # Optional cloud persistence
└── data/
    ├── domains.py      # 180 domains, 15 branches (Python dicts)
    ├── distances.py    # Branch distance matrix (0-4 scale)
    ├── hub_books.py    # Curated book recommendations per hub/slot
    └── templates.py    # Markdown templates for vault files
```

## Key Domain Concepts

- **15 Branches**: Physical Sciences (01) → Religion/Theology (15)
- **180 Domains**: Each with 6 function slots (FND→HRS→ORT→FRN→HST→BRG)
- **7 Hub Domains**: High-connectivity domains to front-load (Thermodynamics, Evolutionary Biology, Probability & Statistics, Combinatorics, Information Theory, Game Theory, Systems Engineering)
- **Distance Matrix**: Scale 0-4 between branches (0=same, 4=maximum like Physics↔Religion)

## Traversal Engine Logic

Three phases in `pm/core/traversal.py`:
1. **Hub Completion**: Complete 4 books in each hub, weekly distant interleave (Sunday)
2. **Problem-Driven**: Pull from domains relevant to active problems (TODO)
3. **Bisociation**: 3 days strength → 3 days distant → 1 day synthesis

Slot progression based on `books_read`: FND(0) → HRS(1) → ORT(2) → FRN(3) → HST(4) → BRG(5+)

## Vault Class (Core Interface)

`Vault` in `pm/core/vault.py` is the main data access layer:
- Dual-mode: Supabase (if configured via `.env`) or file-based fallback
- All vault files use YAML frontmatter parsed with `python-frontmatter`
- Domain files: `02-Domains/{branch}/{domain_id}-{name}.md`
- Daily logs: `01-Daily-Logs/YYYY-MM-DD.md`

## Testing

Tests use `pytest` fixtures in `tests/conftest.py`. Key pattern:
- `disable_supabase` fixture auto-sets `PM_TESTING=1` to force file-based mode
- `temp_vault` creates temporary vault directory
- `initialized_vault` runs `pm init` on temp vault for integration tests

## Configuration

Config lives at `~/.polymath/config.yaml`:
```yaml
vault:
  path: ~/Obsidian/Polymath-Engine
user:
  name: Alex
  expert_domains: ["07.08", "07.09"]  # Skip foundations
traversal:
  current_phase: hub_completion
  hub_target_books: 4
  bisociation_min_distance: 3
```

## Environment Variables

- `PM_TESTING=1`: Disables Supabase, forces file-based mode
- Supabase (optional): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
