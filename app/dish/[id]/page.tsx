"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { Dish, CartItem } from "@/lib/types"
import { storage } from "@/lib/storage"
import { DishCustomizer } from "@/components/dish-customizer"
import { ChevronLeft, AlertCircle } from "lucide-react"

export default function DishDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dish, setDish] = useState<Dish | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dishId = params.id as string
    const fetchedDish = storage.getDishById(dishId)
    setDish(fetchedDish)
    setLoading(false)

    if (!fetchedDish) {
      setTimeout(() => router.push("/"), 2000)
    }
  }, [params.id, router])

  const handleAddToCart = (item: CartItem) => {
    const cart = storage.getCart()
    cart.push(item)
    storage.saveCart(cart)
    window.dispatchEvent(new Event("cartUpdated"))

    // Show notification
    const toast = document.createElement("div")
    toast.className =
      "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    toast.textContent = `${dish?.name} agregado al carrito!`
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
      router.push("/cart")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando plato...</p>
        </div>
      </div>
    )
  }

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Plato no encontrado</h1>
          <p className="text-muted-foreground mb-4">Redirigiendo a la tienda...</p>
          <Link href="/" className="text-green-600 hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-8 transition"
        >
          <ChevronLeft size={20} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dish Image */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-muted shadow-lg">
              <img
                src={`/.jpg?key=xtgq2&height=500&width=500&query=${dish.name}`}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="aspect-square rounded-lg bg-muted hover:ring-2 ring-green-600 transition overflow-hidden"
                >
                  <img
                    src={`/ceholder-svg-key-xtgq.jpg?key=xtgq${i}&height=100&width=100&query=${dish.name}`}
                    alt={`${dish.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dish Details and Customizer */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 capitalize">
                  {dish.category}
                </div>
                <h1 className="text-4xl font-bold mb-3">{dish.name}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">{dish.description}</p>
              </div>

              {/* Nutritional Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p className="text-sm text-muted-foreground">Calorías</p>
                  <p className="text-2xl font-bold text-blue-600">{dish.calories}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Proteína</p>
                  <p className="text-2xl font-bold text-blue-600">{dish.protein}g</p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-bold mb-2">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map((ingredient, idx) => (
                    <span key={idx} className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Customizer */}
            <div className="mt-8 bg-card p-6 rounded-xl border border-border shadow-sm">
              <DishCustomizer dish={dish} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
