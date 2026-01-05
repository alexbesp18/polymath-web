"""Branch distance matrix for Polymath Engine.

Distance scale:
- 0 = same branch
- 1 = adjacent (closely related fields)
- 2 = moderate (some shared concepts)
- 3 = far (few connections)
- 4 = maximum (essentially unrelated)

Matrix is symmetric.
"""

from typing import Tuple

# Distance matrix stored as dict with branch pairs as keys
# Only upper triangle stored; lookup function handles symmetry
_BRANCH_DISTANCES_RAW = {
    # Branch 01 (Physical Sciences)
    ("01", "01"): 0,
    ("01", "02"): 1,
    ("01", "03"): 1,
    ("01", "04"): 2,
    ("01", "05"): 2,
    ("01", "06"): 3,
    ("01", "07"): 1,
    ("01", "08"): 2,
    ("01", "09"): 3,
    ("01", "10"): 3,
    ("01", "11"): 3,
    ("01", "12"): 3,
    ("01", "13"): 2,
    ("01", "14"): 2,
    ("01", "15"): 4,
    # Branch 02 (Life Sciences)
    ("02", "02"): 0,
    ("02", "03"): 2,
    ("02", "04"): 1,
    ("02", "05"): 2,
    ("02", "06"): 3,
    ("02", "07"): 2,
    ("02", "08"): 1,
    ("02", "09"): 3,
    ("02", "10"): 3,
    ("02", "11"): 3,
    ("02", "12"): 3,
    ("02", "13"): 1,
    ("02", "14"): 3,
    ("02", "15"): 4,
    # Branch 03 (Formal Sciences)
    ("03", "03"): 0,
    ("03", "04"): 2,
    ("03", "05"): 1,
    ("03", "06"): 2,
    ("03", "07"): 1,
    ("03", "08"): 2,
    ("03", "09"): 1,
    ("03", "10"): 2,
    ("03", "11"): 2,
    ("03", "12"): 2,
    ("03", "13"): 2,
    ("03", "14"): 2,
    ("03", "15"): 3,
    # Branch 04 (Mind Sciences)
    ("04", "04"): 0,
    ("04", "05"): 1,
    ("04", "06"): 2,
    ("04", "07"): 2,
    ("04", "08"): 1,
    ("04", "09"): 2,
    ("04", "10"): 1,
    ("04", "11"): 2,
    ("04", "12"): 2,
    ("04", "13"): 3,
    ("04", "14"): 3,
    ("04", "15"): 3,
    # Branch 05 (Social Sciences)
    ("05", "05"): 0,
    ("05", "06"): 1,
    ("05", "07"): 2,
    ("05", "08"): 2,
    ("05", "09"): 2,
    ("05", "10"): 2,
    ("05", "11"): 2,
    ("05", "12"): 1,
    ("05", "13"): 2,
    ("05", "14"): 3,
    ("05", "15"): 2,
    # Branch 06 (Humanities)
    ("06", "06"): 0,
    ("06", "07"): 3,
    ("06", "08"): 3,
    ("06", "09"): 2,
    ("06", "10"): 2,
    ("06", "11"): 1,
    ("06", "12"): 1,
    ("06", "13"): 3,
    ("06", "14"): 3,
    ("06", "15"): 1,
    # Branch 07 (Engineering)
    ("07", "07"): 0,
    ("07", "08"): 1,
    ("07", "09"): 2,
    ("07", "10"): 2,
    ("07", "11"): 2,
    ("07", "12"): 2,
    ("07", "13"): 2,
    ("07", "14"): 1,
    ("07", "15"): 4,
    # Branch 08 (Health Medicine)
    ("08", "08"): 0,
    ("08", "09"): 2,
    ("08", "10"): 2,
    ("08", "11"): 3,
    ("08", "12"): 2,
    ("08", "13"): 2,
    ("08", "14"): 3,
    ("08", "15"): 3,
    # Branch 09 (Business Management)
    ("09", "09"): 0,
    ("09", "10"): 2,
    ("09", "11"): 2,
    ("09", "12"): 1,
    ("09", "13"): 2,
    ("09", "14"): 2,
    ("09", "15"): 3,
    # Branch 10 (Education)
    ("10", "10"): 0,
    ("10", "11"): 2,
    ("10", "12"): 2,
    ("10", "13"): 3,
    ("10", "14"): 3,
    ("10", "15"): 2,
    # Branch 11 (Arts Design Communication)
    ("11", "11"): 0,
    ("11", "12"): 2,
    ("11", "13"): 3,
    ("11", "14"): 3,
    ("11", "15"): 2,
    # Branch 12 (Law Public Admin)
    ("12", "12"): 0,
    ("12", "13"): 2,
    ("12", "14"): 3,
    ("12", "15"): 2,
    # Branch 13 (Agriculture Environment)
    ("13", "13"): 0,
    ("13", "14"): 2,
    ("13", "15"): 3,
    # Branch 14 (Trades Applied Tech)
    ("14", "14"): 0,
    ("14", "15"): 4,
    # Branch 15 (Religion Theology)
    ("15", "15"): 0,
}


def get_branch_distance(branch_a: str, branch_b: str) -> int:
    """Get distance between two branches.

    Args:
        branch_a: Branch ID (e.g., "01", "02", "15")
        branch_b: Branch ID (e.g., "01", "02", "15")

    Returns:
        Distance 0-4 between the branches.
    """
    # Normalize branch IDs to 2-digit strings
    a = branch_a.zfill(2)
    b = branch_b.zfill(2)

    # Try direct lookup
    if (a, b) in _BRANCH_DISTANCES_RAW:
        return _BRANCH_DISTANCES_RAW[(a, b)]

    # Try reverse (matrix is symmetric)
    if (b, a) in _BRANCH_DISTANCES_RAW:
        return _BRANCH_DISTANCES_RAW[(b, a)]

    # Default to maximum distance if not found
    return 4


def get_domain_distance(
    domain_a_id: str, domain_b_id: str, shared_isomorphisms: int = 0
) -> float:
    """Calculate distance between two domains.

    Base distance is the branch distance. Shared isomorphisms reduce distance.

    Args:
        domain_a_id: Domain ID (e.g., "01.02", "02.04")
        domain_b_id: Domain ID (e.g., "01.02", "02.04")
        shared_isomorphisms: Number of shared isomorphisms (concepts appearing in both)

    Returns:
        Adjusted distance (can be fractional due to isomorphism adjustment).
    """
    branch_a = domain_a_id.split(".")[0]
    branch_b = domain_b_id.split(".")[0]

    base_distance = get_branch_distance(branch_a, branch_b)

    # Shared isomorphisms reduce distance (each reduces by 0.5)
    adjusted = base_distance - (0.5 * shared_isomorphisms)

    return max(0.0, adjusted)


def find_distant_domains(
    from_domain_id: str,
    all_domain_ids: list[str],
    min_distance: int = 3,
) -> list[Tuple[str, int]]:
    """Find domains at least min_distance away from the given domain.

    Args:
        from_domain_id: Starting domain ID
        all_domain_ids: List of all domain IDs to search
        min_distance: Minimum distance threshold (default 3)

    Returns:
        List of (domain_id, distance) tuples for domains meeting threshold.
    """
    results = []
    from_branch = from_domain_id.split(".")[0]

    for domain_id in all_domain_ids:
        if domain_id == from_domain_id:
            continue

        to_branch = domain_id.split(".")[0]
        distance = get_branch_distance(from_branch, to_branch)

        if distance >= min_distance:
            results.append((domain_id, distance))

    # Sort by distance descending, then by domain_id
    results.sort(key=lambda x: (-x[1], x[0]))

    return results


def get_max_distant_branches(from_branch: str) -> list[str]:
    """Get branches at maximum distance (4) from the given branch.

    Args:
        from_branch: Branch ID to measure from

    Returns:
        List of branch IDs at maximum distance.
    """
    max_distant = []
    from_b = from_branch.zfill(2)

    for i in range(1, 16):
        to_b = str(i).zfill(2)
        if get_branch_distance(from_b, to_b) == 4:
            max_distant.append(to_b)

    return max_distant


# Branch metadata for reference
BRANCH_NAMES = {
    "01": "Physical Sciences",
    "02": "Life Sciences",
    "03": "Formal Sciences",
    "04": "Mind Sciences",
    "05": "Social Sciences",
    "06": "Humanities",
    "07": "Engineering",
    "08": "Health Medicine",
    "09": "Business Management",
    "10": "Education",
    "11": "Arts Design Communication",
    "12": "Law Public Admin",
    "13": "Agriculture Environment",
    "14": "Trades Applied Tech",
    "15": "Religion Theology",
}
