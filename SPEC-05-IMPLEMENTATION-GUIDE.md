# Polymath Engine: System Specification
## Part 5: Implementation Guide

---

## 1. BUILD SEQUENCE

### Phase 1: Foundation (Week 1)

```
Day 1-2: Project Setup
├── Create Python package structure
├── Set up pyproject.toml with dependencies
├── Create config module
└── Write Config dataclass and loader

Day 3-4: Data Layer
├── Create domains.yaml from SPEC-04
├── Create distances.yaml
├── Create hub_books.yaml
├── Write Domain/Branch dataclasses

Day 5-7: Vault Operations
├── Implement Vault class
├── Write frontmatter parsing
├── Implement load_all_domains()
├── Implement load_recent_logs()
└── Test with mock vault
```

### Phase 2: Core Commands (Week 2)

```
Day 1-2: pm-init
├── Directory creation
├── Template generation
├── Domain file generation
└── Config file creation

Day 3-4: pm-status
├── Domain statistics
├── Branch coverage
├── Streak calculation
└── Rich terminal output

Day 5-7: pm-next
├── Traversal engine
├── Hub completion logic
├── Recent read tracking
└── Recommendation output
```

### Phase 3: Advanced Commands (Week 3)

```
Day 1-2: pm-pair
├── Distance calculation
├── Bisociation pairing
├── Synthesis prompts
└── Week planning

Day 3-4: pm-log
├── Daily log creation
├── Domain update
├── Interactive mode
└── Validation

Day 5-7: Remaining commands
├── pm-gaps
├── pm-distance
├── pm-connections
└── pm-synthesize
```

### Phase 4: Polish (Week 4)

```
Day 1-3: Testing
├── Unit tests for algorithms
├── Integration tests for CLI
├── Edge cases
└── Mock vault fixtures

Day 4-5: Documentation
├── README.md
├── Usage examples
├── Installation guide
└── Workflow tutorials

Day 6-7: Obsidian Integration
├── Dataview queries
├── Template refinement
├── Dashboard testing
└── Cross-linking validation
```

---

## 2. DEPENDENCY SPECIFICATION

### pyproject.toml

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "polymath-cli"
version = "0.1.0"
description = "CLI tools for systematic polymathic learning"
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.10"
authors = [
    {name = "Alex", email = "alex@example.com"}
]
keywords = ["learning", "knowledge-management", "obsidian", "polymath"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Environment :: Console",
    "Intended Audience :: Education",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Education",
]

dependencies = [
    "click>=8.1.0",
    "pyyaml>=6.0",
    "python-frontmatter>=1.0.0",
    "rich>=13.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.0.0",
]

[project.scripts]
pm = "pm.cli:cli"
pm-init = "pm.commands.init:init"
pm-status = "pm.commands.status:status"
pm-next = "pm.commands.next_cmd:next"
pm-pair = "pm.commands.pair:pair"
pm-log = "pm.commands.log:log"

[tool.setuptools.packages.find]
where = ["."]
include = ["pm*"]

[tool.black]
line-length = 100
target-version = ['py310', 'py311', 'py312']

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
```

---

## 3. TESTING STRATEGY

### Unit Tests

```python
# tests/test_distance.py

import pytest
from pm.core.distance import (
    get_branch_distance,
    compute_domain_distance,
    find_distant_domains,
)

class TestBranchDistance:
    def test_same_branch_zero(self):
        assert get_branch_distance("01", "01") == 0
        assert get_branch_distance("07", "07") == 0
    
    def test_adjacent_branches(self):
        # Physical ↔ Life = 1
        assert get_branch_distance("01", "02") == 1
        # Physical ↔ Engineering = 1
        assert get_branch_distance("01", "07") == 1
    
    def test_maximum_distance(self):
        # Physical ↔ Religion = 4
        assert get_branch_distance("01", "15") == 4
        # Trades ↔ Religion = 4
        assert get_branch_distance("14", "15") == 4
    
    def test_symmetry(self):
        assert get_branch_distance("01", "05") == get_branch_distance("05", "01")
        assert get_branch_distance("03", "15") == get_branch_distance("15", "03")


class TestDomainDistance:
    def test_same_branch_domains(self):
        # Both in Physical Sciences
        dist = compute_domain_distance("01.01", "01.02")
        assert dist == 0
    
    def test_cross_branch_domains(self):
        # Physical to Religion
        dist = compute_domain_distance("01.01", "15.01")
        assert dist == 4
    
    def test_isomorphism_reduction(self):
        base = compute_domain_distance("01.02", "03.07")  # Thermo ↔ Info Theory
        with_iso = compute_domain_distance("01.02", "03.07", shared_isomorphisms=["entropy"])
        assert with_iso < base


# tests/test_traversal.py

import pytest
from datetime import date, timedelta
from pm.core.traversal import TraversalEngine
from pm.core.domain import Domain, DomainStatus

@pytest.fixture
def mock_domains():
    """Create mock domain set for testing."""
    domains = []
    
    # Hub domain (incomplete)
    domains.append(Domain(
        domain_id="02.04",
        domain_name="Evolutionary Biology",
        branch_id="02",
        branch_name="Life Sciences",
        is_hub=True,
        books_read=2,
    ))
    
    # Expert domain
    domains.append(Domain(
        domain_id="07.09",
        domain_name="AI Machine Learning",
        branch_id="07",
        branch_name="Engineering",
        is_expert=True,
        status=DomainStatus.EXPERT,
    ))
    
    # Untouched distant domain
    domains.append(Domain(
        domain_id="15.01",
        domain_name="Comparative Religion",
        branch_id="15",
        branch_name="Religion Theology",
        status=DomainStatus.UNTOUCHED,
    ))
    
    return domains

class TestTraversalEngine:
    def test_hub_completion_prioritizes_incomplete_hubs(self, mock_domains):
        from pm.core.traversal import TraversalConfig
        from pm.config import UserConfig
        
        config = TraversalConfig(
            current_phase="hub_completion",
            hub_target_books=4,
        )
        user_config = UserConfig(
            name="Test",
            expert_domains=["07.09"],
            moderate_domains=[],
        )
        
        engine = TraversalEngine(
            domains=mock_domains,
            branches=[],
            config=config,
            user_config=user_config,
        )
        
        rec = engine.recommend_next()
        assert rec.domain.is_hub
        assert rec.domain.books_read < config.hub_target_books
    
    def test_recent_domains_excluded(self, mock_domains):
        # Test that recently-read domains are not recommended
        pass
    
    def test_distant_interleave_triggered(self, mock_domains):
        # Test weekly distant domain is triggered
        pass


# tests/test_bisociation.py

import pytest
from pm.core.bisociation import generate_bisociation_pair, BisociationPair
from pm.core.domain import Domain, DomainStatus

class TestBisociation:
    def test_minimum_distance_respected(self):
        strength = [Domain(
            domain_id="07.09",
            domain_name="AI ML",
            branch_id="07",
            branch_name="Engineering",
        )]
        
        all_domains = strength + [
            Domain(domain_id="15.01", domain_name="Comp Religion", 
                   branch_id="15", branch_name="Religion"),
            Domain(domain_id="07.08", domain_name="Software Eng",
                   branch_id="07", branch_name="Engineering"),
        ]
        
        pair = generate_bisociation_pair(
            strength,
            all_domains,
            min_distance=3
        )
        
        assert pair.distance >= 3
    
    def test_recent_pairs_avoided(self):
        # Test that recent pairs are excluded
        pass
    
    def test_synthesis_prompt_generated(self):
        # Test prompt contains both domain names
        pass
```

### Integration Tests

```python
# tests/test_cli_integration.py

import pytest
from click.testing import CliRunner
from pathlib import Path
import tempfile
import shutil

from pm.cli import cli

@pytest.fixture
def temp_vault():
    """Create temporary vault for testing."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)

@pytest.fixture
def runner():
    return CliRunner()

class TestCLIIntegration:
    def test_init_creates_structure(self, runner, temp_vault):
        result = runner.invoke(cli, ['init', '--vault-path', str(temp_vault)])
        
        assert result.exit_code == 0
        assert (temp_vault / "00-System").exists()
        assert (temp_vault / "02-Domains").exists()
        assert (temp_vault / "03-Books").exists()
    
    def test_init_creates_all_domains(self, runner, temp_vault):
        runner.invoke(cli, ['init', '--vault-path', str(temp_vault)])
        
        domain_files = list((temp_vault / "02-Domains").rglob("*.md"))
        # 170 domains + 15 branch overviews
        assert len([f for f in domain_files if not f.name.startswith("_")]) == 170
    
    def test_status_runs_on_fresh_vault(self, runner, temp_vault):
        runner.invoke(cli, ['init', '--vault-path', str(temp_vault)])
        result = runner.invoke(cli, ['--vault', str(temp_vault), 'status'])
        
        assert result.exit_code == 0
        assert "Branch Coverage" in result.output
    
    def test_next_returns_recommendation(self, runner, temp_vault):
        runner.invoke(cli, ['init', '--vault-path', str(temp_vault)])
        result = runner.invoke(cli, ['--vault', str(temp_vault), 'next'])
        
        assert result.exit_code == 0
        assert "Next Read" in result.output
    
    def test_pair_generates_bisociation(self, runner, temp_vault):
        runner.invoke(cli, ['init', '--vault-path', str(temp_vault)])
        result = runner.invoke(cli, ['--vault', str(temp_vault), 'pair'])
        
        assert result.exit_code == 0
        assert "Bisociation Pair" in result.output
        assert "Distance:" in result.output
```

### Fixture: Mock Vault

```python
# tests/conftest.py

import pytest
from pathlib import Path
import tempfile
import shutil
import yaml

@pytest.fixture
def mock_vault_path():
    """Create a minimal mock vault for testing."""
    temp_dir = tempfile.mkdtemp()
    vault = Path(temp_dir)
    
    # Create structure
    (vault / "00-System").mkdir()
    (vault / "01-Daily-Logs").mkdir()
    (vault / "02-Domains" / "07-Engineering").mkdir(parents=True)
    (vault / "03-Books").mkdir()
    
    # Create minimal domain file
    domain_content = """---
domain_id: "07.09"
domain_name: "AI Machine Learning"
branch_id: "07"
branch_name: "Engineering"
status: "expert"
is_hub: false
is_expert: true
books_read: 10
last_read: "2024-01-01"
---

# AI Machine Learning
"""
    (vault / "02-Domains" / "07-Engineering" / "07.09-AI-Machine-Learning.md").write_text(domain_content)
    
    yield vault
    shutil.rmtree(temp_dir)

@pytest.fixture
def mock_config(mock_vault_path):
    """Create mock config pointing to mock vault."""
    from pm.config import Config, UserConfig, TraversalConfig
    
    return Config(
        vault_path=mock_vault_path,
        user=UserConfig(
            name="Test User",
            expert_domains=["07.09"],
            moderate_domains=["03.09"],
        ),
        traversal=TraversalConfig(
            current_phase="hub_completion",
            hub_target_books=4,
        ),
    )
```

---

## 4. OBSIDIAN SETUP

### Required Plugins

1. **Dataview** (essential)
   - Enables dynamic queries in dashboard
   - Install from Community Plugins

2. **Templater** (recommended)
   - Advanced templating
   - Auto-insert date, computed values

3. **Calendar** (optional)
   - Visual reading calendar
   - Links to daily logs

### Dataview Configuration

```yaml
# .obsidian/plugins/dataview/data.json
{
  "renderNullAs": "—",
  "taskCompletionTracking": false,
  "taskCompletionText": "completion",
  "recursiveSubTaskCompletion": false,
  "warnOnEmptyResult": false,
  "refreshEnabled": true,
  "refreshInterval": 2500,
  "defaultDateFormat": "MMMM dd, yyyy",
  "defaultDateTimeFormat": "h:mm a - MMMM dd, yyyy",
  "maxRecursiveRenderDepth": 4,
  "tableIdColumnName": "File",
  "tableGroupColumnName": "Group"
}
```

### Example Dataview Queries

**Dashboard: Domain Status**
```dataview
TABLE 
  status as "Status",
  books_read as "Books",
  choice(is_hub, "⭐", "") as "Hub"
FROM "02-Domains"
WHERE file.name != "_Branch-Overview"
SORT domain_id ASC
```

**Dashboard: Recent Reading**
```dataview
TABLE WITHOUT ID
  file.link as "Date",
  domain as "Domain",
  book as "Book",
  function_slot as "Slot"
FROM "01-Daily-Logs"
SORT file.name DESC
LIMIT 10
```

**Domain Profile: Reading History**
```dataview
LIST
FROM "01-Daily-Logs"
WHERE domain_id = this.domain_id
SORT file.name DESC
```

**Isomorphism: Connected Domains**
```dataview
LIST
FROM "02-Domains"
WHERE contains(this.domains, file.link)
```

---

## 5. WORKFLOW EXAMPLES

### Daily Reading Session

```bash
# 1. Get today's recommendation
$ pm-next
📚 Next Read
───────────────────────────────────
Evolutionary Biology

Reason: Hub completion: 2/4 books
Domain ID: 02.04
Slot: HRS (Heresy)

Suggested Books:
  • The Extended Phenotype - Dawkins
  • Not By Genes Alone - Richerson & Boyd

# 2. Read for 60 minutes, then log
$ pm-log -d 02.04 -b "The Extended Phenotype" -s HRS -p 85 -t 60

✓ Logged reading session for 2024-01-15
  Domain: Evolutionary Biology
  Book: The Extended Phenotype
  Slot: HRS
  Updated domain books_read: 3

# 3. Check status
$ pm-status

🔥 Current Streak: 12 days

Branch Coverage:
Branch              Coverage   Progress
───────────────────────────────────────
Physical Sciences   0/13       ░░░░░░░░░░
Life Sciences       1/12       ▓░░░░░░░░░
...

Hub Completion Status:
Hub Domain              Books    Status
───────────────────────────────────────
Evolutionary Biology    3        📚 3/4
Thermodynamics          0        📚 0/4
...
```

### Weekly Synthesis

```bash
# 1. Generate bisociation pairs for the week
$ pm-pair --week

Week's Bisociation Pairs
─────────────────────────

Pair 1:
  Anchor: AI Machine Learning (07.09)
  Distant: Comparative Religion (15.01)
  Distance: 4
  Prompt: What assumption in AI ML does Comparative Religion implicitly violate?

Pair 2:
  Anchor: Corporate Finance (09.04)
  Distant: Ecology (02.05)
  Distance: 3
  Prompt: What problem in Corporate Finance might have an existing solution in Ecology?

Pair 3:
  Anchor: Game Theory (03.09)
  Distant: Culinary Arts (14.09)
  Distance: 4
  Prompt: What would a Culinary Arts practitioner find most confusing about Game Theory?

# 2. Run synthesis command
$ pm-synthesize

Weekly Synthesis Prompts
────────────────────────

Books completed this week: 5
Domains touched: 3

Questions to answer:
1. What mechanisms appeared in multiple domains?
2. What surprised you most?
3. What contradicted your existing beliefs?
4. What isomorphisms did you identify?
5. What problems were advanced?

Open: /path/to/vault/08-Weekly-Synthesis/2024-W03.md
```

### Gap Analysis

```bash
$ pm-gaps

⚠️  Domain Gaps Analysis
────────────────────────

Branches Never Touched:
• 08 - Health Medicine (15 domains)
• 10 - Education (9 domains)
• 11 - Arts Design Communication (12 domains)
• 14 - Trades Applied Tech (10 domains)
• 15 - Religion Theology (8 domains)

Stale Domains (>90 days):
• 03.04 Probability Statistics - 142 days
• 03.07 Information Theory - 98 days

Hub Domains Incomplete:
• 01.02 Thermodynamics - 0/4 books
• 02.04 Evolutionary Biology - 3/4 books
• 03.06 Network Theory - 1/4 books

Recommendation:
  Start with hub domain: Thermodynamics
  Read: "The Second Law" by Peter Atkins
```

---

## 6. ERROR HANDLING

### Common Errors

```python
# pm/core/errors.py

class PolymathError(Exception):
    """Base exception for Polymath Engine."""
    pass

class VaultNotFoundError(PolymathError):
    """Raised when vault path doesn't exist."""
    def __init__(self, path):
        self.path = path
        super().__init__(f"Vault not found at: {path}")

class DomainNotFoundError(PolymathError):
    """Raised when domain ID doesn't exist."""
    def __init__(self, domain_id):
        self.domain_id = domain_id
        super().__init__(f"Domain not found: {domain_id}")

class InvalidFrontmatterError(PolymathError):
    """Raised when file has invalid frontmatter."""
    def __init__(self, filepath, reason):
        self.filepath = filepath
        self.reason = reason
        super().__init__(f"Invalid frontmatter in {filepath}: {reason}")

class ConfigurationError(PolymathError):
    """Raised when configuration is invalid."""
    pass
```

### CLI Error Display

```python
# pm/cli.py

import click
from rich.console import Console
from .core.errors import PolymathError, VaultNotFoundError

console = Console()

@cli.command()
@click.pass_context
def status(ctx):
    try:
        # ... command logic
    except VaultNotFoundError as e:
        console.print(f"[red]Error:[/red] {e}")
        console.print(f"\nRun [bold]pm-init --vault-path /path/to/vault[/bold] to create a vault.")
        raise SystemExit(1)
    except PolymathError as e:
        console.print(f"[red]Error:[/red] {e}")
        raise SystemExit(1)
```

---

## 7. EXTENSIBILITY POINTS

### Custom Book Sources

```python
# pm/integrations/book_sources.py

from abc import ABC, abstractmethod
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class BookSuggestion:
    title: str
    author: str
    year: Optional[int]
    isbn: Optional[str]
    description: str
    source: str

class BookSource(ABC):
    @abstractmethod
    def search(self, domain: str, slot: str) -> List[BookSuggestion]:
        pass

class OpenLibrarySource(BookSource):
    def search(self, domain: str, slot: str) -> List[BookSuggestion]:
        # Implementation using Open Library API
        pass

class LocalCuratedSource(BookSource):
    def __init__(self, yaml_path: str):
        self.yaml_path = yaml_path
    
    def search(self, domain: str, slot: str) -> List[BookSuggestion]:
        # Load from curated YAML file
        pass
```

### Custom Traversal Strategies

```python
# pm/core/strategies.py

from abc import ABC, abstractmethod
from typing import List
from .domain import Domain
from .traversal import TraversalRecommendation

class TraversalStrategy(ABC):
    @abstractmethod
    def recommend(self, domains: List[Domain], context: dict) -> TraversalRecommendation:
        pass

class HubCompletionStrategy(TraversalStrategy):
    def recommend(self, domains: List[Domain], context: dict) -> TraversalRecommendation:
        # Current implementation
        pass

class ProblemDrivenStrategy(TraversalStrategy):
    def __init__(self, problem_id: str):
        self.problem_id = problem_id
    
    def recommend(self, domains: List[Domain], context: dict) -> TraversalRecommendation:
        # Pull from problem-relevant domains
        pass

class SpacedRepetitionStrategy(TraversalStrategy):
    def recommend(self, domains: List[Domain], context: dict) -> TraversalRecommendation:
        # Review domains based on forgetting curve
        pass
```

---

## 8. QUICK START CHECKLIST

```markdown
## Installation

1. Clone repository
   ```bash
   git clone https://github.com/alex/polymath-cli.git
   cd polymath-cli
   ```

2. Install package
   ```bash
   pip install -e ".[dev]"
   ```

3. Initialize vault
   ```bash
   pm-init --vault-path ~/Obsidian/Polymath-Engine
   ```

4. Open vault in Obsidian
   - Install Dataview plugin
   - Open Dashboard.md

5. Get first recommendation
   ```bash
   pm-next
   ```

6. Start reading!

## Daily Workflow

1. `pm-next` → Get recommendation
2. Read for 30-60 minutes
3. `pm-log` → Record session
4. Update notes in Obsidian
5. `pm-status` → Check progress

## Weekly Workflow

1. `pm-pair --week` → Get bisociation pairs
2. `pm-synthesize` → Generate synthesis prompts
3. Write weekly synthesis note
4. `pm-gaps` → Review coverage
5. Plan next week
```

---

*End of Part 5. Continue to SPEC-06-ALGORITHMS-DEEP-DIVE.md*
