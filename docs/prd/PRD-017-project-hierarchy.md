# PRD-017: Project Hierarchy

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**Breaking Change**: Yes  

## Overview

Project Hierarchy feature restructures the flat reading list into a hierarchical project-based organization. Users can organize readings into projects (themes/topics) and navigate using in-page drill-down.

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
