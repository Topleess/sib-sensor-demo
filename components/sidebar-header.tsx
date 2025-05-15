"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardOption {
  name: string
  path: string
}

export default function SidebarHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
  // Определяем доступные дешборды
  const dashboards: DashboardOption[] = [
    { name: "Коллекторы (технологическая линия)", path: "/tech" },
    { name: "Офис", path: "/office" },
    { name: "Паркинг", path: "/parking" },
    { name: "Коллекторы (безопасность)", path: "/security" },
  ]
  
  // Определяем текущий активный дешборд
  const currentDashboard = dashboards.find(d => pathname.startsWith(d.path)) || dashboards[0]
  
  return (
    <div className="p-4 border-b flex flex-col">
      <Link href="/" className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">
        SibSensor Demo
      </Link>
      
      {/* Закомментированный выпадающий список навигации
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center text-lg font-medium mt-1 text-gray-700 hover:text-blue-600 transition-colors">
            {pathname === "/" ? "Выбрать стенд" : currentDashboard.name}
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {dashboards.map((dashboard) => (
            <DropdownMenuItem key={dashboard.path} asChild>
              <Link 
                href={dashboard.path}
                className={`w-full ${pathname.startsWith(dashboard.path) ? 'bg-blue-50 font-medium' : ''}`}
              >
                {dashboard.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      */}
    </div>
  )
} 