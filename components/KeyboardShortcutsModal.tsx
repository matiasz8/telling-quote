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
      category: 'Navegación General',
      items: [
        { keys: ['?'], description: 'Mostrar esta ayuda de atajos de teclado', context: 'En cualquier lugar' },
        { keys: ['Tab'], description: 'Mover foco al siguiente elemento interactivo', context: 'En cualquier lugar' },
        { keys: ['Shift', 'Tab'], description: 'Mover foco al elemento interactivo anterior', context: 'En cualquier lugar' },
        { keys: ['Esc'], description: 'Cerrar modales y diálogos', context: 'En modales' },
        { keys: ['Enter'], description: 'Activar botones y enlaces', context: 'En elemento con foco' },
        { keys: ['Space'], description: 'Activar botones', context: 'En botón con foco' },
      ],
    },
    {
      category: 'Modo Lectura',
      items: [
        { keys: ['→'], description: 'Siguiente diapositiva/oración', context: 'En lector' },
        { keys: ['←'], description: 'Diapositiva/oración anterior', context: 'En lector' },
        { keys: ['↓'], description: 'Siguiente diapositiva (alternativa)', context: 'En lector' },
        { keys: ['↑'], description: 'Diapositiva anterior (alternativa)', context: 'En lector' },
        { keys: ['Space'], description: 'Siguiente diapositiva', context: 'En lector' },
        { keys: ['Shift', 'Space'], description: 'Diapositiva anterior', context: 'En lector' },
        { keys: ['Home'], description: 'Ir a la primera diapositiva', context: 'En lector' },
        { keys: ['End'], description: 'Ir a la última diapositiva', context: 'En lector' },
        { keys: ['Backspace'], description: 'Salir de lectura (volver al dashboard)', context: 'En lector' },
        { keys: ['Scroll'], description: 'Navegar entre diapositivas (rueda arriba/abajo)', context: 'En lector' },
        { keys: ['F'], description: 'Activar/desactivar pantalla completa', context: 'En lector' },
      ],
    },
    {
      category: 'Modales y Formularios',
      items: [
        { keys: ['Esc'], description: 'Cerrar cualquier modal abierto', context: 'En modal' },
        { keys: ['Enter'], description: 'Confirmar acción', context: 'En diálogos de confirmación' },
        { keys: ['Tab'], description: 'Navegar entre campos y botones', context: 'En formularios' },
        { keys: ['Cmd/Ctrl', 'Enter'], description: 'Guardar cambios', context: 'En modales de edición' },
      ],
    },
    {
      category: 'Gestos Táctiles (Móvil)',
      items: [
        { keys: ['Deslizar Izq.'], description: 'Siguiente diapositiva en modo lectura', context: 'Lector móvil' },
        { keys: ['Deslizar Der.'], description: 'Diapositiva anterior en modo lectura', context: 'Lector móvil' },
        { keys: ['Doble Toque'], description: 'Activar/desactivar pantalla completa', context: 'Lector móvil' },
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
            ⌨️ Atajos de Teclado
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar ayuda de atajos de teclado"
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
            <strong>💡 Consejo:</strong> Presiona <kbd className="px-2 py-0.5 text-xs font-semibold bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded">?</kbd> en cualquier momento para mostrar esta ayuda.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Cerrar atajos de teclado"
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-purple-600 dark:to-violet-600 dark:hover:from-purple-700 dark:hover:to-violet-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}
