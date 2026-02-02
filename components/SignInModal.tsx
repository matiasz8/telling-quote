import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrate: () => void;
}

export default function SignInModal({ isOpen, onClose, onMigrate }: SignInModalProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signIn();
      // Check if user has local data to migrate
      const hasLocalData = localStorage.getItem('readings') !== null;
      if (hasLocalData) {
        onMigrate();
      } else {
        onClose();
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔐</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          Iniciar Sesión
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Sincroniza tus lecturas en todos tus dispositivos con Google
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-xl">✓</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Accede desde cualquier dispositivo
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-xl">✓</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Respaldo automático en la nube
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-xl">✓</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              No pierdas tus lecturas nunca más
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  style={{ fill: '#4285F4' }}
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  style={{ fill: '#34A853' }}
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  style={{ fill: '#FBBC05' }}
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  style={{ fill: '#EA4335' }}
                />
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="w-full mt-4 text-gray-600 dark:text-gray-400 font-medium py-3 px-6 rounded-2xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          Cancelar
        </button>

        {/* Privacy note */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6">
          También puedes usar la aplicación sin iniciar sesión. Tus datos se guardarán localmente.
        </p>
      </div>
    </div>
  );
}
