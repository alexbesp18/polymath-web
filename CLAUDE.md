# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymath Engine — A CLI + Obsidian-based system for systematic polymathic learning across 170 academic/practical domains. Tracks reading progress, identifies cross-domain connections (isomorphisms), manages strategic reading sequences, and produces insights for innovation.

**Status:** Pre-implementation (specifications complete, no code yet)

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

# CLI commands (after implementation)
pm-init --vault-path ~/Obsidian/Polymath-Engine
pm-status
pm-next
pm-pair --week
pm-log -d 02.04 -b "The Extended Phenotype" -s HRS
pm-gaps
```

## Architecture

```
polymath-cli/
├── pm/
│   ├── cli.py              # Click CLI entry point
│   ├── config.py           # Config dataclass + loader (~/.polymath/config.yaml)
│   ├── commands/           # One file per CLI command (init, status, next, pair, log, etc.)
│   └── core/
│       ├── vault.py        # Obsidian vault file operations (frontmatter parsing)
│       ├── domain.py       # Domain/Branch models with DomainStatus enum
│       ├── traversal.py    # TraversalEngine: hub completion → problem-driven → bisociation phases
│       ├── distance.py     # Branch distance matrix (0-4 scale), isomorphism-adjusted distances
│       └── bisociation.py  # Maximum-distance pairing with synthesis prompts
└── data/
    ├── domains.yaml        # 170 domains, 15 branches
    ├── distances.yaml      # Branch distance matrix
    └── hub_books.yaml      # Curated book recommendations
```

## Key Domain Concepts

- **15 Branches**: Physical Sciences (01) → Religion/Theology (15)
- **170 Domains**: Each with 6 function slots (FND→HRS→ORT→FRN→HST→BRG)
- **Hub Domains**: High-connectivity domains to front-load (Evolutionary Biology, Thermodynamics, Information Theory, Game Theory, Network Theory, Systems Theory)
- **Distance Matrix**: Scale 0-4 between branches (0=same, 4=maximum like Physics↔Religion)
- **Isomorphisms**: Same concept appearing in multiple fields under different names

## Traversal Phases

1. **Hub Completion**: Complete 4 books in each hub domain, weekly distant interleave
2. **Problem-Driven**: Pull from domains relevant to active problems
3. **Bisociation**: 3 days strength cluster, 3 days maximum distance, 1 day synthesis

## Slot Progression Logic

```python
if books_read == 0: return "FND"    # Foundation
if books_read == 1: return "HRS"    # Heresy
if books_read == 2: return "ORT"    # Orthodoxy
if books_read == 3: return "FRN"    # Frontier
if books_read == 4: return "HST"    # History
else: return "BRG"                  # Bridge
```

## Status Transitions

```
untouched → surveying (first book started)
surveying → surveyed (FND + HRS complete)
surveyed → deepening (FRN + BRG added)
deepening → specialized (topic layer populated)
```

## Vault File Conventions

All vault files use YAML frontmatter:
- Domains: `XX.YY-Domain-Name.md` with `domain_id`, `status`, `books_read`, `is_hub`, `is_expert`
- Daily logs: `YYYY-MM-DD.md`
- Books: `Author-ShortTitle.md`
- Isomorphisms: `Concept-Name.md` with `domains` array

## User Context

Expert domains (skip foundations): Software Engineering, AI/ML, Distributed Systems, Finance Theory, Corporate Finance
Critical gaps to front-load: Evolutionary Biology, Thermodynamics, Network Theory, Sociology of Organizations

## Spec Files Reference

| File | Purpose |
|------|---------|
| `SPEC-01-SYSTEM-OVERVIEW.md` | Domain taxonomy (170 domains), hub definitions, user profile |
| `SPEC-02-OBSIDIAN-STRUCTURE.md` | Vault structure, all 8 Markdown templates |
| `SPEC-03-CLI-TOOLS.md` | CLI commands, data models, vault operations |
| `SPEC-04-DATA-FILES.md` | Complete 170-domain YAML, book recommendations |
| `SPEC-05-IMPLEMENTATION-GUIDE.md` | Build sequence, pyproject.toml, testing strategy |
| `SPEC-06-ALGORITHMS-DEEP-DIVE.md` | Hub completion, bisociation pairing, blind spot detection algorithms |

## Implementation Order

1. **Week 1**: Package structure, config module, YAML data files, Vault class, pm-init
2. **Week 2**: pm-status (Rich terminal output), pm-next (TraversalEngine), pm-log
3. **Week 3**: pm-pair (bisociation), pm-gaps, pm-distance, pm-connections, pm-synthesize
4. **Week 4**: Unit/integration tests, Obsidian Dataview integration testing

## Dependencies

```toml
click>=8.1.0          # CLI framework
pyyaml>=6.0           # YAML parsing
python-frontmatter    # Markdown + YAML frontmatter
rich>=13.0.0          # Terminal formatting
```

Dev: pytest, pytest-cov, black, ruff, mypy
