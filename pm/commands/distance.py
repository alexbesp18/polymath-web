"""pm-distance command - Show distance between domains or branches."""

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from pm.data.distances import (
    BRANCH_NAMES,
    get_branch_distance,
    get_domain_distance,
    get_max_distant_branches,
)
from pm.data.domains import DOMAINS, get_domain_by_id


console = Console()


@click.command()
@click.argument("domain_a", required=False)
@click.argument("domain_b", required=False)
@click.option(
    "--branch",
    "-b",
    is_flag=True,
    help="Treat arguments as branch IDs instead of domain IDs.",
)
@click.option(
    "--from",
    "from_id",
    help="Show all distances from this domain/branch.",
)
@click.option(
    "--matrix",
    "-m",
    is_flag=True,
    help="Show full 15x15 branch distance matrix.",
)
def distance(
    domain_a: str | None,
    domain_b: str | None,
    branch: bool,
    from_id: str | None,
    matrix: bool,
) -> None:
    """Show conceptual distance between domains or branches.

    \b
    Examples:
      pm-distance 01.02 15.04       # Distance between two domains
      pm-distance -b 01 15          # Distance between branches
      pm-distance --from 07.09      # All distances from a domain
      pm-distance --matrix          # Full branch distance matrix

    Distance scale: 0=same, 1=adjacent, 2=moderate, 3=far, 4=maximum
    """
    if matrix:
        _show_matrix()
        return

    if from_id:
        _show_from_distance(from_id, is_branch=branch)
        return

    if domain_a is None:
        console.print("[yellow]Specify two domains/branches or use --from/--matrix.[/yellow]")
        console.print("\n[dim]Examples:[/dim]")
        console.print("  pm-distance 01.02 15.04")
        console.print("  pm-distance -b 01 15")
        console.print("  pm-distance --from 07.09")
        console.print("  pm-distance --matrix")
        return

    if domain_b is None:
        console.print("[yellow]Specify a second domain/branch to compare.[/yellow]")
        return

    if branch:
        _show_branch_distance(domain_a, domain_b)
    else:
        _show_domain_distance(domain_a, domain_b)


def _show_domain_distance(domain_a_id: str, domain_b_id: str) -> None:
    """Show distance between two domains."""
    domain_a = get_domain_by_id(domain_a_id)
    domain_b = get_domain_by_id(domain_b_id)

    if domain_a is None:
        console.print(f"[red]Unknown domain: {domain_a_id}[/red]")
        return
    if domain_b is None:
        console.print(f"[red]Unknown domain: {domain_b_id}[/red]")
        return

    dist = get_domain_distance(domain_a_id, domain_b_id)
    branch_a = domain_a_id.split(".")[0]
    branch_b = domain_b_id.split(".")[0]

    content = f"""[bold cyan]{domain_a_id}[/bold cyan] — {domain_a['domain_name']}
  [dim]Branch: {BRANCH_NAMES.get(branch_a, branch_a)}[/dim]

[bold yellow]{domain_b_id}[/bold yellow] — {domain_b['domain_name']}
  [dim]Branch: {BRANCH_NAMES.get(branch_b, branch_b)}[/dim]

[bold]Distance:[/bold] {_format_distance(int(dist))}"""

    console.print()
    console.print(Panel(content, title="📏 Domain Distance", border_style="blue"))
    console.print()


def _show_branch_distance(branch_a: str, branch_b: str) -> None:
    """Show distance between two branches."""
    a = branch_a.zfill(2)
    b = branch_b.zfill(2)

    if a not in BRANCH_NAMES:
        console.print(f"[red]Unknown branch: {branch_a}[/red]")
        return
    if b not in BRANCH_NAMES:
        console.print(f"[red]Unknown branch: {branch_b}[/red]")
        return

    dist = get_branch_distance(a, b)

    content = f"""[bold cyan]{a}[/bold cyan] — {BRANCH_NAMES[a]}

[bold yellow]{b}[/bold yellow] — {BRANCH_NAMES[b]}

[bold]Distance:[/bold] {_format_distance(dist)}"""

    console.print()
    console.print(Panel(content, title="📏 Branch Distance", border_style="blue"))
    console.print()


def _show_from_distance(from_id: str, is_branch: bool) -> None:
    """Show all distances from a domain or branch."""
    if is_branch:
        from_branch = from_id.zfill(2)
        if from_branch not in BRANCH_NAMES:
            console.print(f"[red]Unknown branch: {from_id}[/red]")
            return

        console.print()
        console.print(f"[bold]Distances from Branch {from_branch} — {BRANCH_NAMES[from_branch]}[/bold]")
        console.print()

        table = Table(show_header=True)
        table.add_column("Branch", style="cyan")
        table.add_column("Name")
        table.add_column("Distance", justify="right")

        # Group by distance
        distances = []
        for bid in sorted(BRANCH_NAMES.keys()):
            if bid != from_branch:
                d = get_branch_distance(from_branch, bid)
                distances.append((bid, BRANCH_NAMES[bid], d))

        distances.sort(key=lambda x: (-x[2], x[0]))

        for bid, name, d in distances:
            table.add_row(bid, name, _format_distance(d))

        console.print(table)
        console.print()

        # Show max distant
        max_distant = get_max_distant_branches(from_branch)
        if max_distant:
            console.print(f"[bold]Maximum distance (4):[/bold] {', '.join(max_distant)}")
            console.print()
    else:
        domain = get_domain_by_id(from_id)
        if domain is None:
            console.print(f"[red]Unknown domain: {from_id}[/red]")
            return

        from_branch = from_id.split(".")[0]
        console.print()
        console.print(f"[bold]Distances from {from_id} — {domain['domain_name']}[/bold]")
        console.print(f"[dim]Branch: {BRANCH_NAMES.get(from_branch, from_branch)}[/dim]")
        console.print()

        table = Table(show_header=True)
        table.add_column("Branch", style="cyan")
        table.add_column("Name")
        table.add_column("Distance", justify="right")
        table.add_column("Domains", justify="right")

        # Group by branch distance
        branch_data = {}
        for d in DOMAINS:
            bid = str(d["branch_id"]).zfill(2)
            if bid != from_branch:
                if bid not in branch_data:
                    dist = get_branch_distance(from_branch, bid)
                    branch_data[bid] = {"name": d["branch_name"], "dist": dist, "count": 0}
                branch_data[bid]["count"] += 1

        rows = [(bid, data["name"], data["dist"], data["count"]) for bid, data in branch_data.items()]
        rows.sort(key=lambda x: (-x[2], x[0]))

        for bid, name, d, count in rows:
            table.add_row(bid, name, _format_distance(d), str(count))

        console.print(table)
        console.print()


def _show_matrix() -> None:
    """Show full branch distance matrix."""
    console.print()
    console.print("[bold]Branch Distance Matrix[/bold]")
    console.print("[dim]0=same, 1=adjacent, 2=moderate, 3=far, 4=maximum[/dim]")
    console.print()

    table = Table(show_header=True, padding=0)
    table.add_column("", style="bold cyan", width=3)

    for bid in sorted(BRANCH_NAMES.keys()):
        table.add_column(bid, justify="center", width=3)

    for bid_a in sorted(BRANCH_NAMES.keys()):
        row = [bid_a]
        for bid_b in sorted(BRANCH_NAMES.keys()):
            d = get_branch_distance(bid_a, bid_b)
            if d == 0:
                row.append("[dim]·[/dim]")
            elif d == 4:
                row.append("[red bold]4[/red bold]")
            elif d == 3:
                row.append("[yellow]3[/yellow]")
            elif d == 2:
                row.append("[blue]2[/blue]")
            else:
                row.append("[green]1[/green]")
        table.add_row(*row)

    console.print(table)
    console.print()

    # Legend
    console.print("[bold]Branches:[/bold]")
    for bid, name in sorted(BRANCH_NAMES.items()):
        console.print(f"  [cyan]{bid}[/cyan] — {name}")
    console.print()


def _format_distance(d: int) -> str:
    """Format distance with color and label."""
    labels = {
        0: "[dim]0 (same)[/dim]",
        1: "[green]1 (adjacent)[/green]",
        2: "[blue]2 (moderate)[/blue]",
        3: "[yellow]3 (far)[/yellow]",
        4: "[red bold]4 (maximum)[/red bold]",
    }
    return labels.get(d, str(d))
