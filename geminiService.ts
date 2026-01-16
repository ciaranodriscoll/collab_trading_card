
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CardData, GeneratedCardData } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function buildPrompt(data: CardData): string {
  return `
    Create assets for a trading card with a "High Fantasy Digital Sorcery" theme, in an epic, painterly Dungeons and Dragons concept art style.
    The card is for a researcher named ${data.name}.
    
    Researcher's Profile:
    - Skills: "I am an expert in ${data.skills}"
    - Current Question: "I am currently trying to solve ${data.question}"
    - Collaboration Need: "I need someone who understands ${data.missingPiece} to make this work."

    Based on this profile, generate two things:

    1.  A CHARACTER PORTRAIT: A visually stunning, epic portrait that reflects their skills and quest.
        - The character's appearance MUST BE ANDROGYNOUS and should be a creature. 
        - The image should have a dark, mystical, and scholarly feel, but with high fantasy elements like magical glows, ancient artifacts, or intricate, flowing robes. The character should look intelligent and powerful.
        - The character will ideally not be human.
        - Do NOT include any text, borders, or card elements on the image itself. Just the character portrait.

    2.  A FANTASY CLASS: A fitting fantasy class title based on the profile.
        - Example Class: "Cognitive Sorcerer" or "Data Weaver"
        - This should be creative and relevant to the researcher's profile.

    The response MUST have one image part (the portrait) and one text part. The text part should contain ONLY the fantasy class title and nothing else.
  `;
}

export const generateCardDetails = async (data: CardData): Promise<GeneratedCardData> => {
  const prompt = buildPrompt(data);
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ],
      },
    });

    let imageUrl = '';
    let characterClass = 'Adventurer';
    
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64String}`;
        } else if (part.text) {
          const potentialClass = part.text.trim();
          if (potentialClass) {
            // Remove any markdown like backticks
            characterClass = potentialClass.replace(/`/g, '');
          }
        }
      }
    }

    if (!imageUrl) {
        throw new Error("The AI did not return an image. The void is silent.");
    }

    return { characterClass, imageUrl };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The connection to the generative plane has been severed.");
  }
};
