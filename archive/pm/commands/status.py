"""pm-status command - Show vault statistics and progress."""

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from pm.config import Config
from pm.core.vault import Vault
from pm.data.domains import BRANCHES


console = Console()


def create_progress_bar(current: int, total: int, width: int = 10) -> str:
    """Create a text-based progress bar."""
    if total == 0:
        return "░" * width
    filled = int((current / total) * width)
    return "▓" * filled + "░" * (width - filled)


@click.command()
@click.option(
    "--detailed",
    "-d",
    is_flag=True,
    help="Show detailed branch breakdown.",
)
@click.pass_context
def status(ctx: click.Context, detailed: bool) -> None:
    """Show vault statistics and progress.

    Displays overall reading progress, branch coverage,
    hub completion status, and current streak.
    """
    config: Config = ctx.obj.get("config", Config.load()) if ctx.obj else Config.load()
    vault = Vault(config.vault_path)

    if not vault.exists():
        console.print("[red]Vault not found.[/red] Run [cyan]pm init[/cyan] first.")
        return

    # Get stats
    stats = vault.get_stats()

    # Header
    console.print()
    console.print(
        Panel(
            "[bold]Polymath Engine[/bold] - Status Dashboard",
            border_style="blue",
        )
    )

    # Overall stats table
    stats_table = Table(show_header=False, box=None, padding=(0, 2))
    stats_table.add_column("Metric", style="cyan")
    stats_table.add_column("Value", style="bold")

    stats_table.add_row("Domains touched", f"{stats.domains_touched}/{stats.total_domains}")
    stats_table.add_row("Books read", str(stats.total_books_read))
    stats_table.add_row("Daily logs", str(stats.total_daily_logs))
    stats_table.add_row("Current streak", f"{stats.current_streak} days")
    stats_table.add_row("Branches touched", f"{stats.branches_touched}/15")

    console.print(stats_table)
    console.print()

    # Domain status breakdown
    status_table = Table(title="Domain Status", box=None)
    status_table.add_column("Status", style="dim")
    status_table.add_column("Count", justify="right")
    status_table.add_column("Bar", justify="left")

    untouched = stats.total_domains - stats.domains_touched
    status_table.add_row(
        "Untouched",
        str(untouched),
        create_progress_bar(untouched, stats.total_domains, 20),
    )
    status_table.add_row(
        "Surveying",
        str(stats.domains_surveying),
        create_progress_bar(stats.domains_surveying, stats.total_domains, 20),
    )
    status_table.add_row(
        "Surveyed",
        str(stats.domains_surveyed),
        create_progress_bar(stats.domains_surveyed, stats.total_domains, 20),
    )
    status_table.add_row(
        "Deepening",
        str(stats.domains_deepening),
        create_progress_bar(stats.domains_deepening, stats.total_domains, 20),
    )
    status_table.add_row(
        "Expert",
        str(stats.domains_expert),
        create_progress_bar(stats.domains_expert, stats.total_domains, 20),
    )

    console.print(status_table)
    console.print()

    # Branch coverage
    if detailed:
        console.print("[bold]Branch Coverage[/bold]\n")

        domains = vault.load_all_domains()
        branch_stats = {}
        for d in domains:
            if d.branch_id not in branch_stats:
                branch_stats[d.branch_id] = {"total": 0, "touched": 0}
            branch_stats[d.branch_id]["total"] += 1
            if d.books_read > 0:
                branch_stats[d.branch_id]["touched"] += 1

        for branch in BRANCHES:
            bid = branch["branch_id"]
            bname = branch["branch_name"]
            bs = branch_stats.get(bid, {"total": 0, "touched": 0})

            bar = create_progress_bar(bs["touched"], bs["total"], 10)
            console.print(f"  {bid} {bname:<25} {bar} {bs['touched']}/{bs['total']}")

        console.print()

    # Hub completion
    console.print("[bold]Hub Completion[/bold]\n")
    hub_domains = vault.get_hub_domains()

    hub_target = config.traversal.hub_target_books
    for hub in sorted(hub_domains, key=lambda d: d.domain_id):
        status_icon = "✅" if hub.books_read >= hub_target else "🔄"
        bar = create_progress_bar(hub.books_read, hub_target, 4)
        console.print(
            f"  {status_icon} {hub.domain_id} {hub.domain_name:<25} {bar} {hub.books_read}/{hub_target}"
        )

    console.print()

    # Quick actions
    console.print("[dim]Quick actions:[/dim]")
    console.print("  [cyan]pm next[/cyan]  - Get next reading recommendation")
    console.print("  [cyan]pm pair[/cyan]  - Generate bisociation pairing")
    console.print("  [cyan]pm gaps[/cyan]  - Show gaps and neglected domains")
    console.print()
