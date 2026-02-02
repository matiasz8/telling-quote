import { Config } from 'driver.js';

export interface TutorialConfig extends Partial<Config> {
  theme?: 'light' | 'dark' | 'detox' | 'high-contrast';
  reduceMotion?: boolean;
}

export function getTutorialConfig(options: TutorialConfig = {}): Config {
  const { theme = 'light', reduceMotion = false } = options;

  // Theme-specific classes
  const themeClasses: Record<string, string> = {
    light: 'driverjs-theme-light',
    dark: 'driverjs-theme-dark',
    detox: 'driverjs-theme-detox',
    'high-contrast': 'driverjs-theme-high-contrast',
  };

  return {
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Finish',
    progressText: '{{current}} of {{total}}',
    
    // Accessibility
    animate: !reduceMotion,
    smoothScroll: !reduceMotion,
    
    // Theme styling
    popoverClass: themeClasses[theme] || themeClasses.light,
    overlayColor: theme === 'high-contrast' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    
    // Callbacks
    onDestroyed: () => {
      localStorage.setItem('tutorial-completed', 'true');
    },
    
    onDestroyStarted: () => {
      if (
        !localStorage.getItem('tutorial-completed') &&
        confirm('Are you sure you want to skip the tutorial?')
      ) {
        localStorage.setItem('tutorial-skipped', 'true');
        return true;
      }
      return false;
    },
  };
}
