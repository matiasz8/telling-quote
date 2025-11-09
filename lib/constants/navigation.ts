export const NAVIGATION_KEYS = {
  NEXT: ['ArrowRight', 'ArrowDown'] as string[],
  PREVIOUS: ['ArrowLeft', 'ArrowUp'] as string[],
  ESCAPE: 'Escape',
  ENTER: 'Enter',
} as const;

export const TOUCH_SWIPE_THRESHOLD = 50; // pixels

export const SCROLL_DEBOUNCE_TIME = 100; // milliseconds
