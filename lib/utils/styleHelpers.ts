import { FontFamily, FontSize, Theme } from '@/types';

export const getFontFamilyClass = (fontFamily: FontFamily): string => {
  const classes: Record<FontFamily, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
    system: '',
    opendyslexic: 'font-opendyslexic',
    'comic-sans': 'font-comic-sans',
    atkinson: 'font-atkinson',
  };
  return classes[fontFamily] || '';
};

export const getFontSizeClasses = (fontSize: FontSize) => {
  const sizes = {
    small: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      text: 'text-base',
      bullet: 'text-base',
    },
    medium: {
      title: 'text-4xl',
      subtitle: 'text-2xl',
      text: 'text-lg',
      bullet: 'text-lg',
    },
    large: {
      title: 'text-5xl',
      subtitle: 'text-3xl',
      text: 'text-xl',
      bullet: 'text-xl',
    },
    xlarge: {
      title: 'text-6xl',
      subtitle: 'text-4xl',
      text: 'text-2xl',
      bullet: 'text-2xl',
    },
  };
  return sizes[fontSize];
};

export const getThemeClasses = (theme: Theme) => {
  if (theme === 'dark') {
    return {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      cardBg: 'bg-gray-800',
    };
  }
  return {
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    cardBg: 'bg-white',
  };
};
