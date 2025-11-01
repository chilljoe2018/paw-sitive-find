import { GoogleGenAI } from "@google/genai";
import { Pet, PetStatus } from "../types";

/**
 * Creates and returns a GoogleGenAI client instance if the API key is available.
 * This function is called on-demand to ensure the client is initialized with the latest environment configuration.
 * @returns {GoogleGenAI | null} A client instance or null if the API key is missing.
 */
const getAiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
  console.warn("Gemini API key not found. AI features will be disabled.");
  return null;
};

export const generateDescription = async (pet: Omit<Pet, 'id'>): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return `This is a ${pet.gender} ${pet.color} ${pet.breed}. ${pet.status === PetStatus.Lost ? 'Last seen' : 'Found'} near ${pet.location}.`;
  }
  
  const model = 'gemini-2.5-flash';

  const prompt = `
    Generate a heartfelt and descriptive alert for a ${pet.status.toLowerCase()} pet. Be concise but include key details. 
    The tone should be urgent but hopeful for a lost pet, and caring and informative for a found pet.
    Do not use markdown. Output only the description text.

    Details:
    - Status: ${pet.status}
    - Name: ${pet.name || 'not known'}
    - Species: ${pet.species}
    - Breed: ${pet.breed}
    - Color: ${pet.color}
    - Age: ${pet.age}
    - Gender: ${pet.gender}
    - Microchipped: ${pet.isMicrochipped ? 'Yes' : 'No'}
    - Location: ${pet.location}
    - Date: ${pet.date}
    - Existing Description: ${pet.description}

    Combine these details into a compelling paragraph. For example, mention distinctive markings if provided in the existing description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate description from AI.");
  }
};