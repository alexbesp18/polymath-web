"""Pytest fixtures for Polymath Engine tests."""

import tempfile
from pathlib import Path

import pytest

from pm.config import Config, TraversalConfig, UserConfig
from pm.core.vault import Vault


@pytest.fixture
def temp_dir():
    """Create a temporary directory for tests."""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


@pytest.fixture
def mock_vault_path(temp_dir):
    """Create a mock vault path."""
    vault_path = temp_dir / "test-vault"
    vault_path.mkdir()
    return vault_path


@pytest.fixture
def mock_config(mock_vault_path, temp_dir):
    """Create a mock config for tests."""
    config_path = temp_dir / "config.yaml"
    return Config(
        vault_path=str(mock_vault_path),
        config_path=config_path,
        user=UserConfig(),
        traversal=TraversalConfig(),
    )


@pytest.fixture
def initialized_vault(mock_vault_path):
    """Create an initialized vault for tests."""
    vault = Vault(mock_vault_path)
    vault.create_structure()
    vault.create_domain_files()
    vault.create_branch_overviews()
    vault.create_system_files()
    return vault


@pytest.fixture
def vault(mock_vault_path):
    """Create a basic vault instance."""
    return Vault(mock_vault_path)
