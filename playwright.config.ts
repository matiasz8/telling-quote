import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for tellingQuote E2E + Accessibility tests.
 * Runs against the local Next.js dev server (started automatically).
 *
 * Test suites:
 *  - e2e/        → Critical user journeys (dashboard, reader, modals)
 *  - e2e/a11y/   → Accessibility audits via axe-core (all themes)
 *  - e2e/visual/ → Visual snapshots per theme (baselines in e2e/snapshots/)
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in parallel across workers */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in source */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once on CI to reduce flakiness noise */
  retries: process.env.CI ? 1 : 0,

  /* Limit parallelism in CI to reduce resource contention */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter: HTML report + list in CI */
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'on-failure' }]],

  use: {
    /* Base URL for all tests */
    baseURL: 'http://localhost:3000',

    /* Capture screenshot and trace on failure for debugging */
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',

    /* Prefer chromium for consistency */
    ...devices['Desktop Chrome'],
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      /* Run all tests by default */
    },
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /a11y\/.*\.spec\.ts/,
    },
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual\/.*\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testMatch: /mobile\/.*\.spec\.ts/,
    },
  ],

  /* Start the Next.js dev server before running tests */
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
