import { useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useReadingSync, SyncStatus } from '@/hooks/useReadingSync';

interface UserMenuProps {
  user: User;
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export default function UserMenu({ user, onExportData, onDeleteAccount }: UserMenuProps) {
  const { signOut } = useAuth();
  const { syncStatus, lastSyncTime } = useReadingSync();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const getSyncStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return '✓';
      case 'syncing':
        return '⏳';
      case 'error':
        return '⚠️';
      case 'offline':
        return '📡';
      default:
        return '○';
    }
  };

  const getSyncStatusText = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return 'Sincronizado';
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Error al sincronizar';
      case 'offline':
        return 'Sin conexión';
      default:
        return 'Esperando';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowSignOutConfirm(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="User menu"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
            {user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div className="flex items-center gap-3 mb-2">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-semibold">
                    {user.displayName?.[0] || user.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.displayName || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <span className="text-lg">{getSyncStatusIcon(syncStatus)}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {getSyncStatusText(syncStatus)}
                </span>
                {lastSyncTime && syncStatus === 'synced' && (
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">
                    {new Date(lastSyncTime).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  onExportData();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
              >
                <span className="text-xl">💾</span>
                <span className="text-gray-700 dark:text-gray-300">Exportar Datos</span>
              </button>

              <button
                onClick={() => setShowSignOutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
              >
                <span className="text-xl">🚪</span>
                <span className="text-gray-700 dark:text-gray-300">Cerrar Sesión</span>
              </button>

              <button
                onClick={() => {
                  onDeleteAccount();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors"
              >
                <span className="text-xl">🗑️</span>
                <span className="text-red-600 dark:text-red-400">Eliminar Cuenta</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚪</span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
              ¿Cerrar Sesión?
            </h2>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Tus lecturas permanecerán sincronizadas en la nube, pero no estarán accesibles en este dispositivo hasta que inicies sesión nuevamente.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Cerrar Sesión
              </button>

              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
