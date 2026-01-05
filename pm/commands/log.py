"""pm-log command - Log a reading session."""

from datetime import date

import click
from rich.console import Console
from rich.panel import Panel

from pm.config import Config
from pm.core.daily_log import DailyLog
from pm.core.domain import DomainStatus
from pm.core.vault import Vault
from pm.data.domains import get_domain_by_id
from pm.data.templates import DAILY_LOG_TEMPLATE


console = Console()


@click.command()
@click.option(
    "--domain",
    "-d",
    required=True,
    help="Domain ID (e.g., 02.04).",
)
@click.option(
    "--book",
    "-b",
    required=True,
    help="Book title.",
)
@click.option(
    "--slot",
    "-s",
    type=click.Choice(["FND", "ORT", "HRS", "FRN", "HST", "BRG"]),
    help="Function slot (auto-detected if not specified).",
)
@click.option(
    "--pages",
    "-p",
    type=int,
    default=0,
    help="Pages read.",
)
@click.option(
    "--time",
    "-t",
    type=int,
    default=0,
    help="Reading time in minutes.",
)
@click.option(
    "--phase",
    type=click.Choice(["hub-completion", "problem-driven", "bisociation"]),
    default="hub-completion",
    help="Current traversal phase.",
)
@click.pass_context
def log(
    ctx: click.Context,
    domain: str,
    book: str,
    slot: str,
    pages: int,
    time: int,
    phase: str,
) -> None:
    """Log a reading session and update domain progress.

    Creates a daily log file and updates the domain's book count.
    """
    config: Config = ctx.obj.get("config", Config.load()) if ctx.obj else Config.load()
    vault = Vault(config.vault_path)

    if not vault.exists():
        console.print("[red]Vault not found.[/red] Run [cyan]pm init[/cyan] first.")
        return

    # Validate domain
    domain_data = get_domain_by_id(domain)
    if domain_data is None:
        console.print(f"[red]Unknown domain ID: {domain}[/red]")
        return

    # Load domain from vault
    try:
        domain_obj = vault.load_domain(domain)
    except Exception:
        # Domain file might not exist yet, create from data
        from pm.core.domain import Domain
        domain_obj = Domain(
            domain_id=domain,
            domain_name=domain_data["domain_name"],
            branch_id=domain_data["branch_id"],
            branch_name=domain_data["branch_name"],
            description=domain_data.get("description", ""),
            is_hub=domain_data.get("is_hub", False),
            is_expert=domain_data.get("is_expert", False),
        )

    # Auto-detect slot if not specified
    if slot is None:
        slot = domain_obj.next_slot().value
        console.print(f"[dim]Auto-detected slot: {slot}[/dim]")

    # Create daily log
    today = date.today()
    daily_log = DailyLog(
        log_date=today,
        domain_id=domain,
        domain_name=domain_obj.domain_name,
        book_title=book,
        function_slot=slot,
        pages_read=pages,
        reading_time_minutes=time,
        phase=phase,
    )

    # Generate log content from template
    branch_folder = f"{domain_obj.branch_id}-{domain_obj.branch_name.replace(' ', '-')}"
    domain_file = f"{domain}-{domain_obj.domain_name.replace(' ', '-').replace('/', '-')}.md"

    content = DAILY_LOG_TEMPLATE.format(
        date=today.isoformat(),
        domain_name=domain_obj.domain_name,
        domain_id=domain,
        book_title=book,
        function_slot=slot,
        phase=phase,
        branch_folder=branch_folder,
        domain_file=domain_file,
    )

    # Save daily log
    log_path = vault.save_daily_log(daily_log, content)

    # Update domain
    domain_obj.books_read += 1
    domain_obj.last_read = today

    # Update status based on books read
    if domain_obj.status == DomainStatus.UNTOUCHED:
        domain_obj.status = DomainStatus.SURVEYING
    elif domain_obj.books_read >= 2 and domain_obj.status == DomainStatus.SURVEYING:
        domain_obj.status = DomainStatus.SURVEYED
    elif domain_obj.books_read >= 4 and domain_obj.status == DomainStatus.SURVEYED:
        domain_obj.status = DomainStatus.DEEPENING

    vault.save_domain(domain_obj)

    # Display confirmation
    console.print()
    console.print(
        Panel(
            f"""[bold green]Reading session logged![/bold green]

[bold]Date:[/bold] {today.isoformat()}
[bold]Domain:[/bold] {domain} — {domain_obj.domain_name}
[bold]Book:[/bold] {book}
[bold]Slot:[/bold] {slot}
[bold]Pages:[/bold] {pages if pages else "not specified"}
[bold]Time:[/bold] {time if time else "not specified"} minutes

[bold]Domain updated:[/bold]
  Books read: {domain_obj.books_read}
  Status: {domain_obj.status.value}

[bold]Log file:[/bold]
  {log_path}
""",
            title="📝 Session Logged",
            border_style="green",
        )
    )

    # Show next slot suggestion
    next_slot = domain_obj.next_slot()
    console.print(f"[dim]Next slot for this domain: {next_slot}[/dim]")
    console.print()
