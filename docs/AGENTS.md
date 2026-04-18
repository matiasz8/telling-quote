# Agent Contracts & Delivery Guardrails

**Purpose**: Define strict input/output contracts for repository-specific agents to ensure consistent, traceable, and reliable feature delivery.

**Status**: Operational (Phase 1, Step 1-3 Implementation)  
**Last Updated**: 2026-04-17

---

## Overview

Three specialized agents work together to move features from PRD draft to production:

1. **Planning Agent** — Converts PRD into actionable task breakdown
2. **Delivery Agent** — Implements TRD with requirement traceability
3. **Review Agent** — Validates implementation and identifies risks
4. **Documentation Validation Agent** — Validates PRD/TRD + FEATURE_INDEX consistency

Each agent has strict input requirements, output templates, and done criteria. Agents are stateless; all context is passed explicitly via FEATURE_INDEX.json and linked docs.

---

## 1. Planning Agent

**Purpose**: Move a draft PRD from "Draft" → "Approved for Implementation"  
**Trigger**: User requests planning for PRD-XXX  
**Owner**: Product lead + Technical lead (human review required)

### Input Requirements

```yaml
# Minimal input
prd_id: "PRD-006"
prd_file: "docs/prd/PRD-006-enhanced-tag-management.md"

# Agent will fetch from:
# 1. FEATURE_INDEX.json (dependencies, phase, priority)
# 2. PRD file itself (problem, goals, requirements, success metrics)
# 3. Architecture-Overview.md (system context)
```

### Output Template

```markdown
# Planning Checklist: PRD-XXX

## Feature Summary
- Name: [from PRD]
- Phase: [from FEATURE_INDEX]
- Priority: [from FEATURE_INDEX]
- Dependencies: [list, check if ready]

## Completeness Gate (Must Pass)

### PRD Content Checklist
- [ ] Problem Statement: clear & specific
- [ ] Goals & Objectives: measurable
- [ ] User Stories: ≥3, realistic
- [ ] Functional Requirements: ≥5, detailed (FR-1, FR-2, etc.)
- [ ] Non-Functional Requirements: specified (NFR-1, NFR-2, etc.)
- [ ] Success Metrics: quantifiable (≥3)
- [ ] Out of Scope: explicitly defined
- [ ] Open Questions: addressed or documented

### Dependency Check
- [ ] All dependent PRDs are Completed (check FEATURE_INDEX)
- [ ] Blockers identified and logged
- [ ] No circular dependencies

### Risk Assessment
- [ ] High-risk areas identified from FEATURE_INDEX.risks
- [ ] Mitigation strategies proposed
- [ ] Technical lead sign-off on risks

## Task Breakdown (For TRD Author)

### Phase 1: Design (Effort: X hours)
- [ ] Task 1.1: [specific, actionable]
- [ ] Task 1.2: [specific, actionable]
- References: [TRD section], [Architecture doc]

### Phase 2: Implementation (Effort: Y hours)
- [ ] Task 2.1: [specific, actionable]
- [ ] Task 2.2: [specific, actionable]
- Affected Files: [list from FEATURE_INDEX or scan]

### Phase 3: Validation (Effort: Z hours)
- [ ] Task 3.1: [Test strategy from PRD]
- [ ] Task 3.2: [Deployment plan]

### Phase 4: Documentation (Effort: W hours)
- [ ] Task 4.1: Update FEATURE_INDEX.json when complete
- [ ] Task 4.2: Link TRD to this PRD
- [ ] Task 4.3: Update docs/prd/README.md status

## Estimated Total Effort
- Development: X+Y hours
- QA/Testing: Z hours
- Documentation: W hours
- **Total: N hours (~M days)**

## Go/No-Go Decision
- [ ] All checklist items pass
- [ ] Effort estimate accepted by team
- [ ] Technical lead approves
- [ ] Product lead approves

**Recommendation**: [READY FOR TRD] or [NEEDS REVISION: ...]
```

### Done Criteria

✅ All checklist items checked  
✅ Task breakdown is specific (actionable by one developer)  
✅ Effort estimates provided  
✅ Both product + technical lead have signed off  
✅ Dependencies verified as ready  
✅ PRD marked as "Approved" in docs/prd/README.md  
✅ FEATURE_INDEX.json updated with phase/effort metadata  

### Blocked If

❌ PRD has unfilled required sections  
❌ Dependencies not complete  
❌ Success metrics not quantifiable  
❌ High-risk areas unaddressed  

---

## 2. Delivery Agent

**Purpose**: Convert TRD into code + verified requirement traceability  
**Trigger**: TRD approved, branch created (e.g., `feat/PRD-006-tag-filtering`)  
**Owner**: Developer implementing feature

### Input Requirements

```yaml
# Minimal input
prd_id: "PRD-006"
trd_id: "TRD-006"
trd_file: "docs/trd/TRD-006-enhanced-tag-management.md"
changed_files: ["app/page.tsx", "components/Header.tsx"]
git_branch: "feat/PRD-006-tag-filtering"

# Agent will fetch from:
# 1. FEATURE_INDEX.json (affected_files, dependencies, risks)
# 2. TRD file (implementation plan, testing strategy, deployment plan)
# 3. Git diff (which files changed)
# 4. Architecture-Overview.md (system context)
```

### Output Template

```markdown
# Delivery Report: PRD-XXX / TRD-XXX

## Feature Summary
- Name: [from TRD]
- Implemented by: [developer]
- Branch: [branch name]
- Files Changed: [list]

## Implementation Checklist (From TRD Implementation Plan)

### Step 1: [TRD Implementation Step Name]
- [ ] Task 1.1: [completed?]
- [ ] Task 1.2: [completed?]
- Evidence: [files + lines]
- Status: ✅ DONE / ⚠️ PARTIAL / ❌ BLOCKED

### Step 2: [TRD Implementation Step Name]
- [ ] Task 2.1: [completed?]
- [ ] Task 2.2: [completed?]
- Evidence: [files + lines]
- Status: ✅ DONE / ⚠️ PARTIAL / ❌ BLOCKED

## Requirement-to-Code Traceability

### Functional Requirements (From TRD)

#### FR-1: [Requirement Name]
- **TRD Details**: [quote from TRD]
- **Implemented in**:
  - File: `components/Header.tsx` (lines 45-80)
  - Function: `handleTagFilter()`
  - Type: `types/index.ts` line 120
- **Verification**: [how to test]
- Status: ✅ COMPLETE

#### FR-2: [Requirement Name]
- **TRD Details**: [quote from TRD]
- **Implemented in**:
  - File: `app/page.tsx` (lines 200-250)
  - Hook: `useTagFilter()` in `hooks/useTagFilter.ts`
- **Verification**: [how to test]
- Status: ✅ COMPLETE

### Non-Functional Requirements

#### NFR-1: Performance (e.g., "Filter <100ms")
- **TRD Details**: [quote]
- **Verification Result**: [actual perf]
- Status: ✅ PASS / ⚠️ NEAR-LIMIT / ❌ FAIL

#### NFR-2: Accessibility
- **TRD Details**: [quote]
- **Verification Result**: [aria attributes, keyboard nav, etc.]
- Status: ✅ PASS

## Test Strategy Verification (From TRD)

### Unit Tests
- [ ] [Test 1 from TRD]: PASS
- [ ] [Test 2 from TRD]: PASS
- Coverage: X%

### Integration Tests
- [ ] [Test from TRD]: PASS
- Hotspot checks:
  - [ ] Dashboard still renders: PASS
  - [ ] Settings apply correctly: PASS
  - [ ] Sync with Cloud (if applicable): PASS
  - [ ] TTS behavior (if applicable): PASS

### E2E Tests (if applicable)
- [ ] [User flow from TRD]: PASS

## Affected Files Audit

**From FEATURE_INDEX.affected_files**:
- [x] `app/page.tsx` — [describe changes]
- [x] `components/Header.tsx` — [describe changes]
- [ ] `lib/utils/tagHelpers.ts` — [not needed, explain why or flag as missed]

**Files changed but NOT in affected_files list**:
- [x] `types/index.ts` — [explain why: new type needed]
- [x] `hooks/useTagFilter.ts` — [explain why: new hook]

## Documentation Updates

- [ ] TRD marked as "Completed" in docs/trd/README.md
- [ ] FEATURE_INDEX.json updated (status, last_updated, affected_files refined)
- [ ] docs/prd/README.md updated (PRD-XXX marked "Completed")
- [ ] CHANGELOG.md entry added
- [ ] Architecture-Overview.md updated if system design changed
- [ ] Code comments added for complex logic
- [ ] JSDoc / TypeScript docs complete

## Risk Validation (From FEATURE_INDEX.risks)

### [Risk 1 from FEATURE_INDEX]
- **Status**: ✅ MITIGATED / ⚠️ PRESENT / ❌ CRITICAL
- **Action Taken**: [describe]

### [Risk 2 from FEATURE_INDEX]
- **Status**: ✅ MITIGATED / ⚠️ PRESENT / ❌ CRITICAL
- **Action Taken**: [describe]

## Regression Testing (Hotspots)

Hotspots automatically checked based on files changed:

- [ ] Dashboard (reads from `app/page.tsx`?): Manual test or see E2E
- [ ] Firebase Sync (touches `useReadingSync`?): Tested with emulator
- [ ] Settings (touches `SettingsModal` or settings types?): Manual test theme/font
- [ ] TTS (touches `useTTS`?): Manual test voice loading and playback
- [ ] Accessibility (touches a11y features?): Manual screen reader test

## Deployment Plan (From TRD)

- [ ] Feature flag needed? NO / YES (disabled initially)
- [ ] Database migration needed? NO / YES (specify)
- [ ] Rollback plan clear? [describe from TRD]
- [ ] Monitoring in place? [for success metrics]

## PR Readiness

- [ ] All checklist items checked
- [ ] No failing lint/type-check warnings
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Requirement traceability complete
- [ ] Hotspot regressions cleared
- [ ] Documentation updated
- [ ] PR description links to this report

**Status**: ✅ READY TO MERGE / ⚠️ NEEDS REVISION / ❌ BLOCKED

## Blockers (if any)

1. [Describe blocker]: [action to unblock]
```

### Done Criteria

✅ Every FR/NFR from TRD is mapped to implemented files  
✅ All affected_files list is covered (or explained why skipped)  
✅ Test strategy from TRD is executed  
✅ Hotspot regressions checked  
✅ Documentation (FEATURE_INDEX.json, README, CHANGELOG) updated  
✅ No lint/type-check warnings  
✅ PR description includes traceability map  

### Blocked If

❌ Any FR/NFR in TRD not mapped to code  
❌ Test strategy shows failures  
❌ Hotspot regression detected  
❌ Lint/type-check warnings  
❌ Risk from FEATURE_INDEX unmitigated  

---

## 3. Review Agent

**Purpose**: Validate PR before merge; assess risk and coverage  
**Trigger**: PR opened with PRD/TRD tags  
**Owner**: Technical lead + code reviewer

### Input Requirements

```yaml
# Minimal input
pr_url: "https://github.com/matiasz8/telling-quote/pull/42"
prd_id: "PRD-006"
trd_id: "TRD-006"

# Agent will fetch from:
# 1. PR files and description (changed files, linked docs)
# 2. Delivery Report from previous agent (if available)
# 3. FEATURE_INDEX.json (affected_files, risks, dependencies)
# 4. Git diff (actual code changes)
```

### Output Template

```markdown
# Review Assessment: PRD-XXX / TRD-XXX (PR #NN)

## PR Summary
- Title: [PR title]
- Author: [developer]
- Files Changed: [count + list]
- Lines Added/Deleted: [numbers]
- Status: READY / NEEDS_REVISION / BLOCKED

## Traceability Validation

### PR Description Check
- [ ] PRD linked (PRD-XXX mentioned)?
- [ ] TRD linked (TRD-XXX mentioned)?
- [ ] Requirement-to-code map filled?
- [ ] All mandatory checklist items marked?

### Git Diff Review
- [ ] Changed files match affected_files from FEATURE_INDEX? [% match]
- [ ] No unexpected file modifications detected?
- [ ] Code style consistent with project?
- [ ] No dead code or debug logs?

## Requirement Coverage (From Delivery Report or PR)

### All FRs Traced?
- [ ] FR-1: [code reference] — COVERED / MISSING
- [ ] FR-2: [code reference] — COVERED / MISSING

### All NFRs Met?
- [ ] NFR-1: Performance — VERIFIED / NOT_TESTED
- [ ] NFR-2: Accessibility — VERIFIED / NOT_TESTED

**Coverage %**: X/Y requirements traced = [%]  
**Acceptable if ≥90%** (else request evidence)

## Risk Assessment (From FEATURE_INDEX)

### High-Risk Changes

| Risk | Files Affected | Severity | Mitigation |
|------|----------------|----------|-----------|
| [Risk 1] | [files] | 🔴 Critical | [test done?] |
| [Risk 2] | [files] | 🟠 High | [test done?] |

### Hotspot Regressions (Auto-check if PR touches these)

| Hotspot | Status | Evidence |
|---------|--------|----------|
| Dashboard (app/page.tsx modified?) | ✅ SAFE / ❌ RISKY | [test log] |
| Cloud Sync (useReadingSync modified?) | ✅ SAFE / ❌ RISKY | [test log] |
| TTS (useTTS modified?) | ✅ SAFE / ❌ RISKY | [test log] |
| Settings (SettingsModal modified?) | ✅ SAFE / ❌ RISKY | [test log] |

### Dependency Chain (From FEATURE_INDEX)

- Depends on: [PRD-001, PRD-002]
  - [ ] PRD-001 merged? YES / NO
  - [ ] PRD-002 merged? YES / NO
- Depended on by: [PRD-008]
  - Note: PRD-008 will need this merged first

## Code Quality Checks

- [ ] Lint passes? ✅ / ❌ [issues if any]
- [ ] Type-check passes? ✅ / ❌ [issues if any]
- [ ] Build succeeds? ✅ / ❌ [error if any]
- [ ] Test coverage acceptable (≥60%)? ✅ / ⚠️ / ❌
- [ ] No console.error/warn left in code? ✅ / ⚠️ [lines if any]
- [ ] No commented-out code? ✅ / ⚠️ [lines if any]

## Documentation Review

- [ ] FEATURE_INDEX.json updated correctly?
- [ ] CHANGELOG.md entry present and clear?
- [ ] JSDoc / TypeScript docs complete?
- [ ] No broken doc links?

## Testing Verification (From Delivery Report)

| Test Type | Status | Notes |
|-----------|--------|-------|
| Unit Tests | ✅ PASS / ❌ FAIL | [failures if any] |
| Integration Tests | ✅ PASS / ❌ FAIL | [failures if any] |
| E2E Tests | ✅ PASS / ❌ FAIL | [failures if any] |
| Manual (Firebase Emulator) | ✅ DONE / ⏳ PENDING | [if cloud feature] |
| Accessibility Check | ✅ DONE / ⏳ PENDING | [if a11y feature] |
| Hotspot Regression | ✅ PASS / ❌ FAIL | [specific failures] |

## Risk Summary

| Category | Status | Count |
|----------|--------|-------|
| Blockers (must fix) | 🔴 | [N] |
| Warnings (nice to fix) | 🟡 | [M] |
| Non-issues (inform only) | ℹ️ | [K] |

### Blocker Issues (if any)
1. [Issue]: [reason] → [action to fix]

### Warning Issues (if any)
1. [Issue]: [reason] → [suggestion]

## Final Recommendation

**Status**: ✅ APPROVE / 🟡 APPROVE_WITH_COMMENTS / ❌ REQUEST_CHANGES / 🚫 BLOCK_MERGE

**Justification**: [1-2 sentences on go/no-go decision]

**If REQUEST_CHANGES**:
1. [Specific action required]
2. [Specific action required]

Re-review after changes made.

**If BLOCK_MERGE**:
- [Critical issue]: [must be resolved]
- Estimated re-review: [X hours after fix]
```

### Done Criteria

✅ All traceability questions answered  
✅ All hotspots assessed  
✅ Requirement coverage ≥90%  
✅ No blockers OR blockers have clear fix path  
✅ Recommendation is APPROVE or APPROVE_WITH_COMMENTS  
✅ Test results summary provided  

### Blocked If

❌ Traceability <70% (FRs/NFRs unmapped)  
❌ Hotspot regression detected  
❌ Multiple test failures  
❌ High-risk mitigation not evident  
❌ Dependency chain broken (depends on incomplete feature)  

---

## Usage & Workflow

### Step 1: PRD Planning
```bash
# User: "Plan PRD-006 for implementation"
# Agent: Planning Agent runs, outputs planning checklist
# Humans: Review, sign off, mark PRD as "Approved"
# Update: FEATURE_INDEX.json status → "approved"
```

### Step 2: Branch & TRD
```bash
# Developer: Creates branch `feat/PRD-006-tag-filtering`
# Developer: Writes TRD-006, marks "Approved for Implementation"
# Update: FEATURE_INDEX.json trd_id → "TRD-006", status → "in-progress"
```

### Step 3: Development
```bash
# Developer: Implements TRD-006, fills in Delivery Report
# Developer: Runs Delivery Agent check locally, fixes issues
# Developer: Pushes PR with Delivery Report linked
```

### Step 4: Code Review
```bash
# Reviewer: Receives PR, Review Agent runs automatically
# Reviewer: Uses Review output to validate traceability & risks
# Reviewer: Approves or requests changes with specific reasons
# Merge: Once approved, PR merges to main
```

### Step 5: Post-Merge
```bash
# Update: FEATURE_INDEX.json status → "completed", last_updated
# Update: docs/prd/README.md, docs/trd/README.md status
# Celebrate: Feature shipped! 🎉
```

### Documentation Gate (Mandatory)
```bash
# Run before opening PR for documentation-heavy changes
npm run validate:docs

# Contract and failure examples
docs/agents/DOCUMENTATION_VALIDATION_AGENT.md
```

---

## References

- **FEATURE_INDEX.json**: Compact feature metadata (use this as context reference, not full docs)
- **docs/HOW-TO-PRD-TRD.md**: Official PRD/TRD writing guidelines
- **docs/Architecture-Overview.md**: System design and data models
- **PR Template**: `.github/PULL_REQUEST_TEMPLATE.md` (updated with traceability fields)
- **Hotspots to watch**:
  - [app/page.tsx](app/page.tsx#L201) — Dashboard + migration orchestration
  - [hooks/useReadingSync.ts](hooks/useReadingSync.ts#L25) — Cloud sync critical path
  - [hooks/useTTS.ts](hooks/useTTS.ts#L126) — Speech synthesis state machine
  - [components/SettingsModal.tsx](components/SettingsModal.tsx#L18) — Accessibility settings

---

## Agent Hosting & Evolution

**Current**: Agents are repository-specific; prompt-based via CLI or Copilot.  
**Future** (Phase 3): Promote stable agents to shared organizational skills in `~/.local/share/nanlabs/skills/`.

**Feedback Loop**: After 5 PRs using these agents, assess:
- Which checklists are most valuable?
- Which outputs are ignored or misunderstood?
- What information is missing?
- Iterate and refine contracts.
