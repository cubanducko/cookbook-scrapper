export const databases = {
  elComidista: "el-comidista",
};

export type ScrapperRawData = {
  url: string;
  body: string;
};

export type Recipe = {
  title: string;
  instructions: string[];
  ingredients: string[];
  time: number;
  difficulty: number;
  tags: {
    season: Season;
    calories: CaloricContent;
    cuisine: CuisineInfluence[];
    time: PreparationTime;
    difficulty: DifficultyLevel;
    others: (NutrientContent | HealthRelated)[];
  };
};

enum PreparationTime {
  QuickFix = "Quick Fix",
  ModeratePrep = "Moderate Prep",
  TimeConsuming = "Time-Consuming",
  SlowCook = "Slow Cook",
}

enum Season {
  Spring = "Spring",
  Summer = "Summer",
  Autumn = "Autumn",
  Winter = "Winter",
}

enum CaloricContent {
  Low = "Low",
  Moderate = "Moderate",
  High = "High",
}

enum CuisineInfluence {
  Mediterranean = "Mediterranean",
  Asian = "Asian",
  LatinAmerican = "Latin American",
  European = "European",
  MiddleEastern = "Middle Eastern",
  African = "African",
}

enum NutrientContent {
  HighProtein = "High Protein",
  LowCarb = "Low Carb",
  HighFiber = "High Fiber",
  LowFat = "Low Fat",
  HighCarb = "High Carb",
  KetoFriendly = "Keto-Friendly",
  VeganPower = "Vegan Power",
}

enum HealthRelated {
  HeartHealthy = "Heart-Healthy",
  DiabeticFriendly = "Diabetic-Friendly",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
  NutFree = "Nut-Free",
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
}

enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}
