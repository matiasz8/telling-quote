import { useState, useCallback } from 'react';
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

  /**
   * Sync a reading to Firestore if user is signed in
   */
  const syncReading = useCallback(
    async (reading: Reading): Promise<void> => {
      if (!user) return;

      try {
        setSyncStatus('syncing');
        await saveReading(user.uid, reading);
        setSyncStatus('synced');
        setLastSyncTime(new Date());

        // Reset to idle after 2 seconds
        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (error) {
        console.error('Error syncing reading:', error);
        setSyncStatus('error');
        throw error;
      }
    },
    [user]
  );

  /**
   * Update a reading in Firestore
   */
  const syncUpdateReading = useCallback(
    async (readingId: string, updates: Partial<Reading>): Promise<void> => {
      if (!user) return;

      try {
        setSyncStatus('syncing');
        await updateReading(user.uid, readingId, updates);
        setSyncStatus('synced');
        setLastSyncTime(new Date());

        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (error) {
        console.error('Error updating reading:', error);
        setSyncStatus('error');
        throw error;
      }
    },
    [user]
  );

  /**
   * Delete a reading from Firestore
   */
  const syncDeleteReading = useCallback(
    async (readingId: string): Promise<void> => {
      if (!user) return;

      try {
        setSyncStatus('syncing');
        await deleteReading(user.uid, readingId);
        setSyncStatus('synced');
        setLastSyncTime(new Date());

        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (error) {
        console.error('Error deleting reading:', error);
        setSyncStatus('error');
        throw error;
      }
    },
    [user]
  );

  /**
   * Fetch all readings from Firestore
   */
  const fetchReadings = useCallback(async (): Promise<Reading[]> => {
    if (!user) return [];

    try {
      setSyncStatus('syncing');
      const readings = await getReadings(user.uid);
      setSyncStatus('synced');
      setLastSyncTime(new Date());

      setTimeout(() => setSyncStatus('idle'), 2000);
      return readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
      setSyncStatus('error');
      return [];
    }
  }, [user]);

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
