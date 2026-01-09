import { useEffect } from 'react';
import { Settings, AccessibilitySettings } from '@/types';

const getFontFamily = (fontFamily: string): string => {
  const fontMap: Record<string, string> = {
    'system': 'system-ui, -apple-system, sans-serif',
    'serif': 'Georgia, serif',
    'sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'mono': '"Courier New", monospace',
    'opendyslexic': 'OpenDyslexic, sans-serif',
    'comic-sans': '"Comic Sans MS", cursive',
    'atkinson': 'Atkinson Hyperlegible, sans-serif'
  };
  return fontMap[fontFamily] || 'system-ui, -apple-system, sans-serif';
};

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
      const letterSpacingMap: Record<string, string> = {
        'normal': 'normal',
        'wide': '0.05em',
        'extra-wide': '0.1em'
      };
      root.style.letterSpacing = letterSpacingMap[a11y.letterSpacing] || 'normal';
    }

    // Apply line height
    if (a11y.lineHeight) {
      const lineHeightMap: Record<string, string> = {
        'compact': '1.4',
        'normal': '1.6',
        'relaxed': '1.8',
        'loose': '2.0'
      };
      root.style.lineHeight = lineHeightMap[a11y.lineHeight] || '1.6';
    }

    // Apply word spacing
    if (a11y.wordSpacing) {
      const wordSpacingMap: Record<string, string> = {
        'normal': 'normal',
        'wide': '0.1em'
      };
      root.style.wordSpacing = wordSpacingMap[a11y.wordSpacing] || 'normal';
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
  }, [settings]);
}
