export const imageConfig = {
  // Dish images - Replace these URLs with your public image links
  dishes: {
    buddhaBowl: "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25462-580x791.jpg",
    greenWrap: "https://tofuu.getjusto.com/orioneat-local/resized2/DC7StBC7JLE5Zwz2P-300-x.webp",
    kaleSalad: "https://cdn.loveandlemons.com/wp-content/uploads/2019/01/IMG_15972-crop2-580x795.jpg",
    smoothie: "https://www.gastrolabweb.com/u/fotografias/m/2021/6/12/f1456x819-14666_185036_5050.jpeg",
    troicalBowl: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/F20655FC-2D93-46B1-85C9-39700E59554E/Derivates/D82DA87E-116F-4B0D-AA16-E64362A4FC45.jpg",
    causeaLimena: "https://www.agroperu.pe/wp-content/uploads/2025/02/agroperu-informa_semana-causa-limena-peruana.jpg",
    cevicheBowl: "https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/vzcrywde/7ddf1d2e-ce89-4ef0-9d74-4181d417d69e.jpg",
    potatoPurple: "https://foodnheal.com/wp-content/uploads/2020/06/purple-potato-recipe.jpg",
    energySmoothie: "https://foodnheal.com/wp-content/uploads/2020/06/purple-potato-recipe.jpg",
  },

  // Logo - Change to your logo URL
  logo: "https://qaligo.hubstem.org/logo.jpeg",

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
