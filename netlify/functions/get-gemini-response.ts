// netlify/functions/get-gemini-response.ts
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../../src/constants"; // Importamos desde la carpeta src

// Esta interfaz debe coincidir con la que usa el frontend
interface Message {
  role: 'user' | 'model';
  text: string;
}

export const handler = async (event: { body: string }) => {
  // Solo permitimos peticiones POST
  // if (event.httpMethod !== 'POST') {
  //   return { statusCode: 405, body: 'Method Not Allowed' };
  // }

  try {
    const { messages } = JSON.parse(event.body) as { messages: Message[] };

    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extraemos el historial del usuario. Excluimos el último mensaje del modelo
    // para que la conversación fluya correctamente.
    const history = messages
        .filter(m => m.role !== 'model' || m.text.includes('Hola! 👋'))
        .map(m => ({
            role: m.role,
            parts: [{ text: m.text }],
        }));
    
    const lastMessage = history.pop(); // El último mensaje es el que vamos a enviar

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history,
    });

    if (!lastMessage) {
        throw new Error("No user message found to send.");
    }
    
    const result = await chat.sendMessage({ message: lastMessage.parts[0].text });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.text }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from Gemini." }),
    };
  }
};
