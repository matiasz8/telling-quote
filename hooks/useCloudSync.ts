'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { syncOfflineChanges, migrateLocalStorageToFirestore } from '@/lib/firebase/sync';
import { Reading, SyncStatus } from '@/types';

/**
 * Hook for managing cloud synchronization of readings and settings
 */
export const useCloudSync = (
  localReadings: Reading[]
) => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSignedIn: !!user,
    isSyncing: false,
    lastSyncAt: null,
    syncError: null,
    isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
  });

  const [hasMigrated, setHasMigrated] = useState(false);

  // Update isSignedIn when user changes
  useEffect(() => {
    setSyncStatus(prev => ({ ...prev, isSignedIn: !!user }));
  }, [user]);

  // Listen for online/offline changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Migrate local data when first signing in
  const migrateData = useCallback(async () => {
    if (!user || hasMigrated || localReadings.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    try {
      await migrateLocalStorageToFirestore(user.uid, localReadings);
      setHasMigrated(true);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: Date.now(),
        syncError: null,
      }));
    } catch (err) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: err instanceof Error ? err.message : 'Migration failed',
      }));
    }
  }, [user, hasMigrated, localReadings]);

  // Sync offline changes when back online
  const syncChanges = useCallback(async () => {
    if (syncStatus.isOffline || !user) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    try {
      await syncOfflineChanges(user.uid, localReadings);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: Date.now(),
        syncError: null,
      }));
    } catch (err) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: err instanceof Error ? err.message : 'Sync failed',
      }));
    }
  }, [syncStatus.isOffline, user, localReadings]);

  // Periodically sync when online and signed in
  useEffect(() => {
    if (!user || syncStatus.isOffline) return;

    // Sync every 5 minutes
    const intervalId = setInterval(() => {
      syncChanges();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user, syncStatus.isOffline, syncChanges]);

  return {
    syncStatus,
    migrateData,
    syncChanges,
  };
};
