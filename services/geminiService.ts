import { GoogleGenAI, Type } from "@google/genai";
import { MemeContent } from "../types";

// Initialize the Gemini API client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the text content (caption and image prompt) for the meme.
 * Uses gemini-2.5-flash for speed and JSON structure.
 */
export const generateMemeText = async (topic: string): Promise<MemeContent> => {
  const systemInstruction = `
    You are a world-class comedian AI known for dry wit, sarcasm, and self-deprecating humor. 
    Your goal is to create a meme based on the user's input.
    
    1. The caption should be punchy, relatable, and funny. Standard meme formats (e.g., "Me vs. The Guy she told you not to worry about", "Nobody: ... Me:", etc.) are welcome but keep it fresh.
    2. The imagePrompt must be a descriptive visual scene that matches the caption perfectly. It should be suitable for an image generation model.
    3. Be edgy but avoid hate speech or explicitly NSFW content.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a meme about: "${topic}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description: "The text that goes on the meme image.",
            },
            imagePrompt: {
              type: Type.STRING,
              description: "A detailed description of the visual scene for an image generator.",
            },
            humorExplanation: {
                type: Type.STRING,
                description: "A short, sarcastic remark about why this is funny."
            }
          },
          required: ["caption", "imagePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini.");

    const parsed = JSON.parse(text);
    return parsed as MemeContent;
  } catch (error) {
    console.error("Error generating meme text:", error);
    throw new Error("Failed to come up with a joke. I guess I'm not funny today.");
  }
};

/**
 * Generates the image for the meme using gemini-2.5-flash-image.
 */
export const generateMemeImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Iterate through parts to find the inline image data
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error generating meme image:", error);
    throw new Error("Failed to paint the picture. Use your imagination.");
  }
};