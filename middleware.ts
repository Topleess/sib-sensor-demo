import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Этот middleware будет проверять все запросы
export function middleware(request: NextRequest) {
  // Проверка на защищенные маршруты, которые требуют аутентификации
  const isProtectedRoute = 
    !request.nextUrl.pathname.startsWith("/login") && 
    !request.nextUrl.pathname.startsWith("/_next") && 
    !request.nextUrl.pathname.startsWith("/api") && 
    !request.nextUrl.pathname.includes(".")

  // Проверка, авторизован ли пользователь
  // В реальном приложении здесь была бы проверка сессии или токена аутентификации
  // Для демонстрации просто перенаправляем на страницу входа для всех защищенных маршрутов
  if (isProtectedRoute) {
    // Для демо-стендов мы всегда пропускаем пользователя
    // В реальном приложении здесь была бы проверка аутентификации
    // Если неаутентифицирован - перенаправляем на страницу логина
    //return NextResponse.redirect(new URL("/login", request.url))
    
    // Для демонстрации просто пропускаем все запросы
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Укажите, на каких маршрутах будет работать middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 