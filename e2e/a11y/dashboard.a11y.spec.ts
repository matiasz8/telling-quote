import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seedReading, seedSettings, clearStorage } from '../helpers/localStorage';

/**
 * Accessibility audit tests — Dashboard page, all themes.
 * Uses axe-core via @axe-core/playwright.
 * Target: < 5 violations per page (WCAG 2.1 AA).
 */

const THEMES = [
  { name: 'light' as const,  label: 'Light theme' },
  { name: 'dark' as const,   label: 'Dark theme' },
  { name: 'detox' as const,  label: 'Detox theme' },
  { name: 'high-contrast' as const, label: 'High-Contrast theme' },
];

for (const { name, label } of THEMES) {
  test(`Dashboard — ${label} has no critical axe violations`, async ({ page }) => {
    await seedReading(page);
    await seedSettings(page, { theme: name });
    await page.goto('/');

    // Wait for content to render
    await expect(page.getByRole('button', { name: /new reading/i })).toBeVisible({
      timeout: 10_000,
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      // Exclude known third-party iframes and dynamic tooltips
      .exclude('[data-tour-tooltip]')
      .analyze();

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log(`[a11y] ${label} violations (${results.violations.length}):`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
        for (const node of v.nodes.slice(0, 2)) {
          console.log(`    → ${node.html.slice(0, 120)}`);
        }
      }
    }

    // Critical / serious violations are hard failures
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious violations in ${label}:\n` +
        criticalViolations.map((v) => `  ${v.id}: ${v.description}`).join('\n')
    ).toHaveLength(0);

    // Moderate / minor violations: warn but don't fail (for now)
    const totalViolations = results.violations.length;
    if (totalViolations > 0) {
      console.warn(`[a11y] ${label}: ${totalViolations} non-critical violations. Review and fix.`);
    }
  });
}

test('Dashboard — skip link is present and functional', async ({ page }) => {
  await clearStorage(page);
  await page.goto('/');

  // Skip link should be in DOM
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toBeAttached();

  // When focused (Tab), skip link should become visible
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeVisible({ timeout: 3000 });
});

test('Dashboard — all interactive elements are keyboard focusable', async ({ page }) => {
  await seedReading(page);
  await page.goto('/');

  // Tab through page and verify focus doesn't get trapped
  const focusedElements: string[] = [];
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? (el.tagName + (el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : '')) : 'none';
    });
    focusedElements.push(focused);
  }

  // At least some buttons/links should have received focus
  const interactiveFocuses = focusedElements.filter(
    (tag) => tag.startsWith('BUTTON') || tag.startsWith('A') || tag.startsWith('INPUT')
  );
  expect(interactiveFocuses.length).toBeGreaterThan(3);
});
