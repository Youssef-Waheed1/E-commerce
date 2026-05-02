"use client"

import { useState } from "react"
import { BagCard } from "./bag-card"
import { SearchFilter } from "./search-filter"
import type { Bag } from "@/lib/types"

interface StoreProductsProps {
  bags: Bag[]
  whatsappNumber: string
}

export function StoreProducts({ bags, whatsappNumber }: StoreProductsProps) {
  const [filtered, setFiltered] = useState<Bag[]>(bags)

  return (
    <section id="products" className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold" style={{color: "#4A2030"}}>
            ✦ منتجاتنا ✦
          </h2>
          <p className="mt-2 text-muted-foreground">اكتشفي تشكيلتنا المميزة من الشنط</p>
        </div>

        <SearchFilter bags={bags} onFiltered={setFiltered} />

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((bag, index) => (
              <BagCard
                key={bag.id}
                bag={bag}
                whatsappNumber={whatsappNumber}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">لا توجد نتائج مطابقة</p>
            <p className="text-sm text-muted-foreground">جربي كلمة بحث تانية أو غيري الفلاتر</p>
          </div>
        )}
      </div>
    </section>
  )
}
