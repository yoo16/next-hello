import { GoogleGenerativeAI } from '@google/generative-ai';

import { ROLE_BOT } from '@/app/constants/roles';
import { Message } from '@/app/interfaces/Message';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1024,
};

export async function sendToGemini(
    userMessage: Message
): Promise<Message> {
    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    model.generationConfig = generationConfig;

    const prompt = `つぎの質問に答えて。\n\n${userMessage.content}`;
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

/**
 * 画像を Base64 に変換し、Gemini に送って内容を説明させる
 * @param imagePath - サーバ上の画像ファイルのパス（例: "./public/uploads/image.png"）
 */
export async function whatsImage(imageFile: File): Promise<string> {
    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');

    // GoogleGenerativeAIインスタンス
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL});
    model.generationConfig = generationConfig;

    // リクエストボディから画像パスを取得
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // プロンプト
    const prompt = "添付した画像について説明して。";
    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: imageFile.type,
                            data: base64Image,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
        ],
    });
    // レスポンスからテキストデータを取得
    const text = result.response.text();
    return text;
}