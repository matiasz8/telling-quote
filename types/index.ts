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

export type ContentWidth = 'narrow' | 'medium' | 'wide';

export type AccessibilitySettings = {
  fontFamily: FontFamily;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeightOption;
  wordSpacing: WordSpacing;
  highContrast: boolean;
  reduceMotion: boolean;
  contentWidth?: ContentWidth;
  focusMode?: boolean;
};

export type Settings = {
  fontFamily: FontFamily;
  fontSize: FontSize;
  theme: Theme;
  accessibility?: AccessibilitySettings;
};
