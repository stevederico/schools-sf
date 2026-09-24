import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@stevederico/skateboard-ui/shadcn/ui/sheet';
import { Badge } from '@stevederico/skateboard-ui/shadcn/ui/badge';
import { Button } from '@stevederico/skateboard-ui/shadcn/ui/button';
import { Clock, DollarSign, ExternalLink, Heart, MapPin, Users } from 'lucide-react';
import { useSafeNavigate } from '@stevederico/skateboard-ui/Utilities';
import { useFavorites } from './useFavorites';
import type { School } from './types';

/** Props for the school detail side sheet. */
interface SchoolDetailSheetProps {
  /** School to display, or null when nothing is selected */
  school: School | null;
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Called to close the sheet */
  onClose: () => void;
}

/**
 * Slide-over sheet showing a single school's full details with website,
 * map, and favorite actions. Renders nothing when no school is selected.
 *
 * @component
 */
export default function SchoolDetailSheet({ school, isOpen, onClose }: SchoolDetailSheetProps) {
  const navigate = useSafeNavigate();
  const { toggle, isFavorite } = useFavorites();

  if (!school) return null;
  const selected = school;

  const isPreschool = selected.school_type === 'preschool';
  const fav = isFavorite(selected);
  const hasHours = selected.hours && selected.hours !== 'Not publicly available' && selected.hours !== 'Not available' && selected.hours !== 'N/A';
  const hasTuition = selected.tuition && selected.tuition !== 'Not publicly available' && selected.tuition !== 'N/A';

  function handleViewOnMap() {
    onClose();
    navigate(`/app/home?highlight=${selected.id}&type=${selected.school_type}`);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto p-6">
        <SheetHeader className="gap-0 pb-0">
          <SheetTitle className="text-heading-md text-balance pr-6">{school.name}</SheetTitle>
          <SheetDescription className="sr-only">Details for {school.name}</SheetDescription>
          <div className="flex flex-wrap gap-1.5 pt-2">
            <Badge variant="secondary">{isPreschool ? 'Preschool' : 'Upper School'}</Badge>
            {school.program_type !== 'Preschool' && school.program_type !== 'Preschool/Daycare' && (
              <Badge variant="outline">{school.program_type}</Badge>
            )}
          </div>
        </SheetHeader>

        {school.address && (
          <p className="text-copy-md text-muted-foreground mt-3">{school.address}</p>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5">
          <InfoCell label="Neighborhood" value={school.neighborhood} />
          <InfoCell label="Ages" value={school.ages} />
          {hasHours && <InfoCell label="Hours" value={school.hours} />}
          {hasTuition && <InfoCell label="Tuition" value={school.tuition} />}
        </div>

        <div className="flex gap-2 mt-6">
          {school.url && school.url !== 'N/A' && (
            <Button className="flex-1" onClick={() => window.open(school.url, '_blank', 'noopener,noreferrer')}>
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Website
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={handleViewOnMap}>
            <MapPin className="size-3.5" aria-hidden="true" />
            Map
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggle(school)}
            aria-label={fav ? `Unfavorite ${school.name}` : `Favorite ${school.name}`}
            aria-pressed={fav}
          >
            <Heart className={`size-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Props for a single labeled detail cell. */
interface InfoCellProps {
  /** Field label */
  label: string;
  /** Field value; the cell renders nothing when falsy */
  value?: string | null;
}

/** A labeled value cell; renders nothing when the value is empty. */
function InfoCell({ label, value }: InfoCellProps) {
  if (!value) return null;
  return (
    <div>
      <p className="text-label-sm text-muted-foreground">{label}</p>
      <p className="text-copy-md mt-0.5">{value}</p>
    </div>
  );
}
