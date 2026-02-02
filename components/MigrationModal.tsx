import { useState } from 'react';

interface MigrationModalProps {
  isOpen: boolean;
  onConfirm: (migrate: boolean) => void;
  readingCount: number;
}

export default function MigrationModal({ isOpen, onConfirm, readingCount }: MigrationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleMigrate = async (shouldMigrate: boolean) => {
    setLoading(true);
    await onConfirm(shouldMigrate);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📦</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          Datos Locales Encontrados
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Encontramos <span className="font-bold text-emerald-600 dark:text-emerald-400">{readingCount} {readingCount === 1 ? 'lectura' : 'lecturas'}</span> guardadas en este dispositivo.
        </p>

        {/* Question */}
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
          ¿Deseas sincronizarlas con tu cuenta de Google?
        </p>

        {/* Benefits of migrating */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
            Si sincronizas:
          </p>
          <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
            <li>• Podrás acceder a tus lecturas desde cualquier dispositivo</li>
            <li>• Tendrás respaldo automático en la nube</li>
            <li>• No perderás tus datos si borras el caché del navegador</li>
          </ul>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Si empiezas de cero:
          </p>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• Se eliminarán las lecturas locales de este dispositivo</li>
            <li>• Comenzarás con una cuenta vacía</li>
            <li>• No podrás recuperar estas lecturas después</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleMigrate(true)}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Sincronizando...
              </span>
            ) : (
              '✓ Sí, Sincronizar Lecturas'
            )}
          </button>

          <button
            onClick={() => handleMigrate(false)}
            disabled={loading}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Empezar de Cero
          </button>
        </div>
      </div>
    </div>
  );
}
