/**
 * Traversal engine for domain recommendations
 * Ported from pm/core/traversal.py
 */

import type {
  DomainWithProgress,
  TraversalRecommendation,
  FunctionSlot,
  TraversalPhase,
} from '@/types';
import { HUB_DOMAIN_IDS } from '@/types';
import { getBranchDistance } from './distance';
import {
  SUNDAY,
  HUB_TARGET_BOOKS,
  MIN_BISOCIATION_DISTANCE,
  TOP_CANDIDATES_POOL,
  DISTANT_INTERLEAVE_BONUS,
  DEFAULT_STRENGTH_BRANCH,
  getBranchId,
} from './constants';

/**
 * Get the next function slot for a domain based on books read
 */
export function getNextSlot(booksRead: number): FunctionSlot {
  if (booksRead === 0) return 'FND';
  if (booksRead === 1) return 'HRS';
  if (booksRead === 2) return 'ORT';
  if (booksRead === 3) return 'FRN';
  if (booksRead === 4) return 'HST';
  return 'BRG';
}

/**
 * Get slot display name
 */
export function getSlotName(slot: FunctionSlot): string {
  const names: Record<FunctionSlot, string> = {
    FND: 'Foundation',
    HRS: 'Heresy',
    ORT: 'Orthodoxy',
    FRN: 'Frontier',
    HST: 'History',
    BRG: 'Bridge',
  };
  return names[slot];
}

/**
 * Main traversal engine class
 */
export class TraversalEngine {
  private hubTargetBooks: number;
  private expertDomains: string[];
  private minBisociationDistance: number;

  constructor(config: {
    hubTargetBooks?: number;
    expertDomains?: string[];
    minBisociationDistance?: number;
  } = {}) {
    this.hubTargetBooks = config.hubTargetBooks ?? HUB_TARGET_BOOKS;
    this.expertDomains = config.expertDomains ?? [];
    this.minBisociationDistance = config.minBisociationDistance ?? MIN_BISOCIATION_DISTANCE;
  }

  /**
   * Get strength branches from expert domains
   */
  private getStrengthBranches(domains: DomainWithProgress[]): Set<string> {
    const branches = new Set(
      [...this.expertDomains, ...domains.filter((d) => d.is_expert).map((d) => d.domain_id)]
        .map(getBranchId)
    );

    if (branches.size === 0) {
      branches.add(DEFAULT_STRENGTH_BRANCH);
    }

    return branches;
  }

  /**
   * Get next reading recommendation
   */
  recommendNext(
    domains: DomainWithProgress[],
    recentDomainIds: string[] = [],
    phase: TraversalPhase = 'hub-completion'
  ): TraversalRecommendation | null {
    const dayOfWeek = new Date().getDay();
    const isInterleaveDay = dayOfWeek === SUNDAY;

    if (phase === 'hub-completion') {
      return this.recommendHubCompletion(domains, recentDomainIds, isInterleaveDay);
    } else if (phase === 'bisociation') {
      return this.recommendBisociation(domains, recentDomainIds, isInterleaveDay);
    } else {
      return this.recommendProblemDriven(domains, recentDomainIds);
    }
  }

  /**
   * Hub completion phase recommendation
   */
  private recommendHubCompletion(
    domains: DomainWithProgress[],
    recentDomainIds: string[],
    isInterleaveDay: boolean
  ): TraversalRecommendation | null {
    // Check if it's a distant interleave day
    if (isInterleaveDay) {
      const distant = this.findDistantDomain(domains, recentDomainIds);
      if (distant) return distant;
    }

    // Find incomplete hub domains
    const hubDomains = domains.filter(
      (d) =>
        HUB_DOMAIN_IDS.includes(d.domain_id as typeof HUB_DOMAIN_IDS[number]) &&
        d.books_read < this.hubTargetBooks &&
        !recentDomainIds.includes(d.domain_id)
    );

    if (hubDomains.length === 0) {
      // All hubs complete, fall back to distant domain
      return this.findDistantDomain(domains, recentDomainIds);
    }

    // Prioritize closest to completion
    hubDomains.sort((a, b) => b.books_read - a.books_read);
    const domain = hubDomains[0];

    return {
      domain,
      slot: getNextSlot(domain.books_read),
      reason: `Start hub domain with ${getNextSlot(domain.books_read)} slot (${this.hubTargetBooks - domain.books_read} books to complete)`,
      phase: 'hub-completion',
    };
  }

  /**
   * Bisociation phase recommendation
   */
  private recommendBisociation(
    domains: DomainWithProgress[],
    recentDomainIds: string[],
    isInterleaveDay: boolean
  ): TraversalRecommendation | null {
    // On interleave days, recommend strength domain
    if (!isInterleaveDay) {
      return this.findStrengthDomain(domains, recentDomainIds);
    }

    return this.findDistantDomain(domains, recentDomainIds);
  }

  /**
   * Problem-driven phase recommendation
   */
  private recommendProblemDriven(
    domains: DomainWithProgress[],
    recentDomainIds: string[]
  ): TraversalRecommendation | null {
    // For now, just recommend an untouched domain
    const untouched = domains.filter(
      (d) =>
        d.status === 'untouched' &&
        !recentDomainIds.includes(d.domain_id)
    );

    if (untouched.length === 0) return null;

    // Random selection
    const domain = untouched[Math.floor(Math.random() * untouched.length)];

    return {
      domain,
      slot: 'FND',
      reason: 'Explore new domain for problem-driven learning',
      phase: 'problem-driven',
    };
  }

  /**
   * Find a domain at maximum distance from user's strengths
   */
  private findDistantDomain(
    domains: DomainWithProgress[],
    recentDomainIds: string[]
  ): TraversalRecommendation | null {
    const strengthBranches = this.getStrengthBranches(domains);

    // Score domains by distance from strengths
    const candidates = domains
      .filter((d) => !recentDomainIds.includes(d.domain_id))
      .map((d) => {
        const branchId = getBranchId(d.domain_id);
        const minDistance = Math.min(
          ...Array.from(strengthBranches).map((sb) =>
            getBranchDistance(branchId, sb)
          )
        );

        // Bonus for untouched
        const bonus = d.status === 'untouched' ? DISTANT_INTERLEAVE_BONUS : 0;

        return { domain: d, score: minDistance + bonus };
      })
      .filter((c) => c.score >= this.minBisociationDistance);

    if (candidates.length === 0) return null;

    // Sort by score descending, take from top candidates randomly
    candidates.sort((a, b) => b.score - a.score);
    const topCandidates = candidates.slice(0, TOP_CANDIDATES_POOL);

    // Safety check: ensure we have candidates after slicing
    if (topCandidates.length === 0) return null;

    const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];

    // Safety check: ensure selection succeeded
    if (!selected || !selected.domain) return null;

    return {
      domain: selected.domain,
      slot: getNextSlot(selected.domain.books_read),
      reason: `Distant domain interleave (distance: ${Math.floor(selected.score)})`,
      phase: 'hub-completion',
    };
  }

  /**
   * Find a domain in user's strength areas
   */
  private findStrengthDomain(
    domains: DomainWithProgress[],
    recentDomainIds: string[]
  ): TraversalRecommendation | null {
    const strengthBranches = this.getStrengthBranches(domains);

    // Find domains in strength branches that need more reading
    const candidates = domains.filter(
      (d) =>
        strengthBranches.has(getBranchId(d.domain_id)) &&
        d.status !== 'expert' &&
        !recentDomainIds.includes(d.domain_id)
    );

    if (candidates.length === 0) return null;

    // Prioritize by books read (deepen existing)
    candidates.sort((a, b) => b.books_read - a.books_read);
    const domain = candidates[0];

    return {
      domain,
      slot: getNextSlot(domain.books_read),
      reason: 'Deepen strength domain during bisociation phase',
      phase: 'bisociation',
    };
  }

  /**
   * Check if hub completion phase is done
   */
  isHubCompletionDone(domains: DomainWithProgress[]): boolean {
    const hubs = domains.filter((d) =>
      HUB_DOMAIN_IDS.includes(d.domain_id as typeof HUB_DOMAIN_IDS[number])
    );

    // Empty array .every() returns true - must verify we found all hub domains
    if (hubs.length === 0 || hubs.length < HUB_DOMAIN_IDS.length) {
      return false; // Missing hub domains in data
    }

    return hubs.every((d) => d.books_read >= this.hubTargetBooks);
  }
}

// Default traversal engine instance
export const traversalEngine = new TraversalEngine();
