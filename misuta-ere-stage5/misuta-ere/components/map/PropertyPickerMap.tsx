'use client'

import { MapContainer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MAP_BOUNDS, MAP_IMAGE_SIZE, MAP_IMAGE_URL } from './mapConfig'
import 'leaflet/dist/leaflet.css'

export type LatLng = { lat: number; lng: number }

type Props = {
  value: LatLng | null
  onChange: (pos: LatLng) => void
}

function pickerIcon() {
  return L.divIcon({
    className: 'misuta-picker-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #b91c1c;
        border: 3px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

/** 地図クリックを拾って親に座標を伝えるだけの内部コンポーネント */
function ClickHandler({ onChange }: { onChange: Props['onChange'] }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function PropertyPickerMap({ value, onChange }: Props) {
  const icon = pickerIcon()

  return (
    <div className="w-full h-full rounded-sm overflow-hidden border border-neutral-300">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={MAP_BOUNDS}
        maxBounds={MAP_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={-2}
        maxZoom={2}
        zoom={0}
        center={[MAP_IMAGE_SIZE[0] / 2, MAP_IMAGE_SIZE[1] / 2]}
        style={{ width: '100%', height: '100%', background: '#e5e0d8' }}
        attributionControl={false}
      >
        <ImageOverlay url={MAP_IMAGE_URL} bounds={MAP_BOUNDS} />
        <ClickHandler onChange={onChange} />

        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={icon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target as L.Marker
                const pos = marker.getLatLng()
                onChange({ lat: pos.lat, lng: pos.lng })
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
