import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/store/header"
import { HeroSection } from "@/components/store/hero-section"
import { Footer } from "@/components/store/footer"
import { ReviewsSection } from "@/components/store/reviews-section"
import { StoreProducts } from "@/components/store/store-products"
import { Cart } from "@/components/store/cart"
import type { Bag, Review, Setting } from "@/lib/types"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from("settings").select("*")
  const settingsMap: Record<string, string> = {}
  data?.forEach((s: Setting) => { settingsMap[s.key] = s.value })
  return {
    storeName: settingsMap.store_name || "شنط بالخرز",
    storeDescription: settingsMap.store_description || "شنط يدوية مصنوعة بالخرز بأجمل التصاميم",
    whatsappNumber: settingsMap.whatsapp_number || "201000000000",
    vodafoneCashNumber: settingsMap.vodafone_cash_number || "01000000000",
  }
}

async function getBags() {
  const supabase = await createClient()
  const { data } = await supabase.from("bags").select("*").order("created_at", { ascending: false })
  return (data as Bag[]) || []
}

async function getApprovedReviews() {
  const supabase = await createClient()
  const { data } = await supabase.from("reviews").select("*").eq("is_approved", true).order("created_at", { ascending: false })
  return (data as Review[]) || []
}

export default async function HomePage() {
  const [settings, bags, reviews] = await Promise.all([getSettings(), getBags(), getApprovedReviews()])

  return (
    <div className="min-h-screen flex flex-col">
      <Header storeName={settings.storeName} whatsappNumber={settings.whatsappNumber} />
      <Cart whatsappNumber={settings.whatsappNumber} />

      <main className="flex-1">
        <HeroSection
          storeName={settings.storeName}
          storeDescription={settings.storeDescription}
          whatsappNumber={settings.whatsappNumber}
        />
        <StoreProducts bags={bags} whatsappNumber={settings.whatsappNumber} />
        <ReviewsSection reviews={reviews} />
      </main>

      <Footer
        storeName={settings.storeName}
        whatsappNumber={settings.whatsappNumber}
        vodafoneCashNumber={settings.vodafoneCashNumber}
      />
    </div>
  )
}
