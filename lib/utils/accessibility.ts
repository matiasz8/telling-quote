/**
 * Shared accessibility utility functions used by both SSR (layout.tsx inline script)
 * and client-side (useApplyAccessibilitySettings hook) to prevent duplication
 * and ensure consistent behavior.
 */

import type { AccessibilitySettings, FontFamily, LetterSpacing, LineHeightOption, WordSpacing } from '@/types';

/**
 * Font family mapping - single source of truth
 */
const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  'system': 'system-ui, -apple-system, sans-serif',
  'serif': 'Georgia, serif',
  'sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'mono': '"Courier New", monospace',
  'opendyslexic': 'OpenDyslexic, sans-serif',
  'comic-sans': '"Comic Sans MS", cursive',
  'atkinson': 'Atkinson Hyperlegible, sans-serif'
};

/**
 * Letter spacing mapping - single source of truth
 */
const LETTER_SPACING_MAP: Record<LetterSpacing, string> = {
  'normal': 'normal',
  'wide': '0.05em',
  'extra-wide': '0.1em'
};

/**
 * Line height mapping - single source of truth
 */
const LINE_HEIGHT_MAP: Record<LineHeightOption, string> = {
  'compact': '1.4',
  'normal': '1.6',
  'relaxed': '1.8',
  'loose': '2.0'
};

/**
 * Word spacing mapping - single source of truth
 */
const WORD_SPACING_MAP: Record<WordSpacing, string> = {
  'normal': 'normal',
  'wide': '0.1em'
};

/**
 * Maps font family keys to their CSS font-family values
 */
export const getFontFamily = (fontFamily: FontFamily): string => {
  return FONT_FAMILY_MAP[fontFamily] || 'system-ui, -apple-system, sans-serif';
};

/**
 * Maps letter spacing keys to their CSS values
 */
export const getLetterSpacing = (letterSpacing: LetterSpacing): string => {
  return LETTER_SPACING_MAP[letterSpacing] || 'normal';
};

/**
 * Maps line height keys to their CSS values
 */
export const getLineHeight = (lineHeight: LineHeightOption): string => {
  return LINE_HEIGHT_MAP[lineHeight] || '1.6';
};

/**
 * Maps word spacing keys to their CSS values
 */
export const getWordSpacing = (wordSpacing: WordSpacing): string => {
  return WORD_SPACING_MAP[wordSpacing] || 'normal';
};

/**
 * Serialized version of the utility functions for use in inline scripts.
 * This generates a JavaScript code string that can be injected into HTML.
 * The mappings are dynamically generated from the constants above to ensure consistency.
 */
export const getAccessibilityUtilsScript = (): string => {
  return `
    function getFontFamily(fontFamily) {
      const fontMap = ${JSON.stringify(FONT_FAMILY_MAP)};
      return fontMap[fontFamily] || 'system-ui, -apple-system, sans-serif';
    }
    
    function getLetterSpacing(letterSpacing) {
      const letterSpacingMap = ${JSON.stringify(LETTER_SPACING_MAP)};
      return letterSpacingMap[letterSpacing] || 'normal';
    }
    
    function getLineHeight(lineHeight) {
      const lineHeightMap = ${JSON.stringify(LINE_HEIGHT_MAP)};
      return lineHeightMap[lineHeight] || '1.6';
    }
    
    function getWordSpacing(wordSpacing) {
      const wordSpacingMap = ${JSON.stringify(WORD_SPACING_MAP)};
      return wordSpacingMap[wordSpacing] || 'normal';
    }
  `.trim();
};
