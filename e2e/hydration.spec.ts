import { test, expect, Page } from '@playwright/test';

/**
 * Hydration E2E tests — the dashboard and the reader are server-rendered, but
 * their state comes from localStorage. If a component reads localStorage while
 * rendering, the first client render no longer matches the server HTML and
 * React reports a hydration error (#418) in the browser console.
 *
 * These tests load both routes with localStorage already populated (the state a
 * returning user always has) and assert the console stays clean.
 */

const HYDRATION_ERROR =
  /Minified React error #(418|423|425)|Hydration failed|hydrated but some attributes|did not match/i;

const READING = {
  id: 'hydration-reading',
  title: 'Hydration Reading',
  content:
    '## Slide One\n\nContent for the first slide.\n\n## Slide Two\n\nContent for the second slide.',
  tags: [],
  projectId: 'default-project',
};

/**
 * Populate localStorage before the first navigation, so the very first page
 * load already hydrates against persisted state.
 */
async function seedReturningUser(page: Page) {
  await page.context().addInitScript((reading) => {
    localStorage.setItem('readings', JSON.stringify([reading]));
    localStorage.setItem(
      'projects',
      JSON.stringify([
        { id: 'default-project', title: 'Mis Lecturas', description: '', tags: [] },
      ])
    );
    localStorage.setItem('completedReadings', JSON.stringify([]));
    localStorage.setItem('favoriteReadings', JSON.stringify([]));
    localStorage.setItem('dashboardFilter', JSON.stringify('active'));
    localStorage.setItem('exampleDismissed', 'true');
    localStorage.setItem('tutorial-completed', 'true');
    localStorage.setItem('tutorial-never-show', 'true');
    localStorage.setItem(
      'settings',
      JSON.stringify({
        theme: 'dark',
        fontSize: 'large',
        accessibility: {
          fontFamily: 'mono',
          letterSpacing: 'wide',
          lineHeight: 'relaxed',
          wordSpacing: 'normal',
          reduceMotion: true,
          contentWidth: 'wide',
        },
        autoAdvance: { enabled: false, wpm: 200, autoStart: false, showProgress: true },
        tts: { enabled: false, voice: '', rate: 1, autoPlay: false, highlightText: true, skipCode: true },
      })
    );
  }, READING);
}

function collectHydrationErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    if (HYDRATION_ERROR.test(error.message)) errors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && HYDRATION_ERROR.test(message.text())) {
      errors.push(message.text());
    }
  });

  return errors;
}

test.describe('Hydration', () => {
  test('dashboard loads without hydration errors for a returning user', async ({ page }) => {
    const errors = collectHydrationErrors(page);
    await seedReturningUser(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('reader loads without hydration errors', async ({ page }) => {
    const errors = collectHydrationErrors(page);
    await seedReturningUser(page);

    await page.goto(`/reader/${READING.id}`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/slide 1 of/i)).toBeVisible();

    expect(errors).toEqual([]);
  });
});
