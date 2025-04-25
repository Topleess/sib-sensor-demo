import Link from "next/link"

export function Footer() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link 
        href="https://as-shamshurin.ru/" 
        className="inline-flex items-center text-xs text-muted-foreground bg-background px-3 py-2 rounded-full shadow-md border hover:bg-accent transition-colors duration-200"
      >
        Сделано Александром Шамшуриным
      </Link>
    </div>
  )
} 