"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storage } from "@/lib/storage"
import type { User } from "@/lib/types"
import { Mail, Lock, UserIcon, Phone, MapPin, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"

    if (!formData.password) newErrors.password = "La contraseña es requerida"
    else if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres"

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Simulate registration delay
    setTimeout(() => {
      const newUser: User = {
        id: `USER-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: "customer", // All new registrations are customers
        createdAt: new Date().toISOString(),
      }

      if (storage.registerUser(newUser)) {
        storage.setCurrentUser(newUser)
        router.push("/")
      } else {
        setErrors({ email: "Este email ya está registrado" })
      }

      setLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Crear Cuenta</h1>
            <p className="text-muted-foreground mt-2">Únete a QaliGo hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {errors.email && (
              <div className="flex gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{errors.email}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Nombre Completo</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.name ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.email ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.password ? "border-red-500" : "border-border"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Confirmar</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.confirmPassword ? "border-red-500" : "border-border"
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Teléfono</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.phone ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Dirección</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle, número, ciudad"
                  rows={2}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.address ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Al crear una cuenta, aceptas nuestros términos de servicio.
        </p>
      </div>
    </main>
  )
}
