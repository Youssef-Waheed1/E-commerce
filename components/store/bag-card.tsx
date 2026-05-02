"use client"

import Image from "next/image"
import { MessageCircle, ShoppingBag, Plus } from "lucide-react"
import type { Bag } from "@/lib/types"
import { useState } from "react"

interface BagCardProps {
  bag: Bag
  whatsappNumber: string
  priority?: boolean
}

export function BagCard({ bag, whatsappNumber, priority = false }: BagCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [added, setAdded] = useState(false)

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أريد طلب: ${bag.name}\nالسعر: ${bag.price} جنيه\nوهبعت صورة الإيصال دلوقتي`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cart.find((i: any) => i.id === bag.id)
    if (existing) {
      existing.qty += 1
    } else {
      cart.push({ id: bag.id, name: bag.name, price: bag.price, image_url: bag.image_url, qty: 1 })
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{boxShadow: "0 4px 20px rgba(183,110,121,0.1)"}}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{height: "260px"}}>
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        {bag.image_url ? (
          <Image
            src={bag.image_url}
            alt={bag.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{background: "linear-gradient(135deg, #F8C8D0, #B76E79)"}}>
            <ShoppingBag className="h-16 w-16 text-white opacity-50" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{background: "linear-gradient(to top, rgba(74,32,48,0.5) 0%, transparent 60%)"}} />

        {/* Price badge */}
        <div className="absolute bottom-3 right-3">
          <span className="text-white text-sm font-bold px-3 py-1 rounded-full shadow" style={{background: "#D4AF37"}}>
            {bag.price.toLocaleString("ar-EG")} جنيه
          </span>
        </div>

        {/* Unavailable overlay */}
        {!bag.is_available && (
          <div className="absolute inset-0 flex items-center justify-center" style={{background: "rgba(255,255,255,0.8)"}}>
            <span className="text-lg font-bold px-4 py-2 rounded-full bg-secondary text-foreground">نفد من المخزون</span>
          </div>
        )}

        {/* Add to cart */}
        {bag.is_available && (
          <button
            onClick={addToCart}
            className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{background: added ? "#22c55e" : "#B76E79"}}
            title="أضف للسلة"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{background: "#F8C8D0", color: "#4A2030"}}>
          {bag.category}
        </span>
        <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{bag.name}</h3>
        {bag.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bag.description}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <a
            href={bag.is_available ? whatsappUrl : "#"}
            target={bag.is_available ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all ${bag.is_available ? "hover:opacity-90 hover:shadow-md" : "opacity-50 cursor-not-allowed"}`}
            style={{background: bag.is_available ? "#B76E79" : "#ccc", animation: bag.is_available ? "pulse 2s infinite" : "none"}}
            onClick={e => !bag.is_available && e.preventDefault()}
          >
            <MessageCircle className="h-4 w-4" />
            اطلب على واتساب
          </a>
          {bag.is_available && (
            <button
              onClick={addToCart}
              className="px-3 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-secondary"
              title="أضف للسلة"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
