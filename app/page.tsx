"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Building, Cpu, Car, Shield, LayoutDashboard, Edit } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">SibSensor Demo</h1>
          <p className="text-gray-500">Выберите нужный раздел системы мониторинга</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/tech" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="h-10 w-10 text-blue-500" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Коллекторы (технологическая линия)</h2>
              <p className="text-gray-500">Мониторинг технологических параметров, температуры теплоносителя, электросетей</p>
            </Card>
          </Link>

          <Link href="/office" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Building className="h-10 w-10 text-indigo-500" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Офис</h2>
              <p className="text-gray-500">Мониторинг офисных помещений, климата, энергопотребления</p>
            </Card>
          </Link>

          <Link href="/parking" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Car className="h-10 w-10 text-green-500" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Паркинг</h2>
              <p className="text-gray-500">Мониторинг парковки, доступа транспорта, состояния оборудования</p>
            </Card>
          </Link>

          <Link href="/security" className="block">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-10 w-10 text-red-500" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Коллекторы (безопасность)</h2>
              <p className="text-gray-500">Мониторинг систем безопасности, контроль доступа, видеонаблюдение</p>
            </Card>
          </Link>
        </div>

        {/* Закомментированный блок инструментов администратора
        <div className="mt-16 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Инструменты администратора</h2>
            <p className="text-gray-500 mt-2">Модули находятся в разработке</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard-builder" className="block">
              <Card className="p-6 h-full hover:shadow-md transition-shadow border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <LayoutDashboard className="h-10 w-10 text-purple-500" />
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Конструктор дэшбордов</h2>
                <p className="text-gray-500">Создание собственных информационных панелей из доступных датчиков и метрик</p>
              </Card>
            </Link>

            <Link href="/panel-editor" className="block">
              <Card className="p-6 h-full hover:shadow-md transition-shadow border-2 border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <Edit className="h-10 w-10 text-amber-500" />
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Редактор панелей</h2>
                <p className="text-gray-500">Настройка отображения данных и визуализация метрик для систем мониторинга</p>
              </Card>
            </Link>
          </div>
        </div>
        */}
      </div>
    </div>
  )
}
