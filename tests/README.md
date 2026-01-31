# Playwright Visual Testing Guide

## Overview
This project uses Playwright for **visual regression testing** of themes and UI components. This ensures that CSS changes don't accidentally break the appearance of different themes.

## What Gets Tested
- ✅ All 4 themes: light, dark, detox, high-contrast
- ✅ Home page appearance
- ✅ Reader page in normal mode
- ✅ Spotlight mode (critical for theme consistency)
- ✅ Special elements: code blocks, tables, checkboxes

## Quick Start

### 1. First Time: Generate Baseline Screenshots
```bash
npm run test:visual:update
```
This creates "golden" screenshots for all themes. Review them to ensure they look correct.

### 2. After Making CSS Changes: Check for Visual Regressions
```bash
npm run test:visual
```
Playwright compares current appearance with the baseline screenshots.

**If tests PASS**: ✅ Your changes didn't break any theme visually
**If tests FAIL**: ⚠️ Visual differences detected - review the report

### 3. Review Visual Differences
```bash
npm run test:visual:report
```
Opens an HTML report showing:
- Which tests failed
- Side-by-side comparison (expected vs actual)
- Diff highlighting exact pixel changes

### 4. Approve New Visuals (if intentional changes)
```bash
npm run test:visual:update
```
Updates the baseline screenshots with the new appearance.

## Typical Workflow

### Scenario: You change spotlight gradient colors
```bash
# 1. Make CSS changes
# Edit app/globals.css

# 2. Run visual tests
npm run test:visual

# 3. Tests fail (expected - you changed colors)
# Open report to see the differences
npm run test:visual:report

# 4. Review each diff image
# - Light theme spotlight: gradient looks correct ✅
# - Dark theme spotlight: gradient looks correct ✅
# - Detox theme spotlight: gradient looks correct ✅
# - High-contrast theme: uh oh, colors appeared ❌

# 5. Fix the high-contrast issue
# Edit CSS to remove unwanted colors

# 6. Re-run tests
npm run test:visual

# 7. All tests pass now ✅
# Update baselines
npm run test:visual:update

# 8. Commit updated screenshots
git add tests/visual/*.spec.ts-snapshots/
git commit -m "test: update visual baselines after spotlight refinement"
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run test:visual` | Run visual tests, compare with baseline |
| `npm run test:visual:update` | Update baseline screenshots |
| `npm run test:visual:ui` | Interactive UI mode (great for debugging) |
| `npm run test:visual:report` | View HTML report of last test run |

## What Gets Saved

```
tests/
├── visual/
│   ├── themes.spec.ts              # Test definitions
│   ├── spotlight.spec.ts           # Spotlight-specific tests
│   └── themes.spec.ts-snapshots/   # 📸 Baseline screenshots (committed to git)
│       ├── home-light-chromium.png
│       ├── home-dark-chromium.png
│       ├── spotlight-high-contrast-start-chromium.png
│       └── ... (24+ screenshots)
```

**Note**: Screenshot files ARE committed to git so everyone has the same baseline.

## Tips

### When to Update Baselines
- ✅ After intentional design changes
- ✅ When you've verified the new appearance is correct
- ❌ Don't update just to make tests pass - review diffs first!

### Debugging Failed Tests
```bash
# Interactive mode - see browser in action
npm run test:visual:ui

# Run only one theme
npx playwright test --grep "light theme"

# Run only spotlight tests
npx playwright test tests/visual/spotlight.spec.ts
```

### Tolerance Settings
Tests allow up to 150 pixels of difference (handles font rendering variations). To adjust:
```typescript
// In test files, change:
maxDiffPixels: 150  // More lenient
maxDiffPixels: 50   // Stricter
```

## CI Integration (Future)
Can be added to GitHub Actions to automatically catch visual regressions in PRs:
```yaml
- name: Run visual tests
  run: npm run test:visual
```

## Benefits for Your Workflow
1. **No more manual re-testing**: Playwright tests all 4 themes in ~60 seconds
2. **Catch issues early**: Sees problems you might miss (e.g., one theme broken)
3. **Confidence**: Know exactly what changed visually
4. **Documentation**: Screenshots serve as visual documentation of each theme
