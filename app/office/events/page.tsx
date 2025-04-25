"use client"

import { useState } from "react"
import { Calendar, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EventItem } from "@/components/event-item"

export default function EventsPage() {
  const [filter, setFilter] = useState("all")

  const events = [
    {
      id: 1,
      type: "leak",
      title: "Утечка на расстоянии 120 м от входа",
      date: "24.04.2024",
      time: "10:15",
      status: "active",
      severity: "high",
      color: "red",
      description:
        "Обнаружена утечка горячей воды на расстоянии 120 метров от входа в коллектор. Температурные датчики зафиксировали аномальное повышение температуры в данной точке.",
      recommendations:
        "Рекомендуется направить ремонтную бригаду для локализации и устранения утечки. Необходимо взять с собой инструменты для работы с трубами диаметром 100мм.",
    },
    {
      id: 2,
      type: "overheat",
      title: "Перегрев участка",
      date: "23.04.2024",
      time: "15:30",
      status: "active",
      severity: "medium",
      color: "red",
      description:
        "Зафиксирован перегрев участка трубопровода горячего водоснабжения на расстоянии 85-90 метров от входа. Температура превышает допустимые значения на 15°C.",
      recommendations:
        "Необходимо проверить состояние изоляции трубопровода и работу регулирующей арматуры на данном участке.",
    },
    {
      id: 3,
      type: "threshold",
      title: "Превышение порога температуры на линии ГВ",
      date: "22.04.2024",
      time: "08:45",
      status: "resolved",
      severity: "low",
      color: "yellow",
      description:
        "Зафиксировано превышение порогового значения температуры на линии горячего водоснабжения. Текущая температура: 72°C, пороговое значение: 70°C.",
      recommendations:
        "Рекомендуется проверить работу регулирующих клапанов и настройки температурного режима в системе.",
    },
    {
      id: 4,
      type: "leak",
      title: "Утечка на расстоянии 85 м от входа",
      date: "20.04.2024",
      time: "12:10",
      status: "resolved",
      severity: "high",
      color: "red",
      description:
        "Обнаружена утечка горячей воды на расстоянии 85 метров от входа в коллектор. Утечка устранена ремонтной бригадой.",
      recommendations: "Рекомендуется провести дополнительную проверку данного участка через 24 часа.",
    },
    {
      id: 5,
      type: "threshold",
      title: "Превышение порога температуры на линии ЭС",
      date: "19.04.2024",
      time: "14:20",
      status: "resolved",
      severity: "medium",
      color: "yellow",
      description:
        "Зафиксировано превышение порогового значения температуры на линии электроснабжения. Проблема устранена.",
      recommendations: "Рекомендуется провести профилактический осмотр электрооборудования.",
    },
  ]

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.status === filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">События</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>За все время</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span>Фильтр</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <div className="border-b px-4 py-3 flex space-x-4">
          <Button variant={filter === "all" ? "default" : "ghost"} size="sm" onClick={() => setFilter("all")}>
            Все
          </Button>
          <Button variant={filter === "active" ? "default" : "ghost"} size="sm" onClick={() => setFilter("active")}>
            Активные
          </Button>
          <Button variant={filter === "resolved" ? "default" : "ghost"} size="sm" onClick={() => setFilter("resolved")}>
            Решенные
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {filteredEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      </Card>
    </div>
  )
}
