"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Loader2 } from "lucide-react"
import { storage } from "@/lib/storage"
import { chatbotConfig } from "@/lib/chatbot-config"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Bienvenido a QaliGo. Soy tu asistente virtual. ¿En qué puedo ayudarte?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      if (chatbotConfig.apiKey && chatbotConfig.apiKey !== "sk-your-api-key-here") {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${chatbotConfig.model}:generateContent?key=${chatbotConfig.apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${chatbotConfig.prompt}\n\nUsuario pregunta: ${inputValue}\n\nResponde brevemente en español.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
                topP: 0.9,
                topK: 40,
              },
            }),
          },
        )

        if (!response.ok) {
          console.log("[v0] API Response Status:", response.status)
          const errorData = await response.json().catch(() => ({}))
          console.log("[v0] API Error Data:", errorData)
          throw new Error(`API returned status ${response.status}`)
        }

        const data = await response.json()

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          console.log("[v0] Unexpected API response structure:", data)
          throw new Error("Unexpected API response structure")
        }

        const aiResponse = data.candidates[0].content.parts?.[0]?.text || "Disculpa, no pude procesar tu solicitud."

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        // Fallback to local responses
        const aiResponse = getLocalAIResponse(inputValue)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("[v0] Chatbot error:", error)
      const fallbackResponse = getLocalAIResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse || "Disculpa, hubo un error. Por favor intenta de nuevo.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getLocalAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("hola") || message.includes("buenos")) {
      const user = storage.getCurrentUser()
      return `¡Hola${user ? ` ${user.name}` : ""}! Bienvenido a QaliGo. Soy tu asistente. ¿Qué te gustaría pedir hoy?`
    }

    if (message.includes("saludable") || message.includes("dieta") || message.includes("salud")) {
      return "Nuestros platos más saludables son: Buddha Bowl Andino (520 cal, 32g proteína), Ensalada Inca (380 cal, 25g proteína) y Smoothie Energético (280 cal, 20g proteína). ¿Cuál te interesa?"
    }

    if (message.includes("vegano") || message.includes("vegetariano") || message.includes("sin carne")) {
      return "Tenemos excelentes opciones veganas y vegetarianas: Buddha Bowl con tofu, Wrap Saludable sin pollo, Ensalada Inca sin queso, o cualquier smoothie. ¿Cuál prefieres?"
    }

    if (message.includes("proteína") || message.includes("musculo") || message.includes("fuerza")) {
      return "Para ganancia muscular recomiendo: Ceviche Bowl (38g proteína), Buddha Bowl con Salmón (37g proteína) o Causa Limeña (22g proteína). Todos excelentes para tu objetivo."
    }

    if (message.includes("rápido") || message.includes("rapido") || message.includes("prisa")) {
      return "Si tienes prisa, nuestros Smoothies (S/. 16.90) están listos en minutos, o los Wraps (S/. 24.90) se preparan muy rápido. ¿Te interesa?"
    }

    if (message.includes("precio") || message.includes("costo") || message.includes("valor")) {
      return "Nuestros precios van desde S/. 16.90 (Smoothies) hasta S/. 32.90 (Ceviche Bowl). ¿Hay algún rango que busques?"
    }

    if (message.includes("horario") || message.includes("abierto")) {
      return "Estamos abiertos de lunes a domingo, 11:00 AM a 10:00 PM. ¿Te gustaría hacer un pedido?"
    }

    return "Entiendo. ¿Hay algo más que pueda ayudarte? Puedo recomendarte platos, explicar ingredientes o ayudarte con tu pedido."
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center z-40"
        aria-label="Open chatbot"
        title="Asistente QaliGo"
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-32px)] h-96 bg-white rounded-lg shadow-xl border border-border flex flex-col z-40">
      <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
        <h3 className="font-bold">Asistente QaliGo</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-green-700 rounded transition"
          aria-label="Close chatbot"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.isUser ? "bg-green-600 text-white rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-muted rounded-lg">
              <Loader2 size={18} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
