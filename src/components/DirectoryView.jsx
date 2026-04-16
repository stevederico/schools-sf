import { useState } from 'react';
import { Spinner } from '@stevederico/skateboard-ui/shadcn/ui/spinner';
import { useSchools } from './useSchools.js';
import FilterBar from './FilterBar.jsx';
import SchoolCard from './SchoolCard.jsx';
import SchoolDetailSheet from './SchoolDetailSheet.jsx';
import { School } from 'lucide-react';

export default function DirectoryView() {
  const { schools, neighborhoods, programTypes, isLoading, error, filters, setFilters } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState(null);

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <header>
        <h1 className="text-heading-lg">School Directory</h1>
        <p className="text-copy-md text-muted-foreground mt-1">
          {isLoading ? 'Loading...' : `${schools.length} schools found`}
        </p>
      </header>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        neighborhoods={neighborhoods}
        programTypes={programTypes}
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <School className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-label-lg">Something went wrong</p>
          <p className="text-copy-md text-muted-foreground">{error}</p>
        </div>
      )}

      {!isLoading && !error && schools.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <School className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-label-lg">No schools match your filters</p>
          <p className="text-copy-md text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {!isLoading && !error && schools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((school) => (
            <SchoolCard
              key={`${school.school_type}-${school.id}`}
              school={school}
              onClick={setSelectedSchool}
            />
          ))}
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
