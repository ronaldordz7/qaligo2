export const imageConfig = {
  // Dish images - Replace these URLs with your public image links
  dishes: {
    buddhaBowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    greenWrap: "https://tofuu.getjusto.com/orioneat-local/resized2/DC7StBC7JLE5Zwz2P-300-x.webp",
    kaleSalad: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop",
    smoothie: "https://images.unsplash.com/photo-1587239541167-1aa9268dd3f9?w=500&h=500&fit=crop",
    troicalBowl: "https://images.unsplash.com/photo-1590080876614-fef1ef8f9e0a?w=500&h=500&fit=crop",
    causeaLimena: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    cevicheBowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    potatoPurple: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    energySmoothie: "https://images.unsplash.com/photo-1587239541167-1aa9268dd3f9?w=500&h=500&fit=crop",
  },

  // Logo - Change to your logo URL
  logo: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=40&h=40&fit=crop",

  // Hero image
  hero: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop",
}

// Helper function to get dish image
export const getDishImage = (dishId: string): string => {
  const images: Record<string, string> = {
    "1": imageConfig.dishes.buddhaBowl,
    "2": imageConfig.dishes.energySmoothie,
    "3": imageConfig.dishes.greenWrap,
    "4": imageConfig.dishes.kaleSalad,
    "5": imageConfig.dishes.troicalBowl,
    "6": imageConfig.dishes.causeaLimena,
    "7": imageConfig.dishes.cevicheBowl,
    "8": imageConfig.dishes.potatoPurple,
  }
  return images[dishId] || imageConfig.dishes.buddhaBowl
}
