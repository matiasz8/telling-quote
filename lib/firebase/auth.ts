import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  deleteUser,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    const error = err as Error;
    console.error('Error signing in with Google:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (err) {
    const error = err as Error;
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }

  try {
    await deleteUser(user);
  } catch (err) {
    const error = err as Error;
    console.error('Error deleting account:', error);
    throw new Error(error.message || 'Failed to delete account');
  }
};
