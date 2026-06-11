import { useState, useEffect, useCallback } from 'react';
import type { School } from './types';

const STORAGE_KEY = 'sfschools.favorites.v1';

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
 * Safe to mount in multiple components — each instance re-reads on mount and
 * writes back on every change. Cross-tab sync is not implemented (rare use case).
 */
export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return new Set<string>(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    } catch {
      // Quota exceeded or disabled — silently ignore
    }
  }, [favorites]);

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
