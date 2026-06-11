import { useState, useEffect, useCallback, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import constants from '../constants.json';
import type { School, SchoolFilters } from './types';

const BASE_URL = import.meta.env.DEV ? constants.devBackendURL : constants.backendURL;

/** Return shape of the useSchools hook. */
interface UseSchoolsResult {
  /** Schools matching the current server-side filters */
  schools: School[];
  /** Distinct neighborhood labels for the filter dropdown */
  neighborhoods: string[];
  /** Distinct program types for the filter dropdown */
  programTypes: string[];
  /** True while a fetch is in flight */
  isLoading: boolean;
  /** Human-readable error message, or null */
  error: string | null;
  /** Current filter state */
  filters: SchoolFilters;
  /** Update the filter state (triggers a debounced refetch) */
  setFilters: Dispatch<SetStateAction<SchoolFilters>>;
}

/**
 * Fetch schools (plus neighborhood/program-type metadata) from the backend,
 * debouncing refetches as filters change. Network failures surface via `error`.
 */
export function useSchools(): UseSchoolsResult {
  const [schools, setSchools] = useState<School[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SchoolFilters>({
    q: '',
    type: '',
    neighborhood: '',
    program_type: '',
    sector: '',
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSchools = useCallback(async (currentFilters: SchoolFilters) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (currentFilters.q) params.set('q', currentFilters.q);
    if (currentFilters.type) params.set('type', currentFilters.type);
    if (currentFilters.neighborhood) params.set('neighborhood', currentFilters.neighborhood);
    if (currentFilters.program_type) params.set('program_type', currentFilters.program_type);

    const qs = params.toString();
    const url = `${BASE_URL}/schools${qs ? `?${qs}` : ''}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch schools (${res.status})`);
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schools');
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [nbRes, ptRes] = await Promise.all([
          fetch(`${BASE_URL}/neighborhoods`),
          fetch(`${BASE_URL}/program-types`),
        ]);
        if (nbRes.ok) setNeighborhoods(await nbRes.json());
        if (ptRes.ok) setProgramTypes(await ptRes.json());
      } catch {
        // Non-critical, filters just won't populate
      }
    }
    fetchMeta();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSchools(filters), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, fetchSchools]);

  return { schools, neighborhoods, programTypes, isLoading, error, filters, setFilters };
}
