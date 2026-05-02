"use client"

import { useState, useEffect } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import type { Bag } from "@/lib/types"

interface SearchFilterProps {
  bags: Bag[]
  onFiltered: (bags: Bag[]) => void
}

export function SearchFilter({ bags, onFiltered }: SearchFilterProps) {
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("الأحدث")
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const maxPriceInData = Math.max(...bags.map(b => b.price), 0)

  useEffect(() => {
    let result = [...bags]

    // Search
    if (query.trim()) {
      result = result.filter(b =>
        b.name.includes(query) || b.description?.includes(query) || b.category.includes(query)
      )
    }

    // Price filter
    if (minPrice) result = result.filter(b => b.price >= Number(minPrice))
    if (maxPrice) result = result.filter(b => b.price <= Number(maxPrice))

    // Sort
    if (sortBy === "الأرخص") result.sort((a, b) => a.price - b.price)
    else if (sortBy === "الأغلى") result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    onFiltered(result)
  }, [query, sortBy, minPrice, maxPrice, bags])

  const reset = () => {
    setQuery("")
    setSortBy("الأحدث")
    setMinPrice("")
    setMaxPrice("")
  }

  const hasFilters = query || minPrice || maxPrice || sortBy !== "الأحدث"

  return (
    <div className="mb-8 space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحثي عن شنطة..."
            className="w-full border rounded-xl px-4 py-2.5 pr-10 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">فلترة</span>
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-4 space-y-4">
          {/* Sort */}
          <div>
            <label className="text-sm font-medium block mb-2">ترتيب حسب</label>
            <div className="flex flex-wrap gap-2">
              {["الأحدث", "الأرخص", "الأغلى"].map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${sortBy === opt ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <label className="text-sm font-medium block mb-2">نطاق السعر (جنيه)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="من"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                min="0"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="إلى"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active filters & reset */}
      {hasFilters && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">الفلاتر مفعلة</span>
          <button onClick={reset} className="text-primary hover:underline flex items-center gap-1">
            <X className="h-3 w-3" /> إزالة الفلاتر
          </button>
        </div>
      )}
    </div>
  )
}
