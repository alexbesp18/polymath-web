"""Markdown templates for Polymath Engine vault files.

All 8 templates as Python strings for generating vault files.
"""

from datetime import date

# Template: Daily Log (T-Daily-Log.md)
DAILY_LOG_TEMPLATE = '''---
date: {date}
type: daily-log
domain: "{domain_name}"
domain_id: "{domain_id}"
book: "{book_title}"
book_link: ""
function_slot: "{function_slot}"
pages_read: 0
reading_time_minutes: 0
phase: "{phase}"
bisociation_partner: ""
tags:
  - daily-log
---

# {date} — Reading Log

## Session Details

| Field | Value |
|-------|-------|
| **Domain** | [[02-Domains/{branch_folder}/{domain_file}]] |
| **Book** | [[03-Books/]] |
| **Function Slot** | `{function_slot}` |
| **Pages/Chapters** | |
| **Time** | minutes |
| **Phase** | {phase} |

---

## Core Mechanisms Extracted (max 3)

### Mechanism 1
**Name:**
**How it works:**
**Conditions for activation:**

### Mechanism 2
**Name:**
**How it works:**
**Conditions for activation:**

### Mechanism 3
**Name:**
**How it works:**
**Conditions for activation:**

---

## Surprising Claims

> [!quote] Claim 1
>

**Why surprising:**
**Confidence level:** high / medium / low
**Would need to verify:**

> [!quote] Claim 2
>

---

## Connections Identified

### Connects To
| Domain | How | Strength |
|--------|-----|----------|
| [[]] | | strong / moderate / weak |
| [[]] | | |

### Contradicts
| Domain/Book | How | Resolution |
|-------------|-----|------------|
| [[]] | | |

### Potential Isomorphism
**Concept:**
**Also appears in:** [[]]
**Same because:**
**Different because:**

---

## Bisociation Prompt

*Today's distant domain:* [[]]

**What does {domain_name} reveal about the distant domain?**


**What would a {domain_name} expert find confusing about the distant domain?**


---

## Problem Threads Advanced

| Problem | Insight | Confidence |
|---------|---------|------------|
| [[07-Problems/P1-Why-Professionals-Pay]] | | |
| [[07-Problems/P2-AI-Product-Defensibility]] | | |

---

## Raw Notes / Quotes

```
(paste highlights, quotes, page references here)
```

---

## Actions

- [ ] Added book to [[03-Books/]]
- [ ] Updated domain profile [[02-Domains/]]
- [ ] Captured isomorphisms to [[04-Isomorphisms/]]
- [ ] Updated bridges if applicable [[05-Bridges/]]
- [ ] Logged to CLI: `pm-log`

---

## Quality Self-Check

- [ ] At least 1 mechanism extracted
- [ ] At least 1 connection to another domain
- [ ] Bisociation prompt attempted
- [ ] Surprising claims noted with confidence
'''


# Template: Domain Profile (T-Domain-Profile.md)
DOMAIN_PROFILE_TEMPLATE = '''---
domain_id: "{domain_id}"
domain_name: "{domain_name}"
branch_id: "{branch_id}"
branch_name: "{branch_name}"
status: "untouched"
is_hub: {is_hub}
is_expert: {is_expert}
books_read: 0
last_read: ""
date_created: {date_created}
date_modified: {date_created}
priority: "normal"
tags:
  - domain
  - branch/{branch_id}
---

# {domain_id} — {domain_name}

> **Branch:** [[02-Domains/{branch_folder}/_Branch-Overview|{branch_id} — {branch_name}]]
> **Status:** `untouched`
> **Books Read:** 0
> **Last Active:** Never

---

## Domain Overview

**What this field studies:**
{description}

**Core questions it asks:**
1.
2.
3.

**Why it matters for polymath goals:**


---

## Function Slots

### Foundation (`FND`) — What everyone assumes
**Status:** ⬜ Not started

**Book(s):**
- [ ] [[03-Books/]]

**Core claims everyone accepts:**
1.
2.
3.

**Key vocabulary:**
| Term | Definition |
|------|------------|
| | |

---

### Orthodoxy (`ORT`) — Current consensus
**Status:** ⬜

**Book(s):**
- [ ] [[03-Books/]]

**What the mainstream believes:**


**Dominant methodology:**


**Key figures (living):**

---

### Heresy (`HRS`) — Best attacks on consensus
**Status:** ⬜

**Book(s):**
- [ ] [[03-Books/]]

**What critics say is wrong:**


**Alternative paradigms:**


**Key dissidents:**

---

### Frontier (`FRN`) — Unresolved problems
**Status:** ⬜

**Book(s):**
- [ ] [[03-Books/]]

**Open questions:**
1.
2.
3.

**Active debates:**


**Where breakthroughs might come:**

---

### History (`HST`) — How it became this way
**Status:** ⬜

**Book(s):**
- [ ] [[03-Books/]]

**Key turning points:**
| Year | Event | Consequence |
|------|-------|-------------|
| | | |

**Paths not taken:**


**Why it evolved this way:**

---

### Bridge (`BRG`) — Connections outward
**Status:** ⬜

**Book(s):**
- [ ] [[03-Books/]]

**Primary bridge to:** [[02-Domains/]]
**How they connect:**

**Secondary bridges:**
| Domain | Connection Type | Strength |
|--------|-----------------|----------|
| [[]] | shared formalism / shared method / shared object / metaphorical | |

**Best translation source:**

---

## Blind Spots Analysis

**Unquestioned assumptions:**
1.
2.

**Taboo or ignored topics:**
1.
2.

**Methodologies forbidden:**
1.

**Adjacent fields not engaged:**
- [[]]

**Exiled scholars/schools:**
| Who | Why Exiled | What They Saw |
|-----|------------|---------------|
| | | |

---

## Topic Layer (Tier 3b)

*Only populate when status = `deepening` or `specialized`*

| Subtopic ID | Name | Status | Notes |
|-------------|------|--------|-------|
| {domain_id}.01 | | | |
| {domain_id}.02 | | | |
| {domain_id}.03 | | | |

---

## Reading Log

```dataview
TABLE WITHOUT ID
  file.link as "Date",
  book as "Book",
  function_slot as "Slot"
FROM "01-Daily-Logs"
WHERE domain_id = this.domain_id
SORT file.name DESC
```

---

## Connected Isomorphisms

```dataview
LIST
FROM "04-Isomorphisms"
WHERE contains(domains, this.file.link)
```

---

## My Synthesis

**What this field sees that others miss:**


**What this field cannot see:**


**Innovation opportunities I notice:**


**Translation opportunities:**


---

## Notes & Scratchpad

```
(working notes, temporary thoughts)
```
'''


# Template: Book Note (T-Book-Note.md)
BOOK_NOTE_TEMPLATE = '''---
title: "{title}"
author: "{author}"
year: {year}
domain_id: "{domain_id}"
domain: "{domain_name}"
function_slot: "{function_slot}"
status: "reading"
date_started: {date_started}
date_finished: ""
rating: 0
pages: {pages}
isbn: ""
source: ""
tags:
  - book
  - slot/{function_slot}
  - domain/{domain_id}
---

# {title}

> **Author:** {author}
> **Year:** {year}
> **Domain:** [[02-Domains/{domain_id}|{domain_id} — {domain_name}]]
> **Function Slot:** `{function_slot}`
> **Status:** reading

---

## Why I Read This

**Slot it fills:** {function_slot}
**What I hoped to learn:**
**How I found it:**

---

## Book in 3 Sentences

1.
2.
3.

---

## Core Mechanisms

### Mechanism 1:
**The claim:**
**How it works:**
**Evidence given:**
**Conditions/limits:**

### Mechanism 2:
**The claim:**
**How it works:**
**Evidence given:**
**Conditions/limits:**

### Mechanism 3:
**The claim:**
**How it works:**
**Evidence given:**
**Conditions/limits:**

---

## Key Concepts Introduced

| Concept | Definition | Connects To |
|---------|------------|-------------|
| | | [[]] |
| | | [[]] |

---

## Most Important Quotes

> [!quote] Page X
>

**Why important:**

> [!quote] Page Y
>

**Why important:**

---

## What Surprised Me

1.
2.

---

## What I Disagree With

1. **Claim:**
   **My objection:**
   **Would need to see:**

---

## Connections

### This book connects to:
| Book/Domain | How | Type |
|-------------|-----|------|
| [[]] | | supports / contradicts / extends / applies |

### Isomorphisms identified:
- [[04-Isomorphisms/]]

### Problems advanced:
- [[07-Problems/]] — how:

---

## Actionable Takeaways

1.
2.
3.

---

## What To Read Next (from this book)

- **Cited favorably:**
- **Cited critically:**
- **Would pair well with:**

---

## Raw Notes

```
(chapter summaries, page notes, highlights)
```

---

## Metadata

**Reading sessions:**
- {date_started}: pages X-Y

**Total time:** hours

**Difficulty:** easy / moderate / hard / very hard

**Density:** {density}

**Would recommend to:**
'''


# Template: Isomorphism (T-Isomorphism.md)
ISOMORPHISM_TEMPLATE = '''---
concept_name: "{concept_name}"
date_created: {date_created}
date_modified: {date_created}
domains: []
confidence: "medium"
tags:
  - isomorphism
---

# {concept_name}

> Cross-domain concept appearing in multiple fields under different names.

---

## Manifestations

| Domain | Term Used | Key Source | Notes |
|--------|-----------|------------|-------|
| [[02-Domains/]] | | [[03-Books/]] | |
| [[02-Domains/]] | | [[03-Books/]] | |
| [[02-Domains/]] | | [[03-Books/]] | |
| [[02-Domains/]] | | [[03-Books/]] | |

---

## Structural Core

**What's actually the same underneath:**


**The abstract pattern:**


**Mathematical/formal representation (if applicable):**

```
(formula, diagram description, or formal notation)
```

---

## Key Differences

| Domain | Emphasis | Blind Spot |
|--------|----------|------------|
| | What they focus on | What they miss |
| | | |
| | | |

---

## False Friend Warning

**Looks similar but isn't:**


**The crucial difference:**


**Danger of conflation:**

---

## Translation Guide

### Explaining Domain A's version to Domain B person:


### Explaining Domain B's version to Domain A person:


---

## Best Bridge Sources

1. [[03-Books/]] — why:
2. [[03-Books/]] — why:

---

## Generative Questions

1. What would happen if we applied Domain A's treatment in Domain B?

2. What does Domain A know about this that Domain B hasn't discovered?

3. Where does the isomorphism break down?

---

## Innovation Opportunities

**Gaps I notice:**


**What could be built:**


**Who would care:**

---

## Confidence Assessment

**Confidence in isomorphism:** medium

**What would increase confidence:**


**What would decrease confidence:**


---

## Discovery Log

**First noticed:** {date_created}
**In context of:** [[01-Daily-Logs/]]
**Subsequent confirmations:**
- [[01-Daily-Logs/]]
- [[01-Daily-Logs/]]
'''


# Template: Bridge (T-Bridge.md)
BRIDGE_TEMPLATE = '''---
domain_a_id: "{domain_a_id}"
domain_a_name: "{domain_a_name}"
domain_b_id: "{domain_b_id}"
domain_b_name: "{domain_b_name}"
bridge_type: ""
strength: "moderate"
date_created: {date_created}
date_modified: {date_created}
tags:
  - bridge
---

# {domain_a_name} ↔ {domain_b_name}

> **Type:**
> **Strength:** moderate

---

## Bridge Type

- [ ] **Shared Formalism** — Same math/logic, different substrate
- [ ] **Shared Methodology** — Same research methods, different objects
- [ ] **Shared Object** — Same thing studied, different lenses
- [ ] **Historical** — One field spawned from the other
- [ ] **Renegade Scholar** — Person trained in A who works in B
- [ ] **Synthesis Attempt** — Explicit unification project
- [ ] **Metaphorical** — Surface similarity only (low value)

---

## The Connection

**What links these fields:**


**The specific mechanism/concept/method that travels:**


**Direction of flow:** A → B / B → A / Bidirectional

---

## Key Bridge Sources

| Source | Type | What It Does |
|--------|------|--------------|
| [[03-Books/]] | Rosetta Stone / Boundary Object / Export / Renegade / Synthesis | |
| [[03-Books/]] | | |

---

## What {domain_a_name} Sees That {domain_b_name} Misses


---

## What {domain_b_name} Sees That {domain_a_name} Misses


---

## Translation Friction

**Why translation is hard:**


**Common mistranslations:**


**Vocabulary conflicts:**
| Term | Meaning in A | Meaning in B |
|------|--------------|--------------|
| | | |

---

## Innovation at the Intersection

**Unsolved problem in A that B's tools might solve:**


**Unsolved problem in B that A's tools might solve:**


**Hybrid approach no one has tried:**


---

## Who Has Crossed This Bridge

| Person | Direction | Notable Work |
|--------|-----------|--------------|
| | A → B | |
| | B → A | |

---

## Strength Assessment

**Strength:** moderate

**Evidence for connection:**


**Limits of the bridge:**


---

## Related Isomorphisms

```dataview
LIST
FROM "04-Isomorphisms"
WHERE contains(domains, [[02-Domains/{domain_a_id}]])
  AND contains(domains, [[02-Domains/{domain_b_id}]])
```
'''


# Template: Blind Spot (T-Blind-Spot.md)
BLIND_SPOT_TEMPLATE = '''---
domain_id: "{domain_id}"
domain_name: "{domain_name}"
date_created: {date_created}
date_modified: {date_created}
tags:
  - blind-spot
---

# Blind Spots: {domain_name}

> **Domain:** [[02-Domains/{domain_id}|{domain_id} — {domain_name}]]
> **Last Updated:** {date_created}

---

## Unquestioned Assumptions

Things practitioners accept without examination:

1. **Assumption:**
   **Why unquestioned:**
   **What would change if false:**

2. **Assumption:**
   **Why unquestioned:**
   **What would change if false:**

3. **Assumption:**
   **Why unquestioned:**
   **What would change if false:**

---

## Taboo Topics

Subjects that are ignored, dismissed, or career-ending to pursue:

1. **Topic:**
   **Why taboo:**
   **Who studies it anyway:**

2. **Topic:**
   **Why taboo:**
   **Who studies it anyway:**

---

## Forbidden Methodologies

Research approaches that are not accepted:

1. **Method:**
   **Why forbidden:**
   **What it might reveal:**

2. **Method:**
   **Why forbidden:**
   **What it might reveal:**

---

## Adjacent Fields Ignored

| Field | Why Ignored | What Could Be Learned |
|-------|-------------|----------------------|
| [[02-Domains/]] | | |
| [[02-Domains/]] | | |

---

## Historical Paths Not Taken

| Branching Point | Path Chosen | Path Abandoned | What Was Lost |
|-----------------|-------------|----------------|---------------|
| | | | |
| | | | |

---

## Exiles and Dissidents

| Person/School | What They Claimed | Why Exiled | Current Status |
|---------------|-------------------|------------|----------------|
| | | | Vindicated / Still marginal / Discredited |
| | | | |

---

## What This Field Cannot See

**Structural blind spot:**


**Why the field's methods prevent seeing this:**


**Who can see it (adjacent fields):**

---

## Innovation Opportunity Assessment

**The blind spot creates opportunity because:**


**Who would pay to have this blind spot filled:**


**What would it take to fill it:**

---

## Sources for This Analysis

- [[03-Books/]] — what it revealed
- [[03-Books/]] — what it revealed
- [[01-Daily-Logs/]] — observation
'''


# Template: Problem (T-Problem.md)
PROBLEM_TEMPLATE = '''---
problem_id: "{problem_id}"
problem_name: "{problem_name}"
status: "active"
date_created: {date_created}
date_modified: {date_created}
priority: "high"
relevant_domains: []
tags:
  - problem
---

# {problem_id}: {problem_name}

> **Status:** active
> **Priority:** high
> **Created:** {date_created}

---

## The Question

**Core question:**
{full_question}

**Why this matters to me:**
{why_matters}

**What answering it would enable:**


---

## Sub-Questions

1.
2.
3.
4.

---

## Relevant Domains

| Domain | Why Relevant | Status | Key Insight So Far |
|--------|--------------|--------|-------------------|
| [[02-Domains/]] | | untouched/surveying/surveyed | |
| [[02-Domains/]] | | | |
| [[02-Domains/]] | | | |
| [[02-Domains/]] | | | |

---

## Current Best Answer

**As of {date_created}:**


**Confidence:** medium

**Key uncertainties:**
1.
2.

---

## Evidence Log

### Supporting Evidence

| Date | Source | Claim | Strength |
|------|--------|-------|----------|
| | [[03-Books/]] or [[01-Daily-Logs/]] | | strong/moderate/weak |
| | | | |

### Contradicting Evidence

| Date | Source | Claim | How I Reconcile |
|------|--------|-------|-----------------|
| | | | |

---

## Hypotheses

### H1:
**Status:** active
**Evidence for:**
**Evidence against:**
**What would confirm:**
**What would refute:**

### H2:
**Status:**
**Evidence for:**
**Evidence against:**

---

## Reading Queue for This Problem

- [ ] [[03-Books/]] — domain, why relevant
- [ ] [[03-Books/]] — domain, why relevant
- [ ] (not yet identified) — domain needed

---

## Insights Timeline

| Date | Insight | Source | Changed My View? |
|------|---------|--------|------------------|
| | | [[]] | yes/no |
| | | | |

---

## Production Potential

**Could become:**
- [ ] Blog post
- [ ] Consulting framework
- [ ] Product feature
- [ ] Research project

**Draft started:** [[09-Production/]]

---

## Related Problems

- [[07-Problems/]] — how related
- [[07-Problems/]] — how related
'''


# Template: Weekly Synthesis (T-Weekly-Synthesis.md)
WEEKLY_SYNTHESIS_TEMPLATE = '''---
week_number: "{week_number}"
year: "{year}"
date_start: "{date_start}"
date_end: "{date_end}"
phase: ""
books_completed: 0
domains_touched: 0
isomorphisms_created: 0
bridges_created: 0
tags:
  - weekly-synthesis
---

# Week {week_number}, {year} — Synthesis

> **Period:** {date_start} to {date_end}
> **Phase:** hub-completion / problem-driven / bisociation

---

## Reading Summary

### Books Completed

| Book | Domain | Slot | Rating |
|------|--------|------|--------|
| [[03-Books/]] | [[02-Domains/]] | | /5 |
| [[03-Books/]] | | | |

**Total pages:**
**Total time:**

### Domains Touched

| Domain | Status Change | Notes |
|--------|---------------|-------|
| [[02-Domains/]] | untouched → surveying | |
| [[02-Domains/]] | | |

---

## Key Extractions

### Top Mechanisms Learned

1. **Mechanism** (from [[03-Books/]])
   - How it works:
   - Where it applies:

2. **Mechanism** (from [[03-Books/]])
   - How it works:
   - Where it applies:

3. **Mechanism** (from [[03-Books/]])
   - How it works:
   - Where it applies:

---

## Isomorphisms Discovered

| Concept | Domains Connected | Confidence |
|---------|-------------------|------------|
| [[04-Isomorphisms/]] | | |
| [[04-Isomorphisms/]] | | |

**Best isomorphism this week:**


---

## Bridges Built/Strengthened

| Bridge | Type | New or Strengthened |
|--------|------|---------------------|
| [[05-Bridges/]] | | |

---

## Problems Advanced

### [[07-Problems/P1-Why-Professionals-Pay]]
**New insight:**
**Confidence change:**
**Next read for this:**

### [[07-Problems/P2-AI-Product-Defensibility]]
**New insight:**
**Confidence change:**
**Next read for this:**

### [[07-Problems/P3-Underserved-Niches]]
**New insight:**

### [[07-Problems/P4-Coordination-Failures]]
**New insight:**

---

## Blind Spots Identified

| Domain | Blind Spot | Opportunity |
|--------|------------|-------------|
| | | |

---

## Bisociation Results

**Pairing 1:** [[Domain A]] ↔ [[Domain B]]
- Distance: X
- Synthesis prompt used:
- Result:

**Pairing 2:** [[Domain A]] ↔ [[Domain B]]
- Result:

**Best bisociation insight:**


---

## Branch Coverage This Week

```
01-Physical:      ░░░░░░░░░░ 0/13
02-Life:          ░░░░░░░░░░ 0/12
03-Formal:        ░░░░░░░░░░ 0/11
04-Mind:          ░░░░░░░░░░ 0/10
05-Social:        ░░░░░░░░░░ 0/16
06-Humanities:    ░░░░░░░░░░ 0/16
07-Engineering:   ▓▓▓▓▓▓▓▓░░ 5/16
08-Health:        ░░░░░░░░░░ 0/15
09-Business:      ▓▓▓▓░░░░░░ 2/12
10-Education:     ░░░░░░░░░░ 0/9
11-Arts:          ░░░░░░░░░░ 0/12
12-Law:           ░░░░░░░░░░ 0/10
13-Agriculture:   ░░░░░░░░░░ 0/10
14-Trades:        ░░░░░░░░░░ 0/10
15-Religion:      ░░░░░░░░░░ 0/8
```

---

## Production Seeds

**Ideas that emerged:**
1.
2.
3.

**Drafts started:** [[09-Production/Ideas/]]

**Shipped:**

---

## Calibration

### Predictions Made This Week
| Prediction | Domain | Confidence | Resolved? | Outcome |
|------------|--------|------------|-----------|---------|
| | | % | | |

### Brier Score Update
**This week:**
**Running average:**

---

## Retrospective

**What worked:**


**What didn't:**


**Adjustment for next week:**

---

## Next Week Plan

**Phase:** hub-completion / problem-driven / bisociation

**Planned domains:**
1. [[02-Domains/]] — why:
2. [[02-Domains/]] — why:

**Problem focus:** [[07-Problems/]]

**Distant domain for bisociation:** [[02-Domains/]]

**Books queued:**
1. [[03-Books/]]
2. [[03-Books/]]
'''


# Template: Branch Overview
BRANCH_OVERVIEW_TEMPLATE = '''---
branch_id: "{branch_id}"
branch_name: "{branch_name}"
domain_count: {domain_count}
tags:
  - branch-overview
---

# Branch {branch_id}: {branch_name}

---

## Overview

**What this branch studies:**
{description}

**Core orientation:**


**Typical methodologies:**

---

## Domains in This Branch

```dataview
TABLE WITHOUT ID
  file.link as "Domain",
  status as "Status",
  books_read as "Books",
  is_hub as "Hub?"
FROM "02-Domains/{branch_folder}"
WHERE type = "domain"
SORT domain_id ASC
```

---

## Branch Statistics

**Domains:** {domain_count}
**Domains touched:**
**Domains surveyed:**
**Hub domains in branch:**

---

## My Progress

```dataview
TABLE WITHOUT ID
  domain_name as "Domain",
  status as "Status",
  last_read as "Last Read"
FROM "02-Domains/{branch_folder}"
WHERE type = "domain"
SORT status DESC, last_read DESC
```

---

## Key Bridges Out of This Branch

| To Branch | Via Domain | Bridge Type |
|-----------|------------|-------------|
| [[]] | [[02-Domains/]] | |

---

## Notes

```
(branch-level observations, patterns across domains)
```
'''


# Template: Dashboard
DASHBOARD_TEMPLATE = '''---
type: dashboard
---

# Polymath Engine — Dashboard

> **Last Updated:** `= date(now)`
> **Current Phase:** hub-completion

---

## 📊 Overall Progress

### Reading Stats
```dataview
TABLE WITHOUT ID
  length(rows) as "Total Days Logged",
  sum(rows.pages_read) as "Total Pages",
  round(sum(rows.reading_time_minutes)/60, 1) as "Total Hours"
FROM "01-Daily-Logs"
```

### Domain Coverage
```dataview
TABLE WITHOUT ID
  length(filter(rows, (r) => r.status = "untouched")) as "Untouched",
  length(filter(rows, (r) => r.status = "surveying")) as "Surveying",
  length(filter(rows, (r) => r.status = "surveyed")) as "Surveyed",
  length(filter(rows, (r) => r.status = "deepening")) as "Deepening",
  length(filter(rows, (r) => r.status = "expert")) as "Expert"
FROM "02-Domains"
WHERE type = "domain"
FLATTEN status
```

---

## 🔥 Current Streak

```dataview
TABLE WITHOUT ID
  file.name as "Date",
  domain as "Domain",
  book as "Book"
FROM "01-Daily-Logs"
SORT file.name DESC
LIMIT 7
```

---

## 🎯 Hub Completion Status

| Hub Domain | Status | Books |
|------------|--------|-------|
| [[02-Domains/02-Life-Sciences/02.04-Evolutionary-Biology]] | | /4 |
| [[02-Domains/01-Physical-Sciences/01.02-Thermodynamics]] | | /4 |
| [[02-Domains/03-Formal-Sciences/03.06-Combinatorics-Graph-Theory]] | | /4 |
| [[02-Domains/03-Formal-Sciences/03.04-Probability-Statistics]] | | /4 |
| [[02-Domains/03-Formal-Sciences/03.07-Information-Theory]] | | /4 |
| [[02-Domains/03-Formal-Sciences/03.09-Game-Theory]] | | /4 |
| [[02-Domains/07-Engineering/07.14-Systems-Engineering]] | | /4 |

---

## 🌳 Branch Coverage Heatmap

| Branch | Coverage | Domains |
|--------|----------|---------|
| 01 Physical Sciences | ░░░░░░░░░░ | 0/13 |
| 02 Life Sciences | ░░░░░░░░░░ | 0/12 |
| 03 Formal Sciences | ░░░░░░░░░░ | 0/11 |
| 04 Mind Sciences | ░░░░░░░░░░ | 0/10 |
| 05 Social Sciences | ░░░░░░░░░░ | 0/16 |
| 06 Humanities | ░░░░░░░░░░ | 0/16 |
| 07 Engineering | ▓▓▓▓▓▓▓▓░░ | 5/16 |
| 08 Health/Medicine | ░░░░░░░░░░ | 0/15 |
| 09 Business/Mgmt | ▓▓▓▓░░░░░░ | 2/12 |
| 10 Education | ░░░░░░░░░░ | 0/9 |
| 11 Arts/Design | ░░░░░░░░░░ | 0/12 |
| 12 Law/Public Admin | ░░░░░░░░░░ | 0/10 |
| 13 Agriculture/Env | ░░░░░░░░░░ | 0/10 |
| 14 Trades | ░░░░░░░░░░ | 0/10 |
| 15 Religion | ░░░░░░░░░░ | 0/8 |

---

## ⚠️ Gaps & Warnings

### Untouched for >90 Days
```dataview
LIST
FROM "02-Domains"
WHERE status != "untouched"
  AND status != "expert"
  AND date(now) - date(last_read) > dur(90 days)
SORT last_read ASC
LIMIT 10
```

### Branches Never Touched
```dataview
LIST
FROM "02-Domains"
WHERE status = "untouched"
GROUP BY branch_name
```

---

## 🔗 Recent Isomorphisms

```dataview
TABLE WITHOUT ID
  file.link as "Concept",
  length(domains) as "Domains Connected"
FROM "04-Isomorphisms"
SORT file.ctime DESC
LIMIT 5
```

---

## 📝 Recent Weekly Syntheses

```dataview
TABLE WITHOUT ID
  file.link as "Week",
  books_completed as "Books",
  isomorphisms_created as "Isomorphisms"
FROM "08-Weekly-Synthesis"
SORT file.name DESC
LIMIT 4
```

---

## 🎲 Today's Bisociation Prompt

**Anchor domain (from strength):** <!-- Use pm-pair to generate -->
**Distant domain:**
**Distance:**
**Prompt:**

---

## 📚 Reading Queue

```dataview
TABLE WITHOUT ID
  file.link as "Book",
  domain as "Domain",
  function_slot as "Slot"
FROM "03-Books"
WHERE status = "queued"
LIMIT 10
```

---

## Quick Actions

- [[00-System/Reading-Queue|📋 Full Reading Queue]]
- [[00-System/Domain-Index|🗂️ Domain Index]]
- [[00-System/Problem-Index|🎯 Problems]]
- `pm-next` — Get next recommendation
- `pm-pair` — Generate bisociation
- `pm-status` — Full statistics
'''


def get_template(template_name: str) -> str:
    """Get a template by name.

    Args:
        template_name: One of: daily_log, domain_profile, book_note,
                      isomorphism, bridge, blind_spot, problem,
                      weekly_synthesis, branch_overview, dashboard

    Returns:
        The template string.
    """
    templates = {
        "daily_log": DAILY_LOG_TEMPLATE,
        "domain_profile": DOMAIN_PROFILE_TEMPLATE,
        "book_note": BOOK_NOTE_TEMPLATE,
        "isomorphism": ISOMORPHISM_TEMPLATE,
        "bridge": BRIDGE_TEMPLATE,
        "blind_spot": BLIND_SPOT_TEMPLATE,
        "problem": PROBLEM_TEMPLATE,
        "weekly_synthesis": WEEKLY_SYNTHESIS_TEMPLATE,
        "branch_overview": BRANCH_OVERVIEW_TEMPLATE,
        "dashboard": DASHBOARD_TEMPLATE,
    }
    return templates.get(template_name, "")
