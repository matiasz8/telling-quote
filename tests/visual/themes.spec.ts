import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for theme consistency
 * Tests each theme on the home page and reader page
 */

const THEMES = ['light', 'dark', 'detox', 'high-contrast'] as const;

test.describe('Home Page - Theme Consistency', () => {
  for (const theme of THEMES) {
    test(`${theme} theme`, async ({ page }) => {
      await page.goto('/');
      
      // Apply theme via localStorage (simulating user selection)
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      // Wait for any fonts/resources to load
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await expect(page).toHaveScreenshot(`home-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
        // Allow small differences (antialiasing, font rendering)
        maxDiffPixels: 5000,
      });
    });
  }
});

test.describe('Reader Page - Theme Consistency', () => {
  for (const theme of THEMES) {
    test(`${theme} theme - normal reading mode`, async ({ page }) => {
      await page.goto('/');
      
      // Apply theme
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        settings.readingTransition = 'none';
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      // Navigate to example reading
      await page.click('[data-testid="reading-card"]');
      await page.waitForURL('/reader/*');
      await page.waitForLoadState('networkidle');
      
      // Take screenshots at different scroll positions
      await expect(page).toHaveScreenshot(`reader-${theme}-top.png`, {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
      
      // Scroll to middle
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(300);
      
      await expect(page).toHaveScreenshot(`reader-${theme}-middle.png`, {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
    });
  }
});
