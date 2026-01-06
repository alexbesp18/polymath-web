# Polymath-Web Development Plan

> **Status**: Active Development
> **Last Updated**: 2025-01-06
> **Priority**: High

---

## Vision

A visual knowledge journey tracker for systematic polymathic learning across 180 academic/practical domains. The goal is to guide users through strategic reading sequences that maximize cross-domain insight generation (bisociation).

---

## Primary Goals

### Goal 1: Fix Visualization UX
**Priority**: HIGH
**Status**: Planning

The current radial tree visualization is too cramped with 180 domain dots. Users cannot easily:
- Identify which domains they've read
- Find domains by name
- See branch groupings clearly

**Options Under Consideration**:
1. Collapsible branch list (clear, mobile-friendly)
2. Branch cards grid with progress bars
3. Hybrid: cards that expand to domain lists
4. Sunburst chart with zoom
5. Force-directed graph

**Decision Needed**: Which visualization approach to implement?

---

### Goal 2: Restore Recommendation Engine
**Priority**: MEDIUM
**Status**: Removed - Needs Decision

The original TraversalEngine had phases:
1. **Hub Completion**: Read 4 books in each of 7 hub domains
2. **Problem-Driven**: Pull domains relevant to active problems
3. **Bisociation**: Alternate strength cluster + max distance

**Options**:
- Restore full TraversalEngine with phases
- Simplified "Suggested Next" based on:
  - Hubs not yet started
  - Max distance from current strengths
  - Random unexplored branch

**Decision Needed**: Restore complex phases or simple suggestions?

---

### Goal 3: Reading History & Timeline
**Priority**: LOW
**Status**: Not Started

Currently no way to see:
- When books were completed
- Reading velocity over time
- Gap periods

**Implementation**: Add `/history` page with timeline view

---

## Implementation Sequence

### Phase 1: Stabilization (Current)
- [x] Fix domain page 500 error
- [x] Verify Vercel deployment
- [x] Create architecture documentation
- [ ] Add error boundaries to all pages
- [ ] Add loading states

### Phase 2: Visualization Redesign
- [ ] Get user decision on visualization approach
- [ ] Implement chosen design
- [ ] Ensure mobile responsiveness
- [ ] Add keyboard navigation

### Phase 3: Recommendations (If Approved)
- [ ] Implement simplified suggestion algorithm
- [ ] Add "Suggested Next" card to home page
- [ ] Allow dismissing/regenerating suggestions

### Phase 4: History & Analytics
- [ ] Add reading history timeline
- [ ] Show completion dates on domain pages
- [ ] Calculate reading velocity metrics

---

## Technical Debt

1. **No error boundaries** - Pages crash on DB errors
2. **No loading states** - Blank screens during data fetch
3. **Hardcoded colors** - Should use CSS variables
4. **No tests** - Zero test coverage currently
5. **Mixed client/server** - Some components need refactoring

---

## Dependencies

- User decision on visualization approach
- User decision on recommendation feature
- Supabase schema stable (no migrations pending)

---

## Success Metrics

1. Users can navigate tree without squinting
2. Users complete at least 5 books per month
3. Users generate 1+ insight per week from bisociation
4. Mobile usability score > 90
