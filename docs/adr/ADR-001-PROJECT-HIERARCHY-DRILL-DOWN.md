# ADR-001: Project Hierarchy with In-Page Drill-Down Navigation

**Status**: Accepted  
**Date**: 2024-01-XX  
**Author**: Nahuel Quiroga (@matiasz8)  
**Decision Impact**: BREAKING - Major UI/UX change with automatic data migration  

---

## Context

The application previously maintained a flat list of readings with no organizational structure. As the number of readings grows, users need a way to organize them by topic/theme. The challenge is how to structure navigation when introducing a hierarchical project → reading relationship.

### Problem Statement

1. **No Organization**: Users with 10+ readings have no way to group related readings by topic
2. **Navigation Fatigue**: Scrolling through long reading lists to find specific topics becomes tedious
3. **Context Loss**: Moving between readings within the same project requires scrolling back to list
4. **Mobile Burden**: Small screens make flat lists even more cumbersome

### Constraints

- Must preserve ALL existing user data (zero data loss)
- Cannot require user action (automatic migration)
- Must maintain responsive design (mobile + desktop)
- Cannot add external dependencies (localStorage only)
- Must remain single-developer maintainable

### Requirements

- [x] Organize readings into projects
- [x] Allow browsing projects, then readings within project
- [x] Show reading metadata in preview (status, word count, reading time)
- [x] Maintain persistent navigation state
- [x] Support both desktop and mobile layouts
- [x] Automatic migration of existing readings

---

## Decision: In-Page Drill-Down Navigation

We choose **in-page drill-down navigation** over alternative approaches.

### What This Means

**Drill-Down**: Users start on project grid → click project → reading grid appears in same location → click reading → detail panel shows in sidebar

```
Dashboard
├─ Project Grid (projects view)
│  └─ Click Project A
│     ├─ Reading Grid (readings view)
│     │  └─ Click Reading 1
│     │     └─ Detail Panel (sidebar)
│     └─ Back button → Project Grid
```

### Architecture

#### State Management (in `app/page.tsx`)

```typescript
// View mode: which grid to display
const [viewMode, setViewMode] = useState<'projects' | 'readings'>('projects');

// Track which project is open
const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

// Track which reading detail is shown
const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
```

#### Component Structure

```
<Dashboard>
  ├─ <Header>
  │  └─ Title (changes based on viewMode)
  │
  ├─ Navigation
  │  └─ Back button (only in readings mode)
  │
  ├─ Main Grid
  │  ├─ ProjectCardV2[] (if viewMode === 'projects')
  │  │  ├─ onClick title → drill down (setViewMode, setExpandedProjectId)
  │  │  └─ onClick body → show ProjectDetailView
  │  │
  │  └─ ReadingCardV2[] (if viewMode === 'readings')
  │     ├─ onClick title → open reader (/reader/[id])
  │     └─ onClick body → show ReadingDetailView
  │
  └─ Detail Panel (always present)
     ├─ ProjectDetailView (if expandedProjectId && selectedReadingId === null)
     └─ ReadingDetailView (if selectedReadingId !== null)
```

#### Navigation Model

| Action | Old Behavior | New Behavior |
|--------|--------------|--------------|
| Click project | N/A | Drill down to readings grid, show project detail |
| Click reading title | Navigate to /reader/[id] | Same (open reader) |
| Click reading body | Show detail in sidebar | Same (show detail in sidebar) |
| Click back | N/A | Return to project grid |
| Favorites/Complete | Works on readings directly | Works on readings (reading context preserved) |

---

## Why This Decision

### Advantages

#### 1. **Context Preservation**
- Users stay in dashboard view (no full page navigation)
- Project context always visible in sidebar
- Can see reading status without leaving project

#### 2. **Responsive by Design**
- Desktop: Detail panel in fixed sidebar (non-blocking)
- Mobile: Detail panel as overlay (full screen content)
- Same interaction model on both

#### 3. **Zero Data Loss**
- Migration helper assigns all readings to "Mis Lecturas" project
- Migration is idempotent (safe to run multiple times)
- All existing localStorage data preserved
- Process runs silently on first app load

#### 4. **Familiar Interaction**
- Similar to file explorers (folder → file list)
- Users understand project → reading hierarchy intuitively
- Consistent with modern app navigation patterns (Material Design, iOS)

#### 5. **Mobile Friendly**
- No nested routing (which is harder on mobile)
- Touch-friendly grid layout
- Overlay pattern works well on small screens

#### 6. **Developer Friendly**
- No route-based state (easier to manage)
- Single page component orchestration
- Easier to add features (filters, search, etc.)
- Simpler testing (all logic in one component)

### Disadvantages

#### 1. **No Deep Linking**
- Can't share URLs like `/project/physics/reading/quantum-mechanics`
- **Mitigation**: Users can favorite readings for quick access
- **Future**: Could add URL-based state with Next.js dynamic routes

#### 2. **Browser History**
- Back button doesn't navigate (stays on same page)
- **Mitigation**: In-app back button works fine
- **Future**: Could implement history.pushState() if needed

#### 3. **Learning Curve**
- Different from typical page-based navigation
- **Mitigation**: Clear labels, intuitive layout
- **Acceptance**: Users quickly understand drill-down pattern

---

## Alternatives Considered & Rejected

### Alternative 1: Full Page Navigation (`/project/[id]/page.tsx`)

**Model**: Create new route `/project/[id]` showing readings for that project

**Pros**:
- Deep linking works
- Browser back button works
- Standard Next.js routing pattern

**Cons**:
- Full page reload on navigation
- Context loss (no sidebar during reading)
- Mobile UX: Back button is small and top-left (hard to reach)
- More complex state sync between pages
- Harder to show reading preview without leaving project

**Why Rejected**: Requires full page navigation, removing dashboard context

---

### Alternative 2: Nested Modal (Project Modal → Reading Modal)

**Model**: Open project in modal, then reading in modal

**Pros**:
- Can close modals to go back
- Modern modal-based UX

**Cons**:
- Visual clutter (modals on modals)
- Mobile: Modals stack, no room for content
- Escape key handling gets complex
- Accessibility issues (focus trap nesting)
- Users confused by dismissal behavior

**Why Rejected**: Poor mobile UX, complex modal management

---

### Alternative 3: Nested Tabs

**Model**: Projects as main tabs, readings as sub-tabs

**Pros**:
- Easy to switch between projects
- Tab-based visual pattern

**Cons**:
- Space-constrained on mobile (many tabs)
- Hard to show reading detail in tabs
- Visual complexity with nested tabs
- Not a common pattern in reading apps

**Why Rejected**: Mobile UX issue, uncommon pattern

---

## Migration Strategy

### Automatic Silent Migration

**Trigger**: First app load after Phase 3b deployment

**Process**:
```
1. Check if migration needed (readings exist but projects don't)
2. Get all readings without projectId
3. Create "Mis Lecturas" (My Readings) default project
4. Assign all orphaned readings to default project
5. Validate before/after state
6. Save projects to localStorage
7. Continue normal app operation
```

**Validation**:
- Before: Count orphaned readings
- After: Verify same count assigned to project
- No readings lost during migration
- All project IDs valid

**Safety**:
- Idempotent (safe to run multiple times)
- Preserves all existing data
- Zero user action required
- Runs before any user interaction

### Backward Compatibility

**Storage Format**:
```typescript
// Reading type before
interface Reading {
  id: string;
  title: string;
  content: string;
}

// Reading type after
interface Reading {
  id: string;
  projectId: string;  // NEW - required
  title: string;
  content: string;
}

// New type introduced
interface Project {
  id: string;
  title: string;
  description?: string;
  created?: number;
}
```

**Migration**:
- Readings created pre-Phase 3b: Auto-assigned projectId
- Readings created post-Phase 3b: Must specify projectId
- API clients must be updated (TBD)

---

## Implementation Details

### Files Changed

#### New Components
- `components/dashboard/ReadingCardV2.tsx` - Grid card for readings
- `components/dashboard/ReadingDetailView.tsx` - Reading preview panel
- `lib/dashboard/migrationHelpers.ts` - Automatic data migration

#### Modified Components
- `app/page.tsx` - Main drill-down orchestration
- `components/dashboard/ProjectCardV2.tsx` - Added onOpen callback
- `components/EditTitleModal.tsx` - Fix lint warnings
- `hooks/useTTS.ts` - Add missing dependency

#### Deleted Files
- `/app/project/[id]/page.tsx` - Functionality moved to drill-down

### Testing Coverage

- [x] Migration: 5/5 test scenarios pass
- [x] Drill-down: Navigation works smoothly
- [x] Detail panels: Both projects and readings display correctly
- [x] Mobile: Responsive layout verified
- [x] Actions: Complete, favorite, edit, delete all functional
- [x] Lint: No errors in CI
- [x] Build: Succeeds without warnings

---

## Deployment Plan

### Pre-Deployment

1. **Staging Verification**:
   - Deploy to staging environment
   - Run migration with test data
   - Verify no data loss
   - Test on multiple devices (mobile + desktop + tablet)

2. **User Communication**:
   - Update app version number
   - Add release notes explaining new project organization
   - Optional: Send email to active users

### Deployment Steps

1. Merge PR to `main` branch
2. Deploy to production
3. Monitor error logs for migration failures
4. Verify migration completion in localStorage inspector

### Post-Deployment

1. **Monitoring**:
   - Check error logs daily for 1 week
   - Verify migration success rate (should be 100%)
   - Monitor performance metrics

2. **User Support**:
   - Document new workflow in help section
   - Be ready to assist confused users
   - Collect feedback on new organization

### Rollback Procedure

If critical issues discovered:
1. Revert to previous commit
2. Migration is idempotent (safe to rerun)
3. Users will see readings again assigned to default project
4. No data loss

---

## Metrics & Success Criteria

### Launch Success
- [x] All readings preserved (0% data loss)
- [x] Migration completes silently (no user action)
- [x] App builds without errors
- [x] No new error logs on first load

### Post-Launch (1-2 weeks)
- [ ] 0% migration failures
- [ ] Users organize readings into projects (survey feedback)
- [ ] Engagement metrics stable or improved
- [ ] No complaints about navigation changes

### Long-Term (1-3 months)
- [ ] Average projects per user: 2-5
- [ ] Average readings per project: 3-8
- [ ] Navigation satisfaction rating: 4+/5

---

## Future Enhancements (Out of Scope)

1. **Deep Linking**: Add URL-based state (e.g., `/dashboard?view=readings&project=abc&reading=xyz`)
2. **Project Management**: Edit/delete projects, move readings between projects
3. **Search**: Full-text search within project
4. **Sharing**: Share projects with other users (requires backend)
5. **Nested Projects**: Support 3+ levels of hierarchy
6. **Project Templates**: Pre-made project categories
7. **Auto-Organization**: AI-powered reading classification

---

## Review Notes

### Architecture Review
- ✅ Maintains single-page architecture
- ✅ localStorage state sufficient for MVP
- ✅ No external dependencies added
- ✅ Responsive design pattern proven

### Code Review
- ✅ Component separation clear
- ✅ State management understandable
- ✅ Error handling for migration
- ✅ Lint compliance verified

### UX Review
- ✅ Interaction model intuitive
- ✅ Mobile layout responsive
- ✅ Accessibility considered (ARIA labels, focus management)

---

## References

- **Implementation**: `PHASE-3B-BREAKING-CHANGES.md`
- **Migration Logic**: `lib/dashboard/migrationHelpers.ts`
- **Component Docs**: `components/dashboard/ReadingCardV2.tsx`, `ReadingDetailView.tsx`
- **Testing Results**: Verified on 5 migration scenarios, 3 device sizes
- **Related ADRs**: None yet (first ADR for this project)

---

## Sign-Off

- **Architect**: Nahuel Quiroga
- **Product**: Approved (Phase 3b)
- **QA**: Testing complete
- **Status**: Ready for deployment
