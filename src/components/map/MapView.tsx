// src/components/map/MapView.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Marqueurs custom SVG
const createIcon = (color: string) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

const lostIcon = createIcon('#A32D2D')
const foundIcon = createIcon('#0F6E56')

interface MapViewProps {
  items: Item[]
  center?: [number, number]
  zoom?: number
}

export default function MapView({ 
  items, 
  center = [6.1375, 1.2123], 
  zoom = 13 
}: MapViewProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {items.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.location.latitude, item.location.longitude]}
            icon={item.type === 'LOST' ? lostIcon : foundIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1 max-w-[200px]">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Badge className={item.type === 'LOST' ? 'bg-danger' : 'bg-secondary'}>
                    {item.type === 'LOST' ? 'Perdu' : 'Trouvé'}
                  </Badge>
                  <span className="text-[10px] text-neutral-400">
                    {format(new Date(item.date), 'dd MMM', { locale: fr })}
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1 line-clamp-1">{item.title}</h4>
                <p className="text-xs text-neutral-500 mb-3 line-clamp-2 leading-tight">
                  {item.location.address}
                </p>
                <Link href={`/annonces/${item.id}`} className="w-full">
                  <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary-dark">
                    Voir le détail
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
