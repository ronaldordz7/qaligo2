"use client"

import Link from "next/link"
import type { Dish } from "@/lib/types"
import { Heart, Plus } from "lucide-react"
import { useState } from "react"

interface DishCardProps {
  dish: Dish
  onAddToCart?: (dish: Dish) => void
}

export function DishCard({ dish, onAddToCart }: DishCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      <Link href={`/dish/${dish.id}`} className="block">
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <img
            src={`/.jpg?height=224&width=280&query=${dish.name}`}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </Link>

      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
      >
        <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      <div className="p-4">
        <Link href={`/dish/${dish.id}`}>
          <h3 className="font-bold text-base mb-1 line-clamp-2 hover:text-emerald-600 transition text-gray-900">
            {dish.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{dish.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3 text-xs text-gray-500">
            <span>{dish.calories} cal</span>
            <span>{dish.protein}g prot</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">S/. {dish.price}</span>
          <button
            onClick={() => onAddToCart && onAddToCart(dish)}
            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
