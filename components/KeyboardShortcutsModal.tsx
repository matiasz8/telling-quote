'use client';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      key: 'Tab / Shift+Tab',
      description: 'Navigate between elements',
      context: 'Anywhere',
    },
    {
      key: 'Enter / Space',
      description: 'Activate buttons and links',
      context: 'On focused element',
    },
    {
      key: 'Esc',
      description: 'Close modals and dialogs',
      context: 'In modal',
    },
    {
      key: '?',
      description: 'Show this keyboard shortcuts help',
      context: 'Anywhere',
    },
    {
      key: 'Arrow Right / Arrow Down',
      description: 'Next slide',
      context: 'In reader',
    },
    {
      key: 'Arrow Left / Arrow Up',
      description: 'Previous slide',
      context: 'In reader',
    },
    {
      key: 'Mouse Wheel Down / Scroll Down',
      description: 'Next slide',
      context: 'In reader',
    },
    {
      key: 'Mouse Wheel Up / Scroll Up',
      description: 'Previous slide',
      context: 'In reader',
    },
    {
      key: 'F / Double Click',
      description: 'Toggle fullscreen',
      context: 'In reader',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="shortcuts-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts help"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="shrink-0">
                <kbd className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  {shortcut.key}
                </kbd>
              </div>
              <div className="grow">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {shortcut.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {shortcut.context}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Press Tab to navigate and focus on any element. Use Esc to close any modal.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
