"""pm-connections command - Show domain connections and isomorphisms."""

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from pm.config import Config
from pm.core.vault import Vault
from pm.data.distances import BRANCH_NAMES, get_branch_distance
from pm.data.domains import DOMAINS, get_domain_by_id


console = Console()


# Known isomorphisms - concepts that appear across domains
KNOWN_ISOMORPHISMS = {
    "entropy": {
        "domains": ["01.02", "03.07", "05.01", "09.02"],
        "names": {
            "01.02": "Thermodynamic entropy",
            "03.07": "Information entropy (Shannon)",
            "05.01": "Social entropy (disorder)",
            "09.02": "Market entropy (inefficiency)",
        },
        "description": "Measure of disorder, uncertainty, or information content",
    },
    "equilibrium": {
        "domains": ["01.01", "02.02", "05.01", "03.09"],
        "names": {
            "01.01": "Mechanical equilibrium",
            "02.02": "Ecological equilibrium",
            "05.01": "Economic equilibrium",
            "03.09": "Nash equilibrium",
        },
        "description": "Stable state where forces/pressures are balanced",
    },
    "fitness": {
        "domains": ["02.04", "07.09", "09.02", "03.10"],
        "names": {
            "02.04": "Biological fitness (reproduction)",
            "07.09": "Fitness function (ML optimization)",
            "09.02": "Market fitness (competitive advantage)",
            "03.10": "Decision fitness (utility)",
        },
        "description": "Measure of adaptation/optimization success",
    },
    "network_effects": {
        "domains": ["03.06", "05.01", "09.02", "07.10"],
        "names": {
            "03.06": "Graph connectivity",
            "05.01": "Social capital",
            "09.02": "Platform economics",
            "07.10": "Network topology",
        },
        "description": "Value increases with connections/participants",
    },
    "feedback_loops": {
        "domains": ["07.14", "02.02", "05.01", "04.01"],
        "names": {
            "07.14": "Control systems feedback",
            "02.02": "Ecological feedback",
            "05.01": "Economic feedback (boom/bust)",
            "04.01": "Cognitive feedback",
        },
        "description": "Output affects input, creating self-reinforcing or self-correcting dynamics",
    },
    "phase_transitions": {
        "domains": ["01.02", "05.07", "09.02", "04.05"],
        "names": {
            "01.02": "Physical phase transitions",
            "05.07": "Social tipping points",
            "09.02": "Market regime changes",
            "04.05": "Cognitive state changes",
        },
        "description": "Sudden qualitative changes at critical thresholds",
    },
    "selection_pressure": {
        "domains": ["02.04", "09.02", "05.06", "06.04"],
        "names": {
            "02.04": "Natural selection",
            "09.02": "Market selection",
            "05.06": "Organizational selection",
            "06.04": "Cultural selection",
        },
        "description": "Environmental forces that favor certain variants over others",
    },
    "signal_noise": {
        "domains": ["03.07", "07.06", "09.02", "04.01"],
        "names": {
            "03.07": "Information signal/noise",
            "07.06": "Telecommunications SNR",
            "09.02": "Market signals",
            "04.01": "Cognitive signal detection",
        },
        "description": "Distinguishing meaningful patterns from random variation",
    },
}


@click.command()
@click.argument("domain_id", required=False)
@click.option(
    "--isomorphisms",
    "-i",
    is_flag=True,
    help="Show known isomorphisms (cross-domain concepts).",
)
@click.option(
    "--adjacent",
    "-a",
    is_flag=True,
    help="Show adjacent domains (distance 1).",
)
@click.option(
    "--distant",
    "-d",
    is_flag=True,
    help="Show distant domains (distance 3-4).",
)
@click.pass_context
def connections(
    ctx: click.Context,
    domain_id: str | None,
    isomorphisms: bool,
    adjacent: bool,
    distant: bool,
) -> None:
    """Show connections between domains and isomorphisms.

    \b
    Examples:
      pm-connections 01.02             # Show connections for a domain
      pm-connections --isomorphisms    # Show all known isomorphisms
      pm-connections 01.02 --adjacent  # Show nearby domains
      pm-connections 01.02 --distant   # Show far domains

    Isomorphisms are concepts that appear across multiple domains under
    different names - the key to bisociative thinking.
    """
    if isomorphisms or (domain_id is None and not adjacent and not distant):
        if domain_id:
            _show_domain_isomorphisms(domain_id)
        else:
            _show_all_isomorphisms()
        return

    if domain_id is None:
        console.print("[yellow]Specify a domain ID to see its connections.[/yellow]")
        console.print("\n[dim]Examples:[/dim]")
        console.print("  pm-connections 01.02")
        console.print("  pm-connections 01.02 --adjacent")
        console.print("  pm-connections --isomorphisms")
        return

    if adjacent:
        _show_adjacent_domains(domain_id)
    elif distant:
        _show_distant_domains(domain_id)
    else:
        _show_domain_connections(domain_id)


def _show_all_isomorphisms() -> None:
    """Show all known isomorphisms."""
    console.print()
    console.print("[bold]Known Isomorphisms[/bold]")
    console.print("[dim]Concepts appearing across domains under different names[/dim]")
    console.print()

    for name, data in sorted(KNOWN_ISOMORPHISMS.items()):
        console.print(f"[bold cyan]{name.replace('_', ' ').title()}[/bold cyan]")
        console.print(f"  [dim]{data['description']}[/dim]")
        console.print()

        for domain_id in data["domains"]:
            domain = get_domain_by_id(domain_id)
            if domain:
                local_name = data["names"].get(domain_id, domain["domain_name"])
                console.print(f"    [yellow]{domain_id}[/yellow] {domain['domain_name']}")
                console.print(f"         → {local_name}")

        console.print()


def _show_domain_isomorphisms(domain_id: str) -> None:
    """Show isomorphisms for a specific domain."""
    domain = get_domain_by_id(domain_id)
    if domain is None:
        console.print(f"[red]Unknown domain: {domain_id}[/red]")
        return

    console.print()
    console.print(f"[bold]Isomorphisms for {domain_id} — {domain['domain_name']}[/bold]")
    console.print()

    found = []
    for name, data in KNOWN_ISOMORPHISMS.items():
        if domain_id in data["domains"]:
            found.append((name, data))

    if not found:
        console.print("[dim]No known isomorphisms catalogued for this domain.[/dim]")
        console.print("[dim]Consider exploring connections with distant domains.[/dim]")
        return

    for name, data in found:
        console.print(f"[bold cyan]{name.replace('_', ' ').title()}[/bold cyan]")
        console.print(f"  [dim]{data['description']}[/dim]")
        local_name = data["names"].get(domain_id, "")
        if local_name:
            console.print(f"  [yellow]Local name:[/yellow] {local_name}")
        console.print()
        console.print("  [bold]Also appears in:[/bold]")

        for other_id in data["domains"]:
            if other_id != domain_id:
                other = get_domain_by_id(other_id)
                if other:
                    other_name = data["names"].get(other_id, "")
                    branch = other_id.split(".")[0]
                    dist = get_branch_distance(domain_id.split(".")[0], branch)
                    console.print(
                        f"    [{_dist_color(dist)}]{other_id}[/{_dist_color(dist)}] "
                        f"{other['domain_name']} → {other_name}"
                    )
        console.print()


def _show_domain_connections(domain_id: str) -> None:
    """Show all connections for a domain."""
    domain = get_domain_by_id(domain_id)
    if domain is None:
        console.print(f"[red]Unknown domain: {domain_id}[/red]")
        return

    branch_id = domain_id.split(".")[0]

    console.print()
    console.print(Panel(
        f"[bold]{domain_id}[/bold] — {domain['domain_name']}\n"
        f"[dim]Branch: {BRANCH_NAMES.get(branch_id, branch_id)}[/dim]",
        title="🔗 Domain Connections",
        border_style="blue",
    ))
    console.print()

    # Same branch
    console.print("[bold]Same Branch (distance 0):[/bold]")
    same_branch = [d for d in DOMAINS if str(d["branch_id"]).zfill(2) == branch_id
                   and d["domain_id"] != domain_id]
    if same_branch:
        for d in same_branch[:5]:
            console.print(f"  [dim]{d['domain_id']}[/dim] {d['domain_name']}")
        if len(same_branch) > 5:
            console.print(f"  [dim]... and {len(same_branch) - 5} more[/dim]")
    console.print()

    # Adjacent branches
    console.print("[bold]Adjacent Branches (distance 1):[/bold]")
    adjacent = []
    for bid in BRANCH_NAMES:
        if get_branch_distance(branch_id, bid) == 1:
            adjacent.append(bid)

    for bid in sorted(adjacent):
        console.print(f"  [green]{bid}[/green] {BRANCH_NAMES[bid]}")
    console.print()

    # Distant branches
    console.print("[bold]Distant Branches (distance 3-4):[/bold]")
    distant = []
    for bid in BRANCH_NAMES:
        d = get_branch_distance(branch_id, bid)
        if d >= 3:
            distant.append((bid, d))

    distant.sort(key=lambda x: (-x[1], x[0]))
    for bid, d in distant:
        color = "red bold" if d == 4 else "yellow"
        console.print(f"  [{color}]{bid}[/{color}] {BRANCH_NAMES[bid]} (distance {d})")
    console.print()

    # Isomorphisms
    domain_isos = []
    for name, data in KNOWN_ISOMORPHISMS.items():
        if domain_id in data["domains"]:
            domain_isos.append(name)

    if domain_isos:
        console.print(f"[bold]Known Isomorphisms:[/bold] {len(domain_isos)}")
        for name in domain_isos:
            console.print(f"  [cyan]{name.replace('_', ' ').title()}[/cyan]")
        console.print()


def _show_adjacent_domains(domain_id: str) -> None:
    """Show domains in adjacent branches."""
    domain = get_domain_by_id(domain_id)
    if domain is None:
        console.print(f"[red]Unknown domain: {domain_id}[/red]")
        return

    branch_id = domain_id.split(".")[0]

    console.print()
    console.print(f"[bold]Adjacent Domains for {domain_id} — {domain['domain_name']}[/bold]")
    console.print()

    adjacent_branches = [
        bid for bid in BRANCH_NAMES
        if get_branch_distance(branch_id, bid) == 1
    ]

    for bid in sorted(adjacent_branches):
        console.print(f"[bold green]{bid} — {BRANCH_NAMES[bid]}[/bold green]")
        branch_domains = [d for d in DOMAINS if str(d["branch_id"]).zfill(2) == bid]
        for d in branch_domains[:3]:
            hub = "⭐" if d.get("is_hub") else ""
            console.print(f"  {d['domain_id']} {d['domain_name']} {hub}")
        if len(branch_domains) > 3:
            console.print(f"  [dim]... and {len(branch_domains) - 3} more[/dim]")
        console.print()


def _show_distant_domains(domain_id: str) -> None:
    """Show domains in distant branches."""
    domain = get_domain_by_id(domain_id)
    if domain is None:
        console.print(f"[red]Unknown domain: {domain_id}[/red]")
        return

    branch_id = domain_id.split(".")[0]

    console.print()
    console.print(f"[bold]Distant Domains for {domain_id} — {domain['domain_name']}[/bold]")
    console.print("[dim]Best candidates for bisociative pairing[/dim]")
    console.print()

    distant_branches = []
    for bid in BRANCH_NAMES:
        d = get_branch_distance(branch_id, bid)
        if d >= 3:
            distant_branches.append((bid, d))

    distant_branches.sort(key=lambda x: (-x[1], x[0]))

    for bid, dist in distant_branches:
        color = "red bold" if dist == 4 else "yellow"
        console.print(f"[{color}]{bid} — {BRANCH_NAMES[bid]} (distance {dist})[/{color}]")
        branch_domains = [d for d in DOMAINS if str(d["branch_id"]).zfill(2) == bid]
        for d in branch_domains[:3]:
            hub = "⭐" if d.get("is_hub") else ""
            console.print(f"  {d['domain_id']} {d['domain_name']} {hub}")
        if len(branch_domains) > 3:
            console.print(f"  [dim]... and {len(branch_domains) - 3} more[/dim]")
        console.print()


def _dist_color(d: int) -> str:
    """Get color for distance value."""
    if d == 0:
        return "dim"
    elif d == 1:
        return "green"
    elif d == 2:
        return "blue"
    elif d == 3:
        return "yellow"
    else:
        return "red bold"
