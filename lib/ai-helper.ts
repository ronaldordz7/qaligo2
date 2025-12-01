// AI response templates for the chatbot

export const aiResponses = {
  greeting: (name?: string) =>
    `¡Hola${name ? ` ${name}` : ""}! Bienvenido a QaliGo - tu restaurante de comida rápida saludable. ¿En qué puedo ayudarte hoy? Puedo recomendarte platos, responder sobre ingredientes, restricciones alimentarias, o ayudarte con tu pedido.`,

  recommendations: {
    healthy:
      "Nuestros platos con más proteína y menos calorías son: Buddha Bowl Glow (520 cal, 32g proteína) y Ensalada Kale Suprema (380 cal, 25g proteína). ¿Te interesa alguno?",
    vegan:
      "Para opciones veganas, te recomendamos: Wrap Saludable Verde sin pollo, Buddha Bowl con tofu, o Ensalada Kale. ¿Cuál prefieres?",
    quick:
      "Si buscas algo rápido, nuestros smoothies (7.99$) están listos en minutos. O puedes probar nuestros wraps (10.99$).",
  },

  nutritionInfo: (dishName: string) => {
    const dishes: Record<string, string> = {
      "buddha bowl": "Buddha Bowl Glow: 520 calorías, 32g de proteína, rica en fibra y antioxidantes.",
      kale: "Ensalada Kale Suprema: 380 calorías, 25g de proteína, excelente fuente de vitaminas K.",
      smoothie: "Smoothie Energético: 280 calorías, 20g de proteína, perfecto para post-entreno.",
    }
    return dishes[dishName.toLowerCase()] || "Cuéntame qué plato te interesa y te doy los detalles nutricionales."
  },

  processHelp:
    "Para completar tu compra: 1) Agrega platos al carrito, 2) Personaliza si quieres, 3) Revisa el carrito, 4) Completa checkout con tus datos, 5) Confirma el pago. ¿Necesitas ayuda con algo?",

  default:
    "Entiendo. ¿Hay algo más que pueda ayudarte? Puedo recomendarte platos, explicar ingredientes, o aclarar tu pedido.",
}

export const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()

  if (message.includes("hola") || message.includes("hola") || message.includes("buenos")) {
    return aiResponses.greeting()
  }

  if (message.includes("saludable") || message.includes("dieta")) {
    return aiResponses.recommendations.healthy
  }

  if (message.includes("vegano") || message.includes("vegetariano")) {
    return aiResponses.recommendations.vegan
  }

  if (message.includes("rápido") || message.includes("rapido")) {
    return aiResponses.recommendations.quick
  }

  if (
    message.includes("calorías") ||
    message.includes("proteína") ||
    message.includes("nutricion") ||
    message.includes("información")
  ) {
    return aiResponses.nutritionInfo(message)
  }

  if (message.includes("como") && (message.includes("comprar") || message.includes("pedir"))) {
    return aiResponses.processHelp
  }

  return aiResponses.default
}
