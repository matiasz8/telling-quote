import { Page } from '@playwright/test';

/**
 * Seed localStorage with a reading for testing.
 * Call before page.goto() so state is ready on load.
 */
export async function seedReading(
  page: Page,
  overrides: Partial<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  }> = {}
) {
  const reading = {
    id: overrides.id ?? 'test-reading-001',
    title: overrides.title ?? 'Test Reading',
    content:
      overrides.content ??
      '## Introduction\n\nThis is a test reading.\n\n## Section 2\n\nWith multiple slides.',
    tags: overrides.tags ?? [],
  };

  await page.context().addInitScript((r) => {
    localStorage.setItem('readings', JSON.stringify([r]));
    localStorage.setItem('completedReadings', JSON.stringify([]));
    localStorage.setItem('dashboardTab', JSON.stringify('active'));
    localStorage.setItem('exampleDismissed', 'true');
    localStorage.setItem('tutorial-completed', 'true');
    localStorage.setItem('tutorial-never-show', 'true');
  }, reading);

  return reading;
}

/**
 * Seed settings into localStorage before page load.
 */
export async function seedSettings(
  page: Page,
  settings: Partial<{
    theme: 'light' | 'dark' | 'detox' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large' | 'xl';
  }> = {}
) {
  const defaults = {
    theme: 'light',
    fontSize: 'medium',
    accessibility: {
      fontFamily: 'serif',
      letterSpacing: 'normal',
      lineHeight: 'normal',
      wordSpacing: 'normal',
      reduceMotion: false,
      contentWidth: 'medium',
    },
    autoAdvance: { enabled: false, wpm: 200, autoStart: false, showProgress: true },
    tts: { enabled: false, voice: '', rate: 1.0, autoPlay: false, highlightText: true, skipCode: true },
  };

  await page.context().addInitScript((s) => {
    localStorage.setItem('settings', JSON.stringify(s));
    localStorage.setItem('tutorial-completed', 'true');
    localStorage.setItem('tutorial-never-show', 'true');
  }, { ...defaults, ...settings });
}

/**
 * Clear all localStorage to start from a clean state.
 */
export async function clearStorage(page: Page) {
  await page.context().addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('completedReadings', JSON.stringify([]));
    localStorage.setItem('dashboardTab', JSON.stringify('active'));
    localStorage.setItem('tutorial-completed', 'true');
    localStorage.setItem('tutorial-never-show', 'true');
  });
}
