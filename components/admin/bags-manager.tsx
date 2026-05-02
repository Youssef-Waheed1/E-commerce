"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, ShoppingBag, ImageIcon, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Bag } from "@/lib/types"

interface BagsManagerProps {
  bags: Bag[]
  onBagsChange: (bags: Bag[]) => void
}

interface BagFormData {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  is_available: boolean
}

const defaultFormData: BagFormData = {
  name: "", description: "", price: "", category: "شنط", image_url: "", is_available: true,
}

// Compress image using canvas
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX_W = 800, MAX_H = 1000
      let { width, height } = img
      if (width > MAX_W) { height = (height * MAX_W) / width; width = MAX_W }
      if (height > MAX_H) { width = (width * MAX_H) / height; height = MAX_H }
      const canvas = document.createElement("canvas")
      canvas.width = width; canvas.height = height
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob!) }, "image/webp", 0.82)
    }
    img.onerror = reject
    img.src = url
  })
}

export function BagsManager({ bags, onBagsChange }: BagsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBag, setEditingBag] = useState<Bag | null>(null)
  const [formData, setFormData] = useState<BagFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError("")
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("نوع الملف غير مدعوم. يرجى اختيار صورة jpg أو png أو webp")
      return
    }
    if (file.size > MAX_SIZE) {
      setUploadError("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت")
      return
    }
    setUploadFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!uploadFile) return formData.image_url || null
    setUploadProgress("جاري ضغط الصورة...")
    const compressed = await compressImage(uploadFile)
    setUploadProgress("جاري رفع الصورة...")
    const supabase = createClient()
    const fileName = `bag-${Date.now()}.webp`
    const { data, error } = await supabase.storage.from("bags-images").upload(fileName, compressed, { cacheControl: "3600", upsert: false })
    if (error) { setUploadProgress(""); setUploadError("فشل رفع الصورة: " + error.message); return null }
    const { data: { publicUrl } } = supabase.storage.from("bags-images").getPublicUrl(data.path)
    setUploadProgress("")
    return publicUrl
  }

  const handleOpenDialog = (bag?: Bag) => {
    if (bag) {
      setEditingBag(bag)
      setFormData({ name: bag.name, description: bag.description || "", price: bag.price.toString(), category: bag.category, image_url: bag.image_url || "", is_available: bag.is_available })
      setPreviewUrl(bag.image_url || null)
    } else {
      setEditingBag(null)
      setFormData(defaultFormData)
      setPreviewUrl(null)
    }
    setUploadFile(null)
    setUploadError("")
    setUploadProgress("")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadError("")

    const imageUrl = await uploadImage()
    if (uploadFile && !imageUrl) { setIsSubmitting(false); return }

    const supabase = createClient()
    const bagData = {
      name: formData.name, description: formData.description || null,
      price: parseFloat(formData.price), category: formData.category,
      image_url: imageUrl, is_available: formData.is_available,
      updated_at: new Date().toISOString(),
    }

    console.log("جاري حفظ الشنطة:", bagData)

    if (editingBag) {
      const { data, error } = await supabase.from("bags").update(bagData).eq("id", editingBag.id).select().single()
      console.log("تعديل - data:", data, "error:", error)
      if (error) { setUploadError("خطأ في التعديل: " + error.message); setIsSubmitting(false); return }
      if (data) onBagsChange(bags.map(b => b.id === editingBag.id ? data : b))
    } else {
      const { data, error } = await supabase.from("bags").insert(bagData).select().single()
      console.log("إضافة - data:", data, "error:", error)
      if (error) { setUploadError("خطأ في الحفظ: " + error.message); setIsSubmitting(false); return }
      if (data) onBagsChange([data, ...bags])
    }

    router.refresh()
    setIsSubmitting(false)
    setIsDialogOpen(false)
    setFormData(defaultFormData)
    setEditingBag(null)
    setPreviewUrl(null)
    setUploadFile(null)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("bags").delete().eq("id", id)
    if (!error) {
      onBagsChange(bags.filter(b => b.id !== id))
      router.refresh()
    }
  }

  const handleToggleAvailability = async (bag: Bag) => {
    const supabase = createClient()
    const newAvailability = !bag.is_available
    const { error } = await supabase.from("bags").update({ is_available: newAvailability, updated_at: new Date().toISOString() }).eq("id", bag.id)
    if (!error) {
      onBagsChange(bags.map(b => b.id === bag.id ? { ...b, is_available: newAvailability } : b))
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>إدارة المنتجات</CardTitle>
            <CardDescription>إضافة وتعديل وحذف الشنط</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" /> إضافة شنطة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBag ? "تعديل الشنطة" : "إضافة شنطة جديدة"}</DialogTitle>
                <DialogDescription>{editingBag ? "قم بتعديل بيانات الشنطة" : "أدخل بيانات الشنطة الجديدة"}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image upload */}
                <div className="space-y-2">
                  <Label>صورة الشنطة</Label>
                  <div
                    className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative">
                        <img src={previewUrl} alt="معاينة" className="w-full h-40 object-cover rounded-lg" />
                        <button type="button" onClick={e => { e.stopPropagation(); setPreviewUrl(null); setUploadFile(null); setFormData(f => ({ ...f, image_url: "" })) }} className="absolute top-2 left-2 bg-destructive text-white rounded-full p-1">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">اضغط لرفع صورة</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP - أقصى 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                  {uploadProgress && <p className="text-sm text-primary animate-pulse">{uploadProgress}</p>}
                  {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">اسم الشنطة *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="شنطة الوردة" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="وصف الشنطة..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (جنيه) *</Label>
                    <Input id="price" type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="350" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">التصنيف</Label>
                    <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="شنط" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_available">متوفرة للبيع</Label>
                  <Switch id="is_available" checked={formData.is_available} onCheckedChange={checked => setFormData({ ...formData, is_available: checked })} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={isSubmitting || !!uploadProgress}>
                    {isSubmitting ? "جاري الحفظ..." : editingBag ? "حفظ التعديلات" : "إضافة الشنطة"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {bags.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">لا توجد شنط</p>
            <Button variant="outline" className="mt-4" onClick={() => handleOpenDialog()}>إضافة أول شنطة</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bags.map(bag => (
              <div key={bag.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  {bag.image_url
                    ? <img src={bag.image_url} alt={bag.name} className="h-full w-full object-cover" />
                    : <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{bag.name}</h3>
                    <Badge variant={bag.is_available ? "default" : "secondary"} className="text-xs">{bag.is_available ? "متوفرة" : "غير متوفرة"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{bag.category}</p>
                  <p className="text-sm font-bold" style={{ color: "#D4AF37" }}>{bag.price.toLocaleString("ar-EG")} جنيه</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch checked={bag.is_available} onCheckedChange={() => handleToggleAvailability(bag)} />
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(bag)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف الشنطة</AlertDialogTitle>
                        <AlertDialogDescription>هل أنت متأكدة من حذف "{bag.name}"؟ لا يمكن التراجع.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(bag.id)} className="bg-destructive text-destructive-foreground">حذف</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}