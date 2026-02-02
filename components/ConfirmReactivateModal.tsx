'use client';

import { useRef, useEffect } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface ConfirmReactivateModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmReactivateModal({
  isOpen,
  title,
  onClose,
  onConfirm,
}: ConfirmReactivateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useFocusTrap(modalRef, isOpen);

  // Auto-focus confirm button for keyboard accessibility
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reactivate-dialog-title"
        aria-describedby="reactivate-dialog-description"
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h3 id="reactivate-dialog-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Reactivar Lectura
          </h3>
        </div>

        <p id="reactivate-dialog-description" className="text-gray-700 dark:text-gray-300 mb-6 ml-16">
          ¿Deseas mover <span className="font-semibold text-gray-900 dark:text-gray-100">&ldquo;{title}&rdquo;</span> de nuevo a lecturas activas?
        </p>

        <div className="flex gap-3 justify-end ml-16">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            aria-label={`Confirmar reactivación de ${title}`}
          >
            Reactivar
          </button>
        </div>
      </div>
    </div>
  );
}
