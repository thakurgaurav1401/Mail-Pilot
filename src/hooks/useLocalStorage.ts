'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If no item in localStorage, and initialValue is different from current state,
        // it means we should probably set localStorage to initialValue.
        // This handles the case where the hook is used for the first time.
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue); 
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}" during hydration:`, error);
      // Keep initialValue if there's an error
      setStoredValue(initialValue);
      // Optionally set localStorage to initialValue in case of parsing error with existing data
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only run on mount and if key changes

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
