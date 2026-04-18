# Documentation Validation Agent

**Purpose**: Validate that PRD/TRD docs and feature metadata remain synchronized and complete before implementation or merge.

**Status**: Active
**Owner**: Engineering

---

## Scope

This agent validates:

1. PRD/TRD structure (required sections depending on status)
2. PRD/TRD naming consistency
3. FEATURE_INDEX links and IDs
4. Draft vs completed strictness rules

---

## Commands

Run locally before creating PR:

```bash
npm run validate:docs
```

What it runs:

1. `node scripts/validate-prd-trd.mjs`
2. `node scripts/validate-traceability.mjs`

---

## Validation Rules

### Strict (must pass)

Applied to docs with status: `Completed`, `In Progress`, `Approved`.

- PRD must contain headings matching: Overview, Problem, Requirements, Success Metrics
- TRD must contain headings matching: Overview, Related PRD, Implementation, Testing
- Document title must include PRD-XXX or TRD-XXX prefix
- FEATURE_INDEX links must exist and match IDs

### Advisory (warning only)

Applied to draft docs.

- Missing required sections produce warnings, not blocking errors

---

## Output Contract

If pass:

```text
PRD/TRD validation passed (N PRDs, M TRDs checked).
Traceability validation passed for X features.
```

If fail:

```text
TRACEABILITY ERROR: <specific issue>
...
PRD/TRD validation failed.
```

---

## Usage in Workflow

1. Create/Update PRD and TRD
2. Update FEATURE_INDEX.json
3. Run `npm run validate:docs`
4. Fix all errors
5. Open PR with traceability mapping
