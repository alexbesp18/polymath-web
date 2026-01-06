"""Traversal engine for Polymath Engine.

Implements the recommendation logic for what to read next.
"""

from dataclasses import dataclass
from datetime import date, timedelta
from enum import Enum
from typing import Optional

from pm.config import TraversalConfig
from pm.core.domain import Domain, DomainStatus, FunctionSlot
from pm.data.distances import get_branch_distance


class TraversalPhase(Enum):
    """Current phase of the traversal strategy."""

    HUB_COMPLETION = "hub-completion"
    PROBLEM_DRIVEN = "problem-driven"
    BISOCIATION = "bisociation"


@dataclass
class TraversalRecommendation:
    """A reading recommendation from the traversal engine."""

    domain: Domain
    slot: FunctionSlot
    reason: str
    phase: TraversalPhase
    is_distant_interleave: bool = False
    distance_from_strength: int = 0
    priority: int = 0  # Lower is higher priority


class TraversalEngine:
    """Engine for generating reading recommendations."""

    def __init__(self, config: TraversalConfig):
        """Initialize traversal engine.

        Args:
            config: Traversal configuration.
        """
        self.config = config
        self.current_phase = TraversalPhase.HUB_COMPLETION
        # Normalize config field names
        self.books_per_hub = getattr(config, 'hub_target_books', 4)
        self.cooldown_days = getattr(config, 'max_domain_repeat_window', 14)
        self.min_distant_distance = getattr(config, 'bisociation_min_distance', 3)
        self.distant_interleave_day = 6  # Sunday by default

    def recommend_next(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
        week_day: int = 0,
    ) -> Optional[TraversalRecommendation]:
        """Get the next reading recommendation.

        Args:
            domains: All domains from the vault.
            recent_domain_ids: Domain IDs read in last N days.
            week_day: Day of the week (0=Monday, 6=Sunday).

        Returns:
            TraversalRecommendation or None if no recommendation.
        """
        if self.current_phase == TraversalPhase.HUB_COMPLETION:
            return self._recommend_hub_completion(domains, recent_domain_ids, week_day)
        elif self.current_phase == TraversalPhase.PROBLEM_DRIVEN:
            return self._recommend_problem_driven(domains, recent_domain_ids)
        else:
            return self._recommend_bisociation(domains, recent_domain_ids, week_day)

    def _recommend_hub_completion(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
        week_day: int,
    ) -> Optional[TraversalRecommendation]:
        """Recommend based on hub completion strategy.

        Logic:
        1. Prioritize incomplete hub domains
        2. Weekly interleave with distant domain (distance >= 3)
        3. Respect cooldown period for recently read domains
        """
        # Check if today should be a distant interleave day
        # Default: every 7th day is distant interleave
        is_distant_day = week_day == self.distant_interleave_day

        if is_distant_day:
            rec = self._find_distant_domain(domains, recent_domain_ids)
            if rec:
                return rec

        # Otherwise, find next hub to work on
        hub_domains = [d for d in domains if d.is_hub]

        # Filter out recently read (cooldown)
        eligible_hubs = [
            d for d in hub_domains
            if d.domain_id not in recent_domain_ids
            and d.books_read < self.books_per_hub
        ]

        if not eligible_hubs:
            # All hubs complete or on cooldown, try distant domain
            return self._find_distant_domain(domains, recent_domain_ids)

        # Prioritize by: closest to completion, then by domain_id for consistency
        eligible_hubs.sort(key=lambda d: (-d.books_read, d.domain_id))

        best_hub = eligible_hubs[0]
        slot = best_hub.next_slot()

        return TraversalRecommendation(
            domain=best_hub,
            slot=slot,
            reason=self._hub_reason(best_hub),
            phase=TraversalPhase.HUB_COMPLETION,
            is_distant_interleave=False,
            priority=0,
        )

    def _recommend_problem_driven(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
    ) -> Optional[TraversalRecommendation]:
        """Recommend based on problem-driven strategy.

        This requires active problems to be defined. Falls back to hub completion.
        """
        # TODO: Implement problem-driven logic when problems are loaded
        # For now, fall back to hub completion
        return self._recommend_hub_completion(domains, recent_domain_ids, 0)

    def _recommend_bisociation(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
        week_day: int,
    ) -> Optional[TraversalRecommendation]:
        """Recommend based on bisociation strategy.

        Weekly rhythm:
        - Days 0-2: Strength domains (expert or high books_read)
        - Days 3-5: Distant domains (max distance from strength)
        - Day 6: Synthesis day (no new reading)
        """
        if week_day == 6:
            # Synthesis day
            return None

        if week_day < 3:
            # Strength days - work on expert domains or domains with progress
            return self._find_strength_domain(domains, recent_domain_ids)
        else:
            # Distant days
            return self._find_distant_domain(domains, recent_domain_ids)

    def _find_distant_domain(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
    ) -> Optional[TraversalRecommendation]:
        """Find a domain at maximum distance from user's strength areas."""
        # Get expert/strength branches
        strength_branches = set()
        for d in domains:
            if d.is_expert or d.books_read >= 2:
                strength_branches.add(d.branch_id)

        if not strength_branches:
            # No strength areas yet, use Engineering (07) as default
            strength_branches = {"07"}

        # Find domains at max distance from all strength branches
        candidates = []
        for d in domains:
            if d.domain_id in recent_domain_ids:
                continue

            # Calculate minimum distance from any strength branch
            min_distance = min(
                get_branch_distance(d.branch_id, sb)
                for sb in strength_branches
            )

            if min_distance >= self.min_distant_distance:
                # Bonus for untouched domains
                bonus = 1 if d.status == DomainStatus.UNTOUCHED else 0
                candidates.append((d, min_distance, bonus))

        if not candidates:
            return None

        # Sort by distance desc, then bonus, then domain_id
        candidates.sort(key=lambda x: (-x[1], -x[2], x[0].domain_id))

        # Pick from top candidates (add some variety)
        best = candidates[0]
        domain = best[0]

        return TraversalRecommendation(
            domain=domain,
            slot=domain.next_slot(),
            reason=f"Distant exploration (distance {best[1]} from your strengths)",
            phase=self.current_phase,
            is_distant_interleave=True,
            distance_from_strength=best[1],
            priority=10,
        )

    def _find_strength_domain(
        self,
        domains: list[Domain],
        recent_domain_ids: list[str],
    ) -> Optional[TraversalRecommendation]:
        """Find a domain in user's strength areas to deepen."""
        # Prefer expert domains or high-progress domains
        candidates = []
        for d in domains:
            if d.domain_id in recent_domain_ids:
                continue

            if d.is_expert or d.books_read >= 2:
                candidates.append(d)

        if not candidates:
            # No strength domains yet, use hubs
            candidates = [d for d in domains if d.is_hub and d.domain_id not in recent_domain_ids]

        if not candidates:
            return None

        # Sort by books_read desc to continue deepening
        candidates.sort(key=lambda d: (-d.books_read, d.domain_id))
        best = candidates[0]

        return TraversalRecommendation(
            domain=best,
            slot=best.next_slot(),
            reason="Deepening strength area" if best.is_expert else "Continuing hub completion",
            phase=self.current_phase,
            is_distant_interleave=False,
            priority=5,
        )

    def _hub_reason(self, domain: Domain) -> str:
        """Generate reason string for hub recommendation."""
        remaining = self.books_per_hub - domain.books_read
        slot = domain.next_slot()

        if domain.books_read == 0:
            return f"Start hub domain with {slot} slot ({remaining} books to complete)"
        else:
            return f"Continue hub ({domain.books_read}/{self.books_per_hub}), next: {slot} slot"

    def set_phase(self, phase: TraversalPhase) -> None:
        """Set the current traversal phase.

        Args:
            phase: New phase to use.
        """
        self.current_phase = phase

    def check_hub_completion(self, domains: list[Domain]) -> bool:
        """Check if all hubs are complete.

        Args:
            domains: All domains.

        Returns:
            True if all hub domains have >= books_per_hub books read.
        """
        hub_domains = [d for d in domains if d.is_hub]
        return all(d.books_read >= self.books_per_hub for d in hub_domains)
