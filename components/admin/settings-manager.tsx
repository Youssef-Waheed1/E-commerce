"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Phone, Store, Save, CheckCircle, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SettingsManagerProps {
  settings: Record<string, string>
  onSettingsChange: (settings: Record<string, string>) => void
}

export function SettingsManager({ settings, onSettingsChange }: SettingsManagerProps) {
  const [formData, setFormData] = useState({
    store_name: settings.store_name || "",
    store_description: settings.store_description || "",
    whatsapp_number: settings.whatsapp_number || "",
    vodafone_cash_number: settings.vodafone_cash_number || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem("last_backup_date")
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)

    const supabase = createClient()
    const updates = Object.entries(formData).map(async ([key, value]) => {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      return { key, value, error }
    })

    const results = await Promise.all(updates)
    const hasErrors = results.some((r) => r.error)

    if (!hasErrors) {
      const newSettings = { ...settings }
      results.forEach(({ key, value }) => { newSettings[key] = value })
      onSettingsChange(newSettings)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }

    setIsSubmitting(false)
  }

  const handleExportBackup = async () => {
    setIsExporting(true)
    const supabase = createClient()

    const [bagsRes, reviewsRes, settingsRes] = await Promise.all([
      supabase.from("bags").select("*"),
      supabase.from("reviews").select("*"),
      supabase.from("settings").select("*"),
    ])

    const backup = {
      exported_at: new Date().toISOString(),
      bags: bagsRes.data || [],
      reviews: reviewsRes.data || [],
      settings: settingsRes.data || [],
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-shanta-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    const now = new Date().toLocaleDateString("ar-EG")
    localStorage.setItem("last_backup_date", now)
    setLastBackup(now)
    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات المتجر</CardTitle>
          <CardDescription>تعديل معلومات المتجر وبيانات التواصل</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {showSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>تم حفظ الإعدادات بنجاح ✓</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Store className="h-4 w-4" />
                معلومات المتجر
              </h3>
              <div className="space-y-2">
                <Label htmlFor="store_name">اسم المتجر</Label>
                <Input
                  id="store_name"
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  placeholder="شنط بالخرز"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_description">وصف المتجر</Label>
                <Textarea
                  id="store_description"
                  value={formData.store_description}
                  onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
                  placeholder="شنط يدوية مصنوعة بالخرز..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                بيانات التواصل
              </h3>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">رقم واتساب</Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="201000000000"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  أدخل الرقم بصيغة دولية بدون + (مثال: 201012345678)
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                بيانات الدفع
              </h3>
              <div className="space-y-2">
                <Label htmlFor="vodafone_cash_number">رقم فودافون كاش</Label>
                <Input
                  id="vodafone_cash_number"
                  value={formData.vodafone_cash_number}
                  onChange={(e) => setFormData({ ...formData, vodafone_cash_number: e.target.value })}
                  placeholder="01000000000"
                  dir="ltr"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backup Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            النسخ الاحتياطي
          </CardTitle>
          <CardDescription>
            احفظ نسخة من بيانات متجرك بشكل دوري
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastBackup && (
            <p className="text-sm text-muted-foreground">
              آخر نسخة احتياطية: {lastBackup}
            </p>
          )}
          <Alert className="border-amber-200 bg-amber-50 text-amber-800">
            <AlertDescription>
              يُنصح بعمل نسخة احتياطية أسبوعياً لحماية بياناتك
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleExportBackup}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "جاري التصدير..." : "تنزيل نسخة احتياطية"}
          </Button>
        </CardContent>
      </Card>

      {/* Health Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>حالة الموقع</CardTitle>
          <CardDescription>مراقبة حالة الاتصال بقاعدة البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthStatus />
        </CardContent>
      </Card>
    </div>
  )
}

function HealthStatus() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking")

  const checkHealth = async () => {
    setStatus("checking")
    try {
      const res = await fetch("/api/health")
      setStatus(res.ok ? "ok" : "error")
    } catch {
      setStatus("error")
    }
  }

  // Check on mount
  useState(() => { checkHealth() })

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${
        status === "ok" ? "bg-green-500" :
        status === "error" ? "bg-red-500" :
        "bg-yellow-500 animate-pulse"
      }`} />
      <span className="text-sm text-muted-foreground">
        {status === "ok" ? "الموقع يعمل بشكل طبيعي ✓" :
         status === "error" ? "يوجد مشكلة في الاتصال ✗" :
         "جاري الفحص..."}
      </span>
      <Button variant="ghost" size="sm" onClick={checkHealth} className="mr-auto text-xs">
        تحديث
      </Button>
    </div>
  )
}
