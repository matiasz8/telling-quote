import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Reading } from '@/types';

/**
 * Get all readings for a user
 */
export async function getUserReadings(userId: string): Promise<Reading[]> {
  try {
    const readingsRef = collection(db, 'users', userId, 'readings');
    const q = query(readingsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const readings: Reading[] = [];
    querySnapshot.forEach((doc) => {
      readings.push({ id: doc.id, ...doc.data() } as Reading);
    });
    
    return readings;
  } catch (error) {
    console.error('Error fetching readings:', error);
    throw new Error('Failed to fetch readings. Please try again.');
  }
}

/**
 * Get a single reading by ID
 */
export async function getReading(userId: string, readingId: string): Promise<Reading | null> {
  try {
    const readingRef = doc(db, 'users', userId, 'readings', readingId);
    const docSnap = await getDoc(readingRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Reading;
    }
    return null;
  } catch (error) {
    console.error('Error fetching reading:', error);
    throw new Error('Failed to fetch reading. Please try again.');
  }
}

/**
 * Create a new reading
 */
export async function createReading(userId: string, reading: Omit<Reading, 'id'>): Promise<string> {
  try {
    const readingsRef = collection(db, 'users', userId, 'readings');
    const newReadingRef = doc(readingsRef);
    
    await setDoc(newReadingRef, {
      ...reading,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return newReadingRef.id;
  } catch (error) {
    console.error('Error creating reading:', error);
    throw new Error('Failed to create reading. Please try again.');
  }
}

/**
 * Update an existing reading
 */
export async function updateReading(
  userId: string,
  readingId: string,
  updates: Partial<Omit<Reading, 'id'>>
): Promise<void> {
  try {
    const readingRef = doc(db, 'users', userId, 'readings', readingId);
    
    await updateDoc(readingRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating reading:', error);
    throw new Error('Failed to update reading. Please try again.');
  }
}

/**
 * Delete a reading
 */
export async function deleteReading(userId: string, readingId: string): Promise<void> {
  try {
    const readingRef = doc(db, 'users', userId, 'readings', readingId);
    await deleteDoc(readingRef);
  } catch (error) {
    console.error('Error deleting reading:', error);
    throw new Error('Failed to delete reading. Please try again.');
  }
}

/**
 * Get readings by tag
 */
export async function getReadingsByTag(userId: string, tag: string): Promise<Reading[]> {
  try {
    const readingsRef = collection(db, 'users', userId, 'readings');
    const q = query(
      readingsRef,
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const readings: Reading[] = [];
    querySnapshot.forEach((doc) => {
      readings.push({ id: doc.id, ...doc.data() } as Reading);
    });
    
    return readings;
  } catch (error) {
    console.error('Error fetching readings by tag:', error);
    throw new Error('Failed to fetch readings. Please try again.');
  }
}
