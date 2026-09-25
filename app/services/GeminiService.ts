import {
    GoogleGenAI,
    Modality,
} from '@google/genai';

import { Message } from '@/app/interfaces/Message';
import { fileToBase64, saveImage, uploadImageInfo } from '@/app/repositories/ImageRepository';
import { saveWaveFile } from '../repositories/AudioRepository';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";
const IMAGEN_MODEL = process.env.GEMINI_IMAGEN_MODEL || "imagen-3.0-generate-002";
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";

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
        model: MODEL,
        config: { maxOutputTokens: 4096 },
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
                { text: "落とし物です。この写真の内容を説明してください。" },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model: MODEL,
        config: { maxOutputTokens: 4096 },
        contents,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return text;
}

export async function generateImage(text: string) {
    // 画像生成のためのプロンプトを作成
    const prompt = `次のキーワードで画像生成して。画像内に文字、サイン、説明書きなどは一切含めないで。\n\nキーワード: ${text}`;

    // GeminiAPIにリクエストを送信
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: prompt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE]
        },
    });

    // レスポンスから画像データを取得
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) return "";

    // // ファイルパスとURLを取得し、画像ファイルをサーバ保存
    const { filePath, url } = uploadImageInfo();
    for (const part of parts) {
        if (part.inlineData?.data) {
            await saveImage(filePath, part.inlineData.data);
            return url;
        }
    }
    return "";
}

export async function generateImageForImagen(text: string) {
    // 画像生成のためのプロンプトを作成
    const prompt = `次のキーワードで画像生成して。画像内に文字、サイン、説明書きなどは一切含めないで。\n\nキーワード: ${text}`;

    // const model = "gemini-2.0-flash-preview-image-generation";
    // GeminiAPIにリクエストを送信
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: prompt,
        config: {
            numberOfImages: 1,
        },
    });
    console.log("Response from Gemini:", response);
    if (!response.generatedImages || response.generatedImages.length === 0) {
        console.error("No images generated");
        return "";
    }
    const { filePath, url } = uploadImageInfo();
    for (const generatedImage of response.generatedImages) {
        const image = generatedImage.image?.imageBytes;
        if (image) {
            await saveImage(filePath, image)
        }
    }
    return url;
}

export async function generateAudio() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) {
        console.error("No audio data received from Gemini");
        return;
    }
    const audioBuffer = Buffer.from(data, 'base64');
    const fileName = 'output.wav';
    await saveWaveFile(fileName, audioBuffer);
}