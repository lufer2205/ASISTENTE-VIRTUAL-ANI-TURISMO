// src/services/geminiService.ts
import { Message } from '../types';

/**
 * Llama a la función serverless de Netlify para obtener una respuesta de Gemini.
 * @param currentMessages El historial completo de la conversación actual.
 * @returns La respuesta de texto del modelo.
 */
export const fetchGeminiResponse = async (currentMessages: Message[]): Promise<string> => {
    try {
        // La URL apunta a la función que crearemos en el backend de Netlify.
        const response = await fetch('/.netlify/functions/get-gemini-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Enviamos el historial de mensajes para que la función tenga contexto.
            body: JSON.stringify({ messages: currentMessages }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Lanza un error que será capturado por el componente del chat.
            throw new Error(errorData.error || 'La respuesta de la red no fue exitosa.');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error al obtener la respuesta de Gemini:", error);
        // Propaga un error amigable para el usuario.
        throw new Error("No se pudo obtener una respuesta. Por favor, inténtalo de nuevo.");
    }
};
