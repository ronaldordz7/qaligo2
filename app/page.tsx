"use client"

import { useState, useEffect } from "react"
import type { Dish } from "@/lib/types"
import { storage } from "@/lib/storage"
import { DishCard } from "@/components/dish-card"
import { SearchAndFilter } from "@/components/search-and-filter"
import { Chatbot } from "@/components/chatbot"
import Link from "next/link"

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [cart, setCart] = useState(storage.getCart())

  useEffect(() => {
    const storedDishes = storage.getDishes()
    setDishes(storedDishes)
    setFilteredDishes(storedDishes)
    updateCart()

    window.addEventListener("cartUpdated", updateCart)
    return () => window.removeEventListener("cartUpdated", updateCart)
  }, [])

  const updateCart = () => {
    setCart(storage.getCart())
  }

  const handleAddToCart = (dish: Dish) => {
    const currentCart = storage.getCart()
    const existingItem = currentCart.find(
      (item) => item.dishId === dish.id && JSON.stringify(item.selectedOptions) === "{}",
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      currentCart.push({
        id: `${dish.id}-${Date.now()}`,
        dishId: dish.id,
        dish,
        quantity: 1,
        selectedOptions: {},
        customPrice: dish.price,
      })
    }

    storage.saveCart(currentCart)
    window.dispatchEvent(new Event("cartUpdated"))

    const toast = document.createElement("div")
    toast.className = "fixed bottom-20 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse"
    toast.textContent = `${dish.name} agregado al carrito!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.customPrice * item.quantity, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-gray-900">Comida saludable, entregada rápido</h1>
              <p className="text-gray-600 mb-6">Descubre bowls, ensaladas y wraps pensados para tu día.</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
              <SearchAndFilter dishes={dishes} onFilter={setFilteredDishes} />
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">No se encontraron platos que coincidan con tu búsqueda.</p>
                <button
                  onClick={() => setFilteredDishes(dishes)}
                  className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition"
                >
                  Ver todos los platos
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tu Pedido</h2>

              {cart.length > 0 ? (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span>
                          {item.quantity}x {item.dish.name}
                        </span>
                        <span className="font-medium">S/. {(item.customPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">S/. {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>S/. {(cartTotal * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition text-center block"
                  >
                    Ir a pagar
                  </Link>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Chatbot />
    </main>
  )
}
