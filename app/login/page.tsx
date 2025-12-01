"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storage } from "@/lib/storage"
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    storage.initializeAdminUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    // Simulate login delay
    setTimeout(() => {
      const user = storage.loginUser(email, password)

      if (user) {
        storage.setCurrentUser(user)
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        setError("Email o contraseña incorrectos")
      }

      setLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src="https://via.placeholder.com/48?text=QL"
              alt="QaliGo Logo"
              className="w-12 h-12 mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold">Bienvenido a QaliGo</h1>
            <p className="text-muted-foreground mt-2">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Este es un entorno de demostración. Los datos se guardan localmente en tu navegador.
        </p>
      </div>
    </main>
  )
}
