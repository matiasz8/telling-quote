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
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Atrás',
    doneBtnText: 'Finalizar',
    progressText: '{{current}} de {{total}}',
    
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
  };
}
