"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface DemoStandProps {
  title: string
  audience: string
  description: string
  icon?: React.ReactNode
  href: string
  isHighlighted?: boolean
  className?: string
}

export function DemoStandCard({
  title,
  audience,
  description,
  icon,
  href,
  isHighlighted = false,
  className,
}: DemoStandProps) {
  return (
    <Link href={href} className="block no-underline">
      <Card 
        className={cn(
          "h-full transition-all hover:shadow-md", 
          isHighlighted ? "border-green-500 bg-green-50" : "",
          className
        )}
      >
        <div className="flex p-4">
          <div className="mr-4 border rounded-md w-16 h-16 flex items-center justify-center text-gray-500">
            {icon || "иконка"}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{audience}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
} 