import { FontFamily, FontSize, Theme, ReadingTransition } from '@/types';

export const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; className: string }[] = [
  { value: 'serif', label: 'Serif (Clásica)', className: 'font-serif' },
  { value: 'sans', label: 'Sans Serif (Moderna)', className: 'font-sans' },
  { value: 'mono', label: 'Monospace (Código)', className: 'font-mono' },
  { value: 'system', label: 'Sistema', className: '' },
  { value: 'opendyslexic', label: 'OpenDyslexic (Dislexia)', className: 'font-opendyslexic' },
  { value: 'comic-sans', label: 'Comic Neue (Informal)', className: 'font-comic-sans' },
  { value: 'atkinson', label: 'Atkinson (Legible)', className: 'font-atkinson' },
];

export const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Pequeño (S)' },
  { value: 'medium', label: 'Mediano (M)' },
  { value: 'large', label: 'Grande (L)' },
  { value: 'xlarge', label: 'Extra Grande (XL)' },
];

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: '☀️ Claro' },
  { value: 'dark', label: '🌙 Oscuro' },
  { value: 'detox', label: '🧘 Detox' },
  { value: 'high-contrast', label: '♿ Alto Contraste' },
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
  autoAdvance: {
    enabled: false,
    wpm: 200,
    autoStart: false,
    showProgress: true,
  },
};

