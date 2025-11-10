// src/services/geminiService.ts
import { Message } from '../types';

// Ya no inicializamos el chat aquí. Solo hacemos la llamada a nuestra función.
export const fetchGeminiResponse = async (currentMessages: Message[]): Promise<string> => {
    try {
        const response = await fetch('/.netlify/functions/get-gemini-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: currentMessages }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        throw new Error("No se pudo obtener una respuesta. Inténtalo de nuevo.");
    }
};
