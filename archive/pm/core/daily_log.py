"""Daily log model for Polymath Engine."""

from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import List, Optional

import frontmatter


@dataclass
class Mechanism:
    """A mechanism extracted from reading."""

    name: str
    description: str
    conditions: str = ""


@dataclass
class Connection:
    """A connection to another domain."""

    target_domain: str
    how: str
    strength: str = "moderate"  # strong | moderate | weak


@dataclass
class DailyLog:
    """A daily reading log entry."""

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
    filepath: Optional[Path] = None

    @classmethod
    def from_file(cls, filepath: Path) -> "DailyLog":
        """Load daily log from Obsidian markdown file."""
        post = frontmatter.load(filepath)
        m = post.metadata

        log_date_str = m.get("date")
        if log_date_str:
            if isinstance(log_date_str, str):
                try:
                    log_date = date.fromisoformat(log_date_str)
                except ValueError:
                    log_date = date.today()
            elif isinstance(log_date_str, date):
                log_date = log_date_str
            else:
                log_date = date.today()
        else:
            # Try to parse from filename
            try:
                log_date = date.fromisoformat(filepath.stem)
            except ValueError:
                log_date = date.today()

        return cls(
            log_date=log_date,
            domain_id=m.get("domain_id", ""),
            domain_name=m.get("domain", ""),
            book_title=m.get("book", ""),
            function_slot=m.get("function_slot", ""),
            pages_read=m.get("pages_read", 0),
            reading_time_minutes=m.get("reading_time_minutes", 0),
            phase=m.get("phase", ""),
            bisociation_partner=m.get("bisociation_partner", ""),
            filepath=filepath,
        )

    def to_frontmatter(self) -> dict:
        """Convert to frontmatter dict."""
        return {
            "date": self.log_date.isoformat(),
            "domain_id": self.domain_id,
            "domain": self.domain_name,
            "book": self.book_title,
            "function_slot": self.function_slot,
            "pages_read": self.pages_read,
            "reading_time_minutes": self.reading_time_minutes,
            "phase": self.phase,
            "bisociation_partner": self.bisociation_partner,
        }

    @property
    def filename(self) -> str:
        """Generate filename for the log."""
        return f"{self.log_date.isoformat()}.md"
