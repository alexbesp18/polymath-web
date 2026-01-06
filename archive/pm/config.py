"""Configuration management for Polymath Engine."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import yaml

from .core.errors import ConfigurationError


@dataclass
class UserConfig:
    """User-specific configuration."""

    name: str
    expert_domains: List[str] = field(default_factory=list)
    moderate_domains: List[str] = field(default_factory=list)


@dataclass
class TraversalConfig:
    """Traversal strategy configuration."""

    current_phase: str = "hub_completion"  # hub_completion | problem_driven | bisociation
    hub_target_books: int = 4
    min_branch_diversity_window: int = 28  # days
    max_domain_repeat_window: int = 14  # days
    bisociation_min_distance: int = 3


@dataclass
class Config:
    """Main configuration for Polymath Engine."""

    vault_path: Path
    user: UserConfig
    traversal: TraversalConfig

    @classmethod
    def load(cls, config_path: Optional[Path] = None) -> "Config":
        """Load configuration from YAML file."""
        if config_path is None:
            config_path = Path.home() / ".polymath" / "config.yaml"

        if not config_path.exists():
            raise ConfigurationError(
                f"Config file not found at {config_path}. Run 'pm-init' first."
            )

        with open(config_path) as f:
            data = yaml.safe_load(f)

        if not data:
            raise ConfigurationError(f"Empty config file: {config_path}")

        vault_path = Path(data.get("vault", {}).get("path", ""))
        if not vault_path:
            raise ConfigurationError("vault.path not set in config")

        user_data = data.get("user", {})
        user = UserConfig(
            name=user_data.get("name", "User"),
            expert_domains=user_data.get("expert_domains", []),
            moderate_domains=user_data.get("moderate_domains", []),
        )

        traversal_data = data.get("traversal", {})
        traversal = TraversalConfig(
            current_phase=traversal_data.get("current_phase", "hub_completion"),
            hub_target_books=traversal_data.get("hub_target_books", 4),
            min_branch_diversity_window=traversal_data.get("min_branch_diversity_window", 28),
            max_domain_repeat_window=traversal_data.get("max_domain_repeat_window", 14),
            bisociation_min_distance=traversal_data.get("bisociation_min_distance", 3),
        )

        return cls(vault_path=vault_path, user=user, traversal=traversal)

    def save(self, config_path: Optional[Path] = None) -> None:
        """Save configuration to YAML file."""
        if config_path is None:
            config_path = Path.home() / ".polymath" / "config.yaml"

        config_path.parent.mkdir(parents=True, exist_ok=True)

        data = {
            "vault": {"path": str(self.vault_path)},
            "user": {
                "name": self.user.name,
                "expert_domains": self.user.expert_domains,
                "moderate_domains": self.user.moderate_domains,
            },
            "traversal": {
                "current_phase": self.traversal.current_phase,
                "hub_target_books": self.traversal.hub_target_books,
                "min_branch_diversity_window": self.traversal.min_branch_diversity_window,
                "max_domain_repeat_window": self.traversal.max_domain_repeat_window,
                "bisociation_min_distance": self.traversal.bisociation_min_distance,
            },
        }

        with open(config_path, "w") as f:
            yaml.dump(data, f, default_flow_style=False, sort_keys=False)

    @classmethod
    def create_default(cls, vault_path: Path) -> "Config":
        """Create a default configuration for a new vault."""
        return cls(
            vault_path=vault_path,
            user=UserConfig(
                name="Alex",
                expert_domains=["07.08", "07.09", "07.10", "05.05", "09.04"],
                moderate_domains=["05.01", "05.02", "03.04", "03.07", "03.09", "03.10"],
            ),
            traversal=TraversalConfig(),
        )
