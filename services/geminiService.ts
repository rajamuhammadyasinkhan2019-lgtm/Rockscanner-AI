
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AppMode, UserTier, BasinContext } from "../types";

export const analyzeGeologicalSample = async (
  imageData: string,
  mode: AppMode,
  tier: UserTier,
  basin: BasinContext
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemPrompt = `
    You are an expert PhD Geologist specializing in regional tectonics and petrography. 
    Current Mode: ${mode} (Field = Macro view, Lab = Thin section)
    User Level: ${tier}
    Geological Basin Context: ${basin}
    
    Analyze the provided image and return a JSON response with high scientific accuracy.
    For ${tier === 'STUDENT' ? 'Student' : 'Researcher'} tier, provide appropriate depth.
    Include basin-specific nuances for ${basin} (e.g., Indus/Swat specific mineralogy).
    Detect if the object is a fossil and check for authenticity.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: systemPrompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageData.split(',')[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identification: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          type: { type: Type.STRING },
          mineralogy: { type: Type.ARRAY, items: { type: Type.STRING } },
          texture: { type: Type.STRING },
          provenance: {
            type: Type.OBJECT,
            properties: {
              rounding: { type: Type.STRING },
              transportDistance: { type: Type.STRING },
              basinSource: { type: Type.STRING }
            }
          },
          physicalProperties: {
            type: Type.OBJECT,
            properties: {
              hardness: { type: Type.STRING },
              specificGravity: { type: Type.STRING },
              grainSize: { type: Type.STRING }
            }
          },
          geologicalAge: { type: Type.STRING },
          stratigraphicContext: { type: Type.STRING },
          educationalNote: { type: Type.STRING },
          professionalInsight: { type: Type.STRING },
          isFossil: { type: Type.BOOLEAN },
          fossilAuthenticity: { type: Type.NUMBER }
        },
        required: ["identification", "confidence", "type", "mineralogy", "texture", "physicalProperties", "geologicalAge", "isFossil"]
      },
    },
  });

  return JSON.parse(response.text || '{}');
};
