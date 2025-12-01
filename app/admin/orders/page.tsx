"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/types"
import { storage } from "@/lib/storage"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ChevronDown, Search } from "lucide-react"

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = storage.getCurrentUser()
    if (!currentUser || currentUser.email !== "admin@qualigo.com") {
      router.push("/login")
      return
    }

    const allOrders = storage.getOrders()
    setOrders(allOrders)
    setFilteredOrders(allOrders)
  }, [router])

  useEffect(() => {
    let filtered = orders

    if (selectedStatus !== "all") {
      filtered = filtered.filter((o) => o.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [searchTerm, selectedStatus, orders])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    storage.saveOrders(updatedOrders)
    setOrders(updatedOrders)
  }

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
    { value: "confirmed", label: "Confirmado", color: "bg-blue-100 text-blue-700" },
    { value: "preparing", label: "Preparando", color: "bg-purple-100 text-purple-700" },
    { value: "ready", label: "Listo", color: "bg-green-100 text-green-700" },
    { value: "delivered", label: "Entregado", color: "bg-gray-100 text-gray-700" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
            <p className="text-muted-foreground mt-2">Total: {filteredOrders.length} pedidos</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "all")}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="all">Todos los estados</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusOption = statusOptions.find((s) => s.value === order.status)
                return (
                  <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted transition"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-bold">{order.id}</span>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusOption?.color}`}
                          >
                            {statusOption?.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="text-xs">Cliente</p>
                            <p className="font-semibold text-foreground">{order.customerInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-xs">Total</p>
                            <p className="font-bold text-green-600">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs">Fecha</p>
                            <p className="font-semibold text-foreground">
                              {new Date(order.createdAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-muted-foreground transition ${expandedOrder === order.id ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Order Details */}
                    {expandedOrder === order.id && (
                      <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Información del Cliente</h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">Email:</span> {order.customerInfo.email}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Teléfono:</span> {order.customerInfo.phone}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Dirección:</span> {order.customerInfo.address}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold mb-2">Artículos del Pedido</h4>
                          <div className="space-y-1 text-sm">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>
                                  {item.dish.name} x {item.quantity}
                                </span>
                                <span className="font-semibold">${(item.customPrice * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Change */}
                        <div>
                          <h4 className="font-semibold mb-2">Cambiar Estado</h4>
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleStatusChange(order.id, opt.value)}
                                className={`px-3 py-1 rounded text-xs font-medium transition ${
                                  order.status === opt.value
                                    ? `${opt.color}`
                                    : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No se encontraron pedidos</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
