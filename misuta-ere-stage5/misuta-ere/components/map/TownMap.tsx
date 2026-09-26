'use client'

import { useRouter } from 'next/navigation'
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { createPropertyIcon } from './PropertyMarker'
import { MAP_BOUNDS, MAP_IMAGE_SIZE, MAP_IMAGE_URL } from './mapConfig'
import type { Property } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

type TownMapProps = {
  properties: Property[]
  /** false の場合、マーカークリックで詳細ページへ遷移しない（詳細ページ内のミニ地図表示用） */
  linkToDetail?: boolean
}

export default function TownMap({ properties, linkToDetail = true }: TownMapProps) {
  const router = useRouter()
  const icon = createPropertyIcon('published')

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

        {properties.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={icon}
            eventHandlers={
              linkToDetail
                ? { click: () => router.push(`/properties/${p.id}`) }
                : undefined
            }
          >
            <Popup>
              <div className="text-xs max-w-[180px]">
                <p className="font-bold mb-1">{p.title}</p>
                <p className="text-neutral-500">{p.event_date}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
