"""pm-pair command - Generate bisociation pairing."""

import click
from rich.console import Console
from rich.panel import Panel

from pm.config import Config
from pm.core.bisociation import generate_bisociation_pair, suggest_synthesis_questions
from pm.core.vault import Vault


console = Console()


@click.command()
@click.option(
    "--anchor",
    "-a",
    help="Specific anchor domain ID (e.g., 07.09).",
)
@click.option(
    "--min-distance",
    "-d",
    type=int,
    default=3,
    help="Minimum distance for pairing (default: 3).",
)
@click.option(
    "--questions",
    "-q",
    type=int,
    default=3,
    help="Number of synthesis questions to generate.",
)
@click.pass_context
def pair(ctx: click.Context, anchor: str, min_distance: int, questions: int) -> None:
    """Generate a bisociation pairing for creative thinking.

    Pairs one of your strength domains with a maximally distant
    domain to force unexpected connections and insights.
    """
    config: Config = ctx.obj.get("config", Config.load()) if ctx.obj else Config.load()
    vault = Vault(config.vault_path)

    if not vault.exists():
        console.print("[red]Vault not found.[/red] Run [cyan]pm init[/cyan] first.")
        return

    # Load domains and recent logs
    domains = vault.load_all_domains()
    recent_logs = vault.load_recent_logs(days=14)
    recent_domain_ids = [log.domain_id for log in recent_logs]

    # Generate pairing
    pairing = generate_bisociation_pair(
        domains=domains,
        recent_domain_ids=recent_domain_ids,
        min_distance=min_distance,
        anchor_domain_id=anchor,
    )

    if pairing is None:
        console.print("[yellow]Could not generate pairing.[/yellow]")
        console.print("Try reducing --min-distance or specifying an --anchor.")
        return

    # Display pairing
    console.print()

    anchor_d = pairing.anchor_domain
    distant_d = pairing.distant_domain

    content = f"""[bold cyan]Anchor (Your Strength)[/bold cyan]
  {anchor_d.domain_id} — {anchor_d.domain_name}
  [dim]Branch: {anchor_d.branch_name}[/dim]
  [dim]Books read: {anchor_d.books_read}[/dim]

[bold yellow]Distant Domain[/bold yellow]
  {distant_d.domain_id} — {distant_d.domain_name}
  [dim]Branch: {distant_d.branch_name}[/dim]
  [dim]Books read: {distant_d.books_read}[/dim]

[bold]Conceptual Distance:[/bold] [green]{pairing.distance}[/green] (max: 4)

[bold]Why paired:[/bold]
  {pairing.why_paired}"""

    console.print(
        Panel(
            content,
            title="🎲 Bisociation Pairing",
            border_style="magenta",
        )
    )

    # Synthesis prompt
    console.print()
    console.print(
        Panel(
            f"[italic]{pairing.synthesis_prompt}[/italic]",
            title="💡 Synthesis Prompt",
            border_style="yellow",
        )
    )

    # Additional questions
    if questions > 1:
        additional = suggest_synthesis_questions(anchor_d, distant_d, questions)
        console.print()
        console.print("[bold]Additional synthesis questions:[/bold]")
        for i, q in enumerate(additional, 1):
            console.print(f"  {i}. {q}")

    console.print()
    console.print("[dim]Use these prompts during or after reading to force connections.[/dim]")
    console.print("[dim]Capture insights in your daily log or isomorphism notes.[/dim]")
    console.print()
