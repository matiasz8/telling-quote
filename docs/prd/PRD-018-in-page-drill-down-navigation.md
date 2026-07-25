# PRD-018: In-Page Drill-Down Navigation

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**Part of**: Project Hierarchy Feature  

## Overview

In-page drill-down navigation provides seamless project → readings navigation without page routing changes. Users stay in the same dashboard interface while exploring project content.

## User Stories

### FR-001: Drill-Down Navigation
As a user, I want to click a project to see its readings without leaving the dashboard.

**Acceptance Criteria**:
- ✅ Click project to drill down into readings
- ✅ Dashboard layout unchanged (no new page)
- ✅ Back button returns to projects
- ✅ Smooth transition (no loading delay)

### FR-002: Reading Preview Panel
As a user, I want to see reading details in a sidebar before opening it.

**Acceptance Criteria**:
- ✅ Click reading card body to show preview
- ✅ Desktop: Static sidebar (non-blocking)
- ✅ Mobile: Full-screen overlay
- ✅ Preview shows: status, project, excerpt, word count, read time
- ✅ Same preview available for projects

### FR-003: Smart Card Interactions
As a user, I want consistent click behavior across cards.

**Acceptance Criteria**:
- ✅ Title click opens (project drills, reading opens reader)
- ✅ Body click shows preview (without opening)
- ✅ Intuitive to learn (< 30 seconds)
- ✅ Works on desktop and mobile

## Success Metrics
- User intuitiveness rating (4+/5)
- Click-through rates to open readings (maintained or increased)
- Mobile engagement (maintained on smaller screens)
- No navigation confusion in support tickets

## Technical Approach
- React state-based navigation (no URL changes)
- Single page component orchestration (app/page.tsx)
- Responsive detail panel (sidebar + overlay)

---

**Implementation**: Phase 3b COMPLETE  
**Status**: Ready for deployment  
**Related**: PRD-017 (Project Hierarchy)
