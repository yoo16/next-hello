import {
    GoogleGenAI,
    Modality,
} from '@google/genai';

import { Message } from '@/app/interfaces/Message';
import { fileToBase64, saveImage, uploadImageInfo } from '@/app/repositories/ImageRepository';

const API_KEY = process.env.GEMINI_API_KEY;

export async function sendToGemini(userMessage: Message): Promise<string> {
    const prompt = `つぎの質問に答えて。\n\n${userMessage.content}`;
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const contents = [
        {
            role: "user",
            parts: [{ text: prompt }],
        },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: { maxOutputTokens: 1024 },
        contents,
    });

    const botMessage = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return botMessage;
}

/**
 * 画像を Gemini に送って内容を説明させる
 * @param imagePath - サーバ上の画像ファイルのパス
 */
export async function whatsImage(file: File): Promise<string> {
    const { base64, mimeType } = await fileToBase64(file);

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const contents = [
        {
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data: base64,
                    },
                },
                { text: "添付した画像について説明して。" },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: { maxOutputTokens: 1024 },
        contents,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return text;
}

export async function generateImage(text: string): Promise<string> {
    // ファイルパスとURLを生成
    const { filePath, url } = uploadImageInfo();

    // GeminiAPIにリクエストを送信
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: `次の内容の画像を生成（文字なし）\n\n${text}`,
        config: { 
            responseModalities: [Modality.TEXT, Modality.IMAGE]
        },
    });

    // レスポンスから画像データを取得し、ファイルに保存
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) return "";
    for (const part of parts) {
        if (part.inlineData?.data) {
            await saveImage(filePath, part.inlineData.data);
            return url;
        }
    }
    return "";
}