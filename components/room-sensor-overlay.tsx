"use client"

import { useState } from "react"
import { SensorMarker } from "@/components/ui/sensor-marker"

export type SensorData = {
  id: string
  type: "temperature" | "humidity" | "power" | "energy" | "alert"
  value: string
  unit?: string
  status?: "normal" | "warning" | "alert"
  positionX: number
  positionY: number
  description?: string
}

interface RoomSensorOverlayProps {
  sensors: SensorData[]
  onSensorClick?: (sensorId: string) => void
}

export function RoomSensorOverlay({ sensors, onSensorClick }: RoomSensorOverlayProps) {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
  
  const handleMarkerClick = (id: string) => {
    setSelectedSensor(id)
    if (onSensorClick) {
      onSensorClick(id)
    }
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sensors.map((sensor) => (
        <div key={sensor.id} className="pointer-events-auto">
          <SensorMarker 
            id={sensor.id}
            type={sensor.type}
            value={sensor.value}
            unit={sensor.unit}
            status={sensor.status}
            positionX={sensor.positionX}
            positionY={sensor.positionY}
            description={sensor.description}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      ))}
    </div>
  )
} 