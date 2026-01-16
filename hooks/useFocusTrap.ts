import { useEffect, RefObject } from 'react';

/**
 * Hook to trap focus within a modal or dialog element.
 * Ensures keyboard navigation (Tab/Shift+Tab) stays within the container.
 * 
 * @param containerRef - React ref to the modal/dialog container element
 * @param isActive - Whether the focus trap should be active
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: Move backwards
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: Move forwards
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Auto-focus first element when trap becomes active
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, isActive]);
}
