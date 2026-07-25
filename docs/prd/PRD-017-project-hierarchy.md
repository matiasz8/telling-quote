# PRD-017: Project Hierarchy

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**Breaking Change**: Yes  

## Overview

Project Hierarchy feature restructures the flat reading list into a hierarchical project-based organization. Users can organize readings into projects (themes/topics) and navigate using in-page drill-down.

---

## Problem Statement

### Current Issues
- **Flat Organization:** All readings in a single unorganized list, difficult to find related content
- **No Categorization:** Users can use tags, but no way to group readings by theme/project
- **Scaling Challenges:** As users accumulate 50+ readings, navigation becomes overwhelming
- **Discovery Problem:** Hard to find readings on similar topics or remember what was in a project

### Why This Matters
Users need a way to organize readings into logical groups (e.g., "React Learning", "System Design", "Career Development") so they can:
- Quickly find related readings
- Track progress on a topic
- Share collections with future team features
- Have a structured knowledge base

---

## Requirements

### Functional Requirements

#### FR-1: Create Projects
- Users can create new projects with title and optional description
- Project title is required (max 100 chars)
- Project appears immediately in dashboard
- Default project "Mis Lecturas" created automatically on first load

#### FR-2: View Projects
- Display all projects as grid cards
- Each card shows: title, description, reading count, last modified date
- Sort options: alphabetical, date created, date modified, most readings
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

#### FR-3: Organize Readings into Projects
- Users can assign readings to projects
- Existing readings auto-migrate to default project
- Readings can be moved between projects
- Reading belongs to exactly one project (not multiple)

#### FR-4: Edit/Delete Projects
- Users can edit project title and description
- Users can delete empty projects
- Delete with readings: confirm dialog, option to reassign readings first
- Deleted project soft-deletes, recoverable for 30 days (future: admin feature)

#### FR-5: Automatic Migration
- On first load: detect orphaned readings and auto-assign to default project
- Migration runs silently (no UI interruption)
- 100% success rate, zero data loss
- Idempotent: safe to run multiple times

### Non-Functional Requirements

#### NFR-1: Performance
- Project grid renders < 100ms (even with 100+ projects)
- Reading assignment < 50ms
- Migration completes < 500ms

#### NFR-2: Data Integrity
- Zero data loss during migration
- No orphaned readings after migration
- All readings have projectId (enforced)

#### NFR-3: User Experience
- Adoption: 50%+ of users create 2+ projects within first week
- Intuitiveness: 80%+ users understand navigation without help
- Satisfaction: 4+/5 rating on feature

---

## User Stories

### FR-001: Create Projects
As a user, I want to create projects to organize my readings by theme.

**Acceptance Criteria**:
- ✅ Create new project with title and description
- ✅ Project creation modal closes automatically
- ✅ New project appears in project grid
- ✅ Project assigned to current user

### FR-002: View Projects
As a user, I want to see all my projects in a grid view.

**Acceptance Criteria**:
- ✅ Projects displayed as grid cards
- ✅ Project card shows title, description, reading count
- ✅ Responsive layout (1-4 columns based on device)
- ✅ Sorted alphabetically or by creation date

### FR-003: Drill-Down Navigation
As a user, I want to click a project to see its readings without page navigation.

**Acceptance Criteria**:
- ✅ Click project title to drill down
- ✅ Reading grid displays in same dashboard location
- ✅ Back button returns to projects
- ✅ Navigation state preserved
- ✅ No full page reload

### FR-004: Automatic Migration
As a user upgrading from v1.0, my existing readings should be automatically organized.

**Acceptance Criteria**:
- ✅ Migration runs silently on first load
- ✅ Default "Mis Lecturas" project created
- ✅ All orphaned readings assigned to default project
- ✅ Zero data loss
- ✅ Idempotent (safe to run multiple times)

## Success Metrics

- User adoption of project organization (50%+ of users create 2+ projects)
- Zero data loss during migration (100% success rate)
- User satisfaction with navigation (4+/5 rating)
- Engagement increase (more time in app, more readings created)

## Related Documentation
- See TRD-017 for technical implementation details
- See PHASE-3B-BREAKING-CHANGES.md for migration plan
- See PHASE-3B-DEPLOYMENT-PLAN.md for deployment strategy

---

**Implementation**: Phase 3b COMPLETE  
**Status**: Ready for deployment  
**PR**: #36 (pending merge)
