"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplet, AlertTriangle, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SecuritySensorOverlay } from "@/components/security-sensor-overlay"

// Моковые данные для графиков
const weekData = [
  { day: "Пн", гвс: 65, хвс: 10, лэп: 43 },
  { day: "Вт", гвс: 67, хвс: 9, лэп: 44 },
  { day: "Ср", гвс: 66, хвс: 8, лэп: 42 },
  { day: "Чт", гвс: 65, хвс: 7, лэп: 41 },
  { day: "Пт", гвс: 68, хвс: 9, лэп: 43 },
  { day: "Сб", гвс: 65, хвс: 10, лэп: 42 },
  { day: "Вс", гвс: 64, хвс: 10, лэп: 42 },
];

// Данные для термограммы
const thermalData = [
  { value: 0, color: "#eef2ff" },   // холодно
  { value: 50, color: "#fef9c3" },  // тепло
  { value: 100, color: "#e11d48" }, // горячо
  { value: 150, color: "#9f1239" }, // очень горячо
  { value: 200, color: "#4c1d95" }, // критически горячо
];

const events = [
  {
    id: 1,
    title: "Утечка теплоносителя",
    location: "235 м от начала",
    status: "Активно",
    date: "24.04.2024, 10:15"
  },
  {
    id: 2,
    title: "Утечка холодной воды",
    location: "83 м от начала",
    status: "Активно",
    date: "23.04.2024, 15:30"
  },
  {
    id: 3,
    title: "Перегрев кабеля",
    location: "на расстоянии 230 м",
    status: "Активно",
    date: "22.04.2024, 08:45"
  }
];

// Данные датчиков на трубопроводе
const pipelineSensors = [
  {
    id: "T-101",
    type: "temperature" as const,
    value: "65,2°C",
    status: "normal" as const,
    positionX: 25,
    positionY: 25,
    description: "Датчик ГВС"
  },
  {
    id: "T-102",
    type: "temperature" as const,
    value: "9,8°C",
    status: "normal" as const,
    positionX: 40,
    positionY: 50,
    description: "Датчик ХВС"
  },
  {
    id: "T-103",
    type: "alert" as const,
    value: "Утечка!",
    status: "alert" as const,
    positionX: 75,
    positionY: 25,
    description: "Датчик утечки ГВС"
  },
  {
    id: "T-104",
    type: "alert" as const,
    value: "Утечка!",
    status: "alert" as const,
    positionX: 18,
    positionY: 50,
    description: "Датчик утечки ХВС"
  },
  {
    id: "T-105",
    type: "energy" as const,
    value: "42,5°C",
    status: "warning" as const,
    positionX: 70,
    positionY: 75,
    description: "Датчик ЛЭП (перегрев)"
  },
];

export default function TechDashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Технологии</h1>
        <p className="text-sm text-gray-500">Обновлено 16:30</p>
      </div>

      {/* Основная секция с картой, температурами и событиями */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Левая колонка: карта и термограмма */}
        <div className="lg:col-span-2 space-y-6">
          {/* Карта */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image 
              src="/images/tech/doc_2025-04-25_04-02-10.png"
              alt="Карта трубопровода"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Индикаторы датчиков */}
            <SecuritySensorOverlay sensors={pipelineSensors} />
          </div>
          
          {/* Термограмма под картой */}
          <Card className="h-auto flex flex-col mb-0">
            <CardHeader className="pb-2">
              <CardTitle>Термограмма</CardTitle>
              <CardDescription>Визуализация тепловых характеристик</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 pt-2 flex-1 flex flex-col">
              <div className="h-20 rounded-md overflow-hidden flex mb-2">
                {thermalData.map((item, index) => (
                  <div 
                    key={index} 
                    className="h-full flex-1" 
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>0°C</span>
                <span>50°C</span>
                <span>100°C</span>
                <span>150°C</span>
                <span>200°C</span>
                <span>250°C</span>
                <span>300°C</span>
                <span>350°C</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Правая колонка: события и температуры */}
        <div className="lg:col-span-1 space-y-6">
          {/* События */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>События</CardTitle>
              <CardDescription>Текущие активные события</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Место:</span> {event.location}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <button className="text-xs text-blue-600 hover:underline">
                        Квитировать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/tech/events" className="text-sm text-blue-600 hover:underline flex justify-between items-center">
                  <span>Смотреть все события</span>
                  <span>→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Актуальные показатели температуры - вертикально */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Температура ГВС</p>
                  <p className="text-4xl font-bold text-red-500">65,2°C</p>
                  <p className="text-xs text-green-500 mt-1">
                    +2°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-red-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Температура ХВС</p>
                  <p className="text-4xl font-bold text-blue-500">9,8°C</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +0°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-blue-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Электропередача</p>
                  <p className="text-4xl font-bold text-amber-500">42,5°C</p>
                  <p className="text-xs text-amber-500 mt-1">
                    -1°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-orange-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Графики температур - увеличенные */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура ГВС</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[50, 80]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="гвс" 
                  name="Температура ГВС" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 5 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура ХВС</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[4, 12]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="хвс" 
                  name="Температура ХВС" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 5 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура ЛЭП</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[35, 50]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="лэп" 
                  name="Температура ЛЭП" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={{ r: 5 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 