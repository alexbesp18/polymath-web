/**
 * TypeScript types for Polymath Engine
 * Simplified model: Binary read/not-read tracking, one book at a time
 */

// Simplified domain status (binary + in-progress)
export type DomainStatus = 'unread' | 'reading' | 'read';

// Branch type
export interface Branch {
  branch_id: string;  // "01", "02", etc.
  name: string;
}

// Base domain type
export interface Domain {
  domain_id: string;      // "01.02", "02.04", etc.
  name: string;
  branch_id: string;
  description?: string;
  is_hub: boolean;
  is_expert: boolean;
}

// Domain with progress (joined view)
export interface DomainWithProgress extends Domain {
  status: DomainStatus;
  book_title?: string;
  book_author?: string;
  completed_at?: string;
}

// Reading queue item
export interface QueueItem {
  id: string;
  domain_id: string;
  book_title: string;
  book_author?: string;
  position: number;
  created_at: string;
  // Joined from domain
  domain_name?: string;
  branch_id?: string;
}

// Current book (domain where status = 'reading')
export interface CurrentBook {
  domain_id: string;
  domain_name: string;
  branch_id: string;
  book_title: string;
  book_author?: string;
}

// Config type (simplified)
export interface Config {
  id: number;
  current_phase?: string;
  hub_target_books?: number;
  expert_domains?: string[];
  moderate_domains?: string[];
}

// Insight type
export interface Insight {
  id: string;
  domain_a: string;
  domain_b?: string;
  insight_type?: string;
  content: string;
  created_at: string;
}

// Bisociation pairing (for connections page)
export interface BisociationPair {
  anchor: DomainWithProgress;
  distant: DomainWithProgress;
  distance: number;
  reason: string;
}

// Branch distance entry
export interface BranchDistance {
  branch_a: string;
  branch_b: string;
  distance: number;
}

// Statistics (simplified)
export interface Stats {
  total_domains: number;
  domains_read: number;
  domains_reading: number;
  domains_unread: number;
  branches_touched: number;
  queue_length: number;
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

// Branch colors for visualization
export const BRANCH_COLORS: Record<string, string> = {
  '01': '#3B82F6', // blue
  '02': '#22C55E', // green
  '03': '#8B5CF6', // violet
  '04': '#EC4899', // pink
  '05': '#F97316', // orange
  '06': '#EAB308', // yellow
  '07': '#6366F1', // indigo
  '08': '#EF4444', // red
  '09': '#14B8A6', // teal
  '10': '#84CC16', // lime
  '11': '#F43F5E', // rose
  '12': '#0EA5E9', // sky
  '13': '#10B981', // emerald
  '14': '#A855F7', // purple
  '15': '#78716C', // stone
};
