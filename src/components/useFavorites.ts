import { useState, useEffect, useCallback } from 'react';
import type { School } from './types';

const STORAGE_KEY = 'sfschools.favorites.v1';
/** Same-tab signal so the directory and the detail sheet share one saved set. */
const FAVORITES_EVENT = 'sfschools-favorites-changed';

/** Read the saved favorite keys. Invalid storage becomes an empty set. */
function readStoredFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const keys: string[] = [];
    for (const item of parsed) {
      if (typeof item === 'string') keys.push(item);
    }
    return new Set(keys);
  } catch {
    return new Set();
  }
}

/** True when both sets contain the same keys. */
function sameFavorites(left: Set<string>, right: Set<string>): boolean {
  if (left.size !== right.size) return false;
  for (const key of left) {
    if (!right.has(key)) return false;
  }
  return true;
}

/** Minimal identity fields needed to build a favorite key. */
type SchoolIdentity = Pick<School, 'school_type' | 'id'>;

/** Return shape of the useFavorites hook. */
interface UseFavoritesResult {
  /** Set of favorite keys currently saved */
  favorites: Set<string>;
  /** Toggle a school's favorited state */
  toggle: (school: SchoolIdentity) => void;
  /** Whether a school is currently favorited */
  isFavorite: (school: SchoolIdentity) => boolean;
}

/**
 * Build a stable key for a school based on type + id. Mirrors the render key
 * used in DirectoryView so favorites can be matched against schools from the API.
 */
export function favoriteKey(school: SchoolIdentity): string {
  return `${school.school_type}-${school.id}`;
}

/**
 * Hook for persisting favorited schools in localStorage. Returns the current
 * Set of favorite keys, a toggle function, and a membership check.
 *
 * Safe to mount in multiple components. A write in one instance (the detail
 * sheet, the card, the directory) reloads the others in this tab and in other tabs.
 */
export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Set<string>>(readStoredFavorites);

  useEffect(() => {
    const serialized = JSON.stringify([...favorites].sort());
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== serialized) {
        window.localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      // Quota exceeded or disabled — silently ignore
    }
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  }, [favorites]);

  useEffect(() => {
    /** Pull the saved set into this instance when another one writes it. */
    function reload(): void {
      const next = readStoredFavorites();
      setFavorites((prev) => (sameFavorites(prev, next) ? prev : next));
    }
    window.addEventListener('storage', reload);
    window.addEventListener(FAVORITES_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(FAVORITES_EVENT, reload);
    };
  }, []);

  const toggle = useCallback((school: SchoolIdentity) => {
    const key = favoriteKey(school);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (school: SchoolIdentity) => favorites.has(favoriteKey(school)),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
