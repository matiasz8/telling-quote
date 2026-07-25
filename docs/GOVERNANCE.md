# Documentation Governance

Guidelines for creating, maintaining, and organizing project documentation.

---

## 📋 Documentation Types

### 1. Product Requirements Documents (PRDs)

**Purpose**: Define WHAT features to build and WHY

**Location**: `/docs/prd/`

**Format**:
```
# PRD-XXX: Feature Name

**Status**: [Planning | In Progress | Approved | Implemented | Deprecated]
**Date**: YYYY-MM-DD
**Phase**: [X or X.Y]
**Owner**: [Name or team]
**Related PRD**: [Other PRD numbers]

## Overview
Clear description of the feature and its purpose.

## User Stories
One or more user stories in "As a... I want... so that..." format.

### Story Title
**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

## Success Metrics
How we measure if this feature succeeds.

## Business Value
Why this feature matters to users.

## Dependencies
Features or systems this depends on.

## Related Documentation
- TRD-XXX: Technical implementation
- ADR-Y: Relevant architecture decisions
```

**Numbering**:
- PRD-001 to PRD-016: Features (Phases 1-3a)
- PRD-017+: Phase 3b and future features
- Sequential numbering, no gaps (fills as features are planned)

**When to Create**:
- New user-facing feature
- Significant modification to existing feature
- Major architectural change
- Before technical implementation

### 2. Technical Requirements Documents (TRDs)

**Purpose**: Define HOW to implement features from PRDs

**Location**: `/docs/trd/`

**Format**:
```
# TRD-XXX: Feature Name - Technical Implementation

**Status**: [Planning | In Progress | Approved | Implemented]
**Date**: YYYY-MM-DD
**Phase**: [X or X.Y]
**Related PRD**: PRD-XXX
**Owner**: [Developer name or team]

## Overview
Brief description of the technical approach.

## Architecture
High-level system design and components.

## Components
- ComponentA.tsx
- ComponentB.tsx

## Data Models
Interfaces, types, and schema.

## Implementation Details
How to build this.

## Dependencies
Other features or libraries required.

## Testing Strategy
How to test this feature.

## Browser/Platform Support
Minimum versions and compatibility.

## Performance Considerations
Expected performance characteristics.

## Related Documentation
- PRD-XXX: Requirements
- ADR-Y: Architecture decisions
```

**Numbering**:
- Matches PRD numbering (TRD-N for PRD-N)
- Both should exist for every major feature
- Some PRDs may have TRD in Planning status if not yet implemented

**When to Create**:
- When PRD moves to "In Progress"
- Before implementation starts
- After architecture decisions are made

### 3. Architecture Decision Records (ADRs)

**Purpose**: Document major architectural decisions and their rationale

**Location**: `/docs/adr/`

**Format**:
```
# ADR-XXX: Short Decision Title

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Decision Impact**: [LOW | MEDIUM | HIGH | BREAKING]

## Context
What's the problem? Why do we need to decide?

## Decision
What did we choose and why?

## Consequences
What are the tradeoffs? What becomes easier/harder?

## Alternatives Considered
Other options and why they were rejected.

## Implementation
How to execute this decision.

## Related Documentation
- PRD-X/TRD-X: Related features
- Other ADRs

## References
External articles, libraries, or documentation.
```

**Numbering**:
- Sequential: ADR-001, ADR-002, etc.
- Not tied to phases

**When to Create**:
- Choosing major architecture pattern
- Making breaking changes
- Evaluating significant tradeoffs
- Documenting system-wide patterns

---

## 🔢 Numbering Scheme

### Feature Numbering (PRD/TRD)

```
Phase 1 (Initial Release):
  PRD-001 to PRD-004

Phase 2 (Firebase Integration):
  PRD-005 to PRD-008

Phase 3a (Accessibility & Advanced):
  PRD-009 to PRD-016

Phase 3b (Project Hierarchy):
  PRD-017 to PRD-018

Phase 4+ (Future):
  PRD-019+
```

**Rules**:
- One PRD/TRD pair per feature
- Sequential numbering (no gaps)
- TRD number matches PRD number
- Add new numbers as features are planned

### ADR Numbering

```
ADR-001: Project Hierarchy with In-Page Drill-Down (Phase 3b)
ADR-002+: Future decisions
```

**Rules**:
- Sequential: ADR-001, ADR-002, etc.
- Not tied to features or phases
- One ADR per significant decision

---

## 📁 Folder Structure

```
/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── PHASE-3B-BREAKING-CHANGES.md (critical refs, stay in root)
├── PHASE-3B-DEPLOYMENT-PLAN.md (critical refs, stay in root)
│
└── /docs
    ├── README.md (this index)
    ├── GOVERNANCE.md (this file)
    ├── Architecture-Overview.md
    ├── AGENTS.md
    ├── HOW-TO-PRD-TRD.md
    ├── User-Guide.md
    ├── Use-Cases.md
    │
    ├── /prd
    │   ├── README.md
    │   ├── PRD-001-*.md
    │   ├── PRD-002-*.md
    │   └── ... (all PRDs)
    │
    ├── /trd
    │   ├── README.md
    │   ├── TRD-001-*.md
    │   ├── TRD-002-*.md
    │   └── ... (all TRDs)
    │
    ├── /adr
    │   ├── README.md
    │   ├── ADR-001-PROJECT-HIERARCHY-DRILL-DOWN.md
    │   └── ... (all ADRs)
    │
    └── /archive
        └── Phase-History/
            ├── PHASE-1-COMPLETION.md
            └── ... (historical docs)
```

---

## ✍️ Writing Guidelines

### General
- Write in clear, concise English
- Use markdown formatting consistently
- Include table of contents for long docs
- Cross-reference related documents
- Link to code files when relevant

### PRD
- Focus on user value and business requirements
- Use user story format for features
- Include acceptance criteria (checklist)
- Avoid technical implementation details
- Define success metrics upfront

### TRD
- Focus on implementation approach
- Include code examples when helpful
- Document data structures/APIs
- Cover testing and deployment
- Reference PRD for requirements

### ADR
- Explain the problem clearly
- Be explicit about alternatives
- Document consequences and tradeoffs
- Avoid blame or personality
- Include date and status

---

## 🔄 Maintenance Process

### When Features Change
1. Update corresponding PRD/TRD
2. Note change date and reason
3. Create ADR if architectural impact
4. Link related documents

### When Phases Complete
1. Archive phase documentation in `/docs/archive`
2. Update root README
3. Update PRD/TRD README indexes
4. Maintain roadmap for future phases

### Regular Reviews
- Quarterly review of documentation status
- Identify outdated or stale docs
- Update index files (prd/README, trd/README)
- Archive completed phases

---

## 📌 Current Status

### Phase 3b Complete
- ✅ PRD-017 & TRD-017: Project Hierarchy
- ✅ PRD-018 & TRD-018: Drill-Down Navigation
- ✅ ADR-001: Architectural decision for drill-down

### Documentation Gaps (To Be Addressed)
- 🔄 TRD-006: Enhanced Tag Management (Planning)
- 🔄 TRD-008: Advanced Accessibility (Planning)
- 🔄 TRD-011: Internationalization (Planning)
- 🔄 TRD-015: Visual Testing (Planning)

### Future Work
- PRD-019+: Phase 4 features (Edit/delete projects, search, etc.)
- ADR-002+: Future architectural decisions
- Internationalization strategy (Phase 4?)
- Mobile app considerations (Phase 5?)

---

## 🎯 Quality Checklist

Before merging documentation:

- [ ] Document has correct status
- [ ] Numbering is consistent
- [ ] Cross-references are valid
- [ ] Related PRD/TRD pairs exist
- [ ] Links are not broken
- [ ] Formatting is consistent
- [ ] Examples/code is valid
- [ ] Success metrics are measurable

---

## 📞 Questions?

- **How do I create a new PRD?** → See `HOW-TO-PRD-TRD.md` template
- **Where should I put X documentation?** → See folder structure above
- **What's the difference between PRD and TRD?** → PRD = WHAT, TRD = HOW
- **When do I write an ADR?** → Major architectural decisions only

---

**Maintained by**: Engineering & Product Team  
**Last Updated**: 2026-07-25  
**Version**: 1.0 (Post-Phase 3b Reorganization)
