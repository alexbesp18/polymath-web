/**
 * Branch distance matrix and calculations
 * Ported from pm/data/distances.py
 */

import { BRANCH_NAMES } from '@/types';
import { TOTAL_BRANCHES, ISOMORPHISM_DISTANCE_ADJUSTMENT, getBranchId } from './constants';

// Valid branch IDs (01-15)
const VALID_BRANCH_IDS = new Set([
  '01', '02', '03', '04', '05', '06', '07', '08',
  '09', '10', '11', '12', '13', '14', '15',
]);

// Branch distance matrix (0-4 scale)
// 0 = same branch, 4 = maximum distance
const BRANCH_DISTANCES: Record<string, Record<string, number>> = {
  '01': { // Physical Sciences
    '02': 1, '03': 1, '04': 2, '05': 2, '06': 3, '07': 1,
    '08': 2, '09': 3, '10': 3, '11': 3, '12': 3, '13': 2, '14': 2, '15': 4,
  },
  '02': { // Life Sciences
    '03': 2, '04': 1, '05': 2, '06': 3, '07': 2,
    '08': 1, '09': 3, '10': 2, '11': 3, '12': 3, '13': 1, '14': 2, '15': 4,
  },
  '03': { // Formal Sciences
    '04': 2, '05': 2, '06': 3, '07': 1,
    '08': 2, '09': 2, '10': 2, '11': 3, '12': 2, '13': 2, '14': 2, '15': 4,
  },
  '04': { // Mind Sciences
    '05': 1, '06': 2, '07': 2,
    '08': 1, '09': 2, '10': 1, '11': 2, '12': 2, '13': 3, '14': 3, '15': 3,
  },
  '05': { // Social Sciences
    '06': 1, '07': 2,
    '08': 2, '09': 1, '10': 1, '11': 2, '12': 1, '13': 2, '14': 3, '15': 2,
  },
  '06': { // Humanities
    '07': 3,
    '08': 2, '09': 3, '10': 2, '11': 1, '12': 2, '13': 3, '14': 3, '15': 1,
  },
  '07': { // Engineering
    '08': 2, '09': 2, '10': 2, '11': 2, '12': 2, '13': 2, '14': 1, '15': 4,
  },
  '08': { // Health Medicine
    '09': 3, '10': 2, '11': 3, '12': 2, '13': 2, '14': 2, '15': 3,
  },
  '09': { // Business Management
    '10': 2, '11': 2, '12': 1, '13': 2, '14': 2, '15': 3,
  },
  '10': { // Education
    '11': 2, '12': 2, '13': 2, '14': 2, '15': 2,
  },
  '11': { // Arts Design Communication
    '12': 2, '13': 3, '14': 2, '15': 2,
  },
  '12': { // Law Public Admin
    '13': 2, '14': 2, '15': 2,
  },
  '13': { // Agriculture Environment
    '14': 1, '15': 3,
  },
  '14': { // Trades Applied Tech
    '15': 4,
  },
};

/**
 * Check if a branch ID is valid
 */
export function isValidBranchId(branchId: string | number): boolean {
  const id = String(branchId).padStart(2, '0');
  return VALID_BRANCH_IDS.has(id);
}

/**
 * Get distance between two branches (0-4 scale)
 * Returns 4 (max distance) for invalid branch IDs with a console warning
 */
export function getBranchDistance(branchA: string | number, branchB: string | number): number {
  const a = String(branchA).padStart(2, '0');
  const b = String(branchB).padStart(2, '0');

  // Validate branch IDs
  if (!VALID_BRANCH_IDS.has(a)) {
    console.warn(`Invalid branch ID: ${a}. Defaulting to max distance.`);
    return 4;
  }
  if (!VALID_BRANCH_IDS.has(b)) {
    console.warn(`Invalid branch ID: ${b}. Defaulting to max distance.`);
    return 4;
  }

  if (a === b) return 0;

  // Try direct lookup
  if (BRANCH_DISTANCES[a]?.[b] !== undefined) {
    return BRANCH_DISTANCES[a][b];
  }

  // Try reverse (matrix is symmetric)
  if (BRANCH_DISTANCES[b]?.[a] !== undefined) {
    return BRANCH_DISTANCES[b][a];
  }

  // This should never happen with valid branch IDs, but log if it does
  console.warn(`Distance not found for branches ${a} and ${b}. Check matrix completeness.`);
  return 4;
}

/**
 * Get distance between two domains based on their branches
 */
export function getDomainDistance(
  domainA: string,
  domainB: string,
  sharedIsomorphisms = 0
): number {
  const branchA = getBranchId(domainA);
  const branchB = getBranchId(domainB);

  const baseDistance = getBranchDistance(branchA, branchB);

  // Reduce distance for shared isomorphisms (capped at 0)
  const adjustment = Math.floor(sharedIsomorphisms * ISOMORPHISM_DISTANCE_ADJUSTMENT);
  return Math.max(0, baseDistance - adjustment);
}

/**
 * Find branches at maximum distance from a given branch
 */
export function getMaxDistantBranches(branchId: string | number): string[] {
  const id = String(branchId).padStart(2, '0');
  const maxDistant: string[] = [];

  for (let i = 1; i <= TOTAL_BRANCHES; i++) {
    const otherId = String(i).padStart(2, '0');
    if (otherId !== id && getBranchDistance(id, otherId) === 4) {
      maxDistant.push(otherId);
    }
  }

  return maxDistant;
}

/**
 * Find branches at a specific distance from a given branch
 */
export function getBranchesAtDistance(
  branchId: string | number,
  distance: number
): string[] {
  const id = String(branchId).padStart(2, '0');
  const result: string[] = [];

  for (let i = 1; i <= TOTAL_BRANCHES; i++) {
    const otherId = String(i).padStart(2, '0');
    if (otherId !== id && getBranchDistance(id, otherId) === distance) {
      result.push(otherId);
    }
  }

  return result;
}

/**
 * Get branch name from ID
 */
export function getBranchName(branchId: string | number): string {
  const id = String(branchId).padStart(2, '0');
  return BRANCH_NAMES[id] || 'Unknown';
}
