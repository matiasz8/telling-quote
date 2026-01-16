export type Reading = {
  id: string;
  title: string;
  content: string;
  tags?: string[]; // Optional, default empty array
};

export type FontFamily = 'serif' | 'sans' | 'mono' | 'system' | 'opendyslexic' | 'comic-sans' | 'atkinson';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Theme = 'light' | 'dark' | 'detox' | 'high-contrast';

export type LetterSpacing = 'normal' | 'wide' | 'extra-wide';

export type LineHeightOption = 'compact' | 'normal' | 'relaxed' | 'loose';

export type WordSpacing = 'normal' | 'wide';

export type ContentWidth = 'narrow' | 'medium' | 'wide' | 'full';

export type AccessibilitySettings = {
  fontFamily: FontFamily;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeightOption;
  wordSpacing: WordSpacing;
  reduceMotion: boolean;
  contentWidth?: ContentWidth;
  readingLineFocus?: boolean; // Issue #5: Focus/blur mode for reading lines
};

export type Settings = {
  fontSize: FontSize;
  theme: Theme;
  accessibility?: AccessibilitySettings;
};
