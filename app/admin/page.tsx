"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Order, User } from "@/lib/types"
import { storage } from "@/lib/storage"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ShoppingCart, Users, DollarSign, Clock } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const currentUser = storage.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    setOrders(storage.getOrders())
    setUsers(storage.getUsers())
  }, [router])

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalUsers = users.length
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: "Ingresos Totales",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pedidos Totales",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Usuarios Registrados",
      value: totalUsers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pedidos Pendientes",
      value: pendingOrders,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
            <p className="text-muted-foreground mt-2">Bienvenido al panel de control de QaliGo</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-card rounded-xl border border-border p-6">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Recent Orders */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Pedidos Recientes</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID Pedido</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Monto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="px-6 py-4 font-mono text-sm font-semibold">{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{order.customerInfo.name}</p>
                            <p className="text-xs text-muted-foreground">{order.customerInfo.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "ready"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-green-600 hover:text-green-700 font-medium text-sm">Ver</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No hay pedidos aún
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
