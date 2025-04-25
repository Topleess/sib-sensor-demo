"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ParkingSensorOverlay } from "@/components/parking-sensor-overlay"

// Данные датчиков парковки
const parkingSensors = [
  {
    id: "P-A12",
    type: "parking" as const,
    value: "Свободно",
    status: "normal" as const,
    positionX: 38,
    positionY: 24,
    description: "Парковочное место #A12"
  },
  {
    id: "P-B23",
    type: "parking" as const,
    value: "Занято",
    status: "warning" as const,
    positionX: 45,
    positionY: 30,
    description: "Парковочное место #B23"
  },
  {
    id: "P-C34",
    type: "alert" as const,
    value: "Проблема",
    status: "alert" as const,
    positionX: 56,
    positionY: 38,
    description: "Причина: Неисправность датчика"
  },
  {
    id: "P-D45",
    type: "parking" as const,
    value: "Свободно",
    status: "normal" as const,
    positionX: 60,
    positionY: 50,
    description: "Доступно с: 11:15"
  },
  {
    id: "P-E56",
    type: "parking" as const,
    value: "Занято",
    status: "warning" as const,
    positionX: 30,
    positionY: 45,
    description: "Время занятия: 10:45"
  },
];

export default function ParkingDashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Паркинг</h1>
        <p className="text-sm text-gray-500">Обновлено 16:30</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative h-[650px] w-full rounded-md overflow-hidden border">
            <Image 
              src="/images/parking/doc_2025-04-25_04-01-08.png"
              alt="Карта парковки"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
            <ParkingSensorOverlay sensors={parkingSensors} />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>События</CardTitle>
              <CardDescription>Последние события на парковке</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Срабатывание датчика CO</h3>
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                      Предупреждение
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Сектор А
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">24.04.2024, 11:32</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Неисправность шлагбаума</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Центральный въезд
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">23.04.2024, 18:45</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Срабатывание пожарного датчика</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Сектор С
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">22.04.2024, 09:15</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/parking/events" className="text-sm text-blue-600 hover:underline flex justify-between items-center">
                  <span>Смотреть все события</span>
                  <span>→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 