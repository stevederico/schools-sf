import { Card, CardHeader, CardTitle, CardContent } from '@stevederico/skateboard-ui/shadcn/ui/card';
import { Badge } from '@stevederico/skateboard-ui/shadcn/ui/badge';
import { Clock, DollarSign, Users } from 'lucide-react';

/**
 * Determine if a school is public based on tuition starting with "Public".
 * Program type describes the grade levels offered, not the sector.
 */
function isPublicSchool(school) {
  return (school.tuition || '').trim().startsWith('Public');
}

export default function SchoolCard({ school, onClick }) {
  const isPreschool = school.school_type === 'preschool';
  const isPublic = isPublicSchool(school);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onClick(school)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${school.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(school); } }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-label-lg leading-snug">{school.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-copy-sm">
            {isPreschool ? 'Preschool' : 'Upper'}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {school.neighborhood && (
            <Badge variant="secondary" className="text-copy-sm">{school.neighborhood}</Badge>
          )}
          {school.program_type && (
            <Badge variant="secondary" className="text-copy-sm">{school.program_type}</Badge>
          )}
          <Badge variant="secondary" className="text-copy-sm">
            {isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 text-copy-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Ages {school.ages}</span>
        </div>
        {school.hours && school.hours !== 'Not publicly available' && school.hours !== 'Not available' && (
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{school.hours}</span>
          </div>
        )}
        {school.tuition && school.tuition !== 'Not publicly available' && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{school.tuition}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
