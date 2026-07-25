# PRD-018: In-Page Drill-Down Navigation

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**Part of**: Project Hierarchy Feature  

## Overview

In-page drill-down navigation provides seamless project → readings navigation without page routing changes. Users stay in the same dashboard interface while exploring project content.

---

## Problem Statement

### Current Issues
- **Page Navigation:** Current route-based navigation causes full page reloads when switching between projects
- **State Loss:** Navigation resets UI state (scroll position, selected reading, etc.)
- **User Confusion:** Users expect smooth navigation within dashboard, not page changes
- **Mobile Experience:** Page transitions cause jarring layout reflow on mobile devices

### Why This Matters
Modern web apps keep users in a single page context, providing smooth transitions and preserved state. Users expect:
- Instant navigation without page reload
- Preserved scroll and selection state
- Smooth animations between views
- Consistent dashboard layout

---

## Requirements

### Functional Requirements

#### FR-1: Drill-Down Navigation (State-Based)
- Click project title to drill down into readings view
- Dashboard stays on same page (no URL navigation)
- ViewMode state changes: 'projects' → 'readings'
- Back button/header returns to projects view
- Navigation is instantaneous (no load time)

#### FR-2: Reading Detail Preview
- Click reading card body (not title) to show detail preview
- Desktop: Sidebar panel (non-blocking, keeps grid visible)
- Mobile: Full-screen overlay (takes full space, shows close button)
- Preview displays: reading status, project name, excerpt, word count, estimated read time
- Users can close preview or click to open full reader

#### FR-3: Smart Card Interactions
- **Project Card:**
  - Title click: Drill down into readings
  - Body/card click: Show project preview
- **Reading Card:**
  - Title click: Open in reader
  - Body/card click: Show reading preview
- Behavior is intuitive and learnable in < 30 seconds

#### FR-4: Navigation State Persistence
- Back button always returns to previous view (projects or readings)
- Selected project/reading ID preserved during session
- Smooth visual transition between views

#### FR-5: Responsive Layouts
- Desktop (lg+): Detail sidebar 300-400px, grid takes remaining space
- Tablet (md): Detail sidebar 250px, grid responsive
- Mobile (<md): Detail as full-screen overlay, close button to return

### Non-Functional Requirements

#### NFR-1: Performance
- Drill-down transition < 100ms
- Preview panel render < 50ms
- No animation lag (60fps animations)

#### NFR-2: User Experience
- Intuitiveness rating: 4+/5
- Click-through rates: maintained or increased vs previous nav
- Mobile engagement: no degradation

#### NFR-3: Accessibility
- Keyboard navigation works (arrow keys, enter, escape)
- Screen reader announces view changes
- Focus management preserved

---

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
