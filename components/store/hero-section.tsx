"use client"

import { MessageCircle, Sparkles } from "lucide-react"

interface HeroSectionProps {
  storeName: string
  storeDescription: string
  whatsappNumber: string
}

export function HeroSection({ storeName, storeDescription, whatsappNumber }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32" style={{background: "linear-gradient(135deg, #FFF9F5 0%, #F8C8D0 50%, #B76E79 100%)"}}>
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-20" style={{background: "#D4AF37", filter: "blur(60px)"}} />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full opacity-20" style={{background: "#B76E79", filter: "blur(60px)"}} />
      </div>

      {/* Floating sparkles */}
      <div className="absolute top-10 left-10 text-accent opacity-60 animate-float text-2xl">✦</div>
      <div className="absolute top-20 right-20 text-primary opacity-40 animate-float text-xl" style={{animationDelay: "1s"}}>✦</div>
      <div className="absolute bottom-10 left-1/3 text-accent opacity-50 animate-float text-3xl" style={{animationDelay: "2s"}}>✦</div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" style={{background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", color: "#4A2030"}}>
            <Sparkles className="h-4 w-4" style={{color: "#D4AF37"}} />
            توصيل لجميع أنحاء مصر
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4" style={{color: "#4A2030"}}>
            احلى الشنط الخرز
          </h1>
          <h2 className="text-2xl font-medium mb-6" style={{color: "#B76E79"}}>
            ليكي انتي ✨
          </h2>

          <p className="text-lg leading-relaxed mb-8 max-w-lg mx-auto" style={{color: "#4A2030", opacity: 0.8}}>
            {storeDescription}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#products"
              className="px-8 py-3 rounded-full font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{background: "#B76E79"}}
            >
              تصفحي الشنط
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all hover:opacity-90"
              style={{background: "rgba(255,255,255,0.7)", color: "#4A2030", backdropFilter: "blur(10px)"}}
            >
              <MessageCircle className="h-5 w-5" />
              تواصلي معانا
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
