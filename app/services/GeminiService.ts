import {
    GoogleGenerativeAI,
    Content,
    HarmCategory,
    HarmBlockThreshold,
    StartChatParams,
} from '@google/generative-ai';

import { Message } from '@/app/interfaces/Message';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1024,
};
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

// 履歴は必要に応じて外部から注入するか、サービス内で管理してください
const history: Content[] = [];

export async function sendToGemini(
    userMessage: Message
): Promise<Message> {
    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const params: StartChatParams = {
        history,
        generationConfig,
        safetySettings,
    };

    const chat = model.startChat(params);
    const result = await chat.sendMessage(userMessage.content);
    const text = result.response.text().replaceAll('*', '\n');

    if (!text) {
        throw new Error('No response from Gemini');
    }
    // 任意：会話履歴にユーザー→ボットを追加
    // history.push({ text: userMessage.content });
    // history.push({ text });

    return {
        role: "bot",
        content: text,
    };
}
