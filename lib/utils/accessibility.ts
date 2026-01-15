/**
 * Shared accessibility utility functions used by both SSR (layout.tsx inline script)
 * and client-side (useApplyAccessibilitySettings hook) to prevent duplication
 * and ensure consistent behavior.
 */

import type { AccessibilitySettings, FontFamily, LetterSpacing, LineHeightOption, WordSpacing } from '@/types';

/**
 * Maps font family keys to their CSS font-family values
 */
export const getFontFamily = (fontFamily: FontFamily): string => {
  const fontMap: Record<FontFamily, string> = {
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

/**
 * Maps letter spacing keys to their CSS values
 */
export const getLetterSpacing = (letterSpacing: LetterSpacing): string => {
  const letterSpacingMap: Record<LetterSpacing, string> = {
    'normal': 'normal',
    'wide': '0.05em',
    'extra-wide': '0.1em'
  };
  return letterSpacingMap[letterSpacing] || 'normal';
};

/**
 * Maps line height keys to their CSS values
 */
export const getLineHeight = (lineHeight: LineHeightOption): string => {
  const lineHeightMap: Record<LineHeightOption, string> = {
    'compact': '1.4',
    'normal': '1.6',
    'relaxed': '1.8',
    'loose': '2.0'
  };
  return lineHeightMap[lineHeight] || '1.6';
};

/**
 * Maps word spacing keys to their CSS values
 */
export const getWordSpacing = (wordSpacing: WordSpacing): string => {
  const wordSpacingMap: Record<WordSpacing, string> = {
    'normal': 'normal',
    'wide': '0.1em'
  };
  return wordSpacingMap[wordSpacing] || 'normal';
};

/**
 * Serialized version of the utility functions for use in inline scripts.
 * This generates a JavaScript code string that can be injected into HTML.
 */
export const getAccessibilityUtilsScript = (): string => {
  return `
    function getFontFamily(fontFamily) {
      const fontMap = {
        'system': 'system-ui, -apple-system, sans-serif',
        'serif': 'Georgia, serif',
        'sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'mono': '"Courier New", monospace',
        'opendyslexic': 'OpenDyslexic, sans-serif',
        'comic-sans': '"Comic Sans MS", cursive',
        'atkinson': 'Atkinson Hyperlegible, sans-serif'
      };
      return fontMap[fontFamily] || 'system-ui, -apple-system, sans-serif';
    }
    
    function getLetterSpacing(letterSpacing) {
      const letterSpacingMap = {
        'normal': 'normal',
        'wide': '0.05em',
        'extra-wide': '0.1em'
      };
      return letterSpacingMap[letterSpacing] || 'normal';
    }
    
    function getLineHeight(lineHeight) {
      const lineHeightMap = {
        'compact': '1.4',
        'normal': '1.6',
        'relaxed': '1.8',
        'loose': '2.0'
      };
      return lineHeightMap[lineHeight] || '1.6';
    }
    
    function getWordSpacing(wordSpacing) {
      const wordSpacingMap = {
        'normal': 'normal',
        'wide': '0.1em'
      };
      return wordSpacingMap[wordSpacing] || 'normal';
    }
  `.trim();
};
