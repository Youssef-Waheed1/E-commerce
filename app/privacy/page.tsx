export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">سياسة الخصوصية</h1>
        <p className="text-sm text-muted-foreground mb-8">آخر تحديث: يناير 2025</p>
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">ما المعلومات التي نجمعها؟</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• الاسم ورقم الهاتف عند تقديم طلب</li>
              <li>• التعليقات التي تختار إرسالها طوعاً</li>
              <li>• لا نجمع أي معلومات دفع أو بيانات بنكية</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">كيف نستخدم معلوماتك؟</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• لتأكيد طلبك والتواصل معك عبر واتساب</li>
              <li>• لا نشارك بياناتك مع أي طرف ثالث</li>
              <li>• لا نستخدم بياناتك لأغراض تسويقية بدون إذنك</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">الأمان</h2>
            <p className="text-muted-foreground">بياناتك محفوظة بشكل آمن ومشفر عبر Supabase.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">حقوقك</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• يمكنك طلب حذف بياناتك في أي وقت</li>
              <li>• تواصل معنا عبر واتساب لأي استفسار</li>
            </ul>
          </section>
        </div>
        <div className="mt-12 pt-8 border-t">
          <a href="/" className="text-primary hover:underline">→ العودة للمتجر</a>
        </div>
      </div>
    </div>
  )
}
