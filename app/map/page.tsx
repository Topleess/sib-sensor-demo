"use client"

import { useState } from "react"
import { Plus, Minus, Layers, MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function MapPage() {
  const [view, setView] = useState("2D")
  const [displayMode, setDisplayMode] = useState("map")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const events = [
    {
      id: 1,
      type: "leak",
      title: "Утечка на расстоянии 120 м от входа",
      date: "24.04.2024",
      time: "10:15",
      description:
        "Обнаружена утечка горячей воды на расстоянии 120 метров от входа в коллектор. Температурные датчики зафиксировали аномальное повышение температуры в данной точке.",
      recommendations: "Рекомендуется направить ремонтную бригаду для локализации и устранения утечки.",
      severity: "high",
      location: { x: 250, y: 80 },
    },
    {
      id: 2,
      type: "overheat",
      title: "Перегрев участка",
      date: "23.04.2024",
      time: "15:30",
      description:
        "Зафиксирован перегрев участка трубопровода горячего водоснабжения на расстоянии 85-90 метров от входа.",
      recommendations: "Необходимо проверить состояние изоляции трубопровода на данном участке.",
      severity: "medium",
      location: { x: 180, y: 80 },
    },
  ]

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">Карта</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={displayMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setDisplayMode("map")}
              className="flex items-center"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Карта
            </Button>
            <Button
              variant={displayMode === "scheme" ? "default" : "outline"}
              size="sm"
              onClick={() => setDisplayMode("scheme")}
              className="flex items-center"
            >
              <Layers className="h-4 w-4 mr-2" />
              Мнемосхема
            </Button>
            <Button
              variant={displayMode === "split" ? "default" : "outline"}
              size="sm"
              onClick={() => setDisplayMode("split")}
            >
              Разделить
            </Button>
          </div>

          <div className="bg-gray-100 rounded-lg flex">
            <Button
              variant={view === "2D" ? "default" : "ghost"}
              className="rounded-l-lg rounded-r-none"
              onClick={() => setView("2D")}
            >
              2D
            </Button>
            <Button
              variant={view === "3D" ? "default" : "ghost"}
              className="rounded-r-lg rounded-l-none"
              onClick={() => setView("3D")}
            >
              3D
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {displayMode === "split" ? (
          <div className="grid grid-cols-2 h-full">
            {/* Map view */}
            <div className="relative border-r">
              <div className="absolute inset-0 bg-gray-100">
                {/* Red line (hot water) */}
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1 bg-red-500" />
                <div className="absolute top-1/3 left-1/4 w-1 h-1/3 bg-red-500" />

                {/* Blue line (cold water) */}
                <div className="absolute top-2/3 left-1/4 w-1/2 h-1 bg-blue-500" />

                {/* Yellow line (electricity) */}
                <div className="absolute top-1/2 left-1/2 w-1/4 h-1 bg-yellow-500" />

                {/* Event markers */}
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${event.location.y}px`, left: `${event.location.x}px` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className={`w-6 h-6 bg-${event.type === "leak" ? "red" : "orange"}-200 rounded-full flex items-center justify-center animate-pulse`}
                    >
                      <div className={`w-4 h-4 bg-${event.type === "leak" ? "red" : "orange"}-500 rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <Button variant="secondary" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon">
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              {/* Map legend */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Горячая вода</span>
                </div>
                <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Холодная вода</span>
                </div>
                <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Электросеть</span>
                </div>
              </div>
            </div>

            {/* Mnemonic scheme */}
            <div className="relative">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Background grid */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" />
                </pattern>
                <rect width="400" height="300" fill="url(#grid)" />

                {/* Main collector structure */}
                <rect x="50" y="50" width="300" height="200" fill="none" stroke="#666" strokeWidth="2" />

                {/* Hot water line */}
                <path d="M 50 80 H 350" stroke="#e11d48" strokeWidth="4" />

                {/* Cold water line */}
                <path d="M 50 120 H 350" stroke="#2563eb" strokeWidth="4" />

                {/* Electrical line */}
                <path d="M 50 160 H 350" stroke="#eab308" strokeWidth="4" />

                {/* Leak point */}
                <circle
                  cx="250"
                  cy="80"
                  r="6"
                  fill="#e11d48"
                  className="animate-pulse cursor-pointer"
                  onClick={() => handleEventClick(events[0])}
                />

                {/* Overheat area */}
                <rect
                  x="180"
                  y="75"
                  width="30"
                  height="10"
                  fill="#f97316"
                  className="animate-pulse cursor-pointer"
                  onClick={() => handleEventClick(events[1])}
                />

                {/* Labels */}
                <text x="20" y="85" fontSize="10" fill="#666">
                  ГВС
                </text>
                <text x="20" y="125" fontSize="10" fill="#666">
                  ХВС
                </text>
                <text x="20" y="165" fontSize="10" fill="#666">
                  ЭС
                </text>

                {/* Entry point */}
                <text x="50" y="40" fontSize="10" fill="#666">
                  Вход
                </text>
                <path d="M 50 45 V 55" stroke="#666" strokeWidth="1" />
              </svg>
            </div>
          </div>
        ) : (
          <>
            {displayMode === "map" && (
              <div className="absolute inset-0 bg-gray-100">
                {/* Red line (hot water) */}
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1 bg-red-500" />
                <div className="absolute top-1/3 left-1/4 w-1 h-1/3 bg-red-500" />

                {/* Blue line (cold water) */}
                <div className="absolute top-2/3 left-1/4 w-1/2 h-1 bg-blue-500" />

                {/* Yellow line (electricity) */}
                <div className="absolute top-1/2 left-1/2 w-1/4 h-1 bg-yellow-500" />

                {/* Event markers */}
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${event.location.y}px`, left: `${event.location.x}px` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className={`w-6 h-6 bg-${event.type === "leak" ? "red" : "orange"}-200 rounded-full flex items-center justify-center animate-pulse`}
                    >
                      <div className={`w-4 h-4 bg-${event.type === "leak" ? "red" : "orange"}-500 rounded-full`} />
                    </div>
                  </div>
                ))}

                {/* Map controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <Button variant="secondary" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Map legend */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Горячая вода</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Холодная вода</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Электросеть</span>
                  </div>
                </div>
              </div>
            )}

            {displayMode === "scheme" && (
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 800 600">
                  {/* Background grid */}
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" />
                  </pattern>
                  <rect width="800" height="600" fill="url(#grid)" />

                  {/* Main collector structure */}
                  <rect x="100" y="100" width="600" height="400" fill="none" stroke="#666" strokeWidth="2" />

                  {/* Hot water line */}
                  <path d="M 100 160 H 700" stroke="#e11d48" strokeWidth="4" />

                  {/* Cold water line */}
                  <path d="M 100 240 H 700" stroke="#2563eb" strokeWidth="4" />

                  {/* Electrical line */}
                  <path d="M 100 320 H 700" stroke="#eab308" strokeWidth="4" />

                  {/* Leak point */}
                  <circle
                    cx="500"
                    cy="160"
                    r="8"
                    fill="#e11d48"
                    className="animate-pulse cursor-pointer"
                    onClick={() => handleEventClick(events[0])}
                  />

                  {/* Overheat area */}
                  <rect
                    x="360"
                    y="155"
                    width="60"
                    height="10"
                    fill="#f97316"
                    className="animate-pulse cursor-pointer"
                    onClick={() => handleEventClick(events[1])}
                  />

                  {/* Labels */}
                  <text x="80" y="165" fontSize="14" fill="#666">
                    ГВС
                  </text>
                  <text x="80" y="245" fontSize="14" fill="#666">
                    ХВС
                  </text>
                  <text x="80" y="325" fontSize="14" fill="#666">
                    ЭС
                  </text>

                  {/* Entry point */}
                  <text x="100" y="80" fontSize="14" fill="#666">
                    Вход
                  </text>
                  <path d="M 100 85 V 100" stroke="#666" strokeWidth="2" />

                  {/* Additional elements */}
                  <circle cx="200" cy="160" r="6" fill="#666" />
                  <text x="210" y="150" fontSize="12" fill="#666">
                    Клапан 1
                  </text>

                  <circle cx="400" cy="160" r="6" fill="#666" />
                  <text x="410" y="150" fontSize="12" fill="#666">
                    Клапан 2
                  </text>

                  <circle cx="600" cy="160" r="6" fill="#666" />
                  <text x="610" y="150" fontSize="12" fill="#666">
                    Клапан 3
                  </text>

                  <circle cx="200" cy="240" r="6" fill="#666" />
                  <text x="210" y="230" fontSize="12" fill="#666">
                    Клапан 4
                  </text>

                  <circle cx="400" cy="240" r="6" fill="#666" />
                  <text x="410" y="230" fontSize="12" fill="#666">
                    Клапан 5
                  </text>

                  <circle cx="600" cy="240" r="6" fill="#666" />
                  <text x="610" y="230" fontSize="12" fill="#666">
                    Клапан 6
                  </text>
                </svg>
              </div>
            )}
          </>
        )}

        {/* Event popup */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full bg-${selectedEvent?.type === "leak" ? "red" : "orange"}-500 mr-2`}
                />
                {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent?.date}, {selectedEvent?.time}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Описание</h4>
                <p className="text-sm">{selectedEvent?.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Рекомендации</h4>
                <p className="text-sm">{selectedEvent?.recommendations}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium mb-1">Важность</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedEvent?.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : selectedEvent?.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedEvent?.severity === "high"
                      ? "Высокая"
                      : selectedEvent?.severity === "medium"
                        ? "Средняя"
                        : "Низкая"}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Статус</h4>
                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Активно</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                Закрыть
              </Button>
              <Button>Создать заявку</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
