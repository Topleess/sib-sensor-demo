"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventsCounterProps {
  count: number
}

export function EventsCounter({ count }: EventsCounterProps) {
  return (
    <Link href="/events">
      <Button variant="outline" size="sm" className="relative">
        <Bell className="h-4 w-4 mr-1" />
        События
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>
    </Link>
  )
}
