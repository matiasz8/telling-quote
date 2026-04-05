# PRD-015: Visual Regression Testing with Playwright

**Status:** 📝 Draft  
**Priority:** Medium  
**Target Release:** v0.4.0  
**Created:** February 2, 2026  
**Last Updated:** February 2, 2026  
**Owner:** Development Team  
**Related PRDs:** PRD-003 (Detox Theme), PRD-004 (Accessibility), PRD-009 (Spotlight Mode)

---

## 1. Overview

### Purpose
Implement automated visual regression testing using Playwright to catch unintended visual changes across themes, components, and features. Reduce manual testing time and ensure visual consistency across all four theme variants.

### Background
The application has four distinct themes (Light, Dark, Detox, High-Contrast) with specific visual requirements. Manual visual testing is time-consuming, error-prone, and doesn't scale as features are added. We need automated screenshot-based testing to:

- Catch visual regressions before they reach production
- Validate theme-specific rules automatically
- Provide visual documentation of features
- Speed up development and review cycles

**Current Pain Points:**
- Manual testing of 4 themes × multiple pages = 30+ minutes per feature
- Visual bugs slip through code review
- Difficult to verify accessibility color requirements
- No visual baseline for comparison during PRs

### Goals
1. Reduce visual testing time by 80% through automation
2. Catch visual regressions in CI/CD pipeline
3. Provide visual documentation of all themes
4. Validate theme-specific color and contrast rules
5. Enable confident refactoring of CSS and components

---

## 2. Problem Statement

**Who:** Developers and QA engineers

**What:** Need automated visual testing to catch regressions and validate theme consistency

**Why:** Manual visual testing doesn't scale with multiple themes and growing features

**Impact:** Visual bugs reach production, development cycles are slower, refactoring is risky

---

## 3. User Stories

### As a Developer
- I want automated screenshot tests so I can catch visual regressions early
- I want visual baselines so I can compare my changes side-by-side
- I want theme validation so I don't accidentally break theme rules
- I want fast feedback so I can iterate quickly

### As a QA Engineer
- I want automated visual tests so I can focus on complex manual testing
- I want visual reports so I can quickly identify what changed
- I want baseline management so I can approve legitimate visual changes

### As a Reviewer
- I want visual diffs in PRs so I can see exactly what changed visually
- I want automated checks so I can trust visual changes are intentional

---

## 4. Requirements

### 4.1 Functional Requirements

#### FR-1: Playwright Setup
- Install and configure Playwright for visual testing
- Configure browsers (Chromium primary, optional Firefox/WebKit)
- Set up test environment with Next.js dev server
- Configure viewport sizes (desktop: 1280×720, mobile: 375×667)

#### FR-2: Snapshot Management
- Generate baseline screenshots for all test scenarios
- Store snapshots in version control
- Update snapshots when visual changes are intentional
- Compare current screenshots against baselines

#### FR-3: Theme Testing Coverage
**Required test scenarios per theme:**
- ✅ Home page (dashboard with reading cards)
- ✅ Reader page - top of content
- ✅ Reader page - middle of content
- ✅ Spotlight mode - start state
- ✅ Spotlight mode - middle state
- ✅ Spotlight mode - finished state

**Total coverage:** 4 themes × 6 scenarios = 24 base screenshots

#### FR-4: Component Testing
- Test `ReadingCard` component in all states (active, completed, example)
- Test navigation controls (prev, next, finish buttons)
- Test settings modal appearance
- Test theme-specific color rules

#### FR-5: Accessibility Validation
- Validate High-Contrast theme has no colors (pure black/white)
- Validate Detox theme is strictly monochrome (grayscale)
- Validate contrast ratios meet WCAG AA standards
- Test focus indicators are visible

#### FR-6: Test Commands
```bash
npm run test:visual              # Run all visual tests
npm run test:visual:update       # Update baseline snapshots
npm run test:visual:report       # Open HTML report with diffs
npm run test:visual:ui           # Interactive test UI
npm run test:visual:debug        # Debug mode with headed browser
```

#### FR-7: CI/CD Integration
- Run tests on pull requests automatically
- Upload test reports as artifacts
- Fail PRs if visual regressions detected (unless approved)
- Provide visual diff links in PR comments

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
- Test suite completes in under 2 minutes
- Screenshot comparison is deterministic (no flaky tests)
- Minimal storage overhead for snapshots (~10MB total)

#### NFR-2: Maintainability
- Clear test organization by feature/component
- Easy to add new test scenarios
- Self-documenting test names
- Inline documentation in test files

#### NFR-3: Reliability
- Tests are stable across environments
- No false positives from timing issues
- Proper wait conditions for dynamic content
- Screenshot anti-aliasing normalized

---

## 5. Technical Implementation

### 5.1 Technology Stack

**Core:**
- Playwright (v1.48+) - Browser automation and testing
- @playwright/test - Test runner with visual comparison
- Next.js test server - Running app during tests

**Why Playwright?**
- ✅ Built-in visual comparison with configurable thresholds
- ✅ Fast and reliable (powered by browser DevTools Protocol)
- ✅ Cross-browser support (Chromium, Firefox, WebKit)
- ✅ Excellent TypeScript support
- ✅ Interactive UI mode for debugging
- ✅ Automatic waiting and retry logic
- ✅ Screenshot diffing with HTML reports

**Alternatives Considered:**
- ❌ Percy: Expensive for small projects, external service dependency
- ❌ Chromatic: Requires Storybook setup, paid tiers
- ❌ Jest + Puppeteer: More setup, less features than Playwright
- ❌ Cypress: Slower, less reliable for visual testing

### 5.2 Project Structure

```
tests/
├── README.md                              # Visual testing guide
├── visual/
│   ├── spotlight.spec.ts                  # Spotlight mode tests (16 screenshots)
│   ├── themes.spec.ts                     # Theme consistency tests (8 screenshots)
│   └── components.spec.ts                 # (Future) Component tests
├── e2e/                                   # (Future) End-to-end tests
└── fixtures/
    └── test-data.ts                       # Shared test data

playwright.config.ts                       # Playwright configuration
```

### 5.3 Configuration

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    // Optional: Firefox, WebKit for cross-browser testing
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 5.4 Test Examples

**Theme Testing:**
```typescript
// tests/visual/themes.spec.ts
import { test, expect } from '@playwright/test';

const themes = ['light', 'dark', 'detox', 'high-contrast'];

for (const theme of themes) {
  test(`home page - ${theme} theme`, async ({ page }) => {
    await page.goto('/');
    await page.click(`[data-theme="${theme}"]`);
    await page.waitForTimeout(300); // Theme transition
    
    await expect(page).toHaveScreenshot(`home-${theme}.png`, {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });
}
```

**Spotlight Testing:**
```typescript
// tests/visual/spotlight.spec.ts
import { test, expect } from '@playwright/test';

test('spotlight mode - light theme - start', async ({ page }) => {
  await page.goto('/');
  
  // Set light theme
  await page.click('[data-theme="light"]');
  await page.waitForTimeout(300);
  
  // Open first reading
  await page.click('[data-testid="reading-card"]');
  await page.waitForLoadState('networkidle');
  
  // Verify on first slide (spotlight start)
  await expect(page).toHaveScreenshot('spotlight-light-start.png', {
    maxDiffPixels: 100,
    threshold: 0.2,
  });
});
```

### 5.5 Snapshot Storage

**Storage Strategy:**
```
tests/visual/
├── spotlight.spec.ts
└── spotlight.spec.ts-snapshots/
    ├── spotlight-light-start-chromium-linux.png
    ├── spotlight-light-mid-chromium-linux.png
    ├── spotlight-light-finished-chromium-linux.png
    ├── spotlight-dark-start-chromium-linux.png
    ├── spotlight-dark-mid-chromium-linux.png
    ├── spotlight-dark-finished-chromium-linux.png
    ├── spotlight-detox-start-chromium-linux.png
    ├── spotlight-detox-mid-chromium-linux.png
    ├── spotlight-detox-finished-chromium-linux.png
    ├── spotlight-high-contrast-start-chromium-linux.png
    ├── spotlight-high-contrast-mid-chromium-linux.png
    └── spotlight-high-contrast-finished-chromium-linux.png
```

**Naming Convention:**
- `{feature}-{theme}-{state}-{browser}-{os}.png`
- Example: `spotlight-dark-finished-chromium-linux.png`

### 5.6 Git Integration

**Add to .gitignore:**
```
# Playwright
/test-results/
/playwright-report/
/playwright/.cache/

# Keep snapshots in version control
!/tests/**/*-snapshots/
```

**Update .gitattributes:**
```
*.png binary
tests/**/*-snapshots/*.png -diff
```

### 5.7 CI/CD Pipeline

**GitHub Actions (.github/workflows/visual-tests.yml):**
```yaml
name: Visual Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      
      - name: Run visual tests
        run: npm run test:visual
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 6. Theme-Specific Visual Rules

### Light Theme
- **Background:** White (`#FFFFFF`)
- **Text:** Dark gray/black (`#1F2937`)
- **Spotlight glow:** Yellow (`#FDE047`)
- **Primary accent:** Orange (`#F97316`)

### Dark Theme  
- **Background:** Dark gray (`#1F2937`)
- **Text:** Light gray/white (`#F3F4F6`)
- **Spotlight glow:** Purple (`#A855F7`)
- **Primary accent:** Purple (`#8B5CF6`)

### Detox Theme
- **Background:** White (`#FFFFFF`)
- **Text:** Dark gray (`#374151`)
- **Spotlight glow:** Yellow (`#FDE047`)
- **Colors:** Strictly monochrome (grayscale only)
- **No accent colors** (except spotlight)

### High-Contrast Theme
- **Background:** Pure black (`#000000`)
- **Text:** Pure white (`#FFFFFF`)
- **Spotlight glow:** White (`#FFFFFF`)
- **Colors:** Zero colors except black/white
- **Borders:** 2px white borders on all interactive elements
- **Contrast ratio:** Minimum 21:1 (WCAG AAA)

---

## 7. Testing Workflow

### 7.1 Initial Setup
```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install chromium

# Generate initial baselines
npm run test:visual:update
```

### 7.2 Development Workflow
```bash
# 1. Make visual changes to CSS/components
# 2. Run tests to see failures
npm run test:visual

# 3. Review visual diffs
npm run test:visual:report

# 4. If changes are intentional, update baselines
npm run test:visual:update

# 5. Commit new snapshots
git add tests/**/*-snapshots/*.png
git commit -m "test: update visual baselines for theme changes"
```

### 7.3 PR Review Workflow
1. CI runs visual tests automatically
2. If failures: Review HTML report artifact
3. Approve changes or request fixes
4. Merge PR (baselines updated in repo)

---

## 8. Success Metrics

### Primary Metrics
- **Test coverage:** 24+ screenshots covering all themes and key features
- **Test execution time:** < 2 minutes for full suite
- **False positive rate:** < 5% (tests fail only on real visual changes)
- **Bug detection:** Catch 90%+ of visual regressions before production

### Secondary Metrics
- **Developer adoption:** 80%+ of PRs include visual tests
- **Time savings:** 30+ minutes saved per feature (vs manual testing)
- **Visual documentation:** Screenshots serve as theme reference guide

### KPIs
- Visual bugs in production: Reduce by 75%
- PR review time: Reduce by 20% (less back-and-forth on visuals)
- Theme consistency issues: Reduce to near zero

---

## 9. Testing Coverage Plan

### Phase 1: Core Pages (v0.4.0)
- ✅ Home page (all themes)
- ✅ Reader page (all themes, 2 scroll positions)
- ✅ Spotlight mode (all themes, 3 states: start/mid/finished)
- **Total:** 24 screenshots

### Phase 2: Components (v0.5.0)
- ReadingCard variations (active, completed, example badge)
- Navigation buttons (enabled, disabled, hover)
- Settings modal (all sections)
- Modals (confirm delete, edit title, keyboard shortcuts)
- **Estimated:** +16 screenshots

### Phase 3: Interactive Features (v0.6.0)
- Onboarding tutorial (all steps)
- Tag filtering
- Search functionality
- Accessibility settings changes
- **Estimated:** +12 screenshots

### Phase 4: Edge Cases (v0.7.0)
- Long content (scrolling)
- Empty states (no readings)
- Error states
- Loading states
- Mobile viewport
- **Estimated:** +10 screenshots

**Total eventual coverage:** ~60 screenshots

---

## 10. Best Practices

### 10.1 Writing Stable Tests
```typescript
// ✅ Good: Wait for specific condition
await page.waitForSelector('[data-testid="reading-card"]');
await page.waitForLoadState('networkidle');

// ❌ Bad: Arbitrary timeout
await page.waitForTimeout(1000);

// ✅ Good: Hide dynamic content
await page.addStyleTag({ 
  content: '.timestamp { visibility: hidden; }' 
});

// ✅ Good: Use data attributes for selectors
await page.click('[data-testid="theme-toggle"]');

// ❌ Bad: Brittle CSS selectors
await page.click('.button.primary.large');
```

### 10.2 Screenshot Configuration
```typescript
await expect(page).toHaveScreenshot('screenshot.png', {
  maxDiffPixels: 100,      // Allow up to 100 pixels difference
  threshold: 0.2,          // 20% pixel threshold for anti-aliasing
  animations: 'disabled',  // Disable CSS animations
  mask: [page.locator('.dynamic-timestamp')], // Hide timestamps
});
```

### 10.3 Test Organization
- One test file per feature/page
- Group related tests with `test.describe()`
- Use descriptive test names: `${feature} - ${theme} - ${state}`
- Share common setup in `beforeEach` hooks

---

## 11. Out of Scope

### Not Included
- **Functional/unit testing**: Use Jest + React Testing Library
- **API testing**: Use Supertest or Postman
- **Performance testing**: Use Lighthouse CI
- **Cross-browser testing**: Initially Chromium only (can add Firefox/WebKit later)
- **Mobile device testing**: Desktop viewport only initially
- **Video recording**: Screenshots only (video on failure optional)

### Future Enhancements
- Visual testing in multiple browsers (Firefox, WebKit)
- Mobile viewport testing (375×667, 414×896)
- Tablet viewport testing (768×1024)
- Percy or Chromatic integration for visual review UI
- Visual diff comments on PRs via GitHub bot
- Automatic baseline approval workflow

---

## 12. Open Questions

### Technical Questions
- **Q:** Should we test in multiple browsers or just Chromium?
  - **A:** Start with Chromium only, add Firefox/WebKit if needed

- **Q:** How do we handle dynamic timestamps/dates in screenshots?
  - **A:** Use CSS masking or mock dates in test environment

- **Q:** What's an acceptable threshold for pixel differences?
  - **A:** Start with 100 pixels + 20% threshold, tune based on experience

- **Q:** Should snapshots be in git or external storage?
  - **A:** Git for now (small size), move to LFS if it grows large

### Process Questions
- **Q:** Who approves visual baseline updates?
  - **A:** PR reviewer + original developer

- **Q:** Should visual tests run on every commit or just PRs?
  - **A:** PRs only to save CI time

- **Q:** How do we handle visual tests for experimental features?
  - **A:** Mark tests as `test.skip()` until feature is stable

---

## 13. Dependencies

### Packages
```json
{
  "devDependencies": {
    "@playwright/test": "^1.48.0"
  }
}
```

### System Requirements
- Node.js 18+
- Chromium browser (auto-installed by Playwright)
- 1GB disk space for snapshots and reports

---

## 14. Implementation Plan

### Phase 1: Setup (1 day)
- [ ] Install Playwright and dependencies
- [ ] Configure playwright.config.ts
- [ ] Set up npm scripts
- [ ] Update .gitignore

### Phase 2: Core Tests (2 days)
- [ ] Write theme tests (home page)
- [ ] Write reader page tests
- [ ] Write spotlight mode tests
- [ ] Generate baseline snapshots

### Phase 3: CI Integration (1 day)
- [ ] Set up GitHub Actions workflow
- [ ] Configure artifact uploads
- [ ] Test PR checks

### Phase 4: Documentation (1 day)
- [ ] Write tests/README.md
- [ ] Document workflow in main README
- [ ] Add examples and troubleshooting guide

**Total estimated effort:** 5 days

---

## 15. Risks & Mitigations

### Risk 1: Flaky Tests
**Impact:** High - False positives reduce trust  
**Mitigation:**
- Use proper wait conditions
- Disable animations
- Mock dynamic content
- Set appropriate thresholds

### Risk 2: Large Snapshot Size
**Impact:** Medium - Repo bloat  
**Mitigation:**
- Use compressed PNG format
- Consider Git LFS if > 50MB
- Limit screenshot count to essential tests

### Risk 3: CI Time Increase
**Impact:** Medium - Slower PR feedback  
**Mitigation:**
- Run tests in parallel
- Cache Playwright browsers
- Optimize viewport size (720p vs 1080p)

### Risk 4: Maintenance Burden
**Impact:** Medium - Tests break frequently  
**Mitigation:**
- Keep tests simple and focused
- Use data attributes for selectors
- Document test intent clearly

---

## 16. Rollback Plan

If visual testing proves problematic:

1. **Immediate:** Disable failing tests with `test.skip()`
2. **Short-term:** Remove from CI pipeline, keep locally
3. **Long-term:** Revert Playwright installation if unused for 2 sprints

**Rollback command:**
```bash
npm uninstall @playwright/test
git rm -r tests/ playwright.config.ts
```

---

## 17. Success Criteria

### Launch Checklist
- ✅ 24+ visual tests passing consistently
- ✅ < 2 minute test execution time
- ✅ < 5% false positive rate
- ✅ CI integration working on PRs
- ✅ Documentation complete
- ✅ Team trained on workflow

### Post-Launch (30 days)
- ✅ Zero visual bugs reached production
- ✅ 50%+ of PRs include visual tests
- ✅ 80%+ developer satisfaction with tool
- ✅ 3+ hours saved per week in manual testing

---

## 18. Related Documentation

- [Playwright Official Docs](https://playwright.dev/)
- [Visual Testing Guide](https://playwright.dev/docs/test-snapshots)
- [PRD-003: Detox Theme](./PRD-003-detox-theme.md)
- [PRD-004: Accessibility](./PRD-004-accessibility.md)
- [PRD-009: Spotlight Mode](./PRD-009-spotlight-mode.md)
- [TRD-009: Spotlight Technical Reference](../trd/TRD-009-spotlight-mode.md)

---

## Appendix A: Example Test File

```typescript
// tests/visual/spotlight.spec.ts
import { test, expect } from '@playwright/test';

const themes = ['light', 'dark', 'detox', 'high-contrast'];
const states = [
  { name: 'start', slide: 0 },
  { name: 'mid', slide: 5 },
  { name: 'finished', slide: 'last' }
];

for (const theme of themes) {
  for (const state of states) {
    test(`spotlight - ${theme} - ${state.name}`, async ({ page }) => {
      // Navigate to home
      await page.goto('/');
      
      // Set theme
      await page.click(`[data-theme="${theme}"]`);
      await page.waitForTimeout(300);
      
      // Open example reading
      await page.click('[data-testid="reading-card"]');
      await page.waitForLoadState('networkidle');
      
      // Navigate to specific slide
      if (state.slide === 'last') {
        await page.click('[aria-label="Finalizar lectura"]');
      } else if (state.slide > 0) {
        for (let i = 0; i < state.slide; i++) {
          await page.click('[aria-label="Siguiente"]');
          await page.waitForTimeout(300);
        }
      }
      
      // Take screenshot
      await expect(page).toHaveScreenshot(
        `spotlight-${theme}-${state.name}.png`,
        {
          maxDiffPixels: 100,
          threshold: 0.2,
          animations: 'disabled',
        }
      );
    });
  }
}
```

---

## Appendix B: Troubleshooting

### Issue: Tests fail with "Screenshot comparison failed"
**Solution:** Review HTML report to see visual diff. If legitimate change, update baseline:
```bash
npm run test:visual:update
```

### Issue: Tests timeout waiting for page load
**Solution:** Increase timeout in playwright.config.ts:
```typescript
timeout: 60000, // 60 seconds
```

### Issue: Snapshots look different on different machines
**Solution:** Run tests in Docker container for consistency:
```dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-jammy
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npm", "run", "test:visual"]
```

### Issue: Too many false positives
**Solution:** Increase `maxDiffPixels` and `threshold`:
```typescript
maxDiffPixels: 200,  // More tolerance
threshold: 0.3,      // 30% per pixel
```

---

**Document Version:** 1.0  
**Last Review:** February 2, 2026  
**Next Review:** March 2, 2026
