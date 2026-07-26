import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || '127.0.0.1';
const firestorePort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || '8080');
const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1';
const authPort = Number(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || '9099');

let emulatorConnected = false;

// Initialize Firebase
function initializeFirebase() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side');
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Offline persistence, configured up front. Replaces the deprecated
    // enableIndexedDbPersistence() and uses multi-tab IndexedDB persistence, so
    // the cache works in every open tab instead of only the first one.
    const db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });

    // Connect local emulators for deterministic local development and tests.
    if (useEmulator && !emulatorConnected) {
      connectAuthEmulator(auth, `http://${authHost}:${authPort}`, {
        disableWarnings: true,
      });
      connectFirestoreEmulator(db, firestoreHost, firestorePort);
      emulatorConnected = true;
    }

    return { app, auth, db };
  }

  const app = getApps()[0];
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (useEmulator && !emulatorConnected) {
    connectAuthEmulator(auth, `http://${authHost}:${authPort}`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, firestoreHost, firestorePort);
    emulatorConnected = true;
  }

  return { app, auth, db };
}

// Lazy initialization
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;

export const getFirebaseApp = () => {
  if (!firebaseApp && typeof window !== 'undefined') {
    const { app } = initializeFirebase();
    firebaseApp = app;
  }
  return firebaseApp!;
};

export const getFirebaseAuth = () => {
  if (!firebaseAuth && typeof window !== 'undefined') {
    const { auth } = initializeFirebase();
    firebaseAuth = auth;
  }
  return firebaseAuth!;
};

export const getFirebaseDb = () => {
  if (!firebaseDb && typeof window !== 'undefined') {
    const { db } = initializeFirebase();
    firebaseDb = db;
  }
  return firebaseDb!;
};

// For backwards compatibility
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null;
export default typeof window !== 'undefined' ? getFirebaseApp() : null;
