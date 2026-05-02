import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Bag, Review, Setting } from "@/lib/types"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin")
  }

  const [bagsRes, reviewsRes, settingsRes] = await Promise.all([
    supabase.from("bags").select("*").order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("settings").select("*"),
  ])

  const bags = (bagsRes.data as Bag[]) || []
  const reviews = (reviewsRes.data as Review[]) || []

  const settingsMap: Record<string, string> = {}
  settingsRes.data?.forEach((s: Setting) => {
    settingsMap[s.key] = s.value
  })

  return (
    <AdminDashboard
      initialBags={bags}
      initialReviews={reviews}
      initialSettings={settingsMap}
      userEmail={user.email || ""}
    />
  )
}
