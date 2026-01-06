/**
 * Curated book recommendations for hub domains
 * Each domain has books organized by function slot
 */

import type { FunctionSlot } from '@/types';

export interface BookRecommendation {
  title: string;
  author: string;
  why: string;
}

export interface SlotDescription {
  name: string;
  description: string;
}

// Function slot definitions
export const SLOT_DESCRIPTIONS: Record<FunctionSlot, SlotDescription> = {
  FND: {
    name: 'Foundation',
    description: 'Core concepts and fundamentals. Start here.',
  },
  HRS: {
    name: 'Heresy',
    description: 'Contrarian views and critiques of orthodox positions.',
  },
  ORT: {
    name: 'Orthodoxy',
    description: 'The established, mainstream understanding.',
  },
  FRN: {
    name: 'Frontier',
    description: 'Cutting-edge research and emerging theories.',
  },
  HST: {
    name: 'History',
    description: 'Historical development and key figures.',
  },
  BRG: {
    name: 'Bridge',
    description: 'Cross-disciplinary connections and applications.',
  },
};

// Get the next slot based on books read
export function getNextSlot(booksRead: number): FunctionSlot {
  const slots: FunctionSlot[] = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];
  return slots[Math.min(booksRead, 5)];
}

// Get completed slots
export function getCompletedSlots(booksRead: number): FunctionSlot[] {
  const slots: FunctionSlot[] = ['FND', 'HRS', 'ORT', 'FRN', 'HST', 'BRG'];
  return slots.slice(0, booksRead);
}

// Hub domain book recommendations
export const HUB_BOOK_RECOMMENDATIONS: Record<string, Record<FunctionSlot, BookRecommendation[]>> = {
  // Thermodynamics (01.02)
  '01.02': {
    FND: [
      {
        title: 'The Laws of Thermodynamics: A Very Short Introduction',
        author: 'Peter Atkins',
        why: 'Accessible overview of all four laws in under 150 pages',
      },
      {
        title: 'Understanding Thermodynamics',
        author: 'H.C. Van Ness',
        why: 'Classic intuitive introduction, focuses on physical meaning',
      },
    ],
    HRS: [
      {
        title: 'The Second Law',
        author: 'Peter Atkins',
        why: 'Deep dive into entropy with philosophical implications',
      },
      {
        title: 'Time and Chance',
        author: 'David Albert',
        why: 'Challenges conventional interpretation of entropy and time',
      },
    ],
    ORT: [
      {
        title: 'Thermodynamics: An Engineering Approach',
        author: 'Cengel & Boles',
        why: 'Standard textbook, comprehensive and well-structured',
      },
      {
        title: 'Thermal Physics',
        author: 'Charles Kittel',
        why: 'Rigorous statistical mechanics foundation',
      },
    ],
    FRN: [
      {
        title: 'Beyond the Second Law',
        author: 'Walter T. Grandy',
        why: 'Non-equilibrium thermodynamics and entropy production',
      },
      {
        title: 'Entropy Demystified',
        author: 'Arieh Ben-Naim',
        why: 'Modern probabilistic interpretation of entropy',
      },
    ],
    HST: [
      {
        title: 'Reflections on the Motive Power of Fire',
        author: 'Sadi Carnot',
        why: 'The founding document of thermodynamics',
      },
      {
        title: 'Energy, the Subtle Concept',
        author: 'Jennifer Coopersmith',
        why: 'Historical development from Galileo to quantum',
      },
    ],
    BRG: [
      {
        title: 'Into the Cool: Energy Flow, Thermodynamics, and Life',
        author: 'Eric D. Schneider',
        why: 'Bridge to biology and dissipative structures',
      },
      {
        title: 'Information, Entropy, Life and the Universe',
        author: 'Arieh Ben-Naim',
        why: 'Bridge to information theory',
      },
    ],
  },

  // Evolutionary Biology (02.04)
  '02.04': {
    FND: [
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        why: 'Gene-centered view of evolution, accessible classic',
      },
      {
        title: 'Evolution: A Very Short Introduction',
        author: 'Brian & Deborah Charlesworth',
        why: 'Concise overview of mechanisms and evidence',
      },
    ],
    HRS: [
      {
        title: 'The Extended Phenotype',
        author: 'Richard Dawkins',
        why: 'Challenges organism-centric thinking',
      },
      {
        title: 'Niche Construction',
        author: 'Odling-Smee, Laland, Feldman',
        why: 'Organisms shape their own selection pressures',
      },
    ],
    ORT: [
      {
        title: 'Evolutionary Biology',
        author: 'Douglas Futuyma',
        why: 'Standard graduate textbook, comprehensive',
      },
      {
        title: 'The Structure of Evolutionary Theory',
        author: 'Stephen Jay Gould',
        why: 'Magisterial overview of the full theory',
      },
    ],
    FRN: [
      {
        title: 'The Extended Evolutionary Synthesis',
        author: 'Kevin Laland et al.',
        why: 'Frontiers of evo-devo, plasticity, niche construction',
      },
      {
        title: 'Biological Information',
        author: 'Various',
        why: 'Information theory meets evolution',
      },
    ],
    HST: [
      {
        title: 'On the Origin of Species',
        author: 'Charles Darwin',
        why: 'The founding text, still remarkably relevant',
      },
      {
        title: 'The Growth of Biological Thought',
        author: 'Ernst Mayr',
        why: 'Definitive history of evolutionary thinking',
      },
    ],
    BRG: [
      {
        title: 'Darwin Machines and the Nature of Knowledge',
        author: 'Henry Plotkin',
        why: 'Bridge to epistemology and cognitive science',
      },
      {
        title: 'The Major Transitions in Evolution',
        author: 'Maynard Smith & Szathmary',
        why: 'Bridge to complexity and information theory',
      },
    ],
  },

  // Probability & Statistics (03.04)
  '03.04': {
    FND: [
      {
        title: 'Naked Statistics',
        author: 'Charles Wheelan',
        why: 'Engaging introduction without heavy math',
      },
      {
        title: 'The Art of Statistics',
        author: 'David Spiegelhalter',
        why: 'Modern, data-focused approach',
      },
    ],
    HRS: [
      {
        title: 'The Black Swan',
        author: 'Nassim Taleb',
        why: 'Critique of Gaussian assumptions',
      },
      {
        title: 'Bernoulli Fallacy',
        author: 'Aubrey Clayton',
        why: 'Bayesian critique of frequentist orthodoxy',
      },
    ],
    ORT: [
      {
        title: 'All of Statistics',
        author: 'Larry Wasserman',
        why: 'Comprehensive modern treatment',
      },
      {
        title: 'Probability Theory: The Logic of Science',
        author: 'E.T. Jaynes',
        why: 'Bayesian masterwork',
      },
    ],
    FRN: [
      {
        title: 'Statistical Rethinking',
        author: 'Richard McElreath',
        why: 'Modern Bayesian approach with code',
      },
      {
        title: 'Causal Inference',
        author: 'Hernan & Robins',
        why: 'Cutting-edge causal inference methods',
      },
    ],
    HST: [
      {
        title: 'The Lady Tasting Tea',
        author: 'David Salsburg',
        why: 'Stories of statisticians who changed science',
      },
      {
        title: 'The Empire of Chance',
        author: 'Gigerenzer et al.',
        why: 'How probability conquered uncertainty',
      },
    ],
    BRG: [
      {
        title: 'Information Theory, Inference, and Learning Algorithms',
        author: 'David MacKay',
        why: 'Bridge to information theory and ML',
      },
      {
        title: 'Probabilistic Reasoning in Intelligent Systems',
        author: 'Judea Pearl',
        why: 'Bridge to AI and causal reasoning',
      },
    ],
  },

  // Combinatorics & Graph Theory (03.06)
  '03.06': {
    FND: [
      {
        title: 'Introduction to Graph Theory',
        author: 'Richard Trudeau',
        why: 'Gentle introduction with minimal prerequisites',
      },
      {
        title: 'Combinatorics: A Very Short Introduction',
        author: 'Robin Wilson',
        why: 'Accessible overview of counting principles',
      },
    ],
    HRS: [
      {
        title: 'Proofs from THE BOOK',
        author: 'Aigner & Ziegler',
        why: 'Beautiful proofs that challenge conventional thinking',
      },
      {
        title: 'The Probabilistic Method',
        author: 'Noga Alon',
        why: 'Surprising non-constructive proofs',
      },
    ],
    ORT: [
      {
        title: 'Graph Theory',
        author: 'Reinhard Diestel',
        why: 'Standard graduate textbook',
      },
      {
        title: 'Combinatorics and Graph Theory',
        author: 'Harris, Hirst, Mossinghoff',
        why: 'Comprehensive undergraduate treatment',
      },
    ],
    FRN: [
      {
        title: 'Networks',
        author: 'Mark Newman',
        why: 'Modern network science applications',
      },
      {
        title: 'Spectral Graph Theory',
        author: 'Fan Chung',
        why: 'Algebraic approaches to graphs',
      },
    ],
    HST: [
      {
        title: 'Graph Theory 1736-1936',
        author: 'Biggs, Lloyd, Wilson',
        why: 'Historical development from Euler onwards',
      },
    ],
    BRG: [
      {
        title: 'Linked',
        author: 'Albert-Laszlo Barabasi',
        why: 'Bridge to network science and complex systems',
      },
      {
        title: 'Algorithmic Graph Theory',
        author: 'Alan Gibbons',
        why: 'Bridge to computer science',
      },
    ],
  },

  // Information Theory (03.07)
  '03.07': {
    FND: [
      {
        title: 'Information: A Very Short Introduction',
        author: 'Luciano Floridi',
        why: 'Philosophical foundations in 150 pages',
      },
      {
        title: 'The Information',
        author: 'James Gleick',
        why: 'Popular science introduction, well-written',
      },
    ],
    HRS: [
      {
        title: 'Information and the Nature of Reality',
        author: 'Paul Davies (ed.)',
        why: 'Information as fundamental to physics',
      },
      {
        title: 'Decoding Reality',
        author: 'Vlatko Vedral',
        why: 'Quantum information perspective',
      },
    ],
    ORT: [
      {
        title: 'Elements of Information Theory',
        author: 'Cover & Thomas',
        why: 'The standard textbook',
      },
      {
        title: 'A Mathematical Theory of Communication',
        author: 'Claude Shannon',
        why: 'The founding paper, still essential reading',
      },
    ],
    FRN: [
      {
        title: 'Quantum Information Theory',
        author: 'Mark Wilde',
        why: 'Quantum generalizations of Shannon',
      },
      {
        title: 'Information Theory and Statistics',
        author: 'Imre Csiszar',
        why: 'Modern divergence measures',
      },
    ],
    HST: [
      {
        title: 'A Mind at Play',
        author: 'Jimmy Soni',
        why: 'Biography of Claude Shannon',
      },
      {
        title: 'The Mathematical Theory of Communication',
        author: 'Shannon & Weaver',
        why: 'Original 1949 book with Weaver commentary',
      },
    ],
    BRG: [
      {
        title: 'Information, Physics, and Computation',
        author: 'Mezard & Montanari',
        why: 'Bridge to physics and optimization',
      },
      {
        title: 'Information Theory, Evolution, and the Origin of Life',
        author: 'Hubert Yockey',
        why: 'Bridge to biology',
      },
    ],
  },

  // Game Theory (03.09)
  '03.09': {
    FND: [
      {
        title: 'Thinking Strategically',
        author: 'Dixit & Nalebuff',
        why: 'Best intuitive introduction, many examples',
      },
      {
        title: 'Rock, Paper, Scissors',
        author: 'Len Fisher',
        why: 'Game theory for everyday life',
      },
    ],
    HRS: [
      {
        title: 'The Art of Strategy',
        author: 'Dixit & Nalebuff',
        why: 'Challenges purely rational assumptions',
      },
      {
        title: 'Bounded Rationality',
        author: 'Gerd Gigerenzer',
        why: 'Critique of hyper-rational agents',
      },
    ],
    ORT: [
      {
        title: 'Game Theory',
        author: 'Drew Fudenberg & Jean Tirole',
        why: 'The standard graduate textbook',
      },
      {
        title: 'A Course in Game Theory',
        author: 'Osborne & Rubinstein',
        why: 'Rigorous mathematical treatment',
      },
    ],
    FRN: [
      {
        title: 'Algorithmic Game Theory',
        author: 'Nisan et al.',
        why: 'Computational aspects, mechanism design',
      },
      {
        title: 'Evolutionary Dynamics',
        author: 'Martin Nowak',
        why: 'Evolutionary game theory frontier',
      },
    ],
    HST: [
      {
        title: 'Theory of Games and Economic Behavior',
        author: 'Von Neumann & Morgenstern',
        why: 'The founding text',
      },
      {
        title: 'A Beautiful Mind',
        author: 'Sylvia Nasar',
        why: 'Biography of John Nash',
      },
    ],
    BRG: [
      {
        title: 'The Evolution of Cooperation',
        author: 'Robert Axelrod',
        why: 'Bridge to biology and sociology',
      },
      {
        title: 'Micromotives and Macrobehavior',
        author: 'Thomas Schelling',
        why: 'Bridge to economics and emergent phenomena',
      },
    ],
  },

  // Systems Engineering (07.14)
  '07.14': {
    FND: [
      {
        title: 'Thinking in Systems',
        author: 'Donella Meadows',
        why: 'Best introduction to systems thinking',
      },
      {
        title: 'The Fifth Discipline',
        author: 'Peter Senge',
        why: 'Systems thinking in organizations',
      },
    ],
    HRS: [
      {
        title: 'Seeing Like a State',
        author: 'James C. Scott',
        why: 'Critique of high-modernist systems thinking',
      },
      {
        title: 'The Systems Bible',
        author: 'John Gall',
        why: 'Satirical critique of systems failures',
      },
    ],
    ORT: [
      {
        title: 'Systems Engineering and Analysis',
        author: 'Blanchard & Fabrycky',
        why: 'Standard textbook',
      },
      {
        title: 'INCOSE Systems Engineering Handbook',
        author: 'INCOSE',
        why: 'Industry standard reference',
      },
    ],
    FRN: [
      {
        title: 'System of Systems Engineering',
        author: 'Mo Jamshidi',
        why: 'Complex adaptive systems of systems',
      },
      {
        title: 'Resilience Engineering',
        author: 'Hollnagel et al.',
        why: 'Modern safety and reliability thinking',
      },
    ],
    HST: [
      {
        title: 'The Systems View of Life',
        author: 'Capra & Luisi',
        why: 'History of systems thinking',
      },
      {
        title: 'Cybernetics',
        author: 'Norbert Wiener',
        why: 'Founding text of control theory',
      },
    ],
    BRG: [
      {
        title: 'Scale',
        author: 'Geoffrey West',
        why: 'Bridge to biology and cities',
      },
      {
        title: 'Complexity',
        author: 'Mitchell Waldrop',
        why: 'Bridge to Santa Fe Institute research',
      },
    ],
  },
};

// Get book recommendations for a domain
export function getBookRecommendations(
  domainId: string,
  slot: FunctionSlot
): BookRecommendation[] {
  const domainBooks = HUB_BOOK_RECOMMENDATIONS[domainId];
  if (!domainBooks) return [];
  return domainBooks[slot] || [];
}

// Get all book recommendations for a domain
export function getAllDomainBooks(
  domainId: string
): Record<FunctionSlot, BookRecommendation[]> | null {
  return HUB_BOOK_RECOMMENDATIONS[domainId] || null;
}

// Check if domain has book recommendations
export function hasBookRecommendations(domainId: string): boolean {
  return domainId in HUB_BOOK_RECOMMENDATIONS;
}

// Known isomorphisms - concepts that appear across multiple domains
export interface Isomorphism {
  concept: string;
  domains: { domain_id: string; name: string; manifestation: string }[];
}

export const KNOWN_ISOMORPHISMS: Isomorphism[] = [
  {
    concept: 'Entropy',
    domains: [
      { domain_id: '01.02', name: 'Thermodynamics', manifestation: 'Measure of disorder in physical systems' },
      { domain_id: '03.07', name: 'Information Theory', manifestation: 'Measure of uncertainty in messages' },
      { domain_id: '02.04', name: 'Evolutionary Biology', manifestation: 'Dissipative structures, energy flow' },
    ],
  },
  {
    concept: 'Feedback Loops',
    domains: [
      { domain_id: '07.14', name: 'Systems Engineering', manifestation: 'Control systems, homeostasis' },
      { domain_id: '09.01', name: 'Economics', manifestation: 'Market equilibrium, price signals' },
      { domain_id: '02.01', name: 'Biology', manifestation: 'Hormonal regulation, neural circuits' },
    ],
  },
  {
    concept: 'Network Effects',
    domains: [
      { domain_id: '03.06', name: 'Graph Theory', manifestation: 'Node connectivity, clustering' },
      { domain_id: '05.03', name: 'Sociology', manifestation: 'Social networks, influence spread' },
      { domain_id: '09.02', name: 'Business Strategy', manifestation: 'Platform economics, winner-take-all' },
    ],
  },
  {
    concept: 'Selection Pressure',
    domains: [
      { domain_id: '02.04', name: 'Evolutionary Biology', manifestation: 'Natural selection' },
      { domain_id: '09.02', name: 'Business Strategy', manifestation: 'Market competition' },
      { domain_id: '04.03', name: 'Cognitive Science', manifestation: 'Meme selection, idea evolution' },
    ],
  },
  {
    concept: 'Phase Transitions',
    domains: [
      { domain_id: '01.01', name: 'Physics', manifestation: 'State changes (solid/liquid/gas)' },
      { domain_id: '05.01', name: 'Sociology', manifestation: 'Tipping points, social change' },
      { domain_id: '03.06', name: 'Graph Theory', manifestation: 'Percolation thresholds' },
    ],
  },
  {
    concept: 'Game Equilibria',
    domains: [
      { domain_id: '03.09', name: 'Game Theory', manifestation: 'Nash equilibrium' },
      { domain_id: '02.04', name: 'Evolutionary Biology', manifestation: 'Evolutionarily stable strategies' },
      { domain_id: '05.05', name: 'Political Science', manifestation: 'Voting equilibria, power balance' },
    ],
  },
  {
    concept: 'Compression',
    domains: [
      { domain_id: '03.07', name: 'Information Theory', manifestation: 'Lossless/lossy encoding' },
      { domain_id: '04.02', name: 'Psychology', manifestation: 'Chunking, schema formation' },
      { domain_id: '07.02', name: 'Computer Science', manifestation: 'Data compression algorithms' },
    ],
  },
  {
    concept: 'Power Laws',
    domains: [
      { domain_id: '01.01', name: 'Physics', manifestation: 'Scaling laws, fractals' },
      { domain_id: '09.01', name: 'Economics', manifestation: 'Pareto distributions, wealth inequality' },
      { domain_id: '05.03', name: 'Sociology', manifestation: 'City sizes, language frequency' },
    ],
  },
];

// Get isomorphisms that include a specific domain
export function getDomainIsomorphisms(domainId: string): Isomorphism[] {
  return KNOWN_ISOMORPHISMS.filter((iso) =>
    iso.domains.some((d) => d.domain_id === domainId)
  );
}

// Get connected domains through isomorphisms
export function getConnectedDomains(domainId: string): {
  domain_id: string;
  name: string;
  connection: string; // the isomorphism concept that connects them
}[] {
  const connections: Map<string, { domain_id: string; name: string; connection: string }> = new Map();

  for (const iso of KNOWN_ISOMORPHISMS) {
    const hasDomain = iso.domains.some((d) => d.domain_id === domainId);
    if (hasDomain) {
      for (const d of iso.domains) {
        if (d.domain_id !== domainId && !connections.has(d.domain_id)) {
          connections.set(d.domain_id, {
            domain_id: d.domain_id,
            name: d.name,
            connection: iso.concept,
          });
        }
      }
    }
  }

  return Array.from(connections.values());
}
