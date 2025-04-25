"use client"

import { DemoStandCard, DemoStandProps } from "@/components/demo-stand-card"

export interface DemoStandGroupProps {
  stands: DemoStandProps[]
  title?: string
  isGroupHighlighted?: boolean
}

export function DemoStandGroup({
  stands,
  title,
  isGroupHighlighted = false,
}: DemoStandGroupProps) {
  return (
    <div className={`rounded-lg p-2 ${isGroupHighlighted ? "bg-green-200" : ""}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-2 px-2">{title}</h3>
      )}
      <div className="grid gap-4">
        {stands.map((stand, index) => (
          <DemoStandCard
            key={index}
            {...stand}
            isHighlighted={isGroupHighlighted || stand.isHighlighted}
            icon={true}
          />
        ))}
      </div>
    </div>
  )
} 