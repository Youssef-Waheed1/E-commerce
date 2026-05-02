"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingBag, Star, TrendingUp, Award } from "lucide-react"
import type { Bag, Review } from "@/lib/types"

interface AnalyticsManagerProps {
  bags: Bag[]
  reviews: Review[]
}

export function AnalyticsManager({ bags, reviews }: AnalyticsManagerProps) {
  const approvedReviews = reviews.filter(r => r.is_approved)
  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : "0"

  // Rating distribution
  const ratingDist = [1, 2, 3, 4, 5].map(star => ({
    name: `${star} ⭐`,
    عدد: approvedReviews.filter(r => r.rating === star).length,
  }))

  // Bags with no reviews
  const bagsWithNoReviews = bags.filter(b => !approvedReviews.some(r => (r as any).bag_id === b.id)).length

  const stats = [
    { label: "إجمالي الشنط", value: bags.length, icon: ShoppingBag, color: "#B76E79" },
    { label: "تقييمات معتمدة", value: approvedReviews.length, icon: Star, color: "#D4AF37" },
    { label: "متوسط التقييم", value: avgRating, icon: TrendingUp, color: "#B76E79" },
    { label: "شنط بدون تقييم", value: bagsWithNoReviews, icon: Award, color: "#D4AF37" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: color + "20"}}>
                  <Icon className="h-5 w-5" style={{color}} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold" style={{color}}>{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating chart */}
      <Card>
        <CardHeader>
          <CardTitle>توزيع التقييمات</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد تقييمات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingDist}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="عدد" fill="#B76E79" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Available bags */}
      <Card>
        <CardHeader>
          <CardTitle>حالة الشنط</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{color: "#B76E79"}}>{bags.filter(b => b.is_available).length}</p>
              <p className="text-sm text-muted-foreground">متوفرة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground">{bags.filter(b => !b.is_available).length}</p>
              <p className="text-sm text-muted-foreground">مخفية</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{color: "#D4AF37"}}>{reviews.filter(r => !r.is_approved).length}</p>
              <p className="text-sm text-muted-foreground">تعليقات معلقة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
