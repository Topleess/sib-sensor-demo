import { AuthForm } from "@/components/auth-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Авторизация | SibSensor Demo",
  description: "Страница авторизации в систему SibSensor Demo",
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">SibSensor Demo</h1>
        <p className="text-gray-500">Система мониторинга и демонстрации стендов</p>
      </div>
      <AuthForm />
    </div>
  )
} 