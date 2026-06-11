/**
 * Shared domain types for the schools directory.
 *
 * A `School` record as returned by the backend `/schools` endpoint. Most fields
 * are free-form strings sourced from public listings, so optional/loose typing
 * mirrors the real-world data (many fields can be missing or "Not available").
 */
export interface School {
  /** Stable record id within its school_type collection */
  id: string | number;
  /** Discriminates collections: 'preschool' or 'upperschool' */
  school_type: string;
  /** Display name */
  name: string;
  /** Neighborhood label (e.g. "Pacific Heights") */
  neighborhood?: string;
  /** Program/grade-level description (e.g. "Preschool/Daycare") */
  program_type?: string;
  /** Age range served (e.g. "2-5") */
  ages?: string;
  /** Operating hours, may be "Not available" */
  hours?: string;
  /** Tuition string — inconsistent formats, parsed by tuitionSort */
  tuition?: string;
  /** Street address */
  address?: string;
  /** External website URL */
  url?: string;
  /** Latitude for map placement */
  lat?: number;
  /** Longitude for map placement */
  lng?: number;
}

/** Active filter state for the schools directory. */
export interface SchoolFilters {
  /** Free-text search query */
  q: string;
  /** School type tab: '' | 'preschool' | 'upperschool' */
  type: string;
  /** Selected neighborhood, '' for all */
  neighborhood: string;
  /** Selected program type, '' for all */
  program_type: string;
  /** Sector filter: '' | 'public' | 'private' */
  sector: string;
}

/** Sort option for the tuition column. '' means default (unsorted) order. */
export type SortOption = '' | 'price-asc' | 'price-desc';
