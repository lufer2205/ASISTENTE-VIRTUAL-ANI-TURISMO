import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;

const getGoogleAI = (): GoogleGenAI => {
    if (!ai) {
        if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set or accessible");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const startChat = (): Chat => {
    const googleAI = getGoogleAI();
    return googleAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
};