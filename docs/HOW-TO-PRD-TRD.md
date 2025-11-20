# Documentation Guide: PRDs & TRDs

## Overview

This guide explains how to create Product Requirements Documents (PRDs) and Technical Requirements Documents (TRDs) for tellingQuote features.

---

## 📋 What are PRDs and TRDs?

### Product Requirements Document (PRD)
**Purpose**: Define **WHAT** to build and **WHY**

A PRD is a product manager's document that:
- Describes the feature from a user perspective
- Explains the problem being solved
- Defines success criteria
- Does NOT specify technical implementation

**Target Audience**: Product team, stakeholders, developers, designers

### Technical Requirements Document (TRD)
**Purpose**: Define **HOW** to build it

A TRD is an engineering document that:
- Describes technical architecture and implementation
- Specifies data models, APIs, and components
- Includes testing and deployment strategies
- References the corresponding PRD

**Target Audience**: Developers, technical leads, QA engineers

---

## 📁 Directory Structure

```
docs/
├── prd/                    # Product Requirements Documents
│   ├── README.md          # Index of all PRDs
│   ├── TEMPLATE.md        # PRD template
│   └── PRD-XXX-name.md    # Individual PRDs
│
└── trd/                    # Technical Requirements Documents
    ├── README.md          # Index of all TRDs
    ├── TEMPLATE.md        # TRD template
    └── TRD-XXX-name.md    # Individual TRDs
```

---

## 🔢 Naming Convention

### PRD Naming
Format: `PRD-XXX-feature-name.md`

- **XXX**: Three-digit number (001, 002, 003...)
- **feature-name**: Kebab-case description
- Numbers are sequential and never reused

**Examples**:
- `PRD-001-example-document.md`
- `PRD-002-tags-system.md`
- `PRD-003-detox-theme.md`

### TRD Naming
Format: `TRD-XXX-feature-name.md`

- Must match corresponding PRD number
- Same feature name as PRD

**Examples**:
- `TRD-001-example-document.md` (implements PRD-001)
- `TRD-002-tags-system.md` (implements PRD-002)

---

## 📝 When to Create a PRD

Create a PRD when:
- ✅ Adding a new user-facing feature
- ✅ Making significant changes to existing features
- ✅ The change affects user experience
- ✅ You need stakeholder approval
- ✅ The feature requires cross-team coordination

Skip PRD for:
- ❌ Bug fixes
- ❌ Code refactoring (no user impact)
- ❌ Dependency updates
- ❌ Minor UI tweaks
- ❌ Documentation updates

---

## 🔧 When to Create a TRD

Create a TRD when:
- ✅ PRD is approved and ready for implementation
- ✅ Technical complexity is medium-high
- ✅ Multiple components/services affected
- ✅ New architecture patterns introduced
- ✅ Database schema changes required
- ✅ External service integration needed

Skip TRD for:
- ❌ Simple, straightforward implementations
- ❌ Well-established patterns
- ❌ Small component updates
- ✅ Can be described in PR description

---

## ✍️ How to Write a PRD

### 1. Copy the Template
```bash
cp docs/prd/TEMPLATE.md docs/prd/PRD-XXX-your-feature.md
```

### 2. Fill in Header Information
```markdown
**Status**: 📝 Draft
**Priority**: High/Medium/Low
**Owner**: Your Name
**Created**: November 20, 2025
**Last Updated**: November 20, 2025
```

### 3. Complete Each Section

**Essential Sections**:
1. **Overview** (1-2 sentences)
2. **Problem Statement** (What problem are we solving?)
3. **Goals & Objectives** (What success looks like)
4. **User Stories** (Who benefits and how)
5. **Requirements** (Functional & non-functional)
6. **Success Criteria** (How to measure success)
7. **Out of Scope** (What we're NOT doing)

**Optional Sections**:
- Design mockups
- User flows
- Open questions
- Timeline estimates

### 4. Review Checklist

Before submitting PRD:
- [ ] Problem clearly stated
- [ ] Success metrics defined
- [ ] User stories included
- [ ] Functional requirements detailed
- [ ] Out of scope defined
- [ ] No technical implementation details (save for TRD)
- [ ] Stakeholder review completed

---

## 🛠️ How to Write a TRD

### 1. Wait for PRD Approval
- TRD should only be written after PRD is approved
- Reference approved PRD number

### 2. Copy the Template
```bash
cp docs/trd/TEMPLATE.md docs/trd/TRD-XXX-your-feature.md
```

### 3. Fill in Technical Details

**Essential Sections**:
1. **Overview** (Brief technical summary)
2. **Related PRD** (Link to PRD-XXX)
3. **Technical Architecture** (Diagrams, system design)
4. **Data Models** (TypeScript interfaces, database schema)
5. **Component Changes** (What files/components affected)
6. **Implementation Plan** (Step-by-step tasks)
7. **Testing Strategy** (Unit, integration, E2E)
8. **Deployment Plan** (How to ship safely)
9. **Rollback Plan** (How to undo if needed)

**Optional Sections**:
- API design
- Performance considerations
- Security considerations
- Migration strategy

### 4. Review Checklist

Before implementation:
- [ ] Architecture diagram included
- [ ] Data models defined
- [ ] All affected components listed
- [ ] Testing strategy complete
- [ ] Deployment plan safe
- [ ] Rollback plan exists
- [ ] Performance impact considered
- [ ] Security reviewed
- [ ] Technical lead approval

---

## 🔄 Workflow

### Standard Feature Development Flow

```
1. IDEATION
   └─> Discuss feature idea with team

2. PRD CREATION
   ├─> Write PRD (product perspective)
   ├─> Review with stakeholders
   └─> Get approval

3. TRD CREATION
   ├─> Write TRD (technical perspective)
   ├─> Review with technical lead
   └─> Get approval

4. IMPLEMENTATION
   ├─> Create feature branch
   ├─> Follow TRD implementation plan
   ├─> Write tests per TRD strategy
   └─> Submit PR

5. REVIEW & DEPLOY
   ├─> Code review
   ├─> QA testing
   ├─> Follow TRD deployment plan
   └─> Monitor metrics from PRD

6. POST-LAUNCH
   ├─> Track success metrics
   ├─> Gather user feedback
   └─> Update docs if needed
```

---

## 📊 Status Legend

### PRD/TRD Status Values

| Status | Emoji | Meaning |
|--------|-------|---------|
| Draft | 📝 | Being written |
| Review | 👀 | Ready for review |
| Approved | ✅ | Approved for next step |
| In Progress | 🚧 | Being implemented |
| Completed | ✔️ | Feature shipped |
| Rejected | ❌ | Not moving forward |
| On Hold | ⏸️ | Paused temporarily |

---

## 🎯 Priority Levels

| Priority | Description | SLA |
|----------|-------------|-----|
| **Critical** | Blocking users, data loss, security | Immediate |
| **High** | Important feature, high user value | 1-2 weeks |
| **Medium** | Nice to have, quality of life | 3-4 weeks |
| **Low** | Future enhancement, minimal impact | No timeline |

---

## 📚 Examples

### Example PRD (Minimal)
```markdown
# PRD-001: Example Document

**Status**: ✅ Approved
**Priority**: High

## Overview
Auto-create example reading on first app load.

## Problem Statement
New users see empty dashboard, don't understand app.

## Requirements
- FR-1: Create example reading if localStorage empty
- FR-2: Example showcases all markdown features
- FR-3: User can delete example

## Success Criteria
- 80%+ new users view example
- 50%+ create own reading after viewing
```

### Example TRD (Minimal)
```markdown
# TRD-001: Example Document Implementation

**Related PRD**: [PRD-001](../prd/PRD-001-example-document.md)

## Data Model
```typescript
const EXAMPLE_READING: Reading = {
  id: 'example-reading-v1',
  title: 'Welcome to tellingQuote',
  content: EXAMPLE_MARKDOWN
}
```

## Implementation
1. Check if readings array empty on mount
2. If empty, add EXAMPLE_READING
3. Store flag: exampleDismissed = false

## Testing
- Unit: Test reading creation logic
- E2E: Verify example appears on first visit
```

---

## 🔍 Best Practices

### PRD Best Practices

✅ **DO**:
- Focus on user value and problems
- Include user stories
- Define clear success metrics
- Specify what's out of scope
- Use simple, non-technical language
- Include mockups when helpful

❌ **DON'T**:
- Specify technical implementation
- Include code samples
- Dictate architecture decisions
- Skip the "why" explanation
- Leave success metrics vague

### TRD Best Practices

✅ **DO**:
- Include architecture diagrams
- Define data models precisely
- Plan for rollback scenarios
- Consider performance impact
- Document security implications
- Break into atomic tasks

❌ **DON'T**:
- Skip the testing strategy
- Ignore edge cases
- Forget about backward compatibility
- Leave deployment plan vague
- Over-engineer simple features

---

## 🤝 Collaboration

### Who Writes What?

| Role | Writes | Reviews |
|------|--------|---------|
| **Product Manager** | PRD | TRD |
| **Tech Lead** | TRD | PRD, TRD |
| **Developer** | TRD | PRD |
| **Designer** | Contributes to PRD | PRD |
| **QA** | Testing section in TRD | PRD, TRD |

### Review Process

1. **PRD Review**:
   - Product team reviews first
   - Tech lead reviews for feasibility
   - Designers review for UX
   - Stakeholders approve

2. **TRD Review**:
   - Tech lead reviews architecture
   - Senior developers review implementation
   - QA reviews testing strategy
   - Security reviews if needed

---

## 📖 Templates

Templates are available:
- [PRD Template](./prd/TEMPLATE.md)
- [TRD Template](./trd/TEMPLATE.md)

Copy and customize for your feature!

---

## 🆘 FAQ

**Q: Do I need both PRD and TRD?**  
A: For complex features, yes. For simple changes, a good PR description may suffice.

**Q: Can I update a PRD after approval?**  
A: Yes, but document changes and get re-approval if scope changes significantly.

**Q: What if requirements change during implementation?**  
A: Update the TRD and PRD, mark as updated, and note what changed.

**Q: How detailed should a PRD be?**  
A: Detailed enough to answer "what" and "why", but not "how".

**Q: Can multiple TRDs reference one PRD?**  
A: Yes! Large features can be split into multiple implementation phases.

---

## 📞 Need Help?

- Review existing PRDs/TRDs for examples
- Ask in team chat
- Reach out to tech lead for guidance
- Reference this guide

---

**Last Updated**: November 20, 2025  
**Version**: 1.0
