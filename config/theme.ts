// Theme configuration for the reading application
export const theme = {
  // Inline code styling (backticks)
  inlineCode: {
    background: 'bg-gray-800',
    text: 'text-green-400',
    font: 'font-mono',
    size: 'text-sm',
    padding: 'px-2 py-0.5',
    margin: 'mx-1',
    border: 'rounded',
  },
  
  // Bullet points
  bullets: {
    level0: {
      text: 'text-gray-500',
      size: 'text-2xl',
      weight: 'italic',
    },
    level1: {
      text: 'text-gray-900',
      size: 'text-3xl',
      weight: 'font-semibold',
    },
    history: {
      text: 'text-gray-400',
      size: 'text-2xl',
    },
    parent: {
      text: 'text-gray-500',
      size: 'text-xl',
      weight: 'italic',
    },
  },
  
  // Subtitle intro
  subtitleIntro: {
    size: 'text-5xl',
    weight: 'font-bold',
    style: 'italic',
  },
  
  // Regular text
  regularText: {
    size: 'text-4xl',
  },
  
  // Progress bar
  progressBar: {
    background: 'bg-gray-800',
    fill: 'bg-purple-600',
  },

  // Font family options for accessibility
  fontFamilies: {
    system: {
      name: 'System Default',
      family: 'system-ui, -apple-system, sans-serif',
      description: 'Default system font',
    },
    serif: {
      name: 'Serif',
      family: 'Georgia, serif',
      description: 'Classic serif font',
    },
    sans: {
      name: 'Sans Serif',
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      description: 'Modern sans-serif font',
    },
    mono: {
      name: 'Monospace',
      family: '"Courier New", monospace',
      description: 'Monospace font',
    },
    opendyslexic: {
      name: 'OpenDyslexic',
      family: 'OpenDyslexic, sans-serif',
      description: 'Designed for dyslexia support',
      url: 'https://cdn.jsdelivr.net/npm/opendyslexic@2.0.15/fonts/OpenDyslexic-Regular.otf',
    },
    'comic-sans': {
      name: 'Comic Sans MS',
      family: '"Comic Sans MS", cursive',
      description: 'Helpful for dyslexic readers',
    },
    atkinson: {
      name: 'Atkinson Hyperlegible',
      family: 'Atkinson Hyperlegible, sans-serif',
      description: 'High legibility font',
      url: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible',
    },
  },

  // Text spacing options for accessibility
  letterSpacing: {
    normal: { value: 'normal', label: 'Normal' },
    wide: { value: '0.05em', label: 'Wide' },
    'extra-wide': { value: '0.1em', label: 'Extra Wide' },
  },

  lineHeight: {
    compact: { value: '1.4', label: 'Compact' },
    normal: { value: '1.6', label: 'Normal' },
    relaxed: { value: '1.8', label: 'Relaxed' },
    loose: { value: '2.0', label: 'Loose' },
  },

  wordSpacing: {
    normal: { value: '0', label: 'Normal' },
    wide: { value: '0.1em', label: 'Wide' },
  },

  // High contrast theme
  highContrast: {
    background: 'bg-black',
    text: 'text-white',
    border: 'border-white border-2',
    button: {
      primary: 'bg-white text-black hover:bg-gray-200 font-bold',
      secondary: 'border-2 border-white text-white hover:bg-white hover:text-black',
    },
  },
} as const;

// Helper function to get inline code classes
export function getInlineCodeClasses() {
  const { inlineCode } = theme;
  return `inline-block ${inlineCode.padding} ${inlineCode.margin} ${inlineCode.background} ${inlineCode.text} ${inlineCode.border} ${inlineCode.font} ${inlineCode.size}`;
}
