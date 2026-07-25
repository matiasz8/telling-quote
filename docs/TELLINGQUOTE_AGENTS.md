# tellingQuote Agent Contracts

**Project:** tellingQuote  
**Status:** Operational  
**Last Updated:** July 25, 2026

---

## Overview

This document defines specialized agents for tellingQuote development. These are **project-specific** (not NaNLABS shared agents).

**Why personal agents?**
- Avoid dependency on external tool skills
- Full context on PRD/TRD validation rules
- Customized for this project's workflow
- No external service calls or tracking

---

## Agents

### 1. Planning Agent (tellingQuote Edition)

**Purpose:** Convert PRD from draft → approved for implementation  
**Trigger:** User: "Plan PRD-019"  
**Input:** PRD file path + FEATURE_INDEX.json  

**Output:** Planning checklist with:
- Feature summary
- Completeness validation (Problem, Goals, Requirements, Success Metrics)
- Task breakdown by phase
- Effort estimates
- Go/No-Go recommendation

**Done When:**
- ✅ All required sections present
- ✅ Dependencies verified ready
- ✅ Effort estimated
- ✅ Both leads approve

---

### 2. Delivery Agent (tellingQuote Edition)

**Purpose:** Implement TRD + verify requirement traceability  
**Trigger:** User: "Review TRD-019 implementation"  
**Input:** Branch name, changed files, TRD file

**Output:** Delivery report with:
- Implementation checklist (each TRD step)
- Requirement-to-code map (FR-1 → files/lines)
- Test results
- Affected files audit
- Risk validation
- PR readiness

**Done When:**
- ✅ Every FR/NFR mapped to code
- ✅ All tests passing
- ✅ Hotspot regressions cleared
- ✅ Documentation updated

---

### 3. Review Agent (tellingQuote Edition)

**Purpose:** Code review + assess risk + validate traceability  
**Trigger:** PR opened with PRD/TRD tags  
**Input:** PR URL, FEATURE_INDEX.json, Delivery Report (if available)

**Output:** Review assessment with:
- Traceability validation (PR description, git diff)
- Requirement coverage %
- Risk assessment (high-risk files, hotspot regressions)
- Code quality (lint, types, tests)
- Final recommendation (APPROVE / REQUEST_CHANGES / BLOCK)

**Done When:**
- ✅ Requirement coverage ≥90%
- ✅ Hotspots assessed
- ✅ No blockers OR clear fix path
- ✅ Recommendation issued

---

## Key Hotspots (Auto-Check in Reviews)

When PR touches these files, automatic checks apply:

| File | Why Critical | Check |
|------|-------------|-------|
| `app/page.tsx` | Dashboard + migration logic | Manual test theme/settings apply correctly |
| `hooks/useReadingSync.ts` | Cloud sync critical path | Test with Firebase emulator (if Firebase) or Supabase (if migrated) |
| `hooks/useTTS.ts` | Speech synthesis state machine | Test voice loading + playback + pause/resume |
| `lib/firebase/firestore.ts` | Database writes | Verify no data loss in writes |
| `components/SettingsModal.tsx` | Accessibility settings | Test theme + font size + high contrast apply immediately |

---

## Documentation Validation Gate

**Rule:** Before opening PR for docs-heavy changes, run:

```bash
npm run validate:docs
```

**What it checks:**
- PRD structure: has Problem, Goals, Requirements, Success Metrics ✓
- TRD structure: has Related PRD, Implementation, Testing ✓
- No broken section references ✓
- Status = draft, planning, approved, in-progress, completed, or cancelled ✓

**Failure = PR blocked** (fix docs first, then re-test)

---

## Workflow: PRD → Implementation → Merge

```
Step 1: Planning Phase
├─ User: "Plan PRD-019"
├─ Planning Agent: outputs checklist
├─ Team: review + sign off
└─ Update: FEATURE_INDEX.json status=approved

Step 2: Branch & TRD
├─ Dev: create branch `feat/PRD-019-supabase-migration`
├─ Dev: write TRD-019, mark status=approved
└─ Update: FEATURE_INDEX.json trd_id=TRD-019

Step 3: Development
├─ Dev: implement TRD + test
├─ Dev: fill Delivery Report
├─ Delivery Agent: validate traceability locally
└─ Dev: fix any issues, push PR

Step 4: Code Review
├─ Reviewer: receives PR
├─ Review Agent: outputs assessment
├─ Reviewer: approves or requests changes
└─ Merge: once approved

Step 5: Post-Merge
├─ Update: FEATURE_INDEX.json status=completed
├─ Update: docs/prd/README.md, docs/trd/README.md
└─ Celebrate: Feature shipped! 🎉
```

---

## Important: Use Local Tools, Not NaNLABS Skills

**Do NOT invoke:**
- `nanlabs-planning`
- `nanlabs-task`
- `nanlabs-prd`
- `nanlabs-trd`
- `nanlabs-work-item`

**Why:** These are designed for NaNLABS client delivery, not personal projects.

**Instead:**
- Use this AGENTS.md guide
- Create/update custom agents in-repository or locally
- Copy output templates from this doc
- Adapt as needed for your workflow

---

## Success Example: PRD-019

**What was completed:**
1. ✅ Created PRD-019 with all required sections (Problem, Goals, Requirements, Success Metrics)
2. ✅ Created TRD-019 with implementation steps, testing strategy, deployment plan
3. ✅ Created SYNC_FAILURE_ANALYSIS.md (root cause analysis)
4. ✅ Both passed `npm run validate:docs`
5. ✅ Ready for Planning Agent review + approval

**Next steps:**
- [ ] Planning Agent validates
- [ ] Team signs off
- [ ] Dev branch created
- [ ] Implementation begins (Phase 1: Dual-write setup)

---

## Feedback Loop

After 5 PRs using these agents:
- [ ] Which outputs are most useful?
- [ ] Which are ignored or confusing?
- [ ] What information is missing?
- [ ] Iterate + refine contracts

---

## References

- **Delivery Guardrails:** `/docs/AGENTS.md` (governance framework)
- **PRD/TRD Guidelines:** `/docs/HOW-TO-PRD-TRD.md`
- **Feature Index:** `/FEATURE_INDEX.json`
- **Current Hotspots:** See table above
- **Validation Script:** `/scripts/validate-prd-trd.mjs`
