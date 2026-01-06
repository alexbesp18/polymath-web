"""Domain and Branch models for Polymath Engine."""

from dataclasses import dataclass, field
from datetime import date
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional

import frontmatter


class DomainStatus(Enum):
    """Status of domain exploration."""

    UNTOUCHED = "untouched"
    SURVEYING = "surveying"
    SURVEYED = "surveyed"
    DEEPENING = "deepening"
    SPECIALIZED = "specialized"
    EXPERT = "expert"


class FunctionSlot(Enum):
    """Function slots for domain books."""

    FOUNDATION = "FND"
    ORTHODOXY = "ORT"
    HERESY = "HRS"
    FRONTIER = "FRN"
    HISTORY = "HST"
    BRIDGE = "BRG"


@dataclass
class FunctionSlotStatus:
    """Status of a function slot within a domain."""

    slot: FunctionSlot
    status: str = "not_started"  # not_started | in_progress | complete
    books: List[str] = field(default_factory=list)


@dataclass
class Domain:
    """A knowledge domain in the polymath taxonomy."""

    domain_id: str
    domain_name: str
    branch_id: str
    branch_name: str
    description: str = ""
    status: DomainStatus = DomainStatus.UNTOUCHED
    is_hub: bool = False
    is_expert: bool = False
    books_read: int = 0
    last_read: Optional[date] = None
    function_slots: Dict[FunctionSlot, FunctionSlotStatus] = field(default_factory=dict)
    subtopics: List[Dict] = field(default_factory=list)
    filepath: Optional[Path] = None

    @classmethod
    def from_file(cls, filepath: Path) -> "Domain":
        """Load domain from Obsidian markdown file."""
        post = frontmatter.load(filepath)

        status_str = post.metadata.get("status", "untouched")
        try:
            status = DomainStatus(status_str)
        except ValueError:
            status = DomainStatus.UNTOUCHED

        last_read = post.metadata.get("last_read")
        if last_read and isinstance(last_read, str):
            try:
                last_read = date.fromisoformat(last_read)
            except ValueError:
                last_read = None

        return cls(
            domain_id=post.metadata.get("domain_id", ""),
            domain_name=post.metadata.get("domain_name", ""),
            branch_id=post.metadata.get("branch_id", ""),
            branch_name=post.metadata.get("branch_name", ""),
            description=post.metadata.get("description", ""),
            status=status,
            is_hub=post.metadata.get("is_hub", False),
            is_expert=post.metadata.get("is_expert", False),
            books_read=post.metadata.get("books_read", 0),
            last_read=last_read,
            filepath=filepath,
        )

    def to_frontmatter(self) -> dict:
        """Convert to frontmatter dict."""
        return {
            "domain_id": self.domain_id,
            "domain_name": self.domain_name,
            "branch_id": self.branch_id,
            "branch_name": self.branch_name,
            "description": self.description,
            "status": self.status.value,
            "is_hub": self.is_hub,
            "is_expert": self.is_expert,
            "books_read": self.books_read,
            "last_read": self.last_read.isoformat() if self.last_read else None,
        }

    @property
    def branch_number(self) -> int:
        """Get branch number as integer."""
        return int(self.branch_id)

    def days_since_read(self) -> Optional[int]:
        """Days since last read, or None if never read."""
        if self.last_read is None:
            return None
        return (date.today() - self.last_read).days

    def next_slot(self) -> str:
        """Determine next function slot to fill based on books read."""
        slots = ["FND", "HRS", "ORT", "FRN", "HST", "BRG"]
        return slots[min(self.books_read, 5)]


@dataclass
class Branch:
    """A branch of knowledge containing multiple domains."""

    branch_id: str
    branch_name: str
    domains: List[Domain] = field(default_factory=list)

    @property
    def domain_count(self) -> int:
        """Total number of domains in branch."""
        return len(self.domains)

    @property
    def touched_count(self) -> int:
        """Number of domains that have been touched (not untouched)."""
        return sum(1 for d in self.domains if d.status != DomainStatus.UNTOUCHED)

    @property
    def coverage_pct(self) -> float:
        """Percentage of domains touched."""
        if self.domain_count == 0:
            return 0.0
        return self.touched_count / self.domain_count * 100

    @property
    def total_books_read(self) -> int:
        """Total books read across all domains in branch."""
        return sum(d.books_read for d in self.domains)
