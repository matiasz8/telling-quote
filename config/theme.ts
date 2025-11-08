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
    background: 'bg-gray-200',
    fill: 'bg-linear-to-r from-blue-500 to-blue-600',
  },
} as const;

// Helper function to get inline code classes
export function getInlineCodeClasses() {
  const { inlineCode } = theme;
  return `inline-block ${inlineCode.padding} ${inlineCode.margin} ${inlineCode.background} ${inlineCode.text} ${inlineCode.border} ${inlineCode.font} ${inlineCode.size}`;
}
