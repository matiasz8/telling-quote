import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for spotlight mode across all themes
 * This is critical as spotlight has complex CSS with gradients, shadows, and theme-specific colors
 */

const THEMES = ['light', 'dark', 'detox', 'high-contrast'] as const;

test.describe('Spotlight Mode - Theme Consistency', () => {
  for (const theme of THEMES) {
    test(`${theme} theme - spotlight at start`, async ({ page }) => {
      await page.goto('/');
      
      // Configure theme + spotlight mode
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        settings.readingTransition = 'spotlight';
        settings.reduceMotion = true; // Disable animations for consistent screenshots
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      // Navigate to reader
      await page.click('[data-testid="reading-card"]');
      await page.waitForURL('/reader/*');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Wait for spotlight to initialize
      
      // Screenshot at first line
      await expect(page).toHaveScreenshot(`spotlight-${theme}-start.png`, {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
    });
    
    test(`${theme} theme - spotlight mid-reading`, async ({ page }) => {
      await page.goto('/');
      
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        settings.readingTransition = 'spotlight';
        settings.reduceMotion = true;
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      await page.click('[data-testid="reading-card"]');
      await page.waitForURL('/reader/*');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Navigate forward several lines
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
      }
      
      await expect(page).toHaveScreenshot(`spotlight-${theme}-mid.png`, {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
    });
    
    test(`${theme} theme - spotlight with code blocks`, async ({ page }) => {
      await page.goto('/');
      
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        settings.readingTransition = 'spotlight';
        settings.reduceMotion = true;
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      await page.click('[data-testid="reading-card"]');
      await page.waitForURL('/reader/*');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Find a code block (navigate until we hit one or timeout)
      let foundCode = false;
      for (let i = 0; i < 20; i++) {
        const hasCode = await page.evaluate(() => {
          const current = document.querySelector('.spotlight-content p, .spotlight-content pre');
          return current?.tagName === 'PRE';
        });
        
        if (hasCode) {
          foundCode = true;
          break;
        }
        
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
      }
      
      // Only take screenshot if we found a code block
      if (foundCode) {
        await expect(page).toHaveScreenshot(`spotlight-${theme}-code.png`, {
          animations: 'disabled',
          maxDiffPixels: 500,
        });
      }
    });
    
    test(`${theme} theme - spotlight finished state`, async ({ page }) => {
      await page.goto('/');
      
      await page.evaluate((themeName) => {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings.theme = themeName;
        settings.readingTransition = 'spotlight';
        settings.reduceMotion = true;
        localStorage.setItem('settings', JSON.stringify(settings));
        document.documentElement.className = `${themeName}-theme`;
      }, theme);
      
      await page.click('[data-testid="reading-card"]');
      await page.waitForURL('/reader/*');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Navigate to end
      await page.keyboard.press('End');
      await page.waitForTimeout(300);
      
      await expect(page).toHaveScreenshot(`spotlight-${theme}-finished.png`, {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
    });
  }
});

test.describe('Spotlight Mode - Interactive Elements', () => {
  test('high-contrast theme - tables and checkboxes', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      settings.theme = 'high-contrast';
      settings.readingTransition = 'spotlight';
      settings.reduceMotion = true;
      localStorage.setItem('settings', JSON.stringify(settings));
      document.documentElement.className = 'high-contrast-theme';
    });
    
    await page.click('[data-testid="reading-card"]');
    await page.waitForURL('/reader/*');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Find a table
    let foundTable = false;
    for (let i = 0; i < 30; i++) {
      const hasTable = await page.evaluate(() => {
        const current = document.querySelector('.spotlight-content table');
        return !!current;
      });
      
      if (hasTable) {
        foundTable = true;
        break;
      }
      
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
    }
    
    if (foundTable) {
      await expect(page).toHaveScreenshot('spotlight-high-contrast-table.png', {
        animations: 'disabled',
        maxDiffPixels: 500,
      });
    }
  });
});
