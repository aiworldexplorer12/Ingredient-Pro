
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeResponse } from "../types";

export const fetchRecipeIngredients = async (recipeName: string): Promise<RecipeResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is configured correctly.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide the full list of ingredients and basic details for the following recipe: ${recipeName}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipeName: {
            type: Type.STRING,
            description: "The name of the recipe corrected for spelling or common phrasing.",
          },
          servings: {
            type: Type.STRING,
            description: "Typical serving size for the recipe.",
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING, description: "The name of the ingredient." },
                amount: { type: Type.STRING, description: "Quantity including units (e.g., 2 cups, 500g, to taste)." },
                notes: { type: Type.STRING, description: "Preparation notes (e.g., sifted, melted, diced)." },
              },
              required: ["item", "amount"],
            },
          },
          briefInstructions: {
            type: Type.STRING,
            description: "A very brief 2-3 sentence overview of the cooking process.",
          },
          chefTip: {
            type: Type.STRING,
            description: "A professional tip for making this specific dish better.",
          },
        },
        required: ["recipeName", "servings", "ingredients", "briefInstructions", "chefTip"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response received from the kitchen.");
  }

  return JSON.parse(text) as RecipeResponse;
};
