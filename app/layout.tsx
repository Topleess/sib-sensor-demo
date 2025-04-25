import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "SibSensor Demo",
  description: "Система мониторинга коллекторов",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body 
        className={inter.className} 
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
