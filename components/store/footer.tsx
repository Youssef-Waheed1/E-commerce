"use client"

import Link from "next/link"
import { MessageCircle, Phone, CreditCard, ShoppingBag } from "lucide-react"

interface FooterProps {
  storeName: string
  whatsappNumber: string
  vodafoneCashNumber: string
}

export function Footer({ storeName, whatsappNumber, vodafoneCashNumber }: FooterProps) {
  return (
    <footer className="border-t py-12" style={{background: "#3C1F2E"}}>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span style={{color: "#D4AF37"}}>✦</span>
              <ShoppingBag className="h-6 w-6" style={{color: "#D4AF37"}} />
              <span className="text-xl font-bold" style={{color: "#D4AF37"}}>{storeName}</span>
            </div>
            <p className="text-sm" style={{color: "#c9a8b8"}}>
              شنط يدوية مصنوعة بالخرز بأعلى جودة وأجمل تصاميم
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{color: "#D4AF37"}}>روابط سريعة</h3>
            <div className="space-y-2">
              {[
                { href: "/about", label: "من أنا" },
                { href: "/#products", label: "المنتجات" },
                { href: "/#reviews", label: "آراء العملاء" },
                { href: "/privacy", label: "سياسة الخصوصية" },
              ].map(link => (
                <Link key={link.href} href={link.href} className="block text-sm transition-colors hover:opacity-80" style={{color: "#c9a8b8"}}>
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                style={{color: "#c9a8b8"}}
              >
                <MessageCircle className="h-4 w-4" />
                واتساب: {whatsappNumber.replace(/^20/, "0")}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{color: "#D4AF37"}}>طريقة الدفع</h3>
            <div className="rounded-xl p-4" style={{background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)"}}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5" style={{color: "#D4AF37"}} />
                <span className="font-medium" style={{color: "#D4AF37"}}>فودافون كاش</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-bold" style={{color: "#B76E79"}}>
                <Phone className="h-4 w-4" />
                {vodafoneCashNumber}
              </div>
              <p className="mt-2 text-xs" style={{color: "#c9a8b8"}}>
                ابعت صورة الإيصال على واتساب بعد الدفع
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm" style={{borderTop: "1px solid rgba(255,255,255,0.1)", color: "#c9a8b8"}}>
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {storeName} ✦</p>
        </div>
      </div>
    </footer>
  )
}
