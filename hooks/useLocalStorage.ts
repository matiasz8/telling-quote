'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_EVENTS } from '@/lib/constants';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize with a function to read from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    // During SSR, always return initial value
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Persist to localStorage whenever value changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    console.log(`[useLocalStorage ${key}] setValue called`);
    try {
      // Use functional update to get current value
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        console.log(`[useLocalStorage ${key}] setValue: currentValue length:`, Array.isArray(currentValue) ? currentValue.length : 'N/A');
        console.log(`[useLocalStorage ${key}] setValue: newValue length:`, Array.isArray(valueToStore) ? valueToStore.length : 'N/A');
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Trigger custom event for same-page sync
          // Only dispatch if value actually changed
          const hasChanged = JSON.stringify(valueToStore) !== JSON.stringify(currentValue);
          console.log(`[useLocalStorage ${key}] setValue: dispatching event?`, hasChanged);
          if (hasChanged) {
            const event = new CustomEvent(STORAGE_EVENTS.CHANGE, {
              detail: { key, value: valueToStore },
            });
            window.dispatchEvent(event);
          }
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  // Listen for changes from other tabs/windows and same page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleCustomStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>;
      console.log(`[useLocalStorage ${key}] handleCustomStorageChange: received event for key`, customEvent.detail.key);
      if (customEvent.detail.key === key) {
        // Only update if value actually changed to avoid duplicate updates
        setStoredValue((currentValue) => {
          const newValue = customEvent.detail.value;
          const isSame = JSON.stringify(newValue) === JSON.stringify(currentValue);
          console.log(`[useLocalStorage ${key}] handleCustomStorageChange: isSame?`, isSame);
          if (isSame) {
            return currentValue; // No change, don't trigger re-render
          }
          console.log(`[useLocalStorage ${key}] handleCustomStorageChange: updating value`);
          return newValue;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(STORAGE_EVENTS.CHANGE, handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(STORAGE_EVENTS.CHANGE, handleCustomStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}