import { useState, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '@stevederico/skateboard-ui/shadcn/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@stevederico/skateboard-ui/shadcn/ui/toggle-group';
import { useSchools } from './useSchools.js';
import FilterBar from './FilterBar.jsx';
import SchoolCard from './SchoolCard.jsx';
import SchoolDetailSheet from './SchoolDetailSheet.jsx';
import { School, List, Map as MapIcon } from 'lucide-react';

const NeighborhoodMap = lazy(() => import('./NeighborhoodMap.jsx'));

/**
 * Unified browse view for schools — toggles between list (grid of cards) and map.
 * View mode and highlight state persist in the URL via query params.
 */
export default function DirectoryView() {
  const { schools, neighborhoods, programTypes, isLoading, error, filters, setFilters } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'map' ? 'map' : 'list';

  const highlightId = useMemo(() => {
    const id = searchParams.get('highlight');
    const type = searchParams.get('type');
    return id && type ? `${type}-${id}` : null;
  }, [searchParams]);

  // Public/private client-side filter — public schools are marked via program_type
  // starting with "Public" (e.g., "Public Pre-K/TK", "Public Elementary") or
  // tuition "Public (free)". Excludes "Not publicly available" etc.
  const filteredSchools = useMemo(() => {
    if (!filters.sector) return schools;
    const isPublic = (s) =>
      (s.program_type || '').trim().startsWith('Public') ||
      (s.tuition || '').trim().startsWith('Public');
    if (filters.sector === 'public') return schools.filter(isPublic);
    if (filters.sector === 'private') return schools.filter((s) => !isPublic(s));
    return schools;
  }, [schools, filters.sector]);

  function setView(values) {
    // base-ui ToggleGroup passes an array; keep the last-selected value and
    // ignore empty arrays (clicking the active button) to prevent deselecting both
    const v = Array.isArray(values) ? values[values.length - 1] : values;
    if (!v) return;
    const next = new URLSearchParams(searchParams);
    if (v === 'map') next.set('view', 'map');
    else next.delete('view');
    setSearchParams(next, { replace: true });
  }

  const countLabel = isLoading
    ? 'Loading...'
    : `${filteredSchools.length} school${filteredSchools.length === 1 ? '' : 's'} found`;

  return (
    <main className={view === 'map' ? 'flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 gap-4' : 'flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full'}>
      {view === 'list' && (
        <header>
          <h1 className="text-heading-lg">School Directory</h1>
          <p className="text-copy-md text-muted-foreground mt-1">{countLabel}</p>
        </header>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 min-w-0">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            neighborhoods={neighborhoods}
            programTypes={programTypes}
          />
        </div>
        <ToggleGroup value={[view]} onValueChange={setView} variant="outline" aria-label="View mode">
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="map" aria-label="Map view">
            <MapIcon className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading && (
        <div className={view === 'map' ? 'flex flex-1 justify-center items-center' : 'flex justify-center py-16'}>
          <Spinner />
        </div>
      )}

      {error && (
        <div className={view === 'map' ? 'flex flex-1 flex-col items-center justify-center gap-3 text-center' : 'flex flex-col items-center gap-3 py-16 text-center'}>
          <School className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-label-lg">Something went wrong</p>
          <p className="text-copy-md text-muted-foreground">{error}</p>
        </div>
      )}

      {!isLoading && !error && view === 'list' && filteredSchools.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <School className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-label-lg">No schools match your filters</p>
          <p className="text-copy-md text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {!isLoading && !error && view === 'list' && filteredSchools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => (
            <SchoolCard
              key={`${school.school_type}-${school.id}`}
              school={school}
              onClick={setSelectedSchool}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && view === 'map' && (
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-border">
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}>
            <NeighborhoodMap
              schools={filteredSchools}
              onSchoolClick={setSelectedSchool}
              highlightId={highlightId}
            />
          </Suspense>
        </div>
      )}

      <SchoolDetailSheet
        school={selectedSchool}
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
      />
    </main>
  );
}
