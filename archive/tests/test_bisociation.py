"""Tests for bisociation pairing."""

import pytest

from pm.core.bisociation import (
    generate_bisociation_pair,
    suggest_synthesis_questions,
    get_all_max_distance_pairs,
)
from pm.core.domain import Domain, DomainStatus


@pytest.fixture
def sample_domains():
    """Create sample domains for testing."""
    return [
        Domain(
            domain_id="07.09",
            domain_name="AI Machine Learning",
            branch_id="07",
            branch_name="Engineering",
            is_expert=True,
            books_read=10,
        ),
        Domain(
            domain_id="07.10",
            domain_name="Networks Distributed Systems",
            branch_id="07",
            branch_name="Engineering",
            is_expert=True,
            books_read=8,
        ),
        Domain(
            domain_id="15.01",
            domain_name="Comparative Religion",
            branch_id="15",
            branch_name="Religion Theology",
            status=DomainStatus.UNTOUCHED,
            books_read=0,
        ),
        Domain(
            domain_id="15.08",
            domain_name="Mysticism Contemplative Studies",
            branch_id="15",
            branch_name="Religion Theology",
            books_read=1,
        ),
        Domain(
            domain_id="02.04",
            domain_name="Evolutionary Biology",
            branch_id="02",
            branch_name="Life Sciences",
            is_hub=True,
            books_read=3,
        ),
        Domain(
            domain_id="01.02",
            domain_name="Thermodynamics",
            branch_id="01",
            branch_name="Physical Sciences",
            is_hub=True,
            books_read=1,
        ),
    ]


class TestGenerateBisociationPair:
    """Tests for generating bisociation pairs."""

    def test_generates_valid_pair(self, sample_domains):
        """Should generate a valid pairing."""
        pair = generate_bisociation_pair(sample_domains, min_distance=3)

        assert pair is not None
        assert pair.anchor_domain is not None
        assert pair.distant_domain is not None
        assert pair.distance >= 3

    def test_anchor_is_strength_domain(self, sample_domains):
        """Anchor should be from strength areas."""
        pair = generate_bisociation_pair(sample_domains, min_distance=3)

        assert pair is not None
        # Should pick expert or high books_read domain
        assert pair.anchor_domain.is_expert or pair.anchor_domain.books_read >= 2

    def test_distant_at_max_distance(self, sample_domains):
        """Distant domain should be at maximum distance."""
        pair = generate_bisociation_pair(sample_domains, min_distance=4)

        if pair:  # May be None if no max distance pairs available
            assert pair.distance == 4

    def test_specific_anchor(self, sample_domains):
        """Should use specific anchor when provided."""
        pair = generate_bisociation_pair(
            sample_domains,
            anchor_domain_id="02.04",
            min_distance=3,
        )

        assert pair is not None
        assert pair.anchor_domain.domain_id == "02.04"

    def test_excludes_recent_domains(self, sample_domains):
        """Should exclude recently read domains."""
        recent = ["15.01", "15.08"]  # Exclude Religion domains
        pair = generate_bisociation_pair(
            sample_domains,
            recent_domain_ids=recent,
            min_distance=3,
        )

        if pair:
            assert pair.distant_domain.domain_id not in recent

    def test_prefers_untouched_domains(self, sample_domains):
        """Should prefer untouched domains (bonus points)."""
        # Run multiple times to check tendency
        untouched_count = 0
        for _ in range(20):
            pair = generate_bisociation_pair(sample_domains, min_distance=3)
            if pair and pair.distant_domain.status == DomainStatus.UNTOUCHED:
                untouched_count += 1

        # Should have some preference for untouched
        assert untouched_count > 5  # At least 25% of the time

    def test_synthesis_prompt_included(self, sample_domains):
        """Should include a synthesis prompt."""
        pair = generate_bisociation_pair(sample_domains, min_distance=3)

        assert pair is not None
        assert pair.synthesis_prompt
        # Prompt should be non-empty (some prompts don't include domain names)
        assert len(pair.synthesis_prompt) > 10

    def test_why_paired_explanation(self, sample_domains):
        """Should explain why the pair was chosen."""
        pair = generate_bisociation_pair(sample_domains, min_distance=3)

        assert pair is not None
        assert pair.why_paired
        assert len(pair.why_paired) > 10


class TestSynthesisQuestions:
    """Tests for synthesis question generation."""

    def test_generates_multiple_questions(self, sample_domains):
        """Should generate multiple unique questions."""
        anchor = sample_domains[0]
        distant = sample_domains[2]

        questions = suggest_synthesis_questions(anchor, distant, num_questions=5)

        assert len(questions) == 5
        assert len(set(questions)) == 5  # All unique

    def test_questions_include_domain_names(self, sample_domains):
        """Questions should reference domain names."""
        anchor = sample_domains[0]
        distant = sample_domains[2]

        questions = suggest_synthesis_questions(anchor, distant, num_questions=3)

        # At least some questions should include domain names
        has_domain_name = any(
            anchor.domain_name in q or distant.domain_name in q
            for q in questions
        )
        assert has_domain_name


class TestMaxDistancePairs:
    """Tests for finding all max distance pairs."""

    def test_finds_max_distance_pairs(self, sample_domains):
        """Should find all pairs at maximum distance."""
        pairs = get_all_max_distance_pairs(sample_domains)

        for domain_a, domain_b, distance in pairs:
            assert distance == 4

    def test_no_duplicate_pairs(self, sample_domains):
        """Should not have duplicate pairs."""
        pairs = get_all_max_distance_pairs(sample_domains)

        seen = set()
        for domain_a, domain_b, _ in pairs:
            pair_key = tuple(sorted([domain_a.domain_id, domain_b.domain_id]))
            assert pair_key not in seen
            seen.add(pair_key)
