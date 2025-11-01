import { GoogleGenAI } from "@google/genai";
import { Pet, PetStatus } from "../types";

const GEMINI_API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
} else {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

export const generateDescription = async (pet: Omit<Pet, 'id'>): Promise<string> => {
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
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate description from AI.");
  }
};