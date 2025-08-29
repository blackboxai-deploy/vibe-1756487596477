'use client';

import { useState } from 'react';

// Custom hook for managing localStorage state
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing localStorage with object updates
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
): [T, (updates: Partial<T>) => void, (value: T) => void] {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const updateValue = (updates: Partial<T>) => {
    setValue(prev => ({ ...prev, ...updates }));
  };

  return [value, updateValue, setValue];
}

// Hook for managing arrays in localStorage
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [T[], {
  add: (item: T) => void;
  remove: (predicate: (item: T) => boolean) => void;
  update: (predicate: (item: T) => boolean, updates: Partial<T>) => void;
  set: (items: T[]) => void;
  clear: () => void;
}] {
  const [items, setItems] = useLocalStorage(key, initialValue);

  const add = (item: T) => {
    setItems(prev => [...prev, item]);
  };

  const remove = (predicate: (item: T) => boolean) => {
    setItems(prev => prev.filter(item => !predicate(item)));
  };

  const update = (predicate: (item: T) => boolean, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      predicate(item) ? { ...item, ...updates } : item
    ));
  };

  const set = (newItems: T[]) => {
    setItems(newItems);
  };

  const clear = () => {
    setItems([]);
  };

  return [items, { add, remove, update, set, clear }];
}