import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@stevederico/skateboard-ui/shadcn/ui/sheet';
import { Badge } from '@stevederico/skateboard-ui/shadcn/ui/badge';
import { Button } from '@stevederico/skateboard-ui/shadcn/ui/button';
import { Separator } from '@stevederico/skateboard-ui/shadcn/ui/separator';
import { ExternalLink, MapPin, Clock, DollarSign, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SchoolDetailSheet({ school, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!school) return null;

  const isPreschool = school.school_type === 'preschool';

  function handleViewOnMap() {
    onClose();
    navigate(`/app/map?highlight=${school.id}&type=${school.school_type}`);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-heading-md text-balance">{school.name}</SheetTitle>
          <SheetDescription className="sr-only">Details for {school.name}</SheetDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">
              {isPreschool ? 'Preschool' : 'Upper School'}
            </Badge>
            <Badge variant="outline">{school.program_type}</Badge>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="flex flex-col gap-4">
          <DetailRow icon={MapPin} label="Neighborhood" value={school.neighborhood} />
          <DetailRow icon={Users} label="Ages" value={school.ages} />
          <DetailRow
            icon={Clock}
            label="Hours"
            value={school.hours === 'Not publicly available' || school.hours === 'Not available' ? 'Contact school' : school.hours}
          />
          <DetailRow
            icon={DollarSign}
            label="Tuition"
            value={school.tuition === 'Not publicly available' ? 'Contact school' : school.tuition}
          />
          <DetailRow icon={GraduationCap} label="Program" value={school.program_type} />
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <Button asChild>
            <a href={school.url} target="_blank" rel="noopener noreferrer">
              Visit Website <ExternalLink className="ml-2 size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button variant="outline" onClick={handleViewOnMap}>
            <MapPin className="mr-2 size-4" aria-hidden="true" /> View on Map
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-label-sm text-muted-foreground">{label}</p>
        <p className="text-copy-md">{value}</p>
      </div>
    </div>
  );
}
