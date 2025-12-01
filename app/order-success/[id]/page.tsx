"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { Order } from "@/lib/types"
import { storage } from "@/lib/storage"
import { CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"

export default function OrderSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orderId = params.id as string
    const allOrders = storage.getOrders()
    const foundOrder = allOrders.find((o) => o.id === orderId)

    if (!foundOrder) {
      router.push("/")
      return
    }

    setOrder(foundOrder)
  }, [params.id, router])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white text-center">
            <CheckCircle size={64} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-green-100">Tu pedido ha sido registrado exitosamente</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Order Number and Total */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Número de Pedido</p>
              <p className="text-3xl font-bold mb-4 font-mono">{order.id}</p>
              <p className="text-sm text-muted-foreground mb-1">Monto Total Pagado</p>
              <p className="text-4xl font-bold text-green-600">${order.total.toFixed(2)}</p>
            </div>

            {/* Timeline */}
            <div className="border-t border-b border-border py-6">
              <h2 className="font-bold text-lg mb-4">Estado del Pedido</h2>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Clock size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Pedido Confirmado</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("es-ES")}</p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Información de Entrega</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{order.customerInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-semibold">{order.customerInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección de Entrega</p>
                    <p className="font-semibold">{order.customerInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-6">
              <h2 className="font-bold text-lg mb-4">Artículos del Pedido</h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-muted rounded text-sm">
                    <span>
                      {item.dish.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">${(item.customPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-muted-foreground">Impuesto</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-600">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <Link
                href="/"
                className="bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition text-center"
              >
                Volver al Catálogo
              </Link>
              <button
                onClick={() => window.print()}
                className="bg-secondary text-foreground font-bold py-3 px-4 rounded-lg hover:bg-border transition"
              >
                Imprimir Recibo
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Recibirás un email de confirmación en breve. Tu pedido llegará en aproximadamente 30-45 minutos.
        </p>
      </div>
    </main>
  )
}
