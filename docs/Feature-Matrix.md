# Feature Matrix

Quick reference guide showing all implemented features, the problems they solve, and who benefits from them.

---

## All Features

| Feature         | Problem Solved                                                                     | Status       | Primary Personas | Related PRD/TRD |
|-----------------|------------------------------------------------------------------------------------|--------------|------------------|-----------------|
| **Tags System** | Organize many readings by topic/category without relying only on completion status | ✅ Completed | Student, Content Creator, Knowledge Worker | [PRD-002](prd/PRD-002-tags-system.md), [TRD-002](trd/TRD-002-tags-system.md) |
| **Onboarding Tutorial** | First-time users don't know keyboard shortcuts or UI location; reduce learning curve | ✅ Completed | All new users | [PRD-010](prd/PRD-010-onboarding-tutorial.md), [TRD-010](trd/TRD-010-onboarding-tutorial.md) |
| **Text-to-Speech** | Users with visual impairments or preference for audio can consume content; supports multitasking | ✅ Completed | Visually impaired, Multitaskers, Language learners | [PRD-013](prd/PRD-013-text-to-speech.md) |
| **Firebase Auth** | Users want cloud sync + trusted login; enable multi-device access and data persistence | ✅ Completed | All users (optional) | [PRD-005](prd/PRD-005-firebase-auth.md), [TRD-005](trd/TRD-005-firebase-auth.md) |
| **Accessibility Suite** | Users with dyslexia, motor disabilities, vision issues, ADHD cannot access content or find it uncomfortable | ✅ Completed | Dyslexic readers, Motor-impaired, Visually impaired, ADHD users | [PRD-004](prd/PRD-004-accessibility.md), [TRD-004](trd/TRD-004-accessibility.md) |
| **Spotlight Mode** | Long reading sessions cause eye strain and cognitive overload; users need to focus on one sentence at a time | ✅ Completed | Students with ADHD, Autistic readers, Focus-seekers | [PRD-009](prd/PRD-009-spotlight-mode.md), [TRD-009](trd/TRD-009-spotlight-mode.md) |
| **Auto-Advance Timer** | Users want hands-off reading at consistent pace; practice fluency and controlled pacing | ✅ Completed | Speed readers, ADHD users, Language learners, Students | [PRD-012](prd/PRD-012-auto-advance-timer.md), [TRD-012](trd/TRD-012-auto-advance-timer.md) |
| **Example Document** | New users see empty app; first-time experience confusing without sample content | ✅ Completed | First-time users | [PRD-001](prd/PRD-001-example-document.md) |
| **Reading Reactivation** | Users accidentally mark readings complete and want to resume; need undo/reactivation | ✅ Completed | All users | [PRD-014](prd/PRD-014-reading-reactivation.md) |
| **Theme System** | Users have different visual preferences and accessibility needs; one theme doesn't fit all | ✅ Completed | All users | Light/Dark/Detox/High-Contrast variants |

---

## Coming Features

| Feature                | Problem Solved | Status | Related PRD |
|------------------------|---|---|---|
| Enhanced Tag Filtering | Tags exist but no way to filter dashboard by tag | 📝 Draft | [PRD-006](prd/PRD-006-enhanced-tag-management.md) |
| Advanced Accessibility (Blind Users) | TTS covers audio but advanced voice navigation patterns not yet implemented | 📝 Draft | [PRD-008](prd/PRD-008-advanced-accessibility-blind-users.md) |
| Automated Accessibility Testing | Manual testing is slow; need automated checks for WCAG compliance | 📝 Draft | [PRD-007](prd/PRD-007-automated-accessibility-testing.md) |
| Internationalization | App is English-only; multilingual users cannot use effectively | 📝 Draft | [PRD-011](prd/PRD-011-internationalization.md) |
| Visual Regression Testing | Manual regression testing for UI changes is unreliable | 📝 Draft | [PRD-015](prd/PRD-015-visual-testing-playwright.md) |

---

## Legend

- **✅ Completed**: Feature is fully implemented and available to all users
- **📝 Draft**: Feature is planned; PRD is under development
- **Status**: Indicates implementation readiness (not user-facing)

---

## How to Use This Matrix

1. **Looking for a specific feature?** → Find it by name in the left column
2. **Solving a specific problem?** → Look at "Problem Solved" column to find relevant features
3. **Want deep details?** → Click the PRD/TRD link to read the full specification
4. **Need step-by-step workflow?** → See [Use Cases](use-cases/README.md) for detailed how-to guides
