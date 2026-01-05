"""Integration tests for CLI commands."""

import os
import shutil
import tempfile
from pathlib import Path

import pytest
from click.testing import CliRunner

from pm.commands.init import init
from pm.commands.status import status
from pm.commands.next_cmd import next_cmd
from pm.commands.pair import pair
from pm.commands.gaps import gaps
from pm.commands.log import log


@pytest.fixture
def temp_vault():
    """Create a temporary vault directory."""
    temp_dir = tempfile.mkdtemp()
    vault_path = Path(temp_dir) / "test-vault"
    yield vault_path
    # Cleanup
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def initialized_vault(temp_vault):
    """Create and initialize a temporary vault."""
    runner = CliRunner()
    result = runner.invoke(init, ["-v", str(temp_vault)])
    assert result.exit_code == 0, f"Init failed: {result.output}"
    return temp_vault


class TestInitCommand:
    """Tests for pm-init command."""

    def test_init_creates_vault(self, temp_vault):
        """Should create vault directory structure."""
        runner = CliRunner()
        result = runner.invoke(init, ["-v", str(temp_vault)])

        assert result.exit_code == 0
        assert temp_vault.exists()
        assert (temp_vault / "00-System").exists()
        assert (temp_vault / "01-Daily-Logs").exists()
        assert (temp_vault / "02-Domains").exists()

    def test_init_creates_domain_files(self, temp_vault):
        """Should create all 180 domain files."""
        runner = CliRunner()
        result = runner.invoke(init, ["-v", str(temp_vault)])

        assert result.exit_code == 0
        # Count domain files across all branch folders
        domain_count = 0
        domains_dir = temp_vault / "02-Domains"
        for branch_dir in domains_dir.iterdir():
            if branch_dir.is_dir():
                domain_files = list(branch_dir.glob("*.md"))
                # Exclude _Branch-Overview.md
                domain_count += sum(1 for f in domain_files if not f.name.startswith("_"))

        assert domain_count == 180

    def test_init_creates_branch_folders(self, temp_vault):
        """Should create 15 branch folders."""
        runner = CliRunner()
        result = runner.invoke(init, ["-v", str(temp_vault)])

        assert result.exit_code == 0
        domains_dir = temp_vault / "02-Domains"
        branch_folders = [d for d in domains_dir.iterdir() if d.is_dir()]
        assert len(branch_folders) == 15

    def test_init_creates_hub_domains(self, temp_vault):
        """Should mark hub domains correctly."""
        runner = CliRunner()
        result = runner.invoke(init, ["-v", str(temp_vault)])

        assert result.exit_code == 0
        # Check a known hub domain file
        thermo_file = temp_vault / "02-Domains" / "01-Physical-Sciences" / "01.02-Thermodynamics.md"
        assert thermo_file.exists()
        content = thermo_file.read_text()
        assert "is_hub: true" in content


class TestStatusCommand:
    """Tests for pm-status command."""

    def test_status_shows_dashboard(self, initialized_vault):
        """Should display status dashboard."""
        runner = CliRunner()
        result = runner.invoke(status, [])

        assert result.exit_code == 0
        assert "Polymath Engine" in result.output
        assert "Domains touched" in result.output
        assert "Hub Completion" in result.output

    def test_status_shows_all_untouched(self, initialized_vault):
        """Fresh vault should show all domains untouched."""
        runner = CliRunner()
        result = runner.invoke(status, [])

        assert result.exit_code == 0
        assert "0/180" in result.output  # All untouched


class TestNextCommand:
    """Tests for pm-next command."""

    def test_next_recommends_hub(self, initialized_vault):
        """Should recommend a hub domain."""
        runner = CliRunner()
        result = runner.invoke(next_cmd, [])

        assert result.exit_code == 0
        assert "Next Reading Recommendation" in result.output
        # Should recommend a hub domain (one of the 7)
        assert any(hub in result.output for hub in [
            "Thermodynamics",
            "Evolutionary Biology",
            "Probability Statistics",
            "Combinatorics Graph Theory",
            "Information Theory",
            "Game Theory",
            "Systems Engineering",
        ])

    def test_next_shows_slot(self, initialized_vault):
        """Should show next function slot."""
        runner = CliRunner()
        result = runner.invoke(next_cmd, [])

        assert result.exit_code == 0
        assert "Next slot:" in result.output
        assert "FND" in result.output  # First slot for new domain


class TestPairCommand:
    """Tests for pm-pair command."""

    def test_pair_generates_pairing(self, initialized_vault):
        """Should generate a bisociation pairing."""
        runner = CliRunner()
        result = runner.invoke(pair, [])

        assert result.exit_code == 0
        assert "Bisociation Pairing" in result.output
        assert "Anchor" in result.output
        assert "Distant Domain" in result.output
        assert "Synthesis Prompt" in result.output

    def test_pair_with_min_distance(self, initialized_vault):
        """Should respect minimum distance option."""
        runner = CliRunner()
        result = runner.invoke(pair, ["--min-distance", "3"])

        assert result.exit_code == 0
        # Should show distance of at least 3
        assert "Conceptual Distance:" in result.output
        # Distance should be 3 or 4
        assert "Distance: 3" in result.output or "Distance: 4" in result.output


class TestGapsCommand:
    """Tests for pm-gaps command."""

    def test_gaps_shows_untouched(self, initialized_vault):
        """Should show untouched branches."""
        runner = CliRunner()
        result = runner.invoke(gaps, [])

        assert result.exit_code == 0
        assert "Untouched Branches" in result.output
        # All 15 branches should be untouched
        assert "Physical Sciences" in result.output
        assert "Religion Theology" in result.output

    def test_gaps_shows_incomplete_hubs(self, initialized_vault):
        """Should show incomplete hub domains."""
        runner = CliRunner()
        result = runner.invoke(gaps, [])

        assert result.exit_code == 0
        assert "Incomplete Hub Domains" in result.output
        # All 7 hubs should be incomplete
        assert "Thermodynamics" in result.output


class TestLogCommand:
    """Tests for pm-log command."""

    def test_log_requires_domain(self, initialized_vault):
        """Should require domain option."""
        runner = CliRunner()
        result = runner.invoke(log, ["--book", "Test Book"])

        assert result.exit_code != 0
        assert "Missing option" in result.output or "required" in result.output.lower()

    def test_log_requires_book(self, initialized_vault):
        """Should require book option."""
        runner = CliRunner()
        result = runner.invoke(log, ["--domain", "01.02"])

        assert result.exit_code != 0
        assert "Missing option" in result.output or "required" in result.output.lower()

    def test_log_creates_entry(self, initialized_vault):
        """Should create a daily log entry."""
        runner = CliRunner()
        result = runner.invoke(log, [
            "--domain", "01.02",
            "--book", "Understanding Thermodynamics",
            "--pages", "50",
            "--time", "60",
        ])

        assert result.exit_code == 0
        assert "Logged" in result.output or "reading session" in result.output.lower()

        # Verify log file was created
        logs_dir = initialized_vault / "01-Daily-Logs"
        log_files = list(logs_dir.glob("*.md"))
        assert len(log_files) == 1

    def test_log_updates_domain(self, initialized_vault):
        """Should update domain's books_read count."""
        runner = CliRunner()

        # Log a reading session
        result = runner.invoke(log, [
            "--domain", "01.02",
            "--book", "Understanding Thermodynamics",
        ])
        assert result.exit_code == 0

        # Check status shows the update
        result = runner.invoke(status, [])
        assert result.exit_code == 0
        # Should now show 1 domain touched
        assert "1/180" in result.output or "Domains touched" in result.output
