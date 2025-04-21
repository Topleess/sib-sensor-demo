"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Настройки</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="thresholds">Пороговые значения</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Настройте основные параметры системы мониторинга</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">Название системы</Label>
                <Input id="system-name" defaultValue="SibSensor Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-interval">Интервал обновления (минуты)</Label>
                <Input id="update-interval" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-retention">Хранение данных (дни)</Label>
                <Input id="data-retention" type="number" defaultValue="90" />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Настройте параметры уведомлений о событиях</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Уведомления</Label>
                  <p className="text-sm text-gray-500">Включить уведомления о событиях</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts">Email уведомления</Label>
                  <p className="text-sm text-gray-500">Получать уведомления по электронной почте</p>
                </div>
                <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-alerts">SMS уведомления</Label>
                  <p className="text-sm text-gray-500">Получать уведомления по SMS</p>
                </div>
                <Switch id="sms-alerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds">
          <Card>
            <CardHeader>
              <CardTitle>Пороговые значения</CardTitle>
              <CardDescription>Настройте пороговые значения для срабатывания уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hot-water-threshold">Порог температуры ГВС (°C)</Label>
                <Input id="hot-water-threshold" type="number" defaultValue="70" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cold-water-threshold">Порог температуры ХВС (°C)</Label>
                <Input id="cold-water-threshold" type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electric-threshold">Порог температуры ЭС (°C)</Label>
                <Input id="electric-threshold" type="number" defaultValue="50" />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
              <CardDescription>Управление пользователями системы</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Здесь будет список пользователей и их права доступа</p>
              <Button>Добавить пользователя</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
