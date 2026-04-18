'use client';

import { useState, useEffect } from 'react';
import SettingsModal from './SettingsModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import SignInModal from './SignInModal';
import MigrationModal from './MigrationModal';
import UserMenu from './UserMenu';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { resetTutorial } from '@/lib/tutorial';
import { deleteAccount } from '@/lib/firebase/auth';
import { deleteAllUserData } from '@/lib/firebase/firestore';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isMigrationOpen, setIsMigrationOpen] = useState(false);
  const { settings, setSettings } = useSettings();
  const { user } = useAuth();
  const isDark = settings.theme === 'dark';
  const isDetox = settings.theme === 'detox';
  const isHighContrast = settings.theme === 'high-contrast';

  // Global keyboard shortcut for "?" to open shortcuts help
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if "?" is pressed (Shift + /)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Don't trigger if user is typing in an input/textarea
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleExportData = () => {
    // Get readings from localStorage
    const readings = localStorage.getItem('readings');
    const settings = localStorage.getItem('settings');
    const data = {
      readings: readings ? JSON.parse(readings) : [],
      settings: settings ? JSON.parse(settings) : {},
      exportDate: new Date().toISOString(),
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tellingquote-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y se eliminarán todos tus datos.'
    );

    if (confirmed) {
      try {
        // Delete all user data from Firestore
        await deleteAllUserData(user.uid);
        // Delete user account
        await deleteAccount();
        alert('Cuenta eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error al eliminar la cuenta. Por favor intenta de nuevo.');
      }
    }
  };

  const handleMigrateToCloud = () => {
    setIsSignInOpen(false);
    setIsMigrationOpen(true);
  };

  return (
    <>
      <header className={`w-full border-b ${
        isHighContrast
          ? 'border-white bg-black text-white border-2'
          : isDetox
          ? 'border-gray-200 bg-white text-gray-900'
          : isDark
          ? 'border-purple-900 bg-linear-to-r from-purple-900 to-black'
          : 'border-lime-200 bg-linear-to-r from-yellow-100 to-lime-100'
      }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${
            isHighContrast
              ? 'text-white'
              : isDetox
              ? 'text-gray-900'
              : isDark
              ? 'text-gray-100'
              : 'text-gray-900'
          }`}>tellingQuote</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              data-tour="keyboard-shortcuts"
              className={`p-2 rounded-lg transition-colors ${
                isHighContrast
                  ? 'text-white hover:bg-white hover:text-black'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Atajos de Teclado (Press ?)"
              aria-label="Show keyboard shortcuts"
            >
              <span className="text-2xl">⌨️</span>
            </button>
            <button
              onClick={() => resetTutorial()}
              data-tour="tutorial-button"
              className={`p-2 rounded-lg transition-colors ${
                isHighContrast
                  ? 'text-white hover:bg-white hover:text-black'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Ver Tutorial"
              aria-label="Show tutorial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              data-tour="settings-button"
              className={`p-2 rounded-lg transition-colors ${
                isHighContrast
                  ? 'text-white hover:bg-white hover:text-black'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Settings"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {/* Auth: Show User Menu or Sign In button */}
          {user ? (
            <UserMenu
              user={user}
              onExportData={handleExportData}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : (
            <button
              onClick={() => setIsSignInOpen(true)}
              data-tour="sign-in-button"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isHighContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : isDetox
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : isDark
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                  : 'bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
              }`}
              title="Iniciar Sesión"
            >
              Iniciar Sesión
            </button>
          )}
          </div>
        </div>
      </header>
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onMigrate={handleMigrateToCloud}
      />

      <MigrationModal
        isOpen={isMigrationOpen}
        onConfirm={async (migrate) => {
          if (migrate && user) {
            // Migration logic handled in page.tsx
            // This is just for UI flow
          }
          setIsMigrationOpen(false);
        }}
        readingCount={0}
      />
    </>
  );
}
