import { FontFamily, FontSize, Theme, ReadingTransition } from '@/types';

export const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; className: string }[] = [
  { value: 'serif', label: 'Serif', className: 'font-serif' },
  { value: 'sans', label: 'Sans Serif', className: 'font-sans' },
  { value: 'mono', label: 'Monospace', className: 'font-mono' },
  { value: 'system', label: 'System', className: '' },
  { value: 'opendyslexic', label: 'OpenDyslexic', className: 'font-opendyslexic' },
  { value: 'comic-sans', label: 'Comic Sans', className: 'font-comic-sans' },
  { value: 'atkinson', label: 'Atkinson', className: 'font-atkinson' },
];

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

export const READING_TRANSITION_OPTIONS: { value: ReadingTransition; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'Instant transitions' },
  { value: 'fade-theme', label: 'Fade', description: 'Smooth fade with theme color' },
  { value: 'swipe', label: 'Swipe', description: 'Horizontal slide animation' },
  { value: 'line-focus', label: 'Line Focus', description: 'Blur surrounding lines' },
  { value: 'spotlight', label: 'Spotlight', description: 'Theater spotlight effect' },
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
    focusMode: false,
    readingTransition: 'fade-theme' as ReadingTransition,
  },
};

