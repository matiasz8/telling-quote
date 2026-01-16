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

    // Apply reduce motion
    if (typeof a11y.reduceMotion === 'boolean') {
      if (a11y.reduceMotion) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply content width
    const contentWidthMap: Record<string, string> = {
      'narrow': '45ch',
      'medium': '65ch',
      'wide': '80ch',
      'full': 'none'
    };
    // Apply to reader content container (the div inside reader-main-content)
    const readerContent = document.getElementById('reader-main-content');
    if (readerContent) {
      const contentDiv = readerContent.querySelector('div');
      if (contentDiv instanceof HTMLElement) {
        const width = a11y.contentWidth || 'medium';
        contentDiv.style.maxWidth = contentWidthMap[width];
      }
    }

    // Cleanup function to reset styles when component unmounts
    return () => {
      if (typeof document === 'undefined') return;
      
      const root = document.documentElement;
      root.style.fontFamily = '';
      root.style.letterSpacing = '';
      root.style.lineHeight = '';
      root.style.wordSpacing = '';

      const mainContent = document.getElementById('reader-main-content');
      if (mainContent) {
        mainContent.style.maxWidth = '';
      }
    };
  }, [settings]);
}