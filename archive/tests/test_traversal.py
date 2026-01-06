"""Tests for traversal engine."""

import pytest

from pm.config import TraversalConfig
from pm.core.domain import Domain, DomainStatus, FunctionSlot
from pm.core.traversal import TraversalEngine, TraversalPhase


@pytest.fixture
def traversal_config():
    """Create a traversal config for tests."""
    return TraversalConfig(
        hub_target_books=4,
        max_domain_repeat_window=7,
        bisociation_min_distance=3,
    )


@pytest.fixture
def sample_domains():
    """Create sample domains for testing."""
    return [
        Domain(
            domain_id="02.04",
            domain_name="Evolutionary Biology",
            branch_id="02",
            branch_name="Life Sciences",
            is_hub=True,
            books_read=2,
        ),
        Domain(
            domain_id="01.02",
            domain_name="Thermodynamics",
            branch_id="01",
            branch_name="Physical Sciences",
            is_hub=True,
            books_read=0,
        ),
        Domain(
            domain_id="07.09",
            domain_name="AI Machine Learning",
            branch_id="07",
            branch_name="Engineering",
            is_expert=True,
            books_read=10,
        ),
        Domain(
            domain_id="15.01",
            domain_name="Comparative Religion",
            branch_id="15",
            branch_name="Religion Theology",
            books_read=0,
        ),
        Domain(
            domain_id="03.09",
            domain_name="Game Theory",
            branch_id="03",
            branch_name="Formal Sciences",
            is_hub=True,
            books_read=4,
        ),
    ]


class TestTraversalEngine:
    """Tests for TraversalEngine."""

    def test_recommend_hub_completion(self, traversal_config, sample_domains):
        """Should recommend incomplete hub domains."""
        engine = TraversalEngine(traversal_config)
        rec = engine.recommend_next(sample_domains, [], week_day=0)

        assert rec is not None
        assert rec.domain.is_hub
        assert rec.domain.books_read < engine.books_per_hub
        assert rec.phase == TraversalPhase.HUB_COMPLETION

    def test_prioritize_closest_to_completion(self, traversal_config, sample_domains):
        """Should prioritize hubs closest to completion."""
        engine = TraversalEngine(traversal_config)
        rec = engine.recommend_next(sample_domains, [], week_day=0)

        # 02.04 has 2 books, 01.02 has 0, 03.09 has 4 (complete)
        # Should recommend 02.04 as it's closest to completion
        assert rec.domain.domain_id == "02.04"

    def test_respects_cooldown(self, traversal_config, sample_domains):
        """Should skip recently read domains."""
        engine = TraversalEngine(traversal_config)
        recent = ["02.04"]  # Skip Evolutionary Biology
        rec = engine.recommend_next(sample_domains, recent, week_day=0)

        assert rec.domain.domain_id != "02.04"

    def test_distant_interleave_day(self, traversal_config, sample_domains):
        """Should recommend distant domain on interleave day."""
        engine = TraversalEngine(traversal_config)
        engine.distant_interleave_day = 0  # Monday
        rec = engine.recommend_next(sample_domains, [], week_day=0)

        assert rec is not None
        # Should be a distant domain
        assert rec.is_distant_interleave

    def test_slot_progression(self, traversal_config, sample_domains):
        """Should recommend correct slot based on books_read."""
        engine = TraversalEngine(traversal_config)

        # Domain with 2 books read should get ORT (Orthodoxy) slot
        rec = engine.recommend_next(sample_domains, [], week_day=1)
        if rec and rec.domain.domain_id == "02.04":
            assert rec.slot == "ORT"  # next_slot() returns string

    def test_find_distant_domain(self, traversal_config, sample_domains):
        """Should find maximally distant domains."""
        engine = TraversalEngine(traversal_config)
        rec = engine._find_distant_domain(sample_domains, [])

        assert rec is not None
        assert rec.is_distant_interleave
        assert rec.distance_from_strength >= engine.min_distant_distance

    def test_find_strength_domain(self, traversal_config, sample_domains):
        """Should find domains in strength areas."""
        engine = TraversalEngine(traversal_config)
        rec = engine._find_strength_domain(sample_domains, [])

        assert rec is not None
        # Should be expert domain or high books_read domain
        assert rec.domain.is_expert or rec.domain.books_read >= 2


class TestTraversalPhases:
    """Tests for different traversal phases."""

    def test_bisociation_phase_weekday_logic(self, traversal_config, sample_domains):
        """Bisociation phase should follow weekly rhythm."""
        engine = TraversalEngine(traversal_config)
        engine.set_phase(TraversalPhase.BISOCIATION)

        # Days 0-2: Strength
        rec = engine.recommend_next(sample_domains, [], week_day=1)
        if rec:
            assert not rec.is_distant_interleave

        # Days 3-5: Distant
        rec = engine.recommend_next(sample_domains, [], week_day=4)
        if rec:
            assert rec.is_distant_interleave

        # Day 6: Synthesis (no recommendation)
        rec = engine.recommend_next(sample_domains, [], week_day=6)
        assert rec is None

    def test_hub_completion_check(self, traversal_config, sample_domains):
        """Should correctly check if hubs are complete."""
        engine = TraversalEngine(traversal_config)

        # Not all complete
        assert not engine.check_hub_completion(sample_domains)

        # Mark all as complete
        for d in sample_domains:
            if d.is_hub:
                d.books_read = engine.books_per_hub

        assert engine.check_hub_completion(sample_domains)
