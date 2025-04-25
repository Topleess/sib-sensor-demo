"use client"

import { useState } from "react"
import { Thermometer, Droplet, Power, Zap, AlertTriangle, Car, Video, Shield } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type SensorType = "temperature" | "humidity" | "power" | "energy" | "alert" | "parking" | "camera" | "security"

interface SensorMarkerProps {
  id: string
  type: SensorType
  value: string
  unit?: string
  status?: "normal" | "warning" | "alert"
  positionX: number // в процентах от ширины родителя (0-100)
  positionY: number // в процентах от высоты родителя (0-100)
  description?: string
  onMarkerClick?: (id: string) => void
}

export function SensorMarker({
  id,
  type,
  value,
  unit = "",
  status = "normal",
  positionX,
  positionY,
  description,
  onMarkerClick
}: SensorMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Выбор иконки в зависимости от типа датчика
  const renderIcon = () => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "humidity":
        return <Droplet className="h-4 w-4" />
      case "power":
        return <Power className="h-4 w-4" />
      case "energy":
        return <Zap className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "camera":
        return <Video className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      default:
        return <Thermometer className="h-4 w-4" />
    }
  }
  
  // Выбор цвета в зависимости от статуса
  const getColorClass = () => {
    switch (status) {
      case "normal":
        return "bg-green-500 hover:bg-green-600"
      case "warning":
        return "bg-amber-500 hover:bg-amber-600"
      case "alert":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }
  
  const handleClick = () => {
    if (onMarkerClick) {
      onMarkerClick(id)
    }
  }
  
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`absolute cursor-pointer flex items-center justify-center rounded-full w-6 h-6 ${getColorClass()} text-white shadow-md transition-all duration-100 ${isHovered ? 'scale-125' : 'scale-100'}`}
            style={{ 
              left: `${positionX}%`, 
              top: `${positionY}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            {renderIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="p-0 overflow-hidden">
          <div className="bg-white rounded-md shadow-lg overflow-hidden">
            <div className={`${getColorClass().split(' ')[0]} p-2 text-white font-medium`}>
              {getTypeLabel(type)} {id}
            </div>
            <div className="p-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Значение:</span>
                <span className="font-bold">{value}{unit}</span>
              </div>
              {description && (
                <div className="text-sm text-gray-600 mt-1">{description}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Вспомогательная функция для получения русскоязычного названия типа
function getTypeLabel(type: SensorType): string {
  switch (type) {
    case "temperature":
      return "Температура"
    case "humidity":
      return "Влажность"
    case "power":
      return "Питание"
    case "energy":
      return "Энергия"
    case "alert":
      return "Тревога"
    case "parking":
      return "Парковка"
    case "camera":
      return "Камера"
    case "security":
      return "Охрана"
    default:
      return "Датчик"
  }
} 