/**
 * Bisociation pairing for cross-domain insights
 * Ported from pm/core/bisociation.py
 */

import type { DomainWithProgress, BisociationPair } from '@/types';
import { getBranchDistance, getBranchName } from './distance';
import {
  getBranchId,
  TOP_CANDIDATES_POOL,
  FALLBACK_ANCHOR_COUNT,
  SCORE_DISTANCE_MULTIPLIER,
  SCORE_UNTOUCHED_BONUS,
  SCORE_ZERO_BOOKS_BONUS,
} from './constants';

/**
 * Generate synthesis prompts for a domain pair
 */
function generateSynthesisPrompts(
  anchor: DomainWithProgress,
  distant: DomainWithProgress
): string[] {
  return [
    `What does ${anchor.name} measure that ${distant.name} ignores?`,
    `What would a ${anchor.name} expert find most confusing about ${distant.name}?`,
    `How would you explain ${anchor.name}'s core insight using only ${distant.name}'s vocabulary?`,
    `If ${anchor.name} and ${distant.name} merged, what new field would emerge?`,
    `What assumption in ${anchor.name} would ${distant.name} challenge?`,
  ];
}

/**
 * Generate a bisociation pairing
 */
export function generatePairing(
  domains: DomainWithProgress[],
  expertDomainIds: string[] = [],
  minDistance = 3
): BisociationPair | null {
  // Cannot generate pairing without domains
  if (!domains || domains.length === 0) {
    return null;
  }

  // Need at least 2 domains for a pairing
  if (domains.length < 2) {
    return null;
  }

  // Find anchor domains (user's strengths)
  let anchorCandidates = domains.filter(
    (d) => d.is_expert || expertDomainIds.includes(d.domain_id) || d.books_read >= 2
  );

  // Fallback to any touched domains
  if (anchorCandidates.length === 0) {
    anchorCandidates = domains.filter((d) => d.status !== 'untouched');
  }

  // Final fallback to any domain
  if (anchorCandidates.length === 0) {
    anchorCandidates = domains.slice(0, FALLBACK_ANCHOR_COUNT);
  }

  // Safety check: still no candidates after all fallbacks
  if (anchorCandidates.length === 0) {
    return null;
  }

  // Random anchor selection
  const anchor = anchorCandidates[Math.floor(Math.random() * anchorCandidates.length)];

  // Safety check: ensure anchor selection succeeded
  if (!anchor) {
    return null;
  }

  const anchorBranch = getBranchId(anchor.domain_id);

  // Find distant domains
  const distantCandidates = domains
    .filter((d) => {
      if (d.domain_id === anchor.domain_id) return false;

      const distantBranch = getBranchId(d.domain_id);
      const distance = getBranchDistance(anchorBranch, distantBranch);

      return distance >= minDistance;
    })
    .map((d) => {
      const distantBranch = getBranchId(d.domain_id);
      const distance = getBranchDistance(anchorBranch, distantBranch);

      // Calculate score (higher is better) - matches Python pm/core/bisociation.py
      let score = distance * SCORE_DISTANCE_MULTIPLIER;

      // Bonus for untouched domains
      if (d.status === 'untouched') {
        score += SCORE_UNTOUCHED_BONUS;
      }

      // Bonus for domains with 0 books read
      if (d.books_read === 0) {
        score += SCORE_ZERO_BOOKS_BONUS;
      }

      return { domain: d, distance, score };
    });

  if (distantCandidates.length === 0) {
    return null;
  }

  // Sort by score, take from top candidates randomly
  distantCandidates.sort((a, b) => b.score - a.score);
  const topCandidates = distantCandidates.slice(0, TOP_CANDIDATES_POOL);

  // Safety check: ensure we have candidates
  if (topCandidates.length === 0) {
    return null;
  }

  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  // Safety check: ensure selection succeeded
  if (!selected || !selected.domain) {
    return null;
  }

  // Generate reason
  const anchorBranchName = getBranchName(anchorBranch);
  const distantBranchName = getBranchName(getBranchId(selected.domain.domain_id));

  let reason = `Your expertise in ${anchor.name}`;
  if (selected.domain.status === 'untouched') {
    reason += ` + completely unexplored ${selected.domain.name}`;
  } else {
    reason += ` + ${selected.domain.name}`;
  }
  reason += ` + maximum conceptual distance (${selected.distance})`;

  return {
    anchor,
    distant: selected.domain,
    distance: selected.distance,
    synthesis_prompts: generateSynthesisPrompts(anchor, selected.domain),
    reason,
  };
}

/**
 * Get pairing history for display
 */
export function formatPairingForDisplay(pair: BisociationPair): {
  anchorInfo: string;
  distantInfo: string;
  distanceDisplay: string;
  mainPrompt: string;
  additionalPrompts: string[];
} {
  const anchorBranchName = getBranchName(getBranchId(pair.anchor.domain_id));
  const distantBranchName = getBranchName(getBranchId(pair.distant.domain_id));

  return {
    anchorInfo: `${pair.anchor.domain_id} — ${pair.anchor.name} (${anchorBranchName})`,
    distantInfo: `${pair.distant.domain_id} — ${pair.distant.name} (${distantBranchName})`,
    distanceDisplay: `${pair.distance} (max: 4)`,
    mainPrompt: pair.synthesis_prompts[0],
    additionalPrompts: pair.synthesis_prompts.slice(1),
  };
}
