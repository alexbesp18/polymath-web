/**
 * TypeScript types for Polymath Engine
 */

// Domain status progression
export type DomainStatus =
  | 'untouched'
  | 'surveying'
  | 'surveyed'
  | 'deepening'
  | 'expert';

// Function slot types (6 slots per domain)
export type FunctionSlot =
  | 'FND'  // Foundation
  | 'HRS'  // Heresy
  | 'ORT'  // Orthodoxy
  | 'FRN'  // Frontier
  | 'HST'  // History
  | 'BRG'; // Bridge

// Traversal phases
export type TraversalPhase =
  | 'hub-completion'
  | 'problem-driven'
  | 'bisociation';

// Branch type
export interface Branch {
  branch_id: string;  // "01", "02", etc.
  name: string;
}

// Domain type
export interface Domain {
  domain_id: string;      // "01.02", "02.04", etc.
  name: string;
  branch_id: string;
  branch_name?: string;
  description?: string;
  is_hub: boolean;
  is_expert: boolean;
}

// Domain with progress (joined with domain_progress)
export interface DomainWithProgress extends Domain {
  status: DomainStatus;
  books_read: number;
  last_read: string | null;  // ISO date string
}

// Book type
export interface Book {
  id: string;
  title: string;
  author?: string;
  domain_id: string;
  function_slot?: FunctionSlot;
  status: 'reading' | 'completed' | 'dropped';
  date_started?: string;
  date_finished?: string;
  rating?: number;
  pages?: number;
  created_at: string;
}

// Daily log type
export interface DailyLog {
  id: string;
  log_date: string;
  domain_id: string;
  book_id?: string;
  function_slot?: FunctionSlot;
  pages_read: number;
  reading_time_minutes: number;
  phase: TraversalPhase;
  raw_notes?: string;
  key_insight?: string;
  created_at: string;
}

// Config type
export interface Config {
  id: number;
  current_phase: TraversalPhase;
  hub_target_books: number;
  expert_domains?: string[];
  moderate_domains?: string[];
}

// Traversal recommendation
export interface TraversalRecommendation {
  domain: DomainWithProgress;
  slot: FunctionSlot;
  reason: string;
  phase: TraversalPhase;
}

// Bisociation pairing
export interface BisociationPair {
  anchor: DomainWithProgress;
  distant: DomainWithProgress;
  distance: number;
  synthesis_prompts: string[];
  reason: string;
}

// Statistics
export interface Stats {
  total_domains: number;
  domains_touched: number;
  domains_surveying: number;
  domains_surveyed: number;
  domains_deepening: number;
  domains_expert: number;
  total_books_read: number;
  total_daily_logs: number;
  branches_touched: number;
  current_streak: number;
}

// Hub domain IDs (7 strategic hubs)
export const HUB_DOMAIN_IDS = [
  '01.02', // Thermodynamics
  '02.04', // Evolutionary Biology
  '03.04', // Probability Statistics
  '03.06', // Combinatorics Graph Theory
  '03.07', // Information Theory
  '03.09', // Game Theory
  '07.14', // Systems Engineering
] as const;

// Branch names for reference
export const BRANCH_NAMES: Record<string, string> = {
  '01': 'Physical Sciences',
  '02': 'Life Sciences',
  '03': 'Formal Sciences',
  '04': 'Mind Sciences',
  '05': 'Social Sciences',
  '06': 'Humanities',
  '07': 'Engineering',
  '08': 'Health Medicine',
  '09': 'Business Management',
  '10': 'Education',
  '11': 'Arts Design Communication',
  '12': 'Law Public Admin',
  '13': 'Agriculture Environment',
  '14': 'Trades Applied Tech',
  '15': 'Religion Theology',
};
