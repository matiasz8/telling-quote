# Architecture Decision Records (ADRs)

This folder contains Architecture Decision Records documenting significant architectural decisions made during project development.

## Current ADRs

### ADR-001: Project Hierarchy with In-Page Drill-Down Navigation
**Status**: Accepted  
**Date**: 2026-07-25  
**Phase**: 3b  

Decision to implement project hierarchy using in-page drill-down navigation instead of page routing.

**Key Points**:
- Drill-down keeps users in dashboard context
- No page navigation required
- Responsive design (desktop sidebar + mobile overlay)
- Automatic silent migration for existing data

**Related**:
- PRD-017 & TRD-017 (Project Hierarchy)
- PRD-018 & TRD-018 (Drill-Down Navigation)
- PHASE-3B-BREAKING-CHANGES.md
- PHASE-3B-DEPLOYMENT-PLAN.md

---

## Future ADRs

ADRs should be created when:
- Making major architectural decisions
- Choosing between significant alternatives
- Documenting breaking changes
- Recording design patterns specific to project

See `/docs/HOW-TO-PRD-TRD.md` for ADR template and guidelines.
