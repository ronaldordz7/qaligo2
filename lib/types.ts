// Core types for the healthy food app

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "bowls" | "wraps" | "salads" | "smoothies" | "desserts"
  calories: number
  protein: number
  ingredients: string[]
  customizations: Customization[]
}

export interface Customization {
  id: string
  name: string
  type: "base" | "protein" | "toppings" | "extras"
  options: CustomizationOption[]
  required: boolean
  multipleSelect: boolean
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
}

export interface CartItem {
  id: string
  dishId: string
  dish: Dish
  quantity: number
  selectedOptions: Record<string, string[]>
  customPrice: number
}

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  createdAt: string
  customerInfo: CustomerInfo
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: "admin" | "customer" // Added role field
  createdAt: string
}

export interface AdminDashboard {
  totalOrders: number
  totalRevenue: number
  pendingOrders: Order[]
  recentOrders: Order[]
}
