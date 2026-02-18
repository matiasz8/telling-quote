'use client';

import { useState, useRef, useEffect } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface MigrationModalProps {
  isOpen: boolean;
  onSync: () => Promise<void>;
  onStartFresh: () => void;
  readingCount: number;
}

export default function MigrationModal({
  isOpen,
  onSync,
  onStartFresh,
  readingCount
}: MigrationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusTrap(modalRef, isOpen);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onStartFresh();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onStartFresh]);

  const handleSync = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onSync();
    } catch (err) {
      console.error('Migration error:', err);
      setError('Failed to sync your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="migration-title"
      >
        <div className="mb-6">
          <h2 id="migration-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Sync Your Local Data?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We found <span className="font-semibold text-gray-900 dark:text-gray-100">{readingCount}</span> reading{readingCount !== 1 ? 's' : ''} saved locally.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sync to Cloud
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Upload your local readings to your account. They&apos;ll be available across all your devices.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Start Fresh
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Discard local data and start with a clean slate. Your local readings will be deleted.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Yes, Sync My Data
              </>
            )}
          </button>
          <button
            onClick={onStartFresh}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, Start Fresh
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          This choice is permanent. Local data will be cleared after your decision.
        </p>
      </div>
    </div>
  );
}
