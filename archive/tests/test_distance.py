"""Tests for distance calculations."""

import pytest

from pm.data.distances import (
    get_branch_distance,
    get_domain_distance,
    find_distant_domains,
    get_max_distant_branches,
)


class TestBranchDistance:
    """Tests for branch distance calculations."""

    def test_same_branch_distance_zero(self):
        """Same branch should have distance 0."""
        assert get_branch_distance("01", "01") == 0
        assert get_branch_distance("07", "07") == 0
        assert get_branch_distance("15", "15") == 0

    def test_adjacent_branches(self):
        """Adjacent branches should have distance 1."""
        # Physical Sciences <-> Life Sciences
        assert get_branch_distance("01", "02") == 1
        # Physical Sciences <-> Engineering
        assert get_branch_distance("01", "07") == 1
        # Formal Sciences <-> Engineering
        assert get_branch_distance("03", "07") == 1

    def test_maximum_distance(self):
        """Maximum distance should be 4."""
        # Physical Sciences <-> Religion
        assert get_branch_distance("01", "15") == 4
        # Life Sciences <-> Religion
        assert get_branch_distance("02", "15") == 4
        # Engineering <-> Religion
        assert get_branch_distance("07", "15") == 4
        # Trades <-> Religion
        assert get_branch_distance("14", "15") == 4

    def test_symmetry(self):
        """Distance should be symmetric."""
        assert get_branch_distance("01", "15") == get_branch_distance("15", "01")
        assert get_branch_distance("03", "09") == get_branch_distance("09", "03")

    def test_zero_padding(self):
        """Branch IDs without zero padding should work."""
        assert get_branch_distance("1", "15") == get_branch_distance("01", "15")
        assert get_branch_distance("7", "9") == get_branch_distance("07", "09")


class TestDomainDistance:
    """Tests for domain distance calculations."""

    def test_same_branch_domains(self):
        """Domains in same branch should have distance 0."""
        assert get_domain_distance("01.01", "01.02") == 0
        assert get_domain_distance("07.08", "07.09") == 0

    def test_cross_branch_domains(self):
        """Domains in different branches use branch distance."""
        # Physical Sciences (01) vs Life Sciences (02) = distance 1
        assert get_domain_distance("01.01", "02.01") == 1
        # Engineering (07) vs Religion (15) = distance 4
        assert get_domain_distance("07.09", "15.01") == 4

    def test_isomorphism_reduction(self):
        """Shared isomorphisms should reduce distance."""
        base = get_domain_distance("01.01", "15.01")  # Should be 4
        with_iso = get_domain_distance("01.01", "15.01", shared_isomorphisms=2)
        assert with_iso == base - 1.0  # 2 * 0.5 reduction

    def test_minimum_distance_zero(self):
        """Distance should not go below 0."""
        # Even with many shared isomorphisms
        result = get_domain_distance("01.01", "01.02", shared_isomorphisms=10)
        assert result == 0.0


class TestFindDistantDomains:
    """Tests for finding distant domains."""

    def test_find_distant_from_engineering(self):
        """Should find distant domains from Engineering."""
        all_domains = ["07.09", "01.01", "15.01", "15.02", "06.01"]
        results = find_distant_domains("07.09", all_domains, min_distance=4)

        # Only Religion (15) domains should be at distance 4 from Engineering
        domain_ids = [r[0] for r in results]
        assert "15.01" in domain_ids
        assert "15.02" in domain_ids
        assert "01.01" not in domain_ids  # distance 1

    def test_find_moderate_distance(self):
        """Should find domains at moderate distance."""
        all_domains = ["07.09", "04.01", "05.01", "15.01"]
        results = find_distant_domains("07.09", all_domains, min_distance=2)

        domain_ids = [r[0] for r in results]
        assert "04.01" in domain_ids  # Mind Sciences, distance 2
        assert "05.01" in domain_ids  # Social Sciences, distance 2
        assert "15.01" in domain_ids  # Religion, distance 4

    def test_excludes_self(self):
        """Should not include the source domain."""
        all_domains = ["07.09", "07.10", "15.01"]
        results = find_distant_domains("07.09", all_domains, min_distance=0)

        domain_ids = [r[0] for r in results]
        assert "07.09" not in domain_ids


class TestMaxDistantBranches:
    """Tests for finding max distant branches."""

    def test_engineering_max_distant(self):
        """Engineering should have max distance to Religion."""
        result = get_max_distant_branches("07")
        assert "15" in result
        assert len(result) >= 1

    def test_physical_sciences_max_distant(self):
        """Physical Sciences should have max distance to Religion."""
        result = get_max_distant_branches("01")
        assert "15" in result
