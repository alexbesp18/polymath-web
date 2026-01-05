# Polymath Engine: System Specification
## Part 1: System Overview and Domain Taxonomy

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose

Build a personal knowledge management and traversal system for systematic polymathic learning. The system tracks reading across 170+ academic/practical domains, identifies cross-domain connections (isomorphisms), manages strategic reading sequences, and produces insights for innovation and translation between fields.

### 1.2 User Profile

- **Name:** Alex
- **Location:** Austin, Texas
- **Languages:** English, Russian
- **Existing expertise:** AI/ML, Finance, Crypto/Distributed Systems, Software Engineering, Economics
- **Goals:** Innovation (novel combinations), Translation (bridging fields)
- **Tolerance for waste:** High (can explore freely)
- **Work context:** AI automation consultant targeting high-value niche markets ($200k+ professionals, $20k+ solutions)

### 1.3 Core Goals

1. **Coverage:** Survey all 170 domains at foundation level
2. **Innovation:** Generate unexpected cross-domain insights via bisociation
3. **Translation:** Build capacity to make Field A legible to Field B
4. **Production:** Eventually produce writing, products, consulting frameworks

### 1.4 System Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Knowledge Vault | Obsidian | Store all notes, logs, connections |
| CLI Tools | Python | Automate recommendations, tracking, analysis |
| Data Layer | Markdown + YAML frontmatter | Structured data in plain text |
| Visualization | Obsidian Dataview + external scripts | Progress tracking, gap analysis |

---

## 2. DOMAIN TAXONOMY

### 2.1 Structure

```
Tier 1: Branch (15 total)
└── Tier 2: Domain (170 total)
    └── Tier 3: Function Slots (6 per domain, standardized)
        └── Tier 3b: Topic Subtopics (variable, emerges with depth)
```

### 2.2 Complete Domain Index

---

#### BRANCH 01: PHYSICAL SCIENCES (13 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 01.01 | Classical Mechanics | Motion, forces, energy at human scale | No |
| 01.02 | Thermodynamics | Heat, entropy, energy transfer | **HUB** |
| 01.03 | Electromagnetism | Electric/magnetic fields, light | No |
| 01.04 | Quantum Mechanics | Subatomic behavior, wave functions | No |
| 01.05 | Relativity / Cosmology | Spacetime, gravity, universe structure | No |
| 01.06 | Particle Physics | Fundamental particles, standard model | No |
| 01.07 | Organic Chemistry | Carbon-based compounds | No |
| 01.08 | Inorganic Chemistry | Non-carbon compounds, metals | No |
| 01.09 | Physical Chemistry | Chemical systems via physics | No |
| 01.10 | Geology / Earth Systems | Rock, plate tectonics, geomorphology | No |
| 01.11 | Oceanography | Ocean systems, currents, marine chemistry | No |
| 01.12 | Atmospheric Science | Weather, climate, air composition | No |
| 01.13 | Astronomy / Astrophysics | Celestial objects, stellar evolution | No |

---

#### BRANCH 02: LIFE SCIENCES (12 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 02.01 | Molecular Biology | DNA, RNA, protein synthesis | No |
| 02.02 | Cell Biology | Cell structure, organelles, division | No |
| 02.03 | Genetics / Genomics | Heredity, gene expression, sequencing | No |
| 02.04 | Evolutionary Biology | Natural selection, speciation, phylogenetics | **HUB** |
| 02.05 | Ecology | Organism-environment interactions | No |
| 02.06 | Microbiology | Bacteria, viruses, fungi | No |
| 02.07 | Botany / Plant Science | Plant physiology, taxonomy | No |
| 02.08 | Zoology | Animal physiology, behavior | No |
| 02.09 | Developmental Biology | Embryology, morphogenesis | No |
| 02.10 | Systems Biology | Biological networks, computational models | No |
| 02.11 | Marine Biology | Ocean life systems | No |
| 02.12 | Entomology | Insects | No |

---

#### BRANCH 03: FORMAL SCIENCES (11 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 03.01 | Algebra / Number Theory | Abstract structures, integers, primes | No |
| 03.02 | Geometry / Topology | Spatial properties, continuous deformation | No |
| 03.03 | Analysis / Calculus | Limits, continuity, change | No |
| 03.04 | Probability / Statistics | Uncertainty, inference, distributions | **HUB** |
| 03.05 | Logic / Set Theory | Valid reasoning, foundations | No |
| 03.06 | Combinatorics / Graph Theory | Counting, discrete structures | No |
| 03.07 | Information Theory | Encoding, compression, channel capacity | **HUB** |
| 03.08 | Computation Theory | Algorithms, complexity, computability | No |
| 03.09 | Game Theory | Strategic interaction, equilibria | **HUB** |
| 03.10 | Decision Theory | Choice under uncertainty | No |
| 03.11 | Category Theory | Mathematical structure of structures | No |

---

#### BRANCH 04: MIND SCIENCES (10 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 04.01 | Cognitive Psychology | Attention, memory, reasoning | No |
| 04.02 | Developmental Psychology | Lifespan mental changes | No |
| 04.03 | Social Psychology | Interpersonal influence, group behavior | No |
| 04.04 | Clinical Psychology | Psychopathology, treatment | No |
| 04.05 | Evolutionary Psychology | Adaptive origins of cognition | No |
| 04.06 | Cognitive Neuroscience | Neural basis of mental processes | No |
| 04.07 | Perception / Sensation | How senses construct reality | No |
| 04.08 | Behavioral Neuroscience | Brain-behavior relationships | No |
| 04.09 | Consciousness Studies | Subjective experience, awareness | No |
| 04.10 | Psycholinguistics | Language processing in the mind | No |

---

#### BRANCH 05: SOCIAL SCIENCES (16 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 05.01 | Microeconomics | Individual/firm decision-making | No |
| 05.02 | Macroeconomics | Aggregate economies, policy | No |
| 05.03 | Behavioral Economics | Psychological drivers of economic choice | No |
| 05.04 | Development Economics | Economic growth in poor countries | No |
| 05.05 | Finance Theory | Asset pricing, risk, markets | No |
| 05.06 | Sociology of Organizations | How institutions structure behavior | No |
| 05.07 | Sociology of Culture | Meaning-making, norms, identity | No |
| 05.08 | Political Economy | Power and resource distribution | No |
| 05.09 | Comparative Politics | Political systems across countries | No |
| 05.10 | International Relations | State interactions, war, cooperation | No |
| 05.11 | Geopolitics | Geography and power | No |
| 05.12 | Cultural Anthropology | Human societies, ethnography | No |
| 05.13 | Linguistics | Language structure, change, use | No |
| 05.14 | Demography | Population dynamics | No |
| 05.15 | Urban Studies | Cities as systems | No |
| 05.16 | Criminology | Crime causation, justice systems | No |

---

#### BRANCH 06: HUMANITIES (16 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 06.01 | Metaphysics | Nature of reality, existence | No |
| 06.02 | Epistemology | Knowledge, justification, belief | No |
| 06.03 | Ethics / Moral Philosophy | Right action, value | No |
| 06.04 | Political Philosophy | Justice, authority, rights | No |
| 06.05 | Philosophy of Mind | Mental states, consciousness | No |
| 06.06 | Philosophy of Science | Scientific method, explanation | No |
| 06.07 | Aesthetics | Beauty, art, taste | No |
| 06.08 | Ancient History | Pre-500 CE civilizations | No |
| 06.09 | Medieval History | 500-1500 CE | No |
| 06.10 | Early Modern History | 1500-1800 | No |
| 06.11 | Modern History | 1800-present | No |
| 06.12 | Historiography | How history is written | No |
| 06.13 | Literary Theory / Criticism | How texts produce meaning | No |
| 06.14 | Classics | Greek/Roman civilization | No |
| 06.15 | Intellectual History | History of ideas | No |
| 06.16 | Rhetoric / Composition | Persuasion, argument, writing | No |

---

#### BRANCH 07: ENGINEERING (16 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 07.01 | Mechanical Engineering | Machines, thermal systems | No |
| 07.02 | Electrical Engineering | Circuits, power, signals | No |
| 07.03 | Civil / Structural Engineering | Infrastructure, buildings | No |
| 07.04 | Chemical Engineering | Process design, reactions at scale | No |
| 07.05 | Materials Science | Properties of matter for use | No |
| 07.06 | Aerospace Engineering | Aircraft, spacecraft | No |
| 07.07 | Computer Architecture | Hardware design, processors | No |
| 07.08 | Software Engineering | Building reliable software systems | EXPERT |
| 07.09 | AI / Machine Learning | Intelligent systems | EXPERT |
| 07.10 | Networks / Distributed Systems | Communication, coordination | EXPERT |
| 07.11 | Robotics | Autonomous physical agents | No |
| 07.12 | Biomedical Engineering | Engineering for medicine | No |
| 07.13 | Environmental Engineering | Pollution, remediation | No |
| 07.14 | Systems Engineering | Complex system integration | No |
| 07.15 | Industrial Engineering | Optimization, operations | No |
| 07.16 | Nuclear Engineering | Fission, fusion, radiation | No |

---

#### BRANCH 08: HEALTH / MEDICINE (15 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 08.01 | Anatomy / Physiology | Body structure and function | No |
| 08.02 | Pathology | Disease mechanisms | No |
| 08.03 | Pharmacology | Drug action, development | No |
| 08.04 | Immunology | Immune system function | No |
| 08.05 | Epidemiology | Disease patterns in populations | No |
| 08.06 | Public Health | Population health interventions | No |
| 08.07 | Nutrition Science | Diet and health | No |
| 08.08 | Psychiatry | Mental illness treatment | No |
| 08.09 | Surgery | Operative intervention | No |
| 08.10 | Internal Medicine | Adult non-surgical disease | No |
| 08.11 | Pediatrics | Child health | No |
| 08.12 | Geriatrics | Aging and elder care | No |
| 08.13 | Emergency Medicine | Acute care | No |
| 08.14 | Nursing Science | Care delivery | No |
| 08.15 | Rehabilitation Sciences | Recovery of function | No |

---

#### BRANCH 09: BUSINESS / MANAGEMENT (12 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 09.01 | Corporate Strategy | Competitive positioning, growth | No |
| 09.02 | Operations / Supply Chain | Production, logistics, flow | No |
| 09.03 | Marketing / Consumer Behavior | Demand creation, persuasion | No |
| 09.04 | Corporate Finance | Capital structure, valuation | EXPERT |
| 09.05 | Accounting | Measurement, reporting | No |
| 09.06 | Organizational Behavior | People in organizations | No |
| 09.07 | Entrepreneurship | Venture creation | No |
| 09.08 | Negotiation / Influence | Deal-making, persuasion | No |
| 09.09 | Leadership | Directing collective action | No |
| 09.10 | Human Resource Management | Talent systems | No |
| 09.11 | Real Estate | Property markets, development | No |
| 09.12 | Insurance / Risk Management | Risk transfer, pricing | No |

---

#### BRANCH 10: EDUCATION (9 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 10.01 | Curriculum Design | What to teach, sequencing | No |
| 10.02 | Pedagogy / Instructional Methods | How to teach | No |
| 10.03 | Educational Psychology | Learning, motivation, development | No |
| 10.04 | Educational Assessment | Measuring learning | No |
| 10.05 | Educational Administration | Running schools/systems | No |
| 10.06 | Special Education | Atypical learners | No |
| 10.07 | Adult / Continuing Education | Post-formal learning | No |
| 10.08 | Educational Technology | Tools for learning | No |
| 10.09 | Higher Education Studies | Universities as institutions | No |

---

#### BRANCH 11: ARTS / DESIGN / COMMUNICATION (12 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 11.01 | Visual Arts / Art History | Painting, sculpture, history | No |
| 11.02 | Architecture | Building design | No |
| 11.03 | Industrial / Product Design | Object design for use | No |
| 11.04 | Graphic / Communication Design | Visual messaging | No |
| 11.05 | Film / Media Studies | Moving image, media theory | No |
| 11.06 | Music Theory / Composition | Sound organization | No |
| 11.07 | Theater / Performance | Live embodied art | No |
| 11.08 | Creative Writing | Prose, poetry craft | No |
| 11.09 | Journalism | News gathering, reporting | No |
| 11.10 | Advertising / PR | Commercial persuasion | No |
| 11.11 | Photography | Image capture, meaning | No |
| 11.12 | Game Design | Interactive experience design | No |

---

#### BRANCH 12: LAW / PUBLIC ADMINISTRATION (10 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 12.01 | Constitutional Law | Fundamental legal structure | No |
| 12.02 | Criminal Law | Prosecution, defense, punishment | No |
| 12.03 | Civil / Contract Law | Private disputes, agreements | No |
| 12.04 | Corporate / Commercial Law | Business legal framework | No |
| 12.05 | International Law | Cross-border legal systems | No |
| 12.06 | Administrative Law | Government agency regulation | No |
| 12.07 | Public Policy Analysis | Policy design, evaluation | No |
| 12.08 | Public Administration | Government management | No |
| 12.09 | Social Work | Human services delivery | No |
| 12.10 | Nonprofit Management | Third sector organizations | No |

---

#### BRANCH 13: AGRICULTURE / ENVIRONMENT / NATURAL RESOURCES (10 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 13.01 | Agronomy / Crop Science | Plant cultivation | No |
| 13.02 | Animal Science | Livestock production | No |
| 13.03 | Soil Science | Soil composition, fertility | No |
| 13.04 | Food Science / Technology | Processing, safety | No |
| 13.05 | Veterinary Science | Animal health | No |
| 13.06 | Forestry | Forest management | No |
| 13.07 | Fisheries / Aquaculture | Aquatic resource management | No |
| 13.08 | Wildlife Management | Wild animal populations | No |
| 13.09 | Environmental Policy | Regulation, conservation law | No |
| 13.10 | Sustainable Systems | Regenerative design | No |

---

#### BRANCH 14: TRADES / APPLIED TECHNOLOGIES (10 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 14.01 | Construction Trades | Building, carpentry, masonry | No |
| 14.02 | Electrical Trades | Wiring, installation | No |
| 14.03 | Plumbing / HVAC | Water, heating, cooling systems | No |
| 14.04 | Automotive Technology | Vehicle repair, systems | No |
| 14.05 | Welding / Metalwork | Joining, fabrication | No |
| 14.06 | Machining / CNC | Precision manufacturing | No |
| 14.07 | Aviation Maintenance | Aircraft systems | No |
| 14.08 | Transportation / Logistics | Moving goods, routing | No |
| 14.09 | Culinary Arts | Food preparation, service | No |
| 14.10 | Cosmetology / Personal Services | Grooming, aesthetics | No |

---

#### BRANCH 15: RELIGION / THEOLOGY (8 domains)

| ID | Domain | Description | Hub Status |
|----|--------|-------------|------------|
| 15.01 | Comparative Religion | Cross-tradition analysis | No |
| 15.02 | Biblical Studies | Text, history, interpretation | No |
| 15.03 | Systematic Theology | Doctrine, belief systems | No |
| 15.04 | Practical Theology | Ministry, pastoral care | No |
| 15.05 | Islamic Studies | Quran, hadith, jurisprudence | No |
| 15.06 | Buddhist Studies | Dharma, practice traditions | No |
| 15.07 | Jewish Studies | Torah, Talmud, history | No |
| 15.08 | Mysticism / Contemplative Studies | Direct experience traditions | No |

---

### 2.3 Domain Status Definitions

| Status | Definition | Books Read |
|--------|------------|------------|
| `untouched` | Never read anything | 0 |
| `surveying` | Working through foundation | 1-2 |
| `surveyed` | Completed foundation + heresy | 2-4 |
| `deepening` | Adding frontier + bridge | 4-6 |
| `specialized` | Exploring topic layer | 6+ |
| `expert` | Pre-existing expertise | N/A |

### 2.4 Hub Domains (Priority)

These domains connect to many others and should be front-loaded:

| Hub | Branch | Why Critical | Alex Status |
|-----|--------|--------------|-------------|
| Probability / Statistics | 03.04 | Every empirical field | Moderate |
| Information Theory | 03.07 | CS, physics, neuro, linguistics | Moderate |
| Game Theory | 03.09 | Economics, biology, politics, AI | Good |
| Evolutionary Theory | 02.04 | Biology, psychology, economics, culture | **GAP** |
| Network Theory | 03.06 | Sociology, epidemiology, CS, ecology | **GAP** |
| Thermodynamics | 01.02 | Physics, chemistry, biology, information | **GAP** |
| Control Theory | 07.14 | Engineering, neuroscience, economics | Low |

### 2.5 Function Slots (Tier 3a - Standardized)

Every domain has exactly 6 function slots:

| Slot | Code | Purpose | Curation Priority |
|------|------|---------|-------------------|
| Foundation | `FND` | What everyone assumes; entry point | Clarity, density |
| Orthodoxy | `ORT` | Current consensus view | Representativeness |
| Heresy | `HRS` | Best attacks on consensus | Rigor of critique |
| Frontier | `FRN` | Unresolved problems, active research | Problem-revealing |
| History | `HST` | How field became what it is | "Why this way" |
| Bridge | `BRG` | Best connection to another field | Explicit translation |

### 2.6 Topic Subtopics (Tier 3b - Variable)

Only populated when domain status reaches `deepening` or `specialized`. Structure is domain-specific.

Example for 07.09 AI/ML:
```yaml
subtopics:
  - id: "07.09.01"
    name: "Classical ML"
    description: "Regression, trees, SVMs, ensemble methods"
  - id: "07.09.02"
    name: "Deep Learning"
    description: "Neural architectures, training dynamics"
  - id: "07.09.03"
    name: "Reinforcement Learning"
    description: "MDPs, policy gradient, exploration"
  - id: "07.09.04"
    name: "NLP / Language Models"
    description: "Transformers, tokenization, alignment"
  - id: "07.09.05"
    name: "Computer Vision"
    description: "CNNs, object detection, generation"
  - id: "07.09.06"
    name: "AI Safety / Alignment"
    description: "Value alignment, interpretability, risk"
  - id: "07.09.07"
    name: "ML Systems / MLOps"
    description: "Deployment, monitoring, infrastructure"
  - id: "07.09.08"
    name: "AI Ethics / Governance"
    description: "Fairness, accountability, policy"
```

---

## 3. BRANCH DISTANCE MATRIX

Used for computing "distance" between domains for bisociation pairing.

Scale: 0 = same branch, 1 = adjacent, 2 = moderate, 3 = far, 4 = maximum

```
                 01   02   03   04   05   06   07   08   09   10   11   12   13   14   15
01-Physical      0    1    1    2    2    3    1    2    3    3    3    3    2    2    4
02-Life          1    0    2    1    2    3    2    1    3    3    3    3    1    3    4
03-Formal        1    2    0    2    1    2    1    2    1    2    2    2    2    2    3
04-Mind          2    1    2    0    1    2    2    1    2    1    2    2    3    3    3
05-Social        2    2    1    1    0    1    2    2    1    2    2    1    2    3    2
06-Humanities    3    3    2    2    1    0    3    3    2    2    1    1    3    3    1
07-Engineering   1    2    1    2    2    3    0    1    2    2    2    2    2    1    4
08-Health        2    1    2    1    2    3    1    0    2    2    3    2    2    3    3
09-Business      3    3    1    2    1    2    2    2    0    2    2    1    2    2    3
10-Education     3    3    2    1    2    2    2    2    2    0    2    2    3    3    2
11-Arts          3    3    2    2    2    1    2    3    2    2    0    2    3    3    2
12-Law           3    3    2    2    1    1    2    2    1    2    2    0    2    3    2
13-Agriculture   2    1    2    3    2    3    2    2    2    3    3    2    0    2    3
14-Trades        2    3    2    3    3    3    1    3    2    3    3    3    2    0    4
15-Religion      4    4    3    3    2    1    4    3    3    2    2    2    3    4    0
```

---

## 4. USER'S EXISTING KNOWLEDGE MAP

### 4.1 Expert Domains (don't re-read foundations)

| Domain ID | Domain | Level |
|-----------|--------|-------|
| 07.08 | Software Engineering | Expert |
| 07.09 | AI / Machine Learning | Expert |
| 07.10 | Networks / Distributed Systems | Expert |
| 05.05 | Finance Theory | Expert |
| 09.04 | Corporate Finance | Expert |

### 4.2 Moderate Domains (some foundation present)

| Domain ID | Domain | Level |
|-----------|--------|-------|
| 05.01 | Microeconomics | Moderate |
| 05.02 | Macroeconomics | Moderate |
| 03.04 | Probability / Statistics | Moderate |
| 03.07 | Information Theory | Moderate |
| 03.09 | Game Theory | Good |
| 03.10 | Decision Theory | Good |

### 4.3 Critical Gaps (high priority)

| Domain ID | Domain | Why Critical |
|-----------|--------|--------------|
| 02.04 | Evolutionary Biology | Only general theory of adaptation |
| 01.02 | Thermodynamics | Entropy, irreversibility, info-energy link |
| 03.06 | Network Theory | Market structure, influence, contagion |
| 05.06 | Sociology of Organizations | Why enterprises buy |
| 12.04 | Corporate / Commercial Law | Compliance moats |
| 04.01 | Cognitive Psychology | Psychology of expertise |

### 4.4 Unique Advantages

- Russian language access (math, physics, chess literature)
- Finance + AI intersection
- "Thinking in Bets" decision framework internalized
- High tolerance for exploratory waste

---

## 5. CORE PROBLEMS (Drive traversal)

### P1: Why High-Value Professionals Pay

**Question:** Why do professionals earning $200k+ pay $20k+ for solutions?

**Relevant domains:**
- 04.01 Cognitive Psychology (expertise, cognitive load)
- 05.03 Behavioral Economics (willingness to pay, loss aversion)
- 05.06 Sociology of Organizations (professional norms)
- 04.03 Social Psychology (status, signaling)
- 09.03 Marketing / Consumer Behavior (value perception)

### P2: AI Product Defensibility

**Question:** What makes an AI automation product defensible?

**Relevant domains:**
- 12.04 Corporate / Commercial Law (IP, contracts)
- 05.06 Sociology of Organizations (switching costs)
- 03.06 Network Theory (network effects)
- 09.01 Corporate Strategy (competitive moats)
- 07.14 Systems Engineering (integration complexity)

### P3: Underserved Niche Identification

**Question:** Where are the underserved high-value niches?

**Relevant domains:**
- 05.14 Demography (population segments)
- 05.15 Urban Studies (geographic clusters)
- 05.06 Sociology of Organizations (industry structure)
- 09.03 Marketing / Consumer Behavior (segmentation)
- Various vertical-specific domains

### P4: Coordination Failure Opportunities

**Question:** How do coordination failures create business opportunities?

**Relevant domains:**
- 03.09 Game Theory (equilibria, collective action)
- 05.08 Political Economy (institutional failure)
- 05.06 Sociology of Organizations (bureaucratic dysfunction)
- 02.04 Evolutionary Biology (maladaptation)
- 07.14 Systems Engineering (system failures)

---

*End of Part 1. Continue to SPEC-02-OBSIDIAN-STRUCTURE.md*
