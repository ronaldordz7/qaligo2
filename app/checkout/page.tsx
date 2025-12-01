"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { CartItem, Order } from "@/lib/types"
import { storage } from "@/lib/storage"
import { CheckoutForm, type CheckoutData } from "@/components/checkout-form"
import { PaymentForm, type PaymentData } from "@/components/payment-form"
import { ArrowLeft, AlertCircle } from "lucide-react"

type CheckoutStep = "info" | "payment" | "loading"

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [step, setStep] = useState<CheckoutStep>("info")
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CheckoutData | null>(null)

  useEffect(() => {
    const cart = storage.getCart()
    if (cart.length === 0) {
      router.push("/cart")
      return
    }
    setCartItems(cart)
  }, [router])

  const subtotal = cartItems.reduce((sum, item) => sum + item.customPrice * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckoutSubmit = (data: CheckoutData) => {
    setCustomerInfo(data)
    setStep("payment")
  }

  const handlePaymentSubmit = async (data: PaymentData) => {
    setLoading(true)
    setStep("loading")

    // Simulate payment processing
    setTimeout(() => {
      if (customerInfo) {
        const order: Order = {
          id: `ORD-${Date.now()}`,
          userId: storage.getCurrentUser()?.id,
          items: cartItems,
          subtotal,
          tax,
          total,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          customerInfo,
        }

        storage.createOrder(order)
        storage.clearCart()
        window.dispatchEvent(new Event("cartUpdated"))

        router.push(`/order-success/${order.id}`)
      }
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/cart" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mb-8">
          <ArrowLeft size={18} />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              {step === "info" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Información de Entrega</h2>
                  <CheckoutForm onSubmit={handleCheckoutSubmit} loading={false} />
                </div>
              )}

              {step === "payment" && (
                <div>
                  <button
                    onClick={() => setStep("info")}
                    className="text-green-600 hover:text-green-700 font-medium mb-6 flex items-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Volver a información
                  </button>
                  <h2 className="text-xl font-bold mb-6">Método de Pago</h2>
                  <PaymentForm amount={total} onSubmit={handlePaymentSubmit} loading={loading} />
                </div>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-lg font-semibold">Procesando tu pago...</p>
                  <p className="text-sm text-muted-foreground mt-2">Por favor espera mientras confirmamos tu pedido</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-20 shadow-sm">
              <h2 className="font-bold text-lg mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pb-6 border-b border-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.dish.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">${(item.customPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

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
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
