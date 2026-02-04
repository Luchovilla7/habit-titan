
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsight = async (userStats: any, habits: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: Una aplicación de seguimiento de hábitos de alto rendimiento llamada TITAN. 
      Estadísticas del usuario: XP ${userStats.xp}, Nivel ${userStats.level}, Rango ${userStats.rank}.
      Hábitos activos: ${habits.map((h: any) => h.name).join(', ')}.
      Tarea: Actúa como un "Comandante IA". Dale al usuario un consejo breve de 2 frases altamente motivador y con tono masculino para su día basado en estas estadísticas. Responde SIEMPRE en español. Mantén un tono firme, directo y estratégico.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error de Gemini:", error);
    return "El camino a la grandeza se forja en la disciplina. Sigue avanzando, Titán.";
  }
};

export const getWeeklyReview = async (history: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este historial semanal de hábitos: ${JSON.stringify(history)}. 
      Proporciona una revisión táctica breve en 3 puntos clave sobre qué pueden mejorar. Responde en español. Formatea como un instructor de élite o coach de alto rendimiento.`,
    });
    return response.text;
  } catch (error) {
    return "La consistencia es tu único objetivo. Elimina las excusas.";
  }
};
