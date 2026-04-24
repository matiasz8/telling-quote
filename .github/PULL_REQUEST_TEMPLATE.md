# Pull Request

## 📋 Description

<!-- Briefly describe what this PR does and why it's needed -->

## 🔗 Traceability (REQUIRED)

<!-- All PRs must be linked to at least one PRD or TRD. Check FEATURE_INDEX.json for feature metadata. -->
- [ ] Related PRD: **PRD-XXX** (required if feature-related)
- [ ] Related TRD: **TRD-XXX** (required if feature-related)
- [ ] Issue #: (if bug fix)
- [ ] FEATURE_INDEX.json checked for affected components

## 🎯 Type of Change

<!-- Mark with an X the options that apply -->

- [ ] 🐛 Bug fix (fixes an issue)
- [ ] ✨ New feature (adds functionality)
- [ ] 💥 Breaking change (breaks backward compatibility)
- [ ] 📝 Documentation
- [ ] 🎨 UI/UX improvement
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Tests
- [ ] 🔧 Configuration
- [ ] ♿ Accessibility

## 📍 Requirement-to-Code Mapping (REQUIRED for features)

<!-- Map changed files to requirements in PRD/TRD. Use FEATURE_INDEX.json as reference. -->

If implementing PRD-XXX/TRD-XXX:
- [ ] FR-1 implemented in: `file.tsx` (lines: X-Y)
- [ ] FR-2 implemented in: `file.tsx` (lines: X-Y)
- [ ] NFR-1 verified: [describe]
- [ ] All files in affected_files list touched or justified why skipped

## 🧪 How Has This Been Tested?

<!-- Describe the tests performed. Reference TRD testing strategy if applicable. -->

- [ ] Tested in local development
- [ ] Tested in different browsers (Chrome, Firefox, Safari) if UI change
- [ ] Tested on mobile devices if UI change
- [ ] Tested with screen readers if accessibility-related
- [ ] Automated tests added/updated (if applicable)
- [ ] Firebase emulator used for cloud features (if applicable)
- [ ] No regressions in hotspots: dashboard, sync, TTS, settings (if touching those)

## 📸 Screenshots (if applicable)

<!-- Add screenshots or GIFs for visual changes -->

## ✅ Checklist

### Code Quality
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code in hard-to-understand areas
- [ ] My changes generate no new warnings (lint, type-check pass)

### Documentation & Traceability
- [ ] I have updated the corresponding documentation
- [ ] TRD/PRD checklists completed (if feature-related)
- [ ] Requirement-to-code mapping filled above
- [ ] I ran `npm run validate:docs` and fixed contract errors
- [ ] I ran Review Agent flow (`@copilot: Review PR for PRD-XXX / TRD-XXX`) for feature PRs
- [ ] I have updated CHANGELOG.md (if applicable)
- [ ] Docs will render correctly (no broken links)

### Testing & Verification
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] No regressions in critical paths (migration, sync, TTS, settings)
- [ ] Firebase rules validated locally (if cloud feature)
- [ ] Accessibility validated (if a11y-related)

### Merge Safety
- [ ] I have verified there are no merge conflicts
- [ ] I have rebased on latest main
- [ ] All CI checks pass (docs validation, lint, type-check, build)

## 🔍 Additional Notes

<!-- Any additional information reviewers should know -->

## 📚 References

<!-- Links to documentation, PRDs, designs, etc. -->
- FEATURE_INDEX.json: Check here for feature metadata and affected files
- PRD: docs/prd/PRD-XXX.md
- TRD: docs/trd/TRD-XXX.md
- Architecture: docs/Architecture-Overview.md
- Contributing: CONTRIBUTING.md (create if not exists)
