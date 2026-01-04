import { GoogleGenAI } from "@google/genai";

export const generatePharmaResponse = async (prompt: string, context: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key no encontrada. Por favor configure process.env.API_KEY.";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Using gemini-3-flash-preview for fast, text-based responses suitable for a tool
    const model = 'gemini-3-flash-preview';

    const systemInstruction = `Eres "Pharmabot", un asistente experto en farmacología para un sistema de gestión de farmacia llamado PHARMACLIC.
    Tu objetivo es ayudar al farmacéutico con dudas sobre medicamentos, interacciones, regulaciones de COFEPRIS (México) y consejos de gestión.
    Responde de manera concisa, profesional y usa formato Markdown.
    Si te preguntan sobre inventario, usa el contexto proporcionado en formato JSON.
    ADVERTENCIA: Siempre recuerda que eres una IA y no un médico. Sugiere siempre consultar a un especialista para diagnósticos.`;

    const fullPrompt = `Contexto del Inventario (Resumen): ${context}\n\nPregunta del usuario: ${prompt}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al conectar con el asistente de IA. Verifica tu conexión o intenta más tarde.";
  }
};