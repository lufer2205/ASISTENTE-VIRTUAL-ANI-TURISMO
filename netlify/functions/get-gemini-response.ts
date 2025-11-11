import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../../src/constants";

// This interface must match the one used by the frontend
interface Message {
  role: 'user' | 'model';
  text: string;
}

interface RequestBody {
    messages: Message[];
}

// Netlify function handler
export const handler = async (event: { body: string }) => {
  // Only allow POST requests for security
  // Note: Netlify's `handler` type doesn't include httpMethod, but it's good practice.
  // We will rely on the function being called correctly.

  try {
    const { messages } = JSON.parse(event.body) as RequestBody;

    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set on Netlify.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Rebuild the history for the Chat SDK.
    // The history should be an array of { role, parts: [{ text }] }.
    // We take all messages except the very last one, which is the new user prompt.
    const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
        throw new Error("No valid user message found to send.");
    }

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history,
    });
    
    const result = await chat.sendMessage({ message: lastMessage.text });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.text }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to get response from Gemini. Details: ${errorMessage}` }),
    };
  }
};
