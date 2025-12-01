"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { storage } from "@/lib/storage"
import { imageConfig } from "@/lib/image-config"
import type { User } from "@/lib/types"
import { ShoppingCart, LogOut, Menu, X } from "lucide-react"

export function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCurrentUser(storage.getCurrentUser())
    updateCartCount()

    const handleStorageChange = () => {
      setCurrentUser(storage.getCurrentUser())
      updateCartCount()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const updateCartCount = () => {
    const cart = storage.getCart()
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
  }

  const handleLogout = () => {
    storage.setCurrentUser(null)
    setCurrentUser(null)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 border-b bg-white border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <img
              src={imageConfig.logo || "/placeholder.svg"}
              alt="QaliGo"
              className="w-8 h-8 object-contain rounded-full"
            />
            <span className="text-gray-900">QaliGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 flex-1 px-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition">
              Menú
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {currentUser && currentUser.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition">
                Admin
              </Link>
            )}
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600">
              Menú
            </Link>
            {currentUser && currentUser.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium hover:text-emerald-600">
                Admin
              </Link>
            )}
            <Link href="/cart" className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart size={20} />
              Carrito ({cartCount})
            </Link>
            {currentUser ? (
              <button onClick={handleLogout} className="text-sm font-medium text-red-600 flex items-center gap-2">
                <LogOut size={16} />
                Salir
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium text-emerald-600 px-4 py-2 rounded-lg">
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
