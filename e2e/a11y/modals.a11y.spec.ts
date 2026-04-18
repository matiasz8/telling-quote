import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { clearStorage, seedReading } from '../helpers/localStorage';

/**
 * Accessibility audit tests — All modals.
 * Validates aria-modal, focus trap, keyboard dismissal, and axe-core.
 */

test.describe('Modals — New Reading Modal', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await page.getByRole('button', { name: /new reading/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('has no critical axe violations when open', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      critical,
      critical.map((v) => `  ${v.id}: ${v.description}`).join('\n')
    ).toHaveLength(0);
  });

  test('focus is trapped inside modal', async ({ page }) => {
    // Tab through all focusable elements and confirm focus stays in modal
    const dialog = page.getByRole('dialog');
    const focusedTags: string[] = [];

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const isInsideDialog = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(document.activeElement) ?? false;
      });
      focusedTags.push(String(isInsideDialog));
    }

    // All focused elements should be inside dialog
    expect(focusedTags.every((v) => v === 'true')).toBe(true);
    await expect(dialog).toBeVisible(); // Modal still open
  });

  test('Escape closes modal', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe('Modals — Delete Confirmation Modal', () => {
  test.beforeEach(async ({ page }) => {
    await seedReading(page);
    await page.goto('/');

    const card = page.locator('[data-tour="reading-card"]').first();
    await card.hover();
    await page.getByRole('button', { name: /delete|eliminar/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('has no critical axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      critical,
      critical.map((v) => `  ${v.id}: ${v.description}`).join('\n')
    ).toHaveLength(0);
  });

  test('dialog has aria-labelledby pointing to title', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const labelledBy = await dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    // The title element referenced by aria-labelledby should exist
    const title = page.locator(`#${labelledBy}`);
    await expect(title).toBeAttached();
  });
});

test.describe('Modals — Settings Modal', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    const settingsBtn = page
      .getByRole('button', { name: /settings|configuración|ajustes/i })
      .first();
    await settingsBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('has no critical axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      critical,
      critical.map((v) => `  ${v.id}: ${v.description}`).join('\n')
    ).toHaveLength(0);
  });

  test('has aria-modal and aria-labelledby', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
