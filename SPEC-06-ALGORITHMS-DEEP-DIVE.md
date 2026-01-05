# Polymath Engine: System Specification
## Part 6: Algorithms Deep Dive

---

## 1. TRAVERSAL ALGORITHM DETAILS

### 1.1 Phase Selection Logic

```python
def determine_phase(stats: VaultStatistics, config: TraversalConfig) -> str:
    """
    Determine which traversal phase to use.
    
    Phase Transitions:
    1. hub_completion → problem_driven: When all hubs have 4+ books
    2. problem_driven → bisociation: User can manually switch
    3. Any → exploration: When >50% of domains touched
    """
    
    # Check hub completion
    incomplete_hubs = [
        h for h in stats.hub_domains 
        if h.books_read < config.hub_target_books
    ]
    
    if incomplete_hubs:
        return "hub_completion"
    
    # Check if in problem-driven mode
    if config.current_phase == "problem_driven":
        return "problem_driven"
    
    # Default to bisociation after hubs complete
    return "bisociation"
```

### 1.2 Hub Completion Algorithm

```python
def hub_completion_recommend(
    hub_domains: List[Domain],
    recent_reads: Set[str],
    expert_domains: List[Domain],
    config: TraversalConfig
) -> TraversalRecommendation:
    """
    Algorithm for hub completion phase.
    
    Priority order:
    1. Incomplete hub with most books (closest to done)
    2. Exclude recently read (within max_domain_repeat_window)
    3. Weekly interleave: 1 distant domain per week
    4. After hub read, return to same hub until complete
    
    Slot progression:
    - Book 1: FND (Foundation)
    - Book 2: HRS (Heresy)
    - Book 3: ORT (Orthodoxy) or FRN (Frontier)
    - Book 4: BRG (Bridge) - always last
    """
    
    # Check if we need weekly distant interleave
    days_since_distant = calculate_days_since_distant(recent_reads, expert_domains)
    if days_since_distant >= 7:
        return recommend_distant_domain(expert_domains, recent_reads)
    
    # Find incomplete hubs, excluding recently read
    available_hubs = [
        h for h in hub_domains
        if h.books_read < config.hub_target_books
        and h.domain_id not in recent_reads
        and not h.is_expert
    ]
    
    if not available_hubs:
        # All hubs recently read - wait or switch phase
        return TraversalRecommendation(
            domain=None,
            function_slot=None,
            reason="All incomplete hubs recently read. Wait or read distant domain.",
            suggested_books=[],
        )
    
    # Prioritize hub closest to completion (most books read)
    selected_hub = max(available_hubs, key=lambda h: h.books_read)
    
    # Determine slot
    slot = determine_next_slot(selected_hub)
    
    return TraversalRecommendation(
        domain=selected_hub,
        function_slot=slot,
        reason=f"Hub completion: {selected_hub.books_read}/{config.hub_target_books}",
        suggested_books=get_hub_books(selected_hub.domain_id, slot),
    )

def determine_next_slot(domain: Domain) -> str:
    """
    Slot progression based on books read.
    
    Progression rationale:
    - FND first: Need vocabulary and concepts
    - HRS second: Best critique while foundation fresh
    - ORT/FRN third: Deepen mainstream or explore edges
    - BRG last: Requires understanding to build connections
    """
    SLOT_PROGRESSION = ["FND", "HRS", "ORT", "FRN", "HST", "BRG"]
    
    books_read = domain.books_read
    if books_read >= len(SLOT_PROGRESSION):
        return "FRN"  # Default to frontier for extra reading
    
    return SLOT_PROGRESSION[books_read]
```

### 1.3 Problem-Driven Algorithm

```python
def problem_driven_recommend(
    problems: List[Problem],
    domains: List[Domain],
    recent_reads: Set[str],
    config: TraversalConfig
) -> TraversalRecommendation:
    """
    Algorithm for problem-driven phase.
    
    Strategy:
    1. Identify active problem with most uncertainty
    2. Find relevant domains not yet surveyed
    3. Prioritize domains that bridge to expert areas
    4. Include weekly distant domain for bisociation
    """
    
    # Get active problems sorted by uncertainty
    active_problems = [p for p in problems if p.status == "active"]
    active_problems.sort(key=lambda p: p.confidence, reverse=False)  # Lowest confidence first
    
    if not active_problems:
        return fallback_to_hub_or_bisociation()
    
    target_problem = active_problems[0]
    
    # Find relevant domains not yet surveyed
    relevant_domains = [
        d for d in domains
        if d.domain_id in target_problem.relevant_domains
        and d.status in [DomainStatus.UNTOUCHED, DomainStatus.SURVEYING]
        and d.domain_id not in recent_reads
    ]
    
    if relevant_domains:
        # Prioritize domains that bridge to expert areas
        selected = prioritize_by_bridge_potential(relevant_domains, expert_domains)
        
        return TraversalRecommendation(
            domain=selected,
            function_slot="FND",  # Foundation for new domains
            reason=f"Problem '{target_problem.name}': exploring {selected.domain_name}",
            suggested_books=get_foundation_books(selected.domain_id),
        )
    
    # All relevant domains surveyed - expand search or move to next problem
    return expand_problem_search(target_problem, domains, recent_reads)

def prioritize_by_bridge_potential(
    candidates: List[Domain], 
    expert_domains: List[Domain]
) -> Domain:
    """
    Score domains by potential to bridge to expert areas.
    
    Bridge potential = sum of (1/distance) for each expert domain
    Closer domains get higher scores.
    """
    scores = {}
    
    for candidate in candidates:
        score = 0
        for expert in expert_domains:
            distance = compute_domain_distance(candidate.domain_id, expert.domain_id)
            if distance > 0:
                score += 1 / distance
            else:
                score += 10  # Same branch bonus
        scores[candidate.domain_id] = score
    
    # Return highest scoring domain
    return max(candidates, key=lambda d: scores[d.domain_id])
```

### 1.4 Bisociation Algorithm

```python
def bisociation_recommend(
    strength_domains: List[Domain],
    all_domains: List[Domain],
    recent_reads: List[DailyLog],
    config: TraversalConfig
) -> TraversalRecommendation:
    """
    Algorithm for bisociation phase (Koestler's creative collision).
    
    Weekly rhythm:
    - Days 1-3: Strength cluster (deepen expertise)
    - Days 4-6: Maximum distance (explore unfamiliar)
    - Day 7: Synthesis (integrate insights)
    
    Goal: Force unexpected connections between mastered and foreign domains.
    """
    
    recent_domain_ids = {log.domain_id for log in recent_reads if is_this_week(log.log_date)}
    
    # Determine position in weekly cycle
    days_this_week = count_reading_days_this_week(recent_reads)
    
    if days_this_week < 3:
        # Strength cluster: deepen expert area
        return recommend_strength_deepening(strength_domains, recent_domain_ids)
    elif days_this_week < 6:
        # Distant exploration: maximum distance from strength
        return recommend_maximum_distance(strength_domains, all_domains, recent_domain_ids)
    else:
        # Synthesis day: recommend reviewing notes, no new reading
        return TraversalRecommendation(
            domain=None,
            function_slot=None,
            reason="Synthesis day: Review week's notes and write synthesis",
            suggested_books=[],
        )

def recommend_maximum_distance(
    strength_domains: List[Domain],
    all_domains: List[Domain],
    exclude: Set[str]
) -> TraversalRecommendation:
    """
    Find domain at maximum conceptual distance from strength cluster.
    
    Distance calculation:
    1. Base distance = branch_distance_matrix[anchor_branch][target_branch]
    2. Bonus for untouched status (+0.5)
    3. Bonus for no shared isomorphisms (+0.5)
    4. Penalty for recent reads (-inf, excluded)
    """
    
    # Pick random anchor from strength cluster
    anchor = random.choice(strength_domains)
    
    # Calculate distances to all domains
    candidates = []
    for domain in all_domains:
        if domain.domain_id in exclude:
            continue
        if domain in strength_domains:
            continue
        
        distance = compute_domain_distance(anchor.domain_id, domain.domain_id)
        
        # Bonuses
        if domain.status == DomainStatus.UNTOUCHED:
            distance += 0.5
        if not has_shared_isomorphisms(anchor, domain):
            distance += 0.5
        
        candidates.append((domain, distance))
    
    # Sort by distance descending
    candidates.sort(key=lambda x: x[1], reverse=True)
    
    # Random selection from top 5 to avoid predictability
    if len(candidates) >= 5:
        selected, distance = random.choice(candidates[:5])
    else:
        selected, distance = candidates[0] if candidates else (None, 0)
    
    return TraversalRecommendation(
        domain=selected,
        function_slot="FND",
        reason=f"Maximum distance from {anchor.domain_name} (d={distance:.1f})",
        suggested_books=get_foundation_books(selected.domain_id) if selected else [],
        distance_from_last=distance,
        bisociation_partner=anchor,
    )
```

---

## 2. DISTANCE CALCULATION DETAILS

### 2.1 Branch Distance Matrix Rationale

```
Distance 1 (Adjacent):
- Share methodology, objects, or direct intellectual heritage
- Examples: Physics↔Engineering, Biology↔Medicine, Economics↔Business

Distance 2 (Moderate):
- Share some concepts but different perspectives
- Examples: Physics↔Mind Sciences (via neuroscience), 
            Formal Sciences↔Social Sciences (via quantitative methods)

Distance 3 (Far):
- Different paradigms, limited conceptual overlap
- Examples: Physical Sciences↔Humanities,
            Engineering↔Arts

Distance 4 (Maximum):
- Entirely different worldviews, methods, and objects
- Examples: Physical Sciences↔Religion,
            Trades↔Religion
```

### 2.2 Isomorphism Distance Adjustment

```python
def compute_adjusted_distance(
    domain_a: str,
    domain_b: str,
    isomorphisms: List[Isomorphism]
) -> float:
    """
    Adjust base distance based on shared isomorphisms.
    
    Rationale:
    - Domains that share isomorphisms are "closer" conceptually
    - Each shared isomorphism reduces distance by 0.5
    - Never reduce below 0
    
    Example:
    - Thermodynamics (01.02) ↔ Information Theory (03.07)
    - Base distance: 1 (adjacent branches)
    - Shared isomorphism: "entropy"
    - Adjusted distance: 0.5
    """
    
    base_distance = get_branch_distance(
        domain_a.split('.')[0],
        domain_b.split('.')[0]
    )
    
    # Find shared isomorphisms
    a_isomorphisms = {i.concept_name for i in isomorphisms if domain_a in i.domains}
    b_isomorphisms = {i.concept_name for i in isomorphisms if domain_b in i.domains}
    shared = a_isomorphisms & b_isomorphisms
    
    # Reduce distance
    adjustment = -0.5 * len(shared)
    adjusted = max(0, base_distance + adjustment)
    
    return adjusted
```

### 2.3 Dynamic Distance Learning

```python
class DistanceLearner:
    """
    Learn personal distance based on perceived difficulty.
    
    If user consistently finds Domain A harder to connect to
    than the matrix suggests, increase personal distance.
    
    Tracked via daily log "connection_difficulty" field.
    """
    
    def __init__(self, base_distances: Dict[Tuple[str, str], float]):
        self.base_distances = base_distances
        self.personal_adjustments: Dict[Tuple[str, str], float] = {}
    
    def record_connection_attempt(
        self,
        from_domain: str,
        to_domain: str,
        difficulty: int  # 1-5 scale
    ):
        """Record perceived difficulty connecting domains."""
        
        key = tuple(sorted([from_domain, to_domain]))
        expected = self.base_distances.get(key, 2)
        
        # Difficulty 3 = expected; higher = harder; lower = easier
        deviation = (difficulty - 3) * 0.25
        
        if key not in self.personal_adjustments:
            self.personal_adjustments[key] = 0
        
        # Exponential moving average
        alpha = 0.3
        self.personal_adjustments[key] = (
            alpha * deviation + 
            (1 - alpha) * self.personal_adjustments[key]
        )
    
    def get_personal_distance(self, domain_a: str, domain_b: str) -> float:
        """Get distance with personal adjustment."""
        key = tuple(sorted([domain_a, domain_b]))
        base = self.base_distances.get(key, 2)
        adjustment = self.personal_adjustments.get(key, 0)
        return max(0, base + adjustment)
```

---

## 3. BISOCIATION PROMPT GENERATION

### 3.1 Prompt Categories

```python
SYNTHESIS_PROMPTS = {
    "mechanism_transfer": [
        "What mechanism from {anchor} could solve an open problem in {distant}?",
        "What tool from {distant} could {anchor} practitioners adopt?",
        "If you could export one concept from {anchor} to {distant}, which would cause the biggest shift?",
    ],
    
    "assumption_violation": [
        "What assumption does {anchor} take for granted that {distant} explicitly rejects?",
        "What would {distant} practitioners find most naive about {anchor}?",
        "What 'law' in {anchor} has no equivalent in {distant}?",
    ],
    
    "methodology_collision": [
        "If {distant}'s methodology were applied to {anchor}'s core questions, what would change?",
        "What evidence would {anchor} accept that {distant} would dismiss?",
        "What research method is forbidden in {anchor} but standard in {distant}?",
    ],
    
    "naming_translation": [
        "What concept exists in both {anchor} and {distant} under different names?",
        "What does {anchor} call the phenomenon that {distant} calls X?",
        "If you had to explain {anchor}'s core insight using only {distant}'s vocabulary, how would you?",
    ],
    
    "practitioner_swap": [
        "What would a {distant} expert notice first if dropped into a {anchor} lab/office?",
        "What question would a {distant} practitioner ask that {anchor} experts never consider?",
        "If {anchor} hired a {distant} consultant, what would they recommend changing?",
    ],
    
    "historical_counterfactual": [
        "What if {anchor} had developed from {distant} rather than its actual origins?",
        "What discovery in {distant} could have accelerated {anchor} by decades?",
        "What historical figure bridged {anchor} and {distant}? What did they see?",
    ],
}

def generate_synthesis_prompt(
    anchor: Domain,
    distant: Domain,
    user_history: List[DailyLog] = None
) -> str:
    """
    Generate contextually appropriate synthesis prompt.
    
    Selection logic:
    1. Check if user has logged connections before (avoid repetition)
    2. Match category to user's current goals
    3. Prefer underused categories
    4. Random within selected category
    """
    
    # Track which categories used recently
    recent_categories = get_recent_prompt_categories(user_history)
    
    # Weight towards unused categories
    available_categories = [
        cat for cat in SYNTHESIS_PROMPTS.keys()
        if cat not in recent_categories[-3:]  # Not used in last 3 prompts
    ]
    
    if not available_categories:
        available_categories = list(SYNTHESIS_PROMPTS.keys())
    
    # Select category
    category = random.choice(available_categories)
    
    # Select prompt
    prompts = SYNTHESIS_PROMPTS[category]
    prompt_template = random.choice(prompts)
    
    return prompt_template.format(
        anchor=anchor.domain_name,
        distant=distant.domain_name
    )
```

### 3.2 Connection Quality Scoring

```python
@dataclass
class ConnectionAttempt:
    anchor_domain: str
    distant_domain: str
    prompt_used: str
    user_response: str
    self_rated_quality: int  # 1-5
    mechanisms_identified: List[str]
    isomorphisms_created: List[str]

def score_connection_quality(attempt: ConnectionAttempt) -> float:
    """
    Score quality of bisociation attempt.
    
    Factors:
    - Self-rated quality (40%)
    - Number of mechanisms identified (30%)
    - Isomorphisms created (30%)
    
    Used to:
    - Track improvement over time
    - Identify productive domain pairings
    - Adjust prompt selection
    """
    
    # Normalize self-rating (1-5 → 0-1)
    rating_score = (attempt.self_rated_quality - 1) / 4
    
    # Mechanisms (diminishing returns after 3)
    mechanism_count = len(attempt.mechanisms_identified)
    mechanism_score = min(1.0, mechanism_count / 3)
    
    # Isomorphisms (any is good)
    isomorphism_score = min(1.0, len(attempt.isomorphisms_created))
    
    # Weighted combination
    total = (
        0.4 * rating_score +
        0.3 * mechanism_score +
        0.3 * isomorphism_score
    )
    
    return total
```

---

## 4. BLIND SPOT ANALYSIS ALGORITHM

### 4.1 Automatic Detection

```python
def analyze_blind_spots(
    domain: Domain,
    books_read: List[Book],
    all_domains: List[Domain]
) -> BlindSpotAnalysis:
    """
    Analyze potential blind spots in a domain based on reading.
    
    Detection methods:
    1. Citation network gaps: Authors never cited
    2. Methodology gaps: Methods not covered
    3. Temporal gaps: No recent sources (>10 years old)
    4. Perspective gaps: All same school of thought
    5. Adjacent domain gaps: Related fields not engaged
    """
    
    analysis = BlindSpotAnalysis(domain_id=domain.domain_id)
    
    # 1. Citation network analysis
    cited_authors = extract_cited_authors(books_read)
    known_important_authors = get_canonical_authors(domain.domain_id)
    missing_authors = known_important_authors - cited_authors
    if missing_authors:
        analysis.add_blind_spot(
            type="citation_gap",
            description=f"Major authors not covered: {', '.join(list(missing_authors)[:3])}",
            severity="medium"
        )
    
    # 2. Methodology coverage
    methodologies_covered = extract_methodologies(books_read)
    standard_methodologies = get_standard_methodologies(domain.domain_id)
    missing_methods = standard_methodologies - methodologies_covered
    if missing_methods:
        analysis.add_blind_spot(
            type="methodology_gap",
            description=f"Methods not covered: {', '.join(missing_methods)}",
            severity="high"
        )
    
    # 3. Temporal analysis
    pub_years = [b.year for b in books_read if b.year]
    if pub_years and max(pub_years) < (date.today().year - 10):
        analysis.add_blind_spot(
            type="temporal_gap",
            description="No sources from last 10 years",
            severity="medium"
        )
    
    # 4. Perspective diversity
    schools = extract_schools_of_thought(books_read)
    if len(schools) == 1:
        analysis.add_blind_spot(
            type="perspective_gap",
            description=f"All sources from {schools[0]} school",
            severity="high"
        )
    
    # 5. Adjacent domain engagement
    bridges = get_domain_bridges(domain.domain_id)
    for bridge in bridges:
        if not any(b.domain_id == bridge.target_domain for b in books_read):
            analysis.add_blind_spot(
                type="adjacent_gap",
                description=f"Bridge domain {bridge.target_domain} not engaged",
                severity="low"
            )
    
    return analysis
```

### 4.2 Exile Scholar Tracking

```python
@dataclass
class ExiledScholar:
    name: str
    domain: str
    claim: str
    reason_exiled: str
    current_status: str  # "vindicated", "still_marginal", "discredited"
    key_works: List[str]
    
    def relevance_score(self) -> float:
        """Score how relevant this exile is to explore."""
        status_scores = {
            "vindicated": 0.3,  # Already mainstream, less interesting
            "still_marginal": 1.0,  # Most interesting to explore
            "discredited": 0.5,  # May still have insights
        }
        return status_scores.get(self.current_status, 0.5)

def suggest_exiles_to_read(
    domain: Domain,
    exile_database: List[ExiledScholar]
) -> List[ExiledScholar]:
    """
    Suggest marginal scholars who challenged the domain's orthodoxy.
    
    Value of reading exiles:
    - May have seen something the mainstream missed
    - Even if wrong, their critiques reveal assumptions
    - Vindicated exiles = highest signal
    """
    
    relevant_exiles = [
        e for e in exile_database
        if e.domain == domain.domain_id
    ]
    
    # Sort by relevance score
    relevant_exiles.sort(key=lambda e: e.relevance_score(), reverse=True)
    
    return relevant_exiles[:5]
```

---

## 5. PROGRESS TRACKING ALGORITHMS

### 5.1 Coverage Metrics

```python
def calculate_coverage_metrics(
    domains: List[Domain],
    config: Config
) -> CoverageMetrics:
    """
    Calculate comprehensive coverage metrics.
    
    Metrics:
    - Raw coverage: % domains touched
    - Weighted coverage: Weight by hub status, recency
    - Branch balance: Evenness across branches
    - Depth score: How deep in surveyed domains
    """
    
    total = len(domains)
    touched = sum(1 for d in domains if d.status != DomainStatus.UNTOUCHED)
    surveyed = sum(1 for d in domains if d.status in [
        DomainStatus.SURVEYED, DomainStatus.DEEPENING, DomainStatus.SPECIALIZED
    ])
    
    # Raw coverage
    raw_coverage = touched / total
    
    # Weighted coverage (hubs count more)
    weights = []
    for d in domains:
        w = 1.0
        if d.is_hub:
            w *= 2.0
        if d.status in [DomainStatus.SURVEYED, DomainStatus.DEEPENING]:
            w *= 1.5
        weights.append(w)
    
    weighted_touched = sum(
        w for d, w in zip(domains, weights)
        if d.status != DomainStatus.UNTOUCHED
    )
    weighted_coverage = weighted_touched / sum(weights)
    
    # Branch balance (Gini coefficient)
    branch_counts = defaultdict(int)
    for d in domains:
        if d.status != DomainStatus.UNTOUCHED:
            branch_counts[d.branch_id] += 1
    
    counts = list(branch_counts.values())
    branch_balance = 1 - gini_coefficient(counts)
    
    # Depth score
    depth_score = surveyed / max(touched, 1)
    
    return CoverageMetrics(
        raw_coverage=raw_coverage,
        weighted_coverage=weighted_coverage,
        branch_balance=branch_balance,
        depth_score=depth_score,
    )

def gini_coefficient(values: List[int]) -> float:
    """Calculate Gini coefficient for distribution evenness."""
    if not values or sum(values) == 0:
        return 0
    
    sorted_values = sorted(values)
    n = len(sorted_values)
    cumsum = sum((i + 1) * v for i, v in enumerate(sorted_values))
    return (2 * cumsum) / (n * sum(values)) - (n + 1) / n
```

### 5.2 Streak and Momentum

```python
def calculate_reading_momentum(
    logs: List[DailyLog],
    lookback_days: int = 30
) -> MomentumMetrics:
    """
    Calculate reading momentum and predict sustainability.
    
    Metrics:
    - Current streak: Consecutive days
    - Rolling average: Days read per week (4-week average)
    - Trend: Accelerating, stable, or declining
    - Predicted sustainability: Based on variance and trend
    """
    
    today = date.today()
    cutoff = today - timedelta(days=lookback_days)
    recent_logs = [l for l in logs if l.log_date >= cutoff]
    
    # Current streak
    streak = 0
    check_date = today
    log_dates = {l.log_date for l in logs}
    while check_date in log_dates:
        streak += 1
        check_date -= timedelta(days=1)
    
    # Rolling weekly average
    weekly_counts = []
    for week_start in range(0, lookback_days, 7):
        week_end = week_start + 7
        week_logs = [
            l for l in recent_logs
            if week_start <= (today - l.log_date).days < week_end
        ]
        weekly_counts.append(len(week_logs))
    
    rolling_average = sum(weekly_counts) / len(weekly_counts) if weekly_counts else 0
    
    # Trend (linear regression slope)
    if len(weekly_counts) >= 2:
        x = list(range(len(weekly_counts)))
        slope = calculate_slope(x, weekly_counts)
        if slope > 0.2:
            trend = "accelerating"
        elif slope < -0.2:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "insufficient_data"
    
    # Sustainability prediction
    variance = statistics.variance(weekly_counts) if len(weekly_counts) >= 2 else 0
    sustainability = rolling_average / (1 + variance)  # Lower variance = more sustainable
    
    return MomentumMetrics(
        current_streak=streak,
        rolling_average=rolling_average,
        trend=trend,
        sustainability_score=sustainability,
    )
```

### 5.3 Isomorphism Network Analysis

```python
def analyze_isomorphism_network(
    isomorphisms: List[Isomorphism],
    domains: List[Domain]
) -> IsomorphismNetworkAnalysis:
    """
    Analyze the network of cross-domain connections.
    
    Insights:
    - Cluster detection: Groups of connected domains
    - Bridge domains: Domains that connect clusters
    - Isolated domains: Domains with no isomorphisms
    - Density: How interconnected the network is
    """
    
    # Build adjacency graph
    graph = defaultdict(set)
    for iso in isomorphisms:
        for i, d1 in enumerate(iso.domains):
            for d2 in iso.domains[i+1:]:
                graph[d1].add(d2)
                graph[d2].add(d1)
    
    # Find connected components (clusters)
    visited = set()
    clusters = []
    
    for domain in graph:
        if domain not in visited:
            cluster = bfs_cluster(domain, graph, visited)
            clusters.append(cluster)
    
    # Identify bridge domains (high betweenness centrality)
    betweenness = calculate_betweenness_centrality(graph)
    bridge_domains = [
        d for d, score in sorted(betweenness.items(), key=lambda x: -x[1])[:10]
    ]
    
    # Find isolated domains
    connected_domains = set(graph.keys())
    all_domain_ids = {d.domain_id for d in domains}
    isolated = all_domain_ids - connected_domains
    
    # Network density
    possible_edges = len(all_domain_ids) * (len(all_domain_ids) - 1) / 2
    actual_edges = sum(len(neighbors) for neighbors in graph.values()) / 2
    density = actual_edges / possible_edges if possible_edges > 0 else 0
    
    return IsomorphismNetworkAnalysis(
        num_clusters=len(clusters),
        largest_cluster_size=max(len(c) for c in clusters) if clusters else 0,
        bridge_domains=bridge_domains,
        isolated_domains=list(isolated),
        network_density=density,
    )
```

---

## 6. RECOMMENDATION CALIBRATION

### 6.1 Feedback Loop

```python
class RecommendationCalibrator:
    """
    Calibrate recommendations based on user feedback.
    
    Tracks:
    - Acceptance rate: How often user follows recommendation
    - Completion rate: How often followed reads are finished
    - Quality rating: User's retrospective rating
    - Serendipity score: Unexpected valuable finds
    """
    
    def __init__(self):
        self.recommendations: List[Recommendation] = []
        self.outcomes: Dict[str, Outcome] = {}
    
    def record_recommendation(self, rec: TraversalRecommendation) -> str:
        """Record a recommendation and return tracking ID."""
        rec_id = generate_id()
        self.recommendations.append({
            'id': rec_id,
            'domain_id': rec.domain.domain_id,
            'function_slot': rec.function_slot,
            'reason': rec.reason,
            'timestamp': datetime.now(),
        })
        return rec_id
    
    def record_outcome(
        self,
        rec_id: str,
        accepted: bool,
        completed: bool = None,
        quality_rating: int = None,
        surprising_value: bool = False,
    ):
        """Record outcome of a recommendation."""
        self.outcomes[rec_id] = Outcome(
            accepted=accepted,
            completed=completed,
            quality_rating=quality_rating,
            surprising_value=surprising_value,
        )
    
    def get_calibration_metrics(self) -> CalibrationMetrics:
        """Calculate calibration metrics."""
        total = len(self.outcomes)
        if total == 0:
            return CalibrationMetrics()
        
        accepted = sum(1 for o in self.outcomes.values() if o.accepted)
        completed = sum(1 for o in self.outcomes.values() if o.completed)
        
        ratings = [o.quality_rating for o in self.outcomes.values() if o.quality_rating]
        avg_quality = sum(ratings) / len(ratings) if ratings else None
        
        serendipity = sum(1 for o in self.outcomes.values() if o.surprising_value)
        
        return CalibrationMetrics(
            acceptance_rate=accepted / total,
            completion_rate=completed / accepted if accepted > 0 else 0,
            average_quality=avg_quality,
            serendipity_rate=serendipity / total,
        )
    
    def adjust_algorithm(self, metrics: CalibrationMetrics):
        """Adjust algorithm parameters based on calibration."""
        
        # If acceptance rate low, recommendations too distant
        if metrics.acceptance_rate < 0.5:
            self.decrease_distance_preference()
        
        # If quality low but acceptance high, wrong slot selections
        if metrics.average_quality and metrics.average_quality < 3:
            self.review_slot_progression()
        
        # If serendipity high, bisociation working well
        if metrics.serendipity_rate > 0.3:
            self.increase_distant_frequency()
```

---

*End of Part 6. This completes the core specification.*
