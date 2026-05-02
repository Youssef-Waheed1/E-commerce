"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Settings, LogOut, Package, BarChart3 } from "lucide-react"
import { BagsManager } from "./bags-manager"
import { ReviewsManager } from "./reviews-manager"
import { SettingsManager } from "./settings-manager"
import { AnalyticsManager } from "./analytics-manager"
import type { Bag, Review } from "@/lib/types"

interface AdminDashboardProps {
  initialBags: Bag[]
  initialReviews: Review[]
  initialSettings: Record<string, string>
  userEmail: string
}

export function AdminDashboard({ initialBags, initialReviews, initialSettings, userEmail }: AdminDashboardProps) {
  const router = useRouter()
  const [bags, setBags] = useState(initialBags)
  const [reviews, setReviews] = useState(initialReviews)
  const [settings, setSettings] = useState(initialSettings)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin")
  }

  const pendingReviewsCount = reviews.filter(r => !r.is_approved).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">✦</span>
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="bags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bags" className="gap-1 text-xs sm:text-sm">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">الشنط</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1 text-xs sm:text-sm">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">التقييمات</span>
              {pendingReviewsCount > 0 && (
                <span className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {pendingReviewsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">الإحصائيات</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bags">
            <BagsManager bags={bags} onBagsChange={setBags} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsManager reviews={reviews} onReviewsChange={setReviews} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsManager bags={bags} reviews={reviews} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsManager settings={settings} onSettingsChange={setSettings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
