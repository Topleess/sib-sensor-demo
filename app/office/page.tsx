"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RoomSensorOverlay } from "@/components/room-sensor-overlay"

// Данные датчиков для комнаты 9 (конференц-зал)
const room9Sensors = [
  {
    id: "T-101",
    type: "temperature" as const,
    value: "24.3",
    unit: "°C",
    status: "warning" as const,
    positionX: 20,
    positionY: 40,
    description: "Датчик возле окна"
  },
  {
    id: "H-102",
    type: "humidity" as const,
    value: "58",
    unit: "%",
    status: "normal" as const,
    positionX: 35,
    positionY: 70,
    description: "Центр помещения"
  },
  {
    id: "A-103",
    type: "alert" as const,
    value: "Открыто",
    status: "alert" as const,
    positionX: 80,
    positionY: 30,
    description: "Окно открыто"
  }
];

// Данные датчиков для комнаты 10 (офис разработки)
const room10Sensors = [
  {
    id: "T-201",
    type: "temperature" as const,
    value: "22.1",
    unit: "°C",
    status: "normal" as const,
    positionX: 25,
    positionY: 50,
    description: "Рабочая зона"
  },
  {
    id: "T-202",
    type: "temperature" as const,
    value: "22.8",
    unit: "°C",
    status: "normal" as const,
    positionX: 75,
    positionY: 50,
    description: "Зона отдыха"
  }
];

// Данные датчиков для комнаты 7 (кухня)
const room7Sensors = [
  {
    id: "T-301",
    type: "temperature" as const,
    value: "21.8",
    unit: "°C",
    status: "normal" as const,
    positionX: 50,
    positionY: 50,
    description: "Центр кухни"
  },
  {
    id: "P-302",
    type: "power" as const,
    value: "1.2",
    unit: "кВт",
    status: "warning" as const,
    positionX: 30,
    positionY: 70,
    description: "Потребление холодильника"
  }
];

// Данные датчиков для комнаты 1 (серверная)
const room1Sensors = [
  {
    id: "T-401",
    type: "temperature" as const,
    value: "19.5",
    unit: "°C",
    status: "normal" as const,
    positionX: 40,
    positionY: 40,
    description: "Общая температура"
  },
  {
    id: "H-402",
    type: "humidity" as const,
    value: "45",
    unit: "%",
    status: "warning" as const,
    positionX: 60,
    positionY: 60,
    description: "Влажность ниже нормы"
  },
  {
    id: "E-403",
    type: "energy" as const,
    value: "5.8",
    unit: "кВт",
    status: "normal" as const,
    positionX: 20,
    positionY: 70,
    description: "Потребление стойки"
  }
];

export default function OfficeDashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Дашборд офиса</h1>
        <p className="text-sm text-gray-500">Обновлено 16:30</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Блоки с помещениями офиса */}
        <div className="grid md:col-span-2 grid-cols-2 gap-4">
          <div className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                <Image 
                  src="/images/rooms/room9.png" 
                  alt="План комнаты 9" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
                <RoomSensorOverlay sensors={room9Sensors} />
              </div>
              <div className="p-4">
                <p className="font-medium text-lg">Конференц-зал</p>
                <p className="text-sm text-gray-500">24.3°C</p>
              </div>
            </Card>
          </div>
          
          <div className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                <Image 
                  src="/images/rooms/room10.png" 
                  alt="План комнаты 10" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
                <RoomSensorOverlay sensors={room10Sensors} />
              </div>
              <div className="p-4">
                <p className="font-medium text-lg">Офис разработки</p>
                <p className="text-sm text-gray-500">22.1°C</p>
              </div>
            </Card>
          </div>
          
          <div className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                <Image 
                  src="/images/rooms/room7.png" 
                  alt="План комнаты 7" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
                <RoomSensorOverlay sensors={room7Sensors} />
              </div>
              <div className="p-4">
                <p className="font-medium text-lg">Кухня</p>
                <p className="text-sm text-gray-500">21.8°C</p>
              </div>
            </Card>
          </div>
          
          <div className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                <Image 
                  src="/images/rooms/room1.png" 
                  alt="План комнаты 1" 
                  fill 
                  className="object-contain" 
                  unoptimized
                />
                <RoomSensorOverlay sensors={room1Sensors} />
              </div>
              <div className="p-4">
                <p className="font-medium text-lg">Серверная</p>
                <p className="text-sm text-gray-500">19.5°C</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Правая часть - События */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>События</CardTitle>
            <CardDescription>Последние события в офисе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between">
                  <h3 className="font-medium">Перегрев участка</h3>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Активно
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Место:</span> Офис разработки
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">23.04.2024, 15:30</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    Квитировать
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between">
                  <h3 className="font-medium">Превышение порога температуры</h3>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Активно
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Место:</span> Конференц-зал
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">22.04.2024, 08:45</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    Квитировать
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
                <div className="flex justify-between">
                  <h3 className="font-medium">Низкая влажность в серверной</h3>
                  <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                    Предупреждение
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Место:</span> Серверная
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">21.04.2024, 14:20</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    Квитировать
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between">
                  <h3 className="font-medium">Открыто окно в конференц-зале</h3>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Активно
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Место:</span> Конференц-зал
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">21.04.2024, 10:15</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    Квитировать
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/office/events" className="text-sm text-blue-600 hover:underline flex justify-between items-center">
                <span>Смотреть все события</span>
                <span>→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 