import type { MouseEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@stevederico/skateboard-ui/shadcn/ui/card';
import { Badge } from '@stevederico/skateboard-ui/shadcn/ui/badge';
import { Clock, DollarSign, Heart, Users } from 'lucide-react';
import { useFavorites } from './useFavorites';
import type { School } from './types';

/** Props for a single school card. */
interface SchoolCardProps {
  /** The school to render */
  school: School;
  /** Called when the card is activated (click or Enter/Space) */
  onClick: (school: School) => void;
}

/**
 * Determine if a school is public based on tuition starting with "Public".
 * Program type describes the grade levels offered, not the sector.
 */
function isPublicSchool(school: School): boolean {
  return (school.tuition || '').trim().startsWith('Public');
}

/**
 * Card summary of a school with badges, key facts, and a favorite toggle.
 *
 * @component
 */
export default function SchoolCard({ school, onClick }: SchoolCardProps) {
  const isPreschool = school.school_type === 'preschool';
  const isPublic = isPublicSchool(school);
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(school);

  function handleFavorite(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    toggle(school);
  }

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
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="secondary" className="text-copy-sm">
              {isPreschool ? 'Preschool' : 'Upper'}
            </Badge>
            {school.curated === false && (
              <Badge variant="outline" className="text-copy-sm">Added</Badge>
            )}
            <button
              type="button"
              onClick={handleFavorite}
              onKeyDown={(e) => e.stopPropagation()}
              className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label={fav ? `Unfavorite ${school.name}` : `Favorite ${school.name}`}
              aria-pressed={fav}
            >
              <Heart className={`size-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
            </button>
          </div>
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
