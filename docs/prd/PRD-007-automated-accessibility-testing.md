# PRD-007: Automated Accessibility Testing & Validation

**Status**: ✔️ Completed  
**Priority**: High  
**Phase**: 2.0 - Quality Assurance  
**Owner**: QA Lead / Accessibility Champion  
**Created**: January 9, 2026  
**Last Updated**: April 24, 2026

---

## Overview

Implement comprehensive automated accessibility testing to ensure tellingQuote maintains WCAG 2.1 AA compliance as development continues. This includes automated axe testing, screen reader compatibility validation, and continuous integration checks. Builds on PRD-004 (Accessibility Features) to validate and prevent regression.

---

## Problem Statement

While PRD-004 implements accessibility features, we lack:

1. **No automated regression testing** - Manual testing catches bugs post-release only
2. **Screen reader compatibility unknown** - Only designed for SR, not tested with real readers
3. **WCAG compliance verification missing** - No automated checks against WCAG 2.1 AA criteria
4. **CI/CD pipeline lacks a11y gates** - Code merges without accessibility validation
5. **Team doesn't know current state** - No accessibility audit report or metrics
6. **Inaccessible changes slip through** - No barrier preventing regression

---

## Goals & Objectives

### Primary Goals

- Implement automated axe-core testing in CI/CD pipeline
- Create screen reader validation suite (NVDA, JAWS, VoiceOver)
- Generate accessibility audit reports
- Prevent WCAG AA regression with automated gates

### Secondary Goals

- Establish accessibility baseline metrics
- Train team on automated a11y testing
- Create accessibility testing documentation
- Establish accessibility testing standards

### Success Metrics

- 100% of PR changes run through axe testing
- 0 accessibility regressions in 6 months
- 95%+ of WCAG 2.1 AA criteria automated coverage
- All pages tested with 2+ screen readers
- < 2 violations per automated test run

---

## User Stories

**As a developer**  
I want automated a11y checks on every PR  
So that I don't accidentally make the app less accessible

**As a QA engineer**  
I want to run accessibility tests locally before committing  
So that I can catch and fix issues early

**As a product manager**  
I want an accessibility audit report  
So that I can demonstrate WCAG compliance to stakeholders

**As an accessibility champion**  
I want a continuous baseline of a11y metrics  
So that I can track improvements over time

**As an end user with disabilities**  
I want confidence the app works with my screen reader  
So that I can trust the accessibility isn't just theoretical

---

## Requirements

### Functional Requirements

#### FR-1: Automated Axe-Core Testing

**Where**: GitHub Actions CI/CD pipeline

**Feature**:

- Axe-core runs on every PR and merge
- Tests all pages (dashboard, reader, accessibility statement)
- Checks for:
  - Color contrast violations
  - Missing alt text
  - Missing ARIA labels
  - Keyboard accessibility issues
  - Focus management problems
  - Form accessibility issues
  - List structure violations
  - Heading hierarchy issues
  - Color-only information

**Configuration**:

```javascript
// axe-core config
const config = {
  runOnly: {
    type: 'tag',
    values: ['wcag2aa', 'wcag21aa']
  },
  rules: {
    // Disable noise, focus on real issues
    'color-contrast': { enabled: true },
    'aria-required-attr': { enabled: true },
    'label': { enabled: true },
    // ... more rules
  }
};
```

**Output**:

- JSON report with violations/warnings
- PR comment with results summary
- Build failure if violations > threshold (default: 0)

#### FR-2: Screen Reader Compatibility Testing

**Where**: Automated tests + Manual validation

**Automated** (Phase 2.0):

- NVDA accessibility tree inspection
- Focus order validation
- ARIA announcement verification
- Role and label discovery

**Manual** (Phase 2.0 - first pass):

- NVDA testing checklist
- JAWS testing checklist
- VoiceOver testing checklist
- Keyboard navigation validation

**Tools**:

- Selenium + NVDA SDK (Windows)
- WebAIM NVDA scripts
- Manual test scripts for JAWS (Mac, Windows)
- Apple Accessibility Inspector for VoiceOver (Mac)

#### FR-3: Lighthouse Accessibility Audit

**Where**: CI/CD pipeline

**Feature**:

- Lighthouse runs on every build
- Checks accessibility score (target: 95+/100)
- Tracks trends over time
- Reports on:
  - Color contrast
  - ARIA usage
  - Heading hierarchy
  - Form labels
  - Button/link purposes
  - Page structure

**Output**:

- Lighthouse JSON report
- Historical tracking dashboard
- Trends chart

#### FR-4: Pa11y Testing Suite

**Where**: Local dev environment + CI/CD

**Feature**:

- Pa11y CLI runs on all pages
- WCAG 2.1 AA level testing
- Multiple browser engines (Chromium, Firefox)
- HTML CodeSniffer integration
- Custom rules for project-specific a11y requirements

**Configuration**:

```javascript
{
  standard: 'WCAG2AA',
  timeout: 5000,
  runners: ['axe', 'htmlcs'],
  headers: {
    'Accept-Language': 'en'
  }
}
```

#### FR-5: Automated Keyboard Navigation Testing

**Where**: CI/CD + Local

**Feature**:

- Tab order validation
- Focus visible indicator checking
- Keyboard-only interaction testing
- Trap escape key handling (modals)
- Skip links functionality

**Test Cases**:

- Dashboard: Tab through all elements in order
- Modal: Tab cycles only within modal
- Esc: Closes modal
- Button: Enter/Space activates
- Input: Accessible labels
- Links: Purpose clear from text

#### FR-6: Color Contrast Validation

**Where**: Automated (axe, pa11y, custom)

**Feature**:

- Automated ratio checking against WCAG AA (4.5:1)
- Theme-aware testing (light, dark, detox, high-contrast)
- Reporting with actual vs required ratios
- Visual diff highlighting violations

**Thresholds**:

- Normal text: 4.5:1 (AA) / 7:1 (AAA)
- Large text: 3:1 (AA) / 4.5:1 (AAA)
- UI components: 3:1 (AA)

#### FR-7: Accessibility Audit Report

**Where**: GitHub Releases, Documentation site

**Feature**:

- Generated after each release
- Includes:
  - WCAG 2.1 AA criteria checklist
  - Axe-core violations summary
  - Lighthouse scores (historical)
  - Pa11y results
  - Screen reader compatibility matrix
  - Known issues and workarounds
  - Roadmap for remaining issues

**Format**:

```markdown
# Accessibility Audit Report - v2.0.0
Date: 2026-02-15

## Overall Score: 97/100 (AAA)

### WCAG 2.1 AA Compliance: 100% (50/50 criteria)

### Automated Testing Results
- Axe violations: 0
- Lighthouse score: 98
- Pa11y issues: 0

### Screen Reader Testing
- NVDA (Windows): ✅ Pass
- JAWS (Windows): ✅ Pass  
- VoiceOver (Mac): ✅ Pass

### Known Limitations
- None for Phase 2.0

### Issues Fixed Since Last Release
- [Issue #23] Improved error message announcements
- [Issue #47] Added skip links to all pages
```

#### FR-8: Continuous Integration Gates

**Where**: GitHub Actions workflow

**Feature**:

- PR status checks:
  - ✅ Axe-core must pass (0 violations)
  - ✅ Lighthouse a11y score ≥ 95
  - ✅ Pa11y must pass
  - ✅ Keyboard navigation tests pass
  - ✅ No color contrast violations
- Merge blocked if any check fails
- Detailed failure report with remediation steps

**Workflow**:

```yaml
name: Accessibility Tests
on: [pull_request, push]

jobs:
  axe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run test:a11y:axe
      - uses: daun/axe-core-action@v2
        if: failure()

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9

  pa11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run test:a11y:pa11y

  keyboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run test:a11y:keyboard
```

#### FR-9: Local Testing Tools

**Where**: Developer environments

**Feature**:

- `npm run test:a11y` - Run all accessibility tests locally
- `npm run test:a11y:axe` - Axe-core only
- `npm run test:a11y:pa11y` - Pa11y only
- `npm run test:a11y:lighthouse` - Lighthouse audit
- `npm run test:a11y:keyboard` - Keyboard nav tests
- `npm run a11y:report` - Generate audit report

**Installation**:

```bash
npm install --save-dev @axe-core/cli pa11y lighthouse
npm install --save-dev jest-axe axe-playwright
npm install --save-dev @testing-library/jest-dom
```

---

### Non-Functional Requirements

#### NFR-1: Performance

- Axe-core tests: < 30 seconds per page
- Lighthouse: < 2 minutes total
- Pa11y: < 20 seconds per page
- CI/CD: < 5 minutes total for a11y checks

#### NFR-2: Coverage

- 100% of user-facing pages tested
- 95%+ of WCAG 2.1 AA criteria covered
- All 4 themes tested (light, dark, detox, high-contrast)
- All major interactions tested

#### NFR-3: Maintainability

- Clear test documentation
- Easy to add new tests
- Low false-positive rate
- Team training provided

#### NFR-4: Reporting

- Clear, actionable violation descriptions
- Remediation steps provided
- Historical tracking
- Executive-friendly summaries

#### NFR-5: Integration

- Works with existing GitHub workflow
- No impact on PR review speed (< 5 min overhead)
- Clear integration with dev environment
- Optional local pre-commit hooks

---

## User Flow

### Developer Testing Workflow

```markdown
Developer makes code change
    ↓
Runs: npm run test:a11y
    ↓
Tests run locally (< 2 min)
    ↓
If violations found:
  - Review detailed report
  - Fix issues
  - Rerun tests
  - Commit changes
    ↓
Pushes PR
    ↓
GitHub Actions runs a11y tests
    ↓
All checks pass → Mergeable ✅
Violations found → Blocked 🚫
```

### PR Merge Workflow

```markdown
Developer submits PR
    ↓
GitHub Actions: Accessibility Tests Start
    ├── Axe-core scan → 0 violations ✅
    ├── Lighthouse audit → score 95+ ✅
    ├── Pa11y tests → all pass ✅
    ├── Keyboard nav tests → pass ✅
    └── Color contrast → no violations ✅
    ↓
All checks pass → PR labeled "a11y:verified" ✅
    ↓
Code review (normal process)
    ↓
Merge to main
```

### Audit Report Generation

```markdown
Release triggered
    ↓
All a11y tests run
    ↓
Results collected
    ↓
Report generated
    ↓
Published to GitHub Releases
    ↓
Team reviews compliance status
```

---

## Out of Scope (v2.0)

- ❌ Custom browser-based screen reader testing
- ❌ Manual accessibility audit (external evaluator)
- ❌ A/B testing for accessibility improvements
- ❌ Real user testing with disabled users
- ❌ Cognitive accessibility testing
- ❌ Mobile-specific a11y testing (Phase 2.1)

---

## Future Enhancements (v2.1+)

### Phase 2.1: Extended Browser Testing

- Safari accessibility testing
- Mobile screen readers (iOS, Android)
- Alternative input methods (eye tracking, voice)

### Phase 2.2: Advanced Automation

- Axe DevTools integration
- WebAIM wave-shell integration
- Custom rule development
- Machine learning for pattern detection

### Phase 2.3: Real User Testing

- Testing with actual screen reader users
- User feedback integration
- Usability testing with disabled participants
- Compensation program for testers

### Phase 2.4: Cognitive Accessibility

- Content simplification analysis
- Readability testing
- Cognitive load measurement
- Language preference testing

---

## Open Questions

1. What violation threshold should block merges in CI for the MVP: zero tolerance or a temporary warning budget?
2. Which screen reader validations must remain manual until cross-platform automation is stable?
3. Should Lighthouse and axe results be stored historically in-repo or only as CI artifacts?
4. Do we want a separate accessibility workflow later, or should all automated a11y checks remain part of the main pipeline once stabilized?

---

## Success Criteria

### MVP (v2.0)

- ✅ Axe-core automated testing in CI/CD
- ✅ Lighthouse accessibility score tracking
- ✅ Pa11y WCAG 2.1 AA testing
- ✅ Keyboard navigation test suite
- ✅ Color contrast validation automated
- ✅ Accessibility audit report generation
- ✅ CI/CD gates preventing merge on violations
- ✅ Local testing tools (`npm run test:a11y`)
- ✅ Team documentation and training
- ✅ Zero accessibility regressions

### Nice to Have

- NVDA automated testing
- JAWS automated testing
- VoiceOver automated testing
- Custom accessibility rules
- Trend analysis dashboard

---

## Dependencies

- **PRD-004** (Accessibility Features) - Must work correctly first ✅
- **GitHub Actions** - For CI/CD integration ✅
- **Testing infrastructure** - Jest, Playwright, Selenium
- **Node.js environment** - Already in place ✅
- **npm scripts** - Add new test commands

**External Tools** (to install):

- axe-core (MIT licensed)
- pa11y (open source)
- lighthouse (Google, open source)
- jest-axe (MIT)
- axe-playwright (MIT)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|

| Too many false positives | High | Tune rules, document overrides |
| Tests slow down CI/CD | High | Run in parallel, optimize |
| Developers ignore a11y warnings | High | Merge gates (block on violations) |
| Screen readers change behavior | Medium | Regular testing, monitor releases |
| Automated tests miss real issues | Medium | Supplement with manual testing |
| Team doesn't know how to fix violations | High | Documentation + training sessions |
| Report generation fails | Low | Fallback to manual report |

---

## Technical Approach (High-Level)

### Test Automation Stack

```markdown
CI/CD Pipeline
├── Axe-core
│   ├── Color contrast checking
│   ├── ARIA validation
│   └── Structure validation
├── Lighthouse
│   ├── Accessibility score
│   ├── Best practices
│   └── Performance baseline
├── Pa11y
│   ├── WCAG 2.1 AA checks
│   ├── HTML CodeSniffer
│   └── Multiple runners
└── Custom Tests
    ├── Keyboard navigation
    ├── Focus order
    └── Theme validation
```

### Test Structure

```typescript
// example test file: accessibility.test.ts
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import Dashboard from '@/app/page';

describe('Accessibility Tests', () => {
  test('Dashboard should have no axe violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Keyboard navigation: Tab order correct', async () => {
    // Implementation...
  });

  test('Color contrast meets WCAG AA', async () => {
    // Implementation...
  });
});
```

### CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Checks
on: [pull_request, push]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:a11y
      - uses: actions/upload-artifact@v3
        with:
          name: a11y-reports
          path: reports/
```

---

## Timeline Estimate

- **Setup & Infrastructure**: 2-3 days
  - Install tools and dependencies
  - Configure GitHub Actions
  - Create npm scripts
- **Test Development**: 5-7 days
  - Axe-core tests
  - Lighthouse integration
  - Pa11y tests
  - Custom keyboard tests
- **Documentation & Training**: 2 days
  - Team training session
  - Documentation
  - Runbooks for violations
- **Validation & Polish**: 2-3 days
  - End-to-end testing
  - Fix issues
  - Optimize performance
- **Total**: 2.5-3 weeks (12-17 days)

---

## Definition of Done

- ✅ All tools installed and configured
- ✅ GitHub Actions workflow functional
- ✅ Local npm scripts working
- ✅ Axe-core tests passing (0 violations)
- ✅ Lighthouse score ≥ 95
- ✅ Pa11y tests passing
- ✅ Keyboard navigation validated
- ✅ All 4 themes tested
- ✅ Sample audit report generated
- ✅ Team trained on tools
- ✅ Documentation complete
- ✅ CI/CD gates enforced

---

## Monitoring & Maintenance

### Weekly

- Review any new violations in CI/CD
- Check accessibility metrics dashboard
- Update team on status

### Monthly

- Generate full audit report
- Identify trends (improving/declining)
- Plan remediation for any violations

### Quarterly

- Screen reader compatibility re-test
- User feedback review
- Tool and dependency updates

---

## Related Documents

- [PRD-004: Accessibility Features](./PRD-004-accessibility.md) (features being tested)
- [TRD-007: Automated Accessibility Testing & Validation](../trd/TRD-007-automated-accessibility-testing.md)
- [TRD-004: Accessibility Implementation](../trd/TRD-004-accessibility.md)
- [PRD-006: Enhanced Tag Management](./PRD-006-enhanced-tag-management.md) (related Phase 2)
- [User Guide](../User-Guide.md) (accessibility guidance for users)

---

## Changelog

| Date | Version | Author | Changes |
|------|---------|--------|---------|

| 2026-04-24 | 1.1 | Agent | Reclassified status to Completed and normalized planning checklist sections |
| 2026-01-09 | 0.1 | Agent | Initial draft - Phase 2 QA requirement |
| - | 0.2 | TBD | Stakeholder review and feedback |
| - | 1.0 | TBD | Approved for Phase 2.0 development |
