import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seedReading, seedSettings } from '../helpers/localStorage';

/**
 * Accessibility audit tests — Reader page, all themes.
 */

const THEMES = [
  { name: 'light' as const,         label: 'Light theme' },
  { name: 'dark' as const,          label: 'Dark theme' },
  { name: 'detox' as const,         label: 'Detox theme' },
  { name: 'high-contrast' as const, label: 'High-Contrast theme' },
];

const RICH_CONTENT = [
  '## Introduction',
  '',
  'This is **bold text** and _italic text_.',
  '',
  '## Code Example',
  '',
  '```javascript',
  'const greeting = "Hello, world!";',
  'console.log(greeting);',
  '```',
  '',
  '## List Section',
  '',
  '- Item one',
  '- Item two',
  '- Item three',
].join('\n');

for (const { name, label } of THEMES) {
  test(`Reader — ${label} has no critical axe violations`, async ({ page }) => {
    await seedReading(page, { content: RICH_CONTENT, id: `reader-a11y-${name}` });
    await seedSettings(page, { theme: name });
    await page.goto('/');

    // Navigate to reader
    await page.getByText('Test Reading').click();
    await page.waitForURL(/\/reader\//, { timeout: 10_000 });

    // Wait for slide to render
    await expect(page.getByText('Introduction')).toBeVisible({ timeout: 8_000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(`[a11y] Reader ${label} violations (${results.violations.length}):`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
      }
    }

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      criticalViolations,
      `Found ${criticalViolations.length} critical/serious violations in Reader ${label}:\n` +
        criticalViolations.map((v) => `  ${v.id}: ${v.description}`).join('\n')
    ).toHaveLength(0);
  });
}

test('Reader — keyboard navigation works without mouse', async ({ page }) => {
  await seedReading(page, {
    content: '## Slide 1\n\nContent.\n\n## Slide 2\n\nMore content.',
  });
  await page.goto('/');

  await page.getByText('Test Reading').click();
  await page.waitForURL(/\/reader\//);

  // Use keyboard to navigate slides
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('Slide 2')).toBeVisible({ timeout: 5000 });

  await page.keyboard.press('ArrowLeft');
  await expect(page.getByText('Slide 1')).toBeVisible({ timeout: 5000 });
});
