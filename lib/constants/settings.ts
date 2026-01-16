import { FontFamily, FontSize, Theme } from '@/types';

export const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'detox', label: 'Detox' },
  { value: 'high-contrast', label: 'High Contrast' },
];

export const DEFAULT_SETTINGS = {
  fontSize: 'medium' as FontSize,
  theme: 'light' as Theme,
  accessibility: {
    fontFamily: 'serif' as FontFamily,
    letterSpacing: 'normal' as const,
    lineHeight: 'normal' as const,
    wordSpacing: 'normal' as const,
    highContrast: false,
    reduceMotion: false,
  },
};

