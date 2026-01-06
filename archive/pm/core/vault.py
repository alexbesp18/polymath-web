"""Vault management for Polymath Engine.

Handles all interactions with the Obsidian vault filesystem.
Optionally uses Supabase as the primary data store.
"""

from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

import frontmatter

from pm.config import Config
from pm.core.book import Book
from pm.core.daily_log import DailyLog
from pm.core.domain import Branch, Domain, DomainStatus
from pm.core.errors import (
    DomainNotFoundError,
    InvalidFrontmatterError,
    VaultNotFoundError,
)
from pm.core.supabase_client import get_supabase_client, SupabaseClient
from pm.data.domains import BRANCHES, DOMAINS, get_domain_by_id
from pm.data.templates import (
    BOOK_NOTE_TEMPLATE,
    BRANCH_OVERVIEW_TEMPLATE,
    DAILY_LOG_TEMPLATE,
    DASHBOARD_TEMPLATE,
    DOMAIN_PROFILE_TEMPLATE,
)


@dataclass
class VaultStats:
    """Statistics about the vault state."""

    total_domains: int = 180
    domains_touched: int = 0
    domains_surveying: int = 0
    domains_surveyed: int = 0
    domains_deepening: int = 0
    domains_expert: int = 0
    total_books_read: int = 0
    total_daily_logs: int = 0
    current_streak: int = 0
    branches_touched: int = 0


class Vault:
    """Manages the Obsidian vault for Polymath Engine.

    Can operate in two modes:
    - File-based: Uses Obsidian vault markdown files (original behavior)
    - Supabase: Uses Supabase database (when configured)
    """

    def __init__(self, vault_path: Path, use_supabase: bool = True):
        """Initialize vault manager.

        Args:
            vault_path: Path to the Obsidian vault root.
            use_supabase: If True, try to use Supabase; falls back to files if unavailable.
        """
        self.vault_path = Path(vault_path).expanduser()
        self._use_supabase = use_supabase
        self._supabase: Optional[SupabaseClient] = None

        if use_supabase:
            self._supabase = get_supabase_client()
            if not self._supabase.is_available:
                self._use_supabase = False
                self._supabase = None

    @property
    def using_supabase(self) -> bool:
        """Check if Supabase is being used."""
        return self._use_supabase and self._supabase is not None

    @classmethod
    def from_config(cls, config: Config, use_supabase: bool = True) -> "Vault":
        """Create Vault from config.

        Args:
            config: Configuration with vault_path.
            use_supabase: If True, try to use Supabase backend.

        Returns:
            Vault instance.
        """
        return cls(config.vault_path, use_supabase=use_supabase)

    def exists(self) -> bool:
        """Check if vault exists."""
        return self.vault_path.exists()

    def validate(self) -> None:
        """Validate vault exists and has required structure.

        Raises:
            VaultNotFoundError: If vault doesn't exist.
        """
        if not self.exists():
            raise VaultNotFoundError(str(self.vault_path))

    # === Path helpers ===

    @property
    def system_dir(self) -> Path:
        return self.vault_path / "00-System"

    @property
    def templates_dir(self) -> Path:
        return self.system_dir / "Templates"

    @property
    def daily_logs_dir(self) -> Path:
        return self.vault_path / "01-Daily-Logs"

    @property
    def domains_dir(self) -> Path:
        return self.vault_path / "02-Domains"

    @property
    def books_dir(self) -> Path:
        return self.vault_path / "03-Books"

    @property
    def isomorphisms_dir(self) -> Path:
        return self.vault_path / "04-Isomorphisms"

    @property
    def bridges_dir(self) -> Path:
        return self.vault_path / "05-Bridges"

    @property
    def blind_spots_dir(self) -> Path:
        return self.vault_path / "06-Blind-Spots"

    @property
    def problems_dir(self) -> Path:
        return self.vault_path / "07-Problems"

    @property
    def weekly_synthesis_dir(self) -> Path:
        return self.vault_path / "08-Weekly-Synthesis"

    @property
    def production_dir(self) -> Path:
        return self.vault_path / "09-Production"

    @property
    def archive_dir(self) -> Path:
        return self.vault_path / "99-Archive"

    def branch_dir(self, branch_id: str) -> Path:
        """Get directory for a branch."""
        branch_id_str = str(branch_id).zfill(2)
        branch_id_int = int(branch_id)
        for b in BRANCHES:
            if b["branch_id"] == branch_id_int:
                folder_name = f"{branch_id_str}-{b['branch_name'].replace(' ', '-')}"
                return self.domains_dir / folder_name
        return self.domains_dir / f"{branch_id_str}-Unknown"

    def domain_filepath(self, domain_id: str) -> Path:
        """Get filepath for a domain profile."""
        branch_id = domain_id.split(".")[0].zfill(2)
        domain_data = get_domain_by_id(domain_id)
        if domain_data:
            filename = f"{domain_id}-{domain_data['domain_name'].replace(' ', '-').replace('/', '-')}.md"
        else:
            filename = f"{domain_id}.md"
        return self.branch_dir(branch_id) / filename

    # === Directory creation ===

    def create_structure(self) -> None:
        """Create the full vault directory structure."""
        # Create all main directories
        dirs_to_create = [
            self.system_dir,
            self.templates_dir,
            self.daily_logs_dir,
            self.domains_dir,
            self.books_dir,
            self.isomorphisms_dir,
            self.bridges_dir,
            self.blind_spots_dir,
            self.problems_dir,
            self.weekly_synthesis_dir,
            self.production_dir / "Ideas",
            self.production_dir / "Drafts",
            self.production_dir / "Published",
            self.archive_dir,
        ]

        for d in dirs_to_create:
            d.mkdir(parents=True, exist_ok=True)

        # Create branch directories
        for branch in BRANCHES:
            branch_id_str = str(branch["branch_id"]).zfill(2)
            folder_name = f"{branch_id_str}-{branch['branch_name'].replace(' ', '-')}"
            (self.domains_dir / folder_name).mkdir(parents=True, exist_ok=True)

    # === Domain operations ===

    def load_domain(self, domain_id: str) -> Domain:
        """Load a domain from its profile file or Supabase.

        Args:
            domain_id: Domain ID (e.g., "02.04")

        Returns:
            Domain object.

        Raises:
            DomainNotFoundError: If domain doesn't exist.
        """
        # Try Supabase first
        if self.using_supabase:
            data = self._supabase.get_domain(domain_id)
            if data:
                return Domain(
                    domain_id=data["domain_id"],
                    domain_name=data["name"],
                    branch_id=int(data["branch_id"]),
                    branch_name=self._get_branch_name(data["branch_id"]),
                    description=data.get("description", ""),
                    is_hub=data.get("is_hub", False),
                    is_expert=data.get("is_expert", False),
                    status=DomainStatus(data.get("status", "untouched")),
                    books_read=data.get("books_read", 0),
                    last_read=date.fromisoformat(data["last_read"]) if data.get("last_read") else None,
                )

        # Fall back to file
        filepath = self.domain_filepath(domain_id)
        if not filepath.exists():
            raise DomainNotFoundError(domain_id)

        return Domain.from_file(filepath)

    def _get_branch_name(self, branch_id: str) -> str:
        """Get branch name from branch ID."""
        for b in BRANCHES:
            if str(b["branch_id"]).zfill(2) == branch_id.zfill(2):
                return b["branch_name"]
        return "Unknown"

    def save_domain(self, domain: Domain) -> None:
        """Save a domain to Supabase and/or profile file.

        Args:
            domain: Domain object to save.
        """
        # Save to Supabase if available
        if self.using_supabase:
            self._supabase.update_domain_progress(
                domain_id=domain.domain_id,
                status=domain.status.value,
                books_read=domain.books_read,
                last_read=domain.last_read,
            )

        # Also save to file for Obsidian compatibility
        filepath = self.domain_filepath(domain.domain_id)

        # Load existing file to preserve content
        if filepath.exists():
            post = frontmatter.load(filepath)
        else:
            post = frontmatter.Post("")

        # Update frontmatter
        post.metadata.update(domain.to_frontmatter())
        post.metadata["date_modified"] = date.today().isoformat()

        # Write back
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w") as f:
            f.write(frontmatter.dumps(post))

    def load_all_domains(self) -> list[Domain]:
        """Load all domains from Supabase or the vault.

        Returns:
            List of Domain objects.
        """
        # Try Supabase first
        if self.using_supabase:
            data_list = self._supabase.get_all_domains()
            if data_list:
                domains = []
                for data in data_list:
                    domains.append(
                        Domain(
                            domain_id=data["domain_id"],
                            domain_name=data["name"],
                            branch_id=int(data["branch_id"]),
                            branch_name=self._get_branch_name(data["branch_id"]),
                            description=data.get("description", ""),
                            is_hub=data.get("is_hub", False),
                            is_expert=data.get("is_expert", False),
                            status=DomainStatus(data.get("status", "untouched")),
                            books_read=data.get("books_read", 0),
                            last_read=date.fromisoformat(data["last_read"]) if data.get("last_read") else None,
                        )
                    )
                return domains

        # Fall back to file-based loading
        domains = []
        for domain_data in DOMAINS:
            domain_id = domain_data["domain_id"]
            try:
                domain = self.load_domain(domain_id)
                domains.append(domain)
            except DomainNotFoundError:
                # Domain file doesn't exist yet, create from data
                domains.append(
                    Domain(
                        domain_id=domain_id,
                        domain_name=domain_data["domain_name"],
                        branch_id=domain_data["branch_id"],
                        branch_name=domain_data["branch_name"],
                        description=domain_data.get("description", ""),
                        is_hub=domain_data.get("is_hub", False),
                        is_expert=domain_data.get("is_expert", False),
                    )
                )
        return domains

    def get_domains_by_status(self, status: DomainStatus) -> list[Domain]:
        """Get all domains with a specific status.

        Args:
            status: The status to filter by.

        Returns:
            List of matching Domain objects.
        """
        all_domains = self.load_all_domains()
        return [d for d in all_domains if d.status == status]

    def get_hub_domains(self) -> list[Domain]:
        """Get all hub domains.

        Returns:
            List of hub Domain objects.
        """
        all_domains = self.load_all_domains()
        return [d for d in all_domains if d.is_hub]

    def get_expert_domains(self) -> list[Domain]:
        """Get all expert domains (user's areas of expertise).

        Returns:
            List of expert Domain objects.
        """
        all_domains = self.load_all_domains()
        return [d for d in all_domains if d.is_expert]

    # === Daily log operations ===

    def load_daily_log(self, log_date: date) -> Optional[DailyLog]:
        """Load a daily log by date.

        Args:
            log_date: The date of the log.

        Returns:
            DailyLog object or None if not found.
        """
        filename = f"{log_date.isoformat()}.md"
        filepath = self.daily_logs_dir / filename
        if not filepath.exists():
            return None
        return DailyLog.from_file(filepath)

    def save_daily_log(self, log: DailyLog, content: str = "") -> Path:
        """Save a daily log to Supabase and/or file.

        Args:
            log: DailyLog object to save.
            content: Optional markdown content to include.

        Returns:
            Path to the saved file.
        """
        # Save to Supabase if available
        if self.using_supabase:
            log_data = {
                "log_date": log.log_date.isoformat(),
                "domain_id": log.domain_id,
                "function_slot": log.function_slot,
                "pages_read": log.pages_read,
                "reading_time_minutes": log.reading_time_minutes,
                "phase": log.phase,
                "raw_notes": content if content else None,
            }
            self._supabase.create_daily_log(log_data)

        # Also save to file for Obsidian compatibility
        filepath = self.daily_logs_dir / log.filename
        self.daily_logs_dir.mkdir(parents=True, exist_ok=True)

        post = frontmatter.Post(content)
        post.metadata = log.to_frontmatter()

        with open(filepath, "w") as f:
            f.write(frontmatter.dumps(post))

        return filepath

    def load_recent_logs(self, days: int = 30) -> list[DailyLog]:
        """Load recent daily logs.

        Args:
            days: Number of days to look back.

        Returns:
            List of DailyLog objects, sorted by date descending.
        """
        logs = []
        for filepath in self.daily_logs_dir.glob("*.md"):
            try:
                log = DailyLog.from_file(filepath)
                if log.log_date >= date.today() - timedelta(days=days):
                    logs.append(log)
            except (ValueError, KeyError):
                continue

        logs.sort(key=lambda x: x.log_date, reverse=True)
        return logs

    def calculate_streak(self) -> int:
        """Calculate current reading streak.

        Returns:
            Number of consecutive days with logs.
        """
        streak = 0
        current = date.today()

        while True:
            log = self.load_daily_log(current)
            if log is None:
                # Allow for one gap if today has no log yet
                if current == date.today():
                    current = current - timedelta(days=1)
                    continue
                break
            streak += 1
            current = current - timedelta(days=1)

        return streak

    # === Book operations ===

    def load_book(self, author: str, title: str) -> Optional[Book]:
        """Load a book by author and title.

        Args:
            author: Book author.
            title: Book title.

        Returns:
            Book object or None if not found.
        """
        # Try to find matching file
        for filepath in self.books_dir.glob("*.md"):
            try:
                book = Book.from_file(filepath)
                if book.author == author and book.title == title:
                    return book
            except (ValueError, KeyError):
                continue
        return None

    def save_book(self, book: Book, content: str = "") -> Path:
        """Save a book note.

        Args:
            book: Book object to save.
            content: Optional markdown content.

        Returns:
            Path to the saved file.
        """
        filepath = self.books_dir / book.filename
        self.books_dir.mkdir(parents=True, exist_ok=True)

        post = frontmatter.Post(content)
        post.metadata = book.to_frontmatter()

        with open(filepath, "w") as f:
            f.write(frontmatter.dumps(post))

        return filepath

    def list_books(self, domain_id: Optional[str] = None) -> list[Book]:
        """List all books, optionally filtered by domain.

        Args:
            domain_id: Optional domain ID to filter by.

        Returns:
            List of Book objects.
        """
        books = []
        for filepath in self.books_dir.glob("*.md"):
            try:
                book = Book.from_file(filepath)
                if domain_id is None or book.domain_id == domain_id:
                    books.append(book)
            except (ValueError, KeyError):
                continue
        return books

    # === Statistics ===

    def get_stats(self) -> VaultStats:
        """Calculate vault statistics.

        Returns:
            VaultStats object with current metrics.
        """
        stats = VaultStats()

        # Load all domains and count statuses
        domains = self.load_all_domains()
        stats.total_domains = len(domains)

        branches_with_activity = set()

        for d in domains:
            if d.status == DomainStatus.SURVEYING:
                stats.domains_surveying += 1
                stats.domains_touched += 1
                branches_with_activity.add(d.branch_id)
            elif d.status == DomainStatus.SURVEYED:
                stats.domains_surveyed += 1
                stats.domains_touched += 1
                branches_with_activity.add(d.branch_id)
            elif d.status == DomainStatus.DEEPENING:
                stats.domains_deepening += 1
                stats.domains_touched += 1
                branches_with_activity.add(d.branch_id)
            elif d.status == DomainStatus.EXPERT:
                stats.domains_expert += 1
                stats.domains_touched += 1
                branches_with_activity.add(d.branch_id)

            stats.total_books_read += d.books_read

        stats.branches_touched = len(branches_with_activity)

        # Count daily logs
        if self.daily_logs_dir.exists():
            stats.total_daily_logs = len(list(self.daily_logs_dir.glob("*.md")))

        # Calculate streak
        stats.current_streak = self.calculate_streak()

        return stats

    # === Initialization helpers ===

    def create_domain_files(self) -> int:
        """Create all 180 domain profile files.

        Returns:
            Number of files created.
        """
        count = 0
        today = date.today().isoformat()

        for domain_data in DOMAINS:
            filepath = self.domain_filepath(domain_data["domain_id"])

            if filepath.exists():
                continue

            # Get branch info for folder name
            branch_id = domain_data["branch_id"]
            branch_name = domain_data["branch_name"]
            branch_folder = f"{branch_id}-{branch_name.replace(' ', '-')}"

            # Format template
            content = DOMAIN_PROFILE_TEMPLATE.format(
                domain_id=domain_data["domain_id"],
                domain_name=domain_data["domain_name"],
                branch_id=branch_id,
                branch_name=branch_name,
                branch_folder=branch_folder,
                description=domain_data.get("description", ""),
                is_hub=str(domain_data.get("is_hub", False)).lower(),
                is_expert=str(domain_data.get("is_expert", False)).lower(),
                date_created=today,
            )

            filepath.parent.mkdir(parents=True, exist_ok=True)
            with open(filepath, "w") as f:
                f.write(content)

            count += 1

        return count

    def create_branch_overviews(self) -> int:
        """Create branch overview files.

        Returns:
            Number of files created.
        """
        count = 0

        for branch in BRANCHES:
            branch_id = branch["branch_id"]
            branch_id_str = str(branch_id).zfill(2)
            branch_name = branch["branch_name"]
            branch_folder = f"{branch_id_str}-{branch_name.replace(' ', '-')}"
            branch_dir = self.domains_dir / branch_folder
            filepath = branch_dir / "_Branch-Overview.md"

            if filepath.exists():
                continue

            # Count domains in this branch
            domain_count = sum(
                1 for d in DOMAINS if d["branch_id"] == branch_id
            )

            content = BRANCH_OVERVIEW_TEMPLATE.format(
                branch_id=branch_id_str,
                branch_name=branch_name,
                branch_folder=branch_folder,
                domain_count=domain_count,
                description=branch.get("description", ""),
            )

            branch_dir.mkdir(parents=True, exist_ok=True)
            with open(filepath, "w") as f:
                f.write(content)

            count += 1

        return count

    def create_dashboard(self) -> Path:
        """Create the main dashboard file.

        Returns:
            Path to the created file.
        """
        filepath = self.system_dir / "Dashboard.md"

        if not filepath.exists():
            self.system_dir.mkdir(parents=True, exist_ok=True)
            with open(filepath, "w") as f:
                f.write(DASHBOARD_TEMPLATE)

        return filepath

    def create_system_files(self) -> None:
        """Create all system index files."""
        self.create_dashboard()

        # Create other system files
        system_files = {
            "Domain-Index.md": "# Domain Index\n\nSee [[02-Domains/]]",
            "Branch-Index.md": "# Branch Index\n\nSee [[02-Domains/]]",
            "Reading-Queue.md": "# Reading Queue\n\n",
            "Hub-Tracker.md": "# Hub Tracker\n\n",
            "Problem-Index.md": "# Problem Index\n\nSee [[07-Problems/]]",
        }

        for filename, content in system_files.items():
            filepath = self.system_dir / filename
            if not filepath.exists():
                with open(filepath, "w") as f:
                    f.write(content)
