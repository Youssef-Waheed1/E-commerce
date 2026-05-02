import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal"
})

export const metadata: Metadata = {
  title: 'شنط خرز يدوية | متجر شنط بالخرز',
  description: 'تسوقي أجمل الشنط اليدوية المصنوعة بالخرز، تصاميم فريدة وشغل يدوي متقن - توصيل لجميع أنحاء مصر',
  keywords: 'شنط خرز, شنط يدوية, شنط مصر, اكسسوارات يدوية, حقائب خرز',
  openGraph: {
    title: 'شنط خرز يدوية',
    description: 'تسوقي أجمل الشنط اليدوية المصنوعة بالخرز - توصيل لجميع أنحاء مصر',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شنط خرز يدوية',
    description: 'تسوقي أجمل الشنط اليدوية المصنوعة بالخرز',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#B76E79',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#B76E79" />
      </head>
      <body className={`${tajawal.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
