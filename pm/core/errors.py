"""Exception classes for Polymath Engine."""


class PolymathError(Exception):
    """Base exception for Polymath Engine."""

    pass


class VaultNotFoundError(PolymathError):
    """Raised when vault path doesn't exist."""

    def __init__(self, path):
        self.path = path
        super().__init__(f"Vault not found at: {path}")


class DomainNotFoundError(PolymathError):
    """Raised when domain ID doesn't exist."""

    def __init__(self, domain_id):
        self.domain_id = domain_id
        super().__init__(f"Domain not found: {domain_id}")


class InvalidFrontmatterError(PolymathError):
    """Raised when file has invalid frontmatter."""

    def __init__(self, filepath, reason):
        self.filepath = filepath
        self.reason = reason
        super().__init__(f"Invalid frontmatter in {filepath}: {reason}")


class ConfigurationError(PolymathError):
    """Raised when configuration is invalid."""

    pass
