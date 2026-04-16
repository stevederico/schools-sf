import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NEIGHBORHOOD_COORDS, SF_CENTER, DEFAULT_ZOOM } from './neighborhoods.js';

// Fix Leaflet default marker icons for Vite bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function createSvgIcon(color) {
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

const SF_BOUNDS = { minLat: 37.5, maxLat: 38.0, minLng: -122.6, maxLng: -122.1 };

function isInSFArea(coords) {
  return coords.lat >= SF_BOUNDS.minLat && coords.lat <= SF_BOUNDS.maxLat
    && coords.lng >= SF_BOUNDS.minLng && coords.lng <= SF_BOUNDS.maxLng;
}

function getMarkerPosition(school, index, schoolsAtSameNeighborhood) {
  const coords = NEIGHBORHOOD_COORDS[school.neighborhood] || SF_CENTER;
  if (schoolsAtSameNeighborhood <= 1) return [coords.lat, coords.lng];

  const angle = (index * 2 * Math.PI) / schoolsAtSameNeighborhood;
  const radius = 0.001 + (index % 3) * 0.0005;
  return [
    coords.lat + radius * Math.cos(angle),
    coords.lng + radius * Math.sin(angle),
  ];
}

function FitBounds({ schools }) {
  const map = useMap();

  useEffect(() => {
    if (schools.length === 0) return;

    const sfPositions = schools
      .map((s) => NEIGHBORHOOD_COORDS[s.neighborhood])
      .filter(Boolean)
      .filter(isInSFArea)
      .map((c) => [c.lat, c.lng]);

    if (sfPositions.length > 0) {
      const bounds = L.latLngBounds(sfPositions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [schools, map]);

  return null;
}

export default function NeighborhoodMap({ schools, onSchoolClick, highlightId }) {
  const neighborhoodCounts = {};
  const neighborhoodIndexes = {};

  for (const school of schools) {
    const key = school.neighborhood || 'unknown';
    neighborhoodCounts[key] = (neighborhoodCounts[key] || 0) + 1;
    neighborhoodIndexes[key] = 0;
  }

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

      {schools.map((school) => {
        const key = school.neighborhood || 'unknown';
        const idx = neighborhoodIndexes[key]++;
        const total = neighborhoodCounts[key];
        const position = getMarkerPosition(school, idx, total);
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
                <p className="text-xs text-gray-500">{school.neighborhood}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
