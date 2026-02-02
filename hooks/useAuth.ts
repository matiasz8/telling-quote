import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { onAuthStateChange, signInWithGoogle, signOut } from '@/lib/firebase/auth';
import { saveUserProfile } from '@/lib/firebase/firestore';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to manage authentication state
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });

      // Update user profile on sign-in
      if (user) {
        try {
          await saveUserProfile(user.uid, {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: user.metadata.creationTime
              ? (new Date(user.metadata.creationTime) as unknown as Timestamp)
              : (new Date() as unknown as Timestamp),
            lastSeen: new Date() as unknown as Timestamp,
          });
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithGoogle();
    } catch (err) {
      const error = err as Error;
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to sign in',
      }));
    }
  };

  const handleSignOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signOut();
    } catch (err) {
      const error = err as Error;
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to sign out',
      }));
    }
  };

  return {
    ...authState,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};
