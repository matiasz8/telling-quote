import { DriveStep } from 'driver.js';

export const tutorialSteps: DriveStep[] = [
  {
    element: '[data-tour="settings-button"]',
    popover: {
      title: '⚙️ Customize Your Experience',
      description:
        'Change themes, adjust font size, and choose your reading style here. Make it yours!',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="new-reading-button"]',
    popover: {
      title: '✨ Add Your Content',
      description:
        "Click here to create a new reading. Paste any text or markdown - we'll format it beautifully for you!",
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reading-card"]',
    popover: {
      title: '📚 Your Reading Library',
      description:
        'Your readings appear as cards. Click any card to start reading. You can tag, edit, or delete them anytime.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="reader-navigation"]',
    popover: {
      title: '🎯 Navigate Your Reading',
      description:
        'Use arrow keys (← →) or these buttons to move line-by-line. Try "Spotlight Mode" in settings for maximum focus!',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="keyboard-shortcuts"]',
    popover: {
      title: '⚡ Power User Tips',
      description:
        'Press "?" to see all keyboard shortcuts. Try: ← → to navigate, Esc to exit reading, ? for shortcuts menu.',
      side: 'bottom',
      align: 'end',
    },
  },
];
