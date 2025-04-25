"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PanelEditorPage() {
  return (
    <div className="flex items-center justify-center p-6 min-h-screen">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
        
        <Card className="p-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Редактор панелей</h1>
          <div className="mb-8">
            <div className="bg-amber-100 border border-amber-300 rounded-md p-4 text-amber-800 mb-6">
              <p className="font-medium">Модуль находится в разработке</p>
              <p className="text-sm mt-2">Функциональность будет доступна в ближайшем обновлении</p>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Редактор панелей предоставит инструменты для настройки отображения данных, 
              создания различных типов графиков и визуализаций, настройки интерактивных элементов 
              управления и оформления интерфейса мониторинга.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              По всем вопросам и предложениям обращайтесь к команде разработки SibSensor
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
} 