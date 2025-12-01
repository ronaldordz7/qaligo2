"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Dish } from "@/lib/types"
import { Search } from "lucide-react"

interface SearchAndFilterProps {
  dishes: Dish[]
  onFilter: (filtered: Dish[]) => void
}

type Category = "bowls" | "wraps" | "salads" | "smoothies" | "desserts" | "all"

export function SearchAndFilter({ dishes, onFilter }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [sortBy, setSortBy] = useState<"price" | "calories" | "protein">("price")

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "bowls", label: "Bowls" },
    { value: "wraps", label: "Wraps" },
    { value: "salads", label: "Ensaladas" },
    { value: "smoothies", label: "Smoothies" },
    { value: "desserts", label: "Postres" },
  ]

  useEffect(() => {
    const applyFilters = () => {
      let result = [...dishes]

      // Search filter
      if (searchTerm) {
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Category filter
      if (selectedCategory !== "all") {
        result = result.filter((d) => d.category === selectedCategory)
      }

      // Sort
      if (sortBy === "price") {
        result.sort((a, b) => a.price - b.price)
      } else if (sortBy === "calories") {
        result.sort((a, b) => a.calories - b.calories)
      } else if (sortBy === "protein") {
        result.sort((a, b) => b.protein - a.protein)
      }

      onFilter(result)
    }

    applyFilters()
  }, [dishes, searchTerm, selectedCategory, sortBy, onFilter])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: "price" | "calories" | "protein") => {
    setSortBy(sort)
  }

  return (
    <div className="space-y-6 mb-8">
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Busca por nombre o ingredientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.value ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto flex-wrap sm:flex-nowrap">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as "price" | "calories" | "protein")}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="price">Precio: Menor a Mayor</option>
            <option value="calories">Calorías: Menor a Mayor</option>
            <option value="protein">Proteína: Mayor a Menor</option>
          </select>
        </div>
      </div>
    </div>
  )
}
