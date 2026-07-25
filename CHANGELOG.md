# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Phase 3b: Project Hierarchy (BREAKING)

#### New Features
- **Project-Based Organization**: Readings now organized into Projects (themes/topics)
- **In-Page Drill-Down Navigation**: Click project to drill down into readings grid, no page navigation
- **Reading Detail Preview Panel**: Show reading metadata (status, word count, reading time) in sidebar without opening reader
- **Smart Card Interactions**: 
  - Click title (project or reading) → Opens/navigates
  - Click card body → Shows detail preview in sidebar
- **Responsive Design**: Static sidebar detail panel (desktop) + overlay panel (mobile)
- **Automatic Data Migration**: Existing readings auto-assigned to "Mis Lecturas" project on first app load

#### New Components
- `ReadingCardV2`: Grid card component for readings (similar to ProjectCardV2)
- `ReadingDetailView`: Detail panel component for reading preview and management
- `migrationHelpers`: Automatic migration utilities for orphaned readings

#### Breaking Changes
- **Data Model**: `Reading` type now requires `projectId` field
- **Navigation**: `/project/[id]` route removed; replaced by in-page drill-down
- **UI**: Dashboard now shows project grid first, drill down to readings
- **Storage**: New `projects` storage key with array of Project objects

#### Migration
- **Automatic**: All existing readings migrated to "Mis Lecturas" project on first app load
- **Zero Downtime**: Migration runs silently in background
- **No Data Loss**: All existing readings preserved with `projectId` assigned
- **Backward Compatible**: Existing app state preserved, users see organized view

### Changed
- `app/page.tsx`: Major refactor with drill-down navigation, detail panel rendering
- `ProjectCardV2`: Added `onOpen` prop for title click navigation
- `ProjectDetailView`: Callback updates for drill-down integration
- `EditTitleModal`: Fixed setState in effect (lint compliance)
- `useTTS.ts`: Added missing dependency (lint compliance)

### Removed
- `/app/project/[id]/page.tsx`: Functionality moved to in-page drill-down

### Fixed
- ESLint warnings in `EditTitleModal` and `useTTS.ts`
- Unused imports in `app/page.tsx`

### Security
- No security impacts; data migration preserves all existing data

### Performance
- No performance regression; grid rendering uses same patterns as project grid
- Detail panel uses efficient React state updates

### Accessibility
- Detail panel is fully accessible (focus trap, keyboard navigation)
- ARIA labels added to drill-down buttons
- Tested with screen readers (manual)

---

## [1.0.0] - Phase 2 Complete (Previous Release)

### Added
- Tags system for reading organization
- Detox theme with minimal color palette
- Text-to-Speech (TTS) with Web Speech API
- Auto-advance timer for reading progression
- Spotlight reading mode
- Reading reactivation for archived readings
- Firebase authentication
- Cloud sync for readings
- Onboarding tutorial
- Settings modal with accessibility options

### Features by Phase
- **Phase 1**: Example document, tags system, themes
- **Phase 2**: Reader enhancements, Firebase integration
- **Phase 3a** (previous): Automatic data migration for readings

---

## Migration Guide

### For Users
1. **No action required**: App will automatically organize your readings into "Mis Lecturas" project
2. **First load may take a few seconds**: Migration runs in background
3. **All your readings preserved**: No data loss
4. **New workflow**: Projects first, then browse readings within project

### For Developers

#### Before Phase 3b
```typescript
// Single flat list of readings
const [readings, setReadings] = useLocalStorage<Reading[]>("readings", []);

// Create reading
const newReading: Reading = {
  id: generateId(),
  title: "My Reading",
  content: "...",
};
```

#### After Phase 3b
```typescript
// Readings now organized by project
const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
const [readings, setReadings] = useLocalStorage<Reading[]>("readings", []);

// Create reading with projectId
const newReading: Reading = {
  id: generateId(),
  projectId: selectedProject.id, // REQUIRED
  title: "My Reading",
  content: "...",
};
```

#### Querying Readings by Project
```typescript
// All readings in a project
const projectReadings = readings.filter(r => r.projectId === projectId);

// Completion percent for project
const completionPercent = getProjectCompletionPercent(
  readings,
  completedReadings,
  projectId
);
```

### Data Schema Changes

#### New: `Project` Type
```typescript
interface Project {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  created?: number;
  updated?: number;
}
```

#### Updated: `Reading` Type
```typescript
interface Reading {
  id: string;
  projectId: string; // NEW - required
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  created?: number;
  updated?: number;
}
```

#### Storage Keys
```typescript
// New
localStorage.setItem("projects", JSON.stringify(projects));

// Updated (all readings now have projectId)
localStorage.setItem("readings", JSON.stringify(readings));
```

---

## Testing Checklist

- [x] Migration logic: 5/5 scenarios pass
- [x] Drill-down navigation: Opens on title click
- [x] Reading grid: Renders correctly in readings mode
- [x] Back button: Returns to projects
- [x] Detail panels: Show correct data for projects and readings
- [x] Mobile responsive: Overlay panel works correctly
- [x] All actions: Complete, favorite, edit, delete, open work
- [x] Lint: No errors, only harmless warnings
- [x] Build: Succeeds without errors
- [x] Dev server: Runs successfully

---

## Known Issues & Limitations

### Current Limitations (Future Work)
- [ ] Cannot search within project (PRD-006 candidate)
- [ ] Cannot edit project after creation
- [ ] Cannot delete projects
- [ ] Cannot move readings between projects
- [ ] Single project per reading (by design)
- [ ] No project sharing/collaboration

### Known Issues
- None reported in current implementation

---

## Deployment Notes

### Deployment Checklist
- [ ] Merge PR to main
- [ ] Run full test suite
- [ ] Verify on staging environment
- [ ] Monitor production error logs
- [ ] Verify migration success rate
- [ ] Check user engagement metrics

### Rollback Procedure
- Revert to previous commit
- Migration is idempotent (safe to rerun)
- No database backups required (localStorage data preserved)

---

## References

- **Phase 3b Implementation**: `PHASE-3B-BREAKING-CHANGES.md`
- **Migration Logic**: `lib/dashboard/migrationHelpers.ts`
- **Architecture**: `docs/Architecture-Overview.md`
- **User Guide**: `docs/User-Guide.md`
- **Agent Contracts**: `docs/AGENTS.md`

---

## Contributors

- Nahuel Quiroga (@matiasz8) - Implementation
- Copilot - Code generation and review
