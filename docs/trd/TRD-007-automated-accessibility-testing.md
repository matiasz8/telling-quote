# TRD-007: Automated Accessibility Testing & Validation

**Status:** ✔️ Completed  
**Created:** 2026-01-15  
**Last Updated:** 2026-04-24  
**Related PRD:** [PRD-007: Automated Accessibility Testing & Validation](../prd/PRD-007-automated-accessibility-testing.md)

---

## 1. Overview

This TRD defines the technical baseline used to validate accessibility quality through repeatable tooling, documentation governance, and CI-aligned checks. The implementation includes automated documentation/traceability validation in CI, plus local/manual accessibility verification workflows for UI behavior.

### Scope Delivered

- Repository-level documentation validation integrated in CI (`validate:docs` and `validate:traceability`).
- Operational guidance for accessibility checks via existing test tooling and PRD/TRD contracts.
- Metadata traceability model in `FEATURE_INDEX.json` enforced by script.

---

## 2. Related PRD

- [PRD-007: Automated Accessibility Testing & Validation](../prd/PRD-007-automated-accessibility-testing.md)
- [PRD-016: Delivery Reliability & Documentation Governance](../prd/PRD-016-delivery-reliability-doc-governance.md)

---

## 3. Technical Implementation

### 3.1 Validation Pipeline

- `npm run validate:docs` executes:
  - `scripts/validate-prd-trd.mjs`
  - `scripts/validate-traceability.mjs`
- The main CI workflow runs documentation checks as required gates alongside lint/type/build.

### 3.2 Traceability Contract

- `FEATURE_INDEX.json` is the source of truth for PRD/TRD linkage.
- Completed or in-progress features must declare both `trd_id` and `trd_link`.
- Validation fails when referenced PRD/TRD files are missing or mismatched by identifier.

### 3.3 Accessibility Validation Operating Mode

- Accessibility validation remains available through local/manual workflows.
- Playwright and axe checks are kept operational but are not currently enforced as blocking jobs in the main CI gate.

---

## 4. Testing Strategy

### Automated Checks

- Run `npm run validate:docs` in CI and locally before merge.
- Ensure `FEATURE_INDEX.json` remains consistent after PRD/TRD status changes.

### Manual/Local Accessibility Checks

- Run local accessibility test workflow when changing UI behavior.
- Verify core routes (dashboard, reader, settings, accessibility) and keyboard navigation.

### Acceptance Criteria

- Documentation and traceability checks pass in CI.
- PRD-007 status and links are internally consistent across PRD index and feature metadata.
- No broken PRD/TRD references remain.

---

## 5. Risks & Mitigations

- Risk: Accessibility regressions can bypass CI when checks are only local/manual.
  - Mitigation: Keep workflow documented, run targeted checks for UI changes, and track future reintroduction of automated CI gates.

- Risk: Metadata drift between PRD/TRD docs and `FEATURE_INDEX.json`.
  - Mitigation: Enforce `validate:traceability` on every PR.

---

## 6. Implementation Notes

- This TRD captures the implemented governance-aligned validation baseline.
- It does not expand CI scope beyond currently approved gates.
