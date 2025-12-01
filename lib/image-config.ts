export const imageConfig = {
  // Dish images - Replace these URLs with your public image links
  dishes: {
    buddhaBowl: "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25462-580x791.jpg",
    greenWrap: "/healthy-green-wrap-with-chicken-and-vegetables.jpg",
    kaleSalad: "/fresh-kale-salad-with-apples-and-grilled-chicken.jpg",
    smoothie: "/vibrant-berry-protein-smoothie-in-glass.jpg",
    troicalBowl: "/tropical-acai-bowl-with-granola-and-coconut.jpg",
  },

  // Logo - Change to your logo URL
  logo: "/your-logo.png",

  // Hero image
  hero: "/healthy-food-hero.jpg",
}

// Helper function to get dish image
export const getDishImage = (dishId: string): string => {
  const images: Record<string, string> = {
    "1": imageConfig.dishes.buddhaBowl,
    "2": imageConfig.dishes.greenWrap,
    "3": imageConfig.dishes.kaleSalad,
    "4": imageConfig.dishes.smoothie,
    "5": imageConfig.dishes.troicalBowl,
  }
  return images[dishId] || imageConfig.dishes.buddhaBowl
}
