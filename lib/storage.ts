// Local storage utilities for persisting data

import { imageConfig } from "./image-config"
import type { Dish, User, Order, CartItem } from "./types"

const DISHES_KEY = "healthy_food_dishes"
const USERS_KEY = "healthy_food_users"
const ORDERS_KEY = "healthy_food_orders"
const CART_KEY = "healthy_food_cart"
const CURRENT_USER_KEY = "healthy_food_current_user"

export const sampleDishes: Dish[] = [
  {
    id: "1",
    name: "Buddha Bowl Glow",
    description: "Arroz integral, quínoa, pollo a la parrilla, aguacate, remolacha y tahini",
    price: 12.99,
    image: imageConfig.dishes.buddhaBowl,
    category: "bowls",
    calories: 520,
    protein: 32,
    ingredients: ["Arroz integral", "Quínoa", "Pollo", "Aguacate", "Remolacha", "Tahini"],
    customizations: [
      {
        id: "base-1",
        name: "Base",
        type: "base",
        required: true,
        multipleSelect: false,
        options: [
          { id: "base-1-1", name: "Arroz integral", price: 0 },
          { id: "base-1-2", name: "Quínoa", price: 0 },
          { id: "base-1-3", name: "Espinaca", price: 0 },
        ],
      },
      {
        id: "protein-1",
        name: "Proteína",
        type: "protein",
        required: true,
        multipleSelect: false,
        options: [
          { id: "prot-1-1", name: "Pollo a la parrilla", price: 0 },
          { id: "prot-1-2", name: "Tofu", price: 0 },
          { id: "prot-1-3", name: "Salmón", price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Wrap Saludable Verde",
    description: "Tortilla integral, pechuga de pollo, lechuga, tomate, hummus",
    price: 10.99,
    image: imageConfig.dishes.greenWrap,
    category: "wraps",
    calories: 450,
    protein: 28,
    ingredients: ["Tortilla integral", "Pechuga de pollo", "Lechuga", "Tomate", "Hummus"],
    customizations: [],
  },
  {
    id: "3",
    name: "Ensalada Kale Suprema",
    description: "Kale, manzana, frutos secos, pollo, aderezo balsámico",
    price: 11.99,
    image: imageConfig.dishes.kaleSalad,
    category: "salads",
    calories: 380,
    protein: 25,
    ingredients: ["Kale", "Manzana", "Frutos secos", "Pollo", "Aderezo balsámico"],
    customizations: [],
  },
  {
    id: "4",
    name: "Smoothie Energético",
    description: "Plátano, berries, proteína de vainilla, leche de almendra",
    price: 7.99,
    image: imageConfig.dishes.smoothie,
    category: "smoothies",
    calories: 280,
    protein: 20,
    ingredients: ["Plátano", "Berries", "Proteína", "Leche de almendra"],
    customizations: [],
  },
  {
    id: "5",
    name: "Bowl Tropical Detox",
    description: "Piña, mango, coco, granola, yogur griego",
    price: 9.99,
    image: imageConfig.dishes.troicalBowl,
    category: "bowls",
    calories: 340,
    protein: 15,
    ingredients: ["Piña", "Mango", "Coco", "Granola", "Yogur griego"],
    customizations: [],
  },
]

export const storage = {
  // Dishes
  getDishes: (): Dish[] => {
    if (typeof window === "undefined") return sampleDishes
    const stored = localStorage.getItem(DISHES_KEY)
    return stored ? JSON.parse(stored) : sampleDishes
  },

  saveDishes: (dishes: Dish[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(DISHES_KEY, JSON.stringify(dishes))
  },

  getDishById: (id: string): Dish | null => {
    const dishes = storage.getDishes()
    return dishes.find((d) => d.id === id) || null
  },

  // Users
  initializeAdminUser: () => {
    const users = storage.getUsers()
    const adminExists = users.some((u) => u.email === "admin@qualigo.com")

    if (!adminExists) {
      const adminUser: User = {
        id: "ADMIN-001",
        name: "Administrador QaliGo",
        email: "admin@qualigo.com",
        password: "admin123",
        phone: "+1-555-0001",
        address: "QaliGo HQ",
        role: "admin", // Set admin role
        createdAt: new Date().toISOString(),
      }
      users.push(adminUser)
      storage.saveUsers(users)
    }
  },

  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  registerUser: (user: User): boolean => {
    const users = storage.getUsers()
    if (users.some((u) => u.email === user.email)) return false
    user.role = "customer"
    users.push(user)
    storage.saveUsers(users)
    return true
  },

  loginUser: (email: string, password: string): User | null => {
    const users = storage.getUsers()
    return users.find((u) => u.email === email && u.password === password) || null
  },

  // Current User
  setCurrentUser: (user: User | null) => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  },

  // Cart
  getCart: (): CartItem[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveCart: (items: CartItem[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },

  clearCart: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(CART_KEY)
  },

  // Orders
  getOrders: (): Order[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveOrders: (orders: Order[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  },

  createOrder: (order: Order): Order => {
    const orders = storage.getOrders()
    orders.push(order)
    storage.saveOrders(orders)
    return order
  },

  getUserOrders: (userId: string): Order[] => {
    const orders = storage.getOrders()
    return orders.filter((o) => o.userId === userId)
  },
}
