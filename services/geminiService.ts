
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsight = async (userStats: any, habits: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: Una aplicación de seguimiento de hábitos de alto rendimiento llamada TITAN. 
      Estadísticas del usuario: XP ${userStats.xp}, Nivel ${userStats.level}, Rango ${userStats.rank}.
      Hábitos activos: ${habits.map((h: any) => h.name).join(', ')}.
      
      Instrucciones: Actúa como el "Comandante IA", un instructor de fuerzas especiales enfocado en la productividad extrema. 
      Tarea: Dale al usuario una orden motivacional breve (máximo 2 frases). 
      Tono: Firme, autoritario, sin rodeos, masculino, táctico.
      Reglas: 
      - SIEMPRE en español.
      - Usa jerga militar/táctica (objetivo, misión, despliegue, disciplina).
      - No seas genérico. Menciona sus hábitos o su rango si es posible.
      - Nada de "puedes hacerlo", mejor un "hazlo".`,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error de Gemini:", error);
    return "La disciplina es el único camino. Ejecuta tu misión sin excusas.";
  }
};

export const getWeeklyReview = async (history: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este historial semanal de hábitos: ${JSON.stringify(history)}. 
      Proporciona un reporte de daños y mejoras en 3 puntos breves. 
      Tono: Instructor de élite. Sé duro pero estratégico. Responde en español.`,
    });
    return response.text;
  } catch (error) {
    return "La consistencia es tu único objetivo. Elimina las excusas.";
  }
};
