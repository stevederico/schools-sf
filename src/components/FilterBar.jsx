import { Input } from '@stevederico/skateboard-ui/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@stevederico/skateboard-ui/shadcn/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@stevederico/skateboard-ui/shadcn/ui/tabs';
import { Search } from 'lucide-react';

export default function FilterBar({ filters, setFilters, neighborhoods, programTypes }) {
  function updateFilter(key, value) {
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

      <Select value={filters.neighborhood || 'all'} onValueChange={(v) => updateFilter('neighborhood', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full md:w-48" aria-label="Filter by neighborhood">
          <SelectValue placeholder="Neighborhood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Neighborhoods</SelectItem>
          {neighborhoods.map((n) => (
            <SelectItem key={n} value={n}>{n}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.program_type || 'all'} onValueChange={(v) => updateFilter('program_type', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full md:w-44" aria-label="Filter by program type">
          <SelectValue placeholder="Program Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {programTypes.map((pt) => (
            <SelectItem key={pt} value={pt}>{pt}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tabs value={filters.type || 'all'} onValueChange={(v) => updateFilter('type', v === 'all' ? '' : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="preschool">Preschool</TabsTrigger>
          <TabsTrigger value="upperschool">Upper</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
