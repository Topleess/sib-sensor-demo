"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, FileText, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "События", href: "/events", icon: Bell },
    { name: "Отчеты", href: "/reports", icon: FileText },
  ]

  return (
    <div className="flex flex-col w-64 border-r bg-white">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">SibSensor Demo</h1>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/profile"
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <User className="mr-3 h-5 w-5" />
          Профиль
        </Link>
        <button className="flex items-center w-full px-4 py-3 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5" />
          Выход
        </button>
      </div>
    </div>
  )
}
