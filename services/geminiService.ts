
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeResponse } from "../types";

export const fetchRecipeIngredients = async (recipeName: string): Promise<RecipeResponse> => {
  // Initialize the AI client directly inside the call to ensure the latest environment variables are used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please act as a professional chef. Provide a detailed list of ingredients, servings, and a pro tip for this recipe: ${recipeName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipeName: {
            type: Type.STRING,
            description: "The name of the recipe.",
          },
          servings: {
            type: Type.STRING,
            description: "Typical servings (e.g., '4 servings').",
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING, description: "Ingredient name." },
                amount: { type: Type.STRING, description: "Quantity with units." },
                notes: { type: Type.STRING, description: "Preparation notes like 'diced' or 'chilled'." },
              },
              required: ["item", "amount"],
            },
          },
          briefInstructions: {
            type: Type.STRING,
            description: "A short summary of the cooking method.",
          },
          chefTip: {
            type: Type.STRING,
            description: "An expert culinary tip for this dish.",
          },
        },
        required: ["recipeName", "servings", "ingredients", "briefInstructions", "chefTip"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data returned from the Gemini API.");
  }

  try {
    return JSON.parse(text) as RecipeResponse;
  } catch (e) {
    throw new Error("Failed to parse the recipe data. Please try again.");
  }
};
