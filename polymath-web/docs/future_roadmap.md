# Polymath-Web Future Roadmap

> **Last Updated**: 2025-01-06
> **Horizon**: 6-12 months

---

## Near Term (1-2 months)

### Visualization Redesign
**Priority**: HIGH

Replace cramped radial tree with something readable:

```
Option A: Collapsible Branch List
▼ 01 Physical Sciences (3/12 read)
  ● 01.01 Classical Mechanics ✓
  ○ 01.02 Thermodynamics (Reading...)
  ○ 01.03 Electromagnetism
▶ 02 Life Sciences (0/12 read)

Option B: Branch Cards Grid
┌─────────┐ ┌─────────┐
│ Physics │ │ Life    │
│ ███░░░░ │ │ ░░░░░░░ │
│ 3/12    │ │ 0/12    │
└─────────┘ └─────────┘

Option C: Hybrid (cards → expand to list)
```

**Success Criteria**: Users can identify reading status at a glance on mobile

---

### "Suggested Next" Feature
**Priority**: MEDIUM

Restore guidance for what to read next:

```typescript
function suggestNext(domains: Domain[]): Domain {
  // 1. Any hub domains untouched? → Suggest hub
  // 2. User has read domains? → Suggest max distance (bisociation)
  // 3. Default → Random unread in unexplored branch
}
```

**UI**: Card on home page with "Start This" and "Skip" buttons

---

### Reading History Timeline
**Priority**: LOW

New `/history` page showing:
- Completed books in chronological order
- Reading velocity (books/month)
- Gap periods visualization
- Branch coverage over time

---

## Medium Term (3-6 months)

### Insight System Enhancement
**Current**: Basic text storage for bisociation insights
**Future**:
- Tag insights by domain pair
- Search across insights
- Link insights to books
- Export insights as markdown

---

### Book Catalog
**Current**: Only track current/queue books
**Future**:
- Historical catalog of all books read
- Ratings and notes per book
- Book recommendations per domain
- Goodreads/OpenLibrary integration

---

### Progress Analytics
**Metrics to track**:
- Coverage % per branch
- Hub completion progress
- Bisociation pairs generated
- Average books per domain
- Streak tracking

---

### Mobile App
**Options**:
- PWA with service worker (simplest)
- React Native app
- Native iOS/Android

**Features needed**:
- Offline support
- Push notifications (reading reminders)
- Quick "Finished" button

---

## Long Term (6-12 months)

### Multi-User Support
**Current**: Single user, no auth
**Future**:
- User accounts (Supabase Auth)
- Public profiles
- Shared insights
- Leaderboards (optional)

---

### AI Integration
**Possibilities**:
- GPT-powered book recommendations based on reading history
- Auto-generate synthesis prompts from book notes
- Chat interface for exploring domain connections
- Summarize bisociation patterns

---

### Obsidian Integration
**Bring back CLI sync**:
- Export reading log to Obsidian vault
- Sync domain progress with markdown files
- Dataview queries for insights
- Bidirectional sync

---

### Problem-Driven Mode
**Original TraversalEngine feature**:
- User defines active problems
- System pulls relevant domains
- Track problem → domain → insight → solution flow

---

## Technical Debt to Address

### Testing
- Add unit tests for `lib/` functions
- Add integration tests for API routes
- Add E2E tests for critical paths
- Set up CI/CD with test gates

### Error Handling
- Add error boundaries to all pages
- Improve error messages for users
- Add retry logic for failed requests
- Implement proper loading states

### Performance
- Add caching layer
- Implement virtualization for large lists
- Optimize D3 rendering
- Add service worker for offline

### Code Quality
- Extract magic numbers to constants
- Add JSDoc comments to complex functions
- Refactor mixed client/server patterns
- Add Storybook for component documentation

---

## Feature Requests Backlog

| Feature | Source | Priority |
|---------|--------|----------|
| Dark mode toggle | UX | Medium |
| Keyboard shortcuts | UX | Low |
| Export data to JSON | Data | Low |
| Import from Goodreads | Data | Low |
| Branch distance editor | Power user | Very Low |
| Custom domain taxonomy | Power user | Very Low |

---

## Non-Goals

Things we're explicitly NOT building:
- Social reading features (book clubs, discussions)
- E-book reader integration
- Note-taking within the app
- Spaced repetition for retention
- Course/curriculum tracking
- Academic citation management

The app is for **tracking** reading journeys, not **replacing** reading tools.
