"""pm-init command - Initialize vault structure."""

from pathlib import Path

import click
from rich.console import Console
from rich.panel import Panel

from pm.config import Config
from pm.core.vault import Vault


console = Console()


@click.command()
@click.option(
    "--vault",
    "-v",
    type=click.Path(),
    help="Path for new vault (default: from config).",
)
@click.option(
    "--force",
    "-f",
    is_flag=True,
    help="Overwrite existing files.",
)
@click.pass_context
def init(ctx: click.Context, vault: str, force: bool) -> None:
    """Initialize the Polymath Engine vault.

    Creates the directory structure, 170 domain profile files,
    branch overviews, and system files.
    """
    # For init, we need to handle the case where config doesn't exist yet
    if ctx.obj:
        config = ctx.obj.get("config")
    else:
        config = None

    # Determine vault path
    if vault:
        vault_path = Path(vault).expanduser()
    elif config:
        vault_path = Path(config.vault_path).expanduser()
    else:
        # Default vault path when initializing without config
        vault_path = Path.home() / "Obsidian" / "Polymath-Engine"

    # Create or use config
    if not config:
        config = Config.create_default(vault_path)

    console.print(f"\n[bold]Initializing Polymath Engine vault at:[/bold]")
    console.print(f"  {vault_path}\n")

    # Check if vault already exists
    if vault_path.exists() and not force:
        if not click.confirm("Vault directory exists. Continue?"):
            console.print("[yellow]Aborted.[/yellow]")
            return

    # Create vault instance
    v = Vault(vault_path)

    # Create directory structure
    console.print("[dim]Creating directory structure...[/dim]")
    v.create_structure()
    console.print("  [green]✓[/green] Directories created")

    # Create domain files
    console.print("[dim]Creating domain profile files...[/dim]")
    domain_count = v.create_domain_files()
    console.print(f"  [green]✓[/green] {domain_count} domain files created")

    # Create branch overviews
    console.print("[dim]Creating branch overview files...[/dim]")
    branch_count = v.create_branch_overviews()
    console.print(f"  [green]✓[/green] {branch_count} branch overviews created")

    # Create system files
    console.print("[dim]Creating system files...[/dim]")
    v.create_system_files()
    console.print("  [green]✓[/green] System files created")

    # Save config with vault path
    config.vault_path = vault_path
    config_path = Path.home() / ".polymath" / "config.yaml"
    config.save(config_path)
    console.print(f"  [green]✓[/green] Config saved to {config_path}")

    # Print summary
    console.print()
    console.print(
        Panel(
            f"""[bold green]Vault initialized successfully![/bold green]

[bold]Next steps:[/bold]
1. Open vault in Obsidian: [cyan]{vault_path}[/cyan]
2. Install Dataview plugin for queries
3. Run [cyan]pm status[/cyan] to see your dashboard
4. Run [cyan]pm next[/cyan] to get your first reading recommendation
5. Run [cyan]pm pair[/cyan] to generate a bisociation pairing

[bold]Vault structure:[/bold]
  00-System/      - Dashboard and indexes
  01-Daily-Logs/  - Reading session logs
  02-Domains/     - 170 domain profiles (15 branches)
  03-Books/       - Book notes
  04-Isomorphisms/- Cross-domain concepts
  05-Bridges/     - Domain connections
  06-Blind-Spots/ - Field blind spots
  07-Problems/    - Research problems
  08-Weekly-Synthesis/ - Weekly summaries
  09-Production/  - Output drafts
""",
            title="Polymath Engine",
            border_style="green",
        )
    )
