"""Main CLI entry point for Polymath Engine."""

import click

from pm import __version__
from pm.config import Config


@click.group()
@click.option(
    "--config",
    "-c",
    type=click.Path(),
    help="Path to config file.",
)
@click.option(
    "--vault",
    "-v",
    type=click.Path(),
    help="Path to Obsidian vault (overrides config).",
)
@click.version_option(version=__version__)
@click.pass_context
def cli(ctx: click.Context, config: str, vault: str) -> None:
    """Polymath Engine - Systematic polymathic learning CLI.

    A personal knowledge management system for tracking reading across
    170 academic/practical domains, generating cross-domain insights,
    and building systematic expertise.
    """
    ctx.ensure_object(dict)

    # Load configuration
    if config:
        ctx.obj["config"] = Config.load(config)
    else:
        ctx.obj["config"] = Config.load()

    # Override vault path if specified
    if vault:
        ctx.obj["config"].vault_path = vault


# Import and register commands
from pm.commands.init import init
from pm.commands.status import status
from pm.commands.next_cmd import next_cmd
from pm.commands.pair import pair
from pm.commands.log import log
from pm.commands.gaps import gaps

cli.add_command(init)
cli.add_command(status)
cli.add_command(next_cmd, name="next")
cli.add_command(pair)
cli.add_command(log)
cli.add_command(gaps)


if __name__ == "__main__":
    cli()
