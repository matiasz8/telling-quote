# PRD-002: Tags System

**Status**: 📝 Draft  
**Priority**: High  
**Owner**: TBD  
**Created**: November 20, 2025  
**Last Updated**: November 20, 2025

---

## Overview

Add a tagging system to organize readings by topics, categories, or projects. Users can add optional tags when creating/editing readings and filter by tags in the dashboard.

---

## Problem Statement

Currently, all readings are displayed in a flat list (Active/Completed tabs only). As users accumulate readings:

1. **Hard to find specific readings** among many
2. **No way to group related readings** (e.g., all "JavaScript" tutorials)
3. **No organizational flexibility** beyond completion status
4. **Difficult to manage readings** for different projects/topics

---

## Goals & Objectives

### Primary Goals

- Enable users to categorize readings with tags
- Provide visual tag indicators on reading cards
- Improve reading discoverability and organization

### Secondary Goals

- Lay foundation for tag-based filtering (future)
- Support multiple tags per reading
- Make tagging optional (don't force complexity)

### Success Metrics

- 60%+ of users add at least one tag
- Average 1-3 tags per reading
- Users report improved organization (qualitative)

---

## User Stories

**As a student**  
I want to tag my readings by subject (Math, Physics, Chemistry)  
So that I can focus on one subject at a time

**As a developer**  
I want to tag tutorials by language (JavaScript, Python, Go)  
So that I can quickly find relevant resources

**As a researcher**  
I want to tag papers by topic and project  
So that I can organize my reading by research area

**As a casual user**  
I want tagging to be optional  
So that I'm not forced to categorize everything

---

## Requirements

### Functional Requirements

#### FR-1: Tag Creation

- **Where**: NewReadingModal and EditTitleModal
- **UI**: Input field for tags (comma-separated or chip-based)
- **Validation**:
  - Tag names: 1-20 characters
  - Alphanumeric + spaces allowed
  - Max 5 tags per reading
  - Case-insensitive (normalize to lowercase)
  - Trim whitespace
- **Storage**: Array of strings in Reading object

#### FR-2: Tag Display on Cards

- **Location**: ReadingCard component
- **Design**: Small badge/pill with tag name
- **Styling**:
  - Tailwind badge component
  - Theme-aware colors (light/dark mode)
  - Limit to 2-3 visible tags, show "+X more" if needed
- **Icon**: Tag icon from Heroicons or similar

#### FR-3: Tag Colors (Optional for v1)

- Auto-assign colors based on tag name (hash-based)
- Consistent color for same tag across cards
- Accessible color combinations

#### FR-4: Tag Editing

- Users can add/remove tags from existing readings
- EditTitleModal expands to include tag management
- Or separate "Edit Tags" action

### Non-Functional Requirements

#### NFR-1: Data Model

```typescript
interface Reading {
  id: string;
  title: string;
  content: string;
  tags?: string[]; // Optional, default empty array
  createdAt?: number; // Optional: timestamp
  updatedAt?: number; // Optional: timestamp
}
```

#### NFR-2: Migration

- Existing readings without `tags` field should still work
- Backward compatible with current localStorage data

#### NFR-3: Performance

- Tag rendering should not impact card load time
- Efficient tag normalization and storage

---

## Design Mockup (Text Description)

### Reading Card with Tags

```bash
┌─────────────────────────────────────┐
│ 🟢 Reading Title                    │ ← Pending indicator
│                                     │
│ 🏷️ javascript  🏷️ react             │ ← Tag badges
│                                     │
│               [✏️ Edit] [🗑️ Delete] │
└─────────────────────────────────────┘
```

### Tag Input in Modal

```bash
┌──────────────────────────────────────┐
│  Create New Reading                  │
├──────────────────────────────────────┤
│  Title:                              │
│  [____________________________]      │
│                                      │
│  Tags (optional):                    │
│  [javascript, react, tutorial__] 🏷️  │
│  Separate tags with commas           │
│                                      │
│  Content:                            │
│  [                              ]    │
│  [                              ]    │
│                                      │
│         [Cancel]  [Save Reading]     │
└──────────────────────────────────────┘
```

---

## User Flow

### Creating Reading with Tags

```bash
User clicks "New Reading"
    ↓
Modal opens
    ↓
User enters title
    ↓
User optionally adds tags (comma-separated)
    ↓
System validates and normalizes tags
    ↓
User enters content
    ↓
User saves
    ↓
Reading created with tags array
    ↓
Dashboard shows reading with tag badges
```

---

## Technical Considerations

### Tag Normalization Function

```typescript
function normalizeTags(input: string): string[] {
  return input
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 20)
    .slice(0, 5); // Max 5 tags
}
```

### Tag Color Assignment

```typescript
function getTagColor(tagName: string, isDark: boolean): string {
  const hash = tagName.split('').reduce((acc, char) => 
    char.charCodeAt(0) + ((acc << 5) - acc), 0);
  
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}
```

---

## Out of Scope (v1)

- ❌ Tag-based filtering/search
- ❌ Tag suggestions/autocomplete
- ❌ Tag statistics/analytics
- ❌ Hierarchical tags (parent/child)
- ❌ Tag renaming globally
- ❌ Tag deletion globally
- ❌ Predefined tag categories

---

## Future Enhancements (v2+)

### Phase 2: Tag Filtering

- Filter dashboard by selected tag(s)
- "Show only: [JavaScript]" button
- Multi-tag filtering (AND/OR logic)

### Phase 3: Tag Management

- Tag library/autocomplete
- Global tag renaming
- Tag usage statistics
- Popular tags section

### Phase 4: Smart Tags

- Auto-suggest tags based on content
- AI-powered tag generation

---

## Open Questions

1. **Should tags be editable inline on cards?**
   - Proposal: No for v1, use Edit modal

2. **How to handle tag color consistency?**
   - Proposal: Hash-based colors for now

3. **Should we limit tag name characters (no special chars)?**
   - Proposal: Allow alphanumeric + spaces only

4. **Show tag count in dashboard header?**
   - Proposal: Not for v1, wait for filtering feature

---

## Success Criteria

### MVP (v1)

- ✅ Users can add tags when creating readings
- ✅ Users can edit tags on existing readings
- ✅ Tags display on reading cards with icon
- ✅ Theme-aware tag styling
- ✅ Backward compatible with existing data

### v2 (Future)

- Tag-based filtering
- Tag autocomplete
- Tag statistics

---

## Dependencies

- Reading type update (`types/index.ts`)
- NewReadingModal component update
- EditTitleModal component update
- ReadingCard component update
- localStorage schema update

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tag proliferation (too many unique tags) | Medium | Limit to 5 per reading, encourage reuse |
| Performance with many tags | Low | Efficient rendering, virtual scrolling if needed |
| Data migration issues | Medium | Graceful fallback for missing tags field |
| Inconsistent tag naming | Medium | Normalize to lowercase, trim spaces |

---

## Timeline Estimate

- **Design**: 1 day
- **Development**: 2-3 days
- **Testing**: 1 day
- **Total**: 4-5 days

---

## Related Documents

- [TRD-002: Tags System Implementation](../trd/TRD-002-tags-system.md)
- [PRD-001: Example Document](./PRD-001-example-document.md) (example should have tags)
