// src/components/map/LocationPicker.tsx
'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

const markerIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:#185FA5;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number }
  onChange: (lat: number, lng: number) => void
}

function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPicker({ initialLocation, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  )

  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation)
    }
  }, [initialLocation])

  const handleMapClick = (lat: number, lng: number) => {
    setPosition({ lat, lng })
    onChange(lat, lng)
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={position ? [position.lat, position.lng] : [6.1375, 1.2123]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onChange={handleMapClick} />
        {position && (
          <Marker 
            position={[position.lat, position.lng]} 
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const pos = marker.getLatLng()
                handleMapClick(pos.lat, pos.lng)
              },
            }}
          />
        )}
      </MapContainer>
      {!position && (
        <div className="absolute inset-0 z-[1000] bg-black/10 flex items-center justify-center pointer-events-none">
          <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-primary animate-bounce">
            Cliquez sur la carte pour choisir le lieu
          </div>
        </div>
      )}
    </div>
  )
}
