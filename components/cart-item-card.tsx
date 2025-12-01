"use client"

import type { CartItem } from "@/lib/types"
import { X, Plus, Minus } from "lucide-react"

interface CartItemCardProps {
  item: CartItem
  onQuantityChange: (itemId: string, newQuantity: number) => void
  onRemove: (itemId: string) => void
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const handleOptionDisplay = () => {
    const options: string[] = []
    Object.entries(item.selectedOptions).forEach(([customizationId, optionIds]) => {
      const customization = item.dish.customizations.find((c) => c.id === customizationId)
      if (customization) {
        optionIds.forEach((optionId) => {
          const option = customization.options.find((o) => o.id === optionId)
          if (option) {
            options.push(option.name)
          }
        })
      }
    })
    return options
  }

  const displayOptions = handleOptionDisplay()
  const itemTotal = item.customPrice * item.quantity

  return (
    <div className="flex gap-4 p-4 border border-border rounded-lg bg-card hover:shadow-md transition">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={`/.jpg?key=xtgq2&height=100&width=100&query=${item.dish.name}`}
          alt={item.dish.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-lg line-clamp-1">{item.dish.name}</h3>
          {displayOptions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {displayOptions.map((opt, idx) => (
                <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {opt}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            ${item.customPrice.toFixed(2)} x {item.quantity}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 hover:bg-red-50 text-red-500 rounded transition"
          aria-label="Remove item"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
            className="p-1 hover:bg-background rounded transition"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 hover:bg-background rounded transition"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="font-bold text-lg text-green-600">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  )
}
