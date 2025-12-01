"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/types"
import { storage } from "@/lib/storage"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const currentUser = storage.getCurrentUser()
    if (!currentUser || currentUser.email !== "admin@qualigo.com") {
      router.push("/login")
      return
    }

    const allOrders = storage.getOrders()
    setOrders(allOrders)

    processChartData(allOrders)
    setIsLoading(false)
  }, [router])

  const processChartData = (ordersData: Order[]) => {
    // Group orders by date
    const dataByDate: Record<string, { date: string; revenue: number; orders: number }> = {}

    ordersData.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("es-ES")
      if (!dataByDate[date]) {
        dataByDate[date] = { date, revenue: 0, orders: 0 }
      }
      dataByDate[date].revenue += order.total
      dataByDate[date].orders += 1
    })

    const chartArray = Object.values(dataByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setChartData(chartArray)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="text-center">Cargando analítica...</div>
        </main>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"
  const uniqueCustomers = new Set(orders.map((o) => o.customerInfo.email)).size

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
      label: "Clientes Únicos",
      value: uniqueCustomers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Ticket Promedio",
      value: `$${avgOrderValue}`,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  const dishSales: Record<string, { name: string; count: number; revenue: number }> = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!dishSales[item.dish.name]) {
        dishSales[item.dish.name] = { name: item.dish.name, count: 0, revenue: 0 }
      }
      dishSales[item.dish.name].count += item.quantity
      dishSales[item.dish.name].revenue += item.customPrice * item.quantity
    })
  })

  const topDishes = Object.values(dishSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Analítica</h1>
            <p className="text-muted-foreground mt-2">Estadísticas y métricas de tu negocio</p>
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-4">Ingresos por Día</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold mb-4">Pedidos por Día</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Dishes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4">Platos Más Vendidos</h2>
            <div className="space-y-2">
              {topDishes.length > 0 ? (
                topDishes.map((dish, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">{dish.name}</p>
                      <p className="text-xs text-muted-foreground">{dish.count} unidades vendidas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${dish.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay datos aún</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
