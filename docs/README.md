# Telling Quote - Documentation Index

Central index for all project documentation. Navigate to the section you need.

## 🎯 Quick Links

### Getting Started
- **[README.md](../README.md)** - Project overview and quick start
- **[User Guide](User-Guide.md)** - How to use the app as a user
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to development

### Product & Technical Documentation

#### Product Requirements (PRDs)
- **[PRDs Folder](prd/)** - 18 Product Requirements Documents
  - Phases 1-3a: Features 001-016
  - Phase 3b: Features 017-018
  - See `prd/README.md` for complete list

#### Technical Requirements (TRDs)
- **[TRDs Folder](trd/)** - 18 Technical Requirements Documents
  - Matched to all PRDs
  - Architecture and implementation details
  - See `trd/README.md` for complete list

#### Architecture Decisions (ADRs)
- **[ADRs Folder](adr/)** - Architecture Decision Records
  - ADR-001: Project Hierarchy with In-Page Drill-Down (Phase 3b)
  - See `adr/README.md` for details

### Project Governance
- **[AGENTS.md](AGENTS.md)** - Agent contracts and responsibilities
- **[HOW-TO-PRD-TRD.md](HOW-TO-PRD-TRD.md)** - Template and guidelines for PRD/TRD
- **[Architecture Overview](Architecture-Overview.md)** - System design and component architecture

### User Documentation
- **[User Guide](User-Guide.md)** - Complete user manual
- **[Use Cases](Use-Cases.md)** - Common workflows and scenarios

### Phase Documentation

#### Phase 3b: Project Hierarchy (CURRENT)
- **[PHASE-3B-BREAKING-CHANGES.md](../PHASE-3B-BREAKING-CHANGES.md)** - All breaking changes explained
- **[PHASE-3B-DEPLOYMENT-PLAN.md](../PHASE-3B-DEPLOYMENT-PLAN.md)** - Deployment and testing strategy
- **[PRD-017](prd/PRD-017-project-hierarchy.md)** - Project Hierarchy Requirements
- **[TRD-017](trd/TRD-017-project-hierarchy.md)** - Project Hierarchy Implementation
- **[PRD-018](prd/PRD-018-in-page-drill-down-navigation.md)** - Drill-Down Navigation Requirements
- **[TRD-018](trd/TRD-018-in-page-drill-down-navigation.md)** - Drill-Down Navigation Implementation

#### Historical Phases
- **[Archive Folder](archive/)** - Phase 1, 2, 3a documentation
  - PHASE-1-COMPLETION.md
  - [Additional phase documents]

## 📊 Documentation Statistics

- Total PRDs: 18
- Total TRDs: 18
- ADRs: 1 (+ more to come)
- Feature Status: 13 implemented, 4 in planning, Phase 4+ TBD

## 🔗 Important External Links

- **GitHub PR #36**: Project Hierarchy Implementation (Phase 3b)
- **Issue Tracker**: [TBD]
- **Deployment Runbook**: See PHASE-3B-DEPLOYMENT-PLAN.md

## 📝 Document Conventions

### PRD Format
Product Requirements Documents define WHAT to build:
- User stories and acceptance criteria
- Feature requirements
- Success metrics
- Related PRD/TRD cross-references

### TRD Format
Technical Requirements Documents define HOW to build:
- Architecture and design decisions
- Implementation details
- Component structure
- Data models and APIs

### ADR Format
Architecture Decision Records explain WHY:
- Problem statement and context
- Decision and alternatives considered
- Consequences and tradeoffs
- Related documentation

## ✅ Maintenance

Documentation is maintained during development:
- Update PRD/TRD when requirements/implementation changes
- Create ADR for major architectural decisions
- Archive completed phases in `/archive`
- Keep index (this file) current

---

**Last Updated**: 2026-07-25  
**Curator**: Product & Engineering Team  
**Version**: 3b (Phase 3b Complete)
