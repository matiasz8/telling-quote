import { useEffect } from 'react';
import { Settings, AccessibilitySettings } from '@/types';
import { 
  getFontFamily, 
  getLetterSpacing, 
  getLineHeight, 
  getWordSpacing 
} from '@/lib/utils/accessibility';

export function useApplyAccessibilitySettings(settings: Settings) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove('dark-theme', 'detox-theme', 'high-contrast-theme');

    // Apply theme
    if (settings.theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (settings.theme === 'detox') {
      root.classList.add('detox-theme');
    } else if (settings.theme === 'high-contrast') {
      root.classList.add('high-contrast-theme');
    }

    // Apply accessibility settings
    const a11y: AccessibilitySettings = settings.accessibility || {
      fontFamily: 'serif',
      letterSpacing: 'normal',
      lineHeight: 'normal',
      wordSpacing: 'normal',
      highContrast: false,
      reduceMotion: false,
    };

    // Apply font family
    if (a11y.fontFamily) {
      root.style.fontFamily = getFontFamily(a11y.fontFamily);
    }

    // Apply letter spacing
    if (a11y.letterSpacing) {
      root.style.letterSpacing = getLetterSpacing(a11y.letterSpacing);
    }

    // Apply line height
    if (a11y.lineHeight) {
      root.style.lineHeight = getLineHeight(a11y.lineHeight);
    }

    // Apply word spacing
    if (a11y.wordSpacing) {
      root.style.wordSpacing = getWordSpacing(a11y.wordSpacing);
    }

    // Apply high contrast mode
    if (a11y.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduce motion
    if (a11y.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Check for system preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('reduce-motion');
    }

    // Apply focus mode
    if (a11y.focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }

    // Apply content width
    if (a11y.contentWidth) {
      const contentWidthMap: Record<string, string> = {
        'narrow': '45ch',
        'medium': '65ch',
        'wide': '80ch'
      };
      const mainContent = document.getElementById('reader-main-content');
      if (mainContent) {
        mainContent.style.maxWidth = contentWidthMap[a11y.contentWidth] || '65ch';
      }
    }  }, [settings]);
}