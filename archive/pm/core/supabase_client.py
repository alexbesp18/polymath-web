"""Supabase client wrapper for Polymath Engine.

Provides database access for CLI and web app.
Falls back to file-based storage if Supabase is unavailable.
"""

import os
from datetime import date
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv


class SupabaseClient:
    """Wrapper for Supabase database operations."""

    def __init__(self, load_env: bool = True):
        """Initialize Supabase client from environment variables.

        Args:
            load_env: If True, load .env file. Set False for testing.
        """
        # Check for testing mode - if PM_TESTING is set, don't use Supabase
        if os.getenv("PM_TESTING"):
            self._url = None
            self._key = None
            self._schema = "polymath"
            self._client = None
            self._connected = False
            return

        # Load .env if requested and not already loaded
        if load_env:
            env_paths = [
                Path.cwd() / ".env",
                Path.home() / ".polymath" / "supabase.env",
            ]
            for env_path in env_paths:
                if env_path.exists():
                    load_dotenv(env_path, override=False)
                    break

        self._url = os.getenv("SUPABASE_URL")
        self._key = os.getenv("SUPABASE_ANON_KEY")
        self._schema = os.getenv("SUPABASE_SCHEMA", "polymath")
        self._client = None
        self._connected = False

    @property
    def is_available(self) -> bool:
        """Check if Supabase credentials are configured."""
        return bool(self._url and self._key)

    def connect(self) -> bool:
        """Establish connection to Supabase.

        Returns:
            True if connected successfully, False otherwise.
        """
        if not self.is_available:
            return False

        if self._connected:
            return True

        try:
            from supabase import create_client

            self._client = create_client(self._url, self._key)
            self._connected = True
            return True
        except Exception as e:
            print(f"Warning: Failed to connect to Supabase: {e}")
            self._connected = False
            return False

    def _table(self, name: str):
        """Get a table reference with schema prefix."""
        if not self._connected:
            self.connect()
        return self._client.schema(self._schema).table(name)

    # === Domain operations ===

    def get_all_domains(self) -> list[dict]:
        """Get all domains with their progress."""
        if not self.connect():
            return []

        # Join domains with domain_progress
        domains = self._table("domains").select("*").execute()
        progress = self._table("domain_progress").select("*").execute()

        # Merge progress into domains
        progress_map = {p["domain_id"]: p for p in progress.data}
        result = []
        for d in domains.data:
            p = progress_map.get(d["domain_id"], {})
            result.append({
                **d,
                "status": p.get("status", "untouched"),
                "books_read": p.get("books_read", 0),
                "last_read": p.get("last_read"),
            })
        return result

    def get_domain(self, domain_id: str) -> Optional[dict]:
        """Get a single domain with progress."""
        if not self.connect():
            return None

        domain = (
            self._table("domains")
            .select("*")
            .eq("domain_id", domain_id)
            .single()
            .execute()
        )
        progress = (
            self._table("domain_progress")
            .select("*")
            .eq("domain_id", domain_id)
            .maybe_single()
            .execute()
        )

        if not domain.data:
            return None

        p = progress.data or {}
        return {
            **domain.data,
            "status": p.get("status", "untouched"),
            "books_read": p.get("books_read", 0),
            "last_read": p.get("last_read"),
        }

    def update_domain_progress(
        self,
        domain_id: str,
        status: str,
        books_read: int,
        last_read: Optional[date] = None,
    ) -> bool:
        """Update domain progress (upsert)."""
        if not self.connect():
            return False

        data = {
            "domain_id": domain_id,
            "status": status,
            "books_read": books_read,
            "last_read": last_read.isoformat() if last_read else None,
        }

        self._table("domain_progress").upsert(data).execute()
        return True

    # === Book operations ===

    def get_books(self, domain_id: Optional[str] = None) -> list[dict]:
        """Get all books, optionally filtered by domain."""
        if not self.connect():
            return []

        query = self._table("books").select("*")
        if domain_id:
            query = query.eq("domain_id", domain_id)

        result = query.order("created_at", desc=True).execute()
        return result.data

    def create_book(self, book_data: dict) -> Optional[dict]:
        """Create a new book record."""
        if not self.connect():
            return None

        result = self._table("books").insert(book_data).execute()
        return result.data[0] if result.data else None

    def get_book_by_title(self, title: str, domain_id: str) -> Optional[dict]:
        """Find a book by title and domain."""
        if not self.connect():
            return None

        result = (
            self._table("books")
            .select("*")
            .eq("title", title)
            .eq("domain_id", domain_id)
            .maybe_single()
            .execute()
        )
        return result.data

    # === Daily log operations ===

    def get_daily_logs(self, days: int = 30) -> list[dict]:
        """Get recent daily logs."""
        if not self.connect():
            return []

        from datetime import timedelta

        since = (date.today() - timedelta(days=days)).isoformat()

        result = (
            self._table("daily_logs")
            .select("*")
            .gte("log_date", since)
            .order("log_date", desc=True)
            .execute()
        )
        return result.data

    def get_daily_log(self, log_date: date) -> Optional[dict]:
        """Get a daily log by date."""
        if not self.connect():
            return None

        result = (
            self._table("daily_logs")
            .select("*")
            .eq("log_date", log_date.isoformat())
            .maybe_single()
            .execute()
        )
        return result.data

    def create_daily_log(self, log_data: dict) -> Optional[dict]:
        """Create a new daily log."""
        if not self.connect():
            return None

        result = self._table("daily_logs").insert(log_data).execute()
        return result.data[0] if result.data else None

    # === Config operations ===

    def get_config(self) -> Optional[dict]:
        """Get the singleton config row."""
        if not self.connect():
            return None

        result = (
            self._table("config")
            .select("*")
            .eq("id", 1)
            .maybe_single()
            .execute()
        )
        return result.data

    def update_config(self, config_data: dict) -> bool:
        """Update config."""
        if not self.connect():
            return False

        config_data["id"] = 1
        self._table("config").upsert(config_data).execute()
        return True

    # === Branch distance operations ===

    def get_branch_distance(self, branch_a: str, branch_b: str) -> int:
        """Get distance between two branches."""
        if not self.connect():
            return 4  # Default to max distance

        # Try both orderings
        result = (
            self._table("branch_distances")
            .select("distance")
            .eq("branch_a", branch_a)
            .eq("branch_b", branch_b)
            .maybe_single()
            .execute()
        )

        if result.data:
            return result.data["distance"]

        # Try reverse
        result = (
            self._table("branch_distances")
            .select("distance")
            .eq("branch_a", branch_b)
            .eq("branch_b", branch_a)
            .maybe_single()
            .execute()
        )

        return result.data["distance"] if result.data else 4

    # === Statistics ===

    def get_stats(self) -> dict:
        """Get aggregate statistics."""
        if not self.connect():
            return {}

        # Domain counts by status
        progress = self._table("domain_progress").select("status").execute()
        status_counts = {}
        for p in progress.data:
            s = p["status"]
            status_counts[s] = status_counts.get(s, 0) + 1

        # Total books
        books = self._table("books").select("id", count="exact").execute()

        # Total logs
        logs = self._table("daily_logs").select("id", count="exact").execute()

        # Branches touched
        domains_with_progress = (
            self._table("domain_progress")
            .select("domain_id")
            .neq("status", "untouched")
            .execute()
        )
        branches = set()
        for d in domains_with_progress.data:
            branches.add(d["domain_id"].split(".")[0])

        return {
            "total_domains": 180,
            "domains_touched": sum(status_counts.values()),
            "domains_surveying": status_counts.get("surveying", 0),
            "domains_surveyed": status_counts.get("surveyed", 0),
            "domains_deepening": status_counts.get("deepening", 0),
            "domains_expert": status_counts.get("expert", 0),
            "total_books_read": books.count if books.count else len(books.data),
            "total_daily_logs": logs.count if logs.count else len(logs.data),
            "branches_touched": len(branches),
        }


# Singleton instance
_client: Optional[SupabaseClient] = None


def get_supabase_client(load_env: bool = True) -> SupabaseClient:
    """Get the singleton Supabase client instance.

    Args:
        load_env: If True, load .env file when creating new client.

    Returns:
        SupabaseClient instance.
    """
    global _client
    if _client is None:
        _client = SupabaseClient(load_env=load_env)
    return _client


def reset_supabase_client() -> None:
    """Reset the singleton client. Use for testing."""
    global _client
    _client = None
