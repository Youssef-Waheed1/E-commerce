"use client"

import Link from "next/link"
import { ShoppingBag, MessageCircle, Moon, Sun, ShoppingCart } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface HeaderProps {
  storeName: string
  whatsappNumber: string
}

export function Header({ storeName, whatsappNumber }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0))
    }
    updateCart()
    window.addEventListener("cart-updated", updateCart)
    return () => window.removeEventListener("cart-updated", updateCart)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-accent text-lg">✦</span>
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-accent text-lg">✦</span>
          </div>
          <span className="text-xl font-bold text-foreground">{storeName}</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">من أنا</Link>
          <Link href="/#products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">المنتجات</Link>
          <Link href="/#reviews" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">التقييمات</Link>

          {/* Dark mode toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="تبديل الوضع الليلي"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => window.dispatchEvent(new Event("open-cart"))}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="السلة"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">تواصل معنا</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
