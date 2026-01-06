"""pm-next command - Get next reading recommendation."""

import click
from rich.console import Console
from rich.panel import Panel

from pm.config import Config
from pm.core.traversal import TraversalEngine, TraversalPhase
from pm.core.vault import Vault


console = Console()


@click.command()
@click.option(
    "--phase",
    "-p",
    type=click.Choice(["hub", "problem", "bisociation"]),
    help="Override current traversal phase.",
)
@click.option(
    "--distant",
    "-d",
    is_flag=True,
    help="Force a distant domain recommendation.",
)
@click.pass_context
def next_cmd(ctx: click.Context, phase: str, distant: bool) -> None:
    """Get the next reading recommendation.

    Uses the traversal engine to recommend what domain and
    function slot to read next based on your current phase.
    """
    config: Config = ctx.obj.get("config", Config.load()) if ctx.obj else Config.load()
    vault = Vault(config.vault_path)

    if not vault.exists():
        console.print("[red]Vault not found.[/red] Run [cyan]pm init[/cyan] first.")
        return

    # Load domains and recent logs
    domains = vault.load_all_domains()
    recent_logs = vault.load_recent_logs(days=config.traversal.max_domain_repeat_window)
    recent_domain_ids = [log.domain_id for log in recent_logs]

    # Create traversal engine
    engine = TraversalEngine(config.traversal)

    # Set phase if specified
    if phase:
        phase_map = {
            "hub": TraversalPhase.HUB_COMPLETION,
            "problem": TraversalPhase.PROBLEM_DRIVEN,
            "bisociation": TraversalPhase.BISOCIATION,
        }
        engine.set_phase(phase_map[phase])

    # Get week day for interleave logic
    from datetime import date
    week_day = date.today().weekday()

    # Force distant if requested
    if distant:
        rec = engine._find_distant_domain(domains, recent_domain_ids)
    else:
        rec = engine.recommend_next(domains, recent_domain_ids, week_day)

    if rec is None:
        console.print("[yellow]No recommendation available.[/yellow]")
        console.print("All hubs may be complete or on cooldown.")
        return

    # Display recommendation
    console.print()

    # Build panel content
    content = f"""[bold cyan]{rec.domain.domain_id}[/bold cyan] — [bold]{rec.domain.domain_name}[/bold]
[dim]Branch: {rec.domain.branch_name}[/dim]

[bold]Next slot:[/bold] [green]{rec.slot}[/green]
[bold]Phase:[/bold] {rec.phase.value}
[bold]Books read:[/bold] {rec.domain.books_read}

[bold]Reason:[/bold]
{rec.reason}"""

    if rec.is_distant_interleave:
        content += f"""

[bold yellow]🎲 Distant Interleave[/bold yellow]
Distance from your strengths: {rec.distance_from_strength}"""

    title = "📚 Next Reading Recommendation"
    if rec.is_distant_interleave:
        title = "🌍 Distant Domain Exploration"

    console.print(
        Panel(
            content,
            title=title,
            border_style="green" if not rec.is_distant_interleave else "yellow",
        )
    )

    # Show domain description
    if rec.domain.description:
        console.print(f"\n[dim]{rec.domain.description}[/dim]")

    # Hub books recommendation if this is a hub
    if rec.domain.is_hub:
        from pm.data.hub_books import get_books_by_slot
        books = get_books_by_slot(rec.domain.domain_id, rec.slot.lower())
        if books:
            console.print("\n[bold]Recommended books for this slot:[/bold]")
            for book in books[:3]:
                console.print(f"  • {book.title} by {book.author}")
                console.print(f"    [dim]{book.why}[/dim]")

    console.print()
    console.print("[dim]Log your session with:[/dim] [cyan]pm log[/cyan]")
    console.print()
