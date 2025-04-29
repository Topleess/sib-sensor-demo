"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SecuritySensorOverlay } from "@/components/security-sensor-overlay"

// Данные датчиков безопасности
const securitySensors = [
  {
    id: "S-101",
    type: "security" as const,
    value: "Активен",
    status: "normal" as const,
    positionX: 25,
    positionY: 20,
    description: "Датчик движения"
  },
  {
    id: "S-102",
    type: "security" as const,
    value: "Активен",
    status: "normal" as const,
    positionX: 35,
    positionY: 35,
    description: "Датчик влажности"
  },
  {
    id: "S-103",
    type: "alert" as const,
    value: "Тревога!",
    status: "alert" as const,
    positionX: 30,
    positionY: 50,
    description: "Датчик дыма"
  },
  {
    id: "S-104",
    type: "security" as const,
    value: "Активен",
    status: "normal" as const,
    positionX: 60,
    positionY: 60,
    description: "Датчик температуры"
  },
  {
    id: "S-105",
    type: "security" as const,
    value: "Активен",
    status: "normal" as const,
    positionX: 75,
    positionY: 40,
    description: "Датчик давления"
  },
];

export default function SecurityDashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Коллекторы (безопасность)</h1>
        <p className="text-sm text-gray-500">Обновлено 16:30</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative h-[650px] w-full rounded-md overflow-hidden border">
            <Image 
              src="/images/tech/doc_2025-04-25_04-02-10.png"
              alt="Карта коллекторов"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
            <SecuritySensorOverlay sensors={securitySensors} />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>События</CardTitle>
              <CardDescription>Последние события безопасности</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Несанкционированный доступ</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Южная сторона
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">24.04.2024, 13:45</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Срабатывание датчика дыма</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Центральный узел
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">23.04.2024, 22:10</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Разбито стекло</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Место:</span> Восточная сторона
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">22.04.2024, 02:35</p>
                    <button className="text-xs text-blue-600 hover:underline">
                      Квитировать
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/security/events" className="text-sm text-blue-600 hover:underline flex justify-between items-center">
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