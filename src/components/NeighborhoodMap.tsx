import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import { SF_CENTER, DEFAULT_ZOOM } from './neighborhoods';
import type { School } from './types';

// Fix Leaflet default marker icons for Vite bundling
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/** Build a colored teardrop marker icon as an inline SVG data URL. */
function createSvgIcon(color: string): L.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 2.4.7 4.6 1.9 6.5L12.5 41l10.6-22c1.2-1.9 1.9-4.1 1.9-6.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
  </svg>`;
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });
}

const preschoolIcon = createSvgIcon('#3b82f6');
const upperschoolIcon = createSvgIcon('#8b5cf6');

/** Resolve a school's map position, falling back to the SF center. */
function getPosition(school: School): LatLngTuple {
  if (school.lat && school.lng) return [school.lat, school.lng];
  return [SF_CENTER.lat, SF_CENTER.lng];
}

/** Props for the FitBounds helper. */
interface FitBoundsProps {
  /** Schools whose positions define the viewport bounds */
  schools: School[];
}

/** Fits the map viewport to the bounds of the provided schools. Renders nothing. */
function FitBounds({ schools }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (schools.length === 0) return;

    const positions = schools
      .filter((s) => s.lat && s.lng)
      .map((s): LatLngTuple => [s.lat as number, s.lng as number]);

    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [schools, map]);

  return null;
}

/** Props for the neighborhood map. */
interface NeighborhoodMapProps {
  /** Schools to plot as markers */
  schools: School[];
  /** Called when a marker is clicked */
  onSchoolClick: (school: School) => void;
  /** Key of the school to visually highlight, or null */
  highlightId: string | null;
}

/**
 * Leaflet map plotting schools as colored markers, fit to their bounds.
 *
 * @component
 */
export default function NeighborhoodMap({ schools, onSchoolClick, highlightId }: NeighborhoodMapProps) {
  return (
    <MapContainer
      center={[SF_CENTER.lat, SF_CENTER.lng]}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full rounded-lg"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds schools={schools} />

      {schools.filter((s) => s.lat && s.lng).map((school) => {
        const position = getPosition(school);
        const isPreschool = school.school_type === 'preschool';
        const isHighlighted = highlightId === `${school.school_type}-${school.id}`;

        return (
          <Marker
            key={`${school.school_type}-${school.id}`}
            position={position}
            icon={isPreschool ? preschoolIcon : upperschoolIcon}
            opacity={isHighlighted ? 1 : 0.85}
            eventHandlers={{
              click: () => onSchoolClick(school),
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-sm">{school.name}</p>
                <p className="text-xs text-gray-500">{school.program_type}</p>
                <p className="text-xs">Ages {school.ages}</p>
                {school.address && <p className="text-xs text-gray-500">{school.address}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
