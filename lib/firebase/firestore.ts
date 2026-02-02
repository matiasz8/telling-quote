import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import { Reading, Settings, AccessibilitySettings } from '@/types';

/**
 * Firestore data types
 */
export interface FirestoreReading extends Omit<Reading, 'createdAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSettings extends Settings {
  updatedAt: Timestamp;
}

export interface FirestoreAccessibilitySettings extends AccessibilitySettings {
  updatedAt: Timestamp;
}

/**
 * User profile
 */
export interface UserProfile {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Timestamp;
  lastSeen: Timestamp;
}

/**
 * Get user's readings collection reference
 */
const getReadingsRef = (uid: string) => {
  const db = getFirebaseDb();
  return collection(db, 'users', uid, 'readings');
};

/**
 * Get user's settings document reference
 */
const getSettingsRef = (uid: string) => {
  const db = getFirebaseDb();
  return doc(db, 'users', uid, 'settings', 'preferences');
};

/**
 * Get user's accessibility settings document reference
 */
const getAccessibilityRef = (uid: string) => {
  const db = getFirebaseDb();
  return doc(db, 'users', uid, 'settings', 'accessibility');
};

/**
 * Create or update user profile
 */
export const saveUserProfile = async (uid: string, profile: Partial<UserProfile>) => {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid, 'profile', 'info');
  await setDoc(
    userRef,
    {
      ...profile,
      lastSeen: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid, 'profile', 'info');
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
};

/**
 * Save a reading to Firestore
 */
export const saveReading = async (uid: string, reading: Reading) => {
  const readingRef = doc(getReadingsRef(uid), reading.id);
  await setDoc(readingRef, {
    ...reading,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update a reading in Firestore
 */
export const updateReading = async (
  uid: string,
  readingId: string,
  updates: Partial<Reading>
) => {
  const readingRef = doc(getReadingsRef(uid), readingId);
  await updateDoc(readingRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a reading from Firestore
 */
export const deleteReading = async (uid: string, readingId: string) => {
  const readingRef = doc(getReadingsRef(uid), readingId);
  await deleteDoc(readingRef);
};

/**
 * Get all readings for a user
 */
export const getReadings = async (uid: string): Promise<Reading[]> => {
  const q = query(getReadingsRef(uid), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as FirestoreReading;
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    };
  });
};

/**
 * Listen to real-time reading changes
 */
export const subscribeToReadings = (uid: string, callback: (readings: Reading[]) => void) => {
  const q = query(getReadingsRef(uid), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const readings = snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreReading;
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
    callback(readings);
  });
};

/**
 * Save settings to Firestore
 */
export const saveSettings = async (uid: string, settings: Settings) => {
  const settingsRef = getSettingsRef(uid);
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get settings from Firestore
 */
export const getSettings = async (uid: string): Promise<Settings | null> => {
  const settingsRef = getSettingsRef(uid);
  const docSnap = await getDoc(settingsRef);
  return docSnap.exists() ? (docSnap.data() as Settings) : null;
};

/**
 * Save accessibility settings to Firestore
 */
export const saveAccessibilitySettings = async (
  uid: string,
  settings: AccessibilitySettings
) => {
  const accessibilityRef = getAccessibilityRef(uid);
  await setDoc(accessibilityRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get accessibility settings from Firestore
 */
export const getAccessibilitySettings = async (
  uid: string
): Promise<AccessibilitySettings | null> => {
  const accessibilityRef = getAccessibilityRef(uid);
  const docSnap = await getDoc(accessibilityRef);
  return docSnap.exists() ? (docSnap.data() as AccessibilitySettings) : null;
};

/**
 * Delete all user data (for account deletion)
 */
export const deleteAllUserData = async (uid: string) => {
  const db = getFirebaseDb();
  
  // Delete all readings
  const readingsSnapshot = await getDocs(getReadingsRef(uid));
  const readingDeletePromises = readingsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(readingDeletePromises);

  // Delete settings
  await deleteDoc(getSettingsRef(uid));
  await deleteDoc(getAccessibilityRef(uid));

  // Delete profile
  const profileRef = doc(db, 'users', uid, 'profile', 'info');
  await deleteDoc(profileRef);
};
