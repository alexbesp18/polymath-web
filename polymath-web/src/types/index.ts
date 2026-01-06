/**
 * TypeScript types for Polymath Tracker
 * Simplified for the rebuild
 */

// Function slot codes
export type SlotCode = 'FND' | 'ORT' | 'HRS' | 'FRN' | 'HST' | 'BRG';

// Slot progress from database
export interface SlotProgress {
  domain_id: string;
  slot: SlotCode;
  book_title: string | null;
  book_author: string | null;
  completed_at: string;
}

// Slot progress map for quick lookup (keyed by "domainId:slot")
export type SlotProgressMap = Map<string, SlotProgress>;

// Helper to create map key
export function slotKey(domainId: string, slot: string): string {
  return `${domainId}:${slot}`;
}
