'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SettingsModal from './SettingsModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { useSettings } from '@/hooks/useSettings';
import { useApplyAccessibilitySettings } from '@/hooks/useApplyAccessibilitySettings';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { settings, setSettings } = useSettings();
  useApplyAccessibilitySettings(settings);
  const isDark = settings.theme === 'dark';
  const isDetox = settings.theme === 'detox';
  const isHighContrast = settings.theme === 'high-contrast';

  // Handle keyboard shortcut for opening help (?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isTyping = (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA';
      
      if (!isTyping && e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
      
      // Close modals with Escape
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);  return (
    <>
      <header 
        className={`w-full border-b ${
          isHighContrast
            ? 'border-white bg-black text-white'
            : isDetox
            ? 'border-gray-200 bg-white'
            : isDark
            ? 'border-purple-900 bg-linear-to-r from-purple-900 to-black'
            : 'border-lime-200 bg-linear-to-r from-yellow-100 to-lime-100'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${
            isHighContrast
              ? 'text-white'
              : isDetox
              ? 'text-gray-900'
              : isDark
              ? 'text-gray-100'
              : 'text-gray-900'
          }`}>
            tellingQuote
          </h1>
          <nav className="flex items-center gap-3" aria-label="Main navigation">
            <a
              href="https://github.com/matiasz8/telling-quote"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub (opens in new tab)"
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
                isHighContrast
                  ? 'text-white hover:text-black hover:bg-white'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <Link
              href="/accessibility"
              aria-label="View accessibility statement"
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
                isHighContrast
                  ? 'text-white hover:text-black hover:bg-white'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open settings"
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
                isHighContrast
                  ? 'text-white hover:text-black hover:bg-white'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="Show keyboard shortcuts help (press ? key)"
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
                isHighContrast
                  ? 'text-white hover:text-black hover:bg-white'
                  : isDetox
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </nav>
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
    </>
  );
}
