# Polymath Engine: System Specification
## Part 3: CLI Tools Specification

---

## 1. OVERVIEW

### 1.1 Tool Suite

| Command | Purpose | Frequency |
|---------|---------|-----------|
| `pm-init` | Initialize vault with all folders, templates, domains | Once |
| `pm-status` | Show dashboard stats, gaps, streaks | Daily |
| `pm-next` | Recommend next book/domain based on strategy | Daily |
| `pm-pair` | Generate bisociation pairing | Weekly |
| `pm-log` | Quick-add daily reading log | Daily |
| `pm-distance` | Compute distance between domains | As needed |
| `pm-gaps` | Show untouched/neglected domains | Weekly |
| `pm-connections` | Show isomorphisms for a domain | As needed |
| `pm-synthesize` | Generate weekly synthesis prompts | Weekly |
| `pm-curate` | Search for books in domain + slot | As needed |
| `pm-export` | Export data for analysis | Monthly |
| `pm-backup` | Backup vault to git/archive | Daily |

### 1.2 Technical Stack

```
Python 3.10+
├── click (CLI framework)
├── pyyaml (YAML frontmatter parsing)
├── python-frontmatter (Markdown + YAML)
├── rich (Terminal formatting)
├── pathlib (File operations)
├── dataclasses (Data structures)
├── sqlite3 (Optional: local cache/index)
└── requests (Optional: book API lookups)
```

### 1.3 Directory Structure

```
📁 polymath-cli/
├── pyproject.toml
├── README.md
├── 📁 pm/
│   ├── __init__.py
│   ├── cli.py              # Main entry point
│   ├── config.py           # Configuration management
│   ├── 📁 commands/
│   │   ├── __init__.py
│   │   ├── init.py
│   │   ├── status.py
│   │   ├── next.py
│   │   ├── pair.py
│   │   ├── log.py
│   │   ├── distance.py
│   │   ├── gaps.py
│   │   ├── connections.py
│   │   ├── synthesize.py
│   │   ├── curate.py
│   │   ├── export.py
│   │   └── backup.py
│   ├── 📁 core/
│   │   ├── __init__.py
│   │   ├── vault.py        # Vault operations
│   │   ├── domain.py       # Domain model
│   │   ├── book.py         # Book model
│   │   ├── traversal.py    # Traversal algorithms
│   │   ├── distance.py     # Distance calculations
│   │   └── templates.py    # Template generation
│   └── 📁 data/
│       ├── domains.yaml    # Full domain taxonomy
│       ├── distances.yaml  # Branch distance matrix
│       ├── hubs.yaml       # Hub domain definitions
│       └── templates/      # Markdown templates
└── tests/
```

---

## 2. CONFIGURATION

### 2.1 Config File: `~/.polymath/config.yaml`

```yaml
# Polymath Engine Configuration

vault:
  path: "/Users/alex/Obsidian/Polymath-Engine"
  
user:
  name: "Alex"
  expert_domains:
    - "07.08"  # Software Engineering
    - "07.09"  # AI/ML
    - "07.10"  # Networks/Distributed
    - "05.05"  # Finance Theory
    - "09.04"  # Corporate Finance
  moderate_domains:
    - "05.01"  # Microeconomics
    - "05.02"  # Macroeconomics
    - "03.04"  # Probability
    - "03.07"  # Information Theory
    - "03.09"  # Game Theory
    - "03.10"  # Decision Theory

traversal:
  current_phase: "hub_completion"  # hub_completion | problem_driven | bisociation
  hub_target_books: 4
  min_branch_diversity_window: 28  # days
  max_domain_repeat_window: 14     # days
  bisociation_min_distance: 3

tracking:
  streak_file: ".streak"
  last_sync: null
  
integrations:
  goodreads_api_key: null
  openlibrary: true
```

### 2.2 Config Dataclass

```python
# pm/config.py

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional
import yaml

@dataclass
class UserConfig:
    name: str
    expert_domains: List[str]
    moderate_domains: List[str]

@dataclass  
class TraversalConfig:
    current_phase: str
    hub_target_books: int = 4
    min_branch_diversity_window: int = 28
    max_domain_repeat_window: int = 14
    bisociation_min_distance: int = 3

@dataclass
class Config:
    vault_path: Path
    user: UserConfig
    traversal: TraversalConfig
    
    @classmethod
    def load(cls, config_path: Path = None) -> 'Config':
        if config_path is None:
            config_path = Path.home() / ".polymath" / "config.yaml"
        
        with open(config_path) as f:
            data = yaml.safe_load(f)
        
        return cls(
            vault_path=Path(data['vault']['path']),
            user=UserConfig(**data['user']),
            traversal=TraversalConfig(**data['traversal'])
        )
    
    def save(self, config_path: Path = None):
        if config_path is None:
            config_path = Path.home() / ".polymath" / "config.yaml"
        
        config_path.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            'vault': {'path': str(self.vault_path)},
            'user': {
                'name': self.user.name,
                'expert_domains': self.user.expert_domains,
                'moderate_domains': self.user.moderate_domains,
            },
            'traversal': {
                'current_phase': self.traversal.current_phase,
                'hub_target_books': self.traversal.hub_target_books,
                'min_branch_diversity_window': self.traversal.min_branch_diversity_window,
                'max_domain_repeat_window': self.traversal.max_domain_repeat_window,
                'bisociation_min_distance': self.traversal.bisociation_min_distance,
            }
        }
        
        with open(config_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
```

---

## 3. DATA MODELS

### 3.1 Domain Model

```python
# pm/core/domain.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import date
from enum import Enum
from pathlib import Path
import frontmatter

class DomainStatus(Enum):
    UNTOUCHED = "untouched"
    SURVEYING = "surveying"
    SURVEYED = "surveyed"
    DEEPENING = "deepening"
    SPECIALIZED = "specialized"
    EXPERT = "expert"

class FunctionSlot(Enum):
    FOUNDATION = "FND"
    ORTHODOXY = "ORT"
    HERESY = "HRS"
    FRONTIER = "FRN"
    HISTORY = "HST"
    BRIDGE = "BRG"

@dataclass
class FunctionSlotStatus:
    slot: FunctionSlot
    status: str  # "not_started" | "in_progress" | "complete"
    books: List[str] = field(default_factory=list)

@dataclass
class Domain:
    domain_id: str
    domain_name: str
    branch_id: str
    branch_name: str
    description: str
    status: DomainStatus = DomainStatus.UNTOUCHED
    is_hub: bool = False
    is_expert: bool = False
    books_read: int = 0
    last_read: Optional[date] = None
    function_slots: Dict[FunctionSlot, FunctionSlotStatus] = field(default_factory=dict)
    subtopics: List[Dict] = field(default_factory=list)
    
    @classmethod
    def from_file(cls, filepath: Path) -> 'Domain':
        """Load domain from Obsidian markdown file."""
        post = frontmatter.load(filepath)
        
        status = DomainStatus(post.metadata.get('status', 'untouched'))
        last_read = post.metadata.get('last_read')
        if last_read and isinstance(last_read, str):
            last_read = date.fromisoformat(last_read)
        
        return cls(
            domain_id=post.metadata['domain_id'],
            domain_name=post.metadata['domain_name'],
            branch_id=post.metadata['branch_id'],
            branch_name=post.metadata['branch_name'],
            description=post.metadata.get('description', ''),
            status=status,
            is_hub=post.metadata.get('is_hub', False),
            is_expert=post.metadata.get('is_expert', False),
            books_read=post.metadata.get('books_read', 0),
            last_read=last_read,
        )
    
    def to_frontmatter(self) -> dict:
        """Convert to frontmatter dict."""
        return {
            'domain_id': self.domain_id,
            'domain_name': self.domain_name,
            'branch_id': self.branch_id,
            'branch_name': self.branch_name,
            'description': self.description,
            'status': self.status.value,
            'is_hub': self.is_hub,
            'is_expert': self.is_expert,
            'books_read': self.books_read,
            'last_read': self.last_read.isoformat() if self.last_read else None,
        }
    
    @property
    def branch_number(self) -> int:
        return int(self.branch_id)
    
    def days_since_read(self) -> Optional[int]:
        if self.last_read is None:
            return None
        return (date.today() - self.last_read).days


@dataclass
class Branch:
    branch_id: str
    branch_name: str
    domains: List[Domain] = field(default_factory=list)
    
    @property
    def domain_count(self) -> int:
        return len(self.domains)
    
    @property
    def touched_count(self) -> int:
        return sum(1 for d in self.domains if d.status != DomainStatus.UNTOUCHED)
    
    @property
    def coverage_pct(self) -> float:
        if self.domain_count == 0:
            return 0.0
        return self.touched_count / self.domain_count * 100
```

### 3.2 Book Model

```python
# pm/core/book.py

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date
from pathlib import Path
import frontmatter

@dataclass
class Book:
    title: str
    author: str
    year: Optional[int]
    domain_id: str
    domain_name: str
    function_slot: str
    status: str  # "queued" | "reading" | "completed" | "abandoned"
    date_started: Optional[date] = None
    date_finished: Optional[date] = None
    rating: Optional[int] = None
    pages: Optional[int] = None
    filepath: Optional[Path] = None
    
    @classmethod
    def from_file(cls, filepath: Path) -> 'Book':
        post = frontmatter.load(filepath)
        m = post.metadata
        
        return cls(
            title=m['title'],
            author=m['author'],
            year=m.get('year'),
            domain_id=m['domain_id'],
            domain_name=m['domain'],
            function_slot=m['function_slot'],
            status=m['status'],
            date_started=date.fromisoformat(m['date_started']) if m.get('date_started') else None,
            date_finished=date.fromisoformat(m['date_finished']) if m.get('date_finished') else None,
            rating=m.get('rating'),
            pages=m.get('pages'),
            filepath=filepath,
        )
    
    @property
    def filename(self) -> str:
        """Generate standard filename."""
        safe_author = self.author.split(',')[0].split()[-1]  # Last name
        safe_title = self.title[:30].replace(' ', '-').replace(':', '')
        return f"{safe_author}-{safe_title}.md"
```

### 3.3 Daily Log Model

```python
# pm/core/daily_log.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import date
from pathlib import Path
import frontmatter

@dataclass
class Mechanism:
    name: str
    description: str
    conditions: str

@dataclass
class Connection:
    target_domain: str
    how: str
    strength: str  # "strong" | "moderate" | "weak"

@dataclass
class DailyLog:
    log_date: date
    domain_id: str
    domain_name: str
    book_title: str
    function_slot: str
    pages_read: int = 0
    reading_time_minutes: int = 0
    phase: str = ""
    bisociation_partner: str = ""
    mechanisms: List[Mechanism] = field(default_factory=list)
    connections: List[Connection] = field(default_factory=list)
    surprising_claims: List[str] = field(default_factory=list)
    raw_notes: str = ""
    
    @classmethod
    def from_file(cls, filepath: Path) -> 'DailyLog':
        post = frontmatter.load(filepath)
        m = post.metadata
        
        return cls(
            log_date=date.fromisoformat(m['date']),
            domain_id=m.get('domain_id', ''),
            domain_name=m.get('domain', ''),
            book_title=m.get('book', ''),
            function_slot=m.get('function_slot', ''),
            pages_read=m.get('pages_read', 0),
            reading_time_minutes=m.get('reading_time_minutes', 0),
            phase=m.get('phase', ''),
            bisociation_partner=m.get('bisociation_partner', ''),
        )
    
    @property
    def filename(self) -> str:
        return f"{self.log_date.isoformat()}.md"
```

---

## 4. CORE ALGORITHMS

### 4.1 Distance Calculation

```python
# pm/core/distance.py

from typing import Dict, Tuple, List, Set
import yaml
from pathlib import Path

# Branch distance matrix (from SPEC-01)
BRANCH_DISTANCES: Dict[Tuple[str, str], int] = {
    ("01", "01"): 0, ("01", "02"): 1, ("01", "03"): 1, ("01", "04"): 2,
    ("01", "05"): 2, ("01", "06"): 3, ("01", "07"): 1, ("01", "08"): 2,
    ("01", "09"): 3, ("01", "10"): 3, ("01", "11"): 3, ("01", "12"): 3,
    ("01", "13"): 2, ("01", "14"): 2, ("01", "15"): 4,
    # ... (full matrix in data/distances.yaml)
}

def get_branch_distance(branch_a: str, branch_b: str) -> int:
    """Get base distance between two branches."""
    key = (min(branch_a, branch_b), max(branch_a, branch_b))
    if branch_a == branch_b:
        return 0
    return BRANCH_DISTANCES.get(key, BRANCH_DISTANCES.get((branch_b, branch_a), 2))

def compute_domain_distance(
    domain_a_id: str, 
    domain_b_id: str,
    shared_isomorphisms: List[str] = None
) -> float:
    """
    Compute distance between two domains.
    
    Distance is reduced if domains share isomorphisms.
    """
    branch_a = domain_a_id.split('.')[0]
    branch_b = domain_b_id.split('.')[0]
    
    base_distance = get_branch_distance(branch_a, branch_b)
    
    # Reduce distance for shared isomorphisms
    if shared_isomorphisms:
        isomorphism_adjustment = -0.5 * len(shared_isomorphisms)
        base_distance = max(0, base_distance + isomorphism_adjustment)
    
    return base_distance

def find_distant_domains(
    anchor_domain_id: str,
    all_domains: List['Domain'],
    min_distance: int = 3,
    exclude_ids: Set[str] = None
) -> List[Tuple['Domain', float]]:
    """Find domains at least min_distance away from anchor."""
    exclude_ids = exclude_ids or set()
    
    results = []
    for domain in all_domains:
        if domain.domain_id in exclude_ids:
            continue
        if domain.domain_id == anchor_domain_id:
            continue
            
        distance = compute_domain_distance(anchor_domain_id, domain.domain_id)
        if distance >= min_distance:
            results.append((domain, distance))
    
    return sorted(results, key=lambda x: -x[1])  # Highest distance first
```

### 4.2 Traversal Strategy

```python
# pm/core/traversal.py

from dataclasses import dataclass
from typing import List, Optional, Tuple, Set
from datetime import date, timedelta
import random
from .domain import Domain, DomainStatus, Branch
from .distance import compute_domain_distance, find_distant_domains

@dataclass
class TraversalRecommendation:
    domain: Domain
    function_slot: str
    reason: str
    suggested_books: List[str]
    bisociation_partner: Optional[Domain] = None
    distance_from_last: Optional[float] = None

class TraversalEngine:
    def __init__(
        self,
        domains: List[Domain],
        branches: List[Branch],
        config: 'TraversalConfig',
        user_config: 'UserConfig',
        recent_reads: List['DailyLog'] = None
    ):
        self.domains = domains
        self.branches = branches
        self.config = config
        self.user_config = user_config
        self.recent_reads = recent_reads or []
        
        # Index domains
        self.domain_by_id = {d.domain_id: d for d in domains}
        self.hub_domains = [d for d in domains if d.is_hub]
        self.expert_domains = [d for d in domains if d.is_expert]
        
    def get_recent_domain_ids(self, days: int = 14) -> Set[str]:
        """Get domain IDs read in last N days."""
        cutoff = date.today() - timedelta(days=days)
        return {
            log.domain_id 
            for log in self.recent_reads 
            if log.log_date >= cutoff
        }
    
    def get_recent_branch_ids(self, days: int = 28) -> Set[str]:
        """Get branch IDs touched in last N days."""
        cutoff = date.today() - timedelta(days=days)
        return {
            log.domain_id.split('.')[0]
            for log in self.recent_reads
            if log.log_date >= cutoff
        }
    
    def recommend_next(self) -> TraversalRecommendation:
        """Generate next reading recommendation based on current phase."""
        phase = self.config.current_phase
        
        if phase == "hub_completion":
            return self._recommend_hub_completion()
        elif phase == "problem_driven":
            return self._recommend_problem_driven()
        elif phase == "bisociation":
            return self._recommend_bisociation()
        else:
            raise ValueError(f"Unknown phase: {phase}")
    
    def _recommend_hub_completion(self) -> TraversalRecommendation:
        """
        Hub completion phase:
        - Prioritize incomplete hub domains
        - Interleave with distant domains weekly
        """
        recent_domains = self.get_recent_domain_ids(self.config.max_domain_repeat_window)
        
        # Check if we should do a distant domain (weekly interleave)
        days_since_distant = self._days_since_distant_read()
        if days_since_distant is not None and days_since_distant >= 7:
            return self._recommend_distant_for_interleave()
        
        # Find incomplete hub domains
        incomplete_hubs = [
            d for d in self.hub_domains
            if d.books_read < self.config.hub_target_books
            and d.domain_id not in recent_domains
            and not d.is_expert
        ]
        
        if incomplete_hubs:
            # Prioritize by books remaining
            hub = min(incomplete_hubs, key=lambda d: d.books_read)
            slot = self._next_slot_for_domain(hub)
            
            return TraversalRecommendation(
                domain=hub,
                function_slot=slot,
                reason=f"Hub completion: {hub.books_read}/{self.config.hub_target_books} books",
                suggested_books=self._suggest_books(hub, slot),
            )
        
        # All hubs complete - transition to next phase
        return TraversalRecommendation(
            domain=self.domains[0],  # Placeholder
            function_slot="FND",
            reason="All hubs complete! Consider transitioning to problem_driven phase.",
            suggested_books=[],
        )
    
    def _recommend_distant_for_interleave(self) -> TraversalRecommendation:
        """Recommend a distant domain for weekly interleave."""
        recent_domains = self.get_recent_domain_ids(self.config.max_domain_repeat_window)
        
        # Get a random expert/strength domain as anchor
        if self.expert_domains:
            anchor = random.choice(self.expert_domains)
        else:
            anchor = random.choice(self.domains)
        
        # Find untouched domains at maximum distance
        distant = find_distant_domains(
            anchor.domain_id,
            self.domains,
            min_distance=self.config.bisociation_min_distance,
            exclude_ids=recent_domains
        )
        
        # Prefer untouched
        untouched = [(d, dist) for d, dist in distant if d.status == DomainStatus.UNTOUCHED]
        
        if untouched:
            domain, distance = random.choice(untouched[:10])  # Random from top 10
        elif distant:
            domain, distance = distant[0]
        else:
            # Fallback
            domain = random.choice([d for d in self.domains if d.domain_id not in recent_domains])
            distance = 0
        
        return TraversalRecommendation(
            domain=domain,
            function_slot="FND",
            reason=f"Distant interleave (distance={distance} from {anchor.domain_name})",
            suggested_books=self._suggest_books(domain, "FND"),
            distance_from_last=distance,
        )
    
    def _recommend_problem_driven(self) -> TraversalRecommendation:
        """
        Problem-driven phase:
        - Pull from domains relevant to active problems
        - Ensure 1 random distant domain per week
        """
        # Implementation depends on problem definitions
        # For now, return placeholder
        return self._recommend_distant_for_interleave()
    
    def _recommend_bisociation(self) -> TraversalRecommendation:
        """
        Bisociation phase:
        - 3 days: strength cluster
        - 3 days: maximum distance
        - 1 day: synthesis
        """
        recent_domains = self.get_recent_domain_ids(7)
        
        # Determine if strength or distant day
        recent_count = len([r for r in self.recent_reads if r.log_date >= date.today() - timedelta(days=6)])
        
        if recent_count % 2 == 0:  # Alternate
            # Strength cluster day
            strength_domains = self.expert_domains + [
                d for d in self.domains 
                if d.status in [DomainStatus.SURVEYED, DomainStatus.DEEPENING]
            ]
            available = [d for d in strength_domains if d.domain_id not in recent_domains]
            
            if available:
                domain = random.choice(available)
                return TraversalRecommendation(
                    domain=domain,
                    function_slot=self._next_slot_for_domain(domain),
                    reason="Bisociation: strength cluster day",
                    suggested_books=self._suggest_books(domain, "FRN"),  # Frontier for depth
                )
        
        # Distant day
        return self._recommend_distant_for_interleave()
    
    def _next_slot_for_domain(self, domain: Domain) -> str:
        """Determine next function slot to fill for a domain."""
        # Priority order for survey phase
        slot_priority = ["FND", "HRS", "ORT", "FRN", "HST", "BRG"]
        
        # This would check domain's function_slots status
        # For now, return based on books_read
        if domain.books_read == 0:
            return "FND"
        elif domain.books_read == 1:
            return "HRS"
        elif domain.books_read == 2:
            return "ORT"
        elif domain.books_read == 3:
            return "FRN"
        elif domain.books_read == 4:
            return "HST"
        else:
            return "BRG"
    
    def _suggest_books(self, domain: Domain, slot: str) -> List[str]:
        """Suggest books for a domain + slot combination."""
        # This would integrate with curated book database
        # For now, return empty
        return []
    
    def _days_since_distant_read(self) -> Optional[int]:
        """Days since reading a domain at distance >= 3 from expert domains."""
        if not self.recent_reads:
            return None
        
        for log in sorted(self.recent_reads, key=lambda x: x.log_date, reverse=True):
            for expert in self.expert_domains:
                dist = compute_domain_distance(log.domain_id, expert.domain_id)
                if dist >= self.config.bisociation_min_distance:
                    return (date.today() - log.log_date).days
        
        return None
```

### 4.3 Bisociation Pairing

```python
# pm/core/bisociation.py

from dataclasses import dataclass
from typing import List, Tuple, Optional
import random
from .domain import Domain, DomainStatus
from .distance import compute_domain_distance, find_distant_domains

@dataclass
class BisociationPair:
    anchor: Domain
    distant: Domain
    distance: float
    synthesis_prompt: str

# Synthesis prompt templates
SYNTHESIS_PROMPTS = [
    "What would a {anchor} expert find most confusing about {distant}?",
    "What problem in {anchor} might have an existing solution in {distant}?",
    "What assumption in {anchor} does {distant} implicitly violate?",
    "If {distant} practitioners took over {anchor}, what would they change first?",
    "What's the {distant} equivalent of {anchor}'s core mechanism?",
    "What question does {anchor} ask that {distant} has never considered?",
    "What would happen if {anchor} adopted {distant}'s methodology?",
    "What phenomenon exists in both {anchor} and {distant} but is explained differently?",
    "What does {anchor} optimize for that {distant} ignores?",
    "What would a unified theory of {anchor} and {distant} need to explain?",
]

def generate_bisociation_pair(
    strength_domains: List[Domain],
    all_domains: List[Domain],
    recent_pairs: List[Tuple[str, str]] = None,
    min_distance: int = 3
) -> BisociationPair:
    """
    Generate a bisociation pair for creative collision.
    
    Args:
        strength_domains: Domains user has expertise in
        all_domains: All available domains
        recent_pairs: Recently used pairs to avoid
        min_distance: Minimum distance between anchor and distant
    
    Returns:
        BisociationPair with anchor, distant, and synthesis prompt
    """
    recent_pairs = recent_pairs or []
    recent_set = {tuple(sorted(p)) for p in recent_pairs}
    
    # Pick anchor from strength cluster
    anchor = random.choice(strength_domains)
    
    # Find distant domains
    candidates = find_distant_domains(
        anchor.domain_id,
        all_domains,
        min_distance=min_distance
    )
    
    # Filter out recent pairs
    candidates = [
        (d, dist) for d, dist in candidates
        if tuple(sorted([anchor.domain_id, d.domain_id])) not in recent_set
    ]
    
    # Prefer untouched domains
    untouched = [(d, dist) for d, dist in candidates if d.status == DomainStatus.UNTOUCHED]
    
    if untouched:
        distant, distance = random.choice(untouched[:5])
    elif candidates:
        distant, distance = random.choice(candidates[:10])
    else:
        # Fallback: random domain
        distant = random.choice([d for d in all_domains if d.domain_id != anchor.domain_id])
        distance = compute_domain_distance(anchor.domain_id, distant.domain_id)
    
    # Generate synthesis prompt
    prompt_template = random.choice(SYNTHESIS_PROMPTS)
    prompt = prompt_template.format(
        anchor=anchor.domain_name,
        distant=distant.domain_name
    )
    
    return BisociationPair(
        anchor=anchor,
        distant=distant,
        distance=distance,
        synthesis_prompt=prompt
    )

def generate_week_pairs(
    strength_domains: List[Domain],
    all_domains: List[Domain],
    num_pairs: int = 3
) -> List[BisociationPair]:
    """Generate multiple pairs for a week's worth of bisociations."""
    pairs = []
    used = []
    
    for _ in range(num_pairs):
        pair = generate_bisociation_pair(
            strength_domains,
            all_domains,
            recent_pairs=used
        )
        pairs.append(pair)
        used.append((pair.anchor.domain_id, pair.distant.domain_id))
    
    return pairs
```

---

## 5. CLI COMMAND IMPLEMENTATIONS

### 5.1 Main CLI Entry Point

```python
# pm/cli.py

import click
from pathlib import Path
from .config import Config
from .commands import init, status, next_cmd, pair, log, distance, gaps, connections, synthesize, curate, export, backup

@click.group()
@click.option('--config', '-c', type=click.Path(), help='Path to config file')
@click.option('--vault', '-v', type=click.Path(), help='Path to Obsidian vault')
@click.pass_context
def cli(ctx, config, vault):
    """Polymath Engine CLI - Systematic polymathic learning."""
    ctx.ensure_object(dict)
    
    # Load configuration
    config_path = Path(config) if config else None
    ctx.obj['config'] = Config.load(config_path)
    
    # Override vault path if provided
    if vault:
        ctx.obj['config'].vault_path = Path(vault)

# Register commands
cli.add_command(init.init)
cli.add_command(status.status)
cli.add_command(next_cmd.next)
cli.add_command(pair.pair)
cli.add_command(log.log)
cli.add_command(distance.distance)
cli.add_command(gaps.gaps)
cli.add_command(connections.connections)
cli.add_command(synthesize.synthesize)
cli.add_command(curate.curate)
cli.add_command(export.export)
cli.add_command(backup.backup)

if __name__ == '__main__':
    cli()
```

### 5.2 pm-init Command

```python
# pm/commands/init.py

import click
from pathlib import Path
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
import yaml

console = Console()

@click.command()
@click.option('--vault-path', '-p', type=click.Path(), required=True, help='Path for new vault')
@click.option('--force', '-f', is_flag=True, help='Overwrite existing vault')
@click.pass_context
def init(ctx, vault_path, force):
    """Initialize a new Polymath Engine vault."""
    vault = Path(vault_path)
    
    if vault.exists() and not force:
        console.print(f"[red]Vault already exists at {vault}. Use --force to overwrite.[/red]")
        return
    
    console.print(f"[bold blue]Initializing Polymath Engine vault at {vault}[/bold blue]")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        
        # Create directory structure
        task = progress.add_task("Creating directories...", total=None)
        create_directory_structure(vault)
        progress.update(task, completed=True)
        
        # Create templates
        task = progress.add_task("Creating templates...", total=None)
        create_templates(vault)
        progress.update(task, completed=True)
        
        # Create domain files
        task = progress.add_task("Creating domain profiles (170 domains)...", total=None)
        create_domain_files(vault)
        progress.update(task, completed=True)
        
        # Create system files
        task = progress.add_task("Creating system files...", total=None)
        create_system_files(vault)
        progress.update(task, completed=True)
        
        # Create config
        task = progress.add_task("Creating configuration...", total=None)
        create_config(vault)
        progress.update(task, completed=True)
    
    console.print(f"\n[bold green]✓ Vault initialized successfully![/bold green]")
    console.print(f"\nNext steps:")
    console.print(f"  1. Open {vault} in Obsidian")
    console.print(f"  2. Install Dataview plugin")
    console.print(f"  3. Run [bold]pm-status[/bold] to see your dashboard")
    console.print(f"  4. Run [bold]pm-next[/bold] to get your first reading recommendation")

def create_directory_structure(vault: Path):
    """Create all directories."""
    dirs = [
        "00-System/Templates",
        "01-Daily-Logs",
        "02-Domains/01-Physical-Sciences",
        "02-Domains/02-Life-Sciences",
        "02-Domains/03-Formal-Sciences",
        "02-Domains/04-Mind-Sciences",
        "02-Domains/05-Social-Sciences",
        "02-Domains/06-Humanities",
        "02-Domains/07-Engineering",
        "02-Domains/08-Health-Medicine",
        "02-Domains/09-Business-Management",
        "02-Domains/10-Education",
        "02-Domains/11-Arts-Design-Communication",
        "02-Domains/12-Law-Public-Admin",
        "02-Domains/13-Agriculture-Environment",
        "02-Domains/14-Trades-Applied-Tech",
        "02-Domains/15-Religion-Theology",
        "03-Books",
        "04-Isomorphisms",
        "05-Bridges",
        "06-Blind-Spots",
        "07-Problems",
        "08-Weekly-Synthesis",
        "09-Production/Ideas",
        "09-Production/Drafts",
        "09-Production/Published",
        "99-Archive",
    ]
    
    for dir_path in dirs:
        (vault / dir_path).mkdir(parents=True, exist_ok=True)

def create_templates(vault: Path):
    """Create template files."""
    from ..data.templates import TEMPLATES
    
    template_dir = vault / "00-System" / "Templates"
    
    for name, content in TEMPLATES.items():
        filepath = template_dir / f"T-{name}.md"
        filepath.write_text(content)

def create_domain_files(vault: Path):
    """Create all 170 domain profile files."""
    from ..data.domains import DOMAINS
    
    for domain in DOMAINS:
        branch_folder = vault / "02-Domains" / f"{domain['branch_id']:02d}-{domain['branch_name'].replace(' ', '-').replace('/', '-')}"
        branch_folder.mkdir(parents=True, exist_ok=True)
        
        filename = f"{domain['domain_id']}-{domain['domain_name'].replace(' ', '-').replace('/', '-')}.md"
        filepath = branch_folder / filename
        
        content = generate_domain_file(domain)
        filepath.write_text(content)
    
    # Create branch overview files
    from ..data.domains import BRANCHES
    for branch in BRANCHES:
        branch_folder = vault / "02-Domains" / f"{branch['branch_id']:02d}-{branch['branch_name'].replace(' ', '-').replace('/', '-')}"
        overview_path = branch_folder / "_Branch-Overview.md"
        overview_path.write_text(generate_branch_overview(branch))

def generate_domain_file(domain: dict) -> str:
    """Generate markdown content for a domain profile."""
    frontmatter = {
        'domain_id': domain['domain_id'],
        'domain_name': domain['domain_name'],
        'branch_id': f"{domain['branch_id']:02d}",
        'branch_name': domain['branch_name'],
        'description': domain.get('description', ''),
        'status': 'expert' if domain.get('is_expert') else 'untouched',
        'is_hub': domain.get('is_hub', False),
        'is_expert': domain.get('is_expert', False),
        'books_read': 0,
        'last_read': None,
        'date_created': str(date.today()),
        'date_modified': str(date.today()),
        'priority': 'high' if domain.get('is_hub') else 'normal',
        'tags': ['domain', f"branch/{domain['branch_id']:02d}"],
    }
    
    yaml_str = yaml.dump(frontmatter, default_flow_style=False, sort_keys=False)
    
    # Use template body
    body = DOMAIN_TEMPLATE_BODY.format(
        domain_id=domain['domain_id'],
        domain_name=domain['domain_name'],
        branch_id=f"{domain['branch_id']:02d}",
        branch_name=domain['branch_name'],
        description=domain.get('description', ''),
    )
    
    return f"---\n{yaml_str}---\n\n{body}"

def create_system_files(vault: Path):
    """Create dashboard, index, and other system files."""
    # Dashboard
    dashboard_path = vault / "00-System" / "Dashboard.md"
    dashboard_path.write_text(DASHBOARD_CONTENT)
    
    # Domain Index
    index_path = vault / "00-System" / "Domain-Index.md"
    index_path.write_text(generate_domain_index())
    
    # Problem files
    problems_dir = vault / "07-Problems"
    for problem in INITIAL_PROBLEMS:
        problem_path = problems_dir / f"{problem['id']}-{problem['name']}.md"
        problem_path.write_text(generate_problem_file(problem))

def create_config(vault: Path):
    """Create config file in ~/.polymath/"""
    config_dir = Path.home() / ".polymath"
    config_dir.mkdir(parents=True, exist_ok=True)
    
    config_path = config_dir / "config.yaml"
    config_content = f"""
vault:
  path: "{vault}"

user:
  name: "Alex"
  expert_domains:
    - "07.08"
    - "07.09"
    - "07.10"
    - "05.05"
    - "09.04"
  moderate_domains:
    - "05.01"
    - "05.02"
    - "03.04"
    - "03.07"
    - "03.09"
    - "03.10"

traversal:
  current_phase: "hub_completion"
  hub_target_books: 4
  min_branch_diversity_window: 28
  max_domain_repeat_window: 14
  bisociation_min_distance: 3
"""
    config_path.write_text(config_content)
```

### 5.3 pm-status Command

```python
# pm/commands/status.py

import click
from pathlib import Path
from datetime import date, timedelta
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.columns import Columns
from collections import Counter

from ..core.vault import Vault
from ..core.domain import DomainStatus

console = Console()

@click.command()
@click.option('--full', '-f', is_flag=True, help='Show full statistics')
@click.pass_context
def status(ctx, full):
    """Show dashboard statistics and progress."""
    config = ctx.obj['config']
    vault = Vault(config.vault_path)
    
    # Load all data
    domains = vault.load_all_domains()
    logs = vault.load_recent_logs(days=30)
    
    # Header
    console.print(Panel.fit(
        "[bold blue]Polymath Engine Status[/bold blue]",
        subtitle=f"Phase: {config.traversal.current_phase}"
    ))
    
    # Streak
    streak = calculate_streak(logs)
    console.print(f"\n🔥 Current Streak: [bold]{streak} days[/bold]")
    
    # Quick stats
    stats_table = Table(show_header=False, box=None)
    stats_table.add_column("Metric", style="dim")
    stats_table.add_column("Value", style="bold")
    
    total_books = sum(d.books_read for d in domains)
    domains_touched = sum(1 for d in domains if d.status != DomainStatus.UNTOUCHED)
    
    stats_table.add_row("Total Books Read", str(total_books))
    stats_table.add_row("Domains Touched", f"{domains_touched}/170")
    stats_table.add_row("Days Logged (30d)", str(len(logs)))
    
    console.print(stats_table)
    
    # Branch coverage
    console.print("\n[bold]Branch Coverage:[/bold]")
    branch_table = Table(show_header=True)
    branch_table.add_column("Branch", style="dim")
    branch_table.add_column("Coverage", justify="right")
    branch_table.add_column("Progress")
    
    branches = group_by_branch(domains)
    for branch_name, branch_domains in sorted(branches.items()):
        touched = sum(1 for d in branch_domains if d.status != DomainStatus.UNTOUCHED)
        total = len(branch_domains)
        pct = touched / total if total > 0 else 0
        bar = "▓" * int(pct * 10) + "░" * (10 - int(pct * 10))
        branch_table.add_row(
            branch_name[:20],
            f"{touched}/{total}",
            bar
        )
    
    console.print(branch_table)
    
    # Hub status
    if config.traversal.current_phase == "hub_completion":
        console.print("\n[bold]Hub Completion Status:[/bold]")
        hub_table = Table()
        hub_table.add_column("Hub Domain")
        hub_table.add_column("Books", justify="right")
        hub_table.add_column("Status")
        
        hubs = [d for d in domains if d.is_hub]
        for hub in hubs:
            target = config.traversal.hub_target_books
            status_str = "✅" if hub.books_read >= target else f"📚 {hub.books_read}/{target}"
            hub_table.add_row(hub.domain_name, str(hub.books_read), status_str)
        
        console.print(hub_table)
    
    # Warnings
    stale = [d for d in domains if d.days_since_read() and d.days_since_read() > 90]
    if stale:
        console.print(f"\n[yellow]⚠️  {len(stale)} domains not read in >90 days[/yellow]")
    
    # Recent activity
    if logs:
        console.print("\n[bold]Recent Activity:[/bold]")
        recent_table = Table(show_header=True)
        recent_table.add_column("Date")
        recent_table.add_column("Domain")
        recent_table.add_column("Book")
        
        for log in logs[:7]:
            recent_table.add_row(
                str(log.log_date),
                log.domain_name[:25],
                log.book_title[:30]
            )
        
        console.print(recent_table)

def calculate_streak(logs) -> int:
    """Calculate current reading streak in days."""
    if not logs:
        return 0
    
    sorted_logs = sorted(logs, key=lambda x: x.log_date, reverse=True)
    streak = 0
    expected_date = date.today()
    
    for log in sorted_logs:
        if log.log_date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        elif log.log_date < expected_date:
            break
    
    return streak

def group_by_branch(domains):
    """Group domains by branch name."""
    branches = {}
    for domain in domains:
        if domain.branch_name not in branches:
            branches[domain.branch_name] = []
        branches[domain.branch_name].append(domain)
    return branches
```

### 5.4 pm-next Command

```python
# pm/commands/next.py

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from ..core.vault import Vault
from ..core.traversal import TraversalEngine

console = Console()

@click.command()
@click.option('--domain', '-d', help='Force specific domain')
@click.option('--slot', '-s', help='Force specific function slot')
@click.option('--explain', '-e', is_flag=True, help='Explain reasoning')
@click.pass_context
def next(ctx, domain, slot, explain):
    """Get next reading recommendation."""
    config = ctx.obj['config']
    vault = Vault(config.vault_path)
    
    # Load data
    domains = vault.load_all_domains()
    branches = vault.load_branches()
    logs = vault.load_recent_logs(days=30)
    
    # Create traversal engine
    engine = TraversalEngine(
        domains=domains,
        branches=branches,
        config=config.traversal,
        user_config=config.user,
        recent_reads=logs
    )
    
    # Get recommendation
    rec = engine.recommend_next()
    
    # Display
    console.print(Panel.fit(
        f"[bold green]{rec.domain.domain_name}[/bold green]",
        title="📚 Next Read",
        subtitle=f"Slot: {rec.function_slot}"
    ))
    
    console.print(f"\n[dim]Reason:[/dim] {rec.reason}")
    console.print(f"[dim]Domain ID:[/dim] {rec.domain.domain_id}")
    console.print(f"[dim]Branch:[/dim] {rec.domain.branch_name}")
    console.print(f"[dim]Current Status:[/dim] {rec.domain.status.value}")
    console.print(f"[dim]Books Read:[/dim] {rec.domain.books_read}")
    
    if rec.bisociation_partner:
        console.print(f"\n[bold]Bisociation Partner:[/bold] {rec.bisociation_partner.domain_name}")
        console.print(f"[dim]Distance:[/dim] {rec.distance_from_last}")
    
    if rec.suggested_books:
        console.print("\n[bold]Suggested Books:[/bold]")
        for book in rec.suggested_books[:5]:
            console.print(f"  • {book}")
    
    if explain:
        console.print("\n[bold]Algorithm Explanation:[/bold]")
        console.print(f"  Phase: {config.traversal.current_phase}")
        console.print(f"  Recent domains avoided: {config.traversal.max_domain_repeat_window} day window")
        console.print(f"  Hub target: {config.traversal.hub_target_books} books")
```

### 5.5 pm-pair Command

```python
# pm/commands/pair.py

import click
from rich.console import Console
from rich.panel import Panel

from ..core.vault import Vault
from ..core.bisociation import generate_bisociation_pair, generate_week_pairs

console = Console()

@click.command()
@click.option('--week', '-w', is_flag=True, help='Generate pairs for entire week')
@click.option('--min-distance', '-d', default=3, help='Minimum distance')
@click.pass_context
def pair(ctx, week, min_distance):
    """Generate bisociation pairing for creative collision."""
    config = ctx.obj['config']
    vault = Vault(config.vault_path)
    
    # Load data
    domains = vault.load_all_domains()
    
    # Get strength domains
    expert_ids = set(config.user.expert_domains + config.user.moderate_domains)
    strength_domains = [d for d in domains if d.domain_id in expert_ids or d.is_expert]
    
    if not strength_domains:
        console.print("[yellow]No expert domains configured. Using random anchor.[/yellow]")
        strength_domains = domains[:10]
    
    if week:
        pairs = generate_week_pairs(strength_domains, domains, num_pairs=3)
        
        console.print(Panel.fit("[bold blue]Week's Bisociation Pairs[/bold blue]"))
        
        for i, p in enumerate(pairs, 1):
            console.print(f"\n[bold]Pair {i}:[/bold]")
            console.print(f"  Anchor: [green]{p.anchor.domain_name}[/green] ({p.anchor.domain_id})")
            console.print(f"  Distant: [cyan]{p.distant.domain_name}[/cyan] ({p.distant.domain_id})")
            console.print(f"  Distance: {p.distance}")
            console.print(f"  Prompt: [italic]{p.synthesis_prompt}[/italic]")
    else:
        p = generate_bisociation_pair(
            strength_domains,
            domains,
            min_distance=min_distance
        )
        
        console.print(Panel.fit(
            f"[green]{p.anchor.domain_name}[/green] ↔ [cyan]{p.distant.domain_name}[/cyan]",
            title="🎲 Bisociation Pair",
            subtitle=f"Distance: {p.distance}"
        ))
        
        console.print(f"\n[bold]Synthesis Prompt:[/bold]")
        console.print(f"  [italic]{p.synthesis_prompt}[/italic]")
        
        console.print(f"\n[dim]Anchor branch:[/dim] {p.anchor.branch_name}")
        console.print(f"[dim]Distant branch:[/dim] {p.distant.branch_name}")
        console.print(f"[dim]Distant status:[/dim] {p.distant.status.value}")
```

### 5.6 pm-log Command

```python
# pm/commands/log.py

import click
from datetime import date
from pathlib import Path
from rich.console import Console
from rich.prompt import Prompt, Confirm
import frontmatter

from ..core.vault import Vault

console = Console()

@click.command()
@click.option('--domain', '-d', required=True, help='Domain ID (e.g., 02.04)')
@click.option('--book', '-b', required=True, help='Book title')
@click.option('--slot', '-s', default='FND', help='Function slot (FND/ORT/HRS/FRN/HST/BRG)')
@click.option('--pages', '-p', type=int, default=0, help='Pages read')
@click.option('--time', '-t', type=int, default=0, help='Minutes spent')
@click.option('--interactive', '-i', is_flag=True, help='Interactive mode')
@click.pass_context
def log(ctx, domain, book, slot, pages, time, interactive):
    """Log today's reading session."""
    config = ctx.obj['config']
    vault = Vault(config.vault_path)
    
    # Validate domain
    domain_obj = vault.get_domain(domain)
    if not domain_obj:
        console.print(f"[red]Domain {domain} not found[/red]")
        return
    
    if interactive:
        pages = int(Prompt.ask("Pages read", default=str(pages)))
        time = int(Prompt.ask("Minutes spent", default=str(time)))
        
        # Mechanisms
        mechanisms = []
        while Confirm.ask("Add a mechanism?", default=False):
            name = Prompt.ask("Mechanism name")
            desc = Prompt.ask("How it works")
            mechanisms.append({'name': name, 'description': desc})
        
        # Connections
        connections = []
        while Confirm.ask("Add a connection to another domain?", default=False):
            target = Prompt.ask("Target domain ID")
            how = Prompt.ask("How they connect")
            connections.append({'target': target, 'how': how})
    else:
        mechanisms = []
        connections = []
    
    # Create log file
    today = date.today()
    log_path = vault.vault_path / "01-Daily-Logs" / f"{today.isoformat()}.md"
    
    log_content = generate_log_content(
        log_date=today,
        domain_id=domain,
        domain_name=domain_obj.domain_name,
        book_title=book,
        function_slot=slot,
        pages_read=pages,
        reading_time=time,
        phase=config.traversal.current_phase,
        mechanisms=mechanisms,
        connections=connections,
    )
    
    log_path.write_text(log_content)
    
    # Update domain
    domain_obj.books_read += 1
    domain_obj.last_read = today
    if domain_obj.status.value == 'untouched':
        domain_obj.status = DomainStatus.SURVEYING
    vault.save_domain(domain_obj)
    
    console.print(f"[green]✓ Logged reading session for {today}[/green]")
    console.print(f"  Domain: {domain_obj.domain_name}")
    console.print(f"  Book: {book}")
    console.print(f"  Slot: {slot}")
    console.print(f"  Updated domain books_read: {domain_obj.books_read}")

def generate_log_content(**kwargs) -> str:
    """Generate daily log markdown content."""
    # Implementation using template
    pass
```

---

## 6. VAULT OPERATIONS

```python
# pm/core/vault.py

from pathlib import Path
from typing import List, Optional, Dict
from datetime import date, timedelta
import frontmatter
import yaml

from .domain import Domain, Branch, DomainStatus
from .book import Book
from .daily_log import DailyLog

class Vault:
    def __init__(self, vault_path: Path):
        self.vault_path = Path(vault_path)
        self._domain_cache: Dict[str, Domain] = {}
        self._log_cache: List[DailyLog] = []
    
    def load_all_domains(self, use_cache: bool = True) -> List[Domain]:
        """Load all domain profiles from vault."""
        if use_cache and self._domain_cache:
            return list(self._domain_cache.values())
        
        domains = []
        domains_dir = self.vault_path / "02-Domains"
        
        for branch_dir in domains_dir.iterdir():
            if not branch_dir.is_dir():
                continue
            
            for domain_file in branch_dir.glob("*.md"):
                if domain_file.name.startswith("_"):
                    continue
                
                try:
                    domain = Domain.from_file(domain_file)
                    domain.filepath = domain_file
                    domains.append(domain)
                    self._domain_cache[domain.domain_id] = domain
                except Exception as e:
                    print(f"Error loading {domain_file}: {e}")
        
        return domains
    
    def get_domain(self, domain_id: str) -> Optional[Domain]:
        """Get a specific domain by ID."""
        if domain_id in self._domain_cache:
            return self._domain_cache[domain_id]
        
        self.load_all_domains()
        return self._domain_cache.get(domain_id)
    
    def save_domain(self, domain: Domain):
        """Save domain back to its file."""
        if not hasattr(domain, 'filepath') or not domain.filepath:
            raise ValueError("Domain has no filepath")
        
        post = frontmatter.load(domain.filepath)
        post.metadata.update(domain.to_frontmatter())
        post.metadata['date_modified'] = str(date.today())
        
        with open(domain.filepath, 'w') as f:
            f.write(frontmatter.dumps(post))
        
        self._domain_cache[domain.domain_id] = domain
    
    def load_branches(self) -> List[Branch]:
        """Load all branches with their domains."""
        domains = self.load_all_domains()
        
        branches_dict = {}
        for domain in domains:
            if domain.branch_id not in branches_dict:
                branches_dict[domain.branch_id] = Branch(
                    branch_id=domain.branch_id,
                    branch_name=domain.branch_name,
                    domains=[]
                )
            branches_dict[domain.branch_id].domains.append(domain)
        
        return list(branches_dict.values())
    
    def load_recent_logs(self, days: int = 30) -> List[DailyLog]:
        """Load daily logs from the last N days."""
        logs = []
        logs_dir = self.vault_path / "01-Daily-Logs"
        
        cutoff = date.today() - timedelta(days=days)
        
        for log_file in logs_dir.glob("*.md"):
            try:
                log_date = date.fromisoformat(log_file.stem)
                if log_date >= cutoff:
                    log = DailyLog.from_file(log_file)
                    logs.append(log)
            except (ValueError, Exception) as e:
                continue
        
        return sorted(logs, key=lambda x: x.log_date, reverse=True)
    
    def load_all_books(self) -> List[Book]:
        """Load all book notes."""
        books = []
        books_dir = self.vault_path / "03-Books"
        
        for book_file in books_dir.glob("*.md"):
            try:
                book = Book.from_file(book_file)
                books.append(book)
            except Exception as e:
                continue
        
        return books
    
    def load_isomorphisms(self) -> List[dict]:
        """Load all isomorphism files."""
        isomorphisms = []
        iso_dir = self.vault_path / "04-Isomorphisms"
        
        for iso_file in iso_dir.glob("*.md"):
            try:
                post = frontmatter.load(iso_file)
                isomorphisms.append({
                    'concept_name': post.metadata.get('concept_name'),
                    'domains': post.metadata.get('domains', []),
                    'filepath': iso_file,
                })
            except Exception:
                continue
        
        return isomorphisms
    
    def get_domain_statistics(self) -> dict:
        """Get aggregate statistics about domains."""
        domains = self.load_all_domains()
        
        status_counts = {}
        for status in DomainStatus:
            status_counts[status.value] = sum(1 for d in domains if d.status == status)
        
        branch_coverage = {}
        for branch in self.load_branches():
            touched = sum(1 for d in branch.domains if d.status != DomainStatus.UNTOUCHED)
            branch_coverage[branch.branch_name] = {
                'touched': touched,
                'total': len(branch.domains),
                'pct': touched / len(branch.domains) * 100 if branch.domains else 0
            }
        
        return {
            'total_domains': len(domains),
            'status_counts': status_counts,
            'branch_coverage': branch_coverage,
            'total_books': sum(d.books_read for d in domains),
            'hub_completion': self._get_hub_completion(domains),
        }
    
    def _get_hub_completion(self, domains: List[Domain]) -> dict:
        """Get hub domain completion status."""
        hubs = [d for d in domains if d.is_hub]
        return {
            'total': len(hubs),
            'complete': sum(1 for h in hubs if h.books_read >= 4),
            'details': {h.domain_name: h.books_read for h in hubs}
        }
```

---

*End of Part 3. Continue to SPEC-04-DATA-FILES.md*
