# Polymath Engine: System Specification
## Part 4: Complete Domain Data and Initial Book Recommendations

---

## 1. COMPLETE DOMAIN DATA (YAML)

This is the authoritative list of all 170 domains, used by `pm-init` to create domain profile files.

```yaml
# pm/data/domains.yaml

branches:
  - branch_id: 1
    branch_name: "Physical Sciences"
    description: "Study of non-living matter, energy, and forces"
    
  - branch_id: 2
    branch_name: "Life Sciences"
    description: "Study of living organisms and biological systems"
    
  - branch_id: 3
    branch_name: "Formal Sciences"
    description: "Study of abstract structures and symbolic systems"
    
  - branch_id: 4
    branch_name: "Mind Sciences"
    description: "Study of cognition, behavior, and neural systems"
    
  - branch_id: 5
    branch_name: "Social Sciences"
    description: "Study of human societies and social relationships"
    
  - branch_id: 6
    branch_name: "Humanities"
    description: "Study of human culture, meaning, and interpretation"
    
  - branch_id: 7
    branch_name: "Engineering"
    description: "Application of science to design and build systems"
    
  - branch_id: 8
    branch_name: "Health Medicine"
    description: "Study and practice of human health and disease treatment"
    
  - branch_id: 9
    branch_name: "Business Management"
    description: "Study of organizations, markets, and value creation"
    
  - branch_id: 10
    branch_name: "Education"
    description: "Study and practice of teaching and learning"
    
  - branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Creative production and visual/media communication"
    
  - branch_id: 12
    branch_name: "Law Public Admin"
    description: "Legal systems and government administration"
    
  - branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Food production and environmental stewardship"
    
  - branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Practical skills and applied technical work"
    
  - branch_id: 15
    branch_name: "Religion Theology"
    description: "Religious traditions and theological inquiry"

domains:
  # ============================================
  # BRANCH 01: PHYSICAL SCIENCES (13 domains)
  # ============================================
  
  - domain_id: "01.01"
    domain_name: "Classical Mechanics"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Motion, forces, energy at human scale"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.02"
    domain_name: "Thermodynamics"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Heat, entropy, energy transfer, statistical mechanics"
    is_hub: true
    is_expert: false
    
  - domain_id: "01.03"
    domain_name: "Electromagnetism"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Electric and magnetic fields, light, Maxwell's equations"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.04"
    domain_name: "Quantum Mechanics"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Subatomic behavior, wave functions, uncertainty"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.05"
    domain_name: "Relativity Cosmology"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Spacetime, gravity, universe structure, big bang"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.06"
    domain_name: "Particle Physics"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Fundamental particles, standard model, forces"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.07"
    domain_name: "Organic Chemistry"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Carbon-based compounds, reactions, synthesis"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.08"
    domain_name: "Inorganic Chemistry"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Non-carbon compounds, metals, coordination chemistry"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.09"
    domain_name: "Physical Chemistry"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Chemical systems via physics, kinetics, quantum chem"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.10"
    domain_name: "Geology Earth Systems"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Rock, plate tectonics, geomorphology, earth history"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.11"
    domain_name: "Oceanography"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Ocean systems, currents, marine chemistry"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.12"
    domain_name: "Atmospheric Science"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Weather, climate, air composition, meteorology"
    is_hub: false
    is_expert: false
    
  - domain_id: "01.13"
    domain_name: "Astronomy Astrophysics"
    branch_id: 1
    branch_name: "Physical Sciences"
    description: "Celestial objects, stellar evolution, galaxies"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 02: LIFE SCIENCES (12 domains)
  # ============================================
  
  - domain_id: "02.01"
    domain_name: "Molecular Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "DNA, RNA, protein synthesis, gene expression"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.02"
    domain_name: "Cell Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Cell structure, organelles, division, signaling"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.03"
    domain_name: "Genetics Genomics"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Heredity, gene expression, sequencing, CRISPR"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.04"
    domain_name: "Evolutionary Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Natural selection, speciation, phylogenetics, adaptation"
    is_hub: true
    is_expert: false
    
  - domain_id: "02.05"
    domain_name: "Ecology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Organism-environment interactions, ecosystems, conservation"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.06"
    domain_name: "Microbiology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Bacteria, viruses, fungi, microbiomes"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.07"
    domain_name: "Botany Plant Science"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Plant physiology, taxonomy, photosynthesis"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.08"
    domain_name: "Zoology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Animal physiology, behavior, classification"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.09"
    domain_name: "Developmental Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Embryology, morphogenesis, stem cells"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.10"
    domain_name: "Systems Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Biological networks, computational models, omics"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.11"
    domain_name: "Marine Biology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Ocean life systems, coral, marine ecosystems"
    is_hub: false
    is_expert: false
    
  - domain_id: "02.12"
    domain_name: "Entomology"
    branch_id: 2
    branch_name: "Life Sciences"
    description: "Insects, arthropods, insect behavior"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 03: FORMAL SCIENCES (11 domains)
  # ============================================
  
  - domain_id: "03.01"
    domain_name: "Algebra Number Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Abstract structures, integers, primes, groups"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.02"
    domain_name: "Geometry Topology"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Spatial properties, continuous deformation, manifolds"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.03"
    domain_name: "Analysis Calculus"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Limits, continuity, change, differential equations"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.04"
    domain_name: "Probability Statistics"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Uncertainty, inference, distributions, Bayesian methods"
    is_hub: true
    is_expert: false
    
  - domain_id: "03.05"
    domain_name: "Logic Set Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Valid reasoning, foundations, proof theory"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.06"
    domain_name: "Combinatorics Graph Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Counting, discrete structures, networks"
    is_hub: true
    is_expert: false
    
  - domain_id: "03.07"
    domain_name: "Information Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Encoding, compression, channel capacity, entropy"
    is_hub: true
    is_expert: false
    
  - domain_id: "03.08"
    domain_name: "Computation Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Algorithms, complexity, computability, Turing machines"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.09"
    domain_name: "Game Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Strategic interaction, equilibria, mechanism design"
    is_hub: true
    is_expert: false
    
  - domain_id: "03.10"
    domain_name: "Decision Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Choice under uncertainty, utility, rationality"
    is_hub: false
    is_expert: false
    
  - domain_id: "03.11"
    domain_name: "Category Theory"
    branch_id: 3
    branch_name: "Formal Sciences"
    description: "Mathematical structure of structures, functors"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 04: MIND SCIENCES (10 domains)
  # ============================================
  
  - domain_id: "04.01"
    domain_name: "Cognitive Psychology"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Attention, memory, reasoning, problem-solving"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.02"
    domain_name: "Developmental Psychology"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Lifespan mental changes, child development, aging"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.03"
    domain_name: "Social Psychology"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Interpersonal influence, group behavior, attitudes"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.04"
    domain_name: "Clinical Psychology"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Psychopathology, treatment, mental disorders"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.05"
    domain_name: "Evolutionary Psychology"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Adaptive origins of cognition, mating, cooperation"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.06"
    domain_name: "Cognitive Neuroscience"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Neural basis of mental processes, imaging, brain"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.07"
    domain_name: "Perception Sensation"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "How senses construct reality, vision, hearing"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.08"
    domain_name: "Behavioral Neuroscience"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Brain-behavior relationships, neural circuits"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.09"
    domain_name: "Consciousness Studies"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Subjective experience, awareness, hard problem"
    is_hub: false
    is_expert: false
    
  - domain_id: "04.10"
    domain_name: "Psycholinguistics"
    branch_id: 4
    branch_name: "Mind Sciences"
    description: "Language processing in the mind, acquisition"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 05: SOCIAL SCIENCES (16 domains)
  # ============================================
  
  - domain_id: "05.01"
    domain_name: "Microeconomics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Individual/firm decision-making, markets, prices"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.02"
    domain_name: "Macroeconomics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Aggregate economies, GDP, monetary policy, cycles"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.03"
    domain_name: "Behavioral Economics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Psychological drivers of economic choice, biases"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.04"
    domain_name: "Development Economics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Economic growth in poor countries, poverty, aid"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.05"
    domain_name: "Finance Theory"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Asset pricing, risk, portfolio theory, derivatives"
    is_hub: false
    is_expert: true
    
  - domain_id: "05.06"
    domain_name: "Sociology of Organizations"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "How institutions structure behavior, bureaucracy"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.07"
    domain_name: "Sociology of Culture"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Meaning-making, norms, identity, symbolic interaction"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.08"
    domain_name: "Political Economy"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Power and resource distribution, institutions"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.09"
    domain_name: "Comparative Politics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Political systems across countries, regimes"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.10"
    domain_name: "International Relations"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "State interactions, war, cooperation, diplomacy"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.11"
    domain_name: "Geopolitics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Geography and power, strategic resources, influence"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.12"
    domain_name: "Cultural Anthropology"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Human societies, ethnography, kinship, ritual"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.13"
    domain_name: "Linguistics"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Language structure, change, phonology, syntax"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.14"
    domain_name: "Demography"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Population dynamics, fertility, mortality, migration"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.15"
    domain_name: "Urban Studies"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Cities as systems, urban planning, gentrification"
    is_hub: false
    is_expert: false
    
  - domain_id: "05.16"
    domain_name: "Criminology"
    branch_id: 5
    branch_name: "Social Sciences"
    description: "Crime causation, justice systems, punishment"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 06: HUMANITIES (16 domains)
  # ============================================
  
  - domain_id: "06.01"
    domain_name: "Metaphysics"
    branch_id: 6
    branch_name: "Humanities"
    description: "Nature of reality, existence, causation, time"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.02"
    domain_name: "Epistemology"
    branch_id: 6
    branch_name: "Humanities"
    description: "Knowledge, justification, belief, skepticism"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.03"
    domain_name: "Ethics Moral Philosophy"
    branch_id: 6
    branch_name: "Humanities"
    description: "Right action, value, virtue, consequentialism"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.04"
    domain_name: "Political Philosophy"
    branch_id: 6
    branch_name: "Humanities"
    description: "Justice, authority, rights, social contract"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.05"
    domain_name: "Philosophy of Mind"
    branch_id: 6
    branch_name: "Humanities"
    description: "Mental states, consciousness, qualia, free will"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.06"
    domain_name: "Philosophy of Science"
    branch_id: 6
    branch_name: "Humanities"
    description: "Scientific method, explanation, realism, paradigms"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.07"
    domain_name: "Aesthetics"
    branch_id: 6
    branch_name: "Humanities"
    description: "Beauty, art, taste, aesthetic experience"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.08"
    domain_name: "Ancient History"
    branch_id: 6
    branch_name: "Humanities"
    description: "Pre-500 CE civilizations, Greece, Rome, Egypt"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.09"
    domain_name: "Medieval History"
    branch_id: 6
    branch_name: "Humanities"
    description: "500-1500 CE, feudalism, crusades, church"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.10"
    domain_name: "Early Modern History"
    branch_id: 6
    branch_name: "Humanities"
    description: "1500-1800, renaissance, reformation, enlightenment"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.11"
    domain_name: "Modern History"
    branch_id: 6
    branch_name: "Humanities"
    description: "1800-present, industrialization, world wars, globalization"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.12"
    domain_name: "Historiography"
    branch_id: 6
    branch_name: "Humanities"
    description: "How history is written, methodology, bias"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.13"
    domain_name: "Literary Theory Criticism"
    branch_id: 6
    branch_name: "Humanities"
    description: "How texts produce meaning, interpretation, genre"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.14"
    domain_name: "Classics"
    branch_id: 6
    branch_name: "Humanities"
    description: "Greek/Roman civilization, literature, philosophy"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.15"
    domain_name: "Intellectual History"
    branch_id: 6
    branch_name: "Humanities"
    description: "History of ideas, thought movements, influence"
    is_hub: false
    is_expert: false
    
  - domain_id: "06.16"
    domain_name: "Rhetoric Composition"
    branch_id: 6
    branch_name: "Humanities"
    description: "Persuasion, argument, writing, oratory"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 07: ENGINEERING (16 domains)
  # ============================================
  
  - domain_id: "07.01"
    domain_name: "Mechanical Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Machines, thermal systems, dynamics, materials"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.02"
    domain_name: "Electrical Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Circuits, power, signals, electronics"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.03"
    domain_name: "Civil Structural Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Infrastructure, buildings, bridges, foundations"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.04"
    domain_name: "Chemical Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Process design, reactions at scale, separations"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.05"
    domain_name: "Materials Science"
    branch_id: 7
    branch_name: "Engineering"
    description: "Properties of matter for use, alloys, polymers"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.06"
    domain_name: "Aerospace Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Aircraft, spacecraft, aerodynamics, propulsion"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.07"
    domain_name: "Computer Architecture"
    branch_id: 7
    branch_name: "Engineering"
    description: "Hardware design, processors, memory systems"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.08"
    domain_name: "Software Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Building reliable software systems, design patterns"
    is_hub: false
    is_expert: true
    
  - domain_id: "07.09"
    domain_name: "AI Machine Learning"
    branch_id: 7
    branch_name: "Engineering"
    description: "Intelligent systems, neural networks, deep learning"
    is_hub: false
    is_expert: true
    
  - domain_id: "07.10"
    domain_name: "Networks Distributed Systems"
    branch_id: 7
    branch_name: "Engineering"
    description: "Communication, coordination, consensus, blockchain"
    is_hub: false
    is_expert: true
    
  - domain_id: "07.11"
    domain_name: "Robotics"
    branch_id: 7
    branch_name: "Engineering"
    description: "Autonomous physical agents, control, perception"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.12"
    domain_name: "Biomedical Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Engineering for medicine, devices, imaging"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.13"
    domain_name: "Environmental Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Pollution, remediation, water treatment"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.14"
    domain_name: "Systems Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Complex system integration, requirements, control theory"
    is_hub: true
    is_expert: false
    
  - domain_id: "07.15"
    domain_name: "Industrial Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Optimization, operations research, quality"
    is_hub: false
    is_expert: false
    
  - domain_id: "07.16"
    domain_name: "Nuclear Engineering"
    branch_id: 7
    branch_name: "Engineering"
    description: "Fission, fusion, radiation, reactor design"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 08: HEALTH MEDICINE (15 domains)
  # ============================================
  
  - domain_id: "08.01"
    domain_name: "Anatomy Physiology"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Body structure and function, organ systems"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.02"
    domain_name: "Pathology"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Disease mechanisms, diagnosis, histology"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.03"
    domain_name: "Pharmacology"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Drug action, development, toxicology"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.04"
    domain_name: "Immunology"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Immune system function, antibodies, vaccines"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.05"
    domain_name: "Epidemiology"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Disease patterns in populations, outbreaks"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.06"
    domain_name: "Public Health"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Population health interventions, prevention"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.07"
    domain_name: "Nutrition Science"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Diet and health, metabolism, nutrients"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.08"
    domain_name: "Psychiatry"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Mental illness treatment, psychopharmacology"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.09"
    domain_name: "Surgery"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Operative intervention, techniques, specialties"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.10"
    domain_name: "Internal Medicine"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Adult non-surgical disease, diagnosis"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.11"
    domain_name: "Pediatrics"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Child health, development, pediatric diseases"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.12"
    domain_name: "Geriatrics"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Aging and elder care, age-related disease"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.13"
    domain_name: "Emergency Medicine"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Acute care, trauma, triage"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.14"
    domain_name: "Nursing Science"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Care delivery, patient management"
    is_hub: false
    is_expert: false
    
  - domain_id: "08.15"
    domain_name: "Rehabilitation Sciences"
    branch_id: 8
    branch_name: "Health Medicine"
    description: "Recovery of function, physical therapy"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 09: BUSINESS MANAGEMENT (12 domains)
  # ============================================
  
  - domain_id: "09.01"
    domain_name: "Corporate Strategy"
    branch_id: 9
    branch_name: "Business Management"
    description: "Competitive positioning, growth, M&A"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.02"
    domain_name: "Operations Supply Chain"
    branch_id: 9
    branch_name: "Business Management"
    description: "Production, logistics, flow, inventory"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.03"
    domain_name: "Marketing Consumer Behavior"
    branch_id: 9
    branch_name: "Business Management"
    description: "Demand creation, persuasion, branding"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.04"
    domain_name: "Corporate Finance"
    branch_id: 9
    branch_name: "Business Management"
    description: "Capital structure, valuation, investment"
    is_hub: false
    is_expert: true
    
  - domain_id: "09.05"
    domain_name: "Accounting"
    branch_id: 9
    branch_name: "Business Management"
    description: "Measurement, reporting, auditing, standards"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.06"
    domain_name: "Organizational Behavior"
    branch_id: 9
    branch_name: "Business Management"
    description: "People in organizations, motivation, teams"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.07"
    domain_name: "Entrepreneurship"
    branch_id: 9
    branch_name: "Business Management"
    description: "Venture creation, startups, innovation"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.08"
    domain_name: "Negotiation Influence"
    branch_id: 9
    branch_name: "Business Management"
    description: "Deal-making, persuasion, conflict resolution"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.09"
    domain_name: "Leadership"
    branch_id: 9
    branch_name: "Business Management"
    description: "Directing collective action, vision, change"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.10"
    domain_name: "Human Resource Management"
    branch_id: 9
    branch_name: "Business Management"
    description: "Talent systems, hiring, compensation"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.11"
    domain_name: "Real Estate"
    branch_id: 9
    branch_name: "Business Management"
    description: "Property markets, development, investment"
    is_hub: false
    is_expert: false
    
  - domain_id: "09.12"
    domain_name: "Insurance Risk Management"
    branch_id: 9
    branch_name: "Business Management"
    description: "Risk transfer, pricing, actuarial science"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 10: EDUCATION (9 domains)
  # ============================================
  
  - domain_id: "10.01"
    domain_name: "Curriculum Design"
    branch_id: 10
    branch_name: "Education"
    description: "What to teach, sequencing, standards"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.02"
    domain_name: "Pedagogy Instructional Methods"
    branch_id: 10
    branch_name: "Education"
    description: "How to teach, techniques, approaches"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.03"
    domain_name: "Educational Psychology"
    branch_id: 10
    branch_name: "Education"
    description: "Learning, motivation, development in school"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.04"
    domain_name: "Educational Assessment"
    branch_id: 10
    branch_name: "Education"
    description: "Measuring learning, testing, evaluation"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.05"
    domain_name: "Educational Administration"
    branch_id: 10
    branch_name: "Education"
    description: "Running schools/systems, policy, leadership"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.06"
    domain_name: "Special Education"
    branch_id: 10
    branch_name: "Education"
    description: "Atypical learners, disabilities, accommodations"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.07"
    domain_name: "Adult Continuing Education"
    branch_id: 10
    branch_name: "Education"
    description: "Post-formal learning, lifelong learning"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.08"
    domain_name: "Educational Technology"
    branch_id: 10
    branch_name: "Education"
    description: "Tools for learning, EdTech, online learning"
    is_hub: false
    is_expert: false
    
  - domain_id: "10.09"
    domain_name: "Higher Education Studies"
    branch_id: 10
    branch_name: "Education"
    description: "Universities as institutions, access, research"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 11: ARTS DESIGN COMMUNICATION (12 domains)
  # ============================================
  
  - domain_id: "11.01"
    domain_name: "Visual Arts Art History"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Painting, sculpture, history, movements"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.02"
    domain_name: "Architecture"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Building design, space, history, theory"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.03"
    domain_name: "Industrial Product Design"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Object design for use, UX, ergonomics"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.04"
    domain_name: "Graphic Communication Design"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Visual messaging, typography, branding"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.05"
    domain_name: "Film Media Studies"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Moving image, media theory, cinema"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.06"
    domain_name: "Music Theory Composition"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Sound organization, harmony, form"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.07"
    domain_name: "Theater Performance"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Live embodied art, acting, directing"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.08"
    domain_name: "Creative Writing"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Prose, poetry craft, fiction, narrative"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.09"
    domain_name: "Journalism"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "News gathering, reporting, ethics"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.10"
    domain_name: "Advertising PR"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Commercial persuasion, campaigns, reputation"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.11"
    domain_name: "Photography"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Image capture, meaning, technique"
    is_hub: false
    is_expert: false
    
  - domain_id: "11.12"
    domain_name: "Game Design"
    branch_id: 11
    branch_name: "Arts Design Communication"
    description: "Interactive experience design, mechanics"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 12: LAW PUBLIC ADMIN (10 domains)
  # ============================================
  
  - domain_id: "12.01"
    domain_name: "Constitutional Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Fundamental legal structure, rights, powers"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.02"
    domain_name: "Criminal Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Prosecution, defense, punishment, procedure"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.03"
    domain_name: "Civil Contract Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Private disputes, agreements, torts"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.04"
    domain_name: "Corporate Commercial Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Business legal framework, securities, M&A"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.05"
    domain_name: "International Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Cross-border legal systems, treaties"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.06"
    domain_name: "Administrative Law"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Government agency regulation, procedure"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.07"
    domain_name: "Public Policy Analysis"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Policy design, evaluation, implementation"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.08"
    domain_name: "Public Administration"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Government management, bureaucracy"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.09"
    domain_name: "Social Work"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Human services delivery, welfare"
    is_hub: false
    is_expert: false
    
  - domain_id: "12.10"
    domain_name: "Nonprofit Management"
    branch_id: 12
    branch_name: "Law Public Admin"
    description: "Third sector organizations, philanthropy"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 13: AGRICULTURE ENVIRONMENT (10 domains)
  # ============================================
  
  - domain_id: "13.01"
    domain_name: "Agronomy Crop Science"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Plant cultivation, soil, yields"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.02"
    domain_name: "Animal Science"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Livestock production, breeding, nutrition"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.03"
    domain_name: "Soil Science"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Soil composition, fertility, ecology"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.04"
    domain_name: "Food Science Technology"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Processing, safety, preservation"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.05"
    domain_name: "Veterinary Science"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Animal health, medicine, surgery"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.06"
    domain_name: "Forestry"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Forest management, timber, conservation"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.07"
    domain_name: "Fisheries Aquaculture"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Aquatic resource management, fish farming"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.08"
    domain_name: "Wildlife Management"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Wild animal populations, conservation"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.09"
    domain_name: "Environmental Policy"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Regulation, conservation law, climate policy"
    is_hub: false
    is_expert: false
    
  - domain_id: "13.10"
    domain_name: "Sustainable Systems"
    branch_id: 13
    branch_name: "Agriculture Environment"
    description: "Regenerative design, permaculture, circular"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 14: TRADES APPLIED TECH (10 domains)
  # ============================================
  
  - domain_id: "14.01"
    domain_name: "Construction Trades"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Building, carpentry, masonry, framing"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.02"
    domain_name: "Electrical Trades"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Wiring, installation, code, safety"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.03"
    domain_name: "Plumbing HVAC"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Water, heating, cooling systems"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.04"
    domain_name: "Automotive Technology"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Vehicle repair, systems, diagnostics"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.05"
    domain_name: "Welding Metalwork"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Joining, fabrication, metallurgy"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.06"
    domain_name: "Machining CNC"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Precision manufacturing, lathes, mills"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.07"
    domain_name: "Aviation Maintenance"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Aircraft systems, inspection, repair"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.08"
    domain_name: "Transportation Logistics"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Moving goods, routing, warehousing"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.09"
    domain_name: "Culinary Arts"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Food preparation, service, techniques"
    is_hub: false
    is_expert: false
    
  - domain_id: "14.10"
    domain_name: "Cosmetology Personal Services"
    branch_id: 14
    branch_name: "Trades Applied Tech"
    description: "Grooming, aesthetics, personal care"
    is_hub: false
    is_expert: false

  # ============================================
  # BRANCH 15: RELIGION THEOLOGY (8 domains)
  # ============================================
  
  - domain_id: "15.01"
    domain_name: "Comparative Religion"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Cross-tradition analysis, world religions"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.02"
    domain_name: "Biblical Studies"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Text, history, interpretation, hermeneutics"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.03"
    domain_name: "Systematic Theology"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Doctrine, belief systems, dogmatics"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.04"
    domain_name: "Practical Theology"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Ministry, pastoral care, homiletics"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.05"
    domain_name: "Islamic Studies"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Quran, hadith, jurisprudence, history"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.06"
    domain_name: "Buddhist Studies"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Dharma, practice traditions, philosophy"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.07"
    domain_name: "Jewish Studies"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Torah, Talmud, history, diaspora"
    is_hub: false
    is_expert: false
    
  - domain_id: "15.08"
    domain_name: "Mysticism Contemplative Studies"
    branch_id: 15
    branch_name: "Religion Theology"
    description: "Direct experience traditions, meditation"
    is_hub: false
    is_expert: false
```

---

## 2. HUB DOMAIN BOOK RECOMMENDATIONS

Initial curated book lists for the priority hub domains.

```yaml
# pm/data/hub_books.yaml

hub_books:
  "02.04":  # Evolutionary Biology
    domain_name: "Evolutionary Biology"
    foundation:
      - title: "The Selfish Gene"
        author: "Richard Dawkins"
        year: 1976
        why: "Gene-centered view; introduces replicator/vehicle distinction"
        density: "medium"
        pages: 360
        
      - title: "Darwin's Dangerous Idea"
        author: "Daniel Dennett"
        year: 1995
        why: "Evolution as universal acid; philosophical implications"
        density: "high"
        pages: 586
        
    heresy:
      - title: "The Extended Phenotype"
        author: "Richard Dawkins"
        year: 1982
        why: "Challenges organism-centered thinking"
        density: "high"
        pages: 307
        
      - title: "Not By Genes Alone"
        author: "Peter Richerson, Robert Boyd"
        year: 2005
        why: "Cultural evolution challenges pure gene selection"
        density: "high"
        pages: 332
        
    frontier:
      - title: "The Origins of Order"
        author: "Stuart Kauffman"
        year: 1993
        why: "Self-organization + selection; complexity theory meets evolution"
        density: "very high"
        pages: 709
        
    bridge:
      - title: "The Evolution of Cooperation"
        author: "Robert Axelrod"
        year: 1984
        why: "Game theory + evolution; Prisoner's Dilemma tournaments"
        bridge_to: ["03.09", "05.08"]
        
  "01.02":  # Thermodynamics
    domain_name: "Thermodynamics"
    foundation:
      - title: "The Second Law"
        author: "Peter Atkins"
        year: 1984
        why: "Accessible introduction to entropy and its implications"
        density: "medium"
        pages: 230
        
      - title: "An Introduction to Thermal Physics"
        author: "Daniel Schroeder"
        year: 2000
        why: "Textbook; statistical mechanics foundation"
        density: "high"
        pages: 422
        
    heresy:
      - title: "Into the Cool"
        author: "Eric Schneider, Dorion Sagan"
        year: 2005
        why: "Non-equilibrium thermodynamics; life as dissipative structure"
        density: "medium"
        pages: 362
        
    frontier:
      - title: "Information, Physics, and Computation"
        author: "Marc Mézard, Andrea Montanari"
        year: 2009
        why: "Statistical physics meets information theory meets CS"
        density: "very high"
        pages: 568
        
    bridge:
      - title: "The Information"
        author: "James Gleick"
        year: 2011
        why: "History connecting thermodynamics to information theory"
        bridge_to: ["03.07", "06.15"]
        
  "03.06":  # Network Theory / Graph Theory
    domain_name: "Combinatorics Graph Theory"
    foundation:
      - title: "Networks: An Introduction"
        author: "Mark Newman"
        year: 2010
        why: "Comprehensive textbook; social, biological, technical networks"
        density: "high"
        pages: 772
        
      - title: "Linked"
        author: "Albert-László Barabási"
        year: 2002
        why: "Accessible intro; scale-free networks, hubs"
        density: "low"
        pages: 280
        
    heresy:
      - title: "Six Degrees"
        author: "Duncan Watts"
        year: 2003
        why: "Challenges simple scale-free models; small world nuances"
        density: "medium"
        pages: 374
        
    frontier:
      - title: "Network Science"
        author: "Albert-László Barabási"
        year: 2016
        why: "Modern textbook; dynamic networks, spreading"
        density: "high"
        pages: 456
        
    bridge:
      - title: "Social and Economic Networks"
        author: "Matthew Jackson"
        year: 2008
        why: "Game theory on networks; economic applications"
        bridge_to: ["03.09", "05.01"]
        
  "03.04":  # Probability / Statistics
    domain_name: "Probability Statistics"
    foundation:
      - title: "Probability Theory: The Logic of Science"
        author: "E.T. Jaynes"
        year: 2003
        why: "Bayesian foundations; probability as extended logic"
        density: "very high"
        pages: 727
        
      - title: "All of Statistics"
        author: "Larry Wasserman"
        year: 2004
        why: "Concise graduate overview; frequentist and Bayesian"
        density: "high"
        pages: 442
        
    heresy:
      - title: "The Black Swan"
        author: "Nassim Taleb"
        year: 2007
        why: "Challenges normal distribution assumptions; fat tails"
        density: "medium"
        pages: 366
        
    bridge:
      - title: "Information Theory, Inference, and Learning Algorithms"
        author: "David MacKay"
        year: 2003
        why: "Connects probability to information theory and ML"
        bridge_to: ["03.07", "07.09"]
        
  "03.07":  # Information Theory
    domain_name: "Information Theory"
    foundation:
      - title: "Elements of Information Theory"
        author: "Thomas Cover, Joy Thomas"
        year: 1991
        why: "Standard textbook; entropy, channels, coding"
        density: "very high"
        pages: 748
        
      - title: "The Information"
        author: "James Gleick"
        year: 2011
        why: "Historical and accessible; Shannon, Babbage, Turing"
        density: "low"
        pages: 526
        
    bridge:
      - title: "Entropy and Information Theory"
        author: "Robert Gray"
        year: 1990
        why: "Connects to probability and ergodic theory"
        bridge_to: ["03.04", "01.02"]
        
  "03.09":  # Game Theory
    domain_name: "Game Theory"
    foundation:
      - title: "Game Theory"
        author: "Drew Fudenberg, Jean Tirole"
        year: 1991
        why: "Standard graduate text; complete coverage"
        density: "very high"
        pages: 579
        
      - title: "Thinking Strategically"
        author: "Avinash Dixit, Barry Nalebuff"
        year: 1991
        why: "Accessible intro; business applications"
        density: "low"
        pages: 393
        
    heresy:
      - title: "Behavioral Game Theory"
        author: "Colin Camerer"
        year: 2003
        why: "Challenges rationality assumptions; experimental evidence"
        density: "high"
        pages: 550
        
    frontier:
      - title: "Algorithmic Game Theory"
        author: "Nisan et al."
        year: 2007
        why: "Computational complexity of game-theoretic solutions"
        density: "very high"
        pages: 754
        
    bridge:
      - title: "The Evolution of Cooperation"
        author: "Robert Axelrod"
        year: 1984
        why: "Game theory meets evolutionary biology"
        bridge_to: ["02.04"]
```

---

## 3. INITIAL PROBLEMS DATA

```yaml
# pm/data/problems.yaml

problems:
  - id: "P1"
    name: "Why Professionals Pay"
    full_question: "Why do high-value professionals ($200k+) pay $20k+ for solutions?"
    why_matters: "Direct relevance to AI automation consulting target market"
    relevant_domains:
      - "04.01"  # Cognitive Psychology
      - "05.03"  # Behavioral Economics
      - "05.06"  # Sociology of Organizations
      - "04.03"  # Social Psychology
      - "09.03"  # Marketing
    sub_questions:
      - "What pain points justify premium pricing?"
      - "What triggers purchase decisions in high earners?"
      - "How does time scarcity affect willingness to pay?"
      - "What role does status/signaling play?"
      
  - id: "P2"
    name: "AI Product Defensibility"
    full_question: "What makes an AI automation product defensible against commoditization?"
    why_matters: "Core strategic question for building sustainable AI business"
    relevant_domains:
      - "12.04"  # Corporate/Commercial Law
      - "05.06"  # Sociology of Organizations
      - "03.06"  # Network Theory
      - "09.01"  # Corporate Strategy
      - "07.14"  # Systems Engineering
    sub_questions:
      - "What creates switching costs in B2B software?"
      - "How do compliance requirements create moats?"
      - "What role do network effects play?"
      - "How does integration complexity protect?"
      
  - id: "P3"
    name: "Underserved Niches"
    full_question: "Where are the underserved high-value niches for AI automation?"
    why_matters: "Identify specific markets to target"
    relevant_domains:
      - "05.14"  # Demography
      - "05.15"  # Urban Studies
      - "05.06"  # Sociology of Organizations
      - "09.03"  # Marketing
    sub_questions:
      - "Which professions have acute, time-bound pressure events?"
      - "Where do professionals currently pay for human help?"
      - "What verticals have compliance complexity?"
      - "Which niches are too small for big tech?"
      
  - id: "P4"
    name: "Coordination Failures"
    full_question: "How do coordination failures create business opportunities?"
    why_matters: "Systematic way to identify market gaps"
    relevant_domains:
      - "03.09"  # Game Theory
      - "05.08"  # Political Economy
      - "05.06"  # Sociology of Organizations
      - "02.04"  # Evolutionary Biology
      - "07.14"  # Systems Engineering
    sub_questions:
      - "What are common patterns of coordination failure?"
      - "Why do obvious solutions not get implemented?"
      - "How do incumbents maintain dysfunctional equilibria?"
      - "What triggers coordination breakthroughs?"
```

---

## 4. BRANCH DISTANCE MATRIX (Complete)

```yaml
# pm/data/distances.yaml

# Distance scale: 0=same, 1=adjacent, 2=moderate, 3=far, 4=maximum
# Matrix is symmetric; only upper triangle stored

branch_distances:
  "01-01": 0
  "01-02": 1
  "01-03": 1
  "01-04": 2
  "01-05": 2
  "01-06": 3
  "01-07": 1
  "01-08": 2
  "01-09": 3
  "01-10": 3
  "01-11": 3
  "01-12": 3
  "01-13": 2
  "01-14": 2
  "01-15": 4
  
  "02-02": 0
  "02-03": 2
  "02-04": 1
  "02-05": 2
  "02-06": 3
  "02-07": 2
  "02-08": 1
  "02-09": 3
  "02-10": 3
  "02-11": 3
  "02-12": 3
  "02-13": 1
  "02-14": 3
  "02-15": 4
  
  "03-03": 0
  "03-04": 2
  "03-05": 1
  "03-06": 2
  "03-07": 1
  "03-08": 2
  "03-09": 1
  "03-10": 2
  "03-11": 2
  "03-12": 2
  "03-13": 2
  "03-14": 2
  "03-15": 3
  
  "04-04": 0
  "04-05": 1
  "04-06": 2
  "04-07": 2
  "04-08": 1
  "04-09": 2
  "04-10": 1
  "04-11": 2
  "04-12": 2
  "04-13": 3
  "04-14": 3
  "04-15": 3
  
  "05-05": 0
  "05-06": 1
  "05-07": 2
  "05-08": 2
  "05-09": 2
  "05-10": 2
  "05-11": 2
  "05-12": 1
  "05-13": 2
  "05-14": 3
  "05-15": 2
  
  "06-06": 0
  "06-07": 3
  "06-08": 3
  "06-09": 2
  "06-10": 2
  "06-11": 1
  "06-12": 1
  "06-13": 3
  "06-14": 3
  "06-15": 1
  
  "07-07": 0
  "07-08": 1
  "07-09": 2
  "07-10": 2
  "07-11": 2
  "07-12": 2
  "07-13": 2
  "07-14": 1
  "07-15": 4
  
  "08-08": 0
  "08-09": 2
  "08-10": 2
  "08-11": 3
  "08-12": 2
  "08-13": 2
  "08-14": 3
  "08-15": 3
  
  "09-09": 0
  "09-10": 2
  "09-11": 2
  "09-12": 1
  "09-13": 2
  "09-14": 2
  "09-15": 3
  
  "10-10": 0
  "10-11": 2
  "10-12": 2
  "10-13": 3
  "10-14": 3
  "10-15": 2
  
  "11-11": 0
  "11-12": 2
  "11-13": 3
  "11-14": 3
  "11-15": 2
  
  "12-12": 0
  "12-13": 2
  "12-14": 3
  "12-15": 2
  
  "13-13": 0
  "13-14": 2
  "13-15": 3
  
  "14-14": 0
  "14-15": 4
  
  "15-15": 0
```

---

*End of Part 4. Continue to SPEC-05-IMPLEMENTATION-GUIDE.md*
