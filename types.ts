
export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface RecipeResponse {
  recipeName: string;
  servings: string;
  ingredients: Ingredient[];
  briefInstructions: string;
  chefTip: string;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  recipe: RecipeResponse | null;
  query: string;
}
