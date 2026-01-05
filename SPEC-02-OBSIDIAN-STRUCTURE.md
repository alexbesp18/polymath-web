# Polymath Engine: System Specification
## Part 2: Obsidian Vault Structure and Templates

---

## 1. VAULT DIRECTORY STRUCTURE

```
📁 Polymath-Engine/
│
├── 📁 00-System/
│   ├── Dashboard.md
│   ├── Domain-Index.md
│   ├── Branch-Index.md
│   ├── Reading-Queue.md
│   ├── Hub-Tracker.md
│   ├── Problem-Index.md
│   └── 📁 Templates/
│       ├── T-Daily-Log.md
│       ├── T-Domain-Profile.md
│       ├── T-Book-Note.md
│       ├── T-Isomorphism.md
│       ├── T-Bridge.md
│       ├── T-Blind-Spot.md
│       ├── T-Problem.md
│       └── T-Weekly-Synthesis.md
│
├── 📁 01-Daily-Logs/
│   └── YYYY-MM-DD.md (one per reading day)
│
├── 📁 02-Domains/
│   ├── 📁 01-Physical-Sciences/
│   │   ├── _Branch-Overview.md
│   │   ├── 01.01-Classical-Mechanics.md
│   │   ├── 01.02-Thermodynamics.md
│   │   └── ... (13 total)
│   ├── 📁 02-Life-Sciences/
│   │   ├── _Branch-Overview.md
│   │   ├── 02.01-Molecular-Biology.md
│   │   └── ... (12 total)
│   ├── 📁 03-Formal-Sciences/
│   │   └── ... (11 total)
│   ├── 📁 04-Mind-Sciences/
│   │   └── ... (10 total)
│   ├── 📁 05-Social-Sciences/
│   │   └── ... (16 total)
│   ├── 📁 06-Humanities/
│   │   └── ... (16 total)
│   ├── 📁 07-Engineering/
│   │   └── ... (16 total)
│   ├── 📁 08-Health-Medicine/
│   │   └── ... (15 total)
│   ├── 📁 09-Business-Management/
│   │   └── ... (12 total)
│   ├── 📁 10-Education/
│   │   └── ... (9 total)
│   ├── 📁 11-Arts-Design-Communication/
│   │   └── ... (12 total)
│   ├── 📁 12-Law-Public-Admin/
│   │   └── ... (10 total)
│   ├── 📁 13-Agriculture-Environment/
│   │   └── ... (10 total)
│   ├── 📁 14-Trades-Applied-Tech/
│   │   └── ... (10 total)
│   └── 📁 15-Religion-Theology/
│       └── ... (8 total)
│
├── 📁 03-Books/
│   └── Author-ShortTitle.md (one per book read)
│
├── 📁 04-Isomorphisms/
│   └── Concept-Name.md (one per cross-domain concept)
│
├── 📁 05-Bridges/
│   └── DomainA-to-DomainB.md (one per explicit connection)
│
├── 📁 06-Blind-Spots/
│   └── Domain-Name.md (one per analyzed domain)
│
├── 📁 07-Problems/
│   ├── P1-Why-Professionals-Pay.md
│   ├── P2-AI-Product-Defensibility.md
│   ├── P3-Underserved-Niches.md
│   ├── P4-Coordination-Failures.md
│   └── ... (user-defined problems)
│
├── 📁 08-Weekly-Synthesis/
│   └── YYYY-Www.md (one per week)
│
├── 📁 09-Production/
│   ├── 📁 Ideas/
│   ├── 📁 Drafts/
│   └── 📁 Published/
│
└── 📁 99-Archive/
    └── (old/deprecated files)
```

---

## 2. TEMPLATE SPECIFICATIONS

### 2.1 T-Daily-Log.md

**Filename pattern:** `YYYY-MM-DD.md`
**Location:** `01-Daily-Logs/`

```markdown
---
date: {{date:YYYY-MM-DD}}
type: daily-log
domain: ""
domain_id: ""
book: ""
book_link: ""
function_slot: ""
pages_read: 0
reading_time_minutes: 0
phase: ""
bisociation_partner: ""
tags:
  - daily-log
---

# {{date:YYYY-MM-DD}} — Reading Log

## Session Details

| Field | Value |
|-------|-------|
| **Domain** | [[02-Domains/]] |
| **Book** | [[03-Books/]] |
| **Function Slot** | `FND` / `ORT` / `HRS` / `FRN` / `HST` / `BRG` |
| **Pages/Chapters** | |
| **Time** | minutes |
| **Phase** | hub-completion / problem-driven / bisociation |

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

**What does {{domain}} reveal about {{bisociation_partner}}?**


**What would a {{domain}} expert find confusing about {{bisociation_partner}}?**


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
```

---

### 2.2 T-Domain-Profile.md

**Filename pattern:** `XX.YY-Domain-Name.md`
**Location:** `02-Domains/[Branch-Folder]/`

```markdown
---
domain_id: "XX.YY"
domain_name: ""
branch_id: "XX"
branch_name: ""
status: "untouched"
is_hub: false
is_expert: false
books_read: 0
last_read: ""
date_created: {{date:YYYY-MM-DD}}
date_modified: {{date:YYYY-MM-DD}}
priority: "normal"
tags:
  - domain
  - branch/XX
---

# {{domain_id}} — {{domain_name}}

> **Branch:** [[02-Domains/XX-Branch-Name/_Branch-Overview|XX — Branch Name]]
> **Status:** `{{status}}`
> **Books Read:** {{books_read}}
> **Last Active:** {{last_read}}

---

## Domain Overview

**What this field studies:**


**Core questions it asks:**
1. 
2. 
3. 

**Why it matters for polymath goals:**


---

## Function Slots

### Foundation (`FND`) — What everyone assumes
**Status:** ⬜ Not started / 🟡 In progress / ✅ Complete

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
**Status:** ⬜ / 🟡 / ✅

**Book(s):**
- [ ] [[03-Books/]]

**What the mainstream believes:**


**Dominant methodology:**


**Key figures (living):**

---

### Heresy (`HRS`) — Best attacks on consensus
**Status:** ⬜ / 🟡 / ✅

**Book(s):**
- [ ] [[03-Books/]]

**What critics say is wrong:**


**Alternative paradigms:**


**Key dissidents:**

---

### Frontier (`FRN`) — Unresolved problems
**Status:** ⬜ / 🟡 / ✅

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
**Status:** ⬜ / 🟡 / ✅

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
**Status:** ⬜ / 🟡 / ✅

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
| XX.YY.01 | | | |
| XX.YY.02 | | | |
| XX.YY.03 | | | |

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
```

---

### 2.3 T-Book-Note.md

**Filename pattern:** `Author-ShortTitle.md`
**Location:** `03-Books/`

```markdown
---
title: ""
author: ""
year: 
domain_id: ""
domain: ""
function_slot: ""
status: "reading"
date_started: {{date:YYYY-MM-DD}}
date_finished: ""
rating: 0
pages: 0
isbn: ""
source: ""
tags:
  - book
  - slot/FND
  - domain/XX.YY
---

# {{title}}

> **Author:** {{author}}
> **Year:** {{year}}
> **Domain:** [[02-Domains/{{domain}}|{{domain_id}} — {{domain}}]]
> **Function Slot:** `{{function_slot}}`
> **Status:** {{status}}

---

## Why I Read This

**Slot it fills:**
**What I hoped to learn:**
**How I found it:**

---

## Book in 3 Sentences

1. 
2. 
3. 

---

## Core Mechanisms

### Mechanism 1: {{name}}
**The claim:**
**How it works:**
**Evidence given:**
**Conditions/limits:**

### Mechanism 2: {{name}}
**The claim:**
**How it works:**
**Evidence given:**
**Conditions/limits:**

### Mechanism 3: {{name}}
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
- {{date}}: pages X-Y
- {{date}}: pages Y-Z

**Total time:** hours

**Difficulty:** easy / moderate / hard / very hard

**Density:** low / medium / high / very high

**Would recommend to:** 
```

---

### 2.4 T-Isomorphism.md

**Filename pattern:** `Concept-Name.md`
**Location:** `04-Isomorphisms/`

```markdown
---
concept_name: ""
date_created: {{date:YYYY-MM-DD}}
date_modified: {{date:YYYY-MM-DD}}
domains: []
confidence: ""
tags:
  - isomorphism
---

# {{concept_name}}

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

### Explaining {{Domain A}}'s version to {{Domain B}} person:


### Explaining {{Domain B}}'s version to {{Domain A}} person:


---

## Best Bridge Sources

1. [[03-Books/]] — why:
2. [[03-Books/]] — why:

---

## Generative Questions

1. What would happen if we applied {{Domain A}}'s treatment in {{Domain B}}?

2. What does {{Domain A}} know about this that {{Domain B}} hasn't discovered?

3. Where does the isomorphism break down?

---

## Innovation Opportunities

**Gaps I notice:**


**What could be built:**


**Who would care:**

---

## Confidence Assessment

**Confidence in isomorphism:** high / medium / low

**What would increase confidence:**


**What would decrease confidence:**


---

## Discovery Log

**First noticed:** {{date}}
**In context of:** [[01-Daily-Logs/]]
**Subsequent confirmations:**
- [[01-Daily-Logs/]]
- [[01-Daily-Logs/]]
```

---

### 2.5 T-Bridge.md

**Filename pattern:** `DomainA-to-DomainB.md`
**Location:** `05-Bridges/`

```markdown
---
domain_a_id: ""
domain_a_name: ""
domain_b_id: ""
domain_b_name: ""
bridge_type: ""
strength: ""
date_created: {{date:YYYY-MM-DD}}
date_modified: {{date:YYYY-MM-DD}}
tags:
  - bridge
---

# {{domain_a_name}} ↔ {{domain_b_name}}

> **Type:** {{bridge_type}}
> **Strength:** {{strength}}

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

## What A Sees That B Misses


---

## What B Sees That A Misses


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

**Strength:** strong / moderate / weak / speculative

**Evidence for connection:**


**Limits of the bridge:**


---

## Related Isomorphisms

```dataview
LIST
FROM "04-Isomorphisms"
WHERE contains(domains, [[02-Domains/{{domain_a_id}}]]) 
  AND contains(domains, [[02-Domains/{{domain_b_id}}]])
```
```

---

### 2.6 T-Blind-Spot.md

**Filename pattern:** `Domain-Name-Blind-Spots.md`
**Location:** `06-Blind-Spots/`

```markdown
---
domain_id: ""
domain_name: ""
date_created: {{date:YYYY-MM-DD}}
date_modified: {{date:YYYY-MM-DD}}
tags:
  - blind-spot
---

# Blind Spots: {{domain_name}}

> **Domain:** [[02-Domains/{{domain_id}}|{{domain_id}} — {{domain_name}}]]
> **Last Updated:** {{date_modified}}

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
```

---

### 2.7 T-Problem.md

**Filename pattern:** `PX-Problem-Name.md`
**Location:** `07-Problems/`

```markdown
---
problem_id: "PX"
problem_name: ""
status: "active"
date_created: {{date:YYYY-MM-DD}}
date_modified: {{date:YYYY-MM-DD}}
priority: "high"
relevant_domains: []
tags:
  - problem
---

# {{problem_id}}: {{problem_name}}

> **Status:** {{status}}
> **Priority:** {{priority}}
> **Created:** {{date_created}}

---

## The Question

**Core question:**


**Why this matters to me:**


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

**As of {{date}}:**


**Confidence:** high / medium / low

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

### H1: {{hypothesis}}
**Status:** active / supported / refuted / evolved
**Evidence for:**
**Evidence against:**
**What would confirm:**
**What would refute:**

### H2: {{hypothesis}}
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
```

---

### 2.8 T-Weekly-Synthesis.md

**Filename pattern:** `YYYY-Www.md`
**Location:** `08-Weekly-Synthesis/`

```markdown
---
week_number: ""
year: ""
date_start: ""
date_end: ""
phase: ""
books_completed: 0
domains_touched: 0
isomorphisms_created: 0
bridges_created: 0
tags:
  - weekly-synthesis
---

# Week {{week_number}}, {{year}} — Synthesis

> **Period:** {{date_start}} to {{date_end}}
> **Phase:** {{phase}}

---

## Reading Summary

### Books Completed

| Book | Domain | Slot | Rating |
|------|--------|------|--------|
| [[03-Books/]] | [[02-Domains/]] | | /5 |
| [[03-Books/]] | | | |
| [[03-Books/]] | | | |
| [[03-Books/]] | | | |
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

1. **{{name}}** (from [[03-Books/]])
   - How it works:
   - Where it applies:

2. **{{name}}** (from [[03-Books/]])
   - How it works:
   - Where it applies:

3. **{{name}}** (from [[03-Books/]])
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
01-Physical:      ▓▓░░░░░░░░ 2/13
02-Life:          ░░░░░░░░░░ 0/12
03-Formal:        ▓▓▓░░░░░░░ 3/11
04-Mind:          ░░░░░░░░░░ 0/10
05-Social:        ▓░░░░░░░░░ 1/16
06-Humanities:    ░░░░░░░░░░ 0/16
07-Engineering:   ▓▓▓▓▓▓▓▓░░ 8/16 (expert baseline)
08-Health:        ░░░░░░░░░░ 0/15
09-Business:      ▓▓▓▓░░░░░░ 4/12 (expert baseline)
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
```

---

## 3. BRANCH OVERVIEW TEMPLATE

**Filename pattern:** `_Branch-Overview.md`
**Location:** `02-Domains/[XX-Branch-Name]/`

```markdown
---
branch_id: "XX"
branch_name: ""
domain_count: 0
tags:
  - branch-overview
---

# Branch {{branch_id}}: {{branch_name}}

---

## Overview

**What this branch studies:**


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
FROM "02-Domains/{{branch_id}}"
WHERE type = "domain"
SORT domain_id ASC
```

---

## Branch Statistics

**Domains:** {{domain_count}}
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
FROM "02-Domains/{{branch_id}}"
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
```

---

## 4. DASHBOARD SPECIFICATION

**Filename:** `Dashboard.md`
**Location:** `00-System/`

```markdown
---
type: dashboard
---

# Polymath Engine — Dashboard

> **Last Updated:** `= date(now)`
> **Current Phase:** hub-completion / problem-driven / bisociation

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
| [[02-Domains/02.04-Evolutionary-Biology]] | | /4 |
| [[02-Domains/01.02-Thermodynamics]] | | /4 |
| [[02-Domains/03.06-Network-Theory]] | | /4 |
| [[02-Domains/03.04-Probability-Statistics]] | | /4 |
| [[02-Domains/03.07-Information-Theory]] | | /4 |
| [[02-Domains/03.09-Game-Theory]] | | /4 |

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

```

---

*End of Part 2. Continue to SPEC-03-CLI-TOOLS.md*
