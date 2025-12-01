"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { CartItem } from "@/lib/types"
import { storage } from "@/lib/storage"
import { CartItemCard } from "@/components/cart-item-card"
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setCartItems(storage.getCart())

    const handleCartUpdate = () => {
      setCartItems(storage.getCart())
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updated = cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updated)
    storage.saveCart(updated)
  }

  const handleRemoveItem = (itemId: string) => {
    const updated = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updated)
    storage.saveCart(updated)
  }

  const handleClearCart = () => {
    if (window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      setCartItems([])
      storage.clearCart()
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.customPrice * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h1 className="text-3xl font-bold mb-2">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">Agrega platos deliciosos y saludables a tu carrito</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <ArrowLeft size={20} />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
            >
              <Trash2 size={18} />
              Vaciar carrito
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-20 shadow-sm">
              <h2 className="font-bold text-lg mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuesto (10%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entregas:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center mb-4">
                  {cartItems.length} {cartItems.length === 1 ? "artículo" : "artículos"} en el carrito
                </p>
                <Link
                  href="/checkout"
                  className="block w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition text-center"
                >
                  Ir al Checkout
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-secondary text-foreground font-medium py-3 px-4 rounded-lg hover:bg-border transition text-center"
                >
                  Continuar Comprando
                </Link>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm text-center">
                <p className="text-green-700 font-medium">Envío gratis en pedidos mayores a $50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
