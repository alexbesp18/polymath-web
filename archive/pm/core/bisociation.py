"""Bisociation pairing for Polymath Engine.

Generates unexpected cross-domain pairings to force novel insights.
"""

import random
from dataclasses import dataclass
from typing import Optional

from pm.core.domain import Domain, DomainStatus
from pm.data.distances import get_branch_distance, find_distant_domains


@dataclass
class BisociationPair:
    """A pairing of two domains for bisociative thinking."""

    anchor_domain: Domain
    distant_domain: Domain
    distance: int
    synthesis_prompt: str
    why_paired: str


# Synthesis prompts to guide bisociative thinking
SYNTHESIS_PROMPTS = [
    "What mechanism from {anchor} could explain an unsolved problem in {distant}?",
    "What would a {anchor} expert find most confusing about {distant}?",
    "If {distant} practitioners used {anchor}'s methods, what would they discover?",
    "What assumption in {distant} would {anchor} challenge first?",
    "How would you explain {anchor}'s core insight using only {distant}'s vocabulary?",
    "What would break if you applied {anchor}'s logic to {distant}'s domain?",
    "Where is the hidden isomorphism between {anchor} and {distant}?",
    "What does {anchor} measure that {distant} ignores?",
    "If {anchor} and {distant} merged, what new field would emerge?",
    "What would {anchor} practitioners do differently if they knew {distant}?",
    "What blind spot does {anchor} have that {distant} could illuminate?",
    "What controversy in {distant} would {anchor} resolve trivially?",
    "What tool from {anchor} would be revolutionary in {distant}?",
    "Where does {anchor}'s framework fail when applied to {distant}?",
    "What would a textbook written from both perspectives look like?",
]


def generate_bisociation_pair(
    domains: list[Domain],
    recent_domain_ids: list[str] = None,
    min_distance: int = 3,
    anchor_domain_id: Optional[str] = None,
) -> Optional[BisociationPair]:
    """Generate a bisociation pairing for forced creative thinking.

    Algorithm:
    1. Select anchor from strength domains (expert or high books_read)
    2. Find distant domains (distance >= min_distance from anchor)
    3. Apply bonuses for untouched, no shared isomorphisms
    4. Randomly select from top 5 candidates
    5. Generate synthesis prompt

    Args:
        domains: All domains from the vault.
        recent_domain_ids: Domain IDs to exclude (read recently).
        min_distance: Minimum branch distance for pairing.
        anchor_domain_id: Optional specific anchor domain to use.

    Returns:
        BisociationPair or None if no valid pairing found.
    """
    if recent_domain_ids is None:
        recent_domain_ids = []

    # Select anchor domain
    anchor = None
    if anchor_domain_id:
        anchor = next((d for d in domains if d.domain_id == anchor_domain_id), None)

    if anchor is None:
        # Find strength domains (expert or high progress)
        strength_domains = [
            d for d in domains
            if (d.is_expert or d.books_read >= 2)
            and d.domain_id not in recent_domain_ids
        ]

        if not strength_domains:
            # Fall back to hub domains
            strength_domains = [d for d in domains if d.is_hub]

        if not strength_domains:
            return None

        anchor = random.choice(strength_domains)

    # Find distant domains
    all_domain_ids = [d.domain_id for d in domains]
    distant_candidates = find_distant_domains(
        anchor.domain_id,
        all_domain_ids,
        min_distance=min_distance,
    )

    if not distant_candidates:
        # Reduce distance requirement and try again
        distant_candidates = find_distant_domains(
            anchor.domain_id,
            all_domain_ids,
            min_distance=2,
        )

    if not distant_candidates:
        return None

    # Filter out recent and build scored candidates
    scored_candidates = []
    for domain_id, distance in distant_candidates:
        if domain_id in recent_domain_ids:
            continue

        domain = next((d for d in domains if d.domain_id == domain_id), None)
        if domain is None:
            continue

        # Calculate score (higher is better)
        score = distance * 10  # Base score from distance

        # Bonus for untouched domains
        if domain.status == DomainStatus.UNTOUCHED:
            score += 5

        # Bonus for domains with 0 books read
        if domain.books_read == 0:
            score += 3

        scored_candidates.append((domain, distance, score))

    if not scored_candidates:
        return None

    # Sort by score descending
    scored_candidates.sort(key=lambda x: -x[2])

    # Randomly select from top 5
    top_n = min(5, len(scored_candidates))
    selected = random.choice(scored_candidates[:top_n])
    distant_domain = selected[0]
    distance = selected[1]

    # Generate synthesis prompt
    prompt_template = random.choice(SYNTHESIS_PROMPTS)
    prompt = prompt_template.format(
        anchor=anchor.domain_name,
        distant=distant_domain.domain_name,
    )

    return BisociationPair(
        anchor_domain=anchor,
        distant_domain=distant_domain,
        distance=distance,
        synthesis_prompt=prompt,
        why_paired=_generate_pairing_reason(anchor, distant_domain, distance),
    )


def _generate_pairing_reason(
    anchor: Domain,
    distant: Domain,
    distance: int,
) -> str:
    """Generate a human-readable reason for the pairing."""
    reasons = []

    if anchor.is_expert:
        reasons.append(f"Your expertise in {anchor.domain_name}")
    elif anchor.books_read >= 2:
        reasons.append(f"Your progress in {anchor.domain_name} ({anchor.books_read} books)")
    elif anchor.is_hub:
        reasons.append(f"Hub domain {anchor.domain_name}")

    if distant.status == DomainStatus.UNTOUCHED:
        reasons.append(f"completely unexplored {distant.domain_name}")
    else:
        reasons.append(f"distant {distant.domain_name}")

    reasons.append(f"maximum conceptual distance ({distance})")

    return " + ".join(reasons)


def get_all_max_distance_pairs(
    domains: list[Domain],
) -> list[tuple[Domain, Domain, int]]:
    """Get all domain pairs at maximum distance (4).

    Useful for showing what maximum-distance pairings are possible.

    Args:
        domains: All domains.

    Returns:
        List of (domain_a, domain_b, distance) tuples.
    """
    pairs = []
    seen = set()

    for domain_a in domains:
        for domain_b in domains:
            if domain_a.domain_id == domain_b.domain_id:
                continue

            # Avoid duplicates
            pair_key = tuple(sorted([domain_a.domain_id, domain_b.domain_id]))
            if pair_key in seen:
                continue
            seen.add(pair_key)

            distance = get_branch_distance(domain_a.branch_id, domain_b.branch_id)
            if distance == 4:
                pairs.append((domain_a, domain_b, distance))

    return pairs


def suggest_synthesis_questions(
    anchor: Domain,
    distant: Domain,
    num_questions: int = 3,
) -> list[str]:
    """Generate multiple synthesis questions for a pairing.

    Args:
        anchor: The anchor domain (user's strength).
        distant: The distant domain to connect.
        num_questions: Number of questions to generate.

    Returns:
        List of synthesis question strings.
    """
    questions = []
    prompts = random.sample(SYNTHESIS_PROMPTS, min(num_questions, len(SYNTHESIS_PROMPTS)))

    for template in prompts:
        question = template.format(
            anchor=anchor.domain_name,
            distant=distant.domain_name,
        )
        questions.append(question)

    return questions
