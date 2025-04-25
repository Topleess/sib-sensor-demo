"use client"

import { useState } from "react"
import { Calendar, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EventItem } from "@/components/event-item"

export default function ParkingEventsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">События паркинга</h1>
      <p>Здесь будет отображаться список событий паркинга.</p>
    </div>
  )
}
