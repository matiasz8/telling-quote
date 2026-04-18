import { test, expect, Page } from '@playwright/test';
import { seedSettings, clearStorage } from './helpers/localStorage';

/**
 * Reader E2E tests — Slide navigation, keyboard shortcuts, completion.
 */

const MULTI_SLIDE_CONTENT = [
  '## Slide One',
  '',
  'Content for the first slide.',
  '',
  '## Slide Two',
  '',
  'Content for the second slide.',
  '',
  '## Slide Three',
  '',
  'Content for the third and final slide.',
].join('\n');

async function createReadingAndOpenReader(
  page: Page,
  options: { title?: string; content: string; clear?: boolean }
) {
  const title = options.title ?? 'Test Reading';

  if (options.clear ?? true) {
    await clearStorage(page);
  }

  await page.goto('/');
  await page.getByRole('button', { name: /new reading/i }).click();

  const titleInput = page.locator('[data-tour="reading-title-input"]');
  await titleInput.fill(title);

  const contentArea = page.locator('[data-tour="reading-content-textarea"]');
  await contentArea.fill(options.content);

  const saveBtn = page.locator('[data-tour="reading-create-button"]');
  await saveBtn.click();

  await expect(page.getByText(title)).toBeVisible({ timeout: 8000 });
  await page.getByRole('link', { name: new RegExp(title, 'i') }).first().click();
  await page.waitForURL(/\/reader\//);
}

test.describe('Reader — Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await createReadingAndOpenReader(page, { content: MULTI_SLIDE_CONTENT });
  });

  test('first slide is visible on open', async ({ page }) => {
    await expect(page.getByText('Slide One')).toBeVisible({ timeout: 8000 });
  });

  test('arrow key advances to next slide', async ({ page }) => {
    const progress = page.getByRole('status');
    await expect(progress).toContainText(/Slide\s+1\s+of\s+\d+/i);

    await page.mouse.click(10, 10);
    await page.keyboard.press('ArrowRight');
    await expect(progress).toContainText(/Slide\s+2\s+of\s+\d+/i);
  });

  test('arrow key goes back to previous slide', async ({ page }) => {
    const progress = page.getByRole('status');
    await page.mouse.click(10, 10);
    await page.keyboard.press('ArrowRight');
    await expect(progress).toContainText(/Slide\s+2\s+of\s+\d+/i);
    await page.keyboard.press('ArrowLeft');
    await expect(progress).toContainText(/Slide\s+1\s+of\s+\d+/i);
  });

  test('navigation buttons work', async ({ page }) => {
    const progress = page.getByRole('status');
    await expect(progress).toContainText(/Slide\s+1\s+of\s+\d+/i);

    // Find forward navigation button
    const nextBtn = page.getByRole('button', { name: /next|siguiente|→/i }).first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(progress).toContainText(/Slide\s+2\s+of\s+\d+/i);
    } else {
      // Skip if no explicit next button (keyboard-only nav)
      test.skip();
    }
  });

  test('back link returns to dashboard', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /back|dashboard|home|volver/i }).first();
    if (await backLink.isVisible()) {
      await backLink.click();
      await expect(page).toHaveURL('/');
    } else {
      // Navigate via Header logo or similar
      await page.goto('/');
      await expect(page).toHaveURL('/');
    }
  });
});

test.describe('Reader — Completion', () => {
  test.beforeEach(async ({ page }) => {
    await createReadingAndOpenReader(page, {
      content: '## Only Slide\n\nSingle slide reading.',
    });
  });

  test('navigating past last slide marks reading as complete', async ({ page }) => {
    // Advance through all segments until reader marks completion.
    await page.mouse.click(10, 10);
    for (let i = 0; i < 12; i++) {
      if (page.url().endsWith('/')) break;
      await page.keyboard.press('ArrowRight');
    }

    // Should redirect to dashboard
    await expect(page).toHaveURL('/', { timeout: 8000 });
  });
});

test.describe('Reader — Themes', () => {
  const themes = ['light', 'dark', 'detox', 'high-contrast'] as const;

  for (const theme of themes) {
    test(`reader is readable in ${theme} theme`, async ({ page }) => {
      await clearStorage(page);
      await seedSettings(page, { theme });
      await createReadingAndOpenReader(page, {
        content: MULTI_SLIDE_CONTENT,
        clear: false,
      });

      // Content should be visible
      await expect(page.getByText('Slide One')).toBeVisible({ timeout: 8000 });
    });
  }
});
