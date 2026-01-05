"""pm-gaps command - Show untouched and neglected domains."""

from datetime import date, timedelta

import click
from rich.console import Console
from rich.table import Table

from pm.config import Config
from pm.core.domain import DomainStatus
from pm.core.vault import Vault
from pm.data.domains import BRANCHES


console = Console()


@click.command()
@click.option(
    "--stale-days",
    "-s",
    type=int,
    default=90,
    help="Days since last read to consider stale (default: 90).",
)
@click.option(
    "--show-all",
    "-a",
    is_flag=True,
    help="Show all untouched domains, not just summary.",
)
@click.pass_context
def gaps(ctx: click.Context, stale_days: int, show_all: bool) -> None:
    """Show untouched branches, stale domains, and incomplete hubs.

    Identifies gaps in your knowledge coverage to help maintain
    breadth across all 15 branches.
    """
    config: Config = ctx.obj.get("config", Config.load()) if ctx.obj else Config.load()
    vault = Vault(config.vault_path)

    if not vault.exists():
        console.print("[red]Vault not found.[/red] Run [cyan]pm init[/cyan] first.")
        return

    domains = vault.load_all_domains()
    today = date.today()
    stale_threshold = today - timedelta(days=stale_days)

    console.print()

    # 1. Untouched branches
    branch_stats = {}
    for d in domains:
        if d.branch_id not in branch_stats:
            branch_stats[d.branch_id] = {"total": 0, "touched": 0}
        branch_stats[d.branch_id]["total"] += 1
        if d.books_read > 0:
            branch_stats[d.branch_id]["touched"] += 1

    untouched_branches = [
        b for b in BRANCHES
        if branch_stats.get(b["branch_id"], {}).get("touched", 0) == 0
    ]

    if untouched_branches:
        console.print("[bold red]🚨 Untouched Branches[/bold red]\n")
        for b in untouched_branches:
            console.print(f"  {b['branch_id']} — {b['branch_name']}")
            console.print(f"      [dim]{b['description']}[/dim]")
        console.print()
    else:
        console.print("[green]✓ All branches have been touched[/green]\n")

    # 2. Incomplete hubs
    hub_target = config.traversal.hub_target_books
    incomplete_hubs = [
        d for d in domains
        if d.is_hub and d.books_read < hub_target
    ]

    if incomplete_hubs:
        console.print("[bold yellow]📚 Incomplete Hub Domains[/bold yellow]\n")
        table = Table(show_header=True, box=None)
        table.add_column("Domain", style="cyan")
        table.add_column("Books", justify="right")
        table.add_column("Needed", justify="right")
        table.add_column("Next Slot")

        for h in sorted(incomplete_hubs, key=lambda d: -d.books_read):
            needed = hub_target - h.books_read
            table.add_row(
                f"{h.domain_id} {h.domain_name}",
                str(h.books_read),
                str(needed),
                h.next_slot(),
            )

        console.print(table)
        console.print()
    else:
        console.print("[green]✓ All hub domains complete[/green]\n")

    # 3. Stale domains (started but not touched recently)
    stale_domains = [
        d for d in domains
        if d.status != DomainStatus.UNTOUCHED
        and d.status != DomainStatus.EXPERT
        and d.last_read
        and d.last_read < stale_threshold
    ]

    if stale_domains:
        console.print(f"[bold orange1]⏰ Stale Domains (>{stale_days} days)[/bold orange1]\n")
        table = Table(show_header=True, box=None)
        table.add_column("Domain", style="cyan")
        table.add_column("Last Read")
        table.add_column("Days Ago", justify="right")
        table.add_column("Status")

        for d in sorted(stale_domains, key=lambda d: d.last_read):
            days_ago = (today - d.last_read).days
            table.add_row(
                f"{d.domain_id} {d.domain_name}",
                d.last_read.isoformat(),
                str(days_ago),
                d.status.value,
            )

        console.print(table)
        console.print()
    else:
        console.print(f"[green]✓ No stale domains (>{stale_days} days)[/green]\n")

    # 4. Untouched domains summary or full list
    untouched_domains = [d for d in domains if d.status == DomainStatus.UNTOUCHED]

    if show_all and untouched_domains:
        console.print(f"[bold]📋 All Untouched Domains ({len(untouched_domains)})[/bold]\n")

        # Group by branch
        by_branch = {}
        for d in untouched_domains:
            if d.branch_id not in by_branch:
                by_branch[d.branch_id] = []
            by_branch[d.branch_id].append(d)

        for branch_id in sorted(by_branch.keys()):
            branch = next((b for b in BRANCHES if b["branch_id"] == branch_id), None)
            branch_name = branch["branch_name"] if branch else "Unknown"
            console.print(f"  [bold]{branch_id} — {branch_name}[/bold]")
            for d in sorted(by_branch[branch_id], key=lambda x: x.domain_id):
                hub_marker = " [hub]" if d.is_hub else ""
                console.print(f"    {d.domain_id} {d.domain_name}{hub_marker}")
            console.print()

    else:
        console.print(f"[dim]Untouched domains: {len(untouched_domains)}/{len(domains)}[/dim]")
        console.print("[dim]Use --show-all to list all untouched domains[/dim]")
        console.print()

    # Summary stats
    touched_pct = ((len(domains) - len(untouched_domains)) / len(domains)) * 100
    console.print(f"[bold]Coverage:[/bold] {touched_pct:.1f}% of domains touched")
    console.print()
