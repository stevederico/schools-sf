import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@stevederico/skateboard-ui/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@stevederico/skateboard-ui/shadcn/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@stevederico/skateboard-ui/shadcn/ui/tabs';
import { Search } from 'lucide-react';
import type { SchoolFilters, SortOption } from './types';

/** Props for the schools filter toolbar. */
interface FilterBarProps {
  /** Current filter state */
  filters: SchoolFilters;
  /** Setter for the filter state */
  setFilters: Dispatch<SetStateAction<SchoolFilters>>;
  /** Available neighborhood options */
  neighborhoods: string[];
  /** Available program-type options */
  programTypes: string[];
  /** Current sort selection */
  sort: SortOption;
  /** Called when the sort selection changes */
  onSortChange: (sort: SortOption) => void;
}

/**
 * Toolbar of search, neighborhood/program/sector dropdowns, a type tab group,
 * and a tuition sort selector. Drives the DirectoryView's filtering.
 *
 * @component
 */
export default function FilterBar({ filters, setFilters, neighborhoods, programTypes, sort, onSortChange }: FilterBarProps) {
  function updateFilter(key: keyof SchoolFilters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search schools..."
          value={filters.q}
          onChange={(e) => updateFilter('q', e.target.value)}
          className="pl-9"
          aria-label="Search schools by name"
        />
      </div>

      <Select value={filters.neighborhood || 'all'} onValueChange={(v) => updateFilter('neighborhood', !v || v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full md:w-48" aria-label="Filter by neighborhood">
          <SelectValue placeholder="All Neighborhoods" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Neighborhoods</SelectItem>
          {neighborhoods.map((n) => (
            <SelectItem key={n} value={n}>{n}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.program_type || 'all'} onValueChange={(v) => updateFilter('program_type', !v || v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full md:w-44" aria-label="Filter by program type">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {programTypes.map((pt) => (
            <SelectItem key={pt} value={pt}>{pt}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.sector || 'all'} onValueChange={(v) => updateFilter('sector', !v || v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full md:w-32" aria-label="Filter by public or private">
          <SelectValue placeholder="All Sectors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sectors</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>

      <Tabs value={filters.type || 'all'} onValueChange={(v) => updateFilter('type', v === 'all' ? '' : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="preschool">Preschool</TabsTrigger>
          <TabsTrigger value="upperschool">Upper</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select value={sort || 'default'} onValueChange={(v) => onSortChange(v === 'price-asc' || v === 'price-desc' ? v : '')}>
        <SelectTrigger className="w-full md:w-44" aria-label="Sort schools">
          <SelectValue placeholder="Sort: Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort: Default</SelectItem>
          <SelectItem value="price-asc">Price: Low → High</SelectItem>
          <SelectItem value="price-desc">Price: High → Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
