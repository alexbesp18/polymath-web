"""Book model for Polymath Engine."""

from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Optional

import frontmatter


@dataclass
class Book:
    """A book note in the Polymath vault."""

    title: str
    author: str
    year: Optional[int]
    domain_id: str
    domain_name: str
    function_slot: str
    status: str = "queued"  # queued | reading | completed | abandoned
    date_started: Optional[date] = None
    date_finished: Optional[date] = None
    rating: Optional[int] = None
    pages: Optional[int] = None
    filepath: Optional[Path] = None

    @classmethod
    def from_file(cls, filepath: Path) -> "Book":
        """Load book from Obsidian markdown file."""
        post = frontmatter.load(filepath)
        m = post.metadata

        date_started = m.get("date_started")
        if date_started and isinstance(date_started, str):
            try:
                date_started = date.fromisoformat(date_started)
            except ValueError:
                date_started = None

        date_finished = m.get("date_finished")
        if date_finished and isinstance(date_finished, str):
            try:
                date_finished = date.fromisoformat(date_finished)
            except ValueError:
                date_finished = None

        return cls(
            title=m.get("title", ""),
            author=m.get("author", ""),
            year=m.get("year"),
            domain_id=m.get("domain_id", ""),
            domain_name=m.get("domain", ""),
            function_slot=m.get("function_slot", ""),
            status=m.get("status", "queued"),
            date_started=date_started,
            date_finished=date_finished,
            rating=m.get("rating"),
            pages=m.get("pages"),
            filepath=filepath,
        )

    def to_frontmatter(self) -> dict:
        """Convert to frontmatter dict."""
        return {
            "title": self.title,
            "author": self.author,
            "year": self.year,
            "domain_id": self.domain_id,
            "domain": self.domain_name,
            "function_slot": self.function_slot,
            "status": self.status,
            "date_started": self.date_started.isoformat() if self.date_started else None,
            "date_finished": self.date_finished.isoformat() if self.date_finished else None,
            "rating": self.rating,
            "pages": self.pages,
        }

    @property
    def filename(self) -> str:
        """Generate standard filename for the book."""
        # Get last name from author
        safe_author = self.author.split(",")[0].split()[-1] if self.author else "Unknown"
        # Truncate and clean title
        safe_title = self.title[:30].replace(" ", "-").replace(":", "").replace("/", "-")
        return f"{safe_author}-{safe_title}.md"

    @property
    def is_complete(self) -> bool:
        """Check if book is marked as completed."""
        return self.status == "completed"
