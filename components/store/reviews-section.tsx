"use client"

import { useState } from "react"
import { Star, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Review } from "@/lib/types"

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [captchaQuestion] = useState(() => {
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    return { a, b, answer: a + b }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const checkRateLimit = () => {
    const key = "review_submissions"
    const now = Date.now()
    const stored = localStorage.getItem(key)
    const timestamps: number[] = stored ? JSON.parse(stored) : []
    const recent = timestamps.filter((t) => now - t < 24 * 60 * 60 * 1000)
    if (recent.length >= 3) return false
    recent.push(now)
    localStorage.setItem(key, JSON.stringify(recent))
    return true
  }

  const handleSubmit = async () => {
    setError("")
    if (honeypot) return
    if (!name.trim() || rating === 0) {
      setError("من فضلك ادخل اسمك واختار تقييمك")
      return
    }
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setError("إجابة السؤال الحسابي غير صحيحة")
      return
    }
    if (!checkRateLimit()) {
      setError("لقد أرسلت عدد كبير من التعليقات، يرجى المحاولة غداً")
      return
    }
    setIsSubmitting(true)
    const supabase = createClient()
    const { error: dbError } = await supabase.from("reviews").insert({
      customer_name: name.trim(),
      rating,
      comment: comment.trim() || null,
      is_approved: false,
    })
    if (dbError) {
      setError("حدث خطأ، حاول تاني")
      setIsSubmitting(false)
      return
    }
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section id="reviews" className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">آراء العملاء</h2>
          {avgRating && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-5 w-5 ${i <= Math.round(Number(avgRating)) ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-muted-foreground">{avgRating} من 5</span>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.customer_name}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-4 w-4 ${i <= review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString("ar-EG")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-8">لا توجد تقييمات بعد، كن أول من يقيّم!</p>
        )}

        <div className="text-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              اكتب رأيك
            </button>
          ) : submitted ? (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="font-medium">شكراً على تقييمك! ✨</p>
              <p className="text-sm mt-1">سيظهر تقييمك بعد المراجعة</p>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-6 max-w-md mx-auto text-right">
              <h3 className="font-semibold mb-4">اكتب رأيك</h3>
              
              {/* Honeypot - hidden from real users */}
              <input
                type="text"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              />

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">اسمك *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="اسمك الأول"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">تقييمك *</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star
                        key={i}
                        className={`h-7 w-7 cursor-pointer transition-colors ${i <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(i)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">تعليقك (اختياري)</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="شاركينا رأيك..."
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    كم يساوي {captchaQuestion.a} + {captchaQuestion.b}؟ *
                  </label>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={e => setCaptchaAnswer(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                    placeholder="الإجابة"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-secondary transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
