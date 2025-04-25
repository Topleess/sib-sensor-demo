"use client"

import ParkingSidebar from "@/components/parking-sidebar"

export default function ParkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <ParkingSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 