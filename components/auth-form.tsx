"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AuthForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // В реальном приложении здесь была бы проверка учетных данных
    // Сейчас просто перенаправляем на главную страницу через 1 секунду
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-2">Авторизация</h2>
      <p className="text-gray-500 mb-6">
        Войдите в систему для доступа к демонстрационным стендам
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Имя пользователя
          </label>
          <Input
            id="username"
            className="w-full"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Пароль
          </label>
          <Input
            id="password"
            type="password"
            className="w-full"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>
    </div>
  )
} 