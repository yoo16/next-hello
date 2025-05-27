import { GoogleGenerativeAI, } from '@google/generative-ai';

import { ROLE_BOT } from '@/app/constants/roles';
import { Message } from '@/app/interfaces/Message';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

export async function sendToGemini(
    userMessage: Message
): Promise<Message> {
    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = userMessage.content.trim();
    const result = await model.generateContent(prompt);
    const text = result.response.text().replaceAll('*', '\n');

    if (!text) {
        throw new Error('No response from Gemini');
    }

    return {
        role: ROLE_BOT,
        content: text,
    };
}
