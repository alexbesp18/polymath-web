# Polymath Engine

CLI tools for systematic polymathic learning. Track reading across 180 domains, generate cross-domain insights (bisociation), and build systematic expertise.

## Installation

```bash
pip install -e .
```

## Quick Start

```bash
# Initialize vault in Obsidian
pm-init -v ~/Obsidian/Polymath-Engine

# Check status
pm-status

# Get next reading recommendation
pm-next

# Generate bisociation pairing
pm-pair

# Log a reading session
pm-log -d 01.02 -b "Understanding Thermodynamics" --pages 50 --time 60

# Show gaps in coverage
pm-gaps
```

## Commands

### pm-init
Initialize Polymath Engine vault structure.

```bash
pm-init -v ~/Obsidian/Polymath-Engine
```

Creates:
- 180 domain profile files across 15 branches
- Daily logs, books, isomorphisms directories
- Dashboard and system files

### pm-status
Show current progress dashboard.

```bash
pm-status
```

Displays:
- Domain coverage (X/180)
- Branch coverage (X/15)
- Hub domain completion
- Current reading streak

### pm-next
Get next reading recommendation based on traversal engine.

```bash
pm-next
```

Recommends:
- Hub domains during hub-completion phase
- Problem-relevant domains during problem-driven phase
- Weekly distant domain interleave

### pm-pair
Generate bisociation pairing for creative thinking.

```bash
pm-pair
pm-pair --anchor 07.09            # Specific anchor domain
pm-pair --min-distance 4          # Require maximum distance
```

Pairs your strength domain with a maximally distant domain to force unexpected connections.

### pm-log
Log a reading session.

```bash
pm-log -d 01.02 -b "Book Title"
pm-log -d 01.02 -b "Book Title" --pages 50 --time 60 --slot FND
```

Options:
- `-d, --domain` — Domain ID (required)
- `-b, --book` — Book title (required)
- `-s, --slot` — Function slot (FND, HRS, ORT, FRN, HST, BRG)
- `-p, --pages` — Pages read
- `-t, --time` — Reading time in minutes

### pm-gaps
Show gaps and neglected domains.

```bash
pm-gaps
pm-gaps --show-all
```

Shows:
- Untouched branches
- Incomplete hub domains
- Stale domains (>90 days since last read)

### pm-distance
Show conceptual distance between domains or branches.

```bash
pm-distance 01.02 15.04           # Distance between domains
pm-distance -b 01 15              # Distance between branches
pm-distance --from 07.09          # All distances from a domain
pm-distance --matrix              # Full 15x15 branch matrix
```

Distance scale:
- 0 = same branch
- 1 = adjacent (closely related)
- 2 = moderate (some shared concepts)
- 3 = far (few connections)
- 4 = maximum (essentially unrelated)

### pm-connections
Show domain connections and isomorphisms.

```bash
pm-connections 01.02              # Show connections for a domain
pm-connections --isomorphisms     # Show all known isomorphisms
pm-connections 01.02 --adjacent   # Show nearby domains
pm-connections 01.02 --distant    # Show far domains
```

Isomorphisms are concepts that appear across domains under different names (e.g., "entropy" in Thermodynamics and Information Theory).

## Domain Taxonomy

The system organizes knowledge into 15 branches with 180 total domains:

| Branch | Name | Domains |
|--------|------|---------|
| 01 | Physical Sciences | 13 |
| 02 | Life Sciences | 12 |
| 03 | Formal Sciences | 12 |
| 04 | Mind Sciences | 10 |
| 05 | Social Sciences | 10 |
| 06 | Humanities | 13 |
| 07 | Engineering | 15 |
| 08 | Health Medicine | 13 |
| 09 | Business Management | 12 |
| 10 | Education | 10 |
| 11 | Arts Design Communication | 12 |
| 12 | Law Public Admin | 12 |
| 13 | Agriculture Environment | 12 |
| 14 | Trades Applied Tech | 12 |
| 15 | Religion Theology | 12 |

## Hub Domains

Seven hub domains connect to many other fields — front-load these:

- **01.02** Thermodynamics (entropy, energy)
- **02.04** Evolutionary Biology (adaptation, selection)
- **03.04** Probability & Statistics (uncertainty)
- **03.06** Combinatorics & Graph Theory (networks)
- **03.07** Information Theory (entropy, signals)
- **03.09** Game Theory (strategy, equilibrium)
- **07.14** Systems Engineering (feedback, control)

## Function Slots

Each domain has 6 function slots for reading progression:

| Slot | Purpose | Books |
|------|---------|-------|
| FND | Foundation — First comprehensive survey | 1 |
| HRS | Heresy — Contrarian or alternative views | 1 |
| ORT | Orthodoxy — Mainstream textbook | 1 |
| FRN | Frontier — Latest research/advances | 1 |
| HST | History — Historical development | 1 |
| BRG | Bridge — Cross-domain connections | 1+ |

## Traversal Phases

1. **Hub Completion** — Complete 4 books in each hub domain, weekly interleave with distant domain
2. **Problem-Driven** — Read domains relevant to active problems
3. **Bisociation** — Weekly rhythm of strength + distant domains for creative insights

## Development

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=pm
```

## License

MIT
