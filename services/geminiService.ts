
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `You are an expert in Animal Type Classification (ATC) for dairy farming, specializing in Indian cattle and buffalo breeds. Your task is to analyze an image of an animal and provide a detailed classification report.

Based on the provided image, evaluate the animal's physical traits. Extract and quantify body structure parameters and generate objective classification scores.

Return ONLY a valid JSON object based on the provided schema. Do not include any markdown formatting like \`\`\`json.`;

const schema = {
  type: Type.OBJECT,
  properties: {
    breed: {
      type: Type.STRING,
      description: 'The predicted breed of the animal (e.g., Gir, Sahiwal, Murrah).'
    },
    overall_score: {
      type: Type.NUMBER,
      description: 'An overall classification score for the animal out of 100.'
    },
    longevity_prediction: {
      type: Type.STRING,
      description: 'A brief prediction of the animal\'s longevity (e.g., High, Medium, Low).'
    },
    productivity_prediction: {
      type: Type.STRING,
      description: 'A brief prediction of the animal\'s milk productivity (e.g., High, Medium, Low).'
    },
    reproductive_efficiency: {
      type: Type.STRING,
      description: 'A brief assessment of the animal\'s reproductive efficiency (e.g., Excellent, Good, Average).'
    },
    traits: {
      type: Type.ARRAY,
      description: 'A list of scores for specific physical traits.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: 'The name of the physical trait.'
          },
          score: {
            type: Type.NUMBER,
            description: 'The score for this trait out of 10.'
          },
          description: {
            type: Type.STRING,
            description: 'A brief description of the evaluation for this trait.'
          },
        },
        required: ['name', 'score', 'description'],
      },
    },
    recommendations: {
      type: Type.STRING,
      description: 'Overall recommendations for breeding or management based on the classification.'
    }
  },
  required: ['breed', 'overall_score', 'longevity_prediction', 'productivity_prediction', 'reproductive_efficiency', 'traits', 'recommendations'],
};


export const analyzeAnimalImage = async (base64Image: string, mimeType: string): Promise<AnalysisReport> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.2,
    },
  });

  const jsonText = response.text.trim();
  
  try {
    const result: AnalysisReport = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", jsonText);
    throw new Error("Received an invalid format from the analysis service.");
  }
};
