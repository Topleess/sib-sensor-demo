"use client"

import SecuritySidebar from "@/components/security-sidebar"

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SecuritySidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 