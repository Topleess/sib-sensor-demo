"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface EventItemProps {
  event: {
    id: number
    type: string
    title: string
    location?: string
    distance?: string
    time?: string
    date?: string
    description?: string
    recommendations?: string
    severity?: string
    status: string
    color: string
  }
}

export function EventItem({ event }: EventItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col py-2 border-b border-gray-100 last:border-0">
        <div className="flex justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            <div className="flex justify-between">
              <span className="font-medium">{event.title}</span>
              <span className="text-sm">{event.distance || ""}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{event.location || event.time || ""}</span>
              <span>{event.status}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="ml-2 text-xs h-8 px-2">
            Квитировать
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-${event.color}-500 mr-2`} />
              {event.title}
            </DialogTitle>
            <DialogDescription>
              {event.location || ""} {event.date || ""} {event.time || ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {event.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Описание</h4>
                <p className="text-sm">{event.description}</p>
              </div>
            )}

            {event.recommendations && (
              <div>
                <h4 className="text-sm font-medium mb-1">Рекомендации</h4>
                <p className="text-sm">{event.recommendations}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              {event.severity && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Важность</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : event.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {event.severity === "high" ? "Высокая" : event.severity === "medium" ? "Средняя" : "Низкая"}
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-1">Статус</h4>
                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">{event.status}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Закрыть
            </Button>
            <Button>Создать заявку</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
