"use client"

import { useEffect, useState } from "react"
import { X, Trash2, ShoppingCart, MessageCircle, Plus, Minus } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image_url: string | null
  qty: number
}

interface CartProps {
  whatsappNumber: string
}

export function Cart({ whatsappNumber }: CartProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setItems(cart)
  }

  useEffect(() => {
    loadCart()
    window.addEventListener("cart-updated", loadCart)
    window.addEventListener("open-cart", () => setOpen(true))
    return () => {
      window.removeEventListener("cart-updated", loadCart)
      window.removeEventListener("open-cart", () => setOpen(true))
    }
  }, [])

  const updateQty = (id: string, delta: number) => {
    const cart = items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    localStorage.setItem("cart", JSON.stringify(cart))
    setItems(cart)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const removeItem = (id: string) => {
    const cart = items.filter(i => i.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart))
    setItems(cart)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const orderOnWhatsApp = () => {
    if (items.length === 0) return
    const itemsList = items.map(i => `• ${i.name} x${i.qty} = ${(i.price * i.qty).toLocaleString("ar-EG")} جنيه`).join("\n")
    const msg = encodeURIComponent(`مرحباً! عايزة أطلب:\n${itemsList}\n\nالإجمالي: ${total.toLocaleString("ar-EG")} جنيه\nوهبعت صورة الإيصال دلوقتي`)
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank")
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full w-80 max-w-full bg-card shadow-2xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">السلة</span>
            {items.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">{items.length}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>السلة فاضية</p>
              <button onClick={() => setOpen(false)} className="mt-4 text-primary text-sm hover:underline">
                تصفح الشنط
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl border bg-background">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="h-6 w-6 text-muted-foreground" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                  <p className="text-sm font-bold" style={{color: "#D4AF37"}}>{item.price.toLocaleString("ar-EG")} جنيه</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-destructive hover:opacity-70 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي</span>
              <span style={{color: "#D4AF37"}}>{total.toLocaleString("ar-EG")} جنيه</span>
            </div>
            <button
              onClick={orderOnWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              style={{background: "#B76E79"}}
            >
              <MessageCircle className="h-5 w-5" />
              اطلب الكل على واتساب
            </button>
          </div>
        )}
      </div>
    </>
  )
}
