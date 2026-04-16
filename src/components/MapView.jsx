import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '@stevederico/skateboard-ui/shadcn/ui/spinner';
import { useSchools } from './useSchools.js';
import FilterBar from './FilterBar.jsx';
import NeighborhoodMap from './NeighborhoodMap.jsx';
import SchoolDetailSheet from './SchoolDetailSheet.jsx';
import { School } from 'lucide-react';

export default function MapView() {
  const { schools, neighborhoods, programTypes, isLoading, error, filters, setFilters } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchParams] = useSearchParams();

  const highlightId = useMemo(() => {
    const id = searchParams.get('highlight');
    const type = searchParams.get('type');
    return id && type ? `${type}-${id}` : null;
  }, [searchParams]);

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 gap-4">
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        neighborhoods={neighborhoods}
        programTypes={programTypes}
      />

      {isLoading && (
        <div className="flex flex-1 justify-center items-center">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <School className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-label-lg">Failed to load schools</p>
          <p className="text-copy-md text-muted-foreground">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-border">
          <NeighborhoodMap
            schools={schools}
            onSchoolClick={setSelectedSchool}
            highlightId={highlightId}
          />
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
