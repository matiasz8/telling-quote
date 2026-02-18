import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

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

// Initialize Firebase
function initializeFirebase() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side');
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in first tab only');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support offline persistence');
      }
    });

    return { app, auth, db };
  }

  const app = getApps()[0];
  const auth = getAuth(app);
  const db = getFirestore(app);

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
