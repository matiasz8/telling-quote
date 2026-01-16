'use client';

import { useRef, useEffect } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(modalRef, isOpen);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'General Navigation',
      items: [
        { keys: ['?'], description: 'Show this keyboard shortcuts help', context: 'Anywhere' },
        { keys: ['Tab'], description: 'Move focus to next interactive element', context: 'Anywhere' },
        { keys: ['Shift', 'Tab'], description: 'Move focus to previous interactive element', context: 'Anywhere' },
        { keys: ['Esc'], description: 'Close modals and dialogs', context: 'In modals' },
        { keys: ['Enter'], description: 'Activate buttons and links', context: 'On focused element' },
        { keys: ['Space'], description: 'Activate buttons', context: 'On focused button' },
      ],
    },
    {
      category: 'Reading Mode',
      items: [
        { keys: ['→'], description: 'Next slide/sentence', context: 'In reader' },
        { keys: ['←'], description: 'Previous slide/sentence', context: 'In reader' },
        { keys: ['↓'], description: 'Next slide (alternative)', context: 'In reader' },
        { keys: ['↑'], description: 'Previous slide (alternative)', context: 'In reader' },
        { keys: ['Space'], description: 'Next slide', context: 'In reader' },
        { keys: ['Shift', 'Space'], description: 'Previous slide', context: 'In reader' },
        { keys: ['Home'], description: 'Go to first slide', context: 'In reader' },
        { keys: ['End'], description: 'Go to last slide', context: 'In reader' },
        { keys: ['Backspace'], description: 'Exit reading (back to dashboard)', context: 'In reader' },
        { keys: ['Scroll'], description: 'Navigate between slides (wheel up/down)', context: 'In reader' },
        { keys: ['F'], description: 'Toggle fullscreen', context: 'In reader' },
      ],
    },
    {
      category: 'Modals & Forms',
      items: [
        { keys: ['Esc'], description: 'Close any open modal', context: 'In modal' },
        { keys: ['Enter'], description: 'Confirm action', context: 'In confirmation dialogs' },
        { keys: ['Tab'], description: 'Navigate between fields and buttons', context: 'In forms' },
        { keys: ['Cmd/Ctrl', 'Enter'], description: 'Save changes', context: 'In edit modals' },
      ],
    },
    {
      category: 'Touch Gestures (Mobile)',
      items: [
        { keys: ['Swipe Left'], description: 'Next slide in reading mode', context: 'Mobile reader' },
        { keys: ['Swipe Right'], description: 'Previous slide in reading mode', context: 'Mobile reader' },
        { keys: ['Double Tap'], description: 'Toggle fullscreen', context: 'Mobile reader' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
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
            ⌨️ Keyboard Shortcuts
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

        <div className="space-y-8">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.context}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {item.keys.map((key, keyIdx) => (
                        <span key={keyIdx} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 min-w-[32px] text-center">
                            {key}
                          </kbd>
                          {keyIdx < item.keys.length - 1 && (
                            <span className="text-gray-500 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>💡 Tip:</strong> Press <kbd className="px-2 py-0.5 text-xs font-semibold bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded">?</kbd> anytime to show this help screen.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-purple-600 dark:to-violet-600 dark:hover:from-purple-700 dark:hover:to-violet-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
