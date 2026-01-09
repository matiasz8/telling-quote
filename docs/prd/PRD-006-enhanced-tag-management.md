# PRD-006: Enhanced Tag Management & Filtering

**Status**: 📝 Draft  
**Priority**: High  
**Phase**: 2.0  
**Owner**: TBD  
**Created**: January 9, 2026  
**Last Updated**: January 9, 2026

---

## Overview

Add advanced tag management capabilities to tellingQuote Phase 2, including tag-based filtering, autocomplete suggestions, tag statistics, and tag library management. This builds on the foundation laid by PRD-002 (Tags System v1) and significantly improves reading organization and discoverability.

---

## Problem Statement

While PRD-002 provides basic tagging functionality, users with large reading libraries face challenges:

1. **Hard to find readings by topic** - No way to filter/search by tags
2. **Inconsistent tag naming** - "javascript", "JS", "JavaScript" create duplicate tags
3. **Tag proliferation** - No way to manage or rename tags globally
4. **Wasted screen space** - Tag stats/summary not visible
5. **Manual tagging burden** - No suggestions or autocomplete
6. **Tag discovery** - Can't see what tags exist in library

---

## Goals & Objectives

### Primary Goals

- Implement tag-based filtering on dashboard
- Provide tag autocomplete in creation/editing
- Show tag statistics and library
- Enable global tag management (rename, merge, delete)

### Secondary Goals

- Improve tag discoverability with popular tags section
- Reduce tagging friction with suggestions
- Provide tag usage analytics
- Support tag hierarchies (optional future)

### Success Metrics

- 70%+ of users use tag filtering monthly
- 60%+ of new readings use tags (vs 50% in v1)
- Avg 1.5 fewer duplicate tags per user
- 90%+ adoption of autocomplete feature

---

## User Stories

**As a student with 50+ study materials**  
I want to filter readings by subject tag  
So that I can focus on one topic at a time

**As a researcher**  
I want to see all tags I've created  
So that I can rename duplicate tags and keep library organized

**As a busy professional**  
I want the app to suggest tags as I create readings  
So that tagging is faster and more consistent

**As someone trying to remember a reading**  
I want to see popular tags in my library  
So that I can discover readings I forgot about

**As a knowledge manager**  
I want to rename a tag globally  
So that I can fix tagging inconsistencies without re-tagging everything

---

## Requirements

### Functional Requirements

#### FR-1: Tag-Based Filtering

**Where**: Dashboard (Active/Completed tabs)

**Feature**:
- Clickable tag pills at top of dashboard (tag cloud or filter bar)
- Single tag selection: Show readings with that tag
- Multi-tag filtering:
  - **AND mode**: Show readings with ALL selected tags
  - **OR mode**: Show readings with ANY selected tag (toggle in UI)
- Active filter indicator with clear/remove button
- Persists selected filters in localStorage

**UI Design**:
```
Dashboard: Active Readings
┌──────────────────────────────────────┐
│ 🏷️ Filter by tags:                   │
│ [javascript] [react] [tutorial] [+more]
│ [Clear All]                          │
│                                      │
│ AND mode: Match all selected tags    │
│ OR mode:  Match any selected tag     │
└──────────────────────────────────────┘
```

#### FR-2: Tag Autocomplete

**Where**: NewReadingModal, EditTitleModal

**Feature**:
- Input field shows suggestions as user types
- Suggestions based on existing tags in library
- Frequency-weighted (popular tags first)
- Case-insensitive matching
- Max 5 suggestions visible
- Arrow keys to select, Enter to add

**Example**:
```
User types: "java"
Suggestions:
  1. javascript (12 readings)
  2. java (3 readings)
User selects "javascript", tag is added
```

#### FR-3: Tag Library & Statistics

**Where**: New "Tag Manager" modal (accessible from Settings)

**Features**:
- List all tags in library with:
  - Tag name
  - Usage count (how many readings)
  - Color indicator
  - Edit/Delete buttons
- Sort by:
  - Most used (default)
  - A-Z alphabetical
  - Recently created
  - Least used
- Search/filter tags in list

**UI Design**:
```
Tag Manager
┌────────────────────────────────┐
│ Tags in Your Library (12 total)│
├────────────────────────────────┤
│ 🔍 Search tags...             │
│ Sort: Most Used ▼             │
│                                │
│ javascript    [12 readings]    │
│   [Edit] [Rename] [Delete]    │
│                                │
│ react         [8 readings]     │
│   [Edit] [Rename] [Delete]    │
└────────────────────────────────┘
```

#### FR-4: Global Tag Rename

**Feature**: Rename a tag across all readings simultaneously

**Behavior**:
- User clicks "Rename" on tag in Tag Manager
- Modal opens: "Rename 'javascript' to..."
- Confirmation: "This will update 12 readings"
- On confirm: All readings with old tag get new tag
- History: Show rename happened in toast notification

#### FR-5: Global Tag Delete

**Feature**: Delete a tag from all readings

**Behavior**:
- User clicks "Delete" on tag in Tag Manager
- Confirmation modal: "Remove 'javascript' from 12 readings?"
- On confirm: Tag removed from all readings
- Soft delete (can be restored via undo for 10 seconds)

#### FR-6: Global Tag Merge

**Feature**: Combine two similar tags into one

**Example**: Merge "javascript", "JS", "js" → "javascript"

**Behavior**:
- User in Tag Manager: "Merge with..."
- Select target tag
- "Merge 'js' (3 readings) into 'javascript'?"
- All readings with 'js' get 'javascript' instead
- Original tag removed

#### FR-7: Popular Tags Section

**Where**: Dashboard sidebar or below tag filter

**Feature**:
- Show top 5-10 most-used tags
- Clickable to filter by that tag
- Visual: larger text = more frequently used (tag cloud style)
- Refreshes when tags change

#### FR-8: Tag Suggestions (Phase 2.0 - Keyword Based)

**Where**: NewReadingModal, EditTitleModal (optional)

**Feature** (Phase 2.0 - Keyword Based):
- Extract nouns from reading title
- Match against existing tags
- Suggest best matches (max 3)
- User can accept/reject suggestions

**Future** (Phase 2.1 - AI Powered):
- ML model analyzes title + first 100 chars of content
- Suggests 3-5 relevant tags
- User can accept/reject suggestions
- Feedback improves model

---

### Non-Functional Requirements

#### NFR-1: Performance

- Tag filtering: < 100ms (1000+ readings)
- Autocomplete: < 50ms suggestions
- Tag Manager: Load instantly (< 500ms)
- Rename/Merge: < 200ms per operation

#### NFR-2: Data Consistency

- Tag operations are atomic (all or nothing)
- No orphaned tags left in readings
- Rename/merge updates all affected readings
- Undo restores exact previous state

#### NFR-3: User Experience

- All tag operations have undo (10 second window)
- Toast notifications for tag changes
- Loading states for bulk operations
- Clear error messages
- Keyboard shortcuts for common operations

#### NFR-4: Accessibility

- Tag filter: Keyboard navigable (Tab, Arrow keys)
- Autocomplete: Screen reader friendly (aria-live regions)
- Tag Manager: Full keyboard support
- Focus management in modals
- WCAG 2.1 AA compliance

#### NFR-5: Backward Compatibility

- Existing readings maintain tags through migration
- No data loss during upgrade
- Graceful fallback for missing tags

---

## User Flow

### Filtering by Tags

```
User views dashboard
    ↓
Sees tag cloud at top
    ↓
Clicks "javascript" tag
    ↓
Dashboard shows only readings with javascript tag
    ↓
Filter indicator shows "Filtered by: javascript [×]"
    ↓
User clicks another tag "react" 
    ↓
Toggle appears: "AND mode" vs "OR mode"
    ↓
In AND mode: Shows only readings with BOTH javascript AND react
    ↓
User clicks [Clear All]
    ↓
Returns to showing all readings
```

### Renaming a Tag Globally

```
User clicks Settings
    ↓
Clicks "Tag Manager" button
    ↓
Tag Manager modal opens
    ↓
User sees "javascript (12 readings)"
    ↓
Clicks [Rename]
    ↓
Modal: "Rename 'javascript' to..."
    ↓
User types "js" → "typescript"
    ↓
Confirmation: "Update 12 readings?"
    ↓
On confirm: All readings updated
    ↓
Toast: "Renamed 'javascript' to 'typescript' (12 readings)"
    ↓
Undo button available (10 seconds)
```

### Tag Autocomplete

```
User creates new reading
    ↓
Enters title + content
    ↓
Clicks tag input field
    ↓
Types "jav"
    ↓
Autocomplete shows:
  - javascript (12 readings)
  - java (3 readings)
    ↓
User selects "javascript"
    ↓
Tag added to reading
```

---

## Out of Scope (v2.0)

- ❌ Tag hierarchies (parent/child tags)
- ❌ Tag sharing between users
- ❌ Tag templates or presets
- ❌ API for tag import/export
- ❌ Tag-based smart collections
- ❌ AI image descriptions based on tags
- ❌ ML-based tag suggestions (Phase 2.1)

---

## Future Enhancements (v2.1+)

### Phase 2.1: Smart Tag Suggestions

- ML-based content analysis
- Auto-suggest tags when creating reading
- Learning from user acceptance/rejection
- Works offline (local model)

### Phase 2.2: Tag Collections

- Create smart collections: "Show all readings with tags: [javascript, react, tutorial]"
- Save collections for quick access
- Collection-based navigation

### Phase 2.3: Advanced Analytics

- Tag usage over time (trending tags)
- Tag co-occurrence (tags that appear together)
- Tag recommendations based on reading patterns

### Phase 2.4: Tag Hierarchies

- Parent tags (e.g., "languages" > "javascript")
- Tag nesting
- Bulk tag operations on hierarchies

---

## Success Criteria

### MVP (v2.0)

- ✅ Tag-based filtering (AND/OR modes)
- ✅ Autocomplete for tag input
- ✅ Tag Manager with rename/delete/merge
- ✅ Popular tags section
- ✅ Tag usage statistics
- ✅ Undo functionality (10 second window)
- ✅ Full keyboard accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ Performance: <200ms for all operations

### Nice to Have

- Tag search in Tag Manager
- Tag sorting options
- Import/export tags
- Tag color customization
- Keyboard shortcuts documentation

---

## Dependencies

- **PRD-002** (Tags System v1) - Must be complete first ✅
- **useSettings hook** - for localStorage persistence ✅
- **types/Reading** - already has tags field ✅
- **No new external libraries** - use existing patterns ✅

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bulk rename/delete slow with 1000+ readings | Medium | Lazy load operations, show progress bar |
| Users accidentally delete tags | Medium | Clear confirmation + undo window (10s) |
| Autocomplete too aggressive | Low | Configurable threshold (80%+ match) |
| Merge creates duplicates | Low | Pre-check for exact matches before merge |
| Performance degrades with large tag sets | Medium | Implement pagination in Tag Manager |
| Screen reader doesn't announce tag changes | Medium | Use aria-live regions for updates |

---

## Technical Approach (High-Level)

### Data Structure

```typescript
// Existing (from PRD-002)
type Reading = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
};

// New in PRD-006
type TagStats = {
  tagName: string;
  count: number;
  color: string;
  lastUsed: Date;
};

type FilterState = {
  selectedTags: string[];
  mode: 'AND' | 'OR';
  isActive: boolean;
};
```

### Component Structure

```
Dashboard
├── TagFilterBar (NEW)
│   ├── TagPills
│   ├── FilterToggle (AND/OR)
│   └── ClearButton
├── PopularTags (NEW)
└── ReadingsList (existing)

SettingsModal (existing)
├── [New Button] "Tag Manager"
└── TagManagerModal (NEW)
    ├── TagSearch
    ├── TagSortOptions
    ├── TagList
    │   ├── TagItem
    │   ├── UsageCount
    │   └── ActionButtons [Rename, Delete, Merge]
    └── RenameModal (NEW)

NewReadingModal (existing, enhanced)
├── TitleInput
├── ContentEditor
├── TagsInput (existing)
├── TagAutocomplete (NEW)
└── TagSuggestions (NEW, Phase 2.1)

EditTitleModal (existing, enhanced)
├── TitleInput
├── TagsInput (existing)
├── TagAutocomplete (NEW)
└── TagSuggestions (NEW, Phase 2.1)
```

### Hooks Needed (NEW)

```typescript
// Hook for tag filtering
useTagFilter(): {
  selectedTags: string[];
  filterMode: 'AND' | 'OR';
  filteredReadings: Reading[];
  setSelectedTags: (tags: string[]) => void;
  setFilterMode: (mode: 'AND' | 'OR') => void;
  clearFilters: () => void;
}

// Hook for tag statistics
useTagStats(): {
  allTags: TagStats[];
  popularTags: TagStats[];
  getTagCount: (tag: string) => number;
  refreshStats: () => void;
}

// Hook for tag operations
useTagOperations(): {
  renameTag: (oldName: string, newName: string) => Promise<void>;
  deleteTag: (tagName: string) => Promise<void>;
  mergeTag: (sourceTag: string, targetTag: string) => Promise<void>;
  undo: () => void;
}

// Hook for autocomplete
useTagAutocomplete(): {
  suggestions: string[];
  getSuggestions: (input: string) => string[];
  selectSuggestion: (tag: string) => void;
}
```

---

## Timeline Estimate

- **Design & UX**: 2-3 days
- **Implementation**: 5-7 days
  - Tag filtering: 2 days
  - Autocomplete: 1.5 days
  - Tag Manager: 2 days
  - Rename/Delete/Merge: 1.5 days
- **Testing**: 2-3 days
- **Polish & Review**: 1-2 days
- **Total**: 2-2.5 weeks (10-15 days)

---

## Definition of Done

- ✅ All FR/NFR implemented
- ✅ TypeScript strict mode passes
- ✅ ESLint zero errors
- ✅ WCAG 2.1 AA accessibility verified
- ✅ Unit tests for tag operations
- ✅ Integration tests for filtering
- ✅ E2E tests for user flows
- ✅ Performance benchmarks met
- ✅ Documentation updated
- ✅ User guide updated

---

## Related Documents

- [PRD-002: Tags System](./PRD-002-tags-system.md) (v1 foundation)
- [TRD-002: Tags System Implementation](../trd/TRD-002-tags-system.md)
- [PRD-005: Firebase Auth](./PRD-005-firebase-auth.md) (cloud sync)
- [PRD-007: Automated Accessibility Testing](./PRD-007-automated-accessibility-testing.md) (validation)

---

## Changelog

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-09 | 0.1 | Agent | Initial draft based on Phase 1 analysis |
| - | 0.2 | TBD | Stakeholder review and feedback |
| - | 1.0 | TBD | Approved for Phase 2.0 development |
