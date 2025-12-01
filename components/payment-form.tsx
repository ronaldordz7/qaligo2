"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, AlertCircle } from "lucide-react"

interface PaymentFormProps {
  amount: number
  onSubmit: (data: PaymentData) => void
  loading: boolean
}

export interface PaymentData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

export function PaymentForm({ amount, onSubmit, loading }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Partial<PaymentData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {}

    if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) {
      newErrors.cardNumber = "Número de tarjeta inválido"
    }
    if (!formData.cardName.trim()) newErrors.cardName = "Nombre del titular es requerido"
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) newErrors.expiryDate = "Formato: MM/YY"
    if (!formData.cvv.match(/^\d{3,4}$/)) newErrors.cvv = "CVV debe tener 3 o 4 dígitos"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData((prev) => ({ ...prev, cardNumber: formatted }))
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setFormData((prev) => ({ ...prev, expiryDate: value }))
    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: undefined }))
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setFormData((prev) => ({ ...prev, cvv: value }))
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: undefined }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof PaymentData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 font-semibold">Entorno de Prueba</p>
          <p className="text-xs text-blue-700 mt-1">Usa números de tarjeta de prueba: 4111 1111 1111 1111</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Número de Tarjeta *</label>
        <div className="relative">
          <CreditCard size={20} className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="4111 1111 1111 1111"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
              errors.cardNumber ? "border-red-500" : "border-border"
            }`}
          />
        </div>
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Nombre del Titular *</label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
            errors.cardName ? "border-red-500" : "border-border"
          }`}
        />
        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Vencimiento *</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleExpiryChange}
            maxLength={5}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
              errors.expiryDate ? "border-red-500" : "border-border"
            }`}
          />
          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">CVV *</label>
          <input
            type="text"
            placeholder="123"
            value={formData.cvv}
            onChange={handleCVVChange}
            maxLength={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
              errors.cvv ? "border-red-500" : "border-border"
            }`}
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Procesando pago..." : `Pagar $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}
