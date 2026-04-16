import { useState, useEffect, useCallback, useRef } from 'react';
import constants from '../constants.json';

const BASE_URL = import.meta.env.DEV ? constants.devBackendURL : constants.backendURL;

export function useSchools() {
  const [schools, setSchools] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    type: '',
    neighborhood: '',
    program_type: '',
    sector: '',
  });
  const debounceRef = useRef(null);

  const fetchSchools = useCallback(async (currentFilters) => {
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
      setError(err.message);
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
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchSchools]);

  return { schools, neighborhoods, programTypes, isLoading, error, filters, setFilters };
}
