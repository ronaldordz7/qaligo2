"use client"

import { useState } from "react"
import type { Dish, CartItem } from "@/lib/types"
import { Plus, Minus, ShoppingCart } from "lucide-react"

interface DishCustomizerProps {
  dish: Dish
  onAddToCart: (item: CartItem) => void
}

export function DishCustomizer({ dish, onAddToCart }: DishCustomizerProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [customPrice, setCustomPrice] = useState(dish.price)

  const handleOptionChange = (customizationId: string, optionId: string, checked: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[customizationId] || []
      let updated: string[]

      if (checked) {
        updated = [...current, optionId]
      } else {
        updated = current.filter((id) => id !== optionId)
      }

      // If single select, replace instead of adding
      const customization = dish.customizations.find((c) => c.id === customizationId)
      if (customization && !customization.multipleSelect) {
        updated = [optionId]
      }

      return { ...prev, [customizationId]: updated }
    })

    // Recalculate price
    let newPrice = dish.price
    Object.entries(selectedOptions).forEach(([customizationId, optionIds]) => {
      optionIds.forEach((optionId) => {
        const customization = dish.customizations.find((c) => c.id === customizationId)
        const option = customization?.options.find((o) => o.id === optionId)
        if (option) {
          newPrice += option.price
        }
      })
    })
    setCustomPrice(newPrice)
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      dish,
      quantity,
      selectedOptions,
      customPrice,
    }

    onAddToCart(cartItem)
  }

  const totalPrice = customPrice * quantity

  return (
    <div className="space-y-6">
      {/* Customizations */}
      {dish.customizations.length > 0 && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-bold text-lg">Personaliza tu plato</h3>

          {dish.customizations.map((customization) => (
            <div key={customization.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{customization.name}</h4>
                {customization.required && <span className="text-red-500 text-xs font-bold">*Requerido</span>}
              </div>

              <div className="space-y-2 pl-4">
                {customization.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded transition"
                  >
                    <input
                      type={customization.multipleSelect ? "checkbox" : "radio"}
                      name={customization.id}
                      value={option.id}
                      checked={selectedOptions[customization.id]?.includes(option.id) || false}
                      onChange={(e) => handleOptionChange(customization.id, option.id, e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm">{option.name}</span>
                      {option.price > 0 && (
                        <span className="text-sm text-green-600 font-semibold">+${option.price}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity and Price */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Cantidad:</span>
          <div className="flex items-center gap-3 bg-muted rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-background rounded transition"
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-background rounded transition">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Precio total:</p>
            <p className="text-3xl font-bold text-green-600">${totalPrice.toFixed(2)}</p>
            {dish.customizations.length > 0 && customPrice !== dish.price && (
              <p className="text-xs text-muted-foreground mt-1">${customPrice.toFixed(2)} por unidad</p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}
