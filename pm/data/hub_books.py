"""Hub domain book recommendations for Polymath Engine.

Curated book lists for priority hub domains. Each hub has books
organized by function slot (foundation, heresy, frontier, bridge).
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class BookRecommendation:
    """A recommended book for a domain."""

    title: str
    author: str
    year: int
    why: str
    density: str  # low, medium, high, very high
    pages: int = 0
    slot: str = "foundation"  # foundation, heresy, frontier, bridge
    bridge_to: list[str] | None = None  # domain IDs this book bridges to


# Hub book recommendations organized by domain_id
HUB_BOOKS: dict[str, list[BookRecommendation]] = {
    # Evolutionary Biology (02.04)
    "02.04": [
        BookRecommendation(
            title="The Selfish Gene",
            author="Richard Dawkins",
            year=1976,
            why="Gene-centered view; introduces replicator/vehicle distinction",
            density="medium",
            pages=360,
            slot="foundation",
        ),
        BookRecommendation(
            title="Darwin's Dangerous Idea",
            author="Daniel Dennett",
            year=1995,
            why="Evolution as universal acid; philosophical implications",
            density="high",
            pages=586,
            slot="foundation",
        ),
        BookRecommendation(
            title="The Extended Phenotype",
            author="Richard Dawkins",
            year=1982,
            why="Challenges organism-centered thinking",
            density="high",
            pages=307,
            slot="heresy",
        ),
        BookRecommendation(
            title="Not By Genes Alone",
            author="Peter Richerson, Robert Boyd",
            year=2005,
            why="Cultural evolution challenges pure gene selection",
            density="high",
            pages=332,
            slot="heresy",
        ),
        BookRecommendation(
            title="The Origins of Order",
            author="Stuart Kauffman",
            year=1993,
            why="Self-organization + selection; complexity theory meets evolution",
            density="very high",
            pages=709,
            slot="frontier",
        ),
        BookRecommendation(
            title="The Evolution of Cooperation",
            author="Robert Axelrod",
            year=1984,
            why="Game theory + evolution; Prisoner's Dilemma tournaments",
            density="medium",
            pages=241,
            slot="bridge",
            bridge_to=["03.09", "05.08"],
        ),
    ],
    # Thermodynamics (01.02)
    "01.02": [
        BookRecommendation(
            title="The Second Law",
            author="Peter Atkins",
            year=1984,
            why="Accessible introduction to entropy and its implications",
            density="medium",
            pages=230,
            slot="foundation",
        ),
        BookRecommendation(
            title="An Introduction to Thermal Physics",
            author="Daniel Schroeder",
            year=2000,
            why="Textbook; statistical mechanics foundation",
            density="high",
            pages=422,
            slot="foundation",
        ),
        BookRecommendation(
            title="Into the Cool",
            author="Eric Schneider, Dorion Sagan",
            year=2005,
            why="Non-equilibrium thermodynamics; life as dissipative structure",
            density="medium",
            pages=362,
            slot="heresy",
        ),
        BookRecommendation(
            title="Information, Physics, and Computation",
            author="Marc Mézard, Andrea Montanari",
            year=2009,
            why="Statistical physics meets information theory meets CS",
            density="very high",
            pages=568,
            slot="frontier",
        ),
        BookRecommendation(
            title="The Information",
            author="James Gleick",
            year=2011,
            why="History connecting thermodynamics to information theory",
            density="low",
            pages=526,
            slot="bridge",
            bridge_to=["03.07", "06.15"],
        ),
    ],
    # Combinatorics Graph Theory / Network Theory (03.06)
    "03.06": [
        BookRecommendation(
            title="Networks: An Introduction",
            author="Mark Newman",
            year=2010,
            why="Comprehensive textbook; social, biological, technical networks",
            density="high",
            pages=772,
            slot="foundation",
        ),
        BookRecommendation(
            title="Linked",
            author="Albert-László Barabási",
            year=2002,
            why="Accessible intro; scale-free networks, hubs",
            density="low",
            pages=280,
            slot="foundation",
        ),
        BookRecommendation(
            title="Six Degrees",
            author="Duncan Watts",
            year=2003,
            why="Challenges simple scale-free models; small world nuances",
            density="medium",
            pages=374,
            slot="heresy",
        ),
        BookRecommendation(
            title="Network Science",
            author="Albert-László Barabási",
            year=2016,
            why="Modern textbook; dynamic networks, spreading",
            density="high",
            pages=456,
            slot="frontier",
        ),
        BookRecommendation(
            title="Social and Economic Networks",
            author="Matthew Jackson",
            year=2008,
            why="Game theory on networks; economic applications",
            density="high",
            pages=504,
            slot="bridge",
            bridge_to=["03.09", "05.01"],
        ),
    ],
    # Probability Statistics (03.04)
    "03.04": [
        BookRecommendation(
            title="Probability Theory: The Logic of Science",
            author="E.T. Jaynes",
            year=2003,
            why="Bayesian foundations; probability as extended logic",
            density="very high",
            pages=727,
            slot="foundation",
        ),
        BookRecommendation(
            title="All of Statistics",
            author="Larry Wasserman",
            year=2004,
            why="Concise graduate overview; frequentist and Bayesian",
            density="high",
            pages=442,
            slot="foundation",
        ),
        BookRecommendation(
            title="The Black Swan",
            author="Nassim Taleb",
            year=2007,
            why="Challenges normal distribution assumptions; fat tails",
            density="medium",
            pages=366,
            slot="heresy",
        ),
        BookRecommendation(
            title="Information Theory, Inference, and Learning Algorithms",
            author="David MacKay",
            year=2003,
            why="Connects probability to information theory and ML",
            density="high",
            pages=628,
            slot="bridge",
            bridge_to=["03.07", "07.09"],
        ),
    ],
    # Information Theory (03.07)
    "03.07": [
        BookRecommendation(
            title="Elements of Information Theory",
            author="Thomas Cover, Joy Thomas",
            year=1991,
            why="Standard textbook; entropy, channels, coding",
            density="very high",
            pages=748,
            slot="foundation",
        ),
        BookRecommendation(
            title="The Information",
            author="James Gleick",
            year=2011,
            why="Historical and accessible; Shannon, Babbage, Turing",
            density="low",
            pages=526,
            slot="foundation",
        ),
        BookRecommendation(
            title="Entropy and Information Theory",
            author="Robert Gray",
            year=1990,
            why="Connects to probability and ergodic theory",
            density="very high",
            pages=332,
            slot="bridge",
            bridge_to=["03.04", "01.02"],
        ),
    ],
    # Game Theory (03.09)
    "03.09": [
        BookRecommendation(
            title="Game Theory",
            author="Drew Fudenberg, Jean Tirole",
            year=1991,
            why="Standard graduate text; complete coverage",
            density="very high",
            pages=579,
            slot="foundation",
        ),
        BookRecommendation(
            title="Thinking Strategically",
            author="Avinash Dixit, Barry Nalebuff",
            year=1991,
            why="Accessible intro; business applications",
            density="low",
            pages=393,
            slot="foundation",
        ),
        BookRecommendation(
            title="Behavioral Game Theory",
            author="Colin Camerer",
            year=2003,
            why="Challenges rationality assumptions; experimental evidence",
            density="high",
            pages=550,
            slot="heresy",
        ),
        BookRecommendation(
            title="Algorithmic Game Theory",
            author="Nisan et al.",
            year=2007,
            why="Computational complexity of game-theoretic solutions",
            density="very high",
            pages=754,
            slot="frontier",
        ),
        BookRecommendation(
            title="The Evolution of Cooperation",
            author="Robert Axelrod",
            year=1984,
            why="Game theory meets evolutionary biology",
            density="medium",
            pages=241,
            slot="bridge",
            bridge_to=["02.04"],
        ),
    ],
    # Systems Engineering (07.14)
    "07.14": [
        BookRecommendation(
            title="Thinking in Systems",
            author="Donella Meadows",
            year=2008,
            why="Accessible systems thinking primer; leverage points",
            density="low",
            pages=218,
            slot="foundation",
        ),
        BookRecommendation(
            title="Systems Engineering Handbook",
            author="INCOSE",
            year=2015,
            why="Industry standard reference; lifecycle processes",
            density="high",
            pages=290,
            slot="foundation",
        ),
        BookRecommendation(
            title="An Introduction to Cybernetics",
            author="W. Ross Ashby",
            year=1956,
            why="Classic foundation; variety, feedback, control",
            density="high",
            pages=295,
            slot="heresy",
        ),
        BookRecommendation(
            title="The Fifth Discipline",
            author="Peter Senge",
            year=1990,
            why="Systems thinking applied to organizations",
            density="medium",
            pages=445,
            slot="bridge",
            bridge_to=["09.06", "05.06"],
        ),
    ],
}


def get_hub_books(domain_id: str) -> list[BookRecommendation]:
    """Get book recommendations for a hub domain.

    Args:
        domain_id: The domain ID (e.g., "02.04")

    Returns:
        List of BookRecommendation objects, empty if not a hub.
    """
    return HUB_BOOKS.get(domain_id, [])


def get_books_by_slot(domain_id: str, slot: str) -> list[BookRecommendation]:
    """Get books for a specific slot in a hub domain.

    Args:
        domain_id: The domain ID
        slot: The function slot (foundation, heresy, frontier, bridge)

    Returns:
        List of matching BookRecommendation objects.
    """
    books = HUB_BOOKS.get(domain_id, [])
    return [b for b in books if b.slot == slot]


def get_bridge_books(domain_id: str) -> list[BookRecommendation]:
    """Get bridge books that connect to a given domain.

    Args:
        domain_id: The domain ID to find bridges to

    Returns:
        List of bridge books from any hub that bridge to this domain.
    """
    results = []
    for hub_id, books in HUB_BOOKS.items():
        for book in books:
            if book.bridge_to and domain_id in book.bridge_to:
                results.append(book)
    return results
