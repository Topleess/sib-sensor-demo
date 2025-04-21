"use client"

import type React from "react"

import { useState } from "react"
import { Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: {
    id: number
    type: string
    title: string
    date: string
    time: string
    description: string
    recommendations: string
    severity: string
    color: string
  }
  onClick?: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <Card
      className={cn(
        `border-l-4 border-${event.color}-500 cursor-pointer hover:bg-gray-50 transition-colors`,
        isExpanded && "bg-gray-50",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">
              {event.date}, {event.time}
            </p>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="ml-2" onClick={handleToggleExpand}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="ml-2" onClick={onClick}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 pt-3 border-t">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-1">Описание</h4>
              <p className="text-sm">{event.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Важность</h4>
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

              <Button size="sm">Подробнее</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
