import { useEffect } from "react";
import { Alert, Box, Loader, Stack, Text } from "@mantine/core";
import { IconMapPinOff } from "@tabler/icons-react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const defaultCenter = [12.8797, 121.774];

function createFarmMarkerIcon(name) {
  const safeName = String(name ?? "Farm")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return L.divIcon({
    className: "farm-marker-wrapper",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="
          background:#6A0DAD;
          color:#fff;
          border:2px solid #E6CCFF;
          width:16px;
          height:16px;
          border-radius:999px;
          box-shadow:0 2px 10px rgba(106,13,173,.35);
        "></div>
        <div style="
          background:#ffffff;
          color:#6A0DAD;
          border:1px solid #E6CCFF;
          border-radius:999px;
          padding:2px 8px;
          font-size:11px;
          font-weight:600;
          white-space:nowrap;
          max-width:180px;
          overflow:hidden;
          text-overflow:ellipsis;
          box-shadow:0 2px 8px rgba(0,0,0,.08);
        ">${safeName}</div>
      </div>
    `,
    iconSize: [24, 40],
    iconAnchor: [12, 16],
    popupAnchor: [0, -8],
  });
}

function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) {
      map.setView(defaultCenter, 6);
      return;
    }

    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }, [map, markers]);

  return null;
}

function FocusMarker({ marker }) {
  const map = useMap();

  useEffect(() => {
    if (!marker) return;
    map.setView([marker.lat, marker.lng], 15, { animate: true });
  }, [map, marker]);

  return null;
}

export default function FarmMap({
  markers = [],
  loading = false,
  error = null,
  focusedMarkerId = null,
  onMarkerSelect = null,
}) {
  const focusedMarker =
    focusedMarkerId != null
      ? markers.find((marker) => marker.id === focusedMarkerId)
      : null;

  if (loading) {
    return (
      <Stack align="center" justify="center" h={320}>
        <Loader size="sm" />
        <Text size="sm" c="dimmed">Loading farm locations...</Text>
      </Stack>
    );
  }

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  if (!markers.length) {
    return (
      <Stack align="center" justify="center" h={320} c="dimmed" gap="xs">
        <IconMapPinOff size={20} />
        <Text size="sm">No farm coordinates available yet.</Text>
      </Stack>
    );
  }

  return (
    <Box h={360} style={{ borderRadius: 12, overflow: "hidden" }}>
      <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!focusedMarker && <FitBounds markers={markers} />}
        <FocusMarker marker={focusedMarker} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createFarmMarkerIcon(marker.name)}
            eventHandlers={
              onMarkerSelect
                ? {
                    click: () => onMarkerSelect(marker.id),
                  }
                : undefined
            }
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.farm?.address || "No address provided"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
