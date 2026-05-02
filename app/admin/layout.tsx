import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم | كين للحقائب",
  description: "لوحة تحكم إدارة المتجر",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
