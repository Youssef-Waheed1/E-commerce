import { createClient } from "@/lib/supabase/server"
import { MessageCircle, Heart, Star, Truck } from "lucide-react"

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: settingsData } = await supabase.from("settings").select("*")
  const settings: Record<string, string> = {}
  settingsData?.forEach((s: any) => { settings[s.key] = s.value })

  const storeName = settings.store_name || "شنط بالخرز"
  const whatsappNumber = settings.whatsapp_number || "201000000000"

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-primary/10 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">{storeName}</h1>
          <p className="text-muted-foreground text-lg">شغل يدوي بحب ❤️</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-12">
        {/* Story */}
        <section>
          <h2 className="text-2xl font-bold mb-4">قصتي</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            بدأت رحلتي مع الشنط الخرز من حبي للشغل اليدوي والتصاميم الفريدة.
            كل شنطة بصنعها بإيدي وبحطلها من قلبي عشان تطلع تحفة حقيقية.
            هدفي إن كل بنت تلاقي الشنطة اللي بتعبر عنها وبتحسسها بجمالها.
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">مميزات شغلي</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-card border rounded-xl p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">خامات طبيعية</h3>
              <p className="text-sm text-muted-foreground">خرز أصلي وخيط متين يدوم</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">تصاميم يدوية</h3>
              <p className="text-sm text-muted-foreground">كل شنطة فريدة ومش متكررة</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <Truck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">توصيل سريع</h3>
              <p className="text-sm text-muted-foreground">توصيل لكل أنحاء مصر</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">تواصلي معايا</h2>
          <p className="text-muted-foreground mb-6">عندك أي سؤال أو عايزة تطلبي؟ كليميني على واتساب!</p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            كليميني على واتساب
          </a>
        </section>
      </div>

      <div className="text-center py-6 border-t">
        <a href="/" className="text-primary hover:underline">→ العودة للمتجر</a>
      </div>
    </div>
  )
}
