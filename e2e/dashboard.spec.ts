import { test, expect, Page } from '@playwright/test';
import { seedSettings, clearStorage } from './helpers/localStorage';

/**
 * Dashboard E2E tests — Critical user journeys.
 * Covers: first load, reading cards, create modal, tabs, delete flow.
 */

async function createReadingViaUi(
  page: Page,
  options: { title?: string; content?: string } = {}
) {
  const title = options.title ?? 'Test Reading';
  const content =
    options.content ??
    '## Slide 1\n\nFirst slide content.\n\n## Slide 2\n\nSecond slide content.';

  await page.getByRole('button', { name: /new reading/i }).click();

  const titleInput = page.locator('[data-tour="reading-title-input"]');
  await titleInput.fill(title);

  const contentArea = page.locator('[data-tour="reading-content-textarea"]');
  await contentArea.fill(content);

  const saveBtn = page.locator('[data-tour="reading-create-button"]');
  await saveBtn.click();

  await expect(page.getByText(title)).toBeVisible({ timeout: 8000 });
}

test.describe('Dashboard — First Load', () => {
  test('loads dashboard actions when localStorage is empty', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');

    // Dashboard should render the primary action without crashing
    await expect(page.getByRole('button', { name: /new reading/i })).toBeVisible({ timeout: 8000 });
  });

  test('shows New Reading button', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await expect(page.getByRole('button', { name: /new reading/i })).toBeVisible();
  });

  test('page has correct title', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await expect(page).toHaveTitle(/tellingquote/i);
  });
});

test.describe('Dashboard — Reading Cards', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await createReadingViaUi(page);
  });

  test('renders seeded reading card with title', async ({ page }) => {
    await expect(page.getByText('Test Reading')).toBeVisible({ timeout: 8000 });
  });

  test('reading card is a link that navigates to reader', async ({ page }) => {
    const link = page.getByRole('link', { name: /test reading/i });
    await link.click();
    await expect(page).toHaveURL(/\/reader\//);
  });
});

test.describe('Dashboard — Active / Completed Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await createReadingViaUi(page);
  });

  test('Active tab shows seeded reading', async ({ page }) => {
    // Active tab should be default
    await expect(page.getByText('Test Reading')).toBeVisible({ timeout: 8000 });
  });

  test('Completed tab shows empty state when no completed readings', async ({ page }) => {
    const completedTabBtn = page.getByRole('button', { name: /completed/i });
    await completedTabBtn.click();
    // Should not show the seeded reading
    await expect(page.getByText('Test Reading')).not.toBeVisible();
  });
});

test.describe('Dashboard — New Reading Modal', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
  });

  test('opens modal on button click', async ({ page }) => {
    await page.getByRole('button', { name: /new reading/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('modal closes on Escape key', async ({ page }) => {
    await page.getByRole('button', { name: /new reading/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('shows validation error when saving empty content', async ({ page }) => {
    await page.getByRole('button', { name: /new reading/i }).click();

    // Fill title but leave content empty
    await page.locator('[data-tour="reading-title-input"]').fill('Test Title');

    // Click Save/Create button
    const saveBtn = page.locator('[data-tour="reading-create-button"]');
    await saveBtn.click();

    // Should show error
    await expect(page.getByText(/content|contenido/i)).toBeVisible();
  });

  test('creates reading and shows it in dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /new reading/i }).click();

    // Fill in the form
    const titleInput = page.locator('[data-tour="reading-title-input"]');
    await titleInput.fill('My New Test Reading');

    const contentArea = page.locator('[data-tour="reading-content-textarea"]');
    await contentArea.fill('## Slide 1\n\nFirst slide content.\n\n## Slide 2\n\nSecond slide.');

    // Save
    const saveBtn = page.locator('[data-tour="reading-create-button"]');
    await saveBtn.click();

    // Reading should appear on dashboard
    await expect(page.getByText('My New Test Reading')).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Dashboard — Delete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await createReadingViaUi(page);
  });

  test('delete button opens confirmation dialog', async ({ page }) => {
    // Hover card to reveal actions
    const card = page.locator('[data-tour="reading-card"]').first();
    await card.hover();

    const deleteBtn = page.getByRole('button', { name: /delete|eliminar/i }).first();
    await deleteBtn.click();

    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('cancel in delete dialog keeps reading', async ({ page }) => {
    const card = page.locator('[data-tour="reading-card"]').first();
    await card.hover();

    await page.getByRole('button', { name: /delete|eliminar/i }).first().click();

    await page.getByRole('button', { name: /cancel|cancelar/i }).click();

    // Reading should still be there
    await expect(page.getByText('Test Reading')).toBeVisible();
  });

  test('confirming delete removes reading from list', async ({ page }) => {
    const card = page.locator('[data-tour="reading-card"]').first();
    await card.hover();

    await page.getByRole('button', { name: /delete|eliminar/i }).first().click();

    // Confirm deletion
    await page.getByRole('button', { name: /confirm|delete reading|eliminar/i }).last().click();

    await expect(page.getByText('Test Reading')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Dashboard — Themes', () => {
  const themes = [
    { name: 'light', label: 'light theme' },
    { name: 'dark', label: 'dark theme' },
    { name: 'detox', label: 'detox theme' },
    { name: 'high-contrast', label: 'high-contrast theme' },
  ] as const;

  for (const { name } of themes) {
    test(`renders correctly in ${name} theme`, async ({ page }) => {
      await clearStorage(page);
      await seedSettings(page, { theme: name });
      await page.goto('/');
      await createReadingViaUi(page);

      // Page should load without errors
      await expect(page.getByRole('button', { name: /new reading/i })).toBeVisible({
        timeout: 8000,
      });

      // Theme class should be applied to root
      if (name !== 'light') {
        const html = page.locator('html');
        await expect(html).toHaveClass(new RegExp(`${name.replace('-', '-?')}-theme`));
      }
    });
  }
});
