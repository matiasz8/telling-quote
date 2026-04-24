import { useState, useCallback, useRef, useEffect } from 'react';
import { Reading } from '@/types';
import { useAuth } from './useAuth';
import {
  saveReading,
  updateReading,
  deleteReading,
  getReadings,
  subscribeToReadings,
} from '@/lib/firebase/firestore';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

/**
 * Hook to sync readings between localStorage and Firestore
 */
export const useReadingSync = () => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const statusResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearStatusResetTimeout = useCallback(() => {
    if (statusResetTimeoutRef.current) {
      clearTimeout(statusResetTimeoutRef.current);
      statusResetTimeoutRef.current = null;
    }
  }, []);

  const scheduleIdleReset = useCallback(() => {
    clearStatusResetTimeout();
    statusResetTimeoutRef.current = setTimeout(() => setSyncStatus('idle'), 2000);
  }, [clearStatusResetTimeout]);

  const isOffline = useCallback(() => {
    if (typeof navigator === 'undefined') return false;
    return navigator.onLine === false;
  }, []);

  const isRetryableSyncError = (error: unknown) => {
    const message = String(error).toLowerCase();
    return (
      message.includes('unavailable') ||
      message.includes('deadline-exceeded') ||
      message.includes('network') ||
      message.includes('timeout')
    );
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runWithRetry = useCallback(async <T,>(operation: () => Promise<T>): Promise<T> => {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const canRetry = attempt < maxAttempts && isRetryableSyncError(error) && !isOffline();
        if (!canRetry) {
          throw error;
        }

        await wait(250 * attempt);
      }
    }

    throw new Error('Unexpected retry state in sync operation.');
  }, [isOffline]);

  useEffect(() => {
    return () => {
      clearStatusResetTimeout();
    };
  }, [clearStatusResetTimeout]);

  /**
   * Sync a reading to Firestore if user is signed in
   */
  const syncReading = useCallback(
    async (reading: Reading): Promise<void> => {
      if (!user) return;
      if (isOffline()) {
        setSyncStatus('offline');
        return;
      }

      try {
        setSyncStatus('syncing');
        await runWithRetry(() => saveReading(user.uid, reading));
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        scheduleIdleReset();
      } catch (error) {
        console.error('Error syncing reading:', error);
        setSyncStatus(isOffline() ? 'offline' : 'error');
        throw error;
      }
    },
    [user, isOffline, runWithRetry, scheduleIdleReset]
  );

  /**
   * Update a reading in Firestore
   */
  const syncUpdateReading = useCallback(
    async (readingId: string, updates: Partial<Reading>): Promise<void> => {
      if (!user) return;
      if (isOffline()) {
        setSyncStatus('offline');
        return;
      }

      try {
        setSyncStatus('syncing');
        await runWithRetry(() => updateReading(user.uid, readingId, updates));
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        scheduleIdleReset();
      } catch (error) {
        console.error('Error updating reading:', error);
        setSyncStatus(isOffline() ? 'offline' : 'error');
        throw error;
      }
    },
    [user, isOffline, runWithRetry, scheduleIdleReset]
  );

  /**
   * Delete a reading from Firestore
   */
  const syncDeleteReading = useCallback(
    async (readingId: string): Promise<void> => {
      if (!user) return;
      if (isOffline()) {
        setSyncStatus('offline');
        return;
      }

      try {
        setSyncStatus('syncing');
        await runWithRetry(() => deleteReading(user.uid, readingId));
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        scheduleIdleReset();
      } catch (error) {
        console.error('Error deleting reading:', error);
        setSyncStatus(isOffline() ? 'offline' : 'error');
        throw error;
      }
    },
    [user, isOffline, runWithRetry, scheduleIdleReset]
  );

  /**
   * Fetch all readings from Firestore
   */
  const fetchReadings = useCallback(async (): Promise<Reading[]> => {
    if (!user) return [];
    if (isOffline()) {
      setSyncStatus('offline');
      return [];
    }

    try {
      setSyncStatus('syncing');
      const readings = await runWithRetry(() => getReadings(user.uid));
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      scheduleIdleReset();
      return readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
      setSyncStatus(isOffline() ? 'offline' : 'error');
      return [];
    }
  }, [user, isOffline, runWithRetry, scheduleIdleReset]);

  /**
   * Subscribe to real-time reading updates
   */
  const subscribeReadings = useCallback(
    (callback: (readings: Reading[]) => void) => {
      if (!user) return () => {};

      return subscribeToReadings(user.uid, (readings) => {
        callback(readings);
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      });
    },
    [user]
  );

  return {
    syncStatus,
    lastSyncTime,
    syncReading,
    syncUpdateReading,
    syncDeleteReading,
    fetchReadings,
    subscribeReadings,
  };
};
