import { test, expect } from '@playwright/test';
import { seedReading, seedSettings, clearStorage } from './helpers/localStorage';

/**
 * Settings E2E tests — Theme changes, font settings, modal accessibility.
 */

test.describe('Settings — Modal', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
  });

  test('settings icon opens modal', async ({ page }) => {
    // Look for settings button by aria-label or by icon
    const settingsBtn = page
      .getByRole('button', { name: /settings|configuración|ajustes/i })
      .first();
    await settingsBtn.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('settings modal closes on Escape', async ({ page }) => {
    const settingsBtn = page
      .getByRole('button', { name: /settings|configuración|ajustes/i })
      .first();
    await settingsBtn.click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  });

  test('settings modal has correct ARIA attributes', async ({ page }) => {
    const settingsBtn = page
      .getByRole('button', { name: /settings|configuración|ajustes/i })
      .first();
    await settingsBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby');
  });
});

test.describe('Settings — Theme Changes', () => {
  test.beforeEach(async ({ page }) => {
    await seedReading(page);
    await page.goto('/');

    const settingsBtn = page
      .getByRole('button', { name: /settings|configuración|ajustes/i })
      .first();
    await settingsBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('can switch to dark theme', async ({ page }) => {
    await page.getByRole('button', { name: /dark/i }).click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark-theme/, { timeout: 3000 });
  });

  test('can switch to detox theme', async ({ page }) => {
    await page.getByRole('button', { name: /detox/i }).click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/detox-theme/, { timeout: 3000 });
  });

  test('can switch to high-contrast theme', async ({ page }) => {
    await page.getByRole('button', { name: /high.?contrast/i }).click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/high-contrast-theme/, { timeout: 3000 });
  });

  test('can switch back to light theme', async ({ page }) => {
    // First go dark
    await page.getByRole('button', { name: /dark/i }).click();
    // Then back to light
    await page.getByRole('button', { name: /^light$/i }).click();

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark-theme/, { timeout: 3000 });
  });
});

test.describe('Settings — Persistence', () => {
  test('theme setting persists after page reload', async ({ page }) => {
    await seedSettings(page, { theme: 'dark' });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark-theme/, { timeout: 5000 });

    // Reload
    await page.reload();

    await expect(html).toHaveClass(/dark-theme/, { timeout: 5000 });
  });
});
